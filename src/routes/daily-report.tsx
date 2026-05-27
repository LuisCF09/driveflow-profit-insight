import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { brl, rideCost, rideMinutes, formatMinutes, fuelCost, wearCost, isToday } from "@/lib/finance";
import { Car, Wallet, Fuel, TrendingUp, Clock, Route as RouteIcon, Share2 } from "lucide-react";

export const Route = createFileRoute("/daily-report")({
  head: () => ({ meta: [{ title: "Relatório de hoje — DriveFlow" }] }),
  component: DailyReportPage,
});

function DailyReportPage() {
  const { rides: allRides, vehicle, reload } = useDriveFlowData();

  const today = useMemo(() => {
    const now = new Date();
    return allRides.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });
  }, [allRides]);

  const totalRides = today.length;
  const totalEarned = useMemo(() => today.reduce((s, r) => s + Number(r.gross_earnings), 0), [today]);
  const totalKm = useMemo(() => today.reduce((s, r) => s + Number(r.km_driven), 0), [today]);
  const totalFuel = useMemo(() => fuelCost(totalKm, vehicle), [totalKm, vehicle]);
  const totalWear = useMemo(() => wearCost(totalKm, vehicle), [totalKm, vehicle]);
  const totalSpent = totalFuel; // fuel is the main driver-visible cost
  const netProfit = useMemo(() => totalEarned - rideCost(totalKm, vehicle), [totalEarned, totalKm, vehicle]);
  const avgProfit = totalRides > 0 ? netProfit / totalRides : 0;
  const totalMinutes = useMemo(() => today.reduce((s, r) => s + rideMinutes(r), 0), [today]);
  const costPerKm = totalKm > 0 ? rideCost(totalKm, vehicle) / totalKm : 0;

  const bestApp = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of today) {
      const app = r.app || "Outro";
      map[app] = (map[app] || 0) + Number(r.gross_earnings);
    }
    let best = "";
    let max = -Infinity;
    for (const [app, val] of Object.entries(map)) {
      if (val > max) { max = val; best = app; }
    }
    return { name: best || "—", earnings: max > 0 ? max : 0 };
  }, [today]);

  function shareWhatsApp() {
    const text = `Hoje eu ganhei ${brl(netProfit)} em ${totalRides} corridas 🚗💰`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }

  const dateStr = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <AppShell title="Relatório de hoje" onChanged={reload}>
      <div className="mb-4 text-sm text-muted-foreground">{capitalizedDate}</div>

      {totalRides === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary mx-auto">
            <Car className="h-6 w-6" />
          </div>
          <h2 className="font-display text-xl font-semibold">Nenhuma corrida hoje</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Adicione corridas ao longo do dia para acompanhar seu desempenho em tempo real.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Hero KPI */}
          <div className="glass shadow-card rounded-2xl p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Lucro líquido de hoje</div>
                <div className={`mt-1 font-display text-4xl font-semibold sm:text-5xl ${netProfit >= 0 ? "text-neon" : "text-destructive"}`}>{brl(netProfit)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Receita {brl(totalEarned)} − custos {brl(totalFuel + totalWear)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <Mini label="R$/corrida" value={brl(avgProfit)} />
                <Mini label="Custo/km" value={brl(costPerKm)} />
              </div>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<Car className="h-4 w-4" />} label="Corridas" value={String(totalRides)} />
            <Stat icon={<Wallet className="h-4 w-4" />} label="Ganhos" value={brl(totalEarned)} />
            <Stat icon={<Fuel className="h-4 w-4" />} label="Combustível" value={brl(totalFuel)} />
            <Stat icon={<Clock className="h-4 w-4" />} label="Horas" value={formatMinutes(totalMinutes)} />
          </div>

          {/* Detail cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] uppercase tracking-widest">KM rodados</span>
                <span className="text-primary/80"><RouteIcon className="h-4 w-4" /></span>
              </div>
              <div className="mt-2 font-display text-xl font-semibold">{totalKm.toFixed(1)} km</div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] uppercase tracking-widest">Melhor app</span>
                <span className="text-primary/80"><TrendingUp className="h-4 w-4" /></span>
              </div>
              <div className="mt-2 font-display text-xl font-semibold">{bestApp.name}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{brl(bestApp.earnings)}</div>
            </div>
          </div>

          {/* WhatsApp share */}
          <button
            onClick={shareWhatsApp}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
          >
            <Share2 className="h-4 w-4" /> Compartilhar no WhatsApp
          </button>
        </div>
      )}
    </AppShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
        <span className="text-primary/80">{icon}</span>
      </div>
      <div className="mt-2 font-display text-xl font-semibold">{value}</div>
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
