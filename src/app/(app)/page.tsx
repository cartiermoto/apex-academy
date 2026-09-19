"use client";

import Link from "next/link";
import { course } from "@/content/course";
import { useProgress, useSettings } from "@/components/providers";
import { Mark } from "@/components/logo";
import { t, ui } from "@/lib/i18n";
import type { L, Lesson, LessonStatus, Module, ModuleCategory } from "@/lib/types";

/**
 * Home — "Editorial por categorías".
 *
 * Colours come exclusively from the .editorial tokens in globals.css (copied
 * from apex-academy-propuesta2-design-tokens.json). No sidebar on this page:
 * it appears once a module is opened.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const pct = (done: number, total: number) => (total === 0 ? 0 : Math.round((done / total) * 100));

const CATEGORIES: Array<{ id: ModuleCategory; name: L }> = [
  { id: "fund", name: { es: "Fundamentos", en: "Fundamentals" } },
  { id: "logic", name: { es: "Lógica y datos", en: "Logic & data" } },
  { id: "obj", name: { es: "Objetos y automatización", en: "Objects & automation" } },
  { id: "robust", name: { es: "Robustez", en: "Robustness" } },
  { id: "scope", name: { es: "Alcance", en: "Scope" } },
];

/* ------------------------------------------------------------------ header */

function Header() {
  const { lang, setLang, theme, setTheme } = useSettings();
  const { authed, logout } = useProgress();

  const iconBtn =
    "grid h-10 w-10 place-items-center rounded-[4px] border border-[var(--e-divider)] text-[var(--e-ink)] transition hover:opacity-75";

  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="inline-flex min-h-[44px] items-center gap-2.5 text-[var(--e-ink)]">
        <span style={{ borderRadius: "var(--e-logo-radius)" }} className="inline-flex">
          <Mark size={30} />
        </span>
        <span className="text-[1.05rem] leading-none">
          <span className="font-bold tracking-[-0.02em]">Apex</span>{" "}
          <span className="font-normal">Academy</span>
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <div
          role="group"
          aria-label={t(ui.language, lang)}
          className="e-mono inline-flex rounded-[4px] border border-[var(--e-divider)] p-[2px]"
        >
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className="inline-flex min-h-[36px] min-w-[44px] items-center justify-center rounded-[3px] px-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition"
              style={
                lang === l
                  ? { background: "var(--e-accent)", color: "var(--e-on-accent)" }
                  : { color: "var(--e-ink)" }
              }
            >
              {l}
            </button>
          ))}
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? t(ui.light, lang) : t(ui.dark, lang)}
          className={iconBtn}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
            </svg>
          )}
        </button>

        {authed === false && (
          <Link
            href="/login?next=/"
            className="e-mono inline-flex min-h-[40px] items-center rounded-[4px] px-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition hover:opacity-90"
            style={{ background: "var(--e-accent)", color: "var(--e-on-accent)" }}
          >
            {t(ui.signIn, lang)}
          </Link>
        )}

        {authed && (
        <button
          onClick={() => void logout()}
          aria-label={t(ui.signOut, lang)}
          title={t(ui.signOut, lang)}
          className={iconBtn}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5M21 12H9" />
          </svg>
        </button>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------- sync status */

function SyncStatus() {
  const { lang } = useSettings();
  const { authed } = useProgress();
  if (authed === null) return null;
  return (
    <p className="e-mono order-last text-[11px] uppercase tracking-[0.08em]">
      {authed ? (
        <>✓ {t(ui.syncOn, lang)}</>
      ) : (
        <>
          {t(ui.syncOff, lang)} ·{" "}
          <Link href="/login?next=/" className="underline underline-offset-4">
            {t(ui.signIn, lang)}
          </Link>
        </>
      )}
    </p>
  );
}

/* ----------------------------------------------------------- up-next panel */

function UpNext({
  mod,
  lesson,
  status,
  steps,
}: {
  mod: Module;
  lesson: Lesson;
  status: LessonStatus;
  steps: { theory: boolean; quiz: boolean; exercise: boolean };
}) {
  const { lang } = useSettings();
  const statusLabel =
    status === "completed"
      ? t(ui.completed, lang)
      : status === "in_progress"
        ? t(ui.inProgress, lang)
        : t(ui.notStarted, lang);

  const k = "e-mono text-[11px] uppercase tracking-[0.08em]";
  const rule = <div className="h-px bg-[var(--e-divider)]" />;

  return (
    <Link
      href={`/m/${mod.id}/${lesson.slug}`}
      /* Floating card (as in the reference site): tilted on wide screens, lifted
         by a shadow, and it straightens on hover. Colours unchanged. */
      className="group flex w-full flex-col gap-[22px] p-6 transition-transform duration-300 ease-out sm:p-8 lg:mt-4 lg:w-[420px] lg:shrink-0 lg:rotate-[1.5deg] lg:hover:rotate-0 xl:w-[460px]"
      style={{
        background: "var(--e-cat-fund-surface)",
        color: "var(--e-ink)",
        boxShadow: "var(--e-float-shadow)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="shrink-0" style={{ color: "var(--e-ink)" }}>
          <Mark size={30} badge radius={0} knockout="var(--e-bg)" />
        </span>
        <span className="e-mono flex-1 text-[12px] uppercase tracking-[0.08em]">
          {lang === "es" ? "Siguiente" : "Up next"} — M{mod.n}.{pad(lesson.n)}
        </span>
        <span className="e-mono whitespace-nowrap text-[11px] uppercase tracking-[0.05em]">
          <span className="hidden sm:inline">{lang === "es" ? "Lectura" : "Read"} · </span>
          {lesson.minutes} min
        </span>
      </div>

      {rule}

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[110px_1fr] gap-3 sm:grid-cols-[130px_1fr]">
          <span className={k}>{lang === "es" ? "Concepto" : "Concept"}</span>
          <span className="e-mono text-[14px] leading-[1.5]">{t(lesson.title, lang)}</span>
        </div>
        {lesson.analogy && (
          <div className="grid grid-cols-[110px_1fr] gap-3 sm:grid-cols-[130px_1fr]">
            <span className={k}>{lang === "es" ? "En Admin es" : "In Admin it is"}</span>
            <span className="text-[14px] leading-[1.5]">{t(lesson.analogy, lang)}</span>
          </div>
        )}
        <div className="grid grid-cols-[110px_1fr] gap-3 sm:grid-cols-[130px_1fr]">
          <span className={k}>{lang === "es" ? "Estado" : "Status"}</span>
          <span className="e-mono text-[14px] leading-[1.5]">{statusLabel}</span>
        </div>
        {status === "in_progress" && (
          <div className="grid grid-cols-[110px_1fr] gap-3 sm:grid-cols-[130px_1fr]">
            <span className={k}>{lang === "es" ? "Pasos" : "Steps"}</span>
            <span className="e-mono flex flex-wrap gap-x-4 gap-y-1 text-[14px] leading-[1.5]">
              {(
                [
                  [ui.theory, steps.theory],
                  [ui.quiz, steps.quiz],
                  [ui.exercise, steps.exercise],
                ] as const
              ).map(([label, done]) => (
                <span key={label.es}>
                  {done ? "✓" : "○"} {t(label, lang)}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5" style={{ background: "var(--e-bg)" }}>
        <div className="e-mono flex justify-between text-[11px] uppercase tracking-[0.08em]">
          <span>{lang === "es" ? "Vas a poder" : "You will be able to"}</span>
          <span>{lang === "es" ? "Objetivo" : "Goal"}</span>
        </div>
        <ol className="flex flex-col gap-2.5">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] leading-[1.5]">
              <span className="e-mono font-semibold">{pad(i + 1)}</span>
              <span>{t(o, lang)}</span>
            </li>
          ))}
        </ol>
      </div>

      {rule}

      <div className="flex items-center justify-between gap-3">
        <span className="e-mono text-[11px] uppercase tracking-[0.05em]">
          ↳ {t(ui.module, lang)} {mod.n} · {t(mod.title, lang)}
        </span>
        <span className="e-mono whitespace-nowrap text-[12px] font-bold uppercase tracking-[0.05em] transition group-hover:opacity-70">
          {lang === "es" ? "Abrir" : "Open"} →
        </span>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------- page */

export default function HomePage() {
  const { lang } = useSettings();
  const { snapshot, authed } = useProgress();

  const statusOf = (id: string): LessonStatus => snapshot.lessons[id]?.status ?? "not_started";

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneCount = allLessons.filter((l) => statusOf(l.id) === "completed").length;
  // Each sub-lesson is three steps (theory, quiz, exercise): the bar moves as
  // soon as one is done, so partial progress never looks like "nothing saved".
  const stepsDone = allLessons.reduce((n, l) => {
    const p = snapshot.lessons[l.id];
    return n + (p?.theoryDone ? 1 : 0) + (p?.quizDone ? 1 : 0) + (p?.exerciseDone ? 1 : 0);
  }, 0);
  const overallPct = pct(stepsDone, allLessons.length * 3);
  const moduleDone = (m: Module) =>
    m.lessons.length > 0 && m.lessons.every((l) => statusOf(l.id) === "completed");

  const pairs = course.modules.flatMap((m) => m.lessons.map((l) => ({ m, l })));
  const nextUp = pairs.find(({ l }) => statusOf(l.id) !== "completed") ?? pairs[0];
  const published = course.modules.filter((m) => m.status === "ready").length;

  const sectionHead = "e-mono flex items-baseline justify-between gap-4 text-[12px] uppercase tracking-[0.1em]";

  return (
    <div className="editorial min-h-dvh">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-8 sm:px-8 sm:py-12 lg:gap-[72px] lg:px-12 lg:py-16 xl:px-24 xl:py-[88px]">
        <Header />

        {/* ------------------------------------------------------------ hero */}
        <section className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[26px]">
            <p className="e-mono flex items-center gap-2.5 text-[12px] uppercase tracking-[0.14em]">
              <span className="inline-block h-2.5 w-2.5 shrink-0" style={{ background: "var(--e-accent)" }} />
              <span>
                Apex · Salesforce · {lang === "es" ? "Curso personal" : "Personal course"}
              </span>
            </p>

            <h1 className="m-0 text-[clamp(2.25rem,1.4rem+3.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.02em]">
              {lang === "es" ? "De Admin a desarrollador Apex." : "From Admin to Apex developer."}
            </h1>

            <p className="m-0 max-w-[600px] text-[17px] leading-[1.6]">
              {lang === "es"
                ? "Cada concepto se explica desde algo que ya configuraste con clicks, y nunca se te pide escribir nada que no se haya explicado antes."
                : "Every concept starts from something you already configured with clicks, and you are never asked to write anything that has not been explained first."}
            </p>

            <p className="e-mono text-[12px] uppercase tracking-[0.08em]">
              {course.modules.length} {lang === "es" ? "módulos" : "modules"} ·{" "}
              {course.challenges.length} {lang === "es" ? "desafíos" : "challenges"} · ES / EN
            </p>

            <div className="mt-2 flex flex-col gap-3.5 sm:flex-row">
              {nextUp && (
                <Link href={`/m/${nextUp.m.id}/${nextUp.l.slug}`} className="e-btn e-btn-primary">
                  {stepsDone === 0 ? t(ui.startCourse, lang) : t(ui.continueLearning, lang)} →
                </Link>
              )}
              <a href="#modulos" className="e-btn e-btn-secondary">
                {lang === "es" ? "Ver módulos" : "See modules"}
              </a>
            </div>

            {allLessons.length > 0 && (
              <div className="mt-5 flex flex-col gap-2.5">
                <div className="e-mono flex justify-between text-[11px] uppercase tracking-[0.1em]">
                  <span>{t(ui.overallProgress, lang)}</span>
                  <span className="tabular-nums">
                    {doneCount}/{allLessons.length} {t(ui.lessonsDone, lang)} · {overallPct}%
                  </span>
                </div>
                <SyncStatus />
                <div className="h-1.5" style={{ background: "var(--e-track-bg)" }}>
                  <div
                    className="h-1.5 transition-[width] duration-500"
                    style={{
                      width: `${overallPct}%`,
                      background: "var(--e-accent)",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {nextUp && (
            <UpNext
              mod={nextUp.m}
              lesson={nextUp.l}
              status={statusOf(nextUp.l.id)}
              steps={{
                theory: Boolean(snapshot.lessons[nextUp.l.id]?.theoryDone),
                quiz: Boolean(snapshot.lessons[nextUp.l.id]?.quizDone),
                exercise: Boolean(snapshot.lessons[nextUp.l.id]?.exerciseDone),
              }}
            />
          )}
        </section>

        {/* ---------------------------------------------------------- legend */}
        <div className="e-mono flex flex-wrap gap-x-7 gap-y-3 text-[11px] uppercase tracking-[0.06em]">
          {CATEGORIES.map((c) => (
            <span key={c.id} className="flex items-center gap-2">
              <span
                data-cat={c.id}
                className="e-swatch inline-block h-2.5 w-2.5"
                style={{ border: "1px solid var(--e-legend-border)" }}
              />
              {t(c.name, lang)}
            </span>
          ))}
        </div>

        {/* --------------------------------------------------------- modules */}
        <section id="modulos" className="flex scroll-mt-6 flex-col gap-7">
          <div className={sectionHead}>
            <span>{t(ui.modules, lang)}</span>
            <span>
              {published}/{course.modules.length} {lang === "es" ? "publicados" : "published"}
            </span>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {course.modules.map((m) => {
              const ready = m.status === "ready";
              const done = m.lessons.filter((l) => statusOf(l.id) === "completed").length;
              const current = ready && nextUp?.m.id === m.id && !moduleDone(m);
              const tag = moduleDone(m)
                ? t(ui.completed, lang)
                : current
                  ? lang === "es"
                    ? "En curso"
                    : "In progress"
                  : ready
                    ? t(ui.ready, lang)
                    : t(ui.planned, lang);
              const meta = ready
                ? `${done}/${m.lessons.length} ${lang === "es" ? "hecho" : "done"}`
                : `${m.outline?.length ?? 0} ${lang === "es" ? "sub-lecciones" : "sub-lessons"}`;

              const card = (
                <article
                  data-cat={m.category}
                  className="e-module flex h-full min-h-[190px] flex-col gap-3.5 p-6 sm:p-[30px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="e-num text-[30px] font-bold leading-none">{pad(m.n)}</span>
                    <span className="e-mono text-[10px] uppercase tracking-[0.08em]">{tag}</span>
                  </div>
                  <h3 className="e-title m-0 text-[21px] font-semibold leading-[1.2]">{t(m.title, lang)}</h3>
                  <p className="m-0 flex-1 text-[13.5px] leading-[1.5]">{t(m.subtitle, lang)}</p>
                  <span className="e-mono text-[11px] uppercase tracking-[0.06em]">{meta}</span>
                </article>
              );

              return (
                <li key={m.id}>
                  {ready && m.lessons[0] ? (
                    <Link
                      href={`/m/${m.id}/${m.lessons[0].slug}`}
                      className="block h-full"
                    >
                      {card}
                    </Link>
                  ) : (
                    card
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ------------------------------------------------------ challenges */}
        <section className="flex flex-col gap-7">
          <div className={sectionHead}>
            <span>{t(ui.challenges, lang)}</span>
            <span>{lang === "es" ? "Proyectos con feedback" : "Projects with feedback"}</span>
          </div>

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5">
            {course.challenges.map((c) => {
              const required = course.modules.find((m) => m.id === c.requires);
              // Admin mode: signed in, the challenges open regardless of progress.
              const unlocked = authed === true || (required ? moduleDone(required) : false);
              const progress = snapshot.challenges[c.id];

              return (
                <li key={c.id}>
                  <Link href={`/c/${c.id}`} className="block h-full">
                    <article
                      className="e-challenge flex h-full flex-col gap-3.5 p-6 sm:p-[30px]"
                      style={{ background: "var(--e-challenge-bg)", color: "var(--e-challenge-text)" }}
                    >
                      <div className="e-mono flex items-center justify-between text-[11px] uppercase tracking-[0.08em] opacity-[0.72]">
                        <span>
                          {t(ui.challenge, lang)} {pad(c.n)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {unlocked ? (
                            progress?.status === "completed" ? t(ui.completed, lang) : t(ui.ready, lang)
                          ) : (
                            <>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.8" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              </svg>
                              {t(ui.locked, lang)}
                            </>
                          )}
                        </span>
                      </div>
                      <h3 className="m-0 text-[22px] font-bold leading-[1.25]">{t(c.title, lang)}</h3>
                      <p className="m-0 flex-1 text-[14px] leading-[1.55]">{t(c.subtitle, lang)}</p>
                      <span className="e-mono text-[11px] uppercase tracking-[0.06em] opacity-[0.72]">
                        {unlocked
                          ? `${c.components.length} ${t(ui.components, lang).toLowerCase()} · ${c.minutes} min`
                          : `${t(ui.unlockedBy, lang)} · M${pad(required?.n ?? 0)}`}
                      </span>
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <footer
          className="e-mono flex flex-wrap justify-between gap-3 pt-2 text-[11px] uppercase tracking-[0.08em]"
          style={{ borderTop: "1px solid var(--e-divider)" }}
        >
          <span className="pt-4">Apex Academy</span>
          <span className="pt-4">
            {allLessons.length} {t(ui.lessons, lang)} · {lang === "es" ? "publicadas" : "published"}
          </span>
        </footer>
      </main>
    </div>
  );
}
