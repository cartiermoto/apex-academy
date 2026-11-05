-- Apex Academy: study streak. Paste into Supabase → SQL Editor and run once.
-- One row per account per calendar day on which the student completed a section.
-- Same rule as the other tables: each account reaches only its own rows.

CREATE TABLE IF NOT EXISTS public.study_days (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  day     date NOT NULL,
  PRIMARY KEY (user_id, day)
);

ALTER TABLE public.study_days ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.study_days FROM anon;
GRANT SELECT, INSERT, DELETE ON public.study_days TO authenticated;
DROP POLICY IF EXISTS own_rows ON public.study_days;
CREATE POLICY own_rows ON public.study_days FOR ALL TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
