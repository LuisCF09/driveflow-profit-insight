import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { useSubscription } from "@/hooks/use-subscription";
import { brl, isSameMonth, isToday, summarize, seriesByDay, inRange } from "@/lib/finance";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Car, Plus, TrendingUp, Wallet, Clock, Route as RouteIcon, Fuel, Target, Calendar, Receipt, Lock, Crown } from "lucide-react";
import { AddRideDialog } from "@/components/AddRideDialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Painel — DriveFlow" }] }),
  component: DashboardPage,
});

const RANGES = [7, 15, 30, 90, 365] as const;

function DashboardPage() {
  const navigate = useNavigate();
  const { rides, expenses, vehicle, loading, reload } = useDriveFlowData();
  const [checked, setChecked] = useState(false);
  const [range, setRange] = useState<(typeof RANGES)[number]>(30);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/" }); return; }
      const { data: v } = await supabase.from("vehicles").select("id").limit(1);
      if (!v || v.length === 0) { navigate({ to: "/onboarding" }); return; }
      setChecked(true);
    })();
  }, [navigate]);

  const mRides = useMemo(() => rides.filter((r) => isSameMonth(r.date)), [rides]);
  const mExp = useMemo(() => expenses.filter((e) => isSameMonth(e.date)), [expenses]);
  const today = useMemo(() => rides.filter((r) => isToday(r.date)), [rides]);
  const month = useMemo(() => summarize(mRides, mExp, vehicle), [mRides, mExp, vehicle]);
  const todaySum = useMemo(() => summarize(today, [], vehicle), [today, vehicle]);
  const series = useMemo(() => seriesByDay(rides, expenses, vehicle, range), [rides, expenses, vehicle, range]);
  const daysWorked = useMemo(() => new Set(mRides.map((r) => r.date)).size, [mRides]);
  const liters = vehicle?.km_per_liter ? month.km / vehicle.km_per_liter : 0;
  const perHour = month.hours > 0 ? month.profit / month.hours : 0;
  const perKm = month.km > 0 ? (month.fuel + month.wear + month.exp) / month.km : 0;

  if (!checked || loading) {
    return <div className="bg-hero flex min-h-screen items-center justify-center text-sm text-muted-foreground">Carregando...</div>;
  }

  const noData = rides.length === 0;

  return (
    <AppShell title="Painel" onChanged={reload}>
      {noData ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : (
        <div className="space-y-6">
          {/* Hero KPI */}
          <div className="glass shadow-card rounded-2xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Lucro líquido do mês</div>
                <div className={`mt-1 font-display text-4xl font-semibold sm:text-5xl ${month.profit >= 0 ? "text-neon" : "text-destructive"}`}>{brl(month.profit)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Receita {brl(month.gross)} − custos {brl(month.fuel + month.wear + month.exp)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Mini label="Hoje" value={brl(todaySum.profit)} />
                <Mini label="R$/hora" value={brl(perHour)} />
                <Mini label="Custo/km" value={brl(perKm)} />
              </div>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<RouteIcon className="h-4 w-4" />} label="KM no mês" value={month.km.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} />
            <Stat icon={<Fuel className="h-4 w-4" />} label="Combustível" value={`${liters.toFixed(1)} L`} sub={brl(month.fuel)} />
            <Stat icon={<Car className="h-4 w-4" />} label="Corridas" value={String(month.rides)} />
            <Stat icon={<Calendar className="h-4 w-4" />} label="Dias trabalhados" value={String(daysWorked)} />
          </div>

          {/* Chart */}
          <div className="glass shadow-card rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-base font-semibold">Receita × Custos × Lucro</div>
                <div className="text-xs text-muted-foreground">Visão dos últimos {range} dias</div>
              </div>
              <div className="flex gap-1 rounded-xl border border-border/60 bg-card/40 p-1">
                {RANGES.map((r) => (
                  <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-2.5 py-1 text-xs ${range === r ? "bg-primary/20 text-foreground ring-1 ring-primary/40" : "text-muted-foreground"}`}>
                    {r === 365 ? "1a" : `${r}d`}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 8, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="gLucro" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.82 0.18 230)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.82 0.18 230)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                  <XAxis dataKey="label" stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} minTickGap={20} />
                  <YAxis stroke="oklch(0.7 0.02 250)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.035 260)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 12, fontSize: 12 }} formatter={(v: number) => brl(Number(v))} />
                  <Area type="monotone" dataKey="receita" stroke="oklch(0.65 0.05 250)" strokeWidth={1.5} fillOpacity={0} />
                  <Area type="monotone" dataKey="custos" stroke="oklch(0.62 0.22 25)" strokeWidth={1.5} fillOpacity={0} />
                  <Area type="monotone" dataKey="lucro" stroke="oklch(0.82 0.18 230)" strokeWidth={2.5} fill="url(#gLucro)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ActionCard to="/rides" icon={<Car className="h-4 w-4" />} title="Suas corridas" sub={`${rides.length} registradas`} />
            <ActionCard to="/expenses" icon={<Receipt className="h-4 w-4" />} title="Despesas" sub={`${expenses.length} registradas`} />
            <ActionCard to="/goals" icon={<Target className="h-4 w-4" />} title="Metas" sub="Acompanhe seu objetivo" />
          </div>
        </div>
      )}

      <AddRideDialog open={addOpen} onOpenChange={setAddOpen} onSaved={() => { setAddOpen(false); reload(); }} />
    </AppShell>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
        <span className="text-primary/80">{icon}</span>
      </div>
      <div className="mt-2 font-display text-xl font-semibold">{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 px-3 py-2">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}

function ActionCard({ to, icon, title, sub }: { to: string; icon: React.ReactNode; title: string; sub: string }) {
  return (
    <Link to={to} className="glass group flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-card/60">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/15 p-2 text-primary">{icon}</div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </div>
      <span className="text-muted-foreground group-hover:text-foreground">→</span>
    </Link>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="glass shadow-card mx-auto max-w-xl rounded-3xl p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <TrendingUp className="h-7 w-7" />
      </div>
      <h2 className="font-display text-2xl font-semibold">Comece registrando sua primeira corrida</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Em poucos segundos você descobre quanto realmente está ganhando após combustível, desgaste e despesas.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
        <button onClick={onAdd} className="bg-gradient-primary shadow-glow inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Adicionar corrida
        </button>
        <Link to="/profile" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-2.5 text-sm font-medium hover:bg-card">
          <Car className="h-4 w-4" /> Configurar veículo
        </Link>
      </div>
    </div>
  );
}
