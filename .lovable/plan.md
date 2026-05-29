# Plano: Página "Histórico Financeiro"

Criar uma nova rota `/historico` que lista os registros de `platform_entries` do usuário autenticado, com filtros, cards de resumo, edição inline e exclusão. RLS já restringe a `auth.uid() = user_id`, então não há mudanças de schema.

## Arquivos

### 1. Novo: `src/routes/historico.tsx`
Rota `createFileRoute("/historico")` com `head()` próprio ("Histórico Financeiro — DriveFlow"). Componente client-side que faz fetch via `supabase.from("platform_entries").select(...).eq("user_id", user.id)`.

#### Estado e dados
- `entries: PlatformEntry[]` carregados ao montar.
- `loading`, `error`.
- Filtros (todos client-side sobre o array carregado):
  - `platformFilter: string` ("todas" | nome) — derivado dos valores distintos.
  - `range: number` (7 / 15 / 30 / 90 / 180 / 365 / "todos") aplicado a `entry_date`.
  - `sourceFilter: "todos" | "manual" | "imported_print"`.

#### Cards de resumo (computados sobre a lista filtrada)
- Total ganho (R$): soma `gross_earnings`.
- Total de horas: soma `worked_hours`.
- Total de km: soma `kilometers`.
- Média por hora: `total_ganho / total_horas` (omite quando horas = 0).
- Média por km: `total_ganho / total_km` (omite quando km = 0).

Grid responsivo de 5 cards (`grid-cols-2 md:grid-cols-5`).

#### Tabela / Lista
- Em telas `md+`: `<table>` com colunas Data, Plataforma, Ganho bruto, Horas, Corridas/entregas, Km, Origem, Observações, Ações.
- Em telas pequenas: stack de cards com os mesmos campos rotulados.
- Origem: pill "Manual" ou "Importado por print" (com cor/ícone distinto).
- Estado vazio: mensagem "Nenhum registro encontrado para os filtros selecionados."

#### Ações por linha
- **Editar**: abre um modal/painel inline (dialog próprio do projeto ou seção expansível) com os mesmos campos editáveis usados na tela de importar (data, ganho bruto, horas, corridas, km, observações, plataforma). Salva via `update` em `platform_entries` (com `eq("id", row.id)`; RLS garante posse).
- **Excluir**: confirmação simples (`window.confirm`) e depois `delete().eq("id", row.id)`. Atualiza a lista local.
- Toasts de sucesso/erro via `sonner`.

#### Segurança
- Filtra pelo `user.id` retornado por `supabase.auth.getUser()`, embora RLS já garanta isso.
- Redireciona para `/` se não autenticado (o `AppShell` já cobre, mas mantém checagem antes do fetch).

### 2. Editar `src/components/AppShell.tsx`
Adicionar item de navegação na constante `NAV`:
```
{ to: "/historico", label: "Histórico", icon: History },
```
Importar `History` de `lucide-react`. Posicionar entre "Relatórios" e "Como funciona".

### 3. Editar `src/routes/importar-print.tsx`
No card de sucesso, atualizar o botão "Ver histórico" para `to="/historico"` (hoje aponta para `/reports`).

## Out of scope
- Sem alterações no banco (RLS e tabela já atendem).
- Sem paginação/infinite scroll — a tabela carrega todos os registros do usuário (limite padrão do Supabase = 1000 é suficiente nesta fase). Adicionar uma nota mental para paginar quando crescer.
- Sem export CSV.
