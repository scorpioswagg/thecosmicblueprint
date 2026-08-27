CREATE TABLE public.synastry_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Synastry Session',
  person_a_name text NOT NULL,
  person_b_name text NOT NULL,
  chart_a jsonb NOT NULL DEFAULT '{}'::jsonb,
  chart_b jsonb NOT NULL DEFAULT '{}'::jsonb,
  synastry jsonb NOT NULL DEFAULT '{}'::jsonb,
  reports jsonb NOT NULL DEFAULT '[]'::jsonb,
  qa jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.synastry_sessions TO authenticated;
GRANT ALL ON public.synastry_sessions TO service_role;

ALTER TABLE public.synastry_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own synastry sessions"
  ON public.synastry_sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own synastry sessions"
  ON public.synastry_sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synastry sessions"
  ON public.synastry_sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synastry sessions"
  ON public.synastry_sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX idx_synastry_sessions_user ON public.synastry_sessions (user_id, created_at DESC);

CREATE TRIGGER update_synastry_sessions_updated_at
  BEFORE UPDATE ON public.synastry_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();