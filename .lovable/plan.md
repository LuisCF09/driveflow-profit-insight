## Plano: Páginas Termos, Privacidade e Contato

### 1. Banco de dados
Migration criando `public.contact_messages`:
- `id`, `user_id` (nullable, sem FK pra `auth.users` por convenção do projeto), `name`, `email`, `subject`, `message`, `status` default `'new'`, `created_at`.
- GRANTs: `INSERT` para `anon` e `authenticated`; `ALL` para `service_role`. Sem `SELECT` para usuários comuns (só service_role lê).
- RLS habilitada.
- Policies:
  - `INSERT` autenticado: `auth.uid() = user_id` (vincula ao próprio usuário).
  - `INSERT` anônimo: `user_id IS NULL` (permite envio sem login).
  - Sem policies de SELECT/UPDATE/DELETE para `anon`/`authenticated` (admins futuramente via service_role / role table).

### 2. Novas rotas

**`src/routes/termos.tsx`** — "Termos de Uso"
- Layout simples reaproveitando o estilo do `index.tsx` (bg-hero, grid-bg, container max-w-3xl).
- Conteúdo em seções com `<h2>` e parágrafos cobrindo todos os pontos pedidos (ferramenta de organização, sem afiliação com Uber/99/iFood/Mercado Livre/Rappi, responsabilidade do usuário, estimativas, revisão de prints, sem garantia de ganhos, evitar dados sensíveis, atualizações, aceitação ao usar).
- "Última atualização: maio de 2026" no final.
- `head()` com title/description próprios.

**`src/routes/privacidade.tsx`** — "Política de Privacidade"
- Mesmo layout.
- Seções: dados coletados (lista), uso dos dados (lista), uso dos prints, edição/exclusão pelo usuário, não venda de dados, alerta sobre dados sensíveis em prints, proteção via autenticação + RLS, isolamento por usuário, contato para suporte/remoção.
- "Última atualização: maio de 2026".
- `head()` próprio.

**`src/routes/contato.tsx`** — "Fale com o DriveFlow"
- Texto introdutório.
- Formulário (`<form>` controlado com `useState` + validação Zod) com Nome, Email, Assunto, Mensagem (textarea).
- Validação: nome obrigatório, email válido, assunto obrigatório, mensagem ≥10 chars. Erros exibidos por campo.
- Submit: insere em `contact_messages` via `supabase.from('contact_messages').insert(...)` no client. Pega `user_id` de `supabase.auth.getUser()` (null se deslogado). Toast de sucesso "Mensagem enviada com sucesso. Em breve entraremos em contato." e limpa o form.
- Funciona logado ou deslogado (RLS permite ambos).
- `head()` próprio.

### 3. Navegação
- **Rodapé do `src/routes/index.tsx`**: trocar os 3 `<a href="#">` (Termos / Privacidade / Contato) por `<Link to="/termos">`, `<Link to="/privacidade">`, `<Link to="/contato">`.
- **`src/components/AuthCard.tsx`**: verificar se tem rodapé; se sim, adicionar os mesmos 3 links. Se não tiver, adicionar uma linha discreta abaixo dos botões com os 3 links em texto pequeno (`text-xs text-muted-foreground`).
- Páginas são públicas (não passam pelo `AppShell`), acessíveis sem login.

### 4. Tom
Linguagem simples, profissional. Sem juridiquês. Sem afirmar parceria oficial. Sem prometer ganhos. Deixa claro que cálculos são estimativas e leitura de prints pode errar.

### Arquivos
- migration `contact_messages` (1)
- novo `src/routes/termos.tsx`
- novo `src/routes/privacidade.tsx`
- novo `src/routes/contato.tsx`
- editar `src/routes/index.tsx` (links do rodapé)
- editar `src/components/AuthCard.tsx` (links no rodapé do card, se couber)
