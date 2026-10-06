"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { course, requiredLessons } from "@/content/course";
import { useProgress, useSettings } from "@/components/providers";
import { MascotMark } from "@/components/logo";
import { t, ui } from "@/lib/i18n";
import type { L, Lesson, LessonStatus, Module, ModuleCategory } from "@/lib/types";

/**
 * Home — "Editorial por categorías".
 *
 * Colours come exclusively from the .editorial tokens in globals.css (copied
 * from apex-academy-paleta-mascota-verde.json). No sidebar on this page:
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

/* ------------------------------------------------------------------ motion */

/**
 * Cross-fades the whole page while `change` is applied (theme, language), so
 * the swap is an opacity transition instead of a hard cut. Falls back to the
 * plain change where View Transitions are missing or motion is reduced.
 */
function withFade(change: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    change();
    return;
  }
  doc.startViewTransition(() => flushSync(change));
}

/** A number that counts up from zero once, when it first appears. */
function CountUp({ to }: { to: number }) {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    const ms = 600;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      setN(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  // Fixed width: the digits change, the layout does not.
  return (
    <span className="inline-block text-right tabular-nums" style={{ minWidth: `${String(to).length}ch` }}>
      {n}
    </span>
  );
}

/**
 * True once the element has entered the viewport (and it stays true). The
 * cards inside wait for it before rising in, so the stagger is seen.
 */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

/* ------------------------------------------------------------------ header */

function Header() {
  const { lang, setLang, theme, setTheme } = useSettings();
  const { authed, logout } = useProgress();

  // The bar is transparent at the top of the page and gains its translucent
  // backdrop once the content starts sliding under it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const iconBtn =
    "e-press grid h-11 w-11 place-items-center rounded-[4px] border border-[var(--e-divider)] text-[var(--e-ink)] hover:opacity-75";

  return (
    <header
      data-scrolled={scrolled}
      className="e-header sticky top-0 z-30 -mx-5 flex items-center justify-between gap-3 px-5 py-3 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-24 xl:px-24"
    >
      <Link href="/" className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 text-[var(--e-ink)]">
        <MascotMark size={44} className="shrink-0" />
        {/* Under 400px the controls leave no room: the mascot alone carries the
            brand (its alt text still names it for screen readers). */}
        <span className="text-[20px] font-bold leading-none tracking-[-0.01em] max-[399px]:hidden">Apex Academy</span>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5">
        <div
          role="group"
          aria-label={t(ui.language, lang)}
          className="e-mono inline-flex rounded-[4px] border border-[var(--e-divider)] p-[2px]"
        >
          {(["es", "en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => lang !== l && withFade(() => setLang(l))}
              aria-pressed={lang === l}
              className="e-press inline-flex min-h-[40px] min-w-[44px] items-center justify-center rounded-[3px] px-2.5 text-[12px] font-semibold uppercase tracking-[0.06em]"
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
          onClick={() => withFade(() => setTheme(theme === "dark" ? "light" : "dark"))}
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
            className="e-mono e-press inline-flex min-h-[44px] items-center rounded-[4px] px-3.5 text-[12px] font-semibold uppercase tracking-[0.06em] hover:opacity-90"
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

/* ----------------------------------------------------------- category tabs */

type CatFilter = "all" | ModuleCategory;

const TABS: Array<{ id: CatFilter; name: L }> = [{ id: "all", name: { es: "Todos", en: "All" } }, ...CATEGORIES];

/**
 * The category legend, as tabs that filter the module grid. One underline
 * slides between them: it is a fixed 100px bar moved and stretched with a
 * transform, so nothing but transform animates.
 */
function CategoryTabs({ value, onChange }: { value: CatFilter; onChange: (c: CatFilter) => void }) {
  const { lang } = useSettings();
  const listRef = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const el = list.querySelector<HTMLElement>('[aria-selected="true"]');
      if (el) setBar({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    // Web fonts and viewport changes move the tabs: keep the bar under its tab.
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [value, lang]);

  const select = (id: CatFilter, focus = false) => {
    onChange(id);
    const el = listRef.current?.querySelector<HTMLElement>(`#tab-${id}`);
    if (focus) el?.focus();
    el?.scrollIntoView({ inline: "nearest", block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = TABS.findIndex((x) => x.id === value);
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % TABS.length
        : e.key === "ArrowLeft"
          ? (i - 1 + TABS.length) % TABS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? TABS.length - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(TABS[next].id, true);
  };

  return (
    <div className="e-tabs sticky top-[68px] z-20 -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 xl:-mx-24 xl:px-24">
      <div
        ref={listRef}
        role="tablist"
        aria-label={t(ui.modules, lang)}
        onKeyDown={onKeyDown}
        className="e-tablist e-mono relative flex gap-1 overflow-x-auto text-[11px] uppercase tracking-[0.06em]"
      >
        {TABS.map((tab) => {
          const selected = tab.id === value;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="panel-modulos"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              className="e-tab inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap px-3.5"
            >
              {tab.id !== "all" && (
                <span
                  data-cat={tab.id}
                  className="e-swatch inline-block h-2.5 w-2.5"
                  style={{ border: "1px solid var(--e-legend-border)" }}
                />
              )}
              {t(tab.name, lang)}
            </button>
          );
        })}
        <span
          aria-hidden
          className="e-tab-bar"
          style={bar ? { opacity: 1, transform: `translateX(${bar.x}px) scaleX(${bar.w / 100})` } : undefined}
        />
      </div>
    </div>
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
      className="e-upnext e-rise group flex w-full flex-col gap-[22px] p-6 transition-transform duration-300 ease-out hover:-translate-y-1.5 focus-visible:-translate-y-1.5 sm:p-8 lg:mt-4 lg:w-[420px] lg:shrink-0 lg:rotate-[1.5deg] lg:hover:rotate-0 lg:focus-visible:rotate-0 xl:w-[460px]"
      style={
        {
          "--i": 3,
          background: "var(--e-cat-fund-surface)",
          color: "var(--e-ink)",
          boxShadow: "var(--e-float-shadow)",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center gap-3">
        <MascotMark size={30} className="shrink-0" />
        <span className="e-mono flex-1 text-[12px] uppercase tracking-[0.08em]">
          {lang === "es" ? "Siguiente" : "Up next"} · M{mod.n}.{pad(lesson.n)}
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
          <span className="text-[19px] font-bold leading-[1.25] tracking-[-0.01em] sm:text-[21px]">{t(lesson.title, lang)}</span>
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
        <span
          className="e-mono inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[4px] px-4 text-[12px] font-bold uppercase tracking-[0.05em]"
          style={{ background: "var(--e-accent)", color: "var(--e-on-accent)" }}
        >
          {lang === "es" ? "Abrir" : "Open"}
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" aria-hidden>
            →
          </span>
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

  // Optional practice is offered but never counted: it must not hold back the
  // progress bar, the "completed" badge or the next-up card.
  const allLessons = course.modules.flatMap((m) => requiredLessons(m));
  const doneCount = allLessons.filter((l) => statusOf(l.id) === "completed").length;
  // Each sub-lesson is three steps (theory, quiz, exercise): the bar moves as
  // soon as one is done, so partial progress never looks like "nothing saved".
  const stepsDone = allLessons.reduce((n, l) => {
    const p = snapshot.lessons[l.id];
    return n + (p?.theoryDone ? 1 : 0) + (p?.quizDone ? 1 : 0) + (p?.exerciseDone ? 1 : 0);
  }, 0);
  const overallPct = pct(stepsDone, allLessons.length * 3);
  const moduleDone = (m: Module) =>
    requiredLessons(m).length > 0 && requiredLessons(m).every((l) => statusOf(l.id) === "completed");

  const pairs = course.modules.flatMap((m) => requiredLessons(m).map((l) => ({ m, l })));
  const nextUp = pairs.find(({ l }) => statusOf(l.id) !== "completed") ?? pairs[0];
  const published = course.modules.filter((m) => m.status === "ready").length;

  const [cat, setCat] = useState<CatFilter>("all");
  const shownModules = cat === "all" ? course.modules : course.modules.filter((m) => m.category === cat);
  const chooseCat = (c: CatFilter) => {
    setCat(c);
    // The tabs stay pinned while the grid scrolls under them: after filtering
    // from further down, bring the start of the shorter grid back into view.
    const section = document.getElementById("modulos");
    if (section && section.getBoundingClientRect().top < 0) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      section.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
    }
  };

  const [modulesRef, modulesInView] = useInView<HTMLDivElement>();
  const [challengesRef, challengesInView] = useInView<HTMLUListElement>();

  // The bar starts empty and fills to the real value after the first paint,
  // and again whenever the value changes.
  const [shownPct, setShownPct] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShownPct(overallPct));
    return () => cancelAnimationFrame(id);
  }, [overallPct]);

  const sectionHead = "e-mono flex items-baseline justify-between gap-4 text-[12px] uppercase tracking-[0.1em]";

  return (
    <div className="editorial min-h-dvh">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-12 px-5 py-8 sm:px-8 sm:py-12 lg:gap-[72px] lg:px-12 lg:py-16 xl:px-24 xl:py-[88px]">
        <Header />

        {/* -------------------------------------------------- welcome banner */}
        <section className="e-banner" aria-label={lang === "es" ? "Bienvenida" : "Welcome"}>
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed illustration from /public */}
          <img className="e-otter" src="/mascot/apex-academy-mascota-verde-full-illustration.png" alt="" width={96} height={96} />
          <div className="min-w-0">
            <p className="e-mono m-0 text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--e-accent-text)" }}>
              {lang === "es" ? "Tu guía en el curso" : "Your guide through the course"}
            </p>
            <p className="m-0 mt-1.5 max-w-[720px] text-[15px] leading-[1.55]">
              {lang === "es"
                ? "¡Hola! Soy tu nutria trailblazer. Voy módulo a módulo contigo, sin dar nada por sabido."
                : "Hi! I'm your trailblazer otter — I go module by module with you, taking nothing for granted."}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------ hero */}
        <section className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-[72px]">
          <div className="flex min-w-0 flex-1 flex-col gap-7">
            <p className="e-mono e-rise flex items-center gap-2.5 text-[12px] uppercase tracking-[0.14em]">
              <span className="inline-block h-2.5 w-2.5 shrink-0" style={{ background: "var(--e-accent)" }} />
              <span>
                Apex · Salesforce · {lang === "es" ? "Curso personal" : "Personal course"}
              </span>
            </p>

            <h1
              className="e-rise m-0 text-[clamp(2.5rem,1.4rem+3.6vw,4rem)] font-bold leading-[1.06] tracking-[-0.025em] [text-wrap:balance] xl:text-[4.5rem]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              {lang === "es" ? "De Admin a desarrollador Apex." : "From Admin to Apex developer."}
            </h1>

            <p className="e-rise m-0 max-w-[600px] text-[17px] leading-[1.65] sm:text-[18px]" style={{ "--i": 2 } as React.CSSProperties}>
              {lang === "es"
                ? "Cada concepto se explica desde algo que ya configuraste con clicks, y nunca se te pide escribir nada que no se haya explicado antes."
                : "Every concept starts from something you already configured with clicks, and you are never asked to write anything that has not been explained first."}
            </p>

            <ul
              className="e-mono e-rise m-0 flex list-none flex-wrap gap-2 p-0 text-[12px] uppercase tracking-[0.08em]"
              style={{ "--i": 3 } as React.CSSProperties}
            >
              <li className="e-chip">
                <strong>
                  <CountUp to={course.modules.length} />
                </strong>
                {lang === "es" ? "módulos" : "modules"}
              </li>
              <li className="e-chip">
                <strong>
                  <CountUp to={course.challenges.length} />
                </strong>
                {lang === "es" ? "desafíos" : "challenges"}
              </li>
              <li className="e-chip">ES / EN</li>
            </ul>

            <div className="e-rise mt-2 flex flex-col gap-3.5 sm:flex-row" style={{ "--i": 4 } as React.CSSProperties}>
              {nextUp && (
                <Link href={`/m/${nextUp.m.id}/${nextUp.l.slug}`} className="e-btn e-btn-primary">
                  {stepsDone === 0 ? t(ui.startCourse, lang) : t(ui.continueLearning, lang)}{" "}
                  <span className="e-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              )}
              <a href="#modulos" className="e-btn e-btn-secondary">
                {lang === "es" ? "Ver módulos" : "See modules"}
              </a>
            </div>

            {allLessons.length > 0 && (
              <div className="e-rise mt-5 flex flex-col gap-2.5" style={{ "--i": 5 } as React.CSSProperties}>
                <div className="e-mono flex justify-between text-[11px] uppercase tracking-[0.1em]">
                  <span>{t(ui.overallProgress, lang)}</span>
                  <span className="tabular-nums">
                    {doneCount}/{allLessons.length} {t(ui.lessonsDone, lang)} · {overallPct}%
                  </span>
                </div>
                <SyncStatus />
                <div
                  role="progressbar"
                  aria-label={t(ui.overallProgress, lang)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={overallPct}
                  className="h-2 overflow-hidden rounded-[2px]"
                  style={{ background: "var(--e-track-bg)" }}
                >
                  <div className="e-fill h-2" style={{ transform: `scaleX(${shownPct / 100})`, background: "var(--e-accent)" }} />
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

        {/* --------------------------------------------------------- modules */}
        <section id="modulos" className="flex scroll-mt-[84px] flex-col gap-7">
          <div className={sectionHead}>
            <span>{t(ui.modules, lang)}</span>
            <span>
              {published}/{course.modules.length} {lang === "es" ? "publicados" : "published"}
            </span>
          </div>

          <CategoryTabs value={cat} onChange={chooseCat} />

          {/* Re-keyed per category: the filtered cards mount fresh and rise in. */}
          <div
            ref={modulesRef}
            data-in={modulesInView}
            id="panel-modulos"
            role="tabpanel"
            aria-labelledby={`tab-${cat}`}
            className="e-stagger"
          >
          <ul key={cat} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {shownModules.map((m, i) => {
              const ready = m.status === "ready";
              const done = requiredLessons(m).filter((l) => statusOf(l.id) === "completed").length;
              const current = ready && nextUp?.m.id === m.id && !moduleDone(m);
              const state = moduleDone(m) ? "done" : current ? "current" : ready ? "ready" : "planned";
              const total = requiredLessons(m).length;
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
                ? `${done}/${requiredLessons(m).length} ${lang === "es" ? "hecho" : "done"}`
                : `${m.outline?.length ?? 0} ${lang === "es" ? "sub-lecciones" : "sub-lessons"}`;

              const card = (
                <article
                  data-cat={m.category}
                  data-state={state}
                  className="e-module flex h-full min-h-[190px] flex-col gap-3.5 p-6 sm:p-[30px]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="e-num text-[30px] font-bold leading-none">{pad(m.n)}</span>
                    <span data-state={state} className="e-tag e-mono text-[10px] uppercase tracking-[0.08em]">
                      {state === "done" && <span aria-hidden>✓</span>}
                      {tag}
                    </span>
                  </div>
                  <h3 className="e-title m-0 text-[21px] font-semibold leading-[1.2]">{t(m.title, lang)}</h3>
                  <p className="m-0 flex-1 text-[13.5px] leading-[1.5]">{t(m.subtitle, lang)}</p>
                  <span className="e-mono text-[11px] uppercase tracking-[0.06em]">{meta}</span>
                  {/* decorative: the line above already says done/total */}
                  {ready && total > 0 && (
                    <div aria-hidden className="e-track h-1 overflow-hidden rounded-[2px]">
                      <div
                        className="e-fill h-1"
                        style={{ transform: `scaleX(${modulesInView ? done / total : 0})`, background: "var(--e-accent)" }}
                      />
                    </div>
                  )}
                </article>
              );

              return (
                <li key={m.id} className="e-rise" style={{ "--i": Math.min(i, 8) } as React.CSSProperties}>
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
          </div>
        </section>

        {/* ------------------------------------------------------ challenges */}
        <section className="flex flex-col gap-7">
          <div className={sectionHead}>
            <span>{t(ui.challenges, lang)}</span>
            <span>{lang === "es" ? "Proyectos con feedback" : "Projects with feedback"}</span>
          </div>

          <ul
            ref={challengesRef}
            data-in={challengesInView}
            className="e-stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5"
          >
            {course.challenges.map((c, i) => {
              const required = course.modules.find((m) => m.id === c.requires);
              // Admin mode: signed in, the challenges open regardless of progress.
              const unlocked = authed === true || (required ? moduleDone(required) : false);
              const progress = snapshot.challenges[c.id];

              return (
                <li key={c.id} className="e-rise relative" style={{ "--i": i } as React.CSSProperties}>
                  {/* Shown on hover and keyboard focus; on touch the same
                      condition is the last line of the card. */}
                  {!unlocked && (
                    <span id={`tip-${c.id}`} role="tooltip" className="e-tip e-mono">
                      {t(ui.unlockedBy, lang)} · M{pad(required?.n ?? 0)}
                      {required ? ` ${t(required.title, lang)}` : ""}
                    </span>
                  )}
                  <Link
                    href={`/c/${c.id}`}
                    className="block h-full"
                    aria-describedby={unlocked ? undefined : `tip-${c.id}`}
                  >
                    <article data-locked={!unlocked} className="e-challenge flex h-full flex-col gap-3.5 p-6 sm:p-[30px]">
                      <div
                        className={`e-mono flex items-center justify-between text-[11px] uppercase tracking-[0.08em] ${unlocked ? "opacity-[0.72]" : ""}`}
                      >
                        <span>
                          {t(ui.challenge, lang)} {pad(c.n)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          {unlocked ? (
                            progress?.status === "completed" ? t(ui.completed, lang) : t(ui.ready, lang)
                          ) : (
                            <span className="e-lock">
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              {t(ui.locked, lang)}
                            </span>
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

        <footer className="e-mono flex flex-col gap-4 pb-2 pt-8" style={{ borderTop: "1px solid var(--e-divider)" }}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.08em]">
            <span className="text-[12px] font-semibold tracking-[0.1em]">Apex Academy</span>
            <span>
              {allLessons.length} {t(ui.lessons, lang)} · {lang === "es" ? "publicadas" : "published"}
            </span>
          </div>
          {/* Credit line (footer proposal A). Mixed toward the page colour instead
              of opacity, so the accent span keeps its own full contrast. */}
          <p
            className="m-0 text-[11px] leading-[1.6] tracking-[0.02em]"
            style={{ color: "color-mix(in srgb, var(--e-ink) 80%, var(--e-bg))" }}
          >
            {lang === "es" ? "construido por elias · salesforce admin · con " : "built by elias · salesforce admin — with "}
            <span style={{ color: "var(--e-credit-accent)" }}>claude code</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
