"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lesson, Module } from "@/lib/types";
import { t, ui } from "@/lib/i18n";
import { useProgress, useSettings } from "./providers";
import { Theory } from "./theory";
import { Quiz } from "./quiz";
import { ExercisePanel } from "./exercise";

type Tab = "theory" | "quiz" | "exercise";

export function LessonView({
  module: mod,
  lesson,
  prev,
  next,
}: {
  module: Module;
  lesson: Lesson;
  prev?: { moduleId: string; slug: string; title: { es: string; en: string } };
  next?: { moduleId: string; slug: string; title: { es: string; en: string } };
}) {
  const { lang } = useSettings();
  const { snapshot, markTheory, markQuiz } = useProgress();
  const [tab, setTab] = useState<Tab>("theory");

  const progress = snapshot.lessons[lesson.id];
  const theoryDone = progress?.theoryDone ?? false;
  const quizDone = progress?.quizDone ?? false;
  const exerciseDone = progress?.exerciseDone ?? false;
  const complete = progress?.status === "completed";

  // Going to another lesson always starts at the theory again.
  useEffect(() => {
    setTab("theory");
    window.scrollTo({ top: 0 });
  }, [lesson.id]);

  const tabs: Array<{ id: Tab; label: string; done: boolean }> = [
    { id: "theory", label: t(ui.theory, lang), done: theoryDone },
    { id: "quiz", label: t(ui.quiz, lang), done: quizDone },
    { id: "exercise", label: t(ui.exercise, lang), done: exerciseDone },
  ];

  return (
    <main className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      {/* --------------------------------------------------------- header */}
      <header>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="t-eyebrow">
            {t(ui.module, lang)} {mod.n}
          </span>
          <span className="t-eyebrow">·</span>
          <span className="t-eyebrow">
            {lesson.kind === "checkpoint"
              ? t(ui.checkpoint, lang)
              : `${String(lesson.n).padStart(2, "0")}`}
          </span>
          <span className="t-eyebrow">·</span>
          <span className="t-eyebrow">
            {lesson.minutes} {t(ui.minutes, lang)}
          </span>
        </div>

        <h1 className="t-h1 mt-4">{t(lesson.title, lang)}</h1>
        <p className="lead mt-3 max-w-[62ch]">{t(lesson.summary, lang)}</p>

        {/* spec sheet: the Admin equivalent + what you will be able to do */}
        <div className="mt-7 rounded-[4px] border border-line bg-surface">
          {lesson.analogy && (
            <div className="grid gap-1 border-b border-line px-5 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <span className="t-eyebrow pt-0.5">{lang === "es" ? "En Admin es" : "In Admin it is"}</span>
              <span className="font-mono text-[0.86rem] leading-relaxed text-heading">
                {t(lesson.analogy, lang)}
              </span>
            </div>
          )}
          {lesson.objectives.length > 0 && (
            <div className="px-5 py-4">
              <p className="t-eyebrow text-accent">✓ {t(ui.objectives, lang)}</p>
              <ol className="mt-3 space-y-2.5">
                {lesson.objectives.map((o, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-[0.75rem] leading-[1.6] text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="t-small text-ink">{t(o, lang)}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {complete && (
          <div
            className="mt-6 flex items-start gap-3 rounded-[4px] px-4 py-3.5"
            style={{ background: "var(--c-brand-soft)" }}
          >
            <svg width="17" height="17" viewBox="0 0 16 16" className="mt-[2px] shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5 6.2 11.7 13 4.9" />
            </svg>
            <div>
              <p className="t-small font-semibold text-brand">
                {t(ui.lessonComplete, lang)}
              </p>
              <p className="t-small text-ink">{t(ui.completedBanner, lang)}</p>
            </div>
          </div>
        )}
      </header>

      {/* ----------------------------------------------------------- tabs */}
      <nav className="sticky top-[53px] z-30 -mx-5 mt-8 border-b border-line bg-bg/90 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:top-0 lg:-mx-12 lg:px-12">
        <ul className="flex gap-1">
          {tabs.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setTab(x.id)}
                className="relative flex items-center gap-2 px-3 py-3.5 transition sm:px-4"
                style={{ color: tab === x.id ? "var(--c-text)" : "var(--c-text-muted)" }}
              >
                <span className="t-small font-medium">{x.label}</span>
                {x.done && (
                  <svg width="13" height="13" viewBox="0 0 16 16" className="text-brand" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8.5 6.2 11.7 13 4.9" />
                  </svg>
                )}
                {tab === x.id && (
                  <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-brand" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* -------------------------------------------------------- content */}
      <section className="py-10">
        {tab === "theory" && (
          <div className="fade-in">
            <Theory blocks={lesson.theory} lang={lang} />
            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <button
                className={theoryDone ? "btn btn-ghost" : "btn btn-primary"}
                onClick={() => {
                  markTheory(lesson.id, mod.id);
                  setTab("quiz");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {theoryDone ? t(ui.quiz, lang) : t(ui.markTheoryRead, lang)}
              </button>
              {theoryDone && (
                <span className="t-micro text-faint">{t(ui.theoryRead, lang)}</span>
              )}
            </div>
          </div>
        )}

        {tab === "quiz" && (
          <div className="fade-in">
            <Quiz
              questions={lesson.quiz}
              lang={lang}
              initialScore={
                progress?.quizScore != null && progress?.quizTotal != null
                  ? { score: progress.quizScore, total: progress.quizTotal }
                  : null
              }
              onFinish={(score, total, answers) =>
                markQuiz(lesson.id, mod.id, score, total, answers)
              }
              onGoToExercise={() => {
                setTab("exercise");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}

        {tab === "exercise" && (
          <div className="fade-in">
            <ExercisePanel
              data={lesson.exercise}
              lang={lang}
              lessonId={lesson.id}
              moduleId={mod.id}
              passed={exerciseDone}
              fileName={`${lesson.slug.replace(/(^\w|-\w)/g, (s) => s.replace("-", "").toUpperCase())}.apex`}
            />
          </div>
        )}
      </section>

      {/* ----------------------------------------------------- prev / next */}
      <nav className="mt-6 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/m/${prev.moduleId}/${prev.slug}`}
            className="card group p-4 transition hover:border-line-strong"
          >
            <p className="t-micro text-faint">← {t(ui.previous, lang)}</p>
            <p className="t-small mt-1 font-medium text-ink">{t(prev.title, lang)}</p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/m/${next.moduleId}/${next.slug}`}
            className="card group p-4 text-right transition hover:border-line-strong"
          >
            <p className="t-micro text-faint">{t(ui.nextLesson, lang)} →</p>
            <p className="t-small mt-1 font-medium text-ink">{t(next.title, lang)}</p>
          </Link>
        ) : (
          <Link href="/" className="card p-4 text-right transition hover:border-line-strong">
            <p className="t-micro text-faint">{t(ui.backToHome, lang)} →</p>
          </Link>
        )}
      </nav>
    </main>
  );
}
