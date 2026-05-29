import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ImageUp,
  Upload,
  AlertCircle,
  Loader2,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  FlaskConical,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/importar-print")({
  head: () => ({
    meta: [
      { title: "Importar Print — DriveFlow" },
      {
        name: "description",
        content:
          "Envie um print da tela de ganhos do seu aplicativo de trabalho e registre seus rendimentos no DriveFlow de forma mais rápida.",
      },
    ],
  }),
  component: ImportarPrintPage,
});

const PLATAFORMAS = ["Uber", "99", "iFood", "Mercado Livre", "Rappi", "Outros"] as const;
const ACCEPT = "image/png,image/jpeg,image/jpg";

function sanitizeFilename(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function confidenceMeta(c: number) {
  if (c >= 0.8)
    return {
      label: "Alta confiança",
      cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      dot: "bg-emerald-400",
    };
  if (c >= 0.5)
    return {
      label: "Média confiança",
      cls: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      dot: "bg-amber-400",
    };
  return {
    label: "Baixa confiança",
    cls: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dot: "bg-rose-400",
  };
}

type DetectedData = {
  entryDate: string;
  grossEarnings: string;
  workedHours: string;
  tripsCount: string;
  kilometers: string;
  tips: string;
  fees: string;
  confidence: number;
  notes: string;
};

function ImportarPrintPage() {
  const [plataforma, setPlataforma] = useState<string>("Uber");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [detected, setDetected] = useState<DetectedData | null>(null);
  const [importedPrintId, setImportedPrintId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(f.type);
    if (!ok) {
      toast.error("Formato inválido. Envie PNG, JPG ou JPEG.");
      return;
    }
    setFile(f);
    setUploaded(false);
    setDetected(null);
    setImportedPrintId(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview((e.target?.result as string) ?? null);
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    setUploaded(false);
    setDetected(null);
    setImportedPrintId(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analisar() {
    if (!file) return;
    setLoading(true);
    try {
      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr || !userData.user) {
        toast.error("Você precisa estar autenticado para enviar um print.");
        return;
      }
      const userId = userData.user.id;
      const path = `${userId}/${Date.now()}-${sanitizeFilename(file.name)}`;

      const { error: upErr } = await supabase.storage
        .from("imported-prints")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) {
        toast.error(`Falha no upload: ${upErr.message}`);
        return;
      }

      const { data: signed, error: signErr } = await supabase.storage
        .from("imported-prints")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signErr) {
        toast.error(`Falha ao gerar URL: ${signErr.message}`);
        return;
      }

      // Dados simulados
      const sim: DetectedData = {
        entryDate: todayISO(),
        grossEarnings: "186.40",
        workedHours: "7.5",
        tripsCount: "18",
        kilometers: "94.2",
        tips: "12.00",
        fees: "0",
        confidence: 0.87,
        notes: "Dados gerados em modo de simulação.",
      };

      const { data: inserted, error: insErr } = await supabase
        .from("imported_prints")
        .insert({
          user_id: userId,
          platform_name: plataforma,
          image_url: signed.signedUrl,
          status: "pending_review",
          entry_date: sim.entryDate,
          gross_earnings: Number(sim.grossEarnings),
          worked_hours: Number(sim.workedHours),
          trips_count: Number(sim.tripsCount),
          kilometers: Number(sim.kilometers),
          tips: Number(sim.tips),
          fees: Number(sim.fees),
          confidence: sim.confidence,
          notes: sim.notes,
        })
        .select("id")
        .single();
      if (insErr) {
        toast.error(`Falha ao salvar registro: ${insErr.message}`);
        return;
      }

      setImportedPrintId(inserted?.id ?? null);
      setUploaded(true);
      setDetected(sim);
      toast.success("Print analisado em modo de simulação. Revise os dados.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro inesperado.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function updateField<K extends keyof DetectedData>(key: K, value: DetectedData[K]) {
    setDetected((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <AppShell title="Importar Print">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Hero */}
        <section className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
            <ImageUp className="h-6 w-6 text-[var(--neon)]" />
          </div>
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Importar print dos seus ganhos
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Envie um print da tela de ganhos do seu aplicativo. O DriveFlow tentará
            identificar as informações principais, mas você sempre poderá revisar e editar
            antes de salvar.
          </p>
        </section>

        {/* Formulário */}
        <section className="glass rounded-2xl p-5 sm:p-6">
          {/* Plataforma */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Plataforma</label>
            <div className="flex flex-wrap gap-2">
              {PLATAFORMAS.map((p) => {
                const active = plataforma === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlataforma(p)}
                    className={`rounded-xl px-3.5 py-2 text-sm transition-colors ${
                      active
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                        : "bg-card/40 text-muted-foreground ring-1 ring-border/60 hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium">Imagem do print</label>

            {!preview ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0] ?? null);
                }}
                className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
                  dragging
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/60 bg-card/30 hover:bg-card/50"
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                  <Upload className="h-5 w-5 text-[var(--neon)]" />
                </div>
                <div className="font-display text-sm font-semibold">
                  Clique para enviar ou arraste a imagem
                </div>
                <div className="text-xs text-muted-foreground">
                  PNG, JPG ou JPEG · até alguns MB
                </div>
              </button>
            ) : (
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/30">
                <img
                  src={preview}
                  alt="Pré-visualização do print"
                  className="max-h-96 w-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground ring-1 ring-border/60 backdrop-blur hover:text-foreground"
                  aria-label="Remover imagem"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-between gap-3 border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
                  <span className="truncate">{file?.name}</span>
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="shrink-0 text-foreground/80 underline-offset-4 hover:underline"
                  >
                    Trocar
                  </button>
                </div>
              </div>
            )}

            {uploaded && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Enviado · aguardando revisão
              </div>
            )}

            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Botão */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={analisar}
              disabled={!file || loading || uploaded}
              className="bg-gradient-primary shadow-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analisar print
                </>
              )}
            </button>
          </div>
        </section>

        {/* Resultado */}
        <section className="glass rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Dados detectados</h2>
            {detected && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${
                  confidenceMeta(detected.confidence).cls
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${confidenceMeta(detected.confidence).dot}`}
                />
                {confidenceMeta(detected.confidence).label} ·{" "}
                {Math.round(detected.confidence * 100)}%
              </span>
            )}
          </div>

          {!detected ? (
            <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/20 px-6 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 ring-1 ring-border/60">
                <ImageUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Após enviar e analisar um print, os dados detectados aparecerão aqui para
                revisão.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <strong className="font-semibold">Modo de simulação:</strong> a leitura
                  inteligente ainda não está ativa. Estes valores foram gerados como
                  exemplo — revise antes de salvar.
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Plataforma">
                  <input
                    type="text"
                    value={plataforma}
                    onChange={(e) => setPlataforma(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Data">
                  <input
                    type="date"
                    value={detected.entryDate}
                    onChange={(e) => updateField("entryDate", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Ganho bruto (R$)">
                  <input
                    type="number"
                    step="0.01"
                    value={detected.grossEarnings}
                    onChange={(e) => updateField("grossEarnings", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Horas trabalhadas">
                  <input
                    type="number"
                    step="0.01"
                    value={detected.workedHours}
                    onChange={(e) => updateField("workedHours", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Corridas / entregas">
                  <input
                    type="number"
                    value={detected.tripsCount}
                    onChange={(e) => updateField("tripsCount", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Km rodados">
                  <input
                    type="number"
                    step="0.01"
                    value={detected.kilometers}
                    onChange={(e) => updateField("kilometers", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Gorjetas (R$)">
                  <input
                    type="number"
                    step="0.01"
                    value={detected.tips}
                    onChange={(e) => updateField("tips", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Taxas / descontos (R$)">
                  <input
                    type="number"
                    step="0.01"
                    value={detected.fees}
                    onChange={(e) => updateField("fees", e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Observações">
                    <textarea
                      value={detected.notes}
                      onChange={(e) => updateField("notes", e.target.value)}
                      rows={3}
                      className={`${inputCls} resize-y`}
                    />
                  </Field>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                ID do print: <span className="font-mono">{importedPrintId ?? "—"}</span>
              </p>
            </div>
          )}
        </section>

        {/* Aviso */}
        <section className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon)]" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Importante:</span> nenhuma
            informação será salva automaticamente nos seus relatórios. Você poderá revisar
            tudo antes de confirmar.
          </div>
        </section>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            A leitura automática de prints com IA está em desenvolvimento. Por enquanto,
            os dados detectados são gerados em modo de simulação para você revisar.
          </span>
        </div>
      </div>
    </AppShell>
  );
}

const inputCls =
  "w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground outline-none ring-0 transition-colors focus:border-primary/60 focus:bg-card/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
