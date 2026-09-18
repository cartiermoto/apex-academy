"use client";

import type { Lang, TheoryBlock } from "@/lib/types";
import { t } from "@/lib/i18n";
import { CodeBlock } from "./code-block";
import { Diagram } from "@/content/diagrams";
import { RichText } from "./term";

const CALLOUT = {
  admin: {
    border: "var(--c-brand)",
    bg: "var(--c-brand-soft)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 4 7v5c0 4.5 3.2 8.3 8 9 4.8-.7 8-4.5 8-9V7l-8-4Z" />
      </svg>
    ),
  },
  tip: {
    border: "var(--c-brand)",
    bg: "var(--c-surface-2)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5.9 1.2 1 2h5.2c.1-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
      </svg>
    ),
  },
  warn: {
    border: "var(--c-accent)",
    bg: "var(--c-accent-soft)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.3 3.9 1.8 18.4A2 2 0 0 0 3.5 21.4h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  recall: {
    border: "var(--c-text-faint)",
    bg: "var(--c-surface-2)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0-9-9" />
        <path d="M3 3v5h5" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
} as const;

export function Theory({ blocks, lang }: { blocks: TheoryBlock[]; lang: Lang }) {
  return (
    <div className="max-w-[68ch]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "lead":
            return (
              <p key={i} className="lead mt-0 mb-7">
                <RichText text={t(b.text, lang)} lang={lang} />
              </p>
            );

          case "p":
            return (
              <p key={i} className="t-body mb-5 text-ink">
                <RichText text={t(b.text, lang)} lang={lang} />
              </p>
            );

          case "h":
            return (
              <h3 key={i} className="t-h2 mt-12 mb-4">
                {t(b.text, lang)}
              </h3>
            );

          case "list":
            return b.ordered ? (
              <ol key={i} className="t-body mb-6 space-y-2.5 pl-5">
                {b.items.map((it, j) => (
                  <li key={j} className="list-decimal marker:text-faint">
                    <RichText text={t(it, lang)} lang={lang} />
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="t-body mb-6 space-y-2.5">
                {b.items.map((it, j) => (
                  <li key={j} className="relative pl-5">
                    <span className="absolute left-0 top-[0.72em] h-[5px] w-[5px] rounded-full bg-brand" />
                    <RichText text={t(it, lang)} lang={lang} />
                  </li>
                ))}
              </ul>
            );

          case "code":
            return (
              <CodeBlock
                key={i}
                code={t(b.code, lang)}
                caption={b.caption ? t(b.caption, lang) : undefined}
              />
            );

          case "callout": {
            const style = CALLOUT[b.variant];
            return (
              <aside
                key={i}
                className="my-7 rounded-[8px] px-4 py-3.5 sm:px-5 sm:py-4"
                style={{
                  background: style.bg,
                  borderLeft: `3px solid ${style.border}`,
                }}
              >
                <p
                  className="t-small flex items-center gap-2 font-semibold"
                  style={{ color: style.border }}
                >
                  {style.icon}
                  {t(b.title, lang)}
                </p>
                <p className="t-small mt-2 leading-relaxed text-ink">
                  <RichText text={t(b.text, lang)} lang={lang} />
                </p>
              </aside>
            );
          }

          case "table":
            return (
              <div key={i} className="thin-scroll my-7 -mx-1 overflow-x-auto px-1">
                <table className="w-full min-w-[420px] border-collapse text-left">
                  <thead>
                    <tr>
                      {b.head.map((h, j) => (
                        <th
                          key={j}
                          className="t-eyebrow border-b border-line-strong pb-2.5 pr-4"
                        >
                          {t(h, lang)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j}>
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="t-small border-b border-line py-3 pr-4 align-top text-ink"
                          >
                            <RichText text={t(cell, lang)} lang={lang} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "diagram":
            return (
              <figure key={i} className="my-9 w-full">
                <div className="card w-full overflow-hidden p-4 sm:p-6">
                  <Diagram id={b.id} lang={lang} />
                </div>
                {b.caption && (
                  <figcaption className="t-micro mt-2.5 text-faint">
                    {t(b.caption, lang)}
                  </figcaption>
                )}
              </figure>
            );

          case "divider":
            return <hr key={i} className="my-10 border-line" />;
        }
      })}
    </div>
  );
}
