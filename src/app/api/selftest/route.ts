import { NextResponse } from "next/server";
import { course } from "@/content/course";
import { validate } from "@/lib/validate";
import type { Lang } from "@/lib/types";

/**
 * Content self-test (development only).
 *
 * Runs every published solution against its own checks, in both languages. If a
 * solution does not pass its exercise, the content is wrong — not the student.
 * Also flags starter code that would pass on its own.
 *
 *   GET /api/selftest
 */
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not available" }, { status: 404 });
  }

  const failures: Array<Record<string, unknown>> = [];
  let checked = 0;

  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      for (const lang of ["es", "en"] as Lang[]) {
        checked++;
        const solution = lesson.exercise.solution[lang];
        const starter = lesson.exercise.starter[lang];

        const solved = validate(solution, lesson.exercise.checks, starter);
        if (!solved.passed) {
          failures.push({
            lesson: lesson.id,
            lang,
            problem: "solution does not pass its own checks",
            failing: solved.results
              .filter((r) => !r.passed && !r.optional)
              .map((r) => r.id),
          });
        }

        // The starter must NOT already satisfy the exercise.
        const fromStarter = validate(starter, lesson.exercise.checks, undefined);
        if (fromStarter.passed) {
          failures.push({
            lesson: lesson.id,
            lang,
            problem: "starter code already passes every check",
          });
        }

        // Three hints, all present.
        if (lesson.exercise.hints.filter((h) => h[lang]?.trim()).length !== 3) {
          failures.push({ lesson: lesson.id, lang, problem: "missing hints" });
        }
      }

      // Every diagram referenced must exist in the registry.
      const diagramIds = lesson.theory
        .filter((b) => b.type === "diagram")
        .map((b) => (b as { id: string }).id);
      if (diagramIds.length === 0) {
        failures.push({ lesson: lesson.id, problem: "no diagram in theory" });
      }
    }
  }

  return NextResponse.json({
    checked,
    ok: failures.length === 0,
    failures,
  });
}
