import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/premium")({
  head: () => ({ meta: [{ title: "Premium — DriveFlow" }] }),
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <AppShell title="DriveFlow Premium">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Plan
          name="Grátis"
          price="R$ 0"
          features={["Dashboard básico", "Registro ilimitado de corridas", "2 relatórios completos a cada 15 dias", "1 veículo"]}
          cta="Plano atual"
          disabled
        />
        <Plan
          name="Premium"
          price="R$ 15,90"
          period="/mês"
          features={[
            "Relatórios ilimitados (7d → 1 ano)",
            "Dashboard completo com gráficos",
            "Histórico completo de corridas",
            "Múltiplos veículos",
            "Exportação dos dados",
            "Suporte prioritário",
          ]}
          cta="Assinar Premium"
          highlight
          onClick={() => toast.info("Pagamento em breve. Em desenvolvimento.")}
        />
      </div>
    </AppShell>
  );
}

function Plan({ name, price, period, features, cta, highlight, disabled, onClick }: { name: string; price: string; period?: string; features: string[]; cta: string; highlight?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <div className={`glass shadow-card rounded-2xl p-6 ${highlight ? "ring-2 ring-primary/40" : ""}`}>
      <div className="flex items-center gap-2">
        {highlight && <Crown className="h-4 w-4 text-neon" />}
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{name}</div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-4xl font-semibold">{price}</span>
        {period && <span className="text-xs text-muted-foreground">{period}</span>}
      </div>
      <ul className="mt-5 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-neon" />{f}</li>
        ))}
      </ul>
      <button onClick={onClick} disabled={disabled} className={`mt-6 w-full rounded-xl py-2.5 text-sm font-semibold ${highlight ? "bg-gradient-primary shadow-glow text-primary-foreground" : "border border-border bg-card/60 text-muted-foreground"} disabled:opacity-60`}>
        {cta}
      </button>
    </div>
  );
}
