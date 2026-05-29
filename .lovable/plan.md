Implementar upload da imagem do print para Supabase Storage e registrar o print na tabela `imported_prints`.

**Banco de dados (migration)**
- Criar bucket `imported-prints` (privado) via `storage.buckets`.
- Políticas em `storage.objects` para o bucket:
  - SELECT: usuários autenticados podem ver apenas arquivos dentro da própria pasta (`auth.uid()::text = (storage.foldername(name))[1]`).
  - INSERT: mesma regra para upload.
  - UPDATE/DELETE: mesma regra (para permitir trocar/remover).

**Frontend — `src/routes/importar-print.tsx`**
- Obter usuário atual via `supabase.auth.getUser()`; se não autenticado, mostrar erro.
- Ao clicar em "Analisar print":
  1. Sanitizar o nome do arquivo (remover espaços/acentos).
  2. Gerar caminho `user_id/{timestamp}-{nome}`.
  3. `supabase.storage.from('imported-prints').upload(path, file)`.
  4. Obter URL via `createSignedUrl` (bucket privado, 1 ano).
  5. Inserir em `imported_prints` com: `user_id`, `platform_name`, `image_url` (caminho do storage), `status='pending_review'`.
  6. Mostrar toast de sucesso; manter preview da imagem na tela.
  7. Em qualquer falha, toast de erro com mensagem.
- Mostrar estado "enviado" abaixo do preview (badge "Enviado · aguardando revisão").

**Fora de escopo**
- Não gravar nada em `platform_entries`.
- Sem extração de dados por IA.