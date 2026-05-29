# Plano: Finalizar ação "Confirmar e salvar"

Hoje a tela já atualiza `imported_prints` e insere em `platform_entries` ao confirmar, mas redireciona direto para `/`. Vou ajustar para mostrar uma tela de sucesso explícita com a mensagem solicitada e três botões de próximo passo, mantendo proteção contra duplo clique e tratamento de erro.

## Alterações em `src/routes/importar-print.tsx`

### 1. Novo estado de sucesso
- `savedState: { importedPrintId: string; platformEntryId: string } | null`.
- Quando setado, esconde o formulário/upload/seção de revisão e renderiza um card de sucesso.

### 2. `confirmarSalvar()`
- Manter validação (plataforma, data, ganho bruto > 0).
- Manter `saving` como guarda contra duplo clique; sair cedo se `saving` já estiver `true` ou se `savedState` já existir.
- Update de `imported_prints` com os campos: `entry_date`, `gross_earnings`, `worked_hours`, `trips_count`, `kilometers`, `tips`, `fees`, `confidence`, `notes`, `status = "confirmed"`.
- Insert em `platform_entries` com `user_id`, `platform_name`, `entry_date`, `gross_earnings`, `worked_hours`, `trips_count`, `kilometers`, `source = "imported_print"`, `imported_print_id`, `notes`. Usar `.select('id').single()` para guardar o id.
- Em sucesso: setar `savedState`, toast `"Registro salvo com sucesso no seu histórico financeiro."`.
- Em erro: toast com a mensagem e manter o usuário na revisão para tentar novamente; **não** marcar como salvo.
- Rollback parcial: se o update de `imported_prints` deu certo mas o insert em `platform_entries` falhou, reverter `status` para `pending_review` para permitir nova tentativa sem duplicar.

### 3. Card de sucesso
Renderizado quando `savedState` existe, substituindo o conteúdo da página (mantendo `AppShell`):
- Ícone de check + título "Registro salvo com sucesso"
- Subtítulo: "Registro salvo com sucesso no seu histórico financeiro."
- Três botões:
  - **Ver dashboard** → `/dashboard`
  - **Importar outro print** → chama `clearAll()` + `setSavedState(null)` (permanece em `/importar-print`)
  - **Ver histórico** → `/reports`

### 4. Loading e proteção
- Botão "Confirmar e salvar" já mostra spinner via `saving` e fica `disabled`. Adicionar guarda no topo da função: `if (saving || savedState) return;`.

## Out of scope
- Sem alterações de schema, RLS ou outras telas.

## Arquivos alterados
- `src/routes/importar-print.tsx`
