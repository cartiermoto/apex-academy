"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HighlightedCode } from "./code-block";

/** [label, inserted before caret, inserted after caret] */
const SYMBOLS: ReadonlyArray<readonly [string, string, string?]> = [
  [";", ";"],
  ["{ }", "{", "}"],
  ["( )", "(", ")"],
  ["' '", "'", "'"],
  ["=", " = "],
  ["< >", "<", ">"],
  ["[ ]", "[", "]"],
  [".", "."],
  [",", ", "],
  ["+", " + "],
  ["!", "!"],
  ["⇥", "    "],
];

/**
 * A deliberately small Apex editor.
 *
 * A textarea carries the caret and the touch keyboard; a <pre> underneath draws
 * the syntax colours, scroll-synced to it. No editor library — which is what
 * keeps it fast, keeps long lines scrolling inside their own box, and keeps the
 * native keyboard behaving on a phone.
 */
export function CodeEditor({
  value,
  onChange,
  filename,
  minLines = 12,
  maxLines = 28,
  readOnly = false,
}: {
  value: string;
  onChange: (next: string) => void;
  filename?: string;
  minLines?: number;
  maxLines?: number;
  readOnly?: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useLayoutEffect(() => {
    setLineCount(Math.max(1, value.split("\n").length));
  }, [value]);

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (preRef.current) {
      preRef.current.scrollTop = ta.scrollTop;
      preRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
  };

  useEffect(syncScroll, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;

    // Tab inserts four spaces instead of leaving the field.
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: en } = ta;
      const next = value.slice(0, s) + "    " + value.slice(en);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
      return;
    }

    // Enter keeps the current indentation, and adds one level after "{".
    if (e.key === "Enter") {
      const s = ta.selectionStart;
      const lineStart = value.lastIndexOf("\n", s - 1) + 1;
      const line = value.slice(lineStart, s);
      const indent = (line.match(/^[ \t]*/) ?? [""])[0];
      const extra = /\{\s*$/.test(line) ? "    " : "";
      if (!indent && !extra) return;
      e.preventDefault();
      const insert = "\n" + indent + extra;
      const next = value.slice(0, s) + insert + value.slice(ta.selectionEnd);
      onChange(next);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + insert.length;
      });
    }
  }

  /** Symbol bar: insert `open` (+ `close`), wrapping any selection, caret in between. */
  function insertSymbol(open: string, close = "") {
    const ta = taRef.current;
    if (!ta || readOnly) return;
    const { selectionStart: s, selectionEnd: en } = ta;
    const selected = value.slice(s, en);
    onChange(value.slice(0, s) + open + selected + close + value.slice(en));
    requestAnimationFrame(() => {
      ta.focus();
      const caret = s + open.length + selected.length;
      ta.selectionStart = selected ? s + open.length : caret;
      ta.selectionEnd = caret;
    });
  }

  const rows = Math.min(maxLines, Math.max(minLines, lineCount));
  const gutterWidth = String(lineCount).length <= 2 ? 34 : 44;

  return (
    <div className="code-surface editor-surface relative overflow-hidden rounded-[4px]">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--c-code-border)] px-3 py-1.5">
        <span className="t-micro font-mono text-[var(--c-code-com)]">
          {filename ?? "Apex"}
        </span>
        <span className="t-micro font-mono text-[var(--c-code-com)]">
          {lineCount} {lineCount === 1 ? "line" : "lines"}
        </span>
      </div>

      {/* Symbol bar for touch screens (iPad + Pencil / Scribble): the symbols
          handwriting recognises worst, one tap away. Hidden with a mouse. */}
      {!readOnly && (
        <div
          role="toolbar"
          aria-label="Apex symbols"
          className="thin-scroll hidden gap-1 overflow-x-auto border-b border-[var(--c-code-border)] px-2 py-1.5 pointer-coarse:flex"
        >
          {SYMBOLS.map(([label, open, close]) => (
            <button
              key={label}
              type="button"
              aria-label={label === "⇥" ? "Tab" : label}
              // Keep focus (and the on-screen keyboard) in the textarea.
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => insertSymbol(open, close)}
              className="min-h-11 min-w-11 shrink-0 rounded-[4px] border border-[var(--c-code-border)] px-2 font-mono text-[var(--c-code-text)] active:bg-[var(--c-code-border)]"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="relative">
        {/* line numbers */}
        <div
          ref={gutterRef}
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 select-none overflow-hidden border-r border-[var(--c-code-border)] py-3 text-right"
          /* Opaque and above the syntax layer: a horizontally scrolled long
             line must slide underneath it, not through it. */
          style={{
            width: gutterWidth,
            background: "var(--c-code-bg)",
            zIndex: 2,
          }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="px-1.5 text-[var(--c-code-com)] opacity-60">
              {i + 1}
            </div>
          ))}
        </div>

        {/* syntax layer */}
        <pre
          ref={preRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden py-3 pr-4"
          style={{ paddingLeft: gutterWidth + 12, zIndex: 1 }}
        >
          <code>
            <HighlightedCode code={value + "\n"} />
          </code>
        </pre>

        {/* input layer */}
        <textarea
          ref={taRef}
          value={value}
          rows={rows}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          className="thin-scroll relative block w-full resize-y overflow-auto bg-transparent py-3 pr-4 text-transparent caret-[var(--c-brand)] outline-none"
          style={{
            paddingLeft: gutterWidth + 12,
            zIndex: 3,
            whiteSpace: "pre",
            overflowWrap: "normal",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
            tabSize: 4,
          }}
        />
      </div>
    </div>
  );
}
