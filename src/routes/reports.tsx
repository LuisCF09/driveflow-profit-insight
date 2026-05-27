import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { useSubscription } from "@/hooks/use-subscription";
import { brl, inRange, summarize } from "@/lib/finance";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Lock, Crown, Save } from "lucide-react";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Relatórios — DriveFlow" }] }),
  component: ReportsPage,
});

const RANGES = [
  { d: 7, label: "7 dias" },
  { d: 15, label: "15 dias" },
  { d: 30, label: "30 dias" },
  { d: 90, label: "90 dias" },
  { d: 180, label: "180 dias" },
  { d: 365, label: "1 ano" },
];

const FREE_LIMIT = 2;

function ReportsPage() {
  const { rides, expenses, vehicle, reload } = useDriveFlowData();
  const { isPremium, loading: subLoading } = useSubscription();
  const [range, setRange] = useState(15);
  const [usage, setUsage] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  const loadUsage = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 15);
    const { count } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", cutoff.toISOString());
    setUsage(count ?? 0);
  }, []);

  useEffect(() => { loadUsage(); }, [loadUsage]);

  const allowed = (d: number) => isPremium || d <= 15;

  const s = useMemo(() => {
    const r = rides.filter((x) => inRange(x.date, range));
    const e = expenses.filter((x) => inRange(x.date, range));
    return summarize(r, e, vehicle);
  }, [rides, expenses, vehicle, range]);

  const remaining = Math.max(0, FREE_LIMIT - usage);
  const limitReached = !isPremium && usage >= FREE_LIMIT;

  async function saveReport() {
    if (limitReached) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");
      const now = new Date();
      const { error } = await supabase.from("reports").insert({
        user_id: user.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        gross_earnings: s.gross,
        total_costs: s.fuel + s.wear + s.exp,
        net_profit: s.profit,
        data: { range_days: range, km: s.km, hours: s.hours, rides: s.rides },
      });
      if (error) throw error;
      toast.success("Relatório salvo!");
      loadUsage();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell title="Relatórios" onChanged={reload}>
      {!isPremium && !subLoading && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <div>
            <div className="font-medium">Você usou {usage} de {FREE_LIMIT} relatórios neste período</div>
            <div className="text-xs text-muted-foreground">Limite renovado a cada 15 dias. {limitReached ? "Limite atingido." : `${remaining} restante${remaining === 1 ? "" : "s"}.`}</div>
          </div>
          <Link to="/premium" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow">
            <Crown className="h-3.5 w-3.5" /> Premium
          </Link>
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {RANGES.map((r) => {
          const locked = !allowed(r.d);
          return (
            <button
              key={r.d}
              onClick={() => locked ? toast.info("Disponível no Premium") : setRange(r.d)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs ${
                range === r.d ? "bg-primary/20 text-foreground ring-1 ring-primary/40" : "border border-border/60 bg-card/40 text-muted-foreground"
              } ${locked ? "opacity-60" : ""}`}
            >
              {locked && <Lock className="h-3 w-3" />} {r.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="Receita bruta" value={brl(s.gross)} />
        <Card label="Custos totais" value={brl(s.fuel + s.wear + s.exp)} />
        <Card label="Lucro líquido" value={brl(s.profit)} highlight={s.profit >= 0} />
        <Card label="Horas trabalhadas" value={s.hours.toFixed(1) + "h"} />
      </div>

      <div className="glass shadow-card mt-6 rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="font-display text-base font-semibold">Decomposição de custos</div>
          <button
            onClick={saveReport}
            disabled={saving || limitReached}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs hover:bg-card disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" /> {saving ? "Salvando..." : "Salvar relatório"}
          </button>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <Row label="Combustível" value={brl(s.fuel)} />
          <Row label="Desgaste do veículo" value={brl(s.wear)} />
          <Row label="Despesas registradas" value={brl(s.exp)} />
          <div className="my-3 border-t border-border/40" />
          <Row label="Receita bruta" value={brl(s.gross)} />
          <Row label="Lucro líquido" value={brl(s.profit)} bold />
          <Row label="Margem" value={s.gross > 0 ? `${((s.profit / s.gross) * 100).toFixed(1)}%` : "—"} />
          <Row label="KM totais" value={s.km.toFixed(0) + " km"} />
          <Row label="R$ por hora" value={s.hours > 0 ? brl(s.profit / s.hours) : "—"} />
          <Row label="Custo por km" value={s.km > 0 ? brl((s.fuel + s.wear + s.exp) / s.km) : "—"} />
        </div>
        {limitReached && (
          <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-xs">
            Limite de relatórios atingido.{" "}
            <Link to="/premium" className="font-medium text-primary hover:underline">Faça upgrade para relatórios ilimitados →</Link>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Card({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-xl font-semibold ${highlight ? "text-neon" : ""}`}>{value}</div>
    </div>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={bold ? "font-display text-lg font-semibold text-neon" : ""}>{value}</span>
    </div>
  );
}
