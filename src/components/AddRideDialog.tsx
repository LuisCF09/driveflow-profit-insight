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
    hours_worked: "",
    date: new Date().toISOString().slice(0, 10),
    note: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");
      const { data: v } = await supabase.from("vehicles").select("id").eq("is_active", true).limit(1);
      const { error } = await supabase.from("rides").insert({
        user_id: user.id,
        vehicle_id: v?.[0]?.id ?? null,
        app: form.app,
        gross_earnings: Number(form.gross_earnings || 0),
        km_driven: Number(form.km_driven || 0),
        hours_worked: Number(form.hours_worked || 0),
        date: form.date,
        note: form.note || null,
      });
      if (error) throw error;
      toast.success("Corrida registrada!");
      setForm({ ...form, gross_earnings: "", km_driven: "", hours_worked: "", note: "" });
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
            <Field label="Valor ganho (R$)"><input required type="number" step="0.01" value={form.gross_earnings} onChange={(e) => setForm({ ...form, gross_earnings: e.target.value })} className={inputCls} /></Field>
            <Field label="KM percorrido"><input required type="number" step="0.1" value={form.km_driven} onChange={(e) => setForm({ ...form, km_driven: e.target.value })} className={inputCls} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Horas trabalhadas"><input type="number" step="0.1" value={form.hours_worked} onChange={(e) => setForm({ ...form, hours_worked: e.target.value })} className={inputCls} /></Field>
            <Field label="Data"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} /></Field>
          </div>
          <Field label="Observação (opcional)"><input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className={inputCls} /></Field>
          <button disabled={loading} className="bg-gradient-primary shadow-glow w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">
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
