"use client";

import { useEffect, useState } from "react";
import { useProgress, useSettings } from "./providers";
import { computeStreak } from "@/lib/streak";

/** Monday first, as the week in computeStreak. */
const LETTERS = {
  es: ["L", "M", "X", "J", "V", "S", "D"],
  en: ["M", "T", "W", "T", "F", "S", "S"],
} as const;

function Flame({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2c1.2 3.4 5 5.6 5 10.2A5 5 0 0 1 7 12.2c0-1.7.7-3 1.6-4.1.2 1.1.9 1.9 1.7 2.2C9.9 7.6 10.7 4.6 12 2z"
        fill="var(--e-flame)"
      />
      <path d="M12 22a3 3 0 0 1-3-3c0-1.6 1.2-2.4 3-4.4 1.8 2 3 2.8 3 4.4a3 3 0 0 1-3 3z" fill="var(--e-flame-soft)" />
    </svg>
  );
}

/**
 * The streak card on the home. A day counts when the student completes any one
 * section (theory, quiz or exercise); the card says what is missing today.
 */
export function StreakCard() {
  const { lang } = useSettings();
  const { snapshot } = useProgress();
  const es = lang === "es";

  // "Today" is the browser's: nothing is drawn until it is known, so the server
  // render (which has another clock) and the first client render cannot disagree.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const shell = "rounded-[20px] border p-5";
  const shellStyle = { background: "var(--c-surface)", borderColor: "var(--e-divider)", color: "var(--e-ink)" } as const;

  if (!mounted) return <div className={shell} style={{ ...shellStyle, minHeight: 190 }} aria-hidden="true" />;

  const s = computeStreak(snapshot.days);
  const days = (n: number) => (es ? `${n} ${n === 1 ? "día" : "días"}` : `${n} ${n === 1 ? "day" : "days"}`);
  const next = s.current + 1;

  let message: string;
  if (s.doneToday) {
    message = es
      ? `Hoy ya sumaste. Vuelve mañana y tu racha pasa a ${days(next)}.`
      : `You scored today. Come back tomorrow and your streak reaches ${days(next)}.`;
  } else if (s.current > 0) {
    message = es
      ? `Completa una sección hoy (teoría, quiz o ejercicio) y tu racha pasa a ${days(next)}.`
      : `Complete one section today (theory, quiz or exercise) and your streak reaches ${days(next)}.`;
  } else if (s.total > 0) {
    message = es
      ? "Tu racha se reinició. Completa una sección hoy (teoría, quiz o ejercicio) y empiezas otra."
      : "Your streak reset. Complete one section today (theory, quiz or exercise) and you start a new one.";
  } else {
    message = es
      ? "Completa una sección hoy (teoría, quiz o ejercicio) para empezar tu racha."
      : "Complete one section today (theory, quiz or exercise) to start your streak.";
  }

  const doneThisWeek = s.week.filter((d) => d.done).length;
  const letters = LETTERS[lang];

  return (
    <section className={shell} style={shellStyle} aria-label={es ? "Tu racha de estudio" : "Your study streak"}>
      <div className="flex items-center gap-4">
        <span
          className="grid h-[64px] w-[64px] shrink-0 place-items-center rounded-full"
          style={{ background: "var(--e-flame-soft)" }}
        >
          <Flame size={40} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="e-mono m-0 text-[11px] uppercase tracking-[0.1em]">{es ? "Tu racha" : "Your streak"}</p>
          <p className="m-0 text-[34px] font-bold leading-[1.1]">{days(s.current)}</p>
        </div>
        <div className="e-mono shrink-0 text-right text-[11px] uppercase leading-[1.5] tracking-[0.06em]">
          {es ? "Mejor" : "Best"}
          <br />
          <span className="text-[15px] font-semibold normal-case tracking-normal">{days(s.best)}</span>
        </div>
      </div>

      <div
        role="img"
        aria-label={
          es ? `Esta semana: ${doneThisWeek} de 7 días con estudio` : `This week: ${doneThisWeek} of 7 days studied`
        }
        className="mt-5"
      >
        <div className="flex gap-1.5" aria-hidden="true">
          {s.week.map((d) => (
            <span
              key={d.key}
              className="h-2.5 flex-1 rounded-full"
              style={
                d.done
                  ? { background: "var(--e-flame)" }
                  : d.isToday
                    ? { background: "var(--e-track-bg)", border: "1.5px dashed var(--e-flame)" }
                    : { background: "var(--e-track-bg)" }
              }
            />
          ))}
        </div>
        <div className="e-mono mt-2 flex gap-1.5 text-[11px] uppercase" aria-hidden="true">
          {s.week.map((d, i) => (
            <span key={d.key} className="flex-1 text-center" style={d.isToday ? { fontWeight: 700 } : undefined}>
              {letters[i]}
            </span>
          ))}
        </div>
      </div>

      <p className="m-0 mt-4 text-[15px] leading-[1.45]">{message}</p>
    </section>
  );
}
