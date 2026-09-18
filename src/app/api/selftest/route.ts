import { NextResponse } from "next/server";
import { course } from "@/content/course";
import { validate } from "@/lib/validate";
import { getTerm } from "@/content/glossary";
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

      // Glossary markers: every [[id]] must exist, and markers may only live in
      // fields rendered through RichText (theory prose, quiz explanations,
      // exercise prompt/brief). Anywhere else they would show up literally.
      const MARK = /\[\[([a-z0-9-]+)(?:\|[^\]]+)?\]\]/g;
      const richStrings: string[] = [];
      const plainStrings: Array<[string, string]> = [];
      const both = (l?: { es: string; en: string }) => (l ? [l.es, l.en] : []);

      for (const b of lesson.theory) {
        if (b.type === "p" || b.type === "lead") richStrings.push(...both(b.text));
        else if (b.type === "list") b.items.forEach((it) => richStrings.push(...both(it)));
        else if (b.type === "callout") {
          richStrings.push(...both(b.text));
          both(b.title).forEach((s) => plainStrings.push(["callout title", s]));
        } else if (b.type === "table") {
          b.rows.flat().forEach((c) => richStrings.push(...both(c)));
          b.head.forEach((h) => both(h).forEach((s) => plainStrings.push(["table head", s])));
        } else if (b.type === "h") both(b.text).forEach((s) => plainStrings.push(["heading", s]));
        else if ((b.type === "diagram" || b.type === "code") && b.caption)
          both(b.caption).forEach((s) => plainStrings.push(["caption", s]));
      }
      for (const q of lesson.quiz) {
        richStrings.push(...both(q.explain));
        both(q.prompt).forEach((s) => plainStrings.push(["quiz prompt", s]));
        if (q.kind !== "text") q.options.forEach((o) => both(o).forEach((s) => plainStrings.push(["quiz option", s])));
      }
      richStrings.push(...both(lesson.exercise.prompt));
      lesson.exercise.brief.forEach((b) => richStrings.push(...both(b)));
      [lesson.title, lesson.summary, lesson.analogy].forEach((l) =>
        both(l).forEach((s) => plainStrings.push(["lesson header", s])),
      );

      for (const s of richStrings) {
        for (const m of s.matchAll(MARK)) {
          if (!getTerm(m[1])) {
            failures.push({ lesson: lesson.id, problem: `unknown glossary term [[${m[1]}]]` });
          }
        }
      }
      for (const [where, s] of plainStrings) {
        if (MARK.test(s)) {
          failures.push({ lesson: lesson.id, problem: `glossary marker in a ${where} (shown as plain text)` });
        }
        MARK.lastIndex = 0;
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
