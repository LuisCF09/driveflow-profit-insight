## Goal
Replace the single "Horas trabalhadas" (decimal) input with two validated fields — Hours (0–23) and Minutes (0–59) — store the value as `total_minutes` (integer) in the database, and display it as "X horas Y minutos" everywhere.

## Database
Add a new column to `rides` and backfill from the existing `hours_worked`:
- `total_minutes` integer NOT NULL DEFAULT 0
- Backfill: `total_minutes = ROUND(hours_worked * 60)`
- Add a CHECK constraint: `total_minutes >= 0`
- Keep `hours_worked` for now (read-only legacy) so existing rows/reports don't break; new writes only set `total_minutes`.

## Form — `src/components/AddRideDialog.tsx`
Replace the single "Horas trabalhadas" field with a "Tempo gasto" group:

```
Tempo gasto
[__ Horas]  [__ Minutos]
Ex: 2 horas 30 minutos
```

- Two `<input type="number">` fields with `min`, `max`, `step="1"`, `inputMode="numeric"`.
  - Hours: `min=0 max=23`
  - Minutes: `min=0 max=59`
- Block negatives and out-of-range on input (clamp + reject non-integers).
- Inline error messages in red when invalid:
  - "Horas devem estar entre 0 e 23"
  - "Minutos devem estar entre 0 e 59"
- Disable the Save button while invalid.
- On submit:
  - `total_minutes = hours * 60 + minutes`
  - Insert `total_minutes` into `rides` (omit `hours_worked` going forward; default 0).

## Read / display layer
Update the finance helpers and any UI that reads ride time so they prefer `total_minutes` and fall back to `hours_worked * 60` for legacy rows.

- `src/lib/finance.ts`
  - Add helper `rideMinutes(r): number = r.total_minutes ?? Math.round((r.hours_worked ?? 0) * 60)`.
  - Add formatter `formatMinutes(min): string` → e.g. `150` → `"2 horas 30 minutos"`, `0` → `"0 minutos"`, `60` → `"1 hora 0 minutos"`.
  - Update `summarize()` so `hours` is computed from `rideMinutes(r) / 60` (so R$/hora keeps working).
- `src/routes/dashboard.tsx` — `perHour` already uses `month.hours`; no logic change, just ensure the same source.
- `src/routes/rides.tsx` — show a "Tempo" column (or replace existing time display) using `formatMinutes(rideMinutes(r))`.
- Types: extend the local `Ride` type in `src/lib/finance.ts` with `total_minutes?: number`.

## Validation summary
- Numbers only (`type="number"`, `step="1"`, regex strip on change).
- No negatives, no decimals, no values above the per-field max.
- Friendly Portuguese error text matching the rest of the app.

## Out of scope
No visual redesign, no changes to other ride fields, no changes to expenses/goals/reports schemas.
