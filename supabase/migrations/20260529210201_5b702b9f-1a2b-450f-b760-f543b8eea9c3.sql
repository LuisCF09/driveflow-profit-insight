CREATE TABLE public.platform_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  entry_date date NOT NULL,
  gross_earnings numeric(10,2) NOT NULL,
  worked_hours numeric(5,2),
  trips_count integer,
  kilometers numeric(8,2),
  fuel_cost numeric(10,2),
  extra_costs numeric(10,2),
  source text DEFAULT 'manual',
  imported_print_id uuid REFERENCES public.imported_prints(id) ON DELETE SET NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_entries TO authenticated;
GRANT ALL ON public.platform_entries TO service_role;

ALTER TABLE public.platform_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pe select own" ON public.platform_entries
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "pe insert own" ON public.platform_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pe update own" ON public.platform_entries
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pe delete own" ON public.platform_entries
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_platform_entries_user_id ON public.platform_entries(user_id);
CREATE INDEX idx_platform_entries_entry_date ON public.platform_entries(entry_date);