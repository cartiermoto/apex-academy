"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Lang, LessonStatus, ProgressSnapshot } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Settings: language + theme                                                 */
/* -------------------------------------------------------------------------- */

type Theme = "light" | "dark";

interface Settings {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const SettingsCtx = createContext<Settings | null>(null);

export function useSettings(): Settings {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error("useSettings must be used inside <Providers>");
  return ctx;
}

/** Shortcut used all over the UI: `const { lang } = useSettings()`. */
export function useLang(): Lang {
  return useSettings().lang;
}

/* -------------------------------------------------------------------------- */
/* Progress                                                                   */
/* -------------------------------------------------------------------------- */

interface ProgressApi {
  snapshot: ProgressSnapshot;
  ready: boolean;
  markTheory: (lessonId: string, moduleId: string) => void;
  markQuiz: (
    lessonId: string,
    moduleId: string,
    score: number,
    total: number,
    answers: Array<{ questionId: string; answer: unknown; correct: boolean }>,
  ) => void;
  markExercise: (
    lessonId: string,
    moduleId: string,
    args: {
      code: string;
      passed: boolean;
      hintsUsed: number;
      results: unknown;
      componentId?: string;
    },
  ) => void;
  saveDraft: (key: string, lessonId: string, componentId: string | null, code: string) => void;
  getDraft: (key: string) => string | undefined;
  setChallenge: (
    challengeId: string,
    patch: { status?: LessonStatus; passedComponents?: string[]; hintsUsed?: number },
  ) => void;
  reset: () => void;
  saving: boolean;
}

const ProgressCtx = createContext<ProgressApi | null>(null);

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressCtx);
  if (!ctx) throw new Error("useProgress must be used inside <Providers>");
  return ctx;
}

const LS_PROGRESS = "apex.progress.v1";
const LS_DRAFT = "apex.draft.";

const EMPTY: ProgressSnapshot = { lessons: {}, drafts: {}, challenges: {} };

/* -------------------------------------------------------------------------- */

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [theme, setThemeState] = useState<Theme>("light");
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>(EMPTY);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const pending = useRef(0);

  /* --- hydrate settings from the browser -------------------------------- */
  useEffect(() => {
    const storedLang = localStorage.getItem("apex.lang") as Lang | null;
    if (storedLang === "es" || storedLang === "en") setLangState(storedLang);
    const storedTheme = (localStorage.getItem("apex.theme") ||
      document.documentElement.dataset.theme) as Theme | undefined;
    if (storedTheme === "light" || storedTheme === "dark") setThemeState(storedTheme);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("apex.lang", l);
    } catch {}
    document.documentElement.lang = l;
  }, []);

  const setTheme = useCallback((tm: Theme) => {
    setThemeState(tm);
    try {
      localStorage.setItem("apex.theme", tm);
    } catch {}
    document.documentElement.dataset.theme = tm;
    document.documentElement.style.colorScheme = tm;
  }, []);

  /* --- hydrate progress: localStorage first, then server ------------------ */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      if (raw) setSnapshot({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}

    let cancelled = false;
    fetch("/api/progress")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ProgressSnapshot | null) => {
        if (cancelled || !data) return;
        setSnapshot((local) => {
          // Server wins for lesson/challenge state; local drafts win when newer
          // (they are saved on every keystroke, the server only on validate).
          const merged: ProgressSnapshot = {
            lessons: { ...local.lessons, ...data.lessons },
            challenges: { ...local.challenges, ...data.challenges },
            drafts: { ...data.drafts, ...local.drafts },
          };
          return merged;
        });
      })
      .catch(() => {})
      .finally(() => !cancelled && setReady(true));

    return () => {
      cancelled = true;
    };
  }, []);

  /* --- persist snapshot to localStorage ---------------------------------- */
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(snapshot));
    } catch {}
  }, [snapshot, ready]);

  const post = useCallback(async (body: unknown) => {
    pending.current += 1;
    setSaving(true);
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      /* offline / no DB: localStorage already holds the state */
    } finally {
      pending.current -= 1;
      if (pending.current <= 0) setSaving(false);
    }
  }, []);

  const touch = useCallback(
    (lessonId: string, moduleId: string, patch: Partial<ProgressSnapshot["lessons"][string]>) => {
      setSnapshot((s) => {
        const prev = s.lessons[lessonId] ?? {
          lessonId,
          moduleId,
          status: "not_started" as LessonStatus,
          theoryDone: false,
          quizDone: false,
          quizScore: null,
          quizTotal: null,
          exerciseDone: false,
        };
        const next = { ...prev, ...patch };
        next.status =
          next.theoryDone && next.quizDone && next.exerciseDone
            ? "completed"
            : "in_progress";
        return { ...s, lessons: { ...s.lessons, [lessonId]: next } };
      });
    },
    [],
  );

  const markTheory: ProgressApi["markTheory"] = useCallback(
    (lessonId, moduleId) => {
      touch(lessonId, moduleId, { theoryDone: true });
      void post({ action: "theory", lessonId, moduleId });
    },
    [post, touch],
  );

  const markQuiz: ProgressApi["markQuiz"] = useCallback(
    (lessonId, moduleId, score, total, answers) => {
      const passed = total > 0 && score / total >= 0.7;
      touch(lessonId, moduleId, {
        quizDone: passed,
        quizScore: score,
        quizTotal: total,
      });
      void post({ action: "quiz", lessonId, moduleId, score, total, answers, passed });
    },
    [post, touch],
  );

  const markExercise: ProgressApi["markExercise"] = useCallback(
    (lessonId, moduleId, args) => {
      if (args.passed) touch(lessonId, moduleId, { exerciseDone: true });
      else touch(lessonId, moduleId, {});
      void post({ action: "exercise", lessonId, moduleId, ...args });
    },
    [post, touch],
  );

  /* --- drafts: localStorage on every change, server on validate ---------- */
  const draftTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const saveDraft: ProgressApi["saveDraft"] = useCallback(
    (key, lessonId, componentId, code) => {
      setSnapshot((s) => ({ ...s, drafts: { ...s.drafts, [key]: code } }));
      try {
        localStorage.setItem(LS_DRAFT + key, code);
      } catch {}
      clearTimeout(draftTimers.current[key]);
      draftTimers.current[key] = setTimeout(() => {
        void post({ action: "draft", key, lessonId, componentId, code });
      }, 2500);
    },
    [post],
  );

  const getDraft: ProgressApi["getDraft"] = useCallback(
    (key) => {
      try {
        const local = localStorage.getItem(LS_DRAFT + key);
        if (local !== null) return local;
      } catch {}
      return snapshot.drafts[key];
    },
    [snapshot.drafts],
  );

  const setChallenge: ProgressApi["setChallenge"] = useCallback(
    (challengeId, patch) => {
      setSnapshot((s) => {
        const prev = s.challenges[challengeId] ?? {
          status: "not_started" as LessonStatus,
          passedComponents: [],
          hintsUsed: 0,
        };
        return {
          ...s,
          challenges: { ...s.challenges, [challengeId]: { ...prev, ...patch } },
        };
      });
      void post({ action: "challenge", challengeId, ...patch });
    },
    [post],
  );

  const reset: ProgressApi["reset"] = useCallback(() => {
    setSnapshot(EMPTY);
    try {
      localStorage.removeItem(LS_PROGRESS);
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith(LS_DRAFT)) localStorage.removeItem(k);
      }
    } catch {}
    void post({ action: "reset" });
  }, [post]);

  const settings = useMemo<Settings>(
    () => ({ lang, setLang, theme, setTheme }),
    [lang, setLang, theme, setTheme],
  );

  const progress = useMemo<ProgressApi>(
    () => ({
      snapshot,
      ready,
      markTheory,
      markQuiz,
      markExercise,
      saveDraft,
      getDraft,
      setChallenge,
      reset,
      saving,
    }),
    [snapshot, ready, markTheory, markQuiz, markExercise, saveDraft, getDraft, setChallenge, reset, saving],
  );

  return (
    <SettingsCtx.Provider value={settings}>
      <ProgressCtx.Provider value={progress}>{children}</ProgressCtx.Provider>
    </SettingsCtx.Provider>
  );
}
