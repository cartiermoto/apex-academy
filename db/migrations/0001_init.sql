-- Apex Academy — initial schema.
-- Single-user course: there is no users table on purpose.

CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id     text PRIMARY KEY,
  module_id     text NOT NULL,
  status        text NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started', 'in_progress', 'completed')),
  theory_done   boolean NOT NULL DEFAULT false,
  quiz_done     boolean NOT NULL DEFAULT false,
  quiz_score    integer,
  quiz_total    integer,
  exercise_done boolean NOT NULL DEFAULT false,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_progress_module_idx ON lesson_progress (module_id);

-- Every answer to every quiz question, kept as history so spaced repetition can
-- later be driven from what was actually missed.
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          bigserial PRIMARY KEY,
  lesson_id   text NOT NULL,
  module_id   text NOT NULL,
  question_id text NOT NULL,
  answer      jsonb,
  correct     boolean NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quiz_attempts_lesson_idx ON quiz_attempts (lesson_id);
CREATE INDEX IF NOT EXISTS quiz_attempts_question_idx ON quiz_attempts (question_id);

-- One row per completed quiz run (score snapshot).
CREATE TABLE IF NOT EXISTS quiz_results (
  id         bigserial PRIMARY KEY,
  lesson_id  text NOT NULL,
  module_id  text NOT NULL,
  score      integer NOT NULL,
  total      integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Each validation run of a practical exercise: the code sent, whether it
-- passed, how many hints had been revealed, and the per-check results.
CREATE TABLE IF NOT EXISTS exercise_attempts (
  id           bigserial PRIMARY KEY,
  lesson_id    text NOT NULL,
  module_id    text NOT NULL,
  component_id text,
  code         text NOT NULL,
  passed       boolean NOT NULL,
  hints_used   integer NOT NULL DEFAULT 0,
  results      jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercise_attempts_lesson_idx ON exercise_attempts (lesson_id);

-- Autosaved editor contents. draft_key = lesson_id or lesson_id::component_id.
CREATE TABLE IF NOT EXISTS code_drafts (
  draft_key    text PRIMARY KEY,
  lesson_id    text NOT NULL,
  component_id text,
  code         text NOT NULL,
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Progress on the two projects (Desafío 1 and Desafío 2).
CREATE TABLE IF NOT EXISTS challenge_progress (
  challenge_id      text PRIMARY KEY,
  status            text NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  passed_components text[] NOT NULL DEFAULT '{}',
  hints_used        integer NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now()
);
