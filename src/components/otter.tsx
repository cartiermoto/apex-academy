"use client";

import { useState } from "react";
import type { Lang, Warmup } from "@/lib/types";
import { t } from "@/lib/i18n";
import { MascotMark } from "./logo";
import { RichText } from "./term";

/**
 * The otter speaking: avatar plus a speech bubble.
 *
 * The mascot is not decoration — it is the voice of an Admin who already made
 * the jump to code. It appears in the Admin parallels of the theory, in the
 * exercise hints, and when it reacts to a failed check or a solved task.
 */

type Tone = "admin" | "hint" | "oops" | "cheer";

const BG: Record<Tone, string> = {
  admin: "var(--c-brand-soft)",
  cheer: "var(--c-brand-soft)",
  hint: "var(--c-surface-2)",
  oops: "var(--c-surface-2)",
};

export function OtterSays({
  tone,
  eyebrow,
  lang,
  children,
  className = "",
}: {
  tone: Tone;
  eyebrow: React.ReactNode;
  lang: Lang;
  children: React.ReactNode;
  className?: string;
}) {
  const bg = BG[tone];
  // brand text passes on brand-soft in both themes; on surface-2 the eyebrow uses ink
  const eyebrowColor = tone === "admin" || tone === "cheer" ? "var(--c-brand)" : "var(--c-text)";
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <MascotMark size={40} label="" className="mt-0.5 shrink-0" />
      <div className="relative min-w-0 flex-1 rounded-[4px] px-4 py-3 sm:px-5" style={{ background: bg }}>
        {/* the bubble's tail, pointing at the otter */}
        <span aria-hidden className="absolute -left-[5px] top-[17px] h-[10px] w-[10px] rotate-45" style={{ background: bg }} />
        <p className="t-small relative font-semibold" style={{ color: eyebrowColor }}>
          <span className="sr-only">{lang === "es" ? "La nutria: " : "The otter: "}</span>
          {eyebrow}
        </p>
        <div className="t-small relative mt-1.5 leading-relaxed text-ink">{children}</div>
      </div>
    </div>
  );
}

/**
 * The otter's opening question: one quick recall of the previous lesson before
 * the theory starts. Answering is instant and never counts towards progress.
 */
export function OtterWarmup({ data, lang }: { data: Warmup; lang: Lang }) {
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  return (
    <OtterSays tone="admin" lang={lang} eyebrow={t(data.title, lang)} className="mb-8">
      <p>
        <RichText text={t(data.prompt, lang)} lang={lang} />
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {data.options.map((o, i) => {
          const right = answered && i === data.answer;
          const wrong = picked === i && i !== data.answer;
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => setPicked(i)}
              className="t-small min-h-[38px] rounded-[4px] border px-3 text-left transition-colors disabled:cursor-default"
              style={{
                borderColor: right ? "var(--c-brand)" : wrong ? "var(--c-danger)" : "var(--c-border-strong)",
                background: "var(--c-surface)",
                color: right ? "var(--c-brand)" : wrong ? "var(--c-danger)" : "var(--c-text)",
                fontWeight: right ? 600 : 400,
              }}
            >
              {right ? "✓ " : wrong ? "✗ " : ""}
              {t(o, lang)}
            </button>
          );
        })}
      </div>
      {answered && (
        <p className="fade-in mt-3" aria-live="polite">
          <strong>
            {picked === data.answer
              ? lang === "es"
                ? "¡Eso es! "
                : "That's it! "
              : lang === "es"
                ? "Casi. "
                : "Not quite. "}
          </strong>
          <RichText text={t(data.explain, lang)} lang={lang} />
        </p>
      )}
    </OtterSays>
  );
}
