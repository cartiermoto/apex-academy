"use client";

import Link from "next/link";
import { useState } from "react";
import type { Challenge, Module } from "@/lib/types";
import { t, ui } from "@/lib/i18n";
import { useProgress, useSettings } from "./providers";
import { Theory } from "./theory";
import { ExercisePanel } from "./exercise";

export function ChallengeView({
  challenge,
  requiredModule,
}: {
  challenge: Challenge;
  requiredModule?: Module;
}) {
  const { lang } = useSettings();
  const { snapshot, setChallenge, authed } = useProgress();
  const [active, setActive] = useState(challenge.components[0]?.id ?? "");

  const earned =
    !!requiredModule &&
    requiredModule.lessons.length > 0 &&
    requiredModule.lessons.every(
      (l) => snapshot.lessons[l.id]?.status === "completed",
    );
  // Admin mode: signed in with the course password, nothing is locked.
  const unlocked = earned || authed === true;

  const progress = snapshot.challenges[challenge.id];
  const passedComponents = progress?.passedComponents ?? [];
  const component = challenge.components.find((c) => c.id === active);

  function onComponentPassed(componentId: string) {
    const next = Array.from(new Set([...passedComponents, componentId]));
    setChallenge(challenge.id, {
      passedComponents: next,
      status:
        next.length === challenge.components.length ? "completed" : "in_progress",
    });
  }

  return (
    <main className="mx-auto w-full max-w-[880px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
      <header>
        <p className="t-eyebrow text-accent">
          {t(ui.challenge, lang)} {challenge.n}
        </p>
        <h1 className="t-h1 mt-3">{t(challenge.title, lang)}</h1>
        <p className="lead mt-3 max-w-[62ch]">{t(challenge.subtitle, lang)}</p>

        {!unlocked && (
          <div
            className="mt-6 flex items-start gap-3 rounded-[4px] border border-dashed border-line px-4 py-4"
            style={{ background: "var(--c-surface)" }}
          >
            <svg width="17" height="17" viewBox="0 0 16 16" className="mt-[2px] shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3.2" y="7" width="9.6" height="7" rx="1.6" />
              <path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" />
            </svg>
            <div>
              <p className="t-small font-semibold text-ink">{t(ui.locked, lang)}</p>
              <p className="t-small mt-1 text-muted">
                {t(ui.challengeLockedMsg, lang)}{" "}
                {requiredModule && (
                  <>
                    — {t(ui.module, lang)} {requiredModule.n}:{" "}
                    {t(requiredModule.title, lang)}
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* scenario is always readable, even locked: it is the motivation */}
      <section className="mt-10">
        <Theory blocks={challenge.scenario} lang={lang} />
      </section>

      <section className="mt-12 max-w-[68ch]">
        <p className="t-eyebrow">{t(ui.whatYouWillBuild, lang)}</p>
        <ul className="mt-4 space-y-3">
          {challenge.components.map((c, i) => (
            <li key={c.id} className="card flex items-start gap-3 p-4">
              <span className="t-micro mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-faint">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="t-small font-medium text-ink">{t(c.name, lang)}</p>
                <p className="t-micro mt-0.5 font-mono text-faint">{c.fileName}</p>
                <p className="t-small mt-1.5 text-muted">{t(c.brief[0], lang)}</p>
              </div>
              {passedComponents.includes(c.id) && (
                <svg width="16" height="16" viewBox="0 0 16 16" className="ml-auto shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5 6.2 11.7 13 4.9" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-[68ch]">
        <p className="t-eyebrow">{t(ui.rubric, lang)}</p>
        <ul className="mt-4 space-y-2.5">
          {challenge.rubric.map((r, i) => (
            <li key={i} className="t-small relative pl-5 text-ink">
              <span className="absolute left-0 top-[0.62em] h-[5px] w-[5px] rounded-full bg-accent" />
              {t(r, lang)}
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------- the workbench -- */}
      {unlocked ? (
        <section className="mt-14">
          <div className="thin-scroll -mx-5 overflow-x-auto border-b border-line px-5 sm:mx-0 sm:px-0">
            <ul className="flex gap-1">
              {challenge.components.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActive(c.id)}
                    className="relative flex items-center gap-2 whitespace-nowrap px-3 py-3.5 transition sm:px-4"
                    style={{
                      color: active === c.id ? "var(--c-text)" : "var(--c-text-muted)",
                    }}
                  >
                    <span className="t-small font-medium">{t(c.name, lang)}</span>
                    {passedComponents.includes(c.id) && (
                      <svg width="13" height="13" viewBox="0 0 16 16" className="text-brand" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 8.5 6.2 11.7 13 4.9" />
                      </svg>
                    )}
                    {active === c.id && (
                      <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-accent" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {component && (
            <div className="mt-8 fade-in" key={component.id}>
              <ExercisePanel
                data={{
                  prompt: component.name,
                  brief: component.brief,
                  starter: component.starter,
                  hints: component.hints,
                  solution: {
                    es: "// En los Desafíos no hay solución publicada: el objetivo es que la tuya pase la validación y resista la retroalimentación.",
                    en: "// Challenges ship no published solution: the point is that yours passes validation and survives the feedback.",
                  },
                  checks: component.checks,
                  rubric: challenge.rubric,
                }}
                lang={lang}
                lessonId={challenge.id}
                moduleId={challenge.requires}
                componentId={component.id}
                fileName={component.fileName}
                passed={passedComponents.includes(component.id)}
                onPassed={() => onComponentPassed(component.id)}
              />
            </div>
          )}
        </section>
      ) : (
        <section className="mt-14 border-t border-line pt-8">
          <Link href="/" className="btn btn-ghost">
            {t(ui.backToHome, lang)}
          </Link>
        </section>
      )}
    </main>
  );
}
