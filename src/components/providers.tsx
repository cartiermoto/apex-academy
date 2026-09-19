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
  /** null while checking; true when signed in (progress syncs to the cloud) */
  authed: boolean | null;
  logout: () => Promise<void>;
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

type LP = ProgressSnapshot["lessons"][string];
type CP = ProgressSnapshot["challenges"][string];

function mergeLesson(a: LP | undefined, b: LP | undefined): LP {
  if (!a) return b!;
  if (!b) return a;
  const bestA = (a.quizScore ?? -1) >= (b.quizScore ?? -1);
  const m: LP = {
    ...a,
    theoryDone: a.theoryDone || b.theoryDone,
    quizDone: a.quizDone || b.quizDone,
    exerciseDone: a.exerciseDone || b.exerciseDone,
    quizScore: bestA ? a.quizScore : b.quizScore,
    quizTotal: bestA ? a.quizTotal : b.quizTotal,
  };
  m.status =
    m.theoryDone && m.quizDone && m.exerciseDone
      ? "completed"
      : m.theoryDone || m.quizDone || m.exerciseDone || m.quizScore != null
        ? "in_progress"
        : "not_started";
  return m;
}

function mergeChallenge(a: CP | undefined, b: CP | undefined): CP {
  if (!a) return b!;
  if (!b) return a;
  return {
    status:
      a.status === "completed" || b.status === "completed"
        ? "completed"
        : a.status === "in_progress" || b.status === "in_progress"
          ? "in_progress"
          : "not_started",
    passedComponents: Array.from(new Set([...a.passedComponents, ...b.passedComponents])),
    hintsUsed: Math.max(a.hintsUsed, b.hintsUsed),
  };
}

/** Union of this device and the cloud: nothing done anywhere is lost. */
export function mergeSnapshots(local: ProgressSnapshot, server: ProgressSnapshot): ProgressSnapshot {
  const lessons: ProgressSnapshot["lessons"] = {};
  for (const id of new Set([...Object.keys(local.lessons), ...Object.keys(server.lessons)])) {
    lessons[id] = mergeLesson(local.lessons[id], server.lessons[id]);
  }
  const challenges: ProgressSnapshot["challenges"] = {};
  for (const id of new Set([...Object.keys(local.challenges), ...Object.keys(server.challenges)])) {
    challenges[id] = mergeChallenge(local.challenges[id], server.challenges[id]);
  }
  // Drafts: this device wins — it autosaves on every keystroke.
  return { lessons, challenges, drafts: { ...server.drafts, ...local.drafts } };
}

/** What the merged snapshot knows that the server does not yet. */
function diffForServer(merged: ProgressSnapshot, server: ProgressSnapshot) {
  const same = (x: unknown, y: unknown) => JSON.stringify(x) === JSON.stringify(y);
  const lessons = Object.values(merged.lessons).filter((l) => {
    const s = server.lessons[l.lessonId];
    return !s || s.theoryDone !== l.theoryDone || s.quizDone !== l.quizDone ||
      s.exerciseDone !== l.exerciseDone || s.quizScore !== l.quizScore;
  });
  const challenges = Object.entries(merged.challenges)
    .filter(([id, c]) => !same(server.challenges[id], c))
    .map(([challengeId, c]) => ({ challengeId, ...c }));
  const drafts = Object.fromEntries(
    Object.entries(merged.drafts).filter(([k, v]) => server.drafts[k] !== v),
  );
  if (!lessons.length && !challenges.length && !Object.keys(drafts).length) return null;
  return { lessons, challenges, drafts };
}

/* -------------------------------------------------------------------------- */

export function Providers({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");
  const [theme, setThemeState] = useState<Theme>("light");
  const [snapshot, setSnapshot] = useState<ProgressSnapshot>(EMPTY);
  const [ready, setReady] = useState(false);
  const [localLoaded, setLocalLoaded] = useState(false);
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

  /* --- session -----------------------------------------------------------
     The course is public. Signing in (the course password) is optional and
     only switches on cloud sync: without a session nothing leaves the browser,
     so a visitor can use the course but can never touch the owner's progress. */
  const [authed, setAuthed] = useState<boolean | null>(null);
  const authedRef = useRef(false);

  /* --- hydrate progress: localStorage first, then (if signed in) Neon ------ */
  useEffect(() => {
    let local: ProgressSnapshot = EMPTY;
    try {
      const raw = localStorage.getItem(LS_PROGRESS);
      if (raw) local = { ...EMPTY, ...JSON.parse(raw) };
      // drafts are also stored per key, on every keystroke
      for (const k of Object.keys(localStorage)) {
        if (k.startsWith(LS_DRAFT)) {
          local = {
            ...local,
            drafts: { ...local.drafts, [k.slice(LS_DRAFT.length)]: localStorage.getItem(k) ?? "" },
          };
        }
      }
    } catch {}
    setSnapshot(local);
    setLocalLoaded(true);

    let cancelled = false;
    (async () => {
      try {
        const session = await fetch("/api/auth/session").then((r) => r.json());
        if (cancelled) return;
        const isAuthed = Boolean(session?.authenticated);
        authedRef.current = isAuthed;
        setAuthed(isAuthed);
        if (!isAuthed) return;

        const res = await fetch("/api/progress");
        if (!res.ok || cancelled) return;
        const server = (await res.json()) as ProgressSnapshot;

        // Union of both sides: nothing done on either device is ever lost.
        // Merge into the *current* state, not the one read at start-up: anything
        // marked while this request was in flight must survive it.
        let merged = mergeSnapshots(local, server);
        setSnapshot((current) => (merged = mergeSnapshots(current, server)));
        await new Promise((r) => setTimeout(r, 0));

        // Push back whatever this device knew that the server did not.
        const upload = diffForServer(merged, server);
        if (upload) {
          await fetch("/api/progress", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "merge", ...upload }),
          });
        }
      } catch {
        /* offline: the local copy is still fully usable */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    authedRef.current = false;
    setAuthed(false);
  }, []);

  /* --- persist snapshot to localStorage ---------------------------------- */
  // Starts as soon as the browser copy is loaded — not after the cloud answers —
  // so a step marked on a slow connection is saved even if the tab closes.
  useEffect(() => {
    if (!localLoaded) return;
    try {
      localStorage.setItem(LS_PROGRESS, JSON.stringify(snapshot));
    } catch {}
  }, [snapshot, localLoaded]);

  const post = useCallback(async (body: unknown) => {
    // Signed out: progress lives only in this browser (localStorage).
    if (!authedRef.current) return;
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
      authed,
      logout,
    }),
    [snapshot, ready, markTheory, markQuiz, markExercise, saveDraft, getDraft, setChallenge, reset, saving, authed, logout],
  );

  return (
    <SettingsCtx.Provider value={settings}>
      <ProgressCtx.Provider value={progress}>{children}</ProgressCtx.Provider>
    </SettingsCtx.Provider>
  );
}
