import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATS = ["Seguro", "IPVA", "Internet", "Financiamento", "Manutenção", "Outros"];

export function AddExpenseDialog({ open, onOpenChange, onSaved }: { open: boolean; onOpenChange: (b: boolean) => void; onSaved?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    category: "Manutenção",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");
      const { data: v } = await supabase.from("vehicles").select("id").eq("is_active", true).limit(1);
      const { error } = await supabase.from("expenses").insert({
        user_id: user.id,
        vehicle_id: v?.[0]?.id ?? null,
        category: form.category,
        amount: Number(form.amount || 0),
        date: form.date,
        description: form.description || null,
      });
      if (error) throw error;
      toast.success("Despesa registrada!");
      setForm({ ...form, amount: "", description: "" });
      onSaved?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  const cls = "w-full rounded-xl border border-border bg-input/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass border-border/60 sm:max-w-md">
        <DialogHeader><DialogTitle>Nova despesa</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <label className="block"><span className="mb-1 block text-xs text-muted-foreground">Categoria</span>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cls}>
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1 block text-xs text-muted-foreground">Valor (R$)</span>
              <input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={cls} />
            </label>
            <label className="block"><span className="mb-1 block text-xs text-muted-foreground">Data</span>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={cls} />
            </label>
          </div>
          <label className="block"><span className="mb-1 block text-xs text-muted-foreground">Descrição (opcional)</span>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={cls} />
          </label>
          <button disabled={loading} className="bg-gradient-primary shadow-glow w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {loading ? "Salvando..." : "Salvar despesa"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
