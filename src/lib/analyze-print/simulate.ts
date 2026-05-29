import type { AnalyzePrintInput, PrintAnalysisResult } from "./types";

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Simulação determinística usada enquanto a leitura inteligente real (IA) não
 * está conectada. Mantém o mesmo formato de retorno que `analyzePrintImage`
 * usará no futuro, para o componente visual não precisar mudar.
 */
export async function simulateAnalysis(
  input: AnalyzePrintInput,
): Promise<PrintAnalysisResult> {
  return {
    platform_name: input.platform_name,
    entry_date: todayISO(),
    gross_earnings: 186.4,
    worked_hours: 7.5,
    trips_count: 18,
    kilometers: 94.2,
    tips: 12,
    fees: 0,
    confidence: 0.87,
    notes: "Dados gerados em modo de simulação.",
  };
}
