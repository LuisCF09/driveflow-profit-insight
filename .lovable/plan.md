## Goal
Gate premium features behind the user's subscription plan (`free` vs `premium`). Free users keep the basics; charts, full history, and unlimited reports become premium-only. No visual redesign.

## Plan source of truth
Add a small hook `src/hooks/use-subscription.ts`:
- Reads the user's row from `subscriptions` (1 row per user, created by `handle_new_user`).
- Returns `{ plan: "free" | "premium", isPremium: boolean, loading }`.
- `isPremium = plan === "premium" && status === "active"`.

Use it in dashboard, rides, reports, and profile pages.

## Dashboard — `src/routes/dashboard.tsx`
For free users:
- Keep the hero KPI card (lucro líquido do mês, hoje, R$/hora, custo/km).
- Keep the 4-stat grid (KM, combustível, corridas, dias trabalhados).
- Keep the "quick actions" row.
- Replace the "Receita × Custos × Lucro" chart block with a locked-state card (same outer `glass shadow-card rounded-2xl` shell, same height) containing:
  - Lock icon + title "Gráficos e analytics avançados"
  - Text "Faça upgrade para o Premium para ver gráficos e analytics avançados."
  - Button "Assinar Premium" → `Link to="/premium"`.
- Restrict the rides/expenses fed into the dashboard summaries to the **last 15 days** for free users (apply at the dashboard query layer only — DB data is untouched).

Premium users: unchanged (chart visible, no date cap).

## Rides page — `src/routes/rides.tsx`
- Registration stays unlimited for everyone (no gate on AddRideDialog).
- For free users, list only rides from the last 15 days and add a subtle banner above the table: "Mostrando últimos 15 dias. Upgrade para histórico completo." with an inline link to `/premium`.

## Reports page — `src/routes/reports.tsx`
Free users:
- Allow ranges 7 and 15 days only; disable 30/90/180/365 buttons (greyed + lock icon, click → toast "Disponível no Premium").
- Counter at top: "Você usou X de 2 relatórios neste período (últimos 15 dias)."
  - "Report usage" = count of rows in `reports` for this user where `created_at >= now() - 15 days`.
  - Add a "Salvar relatório" button that inserts a row into `reports` with the current `gross_earnings`, `total_costs`, `net_profit`, `month`, `year`, and a `data` JSON snapshot.
  - When `X >= 2`, disable the save button and show: "Limite atingido. Upgrade para relatórios ilimitados." with link to `/premium`.

Premium users:
- All ranges enabled, no counter, no save limit.

## Profile / Vehicles — `src/routes/profile.tsx` (vehicle section)
- Free users: limit to 1 active vehicle. If a vehicle already exists, disable "Adicionar veículo" with text "Plano Grátis permite 1 veículo. Faça upgrade para múltiplos." + link to `/premium`.
- Premium: unlimited (current behavior).

(If profile.tsx doesn't currently expose a vehicle-add button, only enforce the limit where vehicles can be created — onboarding already creates the first vehicle, so this is a no-op for new free users.)

## Premium page — `src/routes/premium.tsx`
- Reflect actual plan: if user is premium, show "Plano atual" on the Premium card and disable the upgrade button; if free, keep the current layout.
- The upgrade button still shows the "em desenvolvimento" toast — payments wiring is out of scope for this task.

## What is NOT changing
- Database schema, RLS, design tokens, route structure, AddRideDialog, finance helpers.
- No payment provider integration.

## Acceptance check
- New account (plan=free) → dashboard shows locked chart card + upgrade button; reports page caps at 15d and shows "0 de 2"; rides page shows only last 15 days with banner.
- Manually flipping `subscriptions.plan` to `premium` for a user removes every gate without a code change.
