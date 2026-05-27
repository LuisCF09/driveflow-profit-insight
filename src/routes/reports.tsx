import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { brl, inRange, summarize } from "@/lib/finance";

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

function ReportsPage() {
  const { rides, expenses, vehicle, reload } = useDriveFlowData();
  const [range, setRange] = useState(30);

  const s = useMemo(() => {
    const r = rides.filter((x) => inRange(x.date, range));
    const e = expenses.filter((x) => inRange(x.date, range));
    return summarize(r, e, vehicle);
  }, [rides, expenses, vehicle, range]);

  return (
    <AppShell title="Relatórios" onChanged={reload}>
      <div className="mb-5 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button key={r.d} onClick={() => setRange(r.d)} className={`rounded-xl px-3 py-1.5 text-xs ${range === r.d ? "bg-primary/20 text-foreground ring-1 ring-primary/40" : "border border-border/60 bg-card/40 text-muted-foreground"}`}>{r.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="Receita bruta" value={brl(s.gross)} />
        <Card label="Custos totais" value={brl(s.fuel + s.wear + s.exp)} />
        <Card label="Lucro líquido" value={brl(s.profit)} highlight={s.profit >= 0} />
        <Card label="Horas trabalhadas" value={s.hours.toFixed(1) + "h"} />
      </div>

      <div className="glass shadow-card mt-6 rounded-2xl p-6">
        <div className="font-display text-base font-semibold">Decomposição de custos</div>
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
