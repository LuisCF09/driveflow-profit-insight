ALTER TABLE public.rides ADD COLUMN IF NOT EXISTS total_minutes integer NOT NULL DEFAULT 0;
UPDATE public.rides SET total_minutes = ROUND(COALESCE(hours_worked, 0) * 60)::int WHERE total_minutes = 0;
ALTER TABLE public.rides ADD CONSTRAINT rides_total_minutes_nonneg CHECK (total_minutes >= 0);