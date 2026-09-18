"use client";

import { useState } from "react";
import { tokenizeApex } from "@/lib/highlight";
import { useSettings } from "./providers";
import { t, ui } from "@/lib/i18n";

export function HighlightedCode({ code }: { code: string }) {
  return (
    <>
      {tokenizeApex(code).map((tok, i) =>
        tok.cls ? (
          <span key={i} className={`tok-${tok.cls}`}>
            {tok.text}
          </span>
        ) : (
          <span key={i}>{tok.text}</span>
        ),
      )}
    </>
  );
}

/**
 * Read-only Apex block. Scrolls horizontally inside its own box so a long line
 * never widens the page on a phone.
 */
export function CodeBlock({
  code,
  caption,
  filename,
  tone = "default",
}: {
  code: string;
  caption?: string;
  filename?: string;
  tone?: "default" | "good" | "bad";
}) {
  const { lang } = useSettings();
  const [copied, setCopied] = useState(false);

  const accent =
    tone === "good"
      ? "border-l-[3px] border-l-brand"
      : tone === "bad"
        ? "border-l-[3px] border-l-[var(--c-danger)]"
        : "";

  return (
    <figure className="my-6">
      <div className={`code-surface overflow-hidden rounded-[10px] ${accent}`}>
        <div className="flex items-center justify-between gap-2 border-b border-[var(--c-code-border)] px-3 py-1.5">
          <span className="t-micro font-mono text-[var(--c-code-com)]">
            {filename ?? "Apex"}
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
            /* min sizes keep this a comfortable tap target on a phone */
            className="t-micro -my-1.5 inline-flex min-h-[40px] min-w-[56px] items-center justify-center rounded px-2 text-[var(--c-code-com)] transition hover:text-[var(--c-code-text)]"
          >
            {copied ? t(ui.copied, lang) : t(ui.copy, lang)}
          </button>
        </div>
        <pre className="thin-scroll overflow-x-auto px-4 py-3.5">
          <code>
            <HighlightedCode code={code} />
          </code>
        </pre>
      </div>
      {caption && (
        <figcaption className="t-micro mt-2 text-faint">{caption}</figcaption>
      )}
    </figure>
  );
}
