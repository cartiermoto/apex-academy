import { NextResponse } from "next/server";
import {
  getSnapshot,
  patchChallenge,
  patchLesson,
  recordExercise,
  recordQuiz,
  resetAll,
  saveDraft,
  usingNeon,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getSnapshot();
    return NextResponse.json(snapshot);
  } catch (err) {
    console.error("progress GET failed", err);
    return NextResponse.json({ lessons: {}, drafts: {}, challenges: {} });
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as any;
  if (!body?.action) {
    return NextResponse.json({ error: "missing action" }, { status: 400 });
  }

  try {
    switch (body.action) {
      case "theory":
        await patchLesson({
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          theoryDone: true,
        });
        break;

      case "quiz":
        await recordQuiz(
          body.lessonId,
          body.moduleId,
          body.answers ?? [],
          body.score ?? 0,
          body.total ?? 0,
        );
        await patchLesson({
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          quizDone: Boolean(body.passed),
          quizScore: body.score ?? null,
          quizTotal: body.total ?? null,
        });
        break;

      case "exercise":
        await recordExercise({
          lessonId: body.lessonId,
          moduleId: body.moduleId,
          componentId: body.componentId ?? null,
          code: body.code ?? "",
          passed: Boolean(body.passed),
          hintsUsed: body.hintsUsed ?? 0,
          results: body.results ?? null,
        });
        await saveDraft(
          body.componentId ? `${body.lessonId}::${body.componentId}` : body.lessonId,
          body.lessonId,
          body.componentId ?? null,
          body.code ?? "",
        );
        if (body.passed) {
          await patchLesson({
            lessonId: body.lessonId,
            moduleId: body.moduleId,
            exerciseDone: true,
          });
        }
        break;

      case "draft":
        await saveDraft(body.key, body.lessonId, body.componentId ?? null, body.code ?? "");
        break;

      case "challenge":
        await patchChallenge({
          challengeId: body.challengeId,
          status: body.status,
          passedComponents: body.passedComponents,
          hintsUsed: body.hintsUsed,
        });
        break;

      case "reset":
        await resetAll();
        break;

      default:
        return NextResponse.json({ error: "unknown action" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, store: usingNeon ? "neon" : "file" });
  } catch (err) {
    console.error("progress POST failed", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
