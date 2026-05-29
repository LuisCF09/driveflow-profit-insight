import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ImageUp, Upload, AlertCircle, Loader2, X, Sparkles, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { toast } from "sonner";

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

function ImportarPrintPage() {
  const [plataforma, setPlataforma] = useState<string>("Uber");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File | null) {
    if (!f) return;
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(f.type);
    if (!ok) {
      toast.error("Formato inválido. Envie PNG, JPG ou JPEG.");
      return;
    }
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview((e.target?.result as string) ?? null);
    reader.readAsDataURL(f);
  }

  function clearFile() {
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function analisar() {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("A leitura inteligente de prints chegará em breve.");
    }, 1200);
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
              disabled={!file || loading}
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
          <h2 className="font-display text-lg font-semibold">Dados detectados</h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/60 bg-card/20 px-6 py-10 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card/60 ring-1 ring-border/60">
              <ImageUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Após enviar e analisar um print, os dados detectados aparecerão aqui para
              revisão.
            </p>
          </div>
        </section>

        {/* Aviso */}
        <section className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neon)]" />
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Importante:</span> nenhuma
            informação será salva automaticamente. Você poderá revisar tudo antes de
            confirmar.
          </div>
        </section>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            A leitura automática de prints com IA está em desenvolvimento. Por enquanto,
            você pode anexar a imagem e revisar manualmente.
          </span>
        </div>
      </div>
    </AppShell>
  );
}
