"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The otter as the home page's host: it bounces in, greets, talks through a
 * speech bubble that types itself, idles with a slow float and breath, leans
 * toward the cursor and reacts to the reader.
 *
 * The illustration is one flat PNG, so every reaction moves the whole figure
 * (transform and opacity only): there are no layers to blink or wave with.
 * Each kind of motion sits on its own wrapper so they compose instead of
 * overwriting one another. With reduced motion the picture simply stays put.
 */

type Mood = "idle" | "greet" | "hop" | "celebrate";

const calm = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** How many characters of `text` are visible: it types itself after `delay`. */
function useTyped(text: string, delay: number) {
  const [n, setN] = useState(text.length);
  useEffect(() => {
    if (calm()) {
      setN(text.length);
      return;
    }
    setN(0);
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= text.length) clearInterval(interval);
      }, 22);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, delay]);
  return n;
}

const CONFETTI = [
  { dx: -92, dy: -96, c: "var(--e-accent)" },
  { dx: -54, dy: -128, c: "var(--e-cat-logic-accent)" },
  { dx: -14, dy: -140, c: "var(--e-cat-obj-accent)" },
  { dx: 30, dy: -132, c: "var(--e-cat-fund-accent)" },
  { dx: 70, dy: -112, c: "var(--e-accent)" },
  { dx: 104, dy: -78, c: "var(--e-cat-logic-accent)" },
  { dx: -116, dy: -52, c: "var(--e-cat-obj-accent)" },
  { dx: 122, dy: -38, c: "var(--e-cat-fund-accent)" },
];

export function HomeOtter({
  label,
  message,
  excited,
  celebrate,
}: {
  /** small heading of the bubble */
  label: string;
  /** what the otter says; changing it types the new line */
  message: string;
  /** true while the reader hovers the main call to action */
  excited: boolean;
  /** bump this number to make the otter celebrate once */
  celebrate: number;
}) {
  const [mood, setMood] = useState<Mood>("idle");
  const stage = useRef<HTMLDivElement>(null);
  const lean = useRef<HTMLDivElement>(null);
  const typed = useTyped(message, 650);

  // After the entrance bounce, a greeting sway.
  useEffect(() => {
    const id = setTimeout(() => setMood((m) => (m === "idle" ? "greet" : m)), 520);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (celebrate > 0) setMood("celebrate");
  }, [celebrate]);

  // Lean toward the cursor: desktop pointers only, never with reduced motion.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    if (!fine.matches || calm()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const box = stage.current?.getBoundingClientRect();
        const el = lean.current;
        if (!box || !el) return;
        const clamp = (v: number) => Math.max(-1, Math.min(1, v));
        const x = clamp((e.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2));
        const y = clamp((e.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2));
        el.style.setProperty("--lx", x.toFixed(3));
        el.style.setProperty("--ly", y.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const hop = () => setMood((m) => (m === "idle" ? "hop" : m));
  // One-shot reactions give way to the idle state when they finish.
  const shown = mood === "idle" && excited ? "excited" : mood;

  return (
    <div className="e-guide">
      <div ref={stage} className="e-otter-stage" onPointerEnter={hop} onPointerDown={hop}>
        <div ref={lean} className="e-otter-lean">
          <div className="e-otter-float">
            <div
              className="e-otter-react"
              data-mood={shown}
              onAnimationEnd={(e) => {
                if (e.target === e.currentTarget) setMood("idle");
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed illustration from /public */}
              <img
                className="e-otter-img"
                src="/mascot/apex-academy-mascota-verde-full-illustration.png"
                alt=""
                width={480}
                height={480}
                draggable={false}
              />
            </div>
          </div>
        </div>
        {mood === "celebrate" && (
          <span key={celebrate} className="e-confetti" aria-hidden>
            {CONFETTI.map((p, i) => (
              <i key={i} style={{ "--dx": `${p.dx}px`, "--dy": `${p.dy}px`, background: p.c } as React.CSSProperties} />
            ))}
          </span>
        )}
      </div>

      <div className="e-bubble">
        <p className="e-mono m-0 text-[11px] uppercase tracking-[0.1em]" style={{ color: "var(--e-accent-text)" }}>
          {label}
        </p>
        {/* The whole line is laid out from the start (the untyped part is only
            transparent), so typing never moves anything. */}
        <p className="m-0 mt-1.5 text-[14.5px] leading-[1.5] sm:text-[15px]">
          <span className="sr-only">{message}</span>
          <span aria-hidden>{message.slice(0, typed)}</span>
          <span aria-hidden className="opacity-0">
            {message.slice(typed)}
          </span>
        </p>
      </div>
    </div>
  );
}
