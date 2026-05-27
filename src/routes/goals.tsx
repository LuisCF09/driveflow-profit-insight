import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { brl, isSameMonth, summarize } from "@/lib/finance";
import { toast } from "sonner";
import { Target } from "lucide-react";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Metas — DriveFlow" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const { rides, expenses, vehicle, reload } = useDriveFlowData();
  const [goal, setGoal] = useState<{ id?: string; profit_target: number } | null>(null);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const now = new Date();
  const month = now.getMonth() + 1, year = now.getFullYear();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("goals").select("*").eq("month", month).eq("year", year).maybeSingle();
      if (data) { setGoal({ id: data.id, profit_target: Number(data.profit_target) }); setValue(String(data.profit_target)); }
    })();
  }, [month, year]);

  async function save() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão");
      const payload = { user_id: user.id, month, year, profit_target: Number(value || 0), km_target: 0, hours_target: 0 };
      if (goal?.id) {
        const { error } = await supabase.from("goals").update(payload).eq("id", goal.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("goals").insert(payload).select().single();
        if (error) throw error;
        setGoal({ id: data.id, profit_target: data.profit_target });
      }
      toast.success("Meta salva!");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erro"); }
    finally { setLoading(false); }
  }

  const m = summarize(rides.filter((r) => isSameMonth(r.date)), expenses.filter((e) => isSameMonth(e.date)), vehicle);
  const target = Number(value || 0);
  const pct = target > 0 ? Math.min(100, (m.profit / target) * 100) : 0;
  const remaining = Math.max(0, target - m.profit);

  return (
    <AppShell title="Metas" onChanged={reload}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass shadow-card rounded-2xl p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/15 p-2 text-primary"><Target className="h-5 w-5" /></div>
            <div>
              <div className="font-display text-lg font-semibold">Meta de lucro mensal</div>
              <div className="text-xs text-muted-foreground">Defina seu objetivo de lucro líquido</div>
            </div>
          </div>
          <label className="mt-5 block">
            <span className="mb-1 block text-xs text-muted-foreground">Valor (R$)</span>
            <input type="number" step="50" value={value} onChange={(e) => setValue(e.target.value)} className="w-full rounded-xl border border-border bg-input/60 px-3 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none" />
          </label>
          <button onClick={save} disabled={loading} className="bg-gradient-primary shadow-glow mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">
            {loading ? "Salvando..." : "Salvar meta"}
          </button>
        </div>

        <div className="glass shadow-card rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Progresso do mês</div>
          <div className="mt-1 font-display text-3xl font-semibold text-neon">{brl(m.profit)}</div>
          <div className="text-xs text-muted-foreground">de {brl(target)} previstos</div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-card">
            <div className="bg-gradient-primary h-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{pct.toFixed(0)}% atingido</span>
            <span>Faltam {brl(remaining)}</span>
          </div>
          {target > 0 && m.profit > 0 && remaining > 0 && (
            <div className="mt-4 rounded-xl border border-border/50 bg-card/30 p-3 text-xs text-muted-foreground">
              No ritmo atual ({brl(m.profit / Math.max(1, new Date().getDate())) }/dia), você atinge a meta em aproximadamente{" "}
              <span className="text-foreground font-medium">{Math.ceil(remaining / Math.max(1, m.profit / new Date().getDate()))} dias</span>.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
