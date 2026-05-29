import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/use-subscription";
import { Check, Crown, X } from "lucide-react";

export const Route = createFileRoute("/planos")({
  head: () => ({ meta: [{ title: "Planos — DriveFlow" }] }),
  component: PlanosPage,
});

const FREE = [
  "Registro manual de ganhos",
  "Registro de custos",
  "Dashboard básico",
  "2 relatórios a cada 15 dias",
  "Upload de print como comprovante",
];

const PREMIUM = [
  "Leitura inteligente de prints",
  "Preenchimento automático dos dados",
  "Relatórios ilimitados",
  "Histórico financeiro completo",
  "Comparativo entre plataformas",
  "Análise de ganho por hora e por km",
  "Acompanhamento mensal completo",
];

function PlanosPage() {
  const navigate = useNavigate();
  const { isPremium, loading } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  return (
    <AppShell title="Planos">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Escolha o plano ideal para sua rotina
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Comece organizando seus ganhos manualmente e desbloqueie recursos inteligentes quando quiser automatizar sua rotina.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Grátis */}
          <div className="glass shadow-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Grátis</div>
              {!loading && !isPremium && (
                <span className="rounded-full border border-border bg-card/60 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  Plano atual
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">R$ 0</span>
              <span className="text-xs text-muted-foreground">/sempre</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Para quem está começando a organizar a rotina.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {FREE.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                  <span>{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sem leitura inteligente de prints</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Sem histórico completo</span>
              </li>
            </ul>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-6 w-full rounded-xl border border-border bg-card/60 py-2.5 text-sm font-semibold text-foreground hover:bg-card"
            >
              Continuar no grátis
            </button>
          </div>

          {/* Premium */}
          <div className="glass shadow-card rounded-2xl p-6 ring-2 ring-primary/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-neon" />
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Premium</div>
              </div>
              {!loading && isPremium ? (
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-foreground ring-1 ring-primary/40">
                  Plano atual
                </span>
              ) : (
                <span className="rounded-full bg-gradient-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                  Mais popular
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">R$ 15,90</span>
              <span className="text-xs text-muted-foreground">/mês</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Para automatizar e ter visão completa do seu trabalho.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-neon" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(true)}
              disabled={!loading && isPremium}
              className="bg-gradient-primary shadow-glow mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Crown className="h-4 w-4" />
              {!loading && isPremium ? "Plano atual" : "Assinar Premium"}
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Você pode mudar de plano a qualquer momento.{" "}
          <Link to="/como-funciona" className="underline hover:text-foreground">
            Saiba como funciona
          </Link>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="glass shadow-card relative z-10 w-full max-w-sm rounded-2xl p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Crown className="h-6 w-6" />
            </div>
            <h3 className="font-display text-lg font-semibold">Quase lá!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pagamento será implementado em breve.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gradient-primary shadow-glow mt-5 w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
