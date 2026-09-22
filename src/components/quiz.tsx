"use client";

import { useMemo, useState } from "react";
import type { Lang, QuizQuestion, QuizTag } from "@/lib/types";
import { t, ui } from "@/lib/i18n";
import { CodeBlock } from "./code-block";
import { RichText } from "./term";

function tagLabel(tag: QuizTag, lang: Lang): string {
  switch (tag) {
    case "spaced":
      return t(ui.spacedChip, lang);
    case "interleaving":
      return t(ui.interleavedChip, lang);
    case "predict-output":
      return t(ui.predictChip, lang);
    case "find-error":
      return t(ui.errorChip, lang);
    case "recall":
      return t(ui.recallChip, lang);
  }
}

/**
 * Options that are code (e.g. "String region = 'EMEA';") are shown in the
 * monospace font: the UI sans draws the straight quote slanted, which would
 * look like a typographic quote — not valid Apex.
 */
function looksLikeCode(s: string): boolean {
  return /[;{}]|==|\w\(|'[^']*'|\.\w+\(/.test(s);
}

function normalise(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function isCorrect(q: QuizQuestion, answer: unknown): boolean {
  if (q.kind === "single") return answer === q.answer;
  if (q.kind === "multi") {
    const picked = (answer as number[]) ?? [];
    return (
      picked.length === q.answers.length &&
      q.answers.every((a) => picked.includes(a))
    );
  }
  const text = normalise(String(answer ?? ""));
  if (!text) return false;
  return q.accept.some((pattern) => new RegExp(`^(${pattern})$`, "i").test(text));
}

export function Quiz({
  questions,
  lang,
  onFinish,
  onGoToExercise,
  initialScore,
}: {
  questions: QuizQuestion[];
  lang: Lang;
  onFinish: (
    score: number,
    total: number,
    answers: Array<{ questionId: string; answer: unknown; correct: boolean }>,
  ) => void;
  onGoToExercise: () => void;
  initialScore?: { score: number; total: number } | null;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const q = questions[index];
  const answered = checked[q?.id ?? ""] ?? false;
  const answer = answers[q?.id ?? ""];
  const correct = useMemo(
    () => (q ? isCorrect(q, answer) : false),
    [q, answer],
  );

  const score = questions.filter((x) => checked[x.id] && isCorrect(x, answers[x.id])).length;

  function submitAll() {
    const detail = questions.map((x) => ({
      questionId: x.id,
      answer: answers[x.id] ?? null,
      correct: isCorrect(x, answers[x.id]),
    }));
    const s = detail.filter((d) => d.correct).length;
    setDone(true);
    onFinish(s, questions.length, detail);
  }

  function restart() {
    setAnswers({});
    setChecked({});
    setIndex(0);
    setDone(false);
    setRunKey((k) => k + 1);
  }

  if (!q) return null;

  /* ------------------------------------------------------------- results -- */
  if (done) {
    const total = questions.length;
    const pct = total === 0 ? 0 : Math.round((score / total) * 100);
    const passed = score / total >= 0.7;
    // The number of correct answers that would have reached 70%, and how many
    // more that is than what the student actually got — so "not yet" always
    // comes with a concrete number, never just a bare percentage.
    const needed = Math.ceil(total * 0.7);
    const missing = Math.max(0, needed - score);
    return (
      <div className="fade-in max-w-[68ch]">
        <div
          className="rounded-[4px] border p-6 sm:p-8"
          style={{
            borderColor: passed ? "var(--c-brand)" : "var(--c-border-strong)",
            background: passed ? "var(--c-brand-soft)" : "var(--c-surface)",
          }}
        >
          <p className="t-eyebrow">{t(ui.quizResult, lang)}</p>
          <p className="t-display mt-3 tabular-nums">
            {score}
            <span className="text-faint">/{total} · {pct}%</span>
          </p>
          <p className="t-small mt-2 text-muted">
            {passed
              ? lang === "es"
                ? "Quiz superado. Ahora escríbelo tú."
                : "Quiz passed. Now write it yourself."
              : lang === "es"
                ? `Te ${missing === 1 ? "falta 1 respuesta correcta" : `faltan ${missing} respuestas correctas`} para llegar al 70 % (necesitas al menos ${needed} de ${total}).`
                : `You're ${missing} correct ${missing === 1 ? "answer" : "answers"} short of 70% (you need at least ${needed} of ${total}).`}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={restart} className="btn btn-ghost">
              {t(ui.retakeQuiz, lang)}
            </button>
            {passed && (
              <button onClick={onGoToExercise} className="btn btn-primary">
                {t(ui.goToExercise, lang)}
              </button>
            )}
          </div>
        </div>

        {/* per-question review */}
        <ol className="mt-8 space-y-3">
          {questions.map((x, i) => {
            const ok = isCorrect(x, answers[x.id]);
            return (
              <li
                key={x.id}
                className="card flex items-start gap-3 p-4"
                style={{
                  borderColor: ok ? "var(--c-border)" : "var(--c-danger)",
                }}
              >
                <span
                  className="t-micro mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  style={{
                    background: ok ? "var(--c-brand)" : "var(--c-danger)",
                    color: "var(--c-bg)", // white on brand/danger in light, navy in dark: both pass WCAG
                  }}
                >
                  {ok ? "✓" : "✕"}
                </span>
                <div className="min-w-0">
                  <p className="t-small text-ink">
                    {i + 1}. {t(x.prompt, lang)}
                  </p>
                  {!ok && (
                    <p className="t-small mt-1.5 text-muted"><RichText text={t(x.explain, lang)} lang={lang} /></p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  /* ------------------------------------------------------------ question -- */
  return (
    <div key={runKey} className="max-w-[68ch]">
      {/* progress */}
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>
        <span className="t-micro shrink-0 tabular-nums text-faint">
          {index + 1} {t(ui.of, lang)} {questions.length}
        </span>
      </div>

      <div className="mt-7 fade-in" key={q.id}>
        {q.tags && q.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {q.tags.map((tag) => (
              <span
                key={tag}
                className="t-micro rounded-full px-2 py-0.5"
                style={{
                  background:
                    tag === "spaced" ? "var(--c-accent-soft)" : "var(--c-surface-2)",
                  color: tag === "spaced" ? "var(--c-accent)" : "var(--c-text-muted)",
                }}
              >
                {tagLabel(tag, lang)}
              </span>
            ))}
            {q.from && (
              <span className="t-micro rounded-full bg-surface-2 px-2 py-0.5 text-faint">
                {t(q.from, lang)}
              </span>
            )}
          </div>
        )}

        <p className="t-h3 leading-snug">{t(q.prompt, lang)}</p>

        {q.code && <CodeBlock code={t(q.code, lang)} />}

        {/* ------- options ------- */}
        {q.kind === "single" && (
          <ul className="mt-5 space-y-2">
            {q.options.map((opt, i) => {
              const picked = answer === i;
              const showRight = answered && i === q.answer;
              const showWrong = answered && picked && i !== q.answer;
              return (
                <li key={i}>
                  <button
                    disabled={answered}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    className="flex w-full items-start gap-3 rounded-[4px] border p-3.5 text-left transition disabled:cursor-default"
                    style={{
                      borderColor: showRight
                        ? "var(--c-brand)"
                        : showWrong
                          ? "var(--c-danger)"
                          : picked
                            ? "var(--c-brand)"
                            : "var(--c-border)",
                      background: showRight
                        ? "var(--c-brand-soft)"
                        : showWrong
                          ? "var(--c-danger-soft)"
                          : picked
                            ? "var(--c-brand-soft)"
                            : "transparent",
                    }}
                  >
                    <span
                      className="t-micro mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border"
                      style={{
                        borderColor: picked ? "var(--c-brand)" : "var(--c-border-strong)",
                        color: picked ? "var(--c-brand)" : "var(--c-text-faint)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={`t-small min-w-0 flex-1 text-ink ${looksLikeCode(t(opt, lang)) ? "font-mono" : ""}`}>
                      {t(opt, lang)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {q.kind === "multi" && (
          <>
            <p className="t-micro mt-4 text-faint">{t(ui.selectAllThatApply, lang)}</p>
            <ul className="mt-2 space-y-2">
              {q.options.map((opt, i) => {
                const picked = ((answer as number[]) ?? []).includes(i);
                const shouldBe = q.answers.includes(i);
                return (
                  <li key={i}>
                    <button
                      disabled={answered}
                      onClick={() =>
                        setAnswers((a) => {
                          const cur = ((a[q.id] as number[]) ?? []).slice();
                          const at = cur.indexOf(i);
                          if (at >= 0) cur.splice(at, 1);
                          else cur.push(i);
                          return { ...a, [q.id]: cur };
                        })
                      }
                      className="flex w-full items-start gap-3 rounded-[4px] border p-3.5 text-left transition disabled:cursor-default"
                      style={{
                        borderColor: answered
                          ? shouldBe
                            ? "var(--c-brand)"
                            : picked
                              ? "var(--c-danger)"
                              : "var(--c-border)"
                          : picked
                            ? "var(--c-brand)"
                            : "var(--c-border)",
                        background: answered
                          ? shouldBe
                            ? "var(--c-brand-soft)"
                            : picked
                              ? "var(--c-danger-soft)"
                              : "transparent"
                          : picked
                            ? "var(--c-brand-soft)"
                            : "transparent",
                      }}
                    >
                      <span
                        className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border"
                        style={{
                          borderColor: picked ? "var(--c-brand)" : "var(--c-border-strong)",
                          background: picked ? "var(--c-brand)" : "transparent",
                        }}
                      >
                        {picked && (
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="var(--c-on-brand)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                          </svg>
                        )}
                      </span>
                      <span className={`t-small min-w-0 flex-1 text-ink ${looksLikeCode(t(opt, lang)) ? "font-mono" : ""}`}>
                        {t(opt, lang)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {q.kind === "text" && (
          <input
            value={(answer as string) ?? ""}
            disabled={answered}
            onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !answered && String(answer ?? "").trim()) {
                setChecked((c) => ({ ...c, [q.id]: true }));
              }
            }}
            placeholder={
              q.placeholder ? t(q.placeholder, lang) : t(ui.typeYourAnswer, lang)
            }
            className="mt-5 w-full rounded-[4px] border border-line bg-surface px-3.5 py-3 font-mono text-[16px] text-ink outline-none transition focus:border-brand sm:text-[0.9rem]"
          />
        )}

        {/* ------- verdict ------- */}
        {answered && (
          <div
            className="fade-in mt-5 rounded-[4px] px-4 py-3.5"
            style={{
              background: correct ? "var(--c-brand-soft)" : "var(--c-danger-soft)",
            }}
          >
            <p
              className="t-small font-semibold"
              style={{ color: correct ? "var(--c-brand)" : "var(--c-danger)" }}
            >
              {correct ? t(ui.correct, lang) : t(ui.incorrect, lang)}
            </p>
            <p className="t-small mt-1.5 text-ink"><RichText text={t(q.explain, lang)} lang={lang} /></p>
          </div>
        )}

        {/* ------- actions ------- */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="t-micro tabular-nums text-faint">
            {score}/{Object.keys(checked).length || 0}
          </span>
          {!answered ? (
            <button
              className="btn btn-primary"
              disabled={
                answer === undefined ||
                (q.kind === "multi" && ((answer as number[]) ?? []).length === 0) ||
                (q.kind === "text" && !String(answer ?? "").trim())
              }
              onClick={() => setChecked((c) => ({ ...c, [q.id]: true }))}
            >
              {t(ui.check, lang)}
            </button>
          ) : index < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setIndex((i) => i + 1)}>
              {t(ui.next, lang)}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submitAll}>
              {t(ui.quizResult, lang)}
            </button>
          )}
        </div>
      </div>

      {initialScore && index === 0 && !answered && (
        <p className="t-micro mt-6 text-faint">
          {lang === "es" ? "Último resultado" : "Last result"}: {initialScore.score}/
          {initialScore.total}
        </p>
      )}
    </div>
  );
}
