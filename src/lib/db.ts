/**
 * Storage layer.
 *
 * With DATABASE_URL set (Neon via the Vercel Marketplace) everything is
 * persisted in Postgres. Without it — e.g. a fresh local clone — we fall back
 * to a JSON file under .data/ so the course is fully usable before any database
 * exists. The API surface is identical either way.
 */
import fs from "node:fs";
import path from "node:path";
import type { LessonStatus, ProgressSnapshot } from "./types";

export const usingNeon = Boolean(process.env.DATABASE_URL);

/* ------------------------------ Neon client ------------------------------- */

type SqlFn = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<any[]>;
let _sql: SqlFn | null = null;

async function sql(): Promise<SqlFn> {
  if (_sql) return _sql;
  const { neon } = await import("@neondatabase/serverless");
  _sql = neon(process.env.DATABASE_URL!) as unknown as SqlFn;
  return _sql;
}

/* ------------------------------ File fallback ----------------------------- */

interface FileShape extends ProgressSnapshot {
  quizAttempts: Array<Record<string, unknown>>;
  exerciseAttempts: Array<Record<string, unknown>>;
}

const FILE = path.join(process.cwd(), ".data", "apex-progress.json");

function emptyFile(): FileShape {
  return { lessons: {}, drafts: {}, challenges: {}, quizAttempts: [], exerciseAttempts: [] };
}

function readFile(): FileShape {
  try {
    return { ...emptyFile(), ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
  } catch {
    return emptyFile();
  }
}

function writeFile(data: FileShape) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    /* read-only FS (e.g. serverless without a DB) — progress stays client-side */
  }
}

/* ------------------------------- Public API -------------------------------- */

export async function getSnapshot(): Promise<ProgressSnapshot> {
  if (!usingNeon) {
    const f = readFile();
    return { lessons: f.lessons, drafts: f.drafts, challenges: f.challenges };
  }
  const q = await sql();
  const [lessons, drafts, challenges] = await Promise.all([
    q`SELECT * FROM lesson_progress`,
    q`SELECT draft_key, code FROM code_drafts`,
    q`SELECT * FROM challenge_progress`,
  ]);

  const snap: ProgressSnapshot = { lessons: {}, drafts: {}, challenges: {} };
  for (const r of lessons) {
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
  for (const r of drafts) snap.drafts[r.draft_key] = r.code;
  for (const r of challenges) {
    snap.challenges[r.challenge_id] = {
      status: r.status as LessonStatus,
      passedComponents: r.passed_components ?? [],
      hintsUsed: r.hints_used ?? 0,
    };
  }
  return snap;
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

export async function patchLesson(p: LessonPatch): Promise<void> {
  if (!usingNeon) {
    const f = readFile();
    const prev = f.lessons[p.lessonId] ?? {
      lessonId: p.lessonId,
      moduleId: p.moduleId,
      status: "not_started" as LessonStatus,
      theoryDone: false,
      quizDone: false,
      quizScore: null,
      quizTotal: null,
      exerciseDone: false,
    };
    const next = {
      ...prev,
      ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)),
    } as (typeof f.lessons)[string];
    next.status = deriveStatus(next.theoryDone, next.quizDone, next.exerciseDone);
    next.updatedAt = new Date().toISOString();
    f.lessons[p.lessonId] = next;
    writeFile(f);
    return;
  }

  const q = await sql();
  await q`
    INSERT INTO lesson_progress
      (lesson_id, module_id, status, theory_done, quiz_done, quiz_score, quiz_total, exercise_done, updated_at)
    VALUES (
      ${p.lessonId}, ${p.moduleId}, 'in_progress',
      ${p.theoryDone ?? false}, ${p.quizDone ?? false},
      ${p.quizScore ?? null}, ${p.quizTotal ?? null}, ${p.exerciseDone ?? false}, now())
    ON CONFLICT (lesson_id) DO UPDATE SET
      theory_done   = COALESCE(${p.theoryDone ?? null}::boolean, lesson_progress.theory_done),
      quiz_done     = COALESCE(${p.quizDone ?? null}::boolean, lesson_progress.quiz_done),
      quiz_score    = COALESCE(${p.quizScore ?? null}::int, lesson_progress.quiz_score),
      quiz_total    = COALESCE(${p.quizTotal ?? null}::int, lesson_progress.quiz_total),
      exercise_done = COALESCE(${p.exerciseDone ?? null}::boolean, lesson_progress.exercise_done),
      updated_at    = now()`;
  await q`
    UPDATE lesson_progress SET status = CASE
      WHEN theory_done AND quiz_done AND exercise_done THEN 'completed'
      ELSE 'in_progress' END
    WHERE lesson_id = ${p.lessonId}`;
}

function deriveStatus(theory: boolean, quiz: boolean, ex: boolean): LessonStatus {
  if (theory && quiz && ex) return "completed";
  if (theory || quiz || ex) return "in_progress";
  return "not_started";
}

export async function saveDraft(key: string, lessonId: string, componentId: string | null, code: string) {
  if (!usingNeon) {
    const f = readFile();
    f.drafts[key] = code;
    writeFile(f);
    return;
  }
  const q = await sql();
  await q`
    INSERT INTO code_drafts (draft_key, lesson_id, component_id, code, updated_at)
    VALUES (${key}, ${lessonId}, ${componentId}, ${code}, now())
    ON CONFLICT (draft_key) DO UPDATE SET code = ${code}, updated_at = now()`;
}

export async function recordQuiz(
  lessonId: string,
  moduleId: string,
  answers: Array<{ questionId: string; answer: unknown; correct: boolean }>,
  score: number,
  total: number,
) {
  if (!usingNeon) {
    const f = readFile();
    f.quizAttempts.push({ lessonId, moduleId, answers, score, total, createdAt: new Date().toISOString() });
    writeFile(f);
    return;
  }
  const q = await sql();
  for (const a of answers) {
    await q`
      INSERT INTO quiz_attempts (lesson_id, module_id, question_id, answer, correct)
      VALUES (${lessonId}, ${moduleId}, ${a.questionId}, ${JSON.stringify(a.answer)}, ${a.correct})`;
  }
  await q`
    INSERT INTO quiz_results (lesson_id, module_id, score, total)
    VALUES (${lessonId}, ${moduleId}, ${score}, ${total})`;
}

export async function recordExercise(a: {
  lessonId: string;
  moduleId: string;
  componentId?: string | null;
  code: string;
  passed: boolean;
  hintsUsed: number;
  results: unknown;
}) {
  if (!usingNeon) {
    const f = readFile();
    f.exerciseAttempts.push({ ...a, createdAt: new Date().toISOString() });
    writeFile(f);
    return;
  }
  const q = await sql();
  await q`
    INSERT INTO exercise_attempts
      (lesson_id, module_id, component_id, code, passed, hints_used, results)
    VALUES (${a.lessonId}, ${a.moduleId}, ${a.componentId ?? null}, ${a.code},
            ${a.passed}, ${a.hintsUsed}, ${JSON.stringify(a.results)})`;
}

export async function patchChallenge(p: {
  challengeId: string;
  status?: LessonStatus;
  passedComponents?: string[];
  hintsUsed?: number;
}) {
  if (!usingNeon) {
    const f = readFile();
    const prev = f.challenges[p.challengeId] ?? {
      status: "not_started" as LessonStatus,
      passedComponents: [],
      hintsUsed: 0,
    };
    f.challenges[p.challengeId] = {
      status: p.status ?? prev.status,
      passedComponents: p.passedComponents ?? prev.passedComponents,
      hintsUsed: p.hintsUsed ?? prev.hintsUsed,
    };
    writeFile(f);
    return;
  }
  const q = await sql();
  await q`
    INSERT INTO challenge_progress (challenge_id, status, passed_components, hints_used, updated_at)
    VALUES (${p.challengeId}, ${p.status ?? "in_progress"},
            ${p.passedComponents ?? []}, ${p.hintsUsed ?? 0}, now())
    ON CONFLICT (challenge_id) DO UPDATE SET
      status            = COALESCE(${p.status ?? null}, challenge_progress.status),
      passed_components = COALESCE(${p.passedComponents ?? null}::text[], challenge_progress.passed_components),
      hints_used        = GREATEST(challenge_progress.hints_used, ${p.hintsUsed ?? 0}),
      updated_at        = now()`;
}

/**
 * Wipe one module's progress and saved code, leaving every other module alone.
 * Used when a module's exercises change and the student wants a clean run.
 */
export async function resetModule(moduleId: string) {
  if (!usingNeon) {
    const f = readFile();
    const lessonIds = Object.values(f.lessons)
      .filter((l) => l.moduleId === moduleId)
      .map((l) => l.lessonId);
    for (const id of lessonIds) delete f.lessons[id];
    for (const key of Object.keys(f.drafts)) {
      if (lessonIds.some((id) => key.startsWith(id))) delete f.drafts[key];
    }
    f.quizAttempts = f.quizAttempts.filter((a) => a.moduleId !== moduleId);
    f.exerciseAttempts = f.exerciseAttempts.filter((a) => a.moduleId !== moduleId);
    writeFile(f);
    return;
  }
  const q = await sql();
  // code_drafts has no module_id, so its rows are found through the lesson ids
  // the other tables carry themselves.
  const rows = await q`SELECT DISTINCT lesson_id FROM exercise_attempts WHERE module_id = ${moduleId}`;
  const ids = rows.map((r: { lesson_id: string }) => r.lesson_id);
  if (ids.length) await q`DELETE FROM code_drafts WHERE lesson_id = ANY(${ids})`;
  await q`DELETE FROM quiz_attempts WHERE module_id = ${moduleId}`;
  await q`DELETE FROM quiz_results WHERE module_id = ${moduleId}`;
  await q`DELETE FROM exercise_attempts WHERE module_id = ${moduleId}`;
  await q`DELETE FROM lesson_progress WHERE module_id = ${moduleId}`;
}

export async function resetAll() {
  if (!usingNeon) {
    writeFile(emptyFile());
    return;
  }
  const q = await sql();
  await q`TRUNCATE lesson_progress, quiz_attempts, quiz_results, exercise_attempts, code_drafts, challenge_progress`;
}
