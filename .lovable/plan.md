# Correção do cadastro por email/senha

## Diagnóstico (causa real)

Testei o endpoint de signup do Supabase diretamente:

- Com senha comum (`TestPassword123!`) → **422 `weak_password` / `pwned`** → nenhum usuário criado.
- Com senha aleatória forte (`Xq9!mB2#vL7$pK4r`) → **200 OK**, usuário criado, sessão retornada, `email_confirmed_at` preenchido (auto-confirm ligado). Não há trigger quebrado, `handle_new_user` funciona, `profiles` aceita as colunas (`id`, `name`, `email`), `subscriptions` idem. Google funciona porque não passa por validação de senha.

**A causa é a proteção "Leaked Password Protection (HIBP)"** ligada no projeto. O Supabase rejeita qualquer senha que já vazou em outros sites (ex.: `123456`, `senha123`, `Teste123!`, `DriveFlow2025`, etc.), retornando `weak_password.pwned`. Por isso nenhum usuário aparece em Authentication > Users — a requisição é rejeitada antes de criar o usuário.

O `AuthCard` **já traduz** esse erro ("Esta senha é muito comum ou foi vazada..."), mas a mensagem aparece só como `toast.error`, que some em poucos segundos. Pior: o medidor de força do componente mostra "Senha válida" assim que passa de 6 caracteres, então o usuário tem certeza de que a senha é boa e atribui o sumiço a um bug do sistema.

Nada está quebrado no banco, no trigger, no `signUp`, no `data: { name }` ou no redirect. O fluxo todo funciona quando a senha passa no HIBP.

## O que vou corrigir (apenas `src/components/AuthCard.tsx`)

1. **Erro inline persistente no formulário**, além do toast. Adicionar um state `formError: string | null` e renderizar uma caixa vermelha discreta logo acima do botão "Criar minha conta" quando o `signUp` falha. Limpa quando o usuário edita qualquer campo.
2. **Aviso preventivo no medidor de força** no modo signup: trocar o texto "Senha válida" por algo como "Evite senhas comuns ou já usadas em outros sites — o cadastro rejeita senhas vazadas." Mantém a barra atual (visual inalterado).
3. **Mensagem traduzida mais acionável** para o caso HIBP: "Esta senha já apareceu em vazamentos públicos e foi bloqueada. Use uma combinação única (ex.: 3 palavras aleatórias + número + símbolo)."
4. **Log de diagnóstico**: `console.error("[signup]", err)` no `catch` para que, se voltar a falhar por outro motivo, eu consiga investigar pelos console logs sem novo round de debug.

Nada muda em: design geral, dashboard, login Google, banco, rotas, `/onboarding`, `handle_new_user`, RLS, AuthProvider.

## Não vou fazer
- Desligar o HIBP (é proteção de segurança; o usuário não pediu).
- Mexer no banco / migrations.
- Alterar `signUp` payload (`data: { name }` está correto — o trigger lê `raw_user_meta_data->>'name'`).
- Tocar em `AuthProvider`, rotas, ou no fluxo de redirect.

## Detalhes técnicos
Arquivo único alterado: `src/components/AuthCard.tsx`. Sem novas dependências, sem nova rota, sem migration.
