# Plano: Simulação de Leitura Inteligente de Prints

## Resumo
Implementar uma simulação de "leitura inteligente" na tela "Importar Print". Quando o usuário enviar uma imagem e clicar em "Analisar print", o sistema gerará dados simulados para preencher os campos de revisão. Os dados serão editáveis antes de salvar. A interface deixará claro que está em modo de simulação.

## Alterações no Frontend (src/routes/importar-print.tsx)

### 1. Estados de Dados Detectados
Adicionar estados controlados para os campos de revisão:
- entryDate (Date)
- grossEarnings (number)
- workedHours (number)
- tripsCount (number)
- kilometers (number)
- tips (number)
- fees (number)
- confidence (number)
- notes (text)
- analysisReady (boolean) — controla exibição da seção de revisão

### 2. Função de Simulação (analisar)
Manter o fluxo de upload da imagem ao Storage e inserção em imported_prints.
Após o upload bem-sucedido, gerar dados simulados fixos conforme especificado:
- plataforma = plataforma selecionada pelo usuário
- data = data atual
- ganho bruto = 186.40
- horas trabalhadas = 7.5
- corridas/entregas = 18
- km rodados = 94.2
- gorjetas = 12.00
- taxas/descontos = 0
- confiança = 0.87
- observações = "Dados gerados em modo de simulação."

Atualizar o registro em imported_prints com os dados simulados (preenchendo os campos correspondentes).

### 3. Seção de Revisão — Interface
Substituir a seção "Dados detectados" (estática) por uma área condicional que aparece quando analysisReady === true.

Layout da revisão:
- Badge/alerta no topo: "Modo de simulação — leitura inteligente em desenvolvimento"
- Indicador de confiança com cor e label:
  - >= 0.80 → verde · "Alta confiança"
  - 0.50–0.79 → amarelo/laranja · "Média confiança"
  - < 0.50 → vermelho · "Baixa confiança"
- Campos editáveis em grid de 2 colunas (sm:):
  - Data (date input)
  - Ganho bruto (number, step 0.01)
  - Horas trabalhadas (number, step 0.01)
  - Corridas / entregas (number)
  - Km rodados (number, step 0.01)
  - Gorjetas (number, step 0.01)
  - Taxas / descontos (number, step 0.01)
- Campo de observações (textarea, full width)
- Botões de ação:
  - "Salvar registro" — insere em platform_entries e atualiza imported_prints.status para "confirmed"
  - "Descartar" — limpa a análise e mantém apenas a imagem em pending_review

### 4. Estados e Feedback
- Durante análise: spinner "Analisando print..." no botão
- Após análise: preview da imagem continua visível, seção de revisão renderiza
- Sucesso ao salvar: toast de confirmação, limpa o formulário

## Out of Scope (conforme instrução do usuário)
- Não salvar em platform_entries até revisão e confirmação do usuário.

## Arquivos Alterados
- src/routes/importar-print.tsx (único arquivo alterado)
