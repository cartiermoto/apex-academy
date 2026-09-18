"use client";

import { useSettings } from "./providers";

/** ES / EN segmented control. Switches every string in the app, content included. */
export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useSettings();
  return (
    <div
      className={`inline-flex items-center rounded-[4px] border border-line bg-surface p-[2px] ${className}`}
      role="group"
      aria-label="Language"
    >
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`t-micro inline-flex min-h-[36px] min-w-[44px] items-center justify-center rounded-[3px] px-2.5 font-medium uppercase transition ${
            lang === l
              ? "bg-brand text-on-brand"
              : "text-faint hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useSettings();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      className={`grid h-10 w-10 place-items-center rounded-[4px] border border-line bg-surface text-muted transition hover:text-ink ${className}`}
      aria-label={next === "dark" ? "Dark mode" : "Light mode"}
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
  );
}
