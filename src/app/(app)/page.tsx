"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { course, requiredLessons } from "@/content/course";
import { useProgress, useSettings } from "@/components/providers";
import { MascotMark } from "@/components/logo";
import { HomeOtter } from "@/components/home-otter";
import { t, ui } from "@/lib/i18n";
import type { L, Lesson, LessonStatus, Module, ModuleCategory } from "@/lib/types";

/**
 * Home — "La cumbre": the course as a climb, in five stages up to the summit.
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

/* -------------------------------------------------------------- hero title */

/**
 * The headline, described by its parts so the animation never depends on one
 * language's wording: `lead` stays in the text colour, `accent` takes the
 * brand green, and the word `mark` gets the marker underline.
 */
const HERO_TITLE: { lead: L; accent: L; mark: string } = {
  lead: { es: "De Admin a", en: "From Admin to" },
  accent: { es: "desarrollador Apex.", en: "Apex developer." },
  mark: "Apex",
};
const WORD_STEP = 80; // ms between one word and the next
const WORD_TIME = 600; // ms each word takes to rise

/** When the headline's reveal ends, in ms: what follows waits for it. */
const heroTitleEnd = (lang: "es" | "en") =>
  (`${t(HERO_TITLE.lead, lang)} ${t(HERO_TITLE.accent, lang)}`.split(" ").length - 1) * WORD_STEP + WORD_TIME;

function HeroTitle() {
  const { lang } = useSettings();
  const lead = t(HERO_TITLE.lead, lang).split(" ");
  const accent = t(HERO_TITLE.accent, lang).split(" ");
  const words = [...lead.map((w) => ({ w, accent: false })), ...accent.map((w) => ({ w, accent: true }))];
  const { mark } = HERO_TITLE;

  return (
    <h1
      className="m-0 text-[clamp(2.5rem,1.4rem+3.6vw,4rem)] font-bold leading-[1.06] tracking-[-0.025em] [text-wrap:balance] xl:text-[4.5rem]"
      style={{ "--title-end": `${heroTitleEnd(lang)}ms` } as React.CSSProperties}
    >
      {/* One sentence for screen readers; the word-by-word version is visual only. */}
      <span className="sr-only">
        {t(HERO_TITLE.lead, lang)} {t(HERO_TITLE.accent, lang)}
      </span>
      <span aria-hidden>
        {words.map(({ w, accent: green }, i) => (
          <span key={i}>
            {i > 0 && " "}
            <span className="e-word">
              <span
                className="e-word-in"
                style={{ "--w": i, color: green ? "var(--e-accent-text)" : undefined } as React.CSSProperties}
              >
                {w.startsWith(mark) ? (
                  <>
                    <span className="e-mark">{mark}</span>
                    {w.slice(mark.length)}
                  </>
                ) : (
                  w
                )}
              </span>
            </span>
          </span>
        ))}
      </span>
    </h1>
  );
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
      className="e-header sticky top-0 z-30 -mx-5 flex items-center justify-between gap-3 px-5 py-2.5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:-mb-6 lg:px-12 xl:-mx-24 xl:px-24"
    >
      <Link href="/" className="inline-flex min-h-[44px] min-w-[44px] items-center gap-2.5 text-[var(--e-ink)]">
        <MascotMark size={44} className="shrink-0" />
        {/* Under 400px the controls leave no room: the mascot alone carries the
            brand (its alt text still names it for screen readers). */}
        <span className="text-[20px] font-bold leading-none tracking-[-0.01em] max-[399px]:hidden">Apex Academy</span>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5">
        <a href="#ruta" className="e-mono e-press hidden min-h-[44px] items-center px-3 text-[12px] font-semibold uppercase tracking-[0.06em] hover:opacity-75 sm:inline-flex">
          {lang === "es" ? "Mi ruta" : "My route"}
        </a>
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
              className="e-press inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[3px] px-2.5 text-[12px] font-semibold uppercase tracking-[0.06em]"
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
          <Link href="/login?next=/" className="-my-4 inline-block py-4 underline underline-offset-4">
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
  return (
    <Link href={`/m/${mod.id}/${lesson.slug}`} className="e-upnext group flex w-full items-center gap-4 p-5">
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="e-mono text-[11px] uppercase tracking-[0.06em]">
          {lang === "es" ? "Siguiente" : "Up next"} · M{mod.n}.{pad(lesson.n)} · {lesson.minutes} min
        </span>
        <span className="text-[20px] font-bold leading-[1.2]">{t(lesson.title, lang)}</span>
        {status === "in_progress" && (
          <span className="e-mono mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] uppercase tracking-[0.04em]">
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
        )}
      </span>
      <span
        className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-[22px] px-[18px] text-[15px] font-semibold"
        style={{ background: "var(--e-accent)", color: "var(--e-on-accent)" }}
      >
        {lang === "es" ? "Abrir" : "Open"}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------ route to the summit */

/** One line per module: on the route, the full subtitle is too long to scan. */
const MODULE_SHORT: Record<string, L> = {
  m01: { es: "Tipos, datos, colecciones y el hueco donde no hay nada.", en: "Types, data, collections and the gap where there is nothing." },
  m02: { es: "Decidir y repetir: lo que en Flow eran nodos de decisión y bucles.", en: "Deciding and repeating: what Flow drew as decision nodes and loops." },
  m03: { es: "El equivalente en código a un Report Type con filtros.", en: "The code equivalent of a Report Type with filters." },
  m04: { es: "Escribir en la base de datos sin que la org te pare los pies.", en: "Writing to the database without the org shutting you down." },
  m05: { es: "Del objeto de Salesforce al objeto de Apex: definir tus propios moldes.", en: "From the Salesforce object to the Apex object: defining your own moulds." },
  m06: { es: "La automatización que corre cuando nadie mira: el Record-Triggered Flow, en código.", en: "The automation that runs when nobody is looking: the Record-Triggered Flow, in code." },
  m07: { es: "Un trigger por objeto, toda la lógica fuera.", en: "One trigger per object, all the logic outside." },
  m08: { es: "El fault path de tus flows, pero con tipos.", en: "The fault path of your flows, but with types." },
  m09: { es: "@future, Queueable, Batch y Scheduled, y cuándo usar cada uno.", en: "@future, Queueable, Batch and Scheduled, and when to use each." },
  m10: { es: "El 75 % no es la meta: es el mínimo para desplegar.", en: "75% is not the goal: it is the minimum to deploy." },
  m11: { es: "Callouts HTTP, JSON, Named Credentials, tu propia API y SOAP.", en: "HTTP callouts, JSON, Named Credentials, your own API and SOAP." },
  m12: { es: "Sharing, permisos de objeto y de campo, modo usuario e inyección de SOQL.", en: "Sharing, object and field permissions, user mode and SOQL injection." },
};

function TrailChallenge({ challenge: c, unlocked }: { challenge: (typeof course.challenges)[number]; unlocked: boolean }) {
  const { lang } = useSettings();
  const { snapshot } = useProgress();
  const required = course.modules.find((m) => m.id === c.requires);
  const progress = snapshot.challenges[c.id];
  return (
    <ul>
      <li className="relative">
        {/* Shown on hover and keyboard focus; on touch the same condition is
            written on the card. */}
        {!unlocked && (
          <span id={`tip-${c.id}`} role="tooltip" className="e-tip e-mono">
            <MascotMark size={26} className="shrink-0" />
            <span>
              {t(ui.unlockedBy, lang)} · M{pad(required?.n ?? 0)}
              {required ? ` ${t(required.title, lang)}` : ""}
            </span>
          </span>
        )}
        <Link href={`/c/${c.id}`} className="block" aria-describedby={unlocked ? undefined : `tip-${c.id}`}>
          <article data-locked={!unlocked} className="e-challenge flex flex-wrap items-center gap-x-5 gap-y-3 p-[22px]">
            {!unlocked && (
              <span className="e-lock">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {t(ui.locked, lang)}
              </span>
            )}
            <span className="flex min-w-0 flex-[1_1_280px] flex-col gap-1">
              <span className="e-mono text-[11px] uppercase tracking-[0.08em]">
                {t(ui.challenge, lang)} {pad(c.n)}
              </span>
              <span className="text-[21px] font-bold leading-[1.2]">{t(c.title, lang)}</span>
            </span>
            {unlocked ? (
              <span className="e-mono text-[12px] uppercase tracking-[0.06em]">
                {progress?.status === "completed" ? t(ui.completed, lang) : t(ui.ready, lang)} · {c.components.length}{" "}
                {t(ui.components, lang).toLowerCase()} · {c.minutes} min
              </span>
            ) : (
              /* the otter keeps you company here too, with the way in */
              <span className="e-mono flex items-center gap-2.5 text-[12px] uppercase tracking-[0.06em]">
                <MascotMark size={30} className="e-lock-otter shrink-0" />
                {t(ui.unlockedBy, lang)} · M{pad(required?.n ?? 0)}
              </span>
            )}
          </article>
        </Link>
      </li>
    </ul>
  );
}

function TrailStage({
  n,
  name,
  modules,
  statusOf,
  moduleDone,
  currentId,
}: {
  n: number;
  name: L;
  modules: Module[];
  statusOf: (id: string) => LessonStatus;
  moduleDone: (m: Module) => boolean;
  currentId?: string;
}) {
  const { lang } = useSettings();
  const [ref, inView] = useInView<HTMLDivElement>();
  const done = modules.every(moduleDone);
  const here = !done && modules.some((m) => m.id === currentId);
  const challenges = course.challenges.filter((c) => modules.some((m) => m.id === c.requires));

  return (
    <div ref={ref} data-in={inView} className="e-stagger e-stage">
      <div className="flex flex-col items-center">
        <span data-state={done ? "done" : here ? "here" : "next"} className="e-node" aria-hidden>
          {done ? "✓" : here ? <MascotMark size={44} /> : n}
        </span>
        {/* the trail paints itself over the stages already climbed */}
        <span aria-hidden className="e-rail">
          <span className="e-rail-fill" style={{ transform: `scaleY(${done && inView ? 1 : 0})` }} />
        </span>
      </div>

      <div className="flex min-w-0 flex-col gap-3.5 pb-9">
        <h3 className="m-0 flex min-h-[44px] items-center text-[23px] font-bold leading-[1.2]">
          {t(name, lang)}
          {(done || here) && (
            <span className="sr-only">
              {" "}
              ({done ? t(ui.completed, lang) : lang === "es" ? "estás aquí" : "you are here"})
            </span>
          )}
        </h3>

        <ul className="e-stage-grid">
          {modules.map((m, i) => {
            const ready = m.status === "ready";
            const total = requiredLessons(m).length;
            const count = requiredLessons(m).filter((l) => statusOf(l.id) === "completed").length;
            const state = moduleDone(m) ? "done" : ready && m.id === currentId ? "current" : ready ? "ready" : "planned";
            const tag =
              state === "done"
                ? t(ui.completed, lang)
                : state === "current"
                  ? lang === "es"
                    ? "En curso"
                    : "In progress"
                  : state === "ready"
                    ? t(ui.ready, lang)
                    : t(ui.planned, lang);
            const card = (
              <article data-cat={m.category} data-state={state} className="e-module flex h-full flex-col gap-2.5 p-[22px]">
                <div className="flex items-center justify-between gap-2.5">
                  <span className="e-num text-[30px] font-bold leading-none">{pad(m.n)}</span>
                  <span data-state={state} className="e-tag e-mono text-[11px] tracking-[0.02em]">
                    {state === "done" && <span aria-hidden>✓</span>}
                    {tag}
                  </span>
                </div>
                <span className="e-title text-[20px] font-bold leading-[1.2]">{t(m.title, lang)}</span>
                <p className="m-0 flex-1 text-[15px] leading-[1.45]">{t(MODULE_SHORT[m.id] ?? m.subtitle, lang)}</p>
                <span className="e-mono text-[12px]">
                  {count}/{total} {lang === "es" ? "hecho" : "done"}
                </span>
                {total > 0 && (
                  <div aria-hidden className="e-track h-1 overflow-hidden rounded-[2px]">
                    <div
                      className="e-fill h-1"
                      style={{ transform: `scaleX(${inView ? count / total : 0})`, background: "var(--e-accent)" }}
                    />
                  </div>
                )}
              </article>
            );
            return (
              <li key={m.id} className="e-rise" style={{ "--i": i } as React.CSSProperties}>
                {ready && m.lessons[0] ? (
                  <Link href={`/m/${m.id}/${m.lessons[0].slug}`} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>

        {challenges.map((c) => {
          const required = modules.find((m) => m.id === c.requires);
          return <TrailChallenge key={c.id} challenge={c} unlocked={required ? moduleDone(required) : false} />;
        })}
      </div>
    </div>
  );
}

function Trail({
  statusOf,
  moduleDone,
  currentId,
}: {
  statusOf: (id: string) => LessonStatus;
  moduleDone: (m: Module) => boolean;
  currentId?: string;
}) {
  const { lang } = useSettings();
  return (
    <section id="ruta" className="flex scroll-mt-[80px] flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 text-[clamp(1.875rem,1.2rem+2.2vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.02em]">
          {lang === "es" ? "Tu ruta a la cumbre" : "Your route to the summit"}
        </h2>
        <p className="m-0 text-[17px] leading-[1.5]">
          {lang === "es"
            ? `Cinco etapas, ${course.modules.length} módulos y ${course.challenges.length} desafíos. Cada etapa se apoya en la anterior.`
            : `Five stages, ${course.modules.length} modules and ${course.challenges.length} challenges. Each stage builds on the one before.`}
        </p>
      </div>

      <div className="flex flex-col">
        {CATEGORIES.map((c, i) => (
          <TrailStage
            key={c.id}
            n={i + 1}
            name={c.name}
            modules={course.modules.filter((m) => m.category === c.id)}
            statusOf={statusOf}
            moduleDone={moduleDone}
            currentId={currentId}
          />
        ))}
        <div className="e-stage items-center">
          <svg aria-hidden width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="22" fill="var(--e-accent)" />
            <path d="M11 31 22 13l11 18Z" fill="none" stroke="var(--e-on-accent)" strokeWidth="2.4" strokeLinejoin="round" />
          </svg>
          <p className="m-0 text-[23px] font-bold leading-[1.2]">
            {lang === "es" ? "La cumbre: listo para el trabajo y para PD1." : "The summit: ready for the job and for PD1."}
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- page */

export default function HomePage() {
  const { lang } = useSettings();
  const { snapshot, ready: progressReady } = useProgress();

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

  // What the otter says follows the reader's progress.
  const courseDone = allLessons.length > 0 && doneCount === allLessons.length;
  const nextIsModuleStart = !!nextUp && requiredLessons(nextUp.m)[0]?.id === nextUp.l.id;
  const prevModule = nextUp ? course.modules[course.modules.indexOf(nextUp.m) - 1] : undefined;
  const moduleJustDone = !courseDone && nextIsModuleStart && !!prevModule && moduleDone(prevModule);
  const otterSays = courseDone
    ? lang === "es"
      ? `¡Curso completo! Los ${course.modules.length} módulos son tuyos. Ahora, los desafíos.`
      : `Course complete! All ${course.modules.length} modules are yours. Now, the challenges.`
    : stepsDone === 0 || !nextUp
      ? lang === "es"
        ? "¡Hola! Soy tu nutria trailblazer. Voy módulo a módulo contigo, sin dar nada por sabido."
        : "Hi! I'm your trailblazer otter — I go module by module with you, taking nothing for granted."
      : moduleJustDone && prevModule
        ? lang === "es"
          ? `¡Módulo ${pad(prevModule.n)} terminado! Buen trabajo. Te espera «${t(nextUp.m.title, lang)}».`
          : `Module ${pad(prevModule.n)} done! Nice work. «${t(nextUp.m.title, lang)}» is waiting for you.`
        : lang === "es"
          ? `¡Qué bien verte! Vas por «${t(nextUp.l.title, lang)}». ¿Seguimos?`
          : `Good to see you! You are on «${t(nextUp.l.title, lang)}». Shall we continue?`;

  // The saved language arrives right after hydration. The hero's reveal waits
  // one frame for it, so it plays once and in the reader's language.
  const [heroArmed, setHeroArmed] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroArmed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // The otter gets excited while the main button is hovered or focused.
  const [cheer, setCheer] = useState(false);

  // It celebrates once when this browser comes back with more lessons done
  // than the last time the home was open.
  const [party, setParty] = useState(0);
  useEffect(() => {
    if (!progressReady) return;
    try {
      const raw = localStorage.getItem("apex.home.seenDone");
      if (raw !== null && doneCount > Number(raw)) setParty((p) => p + 1);
      localStorage.setItem("apex.home.seenDone", String(doneCount));
    } catch {
      /* private mode: no celebration, nothing else changes */
    }
  }, [progressReady, doneCount]);

  // The bar starts empty and fills to the real value after the first paint,
  // and again whenever the value changes.
  const [shownPct, setShownPct] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShownPct(overallPct));
    return () => cancelAnimationFrame(id);
  }, [overallPct]);

  return (
    <div className="editorial min-h-dvh">
      <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 pb-8 pt-2 sm:px-8 sm:pb-12 sm:pt-3 lg:gap-16 lg:px-12 lg:pb-16 xl:px-24 xl:pb-[88px]">
        <Header />

        {/* ------------------------------------------------------------ hero */}
        {/* Phone: otter, then the copy, then the card. Desktop: the copy on the
            left; the otter on the right, presenting the card under it. */}
        <section className="grid grid-cols-1 gap-9 lg:grid-cols-[minmax(0,1fr)_420px] lg:grid-rows-[auto_1fr] lg:gap-x-[72px] lg:gap-y-9 xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="lg:col-start-2 lg:row-start-1">
            <HomeOtter
              label={lang === "es" ? "Tu guía en el curso" : "Your guide through the course"}
              message={otterSays}
              excited={cheer}
              celebrate={party}
            />
          </div>

          {/* The headline reveals first; the rest follows it in a cascade. */}
          <div
            data-armed={heroArmed}
            className="e-hero-copy flex min-w-0 flex-col gap-6 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center"
            style={{ "--t0": `${heroTitleEnd(lang) - 250}ms` } as React.CSSProperties}
          >
            <HeroTitle />

            <p className="e-after m-0 max-w-[600px] text-[17px] leading-[1.65] sm:text-[18px]" style={{ "--k": 1 } as React.CSSProperties}>
              {lang === "es"
                ? "Cada concepto se explica desde algo que ya configuraste con clicks, y nunca se te pide escribir nada que no se haya explicado antes."
                : "Every concept starts from something you already configured with clicks, and you are never asked to write anything that has not been explained first."}
            </p>

            <div className="e-after mt-2 flex flex-col gap-3.5 sm:flex-row" style={{ "--k": 3 } as React.CSSProperties}>
              {nextUp && (
                <Link
                  href={`/m/${nextUp.m.id}/${nextUp.l.slug}`}
                  className="e-btn e-btn-primary"
                  onPointerEnter={() => setCheer(true)}
                  onPointerLeave={() => setCheer(false)}
                  onFocus={() => setCheer(true)}
                  onBlur={() => setCheer(false)}
                >
                  {stepsDone === 0 ? t(ui.startCourse, lang) : lang === "es" ? "Continuar la subida" : "Keep climbing"}{" "}
                  <span className="e-arrow" aria-hidden>
                    →
                  </span>
                </Link>
              )}
              <a href="#ruta" className="e-btn e-btn-secondary">
                {lang === "es" ? "Ver la ruta" : "See the route"}
              </a>
            </div>

            {allLessons.length > 0 && (
              <div className="e-after mt-5 flex flex-col gap-2.5" style={{ "--k": 4 } as React.CSSProperties}>
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
                  className="h-3 overflow-hidden rounded-[6px]"
                  style={{ background: "var(--e-track-bg)" }}
                >
                  <div className="e-fill h-3 rounded-[6px]" style={{ transform: `scaleX(${shownPct / 100})`, background: "var(--e-accent)" }} />
                </div>
              </div>
            )}
          </div>

          {nextUp && (
            <div className="e-rise self-start lg:col-start-2 lg:row-start-2" style={{ "--i": 3 } as React.CSSProperties}>
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
            </div>
          )}
        </section>

        {/* ----------------------------------------------- route to the summit */}
        <Trail statusOf={statusOf} moduleDone={moduleDone} currentId={nextUp?.m.id} />

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
