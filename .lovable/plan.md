## Objetivo

Extrair a lógica de "análise do print" do componente `importar-print.tsx` para uma função isolada `analyzePrintImage`, pronta para trocar a simulação atual por uma chamada real de IA no futuro — sem alterar o comportamento visual.

## Arquitetura

Separar em duas camadas:

```text
src/lib/analyze-print/
├── types.ts        # Tipo PrintAnalysisResult + input
├── simulate.ts     # Implementação simulada atual (fallback / dev)
└── index.ts        # analyzePrintImage() — orquestrador
```

`analyzePrintImage` recebe `{ image_url, platform_name, user_id }` e devolve `PrintAnalysisResult`. Internamente decide qual provider usar (hoje: `simulate`; amanhã: server function chamando Lovable AI). O componente nunca sabe a diferença.

## Arquivos

### 1. `src/lib/analyze-print/types.ts` (novo)

```ts
export type AnalyzePrintInput = {
  image_url: string;
  platform_name: string;
  user_id: string;
};

export type PrintAnalysisResult = {
  platform_name: string;
  entry_date: string | null;
  gross_earnings: number | null;
  worked_hours: number | null;
  trips_count: number | null;
  kilometers: number | null;
  tips: number | null;
  fees: number | null;
  confidence: number;   // 0..1
  notes: string;
};
```

### 2. `src/lib/analyze-print/simulate.ts` (novo)

Move a lógica de simulação que hoje vive em `analisar()` (objeto `sim`) para uma função pura `simulateAnalysis(input): PrintAnalysisResult`. Retorna os mesmos valores de hoje (186.40 / 7.5 / 18 / 94.2 / 12 / 0 / 0.87) e `notes: "Dados gerados em modo de simulação."`, com `entry_date = todayISO()`.

### 3. `src/lib/analyze-print/index.ts` (novo)

```ts
import type { AnalyzePrintInput, PrintAnalysisResult } from "./types";
import { simulateAnalysis } from "./simulate";

// Futuro: trocar por chamada a uma serverFn que invoque Lovable AI Gateway
// (modelo multimodal, ex.: google/gemini-3-flash-preview) passando image_url.
// Contrato e shape de retorno permanecem idênticos.
export async function analyzePrintImage(
  input: AnalyzePrintInput,
): Promise<PrintAnalysisResult> {
  return simulateAnalysis(input);
}

export type { AnalyzePrintInput, PrintAnalysisResult };
```

Comentário no topo deixa explícito o ponto único de troca para IA real (uma serverFn como `analyzePrintImage.functions.ts` que chama o Lovable AI Gateway com a `image_url` assinada). Nenhuma chave/segredo é tocada agora.

### 4. `src/routes/importar-print.tsx` (editar)

Na função `analisar()`:
- Remover o objeto `sim` inline.
- Após fazer upload e gerar `signed.signedUrl`, chamar:

  ```ts
  const result = await analyzePrintImage({
    image_url: signed.signedUrl,
    platform_name: plataforma,
    user_id: userId,
  });
  ```
- Mapear `result` para o `DetectedData` local (apenas conversão de tipos: números → strings nos campos editáveis) e para o `insert` em `imported_prints` (números diretos).
- Mantém `setDetected`, `setEntrySource("ai")`, toasts e UI atuais.

Tipo `DetectedData` local da rota permanece como está (strings p/ inputs). Só a origem dos dados muda.

## Fora do escopo

- Sem mudanças em UI, fluxo manual (`preencherManual`), banco, RLS, storage ou subscription.
- Sem criar serverFn / edge function ainda — só o ponto de extensão preparado.
- Sem mudar mensagens já revisadas na rodada anterior.
