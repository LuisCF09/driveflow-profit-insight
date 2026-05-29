import type { AnalyzePrintInput, PrintAnalysisResult } from "./types";
import { simulateAnalysis } from "./simulate";

/**
 * Ponto único de entrada para a "leitura inteligente" de prints.
 *
 * Hoje delega para `simulateAnalysis`. No futuro, trocar a chamada abaixo por
 * uma server function (ex.: `src/lib/analyze-print.functions.ts`) que invoque
 * o Lovable AI Gateway com um modelo multimodal (ex.: `google/gemini-3-flash-preview`)
 * passando `image_url` e devolvendo exatamente o mesmo `PrintAnalysisResult`.
 *
 * O componente visual (`src/routes/importar-print.tsx`) NÃO deve conhecer
 * detalhes do provider — apenas chama `analyzePrintImage` e exibe o resultado.
 */
export async function analyzePrintImage(
  input: AnalyzePrintInput,
): Promise<PrintAnalysisResult> {
  return simulateAnalysis(input);
}

export type { AnalyzePrintInput, PrintAnalysisResult } from "./types";
