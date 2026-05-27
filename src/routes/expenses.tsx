import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useDriveFlowData } from "@/hooks/use-driveflow-data";
import { brl } from "@/lib/finance";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/expenses")({
  head: () => ({ meta: [{ title: "Despesas — DriveFlow" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { expenses, reload } = useDriveFlowData();
  const [open, setOpen] = useState(false);
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);

  async function del(id: string) {
    if (!confirm("Excluir esta despesa?")) return;
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Excluída"); reload(); }
  }

  return (
    <AppShell title="Despesas" onChanged={reload}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total acumulado</p>
          <p className="font-display text-2xl font-semibold">{brl(total)}</p>
        </div>
        <button onClick={() => setOpen(true)} className="bg-gradient-primary shadow-glow inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Nova despesa
        </button>
      </div>

      {expenses.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">Nenhuma despesa registrada.</div>
      ) : (
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-card/40 text-left text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr><th className="px-4 py-3">Data</th><th className="px-4 py-3">Categoria</th><th className="px-4 py-3">Descrição</th><th className="px-4 py-3 text-right">Valor</th><th /></tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-t border-border/40">
                  <td className="px-4 py-3 text-muted-foreground">{new Date(e.date).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">{e.category}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.description || "—"}</td>
                  <td className="px-4 py-3 text-right font-medium">{brl(Number(e.amount))}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => del(e.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddExpenseDialog open={open} onOpenChange={setOpen} onSaved={() => { setOpen(false); reload(); }} />
    </AppShell>
  );
}
