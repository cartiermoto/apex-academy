"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { Lang } from "@/lib/types";

/**
 * Shown when a quiz is passed: two cannons fire confetti from the bottom
 * corners of the screen, a pennant swings from the top of the result card and
 * the otter pops in at its corner. All colours come from the user's palette
 * (--c-brand, --cf2..cf5 set per palette in globals.css), so it matches
 * whichever one they chose. Decorative only: the result text carries the
 * meaning, so everything here is aria-hidden. With «reduce motion» the
 * confetti is not drawn at all.
 */

const BITS_PER_SIDE = 30;

function bits() {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const out: Array<{ side: 0 | 1; style: CSSProperties }> = [];
  for (let side = 0 as 0 | 1; side < 2; side = (side + 1) as 0 | 1) {
    for (let k = 0; k < BITS_PER_SIDE; k++) {
      const w = 7 + rnd() * 6;
      const h = 10 + rnd() * 9;
      const round = rnd() < 0.3;
      out.push({
        side,
        style: {
          width: Math.round(w),
          height: Math.round(round ? w : h),
          borderRadius: round ? "50%" : 2,
          background: `var(--cf${((k + side) % 5) + 1})`,
          ["--kx" as string]: (0.15 + rnd() * 0.85).toFixed(2),
          ["--ky" as string]: (0.45 + rnd() * 0.55).toFixed(2),
          ["--r" as string]: `${Math.round((rnd() - 0.5) * 900)}deg`,
          animationDelay: `${(0.1 + rnd() * 0.25).toFixed(2)}s`,
          animationDuration: `${(2.4 + rnd() * 1.2).toFixed(2)}s`,
        } as CSSProperties,
      });
    }
  }
  return out;
}

export function QuizCelebration({ lang }: { lang: Lang }) {
  const pieces = useMemo(bits, []);
  const [shooting, setShooting] = useState(true);

  // the fixed layer is removed once the confetti has landed
  useEffect(() => {
    const id = setTimeout(() => setShooting(false), 5200);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <div className="cele-pennant" aria-hidden="true">
        <div className="cele-pennant-in">{lang === "es" ? "¡Superado!" : "Passed!"}</div>
      </div>
      <div className="cele-otter" aria-hidden="true">
        <span className="mascot-full cele-otter-img" />
        <svg className="cele-star cele-star-1" width="22" height="22" viewBox="0 0 24 24">
          <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="var(--cf3)" />
        </svg>
        <svg className="cele-star cele-star-2" width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" fill="var(--c-brand)" />
        </svg>
      </div>
      {shooting && (
        <div className="cele-layer" aria-hidden="true">
          <span className="cele-flash cele-flash-l" />
          <span className="cele-flash cele-flash-r" />
          {pieces.map((p, i) => (
            <span key={i} className={`cele-bit ${p.side === 0 ? "cele-bit-l" : "cele-bit-r"}`} style={p.style} />
          ))}
        </div>
      )}
    </>
  );
}
