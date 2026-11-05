import { NextResponse } from "next/server";
import {
  getSnapshot,
  type Store,
  patchChallenge,
  patchLesson,
  recordExercise,
  recordQuiz,
  resetAll,
  resetModule,
  saveDraft,
} from "@/lib/db";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/** The signed-in user's store, or null: progress is never reachable without a session. */
async function userStore(): Promise<Store | null> {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  return user ? { sb, userId: user.id } : null;
}

const unauthorized = () => NextResponse.json({ error: "unauthorized" }, { status: 401 });

export async function GET() {
  const store = await userStore();
  if (!store) return unauthorized();
  try {
    return NextResponse.json(await getSnapshot(store));
  } catch (err) {
    // An error, not an empty snapshot: the client must not read it as "no progress".
    console.error("progress GET failed", err);
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const store = await userStore();
  if (!store) return unauthorized();
  const body = (await req.json().catch(() => null)) as any;
  if (!body?.action) {
    return NextResponse.json({ error: "missing action" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "theory":
        await patchLesson(store, {
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          theoryDone: true,
        });
        break;

      case "quiz":
        await recordQuiz(
          store,
          body.lessonId,
          body.moduleId,
          body.answers ?? [],
          body.score ?? 0,
          body.total ?? 0,
        );
        await patchLesson(store, {
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          quizDone: Boolean(body.passed),
          quizScore: body.score ?? null,
          quizTotal: body.total ?? null,
        });
        break;

      case "exercise":
        await recordExercise(store, {
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          componentId: body.componentId ?? null,
          code: body.code ?? "",
          passed: Boolean(body.passed),
          hintsUsed: body.hintsUsed ?? 0,
          results: body.results ?? null,
        });
        await saveDraft(
          store,
          body.componentId ? `${body.lessonId}::${body.componentId}` : body.lessonId,
          body.lessonId,
          body.componentId ?? null,
          body.code ?? "",
        );
        if (body.passed) {
          await patchLesson(store, {
            lessonId: body.lessonId,
            moduleId: body.moduleId,
            exerciseDone: true,
          });
        }
        break;

      case "draft":
        await saveDraft(store, body.key, body.lessonId, body.componentId ?? null, body.code ?? "");
        break;

      case "challenge":
        await patchChallenge(store, {
          challengeId: body.challengeId,
          status: body.status,
          passedComponents: body.passedComponents,
          hintsUsed: body.hintsUsed,
        });
        break;

      // First sync after signing in on a device: the client sends what it knew
      // that the server did not. Only "done" flags and better scores are sent,
      // so a merge can add progress but never erase it.
      case "merge": {
        for (const l of (body.lessons ?? []) as Array<Record<string, any>>) {
          if (typeof l?.lessonId !== "string" || typeof l?.moduleId !== "string") continue;
          await patchLesson(store, {
            lessonId: l.lessonId,
            moduleId: l.moduleId,
            theoryDone: l.theoryDone ? true : undefined,
            quizDone: l.quizDone ? true : undefined,
            exerciseDone: l.exerciseDone ? true : undefined,
            quizScore: typeof l.quizScore === "number" ? l.quizScore : undefined,
            quizTotal: typeof l.quizTotal === "number" ? l.quizTotal : undefined,
          });
        }
        for (const c of (body.challenges ?? []) as Array<Record<string, any>>) {
          if (typeof c?.challengeId !== "string") continue;
          await patchChallenge(store, {
            challengeId: c.challengeId,
            status: c.status,
            passedComponents: Array.isArray(c.passedComponents) ? c.passedComponents : undefined,
            hintsUsed: typeof c.hintsUsed === "number" ? c.hintsUsed : undefined,
          });
        }
        for (const [key, code] of Object.entries((body.drafts ?? {}) as Record<string, unknown>)) {
          if (typeof code !== "string") continue;
          const [lessonId, componentId] = key.split("::");
          await saveDraft(store, key, lessonId, componentId ?? null, code);
        }
        break;
      }

      case "reset":
        await resetAll(store);
        break;

      case "resetModule": {
        if (typeof body.moduleId !== "string") {
          return NextResponse.json({ error: "moduleId required" }, { status: 400 });
        }
        await resetModule(store, body.moduleId);
        break;
      }

      default:
        return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("progress POST failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
