"use client";

import { Fragment, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Lang } from "@/lib/types";
import { getTerm } from "@/content/glossary";
import { t } from "@/lib/i18n";

/**
 * Glossary tooltip.
 *
 * Opens on hover where there is a mouse, and on tap where there is not — a
 * phone has no hover, so a hover-only tooltip would simply never appear there.
 * The popover is portalled to <body> so no scrolling table or card can clip it,
 * and it is clamped to the viewport so it never runs off a 360px screen.
 */
function Term({ id, children, lang }: { id: string; children: React.ReactNode; lang: Lang }) {
  const entry = getTerm(id);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tipId = useId();

  const place = useCallback(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const width = Math.min(300, vw - 24);
    const popHeight = popRef.current?.offsetHeight ?? 150;
    const above = r.top > popHeight + 16;
    const left = Math.max(12, Math.min(r.left + r.width / 2 - width / 2, vw - width - 12));
    const top = above ? r.top - popHeight - 8 : r.bottom + 8;
    setPos({ top, left, above });
  }, []);

  useEffect(() => {
    if (!open) return;
    place();
    // A second pass once the popover has its real height.
    const raf = requestAnimationFrame(place);

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target) || popRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onScroll = () => setOpen(false);

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  if (!entry) return <>{children}</>;

  const hoverCapable = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className="term"
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => {
          if (!hoverCapable()) return;
          hoverTimer.current = setTimeout(() => setOpen(true), 120);
        }}
        onMouseLeave={() => {
          if (!hoverCapable()) return;
          if (hoverTimer.current) clearTimeout(hoverTimer.current);
          hoverTimer.current = setTimeout(() => {
            if (!popRef.current?.matches(":hover")) setOpen(false);
          }, 160);
        }}
      >
        {children}
      </button>

      {open &&
        createPortal(
          <div
            ref={popRef}
            id={tipId}
            role="tooltip"
            onMouseLeave={() => hoverCapable() && setOpen(false)}
            className="fade-in fixed z-[60] rounded-[4px] border border-line-strong bg-surface p-4 text-left shadow-[var(--shadow-pop)]"
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              width: "min(300px, calc(100vw - 24px))",
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="t-eyebrow text-brand">{t(entry.term, lang)}</p>
              {entry.taughtIn && (
                <span className="t-eyebrow shrink-0 text-faint">{t(entry.taughtIn, lang)}</span>
              )}
            </div>
            <p className="t-small mt-2 text-ink">{t(entry.definition, lang)}</p>
            {entry.admin && (
              <p className="t-small mt-2.5 border-t border-line pt-2.5 text-muted">
                <span className="font-medium text-heading">
                  {lang === "es" ? "En Admin: " : "In Admin terms: "}
                </span>
                {t(entry.admin, lang)}
              </p>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

/** Matches [[id]] and [[id|visible text]]. */
const TERM_RE = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Renders a course string, turning glossary markers into tooltips.
 * Plain strings without markers come back unchanged.
 */
export function RichText({ text, lang }: { text: string; lang: Lang }) {
  if (!text.includes("[[")) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  TERM_RE.lastIndex = 0;

  while ((match = TERM_RE.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, id, visible] = match;
    const entry = getTerm(id);
    const label = visible ?? (entry ? t(entry.term, lang) : id);
    parts.push(
      <Term key={match.index} id={id} lang={lang}>
        {label}
      </Term>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </>
  );
}

/** Strip markers to plain text — for places that cannot hold a tooltip. */
export function plainText(text: string, lang: Lang): string {
  return text.replace(TERM_RE, (_, id: string, visible?: string) => {
    if (visible) return visible;
    const entry = getTerm(id);
    return entry ? t(entry.term, lang) : id;
  });
}
