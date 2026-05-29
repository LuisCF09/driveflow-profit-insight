## Objetivo
Adicionar lógica visual de plano Premium na tela "Importar Print" do DriveFlow, sem quebrar o fluxo atual.

## Contexto atual
- O hook `useSubscription` já existe (`src/hooks/use-subscription.ts`) e lê da tabela `subscriptions`.
- A rota `/premium` já existe (`src/routes/premium.tsx`).
- A tela "Importar Print" (`src/routes/importar-print.tsx`) não possui nenhuma verificação de plano.
- A leitura inteligente de prints ainda opera em modo de simulação (dados mockados).

## O que será alterado

### 1. Banner de aviso para usuários Free
Na tela `importar-print.tsx`, abaixo do hero e acima do formulário de upload, adicionar um banner condicional visível apenas quando `!isPremium`.

Conteúdo do banner:
- Ícone de cadeado ou alerta
- Texto: "Leitura inteligente de prints é uma função Premium. No plano grátis, você ainda pode preencher os dados manualmente."
- Botão "Ver planos" com link para `/premium`

### 2. Comportamento do botão "Analisar print"
- **Premium (`isPremium = true`)**: mantém o comportamento atual. Clica em "Analisar print" → gera dados simulados → mostra seção de revisão.
- **Free (`isPremium = false`)**: o botão "Analisar print" será desabilitado com tooltip/estilo visual indicando que é Premium. Ao clicar, exibe um `toast.info("Leitura inteligente é exclusiva do Premium.")` em vez de processar.

### 3. Fluxo de preenchimento manual para Free
Free users precisam poder preencher os dados sem usar a leitura inteligente. Implementação:
- Adicionar um segundo botão ao lado de "Analisar print" (visível para free): **"Preencher manualmente"**.
- Ao clicar, abre a seção de revisão diretamente no modo `edit` com um objeto `DetectedData` vazio (campos default vazios/zero, plataforma = selecionada, data = hoje).
- Isso permite que free users enviem o print como comprovante e preencham os dados manualmente, salvando normalmente em `platform_entries`.

### 4. Ajustes visuais na seção de revisão
- Quando os dados vierem de preenchimento manual (free), não mostrar o badge de "Modo de simulação" nem o badge de confiança.
- O badge de confiança e o aviso de simulação continuam aparecendo apenas quando `detected` foi gerado pela análise (premium).

### 5. Permissões de salvamento
- Tanto free quanto premium podem salvar registros importados/preenchidos manualmente.
- Nenhuma restrição é adicionada ao `confirmarSalvar` ou à tabela `platform_entries`.

## Arquivos modificados
- `src/routes/importar-print.tsx` — único arquivo alterado.

## Fora do escopo
- Sem alterações no schema do banco.
- Sem alterações em `subscriptions`, `platform_entries`, `premium.tsx` ou `use-subscription.ts`.
- Não se altera o dashboard, histórico, ou outras telas.