# Corrigir UX do erro "senha vazada" no cadastro

## Causa
O Supabase Auth está com **Leaked Password Protection (HIBP)** ativo. Quando o usuário escolhe uma senha que já vazou publicamente, o signup retorna `code: "weak_password"` com `reasons: ["pwned"]` e mensagem em inglês. A proteção está correta — só a UX precisa melhorar.

## Mudanças (apenas frontend, sem alterar design)

### 1. `src/components/AuthCard.tsx` — tratar erro do Supabase
No `catch` do `handleSubmit`, mapear códigos de erro para mensagens em português antes de exibir o toast:

- `weak_password` + `reasons.includes("pwned")` → "Essa senha já apareceu em vazamentos públicos. Escolha uma senha diferente, de preferência única para esta conta."
- `weak_password` (outros motivos) → "Senha muito fraca. Use ao menos 8 caracteres, misturando letras, números e símbolos."
- `user_already_exists` / `email_exists` → "Já existe uma conta com este email. Tente fazer login."
- `invalid_credentials` → "Email ou senha incorretos."
- `over_email_send_rate_limit` → "Muitas tentativas. Aguarde alguns minutos e tente novamente."
- Fallback: usar `error.message` original.

Aplicar o mesmo mapeamento tanto no fluxo de signup quanto de login.

### 2. `src/components/AuthCard.tsx` — feedback inline imediato
Manter o indicador de força de senha atual. Ao receber o erro `pwned`, além do toast, exibir uma mensagem inline em vermelho logo abaixo do campo Senha (mesmo estilo visual já existente) dizendo: "Senha encontrada em vazamentos públicos." Limpar essa mensagem quando o usuário editar o campo.

### 3. Sem mudanças no backend
- Não desativar a proteção HIBP — ela é importante.
- Não alterar tabelas, RLS, nem `configure_auth`.
- Não mexer em design tokens, layout ou cores existentes.

## Resultado
- Usuário entende em português por que a senha foi rejeitada.
- Feedback aparece junto ao campo, não só num toast.
- Demais erros de auth também ficam traduzidos consistentemente.
