import type { Lang } from "@/lib/types";
import { MascotMark } from "./logo";

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
