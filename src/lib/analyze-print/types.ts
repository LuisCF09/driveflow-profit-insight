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
  /** 0..1 */
  confidence: number;
  notes: string;
};
