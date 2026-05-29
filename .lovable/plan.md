## Diagnóstico

Os fluxos de **Adicionar corrida** e **Adicionar despesa** já estão implementados e funcionais. Verifiquei:

| Requisito | Status |
|---|---|
| Salvar em `rides` com `user_id` | ✅ `AddRideDialog.tsx` linha 44 |
| Salvar em `expenses` com `user_id` | ✅ `AddExpenseDialog.tsx` linha 25 |
| Toast de sucesso | ✅ `toast.success(...)` (sonner) |
| Toast de erro claro | ✅ `toast.error(err.message)` no `catch` |
| Fechar modal após salvar | ✅ todos os call sites fazem `setOpen(false)` no `onSaved` (dashboard, rides, expenses, AppShell FAB) |
| Atualizar dashboard automaticamente | ✅ `reload()` chamado no `onSaved` |
| Filtragem por `user_id` | ✅ via RLS (`r insert own`, `e insert own`) |

## Conflito de nomes de colunas

Os nomes que você pediu **não existem** na tabela real. O código já usa os nomes corretos do schema:

| Você pediu (rides) | Schema real | Você pediu (expenses) | Schema real |
|---|---|---|---|
| `amount` | `gross_earnings` | `name` | `description` |
| `distance_km` | `km_driven` | | |
| `duration_minutes` | `total_minutes` | | |
| `notes` | `note` | | |

Como você disse **"não criar tabela nova, usar apenas as tabelas existentes"**, o mapeamento atual é o correto e nada precisa ser mudado.

## Plano

**Nenhuma alteração de código é necessária.** Os dois diálogos já fazem exatamente o que você descreveu, usando as colunas reais das tabelas existentes.

Se na prática você está vendo algum bug (erro ao salvar, modal não fechando, dashboard não atualizando), me diga **a mensagem de erro exata** ou **o passo que falha**, que eu corrijo direto. Sem reprodução de bug, mexer aqui só vai gastar créditos sem mudar comportamento.

### Alternativa (só se você quiser mesmo renomear)

Se você prefere que as colunas se chamem `amount`, `distance_km`, `duration_minutes`, `notes`, `name` para combinar com seu pedido, isso exigiria **migração SQL renomeando colunas** em `rides` e `expenses` + atualizar todos os lugares que leem esses campos (dashboard, hook `use-driveflow-data`, `lib/finance.ts`, páginas `rides` e `expenses`, relatórios). É um refactor maior — me confirme antes que eu vou nessa direção.
