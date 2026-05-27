## Goal
Add a validated CPF field to user profiles, editable in the profile page (not at signup, to keep the auth flow minimal). Format on input, validate with the official CPF algorithm, enforce uniqueness at the DB level, and display masked everywhere except in the edit input.

## Database — migration
- `ALTER TABLE public.profiles ADD COLUMN cpf text;`
- Store CPF as 11 digits only (no dots/dashes) — formatting is a display concern.
- `CREATE UNIQUE INDEX profiles_cpf_unique ON public.profiles (cpf) WHERE cpf IS NOT NULL;`
- Add a CHECK constraint: `cpf IS NULL OR cpf ~ '^\d{11}$'`.
- RLS already allows the user to update their own profile — no policy changes.

## Validation utility — `src/lib/cpf.ts` (new)
Pure helpers, no dependencies:
- `onlyDigits(s): string`
- `formatCPF(digits): string` → `123.456.789-09`
- `maskCPF(digits): string` → `***.***.***-09` (only last 2 digits shown; returns `""` if empty)
- `isValidCPF(digits): boolean`:
  - length 11
  - reject all-same-digit sequences (`00000000000`…`99999999999`)
  - run the standard two-check-digit algorithm

## Profile page — `src/routes/profile.tsx`
- Add CPF to the "Conta" section, below E-mail.
- Two display modes:
  - **Read mode (default)**: show masked value (`***.***.***-09`) with an "Editar" button. If no CPF yet, show "Não cadastrado" + "Adicionar" button.
  - **Edit mode**: an input that:
    - Auto-formats while typing (`onChange` strips non-digits, then formats up to 14 chars).
    - Shows red inline error "CPF inválido" when 11 digits have been entered but the algorithm fails.
    - "Salvar" button is disabled until `isValidCPF(digits) === true`.
    - "Cancelar" button reverts.
- On Save:
  - `update profiles set cpf = <11 digits> where id = auth.uid()`.
  - On Postgres unique-violation (code `23505`), show toast: "Este CPF já está cadastrado".
  - On success, exit edit mode and show toast "CPF atualizado".
- Load CPF on mount via the same `profiles` select that already runs.

## Out of scope
- No CPF prompt during signup — keep `AuthCard` untouched.
- No mask on display elsewhere in the app (CPF is only shown on the profile page).
- No changes to `subscriptions`, `vehicles`, or any other table.

## Acceptance check
- Editing a valid CPF (e.g. `529.982.247-25`) saves and renders as `***.***.***-25`.
- Editing an invalid CPF (`111.111.111-11`, random 11 digits) keeps the Save button disabled and shows "CPF inválido".
- Trying to save a CPF already used by another user shows the "já cadastrado" toast.
