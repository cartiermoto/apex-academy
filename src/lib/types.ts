/**
 * Apex Academy — content model.
 *
 * Everything the student reads lives as data shaped by these types (see
 * src/content/**). The UI never hardcodes course text, so the course can be
 * edited without touching app code.
 */

export type Lang = "es" | "en";

/** A bilingual string. Every piece of course text is one of these. */
export type L = { es: string; en: string };

/* -------------------------------------------------------------------------- */
/* Glossary                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * A term that gets a tooltip wherever the course text marks it.
 *
 * Mark a term inside any theory string with [[id]] — the tooltip trigger shows
 * the entry's `term` in the active language — or [[id|visible text]] when the
 * sentence needs another form of the word ("transacciones", "compila"…).
 */
export interface GlossaryEntry {
  id: string;
  term: L;
  definition: L;
  /** the Salesforce Admin equivalent, when there is an honest one */
  admin?: L;
  /** where it is taught properly, e.g. "Módulo 4" */
  taughtIn?: L;
}

/* -------------------------------------------------------------------------- */
/* Theory                                                                     */
/* -------------------------------------------------------------------------- */

export type TheoryBlock =
  | { type: "lead"; text: L }
  | { type: "p"; text: L }
  | { type: "h"; text: L }
  | { type: "list"; ordered?: boolean; items: L[] }
  | { type: "code"; code: L; caption?: L }
  | {
      type: "callout";
      /** admin = the Salesforce-Admin metaphor thread; recall = active recall prompt */
      variant: "admin" | "tip" | "warn" | "recall";
      title: L;
      text: L;
    }
  | { type: "table"; head: L[]; rows: L[][] }
  | { type: "diagram"; id: string; caption?: L }
  | { type: "divider" };

/* -------------------------------------------------------------------------- */
/* Quiz                                                                       */
/* -------------------------------------------------------------------------- */

export type QuizTag =
  /** mixes concepts from more than one topic in a single item */
  | "interleaving"
  /** revisits an earlier lesson/module (spaced repetition) */
  | "spaced"
  /** "what does this print?" */
  | "predict-output"
  /** "this code is wrong — where?" */
  | "find-error"
  /** free recall, no options to recognise */
  | "recall";

interface QuizBase {
  id: string;
  prompt: L;
  /** optional code snippet shown above the options */
  code?: L;
  explain: L;
  tags?: QuizTag[];
  /** shown as a chip on spaced-repetition items, e.g. "Repaso · M1 L3" */
  from?: L;
}

export type QuizQuestion =
  | (QuizBase & { kind: "single"; options: L[]; answer: number })
  | (QuizBase & { kind: "multi"; options: L[]; answers: number[] })
  /** free typing; `accept` holds case-insensitive regex sources */
  | (QuizBase & { kind: "text"; accept: string[]; placeholder?: L });

/* -------------------------------------------------------------------------- */
/* Exercise validation                                                        */
/* -------------------------------------------------------------------------- */

export type Rule =
  | { op: "match"; pattern: string; flags?: string }
  | { op: "absent"; pattern: string; flags?: string }
  | { op: "count"; pattern: string; flags?: string; min?: number; max?: number }
  | { op: "all"; of: Rule[] }
  | { op: "any"; of: Rule[] };

export interface Check {
  id: string;
  /** what this check verifies, shown in the results list */
  label: L;
  rule: Rule;
  /** qualitative note when the check fails */
  onFail?: L;
  /** qualitative note when it passes — used by the feedback engine */
  onPass?: L;
  /** a check that is nice-to-have rather than required */
  optional?: boolean;
}

export interface Exercise {
  prompt: L;
  /** concrete requirements; the student must make decisions, not transcribe */
  brief: L[];
  starter: L;
  /** exactly three, escalating: area → concept → partial pseudocode */
  hints: [L, L, L];
  solution: L;
  checks: Check[];
  /** extra qualitative angles for the feedback engine */
  rubric?: L[];
}

/* -------------------------------------------------------------------------- */
/* Lessons & modules                                                          */
/* -------------------------------------------------------------------------- */

export interface Lesson {
  /** stable id, e.g. "m01-l03" */
  id: string;
  slug: string;
  n: number;
  kind: "lesson" | "checkpoint";
  title: L;
  summary: L;
  /** one-line Salesforce Admin equivalent, shown on the lesson's spec card */
  analogy?: L;
  objectives: L[];
  /** rough minutes */
  minutes: number;
  theory: TheoryBlock[];
  quiz: QuizQuestion[];
  exercise: Exercise;
}

/** Visual grouping of modules on the home ("Editorial por categorías"). */
export type ModuleCategory = "fund" | "logic" | "obj" | "robust" | "scope";

export interface Module {
  id: string;
  n: number;
  category: ModuleCategory;
  title: L;
  subtitle: L;
  status: "ready" | "planned";
  lessons: Lesson[];
  /** titles of the lessons still to be authored (shown on planned modules) */
  outline?: L[];
}

/* -------------------------------------------------------------------------- */
/* Challenges                                                                 */
/* -------------------------------------------------------------------------- */

export interface ChallengeComponent {
  id: string;
  name: L;
  /** e.g. "LeadAssignmentTrigger.trigger" */
  fileName: string;
  brief: L[];
  starter: L;
  hints: [L, L, L];
  checks: Check[];
}

export interface Challenge {
  id: string;
  n: number;
  title: L;
  subtitle: L;
  /** module id that must be complete to unlock, e.g. "m07" */
  requires: string;
  status: "ready" | "planned";
  scenario: TheoryBlock[];
  components: ChallengeComponent[];
  rubric: L[];
  minutes: number;
}

export interface Course {
  modules: Module[];
  challenges: Challenge[];
}

/* -------------------------------------------------------------------------- */
/* Progress (mirrors the Postgres schema)                                      */
/* -------------------------------------------------------------------------- */

export type LessonStatus = "not_started" | "in_progress" | "completed";

export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  status: LessonStatus;
  theoryDone: boolean;
  quizDone: boolean;
  quizScore: number | null;
  quizTotal: number | null;
  exerciseDone: boolean;
  updatedAt?: string;
}

export interface ExerciseAttempt {
  lessonId: string;
  componentId?: string;
  code: string;
  passed: boolean;
  hintsUsed: number;
  results?: unknown;
  createdAt?: string;
}

export interface ProgressSnapshot {
  lessons: Record<string, LessonProgress>;
  drafts: Record<string, string>;
  challenges: Record<
    string,
    { status: LessonStatus; passedComponents: string[]; hintsUsed: number }
  >;
}
