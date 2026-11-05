"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useSettings } from "./providers";
import { PALETTES } from "@/lib/palettes";
import { t, ui } from "@/lib/i18n";

type Pos = { left: number; width: number; top?: number; bottom?: number };

/**
 * Palette picker: a button that opens a small panel with the colour palettes.
 * The panel is drawn on <body> so no scrolling or clipped parent (the sidebar,
 * the sticky header) can cut it off. Choosing applies at once and stays open, so
 * the student can compare; Escape or a click outside closes it.
 */
export function PaletteMenu({
  className = "",
  placement = "down",
}: {
  className?: string;
  /** which side of the button the panel opens on */
  placement?: "down" | "up";
}) {
  const { lang, theme, palette, setPalette } = useSettings();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const selected = useRef<HTMLButtonElement>(null);

  const place = useCallback(() => {
    const el = btn.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    const left = Math.min(Math.max(12, r.right - width), window.innerWidth - width - 12);
    setPos(placement === "up" ? { left, width, bottom: window.innerHeight - r.top + 8 } : { left, width, top: r.bottom + 8 });
  }, [placement]);

  useEffect(() => {
    if (!open) return;
    place();
    selected.current?.focus();
    const onDown = (e: PointerEvent) => {
      const n = e.target as Node;
      if (!panel.current?.contains(n) && !btn.current?.contains(n)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  const es = lang === "es";
  const label = t(ui.palette, lang);

  return (
    <>
      <button
        ref={btn}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={label}
        className={className}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.8-.8 1.8-1.7 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" />
          <circle cx="7.5" cy="11" r="1" fill="currentColor" />
          <circle cx="10.5" cy="7" r="1" fill="currentColor" />
          <circle cx="15" cy="7.5" r="1" fill="currentColor" />
        </svg>
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={panel}
            role="dialog"
            aria-label={label}
            style={{ position: "fixed", left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, zIndex: 80, boxShadow: "var(--shadow-pop)" }}
            className="rounded-[16px] border border-line bg-surface p-4 text-ink"
          >
            <p className="t-micro mb-2.5 font-medium uppercase tracking-[0.1em] text-muted">{label}</p>
            <div className="flex flex-col gap-1.5">
              {PALETTES.map((p) => {
                const on = p.id === palette;
                const [accent, soft, bg] = theme === "dark" ? p.dark : p.light;
                return (
                  <button
                    key={p.id}
                    ref={on ? selected : undefined}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    aria-pressed={on}
                    className={`flex min-h-[56px] w-full items-center gap-3 rounded-[12px] border-2 px-3 py-2 text-left transition ${
                      on ? "border-brand bg-brand-soft" : "border-transparent hover:bg-surface-2"
                    }`}
                  >
                    <span className="flex shrink-0" aria-hidden="true">
                      <span className="h-[22px] w-[22px] rounded-full border-2" style={{ background: accent, borderColor: "var(--c-surface)" }} />
                      <span className="-ml-2 h-[22px] w-[22px] rounded-full border-2" style={{ background: soft, borderColor: "var(--c-surface)" }} />
                      <span className="-ml-2 h-[22px] w-[22px] rounded-full border-2" style={{ background: bg, borderColor: "var(--c-border)" }} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[16px] font-medium leading-tight">{t(p.name, lang)}</span>
                      <span className="t-micro block text-muted">{t(p.note, lang)}</span>
                    </span>
                    {on && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand" aria-hidden="true">
                        <path d="m5 12 5 5 9-10" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="t-micro mt-3 text-muted">
              {es ? "Tu elección se recuerda en este navegador." : "Your choice is remembered in this browser."}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}
