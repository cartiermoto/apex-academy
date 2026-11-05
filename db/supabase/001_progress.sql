-- Apex Academy: progress per user. Paste into Supabase → SQL Editor and run once.
-- Every row belongs to one account, and Row Level Security lets each account
-- reach only its own rows, whatever the client sends.

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id       uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id     text NOT NULL,
  module_id     text NOT NULL,
  status        text NOT NULL DEFAULT 'not_started'
                CHECK (status IN ('not_started', 'in_progress', 'completed')),
  theory_done   boolean NOT NULL DEFAULT false,
  quiz_done     boolean NOT NULL DEFAULT false,
  quiz_score    integer,
  quiz_total    integer,
  exercise_done boolean NOT NULL DEFAULT false,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Autosaved editor contents. draft_key = lesson_id or lesson_id::component_id.
CREATE TABLE IF NOT EXISTS public.code_drafts (
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  draft_key    text NOT NULL,
  lesson_id    text NOT NULL,
  component_id text,
  code         text NOT NULL CHECK (length(code) <= 200000),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, draft_key)
);

CREATE TABLE IF NOT EXISTS public.challenge_progress (
  user_id           uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  challenge_id      text NOT NULL,
  status            text NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  passed_components text[] NOT NULL DEFAULT '{}',
  hints_used        integer NOT NULL DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, challenge_id)
);

-- History: every answer, so spaced repetition can later use what was missed.
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id   text NOT NULL,
  module_id   text NOT NULL,
  question_id text NOT NULL,
  answer      jsonb,
  correct     boolean NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quiz_attempts_user_idx ON public.quiz_attempts (user_id, module_id);

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id  text NOT NULL,
  module_id  text NOT NULL,
  score      integer NOT NULL,
  total      integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS quiz_results_user_idx ON public.quiz_results (user_id, module_id);

CREATE TABLE IF NOT EXISTS public.exercise_attempts (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  lesson_id    text NOT NULL,
  module_id    text NOT NULL,
  component_id text,
  code         text NOT NULL CHECK (length(code) <= 200000),
  passed       boolean NOT NULL,
  hints_used   integer NOT NULL DEFAULT 0,
  results      jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS exercise_attempts_user_idx ON public.exercise_attempts (user_id, module_id);

-- Signed-in users only (new tables are not exposed automatically on this
-- project), and each of them only to their own rows.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['lesson_progress', 'code_drafts', 'challenge_progress',
                           'quiz_attempts', 'quiz_results', 'exercise_attempts']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('DROP POLICY IF EXISTS own_rows ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY own_rows ON public.%I FOR ALL TO authenticated
         USING ((SELECT auth.uid()) = user_id)
         WITH CHECK ((SELECT auth.uid()) = user_id)', t);
  END LOOP;
END $$;
