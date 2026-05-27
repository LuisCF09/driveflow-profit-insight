## Validação de Senha — Mínimo 6 Caracteres

### Contexto
A validação de senha com mínimo de 6 caracteres já está implementada no `AuthCard.tsx` e `profile.tsx`. Este plano reforça a consistência em todos os pontos de contato e adiciona feedback visual para o usuário.

### Alterações

1. **AuthCard.tsx**
   - Adicionar `minLength={6}` ao campo "Confirmar senha" (atualmente falta no signup)
   - Adicionar indicador visual de força da senha (barra de progresso com cor) abaixo do campo de senha no modo signup
   - Mensagem de erro inline ao digitar menos de 6 caracteres

2. **profile.tsx**
   - Adicionar `minLength={6}` ao input de nova senha
   - Adicionar indicador visual de força da senha
   - Desabilitar botão "Trocar" enquanto senha tiver menos de 6 caracteres

3. **Mensagens de erro consistentes**
   - Padronizar todas as mensagens para: "A senha deve ter pelo menos 6 caracteres"
   - Garantir que erros do Supabase também sejam traduzidos corretamente se mencionarem tamanho de senha

### Resultado esperado
Usuário recebe feedback imediato sobre o tamanho mínimo da senha em todos os fluxos: cadastro, login e alteração de senha.