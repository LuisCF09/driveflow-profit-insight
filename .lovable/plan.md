## Objetivo
Eliminar a tela “This page didn’t load” sem mudar o visual principal, atacando as causas mais prováveis de crash no fluxo real de uso.

## O que vou corrigir
1. Endurecer os fluxos de autenticação e pós-login
- Revisar `AuthCard`, onboarding e navegação pós-login/cadastro.
- Garantir que email e Google não redirecionem para telas que dependem de dados ainda inexistentes.
- Garantir criação/atualização de `profiles` de forma consistente antes de telas que leem nome do usuário.

2. Remover pontos de crash por dados ausentes ou schema divergente
- Revisar `AppShell`, `useDriveFlowData`, `useSubscription`, `dashboard`, `reports`, `rides`, `expenses`, `profile`.
- Tornar consultas tolerantes a perfil, veículo, corridas, despesas e assinatura ausentes.
- Padronizar os campos usados no frontend para não depender de colunas erradas ou opcionais sem fallback.

3. Blindar efeitos assíncronos que hoje podem quebrar a renderização
- Envolver leituras críticas de sessão e banco em `try/catch` com tratamento explícito.
- Evitar que falhas de `supabase.auth.getUser()` ou consultas em `profiles/vehicles/subscriptions` derrubem a página.
- Converter falhas em estados seguros: loading, redirect ou estado vazio, em vez de erro global.

4. Corrigir inconsistências entre landing, dashboard e rotas autenticadas
- Revisar a lógica que hoje mistura home pública com rotas autenticadas sem guarda central.
- Garantir que usuário sem veículo vá para onboarding com segurança.
- Garantir que usuário sem assinatura/dados continue vendo a app sem crash.

5. Validar o fluxo completo que hoje parece intermitente
- Testar home pública.
- Testar criar conta.
- Testar login.
- Testar entrada pelo Google.
- Testar navegação para dashboard/profile/reports com dados vazios.
- Confirmar que a tela de erro não reaparece nesses caminhos.

## Suspeitas principais já encontradas
- O erro não aparece de forma estável na home atual; isso indica problema intermitente de runtime e não um layout quebrado.
- Há vários pontos com leitura assíncrona direta de auth e banco sem proteção, especialmente em `AppShell`, `dashboard`, `profile`, `useDriveFlowData` e `useSubscription`.
- O frontend ainda depende de campos potencialmente inconsistentes (`name`, `date` e afins), o que pode quebrar após login, cadastro ou quando o banco retorna dados incompletos.

## Se precisar de backend
Se eu confirmar que a origem é incompatibilidade real de schema/política no banco, primeiro vou gerar o SQL e te mostrar antes de qualquer alteração backend.

## Resultado esperado
- A home abre sempre.
- Login/cadastro não derrubam a app.
- Dashboard e telas autenticadas sobrevivem a dados faltantes.
- Em caso de problema de dados, o usuário vê mensagem ou redirecionamento seguro, não a tela fatal de erro.