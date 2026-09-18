"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Check, Exercise as ExerciseData, Lang } from "@/lib/types";
import { t, ui } from "@/lib/i18n";
import { validate, type ValidationResult } from "@/lib/validate";
import { buildFeedback, type FeedbackReport } from "@/lib/feedback";
import { CodeEditor } from "./code-editor";
import { CodeBlock } from "./code-block";
import { useProgress } from "./providers";

/**
 * The practical exercise.
 *
 * Autosaves the editor to localStorage on a ~1s debounce and pushes the code to
 * the database on every validation, so a reload never costs work. Hints unlock
 * one failed attempt at a time and never show the answer; the full solution
 * only opens once all three hints have been read.
 */
export function ExercisePanel({
  data,
  lang,
  lessonId,
  moduleId,
  componentId,
  fileName,
  passed,
  onPassed,
}: {
  data: ExerciseData;
  lang: Lang;
  lessonId: string;
  moduleId: string;
  componentId?: string;
  fileName?: string;
  passed: boolean;
  onPassed?: () => void;
}) {
  const { saveDraft, getDraft, markExercise } = useProgress();
  const draftKey = componentId ? `${lessonId}::${componentId}` : lessonId;
  const starter = t(data.starter, lang);

  const [code, setCode] = useState<string>(starter);
  const [hydrated, setHydrated] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [report, setReport] = useState<FeedbackReport | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const langRef = useRef(lang);

  /* ---- restore the saved draft once on mount --------------------------- */
  useEffect(() => {
    const saved = getDraft(draftKey);
    setCode(saved && saved.trim() ? saved : starter);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  /* ---- if the language changes and the student has not typed, swap the
          starter comments to the new language ------------------------------ */
  useEffect(() => {
    if (!hydrated) return;
    const previous = t(data.starter, langRef.current);
    if (code.trim() === previous.trim() && langRef.current !== lang) {
      setCode(t(data.starter, lang));
    }
    langRef.current = lang;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  /* ---- autosave (debounced ~1s) ---------------------------------------- */
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      saveDraft(draftKey, lessonId, componentId ?? null, code);
      setSavedAt(Date.now());
    }, 1000);
    return () => clearTimeout(id);
  }, [code, hydrated, draftKey, lessonId, componentId, saveDraft]);

  const checksById = useMemo(() => {
    const map = new Map<string, Check>();
    for (const c of data.checks) map.set(c.id, c);
    return map;
  }, [data.checks]);

  function runValidation() {
    const res = validate(code, data.checks, starter);
    const fb = buildFeedback(code, data.checks, res.results, res.passed, data.rubric);
    setResult(res);
    setReport(fb);

    setAttempts((n) => n + 1);
    if (!res.passed) setFailedAttempts((n) => n + 1);

    markExercise(lessonId, moduleId, {
      code,
      passed: res.passed,
      hintsUsed: hintsShown,
      results: res.results,
      componentId,
    });

    if (res.passed) onPassed?.();
  }

  // One hint per failed attempt: the next one only opens after failing again.
  const hintsAvailable = Math.min(3, failedAttempts);
  const canShowNextHint = hintsShown < 3 && hintsShown < hintsAvailable;

  return (
    <div className="max-w-[68ch]">
      {/* ------------------------------------------------------------ brief */}
      <p className="t-body text-ink">{t(data.prompt, lang)}</p>

      <div className="card mt-5 p-5">
        <p className="t-eyebrow">{t(ui.requirements, lang)}</p>
        <ul className="mt-3 space-y-2.5">
          {data.brief.map((b, i) => (
            <li key={i} className="t-small relative pl-6 text-ink">
              <span className="t-micro absolute left-0 top-[1px] grid h-[18px] w-[18px] place-items-center rounded-full bg-surface-2 text-faint">
                {i + 1}
              </span>
              {t(b, lang)}
            </li>
          ))}
        </ul>
      </div>

      {/* ----------------------------------------------------------- editor */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="t-eyebrow">{t(ui.yourCode, lang)}</span>
          <span className="t-micro text-faint">
            {savedAt ? t(ui.saved, lang) : ""}
          </span>
        </div>
        <CodeEditor
          value={code}
          onChange={setCode}
          filename={fileName ?? "Anonymous.apex"}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button onClick={runValidation} className="btn btn-primary">
          {t(ui.validate, lang)}
        </button>
        <button
          onClick={() => {
            setCode(starter);
            setResult(null);
            setReport(null);
          }}
          className="btn btn-ghost"
        >
          {t(ui.reset, lang)}
        </button>
        {attempts > 0 && (
          <span className="t-micro ml-auto tabular-nums text-faint">
            {attempts} {t(ui.attempts, lang)}
          </span>
        )}
      </div>

      {/* --------------------------------------------------------- results */}
      {result && (
        <div className="fade-in mt-6">
          <div
            className="rounded-[12px] border p-5"
            style={{
              borderColor: result.passed ? "var(--c-brand)" : "var(--c-border-strong)",
              background: result.passed ? "var(--c-brand-soft)" : "var(--c-surface)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  className="t-h3"
                  style={{ color: result.passed ? "var(--c-brand)" : "var(--c-text)" }}
                >
                  {result.passed ? t(ui.exercisePassed, lang) : t(ui.exerciseFailed, lang)}
                </p>
                {report && (
                  <p className="t-small mt-1 text-muted">{t(report.headline, lang)}</p>
                )}
              </div>
              <span className="t-micro shrink-0 tabular-nums text-faint">
                {result.requiredPassed}/{result.required} {t(ui.checksPassed, lang)}
              </span>
            </div>

            {result.untouched && (
              <p className="t-small mt-3 text-[var(--c-accent)]">
                {lang === "es"
                  ? "El editor sigue con el código de partida — escribe tu versión antes de validar."
                  : "The editor still holds the starter code — write your version before validating."}
              </p>
            )}

            <ul className="mt-4 space-y-2">
              {result.results.map((r) => {
                const check = checksById.get(r.id);
                if (!check) return null;
                return (
                  <li key={r.id} className="flex items-start gap-2.5">
                    <span
                      className="mt-[3px] shrink-0"
                      style={{
                        color: r.passed
                          ? "var(--c-brand)"
                          : r.optional
                            ? "var(--c-text-faint)"
                            : "var(--c-danger)",
                      }}
                    >
                      {r.passed ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 8.5 6.2 11.7 13 4.9" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5" />
                        </svg>
                      )}
                    </span>
                    <span className="t-small text-ink">
                      {t(check.label, lang)}
                      {r.optional && (
                        <span className="t-micro ml-1.5 text-faint">
                          ({t(ui.optionalCheck, lang)})
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ------------------------------------------ qualitative feedback */}
          {report && report.notes.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="t-eyebrow">{t(ui.feedback, lang)}</p>
              {report.notes.map((n, i) => {
                const color =
                  n.tone === "good"
                    ? "var(--c-brand)"
                    : n.tone === "bad"
                      ? "var(--c-danger)"
                      : n.tone === "warn"
                        ? "var(--c-accent)"
                        : "var(--c-text-faint)";
                return (
                  <div
                    key={i}
                    className="rounded-[10px] px-4 py-3"
                    style={{
                      background: "var(--c-surface)",
                      borderLeft: `3px solid ${color}`,
                    }}
                  >
                    <p className="t-small font-semibold" style={{ color }}>
                      {t(n.title, lang)}
                    </p>
                    <p className="t-small mt-1 text-ink">{t(n.text, lang)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------------- hints */}
      <div className="mt-8">
        <div className="flex items-center justify-between gap-3">
          <p className="t-eyebrow">{t(ui.hint, lang)}</p>
          <span className="t-micro text-faint">{hintsShown}/3</span>
        </div>

        <div className="mt-3 space-y-2">
          {data.hints.slice(0, hintsShown).map((h, i) => (
            <div
              key={i}
              className="fade-in rounded-[10px] bg-surface-2 px-4 py-3"
              style={{ borderLeft: "3px solid var(--c-text-faint)" }}
            >
              <p className="t-micro text-faint">
                {t(ui.hint, lang)} {i + 1}
              </p>
              <p className="t-small mt-1 text-ink">{t(h, lang)}</p>
            </div>
          ))}
        </div>

        {hintsShown < 3 && (
          <div className="mt-3">
            <button
              className="btn btn-ghost"
              disabled={!canShowNextHint}
              onClick={() => setHintsShown((n) => n + 1)}
            >
              {t(ui.showHint, lang)} {hintsShown + 1}
            </button>
            {!canShowNextHint && (
              <p className="t-micro mt-2 text-faint">
                {attempts === 0
                  ? lang === "es"
                    ? "Inténtalo y valida: la primera pista se abre con el primer fallo."
                    : "Try and validate: the first hint opens on the first failure."
                  : t(ui.nextHintLocked, lang)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------- solution */}
      <div className="mt-8 border-t border-line pt-6">
        {hintsShown >= 3 || passed ? (
          <>
            <button
              className="btn btn-quiet"
              onClick={() => setShowSolution((s) => !s)}
            >
              {showSolution ? t(ui.hideSolution, lang) : t(ui.showSolution, lang)}
            </button>
            {showSolution && (
              <div className="fade-in">
                <CodeBlock
                  code={t(data.solution, lang)}
                  filename={t(ui.solution, lang)}
                  tone="good"
                />
              </div>
            )}
          </>
        ) : (
          <p className="t-micro text-faint">{t(ui.solutionLocked, lang)}</p>
        )}
      </div>
    </div>
  );
}
