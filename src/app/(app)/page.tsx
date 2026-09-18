"use client";

import Link from "next/link";
import { course } from "@/content/course";
import { useProgress, useSettings } from "@/components/providers";
import { Mark } from "@/components/logo";
import { t, ui } from "@/lib/i18n";
import type { Lesson, LessonStatus, Module } from "@/lib/types";

function pct(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Spec sheet for the next lesson — the "technical data card" of the
 * editorial look. Rows are label / value, like a datasheet.
 */
function SpecCard({
  mod,
  lesson,
  status,
  quiz,
}: {
  mod: Module;
  lesson: Lesson;
  status: LessonStatus;
  quiz?: { score: number | null; total: number | null };
}) {
  const { lang } = useSettings();
  const statusLabel =
    status === "completed"
      ? t(ui.completed, lang)
      : status === "in_progress"
        ? t(ui.inProgress, lang)
        : t(ui.notStarted, lang);

  return (
    <Link
      href={`/m/${mod.id}/${lesson.slug}`}
      className="group block rounded-[10px] border border-line bg-surface shadow-[var(--shadow-pop)] transition duration-300 xl:rotate-[1.2deg] xl:hover:rotate-0"
    >
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <span className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-heading">
            <Mark size={16} className="text-[var(--c-bg)]" />
          </span>
          <span className="t-eyebrow whitespace-nowrap">
            {lang === "es" ? "Siguiente" : "Up next"} — M{mod.n}.{pad(lesson.n)}
          </span>
        </span>
        <span className="t-eyebrow whitespace-nowrap">
          <span className="hidden sm:inline">{lang === "es" ? "Lectura" : "Read"} · </span>
          {lesson.minutes} min
        </span>
      </div>

      {/* rows */}
      <div className="px-5">
        <div className="spec-row">
          <span className="t-eyebrow">{lang === "es" ? "Concepto" : "Concept"}</span>
          <span className="font-mono text-[0.86rem] text-heading">{t(lesson.title, lang)}</span>
        </div>
        {lesson.analogy && (
          <div className="spec-row">
            <span className="t-eyebrow">{lang === "es" ? "En Admin es" : "In Admin it is"}</span>
            <span className="font-mono text-[0.86rem] text-ink">{t(lesson.analogy, lang)}</span>
          </div>
        )}
        <div className="spec-row">
          <span className="t-eyebrow">{lang === "es" ? "Estado" : "Status"}</span>
          <span className="font-mono text-[0.86rem] text-ink">
            {statusLabel}
            {quiz?.score != null && quiz.total != null && (
              <span className="text-faint"> · quiz {quiz.score}/{quiz.total}</span>
            )}
          </span>
        </div>
      </div>

      {/* objectives, the "output" block */}
      <div className="mx-5 mb-5 mt-1 rounded-[8px] border border-line bg-bg px-4 py-3.5">
        <div className="flex items-center justify-between">
          <span className="t-eyebrow text-accent">
            ✓ {lang === "es" ? "Vas a poder" : "You will be able to"}
          </span>
          <span className="t-eyebrow">{lang === "es" ? "Objetivo" : "Goal"}</span>
        </div>
        <ol className="mt-3 space-y-2.5">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[0.75rem] leading-[1.6] text-faint">{pad(i + 1)}</span>
              <span className="t-small text-ink">{t(o, lang)}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* footer */}
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <span className="t-eyebrow">
          ↳ {t(ui.module, lang)} {mod.n} · {t(mod.title, lang)}
        </span>
        <span className="t-eyebrow text-brand transition group-hover:translate-x-0.5">
          {lang === "es" ? "Abrir" : "Open"} →
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { lang } = useSettings();
  const { snapshot } = useProgress();

  const statusOf = (id: string): LessonStatus =>
    snapshot.lessons[id]?.status ?? "not_started";

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneCount = allLessons.filter((l) => statusOf(l.id) === "completed").length;

  const moduleDone = (m: Module) =>
    m.lessons.length > 0 && m.lessons.every((l) => statusOf(l.id) === "completed");

  const pairs = course.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
  const nextUp = pairs.find(({ l }) => statusOf(l.id) !== "completed") ?? pairs[0];

  return (
    <main className="w-full">
      {/* ---------------------------------------------------------------- hero */}
      <section className="dot-grid border-b border-line">
        <div className="mx-auto grid w-full max-w-[1160px] gap-12 px-5 pt-12 pb-14 sm:px-8 sm:pt-16 lg:px-12 xl:grid-cols-[1.1fr_1fr] xl:items-center xl:gap-14 xl:pt-20 xl:pb-20">
          <div className="fade-in min-w-0">
            <p className="t-eyebrow">
              Apex · Salesforce · {lang === "es" ? "Curso personal" : "Personal course"}
            </p>

            <h1 className="t-hero mt-5">
              {lang === "es" ? (
                <>
                  <span className="block">De Admin</span>
                  <span className="block text-brand-deco">a desarrollador</span>
                  <span className="block text-faint">Apex.</span>
                </>
              ) : (
                <>
                  <span className="block">From Admin</span>
                  <span className="block text-brand-deco">to Apex</span>
                  <span className="block text-faint">developer.</span>
                </>
              )}
            </h1>

            <p className="t-eyebrow mt-7 flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 bg-accent" />
              <span>
                {course.modules.length} {lang === "es" ? "módulos" : "modules"} ·{" "}
                {course.challenges.length} {lang === "es" ? "desafíos" : "challenges"} · ES / EN
              </span>
            </p>

            <p className="lead mt-6 max-w-[52ch]">
              {lang === "es"
                ? "Cada concepto se explica desde algo que ya configuraste con clicks, y nunca se te pide escribir nada que no se haya explicado antes."
                : "Every concept starts from something you already configured with clicks, and you are never asked to write anything that has not been explained first."}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {nextUp && (
                <Link
                  href={`/m/${nextUp.m.id}/${nextUp.l.slug}`}
                  className="btn btn-primary btn-mono"
                >
                  {doneCount === 0 ? t(ui.startCourse, lang) : t(ui.continueLearning, lang)}
                  <span aria-hidden>→</span>
                </Link>
              )}
              <a href="#modulos" className="btn btn-ghost btn-mono">
                {lang === "es" ? "Ver módulos" : "See modules"}
              </a>
            </div>

            {allLessons.length > 0 && (
              <div className="mt-10 max-w-[440px]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="t-eyebrow">{t(ui.overallProgress, lang)}</span>
                  <span className="t-eyebrow tabular-nums">
                    {doneCount}/{allLessons.length} · {pct(doneCount, allLessons.length)}%
                  </span>
                </div>
                <div className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-brand transition-[width] duration-500"
                    style={{ width: `${pct(doneCount, allLessons.length)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {nextUp && (
            <div className="fade-in min-w-0">
              <SpecCard
                mod={nextUp.m}
                lesson={nextUp.l}
                status={statusOf(nextUp.l.id)}
                quiz={{
                  score: snapshot.lessons[nextUp.l.id]?.quizScore ?? null,
                  total: snapshot.lessons[nextUp.l.id]?.quizTotal ?? null,
                }}
              />
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1160px] px-5 sm:px-8 lg:px-12">
        {/* ---------------------------------------------------------- modules */}
        <section id="modulos" className="scroll-mt-20 pt-16">
          <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
            <h2 className="t-eyebrow text-heading">{t(ui.modules, lang)}</h2>
            <span className="t-eyebrow">
              {course.modules.filter((m) => m.status === "ready").length}/{course.modules.length}{" "}
              {lang === "es" ? "publicados" : "published"}
            </span>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {course.modules.map((m) => {
              const ready = m.status === "ready";
              const done = m.lessons.filter((l) => statusOf(l.id) === "completed").length;
              const complete = moduleDone(m);

              const inner = (
                <div
                  className={`group flex h-full flex-col rounded-[10px] border p-5 transition ${
                    ready
                      ? "border-line bg-surface hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                      : "border-dashed border-line-strong bg-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`font-mono text-[1.6rem] font-medium leading-none tracking-tight ${
                        ready ? "text-brand-deco" : "text-faint"
                      }`}
                    >
                      {pad(m.n)}
                    </span>
                    {complete ? (
                      <span className="t-eyebrow rounded-[4px] bg-brand-soft px-2 py-1 text-brand">
                        {t(ui.completed, lang)}
                      </span>
                    ) : ready ? (
                      <span className="t-eyebrow tabular-nums">
                        {done}/{m.lessons.length}
                      </span>
                    ) : (
                      <span className="t-eyebrow">{t(ui.planned, lang)}</span>
                    )}
                  </div>

                  <h3 className={`t-h3 mt-4 ${ready ? "" : "text-muted"}`}>{t(m.title, lang)}</h3>
                  <p className="t-small mt-1.5 text-muted">{t(m.subtitle, lang)}</p>

                  <div className="mt-auto pt-5">
                    {ready ? (
                      <div className="h-[3px] w-full overflow-hidden rounded-full bg-surface-2">
                        <div
                          className="h-full rounded-full bg-brand transition-[width] duration-500"
                          style={{ width: `${pct(done, m.lessons.length)}%` }}
                        />
                      </div>
                    ) : (
                      m.outline && (
                        <p className="t-eyebrow">
                          {m.outline.length} {lang === "es" ? "sub-lecciones" : "sub-lessons"}
                        </p>
                      )
                    )}
                  </div>
                </div>
              );

              return (
                <li key={m.id}>
                  {ready && m.lessons[0] ? (
                    <Link href={`/m/${m.id}/${m.lessons[0].slug}`} className="block h-full">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ------------------------------------------------------- challenges */}
        <section className="pt-16">
          <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-3">
            <h2 className="t-eyebrow text-heading">{t(ui.challenges, lang)}</h2>
            <span className="t-eyebrow text-accent">
              {lang === "es" ? "Proyectos con feedback" : "Projects with feedback"}
            </span>
          </div>

          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {course.challenges.map((c) => {
              const required = course.modules.find((m) => m.id === c.requires);
              const unlocked = required ? moduleDone(required) : false;
              const progress = snapshot.challenges[c.id];

              return (
                <li key={c.id}>
                  <Link href={`/c/${c.id}`} className="block h-full">
                    <div
                      className={`relative flex h-full flex-col overflow-hidden rounded-[10px] border p-6 transition ${
                        unlocked
                          ? "border-accent bg-accent-soft"
                          : "border-accent/40 bg-surface hover:border-accent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="t-eyebrow text-accent">
                          {t(ui.challenge, lang)} {pad(c.n)}
                        </span>
                        <span className="t-eyebrow flex items-center gap-1.5">
                          {unlocked ? (
                            progress?.status === "completed" ? (
                              t(ui.completed, lang)
                            ) : (
                              t(ui.ready, lang)
                            )
                          ) : (
                            <>
                              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="3.2" y="7" width="9.6" height="7" rx="1.6" />
                                <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
                              </svg>
                              {t(ui.locked, lang)}
                            </>
                          )}
                        </span>
                      </div>

                      <h3 className="t-h2 mt-4">{t(c.title, lang)}</h3>
                      <p className="t-small mt-2 text-muted">{t(c.subtitle, lang)}</p>

                      <p className="t-eyebrow mt-auto pt-6">
                        {unlocked
                          ? `${c.components.length} ${t(ui.components, lang)} · ${c.minutes} min`
                          : `${t(ui.unlockedBy, lang)} · M${pad(required?.n ?? 0)}`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="mt-20 mb-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <span className="t-eyebrow">Apex Academy</span>
          <span className="t-eyebrow">
            {allLessons.length} {t(ui.lessons, lang)} · {lang === "es" ? "publicadas" : "published"}
          </span>
        </footer>
      </div>
    </main>
  );
}
