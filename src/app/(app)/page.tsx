"use client";

import Link from "next/link";
import { course } from "@/content/course";
import { useProgress, useSettings } from "@/components/providers";
import { t, ui } from "@/lib/i18n";
import type { LessonStatus, Module } from "@/lib/types";

function pct(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
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

  // First lesson that is not finished — where "Continue" goes.
  const nextUp =
    course.modules
      .flatMap((m) => m.lessons.map((l) => ({ m, l })))
      .find(({ l }) => statusOf(l.id) !== "completed") ??
    course.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })))[0];

  return (
    <main className="mx-auto w-full max-w-[880px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
      {/* ---------------------------------------------------------------- hero */}
      <section className="fade-in">
        <p className="t-eyebrow">Apex · Salesforce</p>
        <h1 className="t-display mt-3 max-w-[18ch]">
          {lang === "es"
            ? "De Admin a desarrollador Apex."
            : "From Admin to Apex developer."}
        </h1>
        <p className="lead mt-4 max-w-[58ch]">
          {lang === "es"
            ? "Doce módulos y dos proyectos. Cada concepto se explica desde algo que ya configuraste con clicks, y no se te pide escribir nada que no se haya explicado antes."
            : "Twelve modules and two projects. Every concept starts from something you already configured with clicks, and you are never asked to write anything that has not been explained first."}
        </p>

        {allLessons.length > 0 && (
          <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="t-micro text-muted">{t(ui.overallProgress, lang)}</span>
                <span className="t-micro tabular-nums text-faint">
                  {doneCount}/{allLessons.length}
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-brand transition-[width] duration-500"
                  style={{ width: `${pct(doneCount, allLessons.length)}%` }}
                />
              </div>
            </div>

            {nextUp && (
              <Link
                href={`/m/${nextUp.m.id}/${nextUp.l.slug}`}
                className="btn btn-primary shrink-0"
              >
                {doneCount === 0 ? t(ui.startCourse, lang) : t(ui.continueLearning, lang)}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------ modules */}
      <section className="mt-16">
        <h2 className="t-eyebrow">{t(ui.modules, lang)}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {course.modules.map((m) => {
            const ready = m.status === "ready";
            const done = m.lessons.filter((l) => statusOf(l.id) === "completed").length;
            const complete = moduleDone(m);

            const inner = (
              <div
                className={`card group h-full p-5 transition ${
                  ready
                    ? "hover:border-line-strong hover:shadow-[var(--shadow-card)]"
                    : "opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="t-micro tabular-nums text-faint">
                    {String(m.n).padStart(2, "0")}
                  </span>
                  {complete ? (
                    <span className="t-micro rounded-full bg-brand-soft px-2 py-0.5 text-brand">
                      {t(ui.completed, lang)}
                    </span>
                  ) : ready ? (
                    <span className="t-micro tabular-nums text-faint">
                      {done}/{m.lessons.length}
                    </span>
                  ) : (
                    <span className="t-micro text-faint">{t(ui.planned, lang)}</span>
                  )}
                </div>

                <h3 className="t-h3 mt-3">{t(m.title, lang)}</h3>
                <p className="t-small mt-1.5 text-muted">{t(m.subtitle, lang)}</p>

                {ready && (
                  <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-500"
                      style={{ width: `${pct(done, m.lessons.length)}%` }}
                    />
                  </div>
                )}

                {!ready && m.outline && (
                  <ul className="mt-4 space-y-1">
                    {m.outline.slice(0, 3).map((o, i) => (
                      <li key={i} className="t-micro text-faint">
                        · {t(o, lang)}
                      </li>
                    ))}
                    {m.outline.length > 3 && (
                      <li className="t-micro text-faint">
                        · +{m.outline.length - 3}
                      </li>
                    )}
                  </ul>
                )}
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

      {/* ---------------------------------------------------------- challenges */}
      <section className="mt-16">
        <h2 className="t-eyebrow">{t(ui.challenges, lang)}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {course.challenges.map((c) => {
            const required = course.modules.find((m) => m.id === c.requires);
            const unlocked = required ? moduleDone(required) : false;
            const progress = snapshot.challenges[c.id];

            const card = (
              <div
                className={`relative h-full overflow-hidden rounded-[var(--radius-card)] border p-5 transition ${
                  unlocked
                    ? "border-accent/35 bg-accent-soft hover:border-accent/60"
                    : "border-dashed border-line bg-surface"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="t-eyebrow text-accent">
                    {t(ui.challenge, lang)} {c.n}
                  </span>
                  <span className="t-micro flex items-center gap-1.5 text-faint">
                    {unlocked ? (
                      progress?.status === "completed" ? (
                        t(ui.completed, lang)
                      ) : (
                        t(ui.ready, lang)
                      )
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <rect x="3.2" y="7" width="9.6" height="7" rx="1.6" />
                          <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
                        </svg>
                        {t(ui.locked, lang)}
                      </>
                    )}
                  </span>
                </div>

                <h3 className="t-h3 mt-3">{t(c.title, lang)}</h3>
                <p className="t-small mt-1.5 text-muted">{t(c.subtitle, lang)}</p>

                <p className="t-micro mt-4 text-faint">
                  {unlocked
                    ? `${c.components.length} ${t(ui.components, lang).toLowerCase()} · ${c.minutes} ${t(ui.minutes, lang)}`
                    : `${t(ui.unlockedBy, lang)}: ${t(ui.module, lang)} ${required?.n} — ${t(required?.title ?? { es: "", en: "" }, lang)}`}
                </p>
              </div>
            );

            return (
              <li key={c.id}>
                <Link href={`/c/${c.id}`} className="block h-full">
                  {card}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-20 border-t border-line pt-6">
        <p className="t-micro text-faint">
          Apex Academy · {allLessons.length} {t(ui.lessons, lang)}{" "}
          {lang === "es" ? "publicadas" : "published"}
        </p>
      </footer>
    </main>
  );
}
