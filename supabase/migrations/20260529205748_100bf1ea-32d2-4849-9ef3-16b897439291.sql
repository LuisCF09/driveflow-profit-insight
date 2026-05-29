CREATE TABLE public.imported_prints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  image_url text,
  entry_date date,
  gross_earnings numeric(10,2),
  worked_hours numeric(5,2),
  trips_count integer,
  kilometers numeric(8,2),
  tips numeric(10,2),
  fees numeric(10,2),
  confidence numeric(3,2),
  status text DEFAULT 'pending_review',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.imported_prints TO authenticated;
GRANT ALL ON public.imported_prints TO service_role;

ALTER TABLE public.imported_prints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ip select own" ON public.imported_prints
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "ip insert own" ON public.imported_prints
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ip update own" ON public.imported_prints
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ip delete own" ON public.imported_prints
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_imported_prints_user_id ON public.imported_prints(user_id);