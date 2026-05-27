import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { useSubscription } from "@/hooks/use-subscription";
import { brl, rideProfit, rideCost, rideMinutes, formatMinutes, inRange } from "@/lib/finance";
import { AddRideDialog } from "@/components/AddRideDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Lock } from "lucide-react";

export const Route = createFileRoute("/rides")({
  head: () => ({ meta: [{ title: "Corridas — DriveFlow" }] }),
  component: RidesPage,
});

function RidesPage() {
  const { rides: allRides, vehicle, reload } = useDriveFlowData();
  const { isPremium } = useSubscription();
  const rides = useMemo(() => isPremium ? allRides : allRides.filter((r) => inRange(r.date, 15)), [allRides, isPremium]);
  const [open, setOpen] = useState(false);

  async function del(id: string) {
    if (!confirm("Excluir esta corrida?")) return;
    const { error } = await supabase.from("rides").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluída"); reload(); }
  }

  return (
    <AppShell title="Corridas" onChanged={reload}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{rides.length} corridas registradas</p>
        <button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-glow inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Nova
        </button>
      </div>

      {!isPremium && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs">
          <span className="text-muted-foreground">Mostrando últimos 15 dias. Faça upgrade para ver o histórico completo.</span>
          <Link to="/premium" className="font-medium text-primary hover:underline">Premium →</Link>
        </div>
      )}


      {rides.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Nenhuma corrida ainda. Adicione a primeira.</div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-card/40 text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">App</th>
                <th className="px-4 py-3 text-right">Receita</th>
                <th className="px-4 py-3 text-right">KM</th>
                <th className="px-4 py-3 text-right">Tempo</th>
                <th className="px-4 py-3 text-right">Custo</th>
                <th className="px-4 py-3 text-right">Lucro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rides.map((r) => {
                const profit = rideProfit(r, vehicle);
                return (
                  <tr key={r.id} className="border-t border-border/40">
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.date).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-3">{r.app || "—"}</td>
                    <td className="px-4 py-3 text-right">{brl(Number(r.gross_earnings))}</td>
                    <td className="px-4 py-3 text-right">{Number(r.km_driven).toFixed(1)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatMinutes(rideMinutes(r))}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{brl(rideCost(Number(r.km_driven), vehicle))}</td>
                    <td className={`px-4 py-3 text-right font-medium ${profit >= 0 ? "text-neon" : "text-destructive"}`}>{brl(profit)}</td>
                    <td className="px-4 py-3 text-right"><button onClick={() => del(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddRideDialog open={open} onOpenChange={setOpen} onSaved={() => { setOpen(false); reload(); }} />
    </AppShell>
  );
}
