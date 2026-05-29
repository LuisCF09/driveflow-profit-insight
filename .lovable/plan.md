## Objetivo

1. Reforçar privacidade na tela **Importar Print** (seção de boas práticas + aviso antes do envio).
2. Permitir que o usuário **exclua prints importados**, com **confirmação** e remoção do **arquivo no Storage** quando possível. Sempre escopado ao próprio `user_id` (já garantido por RLS).

## Mudanças

### 1. `src/routes/importar-print.tsx` — privacidade

- **Seção "Privacidade e cuidados com o print"** (card `glass`, ícone `ShieldCheck`/`Lock`), posicionada logo acima do bloco de upload, com o texto:
  > Use prints que mostrem apenas informações necessárias para o controle financeiro. Evite enviar imagens com dados sensíveis, documentos, endereço, CPF ou informações pessoais desnecessárias.
- **Aviso pré-upload** (faixa `border-amber-500/30 bg-amber-500/10`, ícone `AlertCircle`), renderizada dentro do card de upload, **antes** dos botões "Analisar com IA" / "Preencher manualmente", com o texto:
  > Antes de enviar, confira se o print não contém dados pessoais que você não deseja armazenar.
- Sem mudanças no fluxo de upload/análise.

### 2. Exclusão de prints importados

Helper compartilhado **novo**: `src/lib/imported-prints.ts`

```ts
export async function deleteImportedPrint(id: string, imageUrl: string | null): Promise<void>
```

Comportamento:
1. Extrai o `path` do `imageUrl` procurando o segmento `/imported-prints/` na URL assinada (ex.: `.../object/sign/imported-prints/<userId>/<file>?token=...`). Decodifica e remove query string.
2. `supabase.storage.from("imported-prints").remove([path])` — falha é apenas logada (toast warning), não bloqueia.
3. `supabase.from("imported_prints").delete().eq("id", id)` — RLS já garante escopo do usuário; erro aqui é fatal e propaga.

### 3. `src/routes/historico.tsx` — usar o helper

Em `handleDelete(id)`:
- Trocar `window.confirm` por **`AlertDialog`** (shadcn) com título "Excluir registro?", descrição explicando que o registro do histórico será removido e, **se o registro veio de um print importado**, o print original e a imagem também serão apagados. Botões: "Cancelar" / "Excluir".
- Após excluir `platform_entries`, se a entry tiver `imported_print_id`, buscar `image_url` correspondente (`select image_url from imported_prints where id = ...`) e chamar `deleteImportedPrint(imported_print_id, image_url)`.
- Estado de "abrindo dialog" controlado por `confirmDeleteId: string | null`.

### 4. `src/routes/importar-print.tsx` — cancelar importação

Atualizar `cancelarImportacao()` para, em vez de marcar `status: "discarded"`, chamar `deleteImportedPrint(importedPrintId, signedUrl)` — assim o cancelamento já remove o registro e a imagem (consistente com a nova capacidade de exclusão). Mantém o toast "Importação cancelada." e o `clearAll()`.

## Fora do escopo

- Sem migração de banco (RLS de `imported_prints` já cobre `delete` por `user_id`).
- Sem nova tela de gerenciamento de prints — exclusão fica nos pontos já existentes (histórico + cancelamento na tela de importar).
- Sem mudanças nos textos já revisados em rodadas anteriores.
- Sem alterações em `analyze-print/`, server functions, ou outros usuários.
