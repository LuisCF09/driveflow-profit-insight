import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const APPS = ["Uber", "99", "iFood", "Mercado Livre", "Outro"];

export function AddRideDialog({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (b: boolean) => void; onSaved?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    app: "Uber",
    gross_earnings: "",
    km_driven: "",
    hours: "",
    minutes: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  const hoursNum = form.hours === "" ? 0 : Number(form.hours);
  const minutesNum = form.minutes === "" ? 0 : Number(form.minutes);
  const hoursError = !Number.isInteger(hoursNum) || hoursNum < 0 || hoursNum > 23;
  const minutesError = !Number.isInteger(minutesNum) || minutesNum < 0 || minutesNum > 59;
  const timeInvalid = hoursError || minutesError;

  function setIntField(key: "hours" | "minutes", raw: string, max: number) {
    // strip non-digits
    const cleaned = raw.replace(/[^\d]/g, "");
    if (cleaned === "") return setForm((f) => ({ ...f, [key]: "" }));
    const n = Math.min(max, Math.max(0, parseInt(cleaned, 10)));
    setForm((f) => ({ ...f, [key]: String(n) }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (timeInvalid) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");
      const { data: v } = await supabase.from("vehicles").select("id").eq("is_active", true).limit(1);
      const total_minutes = hoursNum * 60 + minutesNum;
      const { error } = await supabase.from("rides").insert({
        user_id: user.id,
        vehicle_id: v?.[0]?.id ?? null,
        app: form.app,
        gross_earnings: Number(form.gross_earnings || 0),
        km_driven: Number(form.km_driven || 0),
        total_minutes,
        hours_worked: total_minutes / 60,
        date: form.date,
        note: form.note || null,
      });
      if (error) throw error;
      toast.success("Corrida registrada!");
      setForm({ ...form, gross_earnings: "", km_driven: "", hours: "", minutes: "", note: "" });
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/60 sm:max-w-md">
        <DialogHeader><DialogTitle>Nova corrida</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <Field label="Aplicativo">
            <select value={form.app} onChange={(e) => setForm({ ...form, app: e.target.value })} className={inputCls}>
              {APPS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Valor ganho (R$)"><input required type="number" step="0.01" min="0" value={form.gross_earnings} onChange={(e) => setForm({ ...form, gross_earnings: e.target.value })} className={inputCls} /></Field>
            <Field label="KM percorrido"><input required type="number" step="0.1" min="0" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} className={inputCls} /></Field>
          </div>

          <div>
            <span className="mb-1 block text-xs text-muted-foreground">Tempo gasto</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={23}
                    step={1}
                    placeholder="0"
                    value={form.hours}
                    onChange={(e) => setIntField("hours", e.target.value, 23)}
                    className={`${inputCls} ${hoursError && form.hours !== "" ? "border-destructive focus:border-destructive focus:ring-destructive/30" : ""}`}
                  />
                  <span className="text-xs text-muted-foreground">Horas</span>
                </div>
                {hoursError && form.hours !== "" && (
                  <p className="mt-1 text-[11px] text-destructive">Horas devem estar entre 0 e 23</p>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={59}
                    step={1}
                    placeholder="0"
                    value={form.minutes}
                    onChange={(e) => setIntField("minutes", e.target.value, 59)}
                    className={`${inputCls} ${minutesError && form.minutes !== "" ? "border-destructive focus:border-destructive focus:ring-destructive/30" : ""}`}
                  />
                  <span className="text-xs text-muted-foreground">Minutos</span>
                </div>
                {minutesError && form.minutes !== "" && (
                  <p className="mt-1 text-[11px] text-destructive">Minutos devem estar entre 0 e 59</p>
                )}
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">Ex: 2 horas 30 minutos</p>
          </div>

          <Field label="Data"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></Field>
          <Field label="Observação (opcional)"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={inputCls} /></Field>
          <button disabled={loading || timeInvalid} className="bg-gradient-primary shadow-glow w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {loading ? "Salvando..." : "Salvar corrida"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const inputCls = "w-full rounded-xl border border-border bg-input/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs text-muted-foreground">{label}</span>{children}</label>;
}
