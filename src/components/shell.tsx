"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MascotMark } from "./logo";
import { LangToggle, ThemeToggle } from "./toggles";
import { useProgress, useSettings } from "./providers";
import { course } from "@/content/course";
import { t, ui } from "@/lib/i18n";
import type { LessonStatus } from "@/lib/types";

/**
 * Start a module over. Useful when its exercises change: it clears that
 * module's ticks and saved code and leaves every other module alone.
 */
function ResetModuleButton({ moduleId, moduleTitle }: { moduleId: string; moduleTitle: string }) {
  const { lang } = useSettings();
  const { resetModule } = useProgress();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 5000);
    return () => clearTimeout(timer);
  }, [confirming]);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="t-micro flex min-h-[36px] w-full items-center gap-1.5 rounded-[4px] px-2.5 text-left text-faint transition hover:bg-surface-2 hover:text-ink"
      >
        ↻ {lang === "es" ? "Reiniciar este módulo" : "Restart this module"}
      </button>
    );
  }

  return (
    <div className="rounded-[4px] border px-2.5 py-2" style={{ borderColor: "var(--c-warn)" }}>
      <p className="t-micro text-muted">
        {lang === "es"
          ? `Se borrará tu progreso y tu código de «${moduleTitle}». El resto no se toca.`
          : `Your progress and code for “${moduleTitle}” will be cleared. Nothing else is touched.`}
      </p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={async () => {
            await resetModule(moduleId);
            // Reload so an open exercise editor drops the old code it still
            // holds in memory instead of autosaving it back.
            window.location.reload();
          }}
          className="t-micro min-h-[32px] rounded-[4px] px-2.5 font-semibold"
          style={{ background: "var(--c-warn-soft)", color: "var(--c-warn)" }}
        >
          {lang === "es" ? "Sí, reiniciar" : "Yes, restart"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="t-micro min-h-[32px] rounded-[4px] px-2.5 text-muted"
        >
          {lang === "es" ? "Cancelar" : "Cancel"}
        </button>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-brand">
        <circle cx="8" cy="8" r="7" fill="currentColor" />
        <path
          d="M5 8.2 7 10.2 11 6"
          fill="none"
          stroke="var(--c-bg)"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "in_progress") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-brand">
        <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 8 V2.5 A5.5 5.5 0 0 1 13.5 8 Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" className="shrink-0 text-faint">
      <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { lang, theme } = useSettings();
  const { snapshot, authed } = useProgress();
  const pathname = usePathname();

  const statusOf = (lessonId: string): LessonStatus =>
    snapshot.lessons[lessonId]?.status ?? "not_started";

  const moduleDone = (moduleId: string) => {
    const mod = course.modules.find((m) => m.id === moduleId);
    if (!mod || !mod.lessons.length) return false;
    return mod.lessons.every((l) => statusOf(l.id) === "completed");
  };

  return (
    <nav className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <Link href="/" onClick={onNavigate} className="inline-flex min-h-[44px] items-center rounded-[4px]">
          <span className="inline-flex items-center gap-2.5">
            <MascotMark theme={theme} size={30} className="shrink-0" />
            <span className="flex items-baseline gap-1.5 leading-none">
              <span className="text-[0.975rem] font-bold tracking-[-0.025em] text-heading">Apex</span>
              <span className="text-[0.975rem] tracking-[-0.01em] text-muted">Academy</span>
            </span>
          </span>
        </Link>
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto px-3 pb-6">
        <p className="t-eyebrow px-2 pt-2 pb-2">{t(ui.modules, lang)}</p>

        <ul className="space-y-0.5">
          {course.modules.map((m) => {
            const isPlanned = m.status === "planned";
            const open = pathname.startsWith(`/m/${m.id}`);
            const done = m.lessons.filter((l) => statusOf(l.id) === "completed").length;

            return (
              <li key={m.id}>
                <div
                  className={`flex items-start gap-2.5 rounded-[4px] px-2 py-2 ${
                    isPlanned ? "opacity-45" : ""
                  }`}
                >
                  <span className="mt-[3px] w-5 shrink-0 font-mono text-[0.72rem] tabular-nums text-faint">
                    {String(m.n).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="t-small font-medium leading-snug text-heading">
                      {t(m.title, lang)}
                    </p>
                    {!isPlanned && (
                      <p className="t-micro text-faint mt-0.5">
                        {done}/{m.lessons.length} {t(ui.lessonsDone, lang)}
                      </p>
                    )}
                    {isPlanned && (
                      <p className="t-micro text-faint mt-0.5">{t(ui.comingSoon, lang)}</p>
                    )}
                  </div>
                </div>

                {!isPlanned && (open || course.modules.filter((x) => x.status === "ready").length === 1) && (
                  <ul className="mt-0.5 mb-2 ml-[26px] space-y-0.5 border-l border-line pl-2">
                    {m.lessons.map((l) => {
                      const href = `/m/${m.id}/${l.slug}`;
                      const active = pathname === href;
                      return (
                        <li key={l.id}>
                          <Link
                            href={href}
                            onClick={onNavigate}
                            className={`flex min-h-[42px] items-center gap-2.5 rounded-[4px] px-2.5 py-2 transition ${
                              active
                                ? "bg-brand-soft text-ink"
                                : "text-muted hover:bg-surface-2 hover:text-ink"
                            }`}
                          >
                            <StatusDot status={statusOf(l.id)} />
                            <span
                              className={`t-small min-w-0 flex-1 leading-snug ${
                                l.kind === "checkpoint" ? "font-medium" : ""
                              }`}
                            >
                              {t(l.title, lang)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                    {open && m.lessons.some((l) => statusOf(l.id) !== "not_started") && (
                      <li className="pt-1">
                        <ResetModuleButton moduleId={m.id} moduleTitle={t(m.title, lang)} />
                      </li>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <p className="t-eyebrow px-2 pt-6 pb-2">{t(ui.challenges, lang)}</p>
        <ul className="space-y-0.5">
          {course.challenges.map((c) => {
            const unlocked = authed === true || moduleDone(c.requires);
            const href = `/c/${c.id}`;
            const active = pathname === href;
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  className={`flex items-start gap-2.5 rounded-[4px] px-2 py-2 transition ${
                    active ? "bg-accent-soft" : "hover:bg-surface-2"
                  } ${unlocked ? "" : "opacity-55"}`}
                >
                  <span className="mt-[2px] shrink-0 text-accent">
                    {unlocked ? (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 1.6 9.9 5.6 14.3 6.2 11.1 9.3 11.9 13.7 8 11.6 4.1 13.7 4.9 9.3 1.7 6.2 6.1 5.6Z" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3.2" y="7" width="9.6" height="7" rx="1.6" />
                        <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
                      </svg>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="t-small font-medium leading-snug text-ink">
                      {t(ui.challenge, lang)} {c.n}
                    </p>
                    <p className="t-micro text-faint mt-0.5 line-clamp-1">
                      {t(c.title, lang)}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-3">
        <LangToggle />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

/** "Entrar" when signed out (progress stays on this device), sign-out icon when in. */
function SignOutButton() {
  const pathname = usePathname();
  const { lang } = useSettings();
  const { authed, logout } = useProgress();

  if (authed === null) return null;
  if (!authed) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(pathname)}`}
        className="btn btn-primary btn-mono min-h-[40px] px-3.5 py-0"
      >
        {t(ui.signIn, lang)}
      </Link>
    );
  }

  return (
    <button
      onClick={() => void logout()}
      title={t(ui.signOut, lang)}
      aria-label={t(ui.signOut, lang)}
      className="grid h-10 w-10 place-items-center rounded-[4px] border border-line bg-surface text-muted transition hover:text-ink"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5M21 12H9" />
      </svg>
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme } = useSettings();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // The home is a full-width dashboard with its own header: no sidebar there.
  // The sidebar (and the mobile drawer) appear once you open a module.
  if (pathname === "/") return <>{children}</>;

  return (
    <div className="lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-line lg:bg-surface">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-bg/85 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Menu"
          className="grid h-10 w-10 place-items-center rounded-[4px] border border-line bg-surface text-muted"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
        <Link href="/" className="flex min-h-[44px] items-center gap-2 px-1">
          <MascotMark theme={theme} size={28} className="shrink-0" />
          <span className="text-[0.925rem] font-bold tracking-[-0.025em] text-heading">
            Apex Academy
          </span>
        </Link>
        <div className="w-9" />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-[rgb(0_0_0/0.35)] backdrop-blur-[2px]"
          />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-[300px] border-r border-line bg-bg shadow-[var(--shadow-pop)]">
            <SidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="min-w-0">{children}</div>
    </div>
  );
}
