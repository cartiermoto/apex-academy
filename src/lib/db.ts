/**
 * Storage layer: Supabase Postgres, one set of rows per account. It always runs
 * with the signed-in user's own client, so Row Level Security has the last word
 * (db/supabase/001_progress.sql).
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { LessonStatus, ProgressSnapshot } from "./types";

export interface Store {
  sb: SupabaseClient;
  userId: string;
}

/** supabase-js returns errors instead of throwing: make them fail loudly. */
function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export async function getSnapshot({ sb }: Store): Promise<ProgressSnapshot> {
  const [lessons, drafts, challenges, days] = await Promise.all([
    sb.from("lesson_progress").select("*"),
    sb.from("code_drafts").select("draft_key, code"),
    sb.from("challenge_progress").select("*"),
    sb.from("study_days").select("day"),
  ]);

  const snap: ProgressSnapshot = { lessons: {}, drafts: {}, challenges: {}, days: [] };
  // The streak must never take the rest of the progress down with it: if its
  // table is not there yet (db/supabase/002_study_days.sql not run), no days.
  if (!days.error) snap.days = (days.data ?? []).map((r) => String(r.day)).sort();
  for (const r of must(lessons) ?? []) {
    snap.lessons[r.lesson_id] = {
      lessonId: r.lesson_id,
      moduleId: r.module_id,
      status: r.status as LessonStatus,
      theoryDone: r.theory_done,
      quizDone: r.quiz_done,
      quizScore: r.quiz_score,
      quizTotal: r.quiz_total,
      exerciseDone: r.exercise_done,
      updatedAt: r.updated_at,
    };
  }
  for (const r of must(drafts) ?? []) snap.drafts[r.draft_key] = r.code;
  for (const r of must(challenges) ?? []) {
    snap.challenges[r.challenge_id] = {
      status: r.status as LessonStatus,
      passedComponents: r.passed_components ?? [],
      hintsUsed: r.hints_used ?? 0,
    };
  }
  return snap;
}

/** Records study days; days already recorded are left alone. */
export async function recordDays({ sb, userId }: Store, days: string[]) {
  if (!days.length) return;
  must(
    await sb
      .from("study_days")
      .upsert(days.map((day) => ({ user_id: userId, day })), { onConflict: "user_id,day", ignoreDuplicates: true }),
  );
}

export interface LessonPatch {
  lessonId: string;
  moduleId: string;
  theoryDone?: boolean;
  quizDone?: boolean;
  quizScore?: number | null;
  quizTotal?: number | null;
  exerciseDone?: boolean;
}

export async function patchLesson({ sb, userId }: Store, p: LessonPatch): Promise<void> {
  const prev = must(
    await sb
      .from("lesson_progress")
      .select("theory_done, quiz_done, quiz_score, quiz_total, exercise_done")
      .eq("lesson_id", p.lessonId)
      .maybeSingle(),
  );
  const theory = p.theoryDone ?? prev?.theory_done ?? false;
  const quiz = p.quizDone ?? prev?.quiz_done ?? false;
  const exercise = p.exerciseDone ?? prev?.exercise_done ?? false;
  must(
    await sb.from("lesson_progress").upsert({
      user_id: userId,
      lesson_id: p.lessonId,
      module_id: p.moduleId,
      status: theory && quiz && exercise ? "completed" : "in_progress",
      theory_done: theory,
      quiz_done: quiz,
      quiz_score: p.quizScore ?? prev?.quiz_score ?? null,
      quiz_total: p.quizTotal ?? prev?.quiz_total ?? null,
      exercise_done: exercise,
      updated_at: new Date().toISOString(),
    }),
  );
}

export async function saveDraft(
  { sb, userId }: Store,
  key: string,
  lessonId: string,
  componentId: string | null,
  code: string,
) {
  must(
    await sb.from("code_drafts").upsert({
      user_id: userId,
      draft_key: key,
      lesson_id: lessonId,
      component_id: componentId,
      code,
      updated_at: new Date().toISOString(),
    }),
  );
}

export async function recordQuiz(
  { sb, userId }: Store,
  lessonId: string,
  moduleId: string,
  answers: Array<{ questionId: string; answer: unknown; correct: boolean }>,
  score: number,
  total: number,
) {
  if (answers.length) {
    must(
      await sb.from("quiz_attempts").insert(
        answers.map((a) => ({
          user_id: userId,
          lesson_id: lessonId,
          module_id: moduleId,
          question_id: a.questionId,
          answer: a.answer ?? null,
          correct: a.correct,
        })),
      ),
    );
  }
  must(await sb.from("quiz_results").insert({ user_id: userId, lesson_id: lessonId, module_id: moduleId, score, total }));
}

export async function recordExercise(
  { sb, userId }: Store,
  a: {
    lessonId: string;
    moduleId: string;
    componentId?: string | null;
    code: string;
    passed: boolean;
    hintsUsed: number;
    results: unknown;
  },
) {
  must(
    await sb.from("exercise_attempts").insert({
      user_id: userId,
      lesson_id: a.lessonId,
      module_id: a.moduleId,
      component_id: a.componentId ?? null,
      code: a.code,
      passed: a.passed,
      hints_used: a.hintsUsed,
      results: a.results ?? null,
    }),
  );
}

export async function patchChallenge(
  { sb, userId }: Store,
  p: { challengeId: string; status?: LessonStatus; passedComponents?: string[]; hintsUsed?: number },
) {
  const prev = must(
    await sb
      .from("challenge_progress")
      .select("status, passed_components, hints_used")
      .eq("challenge_id", p.challengeId)
      .maybeSingle(),
  );
  must(
    await sb.from("challenge_progress").upsert({
      user_id: userId,
      challenge_id: p.challengeId,
      status: p.status ?? prev?.status ?? "in_progress",
      passed_components: p.passedComponents ?? prev?.passed_components ?? [],
      hints_used: Math.max(prev?.hints_used ?? 0, p.hintsUsed ?? 0),
      updated_at: new Date().toISOString(),
    }),
  );
}

/**
 * Wipe one module's progress and saved code, leaving every other module alone.
 * Used when a module's exercises change and the student wants a clean run.
 */
export async function resetModule({ sb }: Store, moduleId: string) {
  // code_drafts has no module_id, so its rows are found through the lesson ids
  // the other tables carry themselves.
  const [progress, attempts] = await Promise.all([
    sb.from("lesson_progress").select("lesson_id").eq("module_id", moduleId),
    sb.from("exercise_attempts").select("lesson_id").eq("module_id", moduleId),
  ]);
  const ids = [...new Set([...(must(progress) ?? []), ...(must(attempts) ?? [])].map((r) => r.lesson_id as string))];
  if (ids.length) must(await sb.from("code_drafts").delete().in("lesson_id", ids));
  for (const table of ["quiz_attempts", "quiz_results", "exercise_attempts", "lesson_progress"]) {
    must(await sb.from(table).delete().eq("module_id", moduleId));
  }
}

export async function resetAll({ sb, userId }: Store) {
  // Row Level Security already limits this to the user; the filter is required
  // by the API, which refuses a DELETE without one.
  for (const table of ["lesson_progress", "code_drafts", "challenge_progress", "quiz_attempts", "quiz_results", "exercise_attempts"]) {
    must(await sb.from(table).delete().eq("user_id", userId));
  }
  // Streak: separate so a missing table (script 002 not run yet) cannot fail the reset.
  await sb.from("study_days").delete().eq("user_id", userId);
}
