import { createFileRoute } from "@tanstack/react-router";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";
import { AuthCard } from "@/components/AuthCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DriveFlow — Descubra quanto você realmente ganha" },
      {
        name: "description",
        content:
          "DriveFlow: o painel financeiro para motoristas e entregadores. Calcule combustível, desgaste do veículo e custos para ver seu lucro real.",
      },
      { property: "og:title", content: "DriveFlow — Lucro real para quem dirige" },
      {
        property: "og:description",
        content: "Transforme ganhos em lucro real. Simples, rápido e profissional.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      {/* decorative grid */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      {/* glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/3 h-[320px] w-[420px] rounded-full bg-[var(--neon)]/15 blur-[120px]" />

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <DriveFlowLogo />
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground transition-colors" href="#features">Recursos</a>
          <a className="hover:text-foreground transition-colors" href="#pricing">Planos</a>
          <a className="hover:text-foreground transition-colors" href="#faq">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden h-2 w-2 rounded-full bg-[var(--neon)] shadow-[0_0_12px_var(--neon)] sm:inline-block" />
          <span className="hidden text-xs text-muted-foreground sm:inline">Sistema online</span>
        </div>
      </header>

      {/* Hero + Auth */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-20 pt-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pt-16">
        {/* Left: pitch + mini dashboard preview */}
        <div className="order-2 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] shadow-[0_0_10px_var(--neon)]" />
            Painel financeiro para motoristas
          </div>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Descubra quanto você
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-[var(--neon)] to-primary bg-clip-text text-transparent">
              realmente ganha
            </span>{" "}
            trabalhando.
          </h1>

          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Transforme ganhos em lucro real. O DriveFlow desconta combustível, desgaste
            do veículo e custos fixos para te mostrar o que sobra de verdade no seu bolso.
          </p>

          {/* Mini stat cards */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-lg">
            <Stat label="Lucro líquido" value="R$ 4.812" trend="+18%" />
            <Stat label="Custo / km" value="R$ 0,73" trend="-6%" muted />
            <Stat label="R$ / hora" value="R$ 38,40" trend="+12%" />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <Bullet>Sem cartão para começar</Bullet>
            <Bullet>Cálculo automático de desgaste</Bullet>
            <Bullet>Funciona em qualquer app</Bullet>
          </div>
        </div>

        {/* Right: centralized login */}
        <div className="order-1 flex w-full justify-center lg:order-2 lg:justify-end">
          <AuthCard />
        </div>
      </section>

      <footer className="relative z-10 border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} DriveFlow. Lucro real para quem dirige.</span>
          <div className="flex items-center gap-5">
            <a className="hover:text-foreground" href="#">Termos</a>
            <a className="hover:text-foreground" href="#">Privacidade</a>
            <a className="hover:text-foreground" href="#">Contato</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  trend,
  muted,
}: {
  label: string;
  value: string;
  trend: string;
  muted?: boolean;
}) {
  return (
    <div className="glass rounded-xl p-3.5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-semibold">{value}</div>
      <div
        className={`mt-0.5 text-[11px] font-medium ${
          muted ? "text-muted-foreground" : "text-[var(--neon)]"
        }`}
      >
        {trend} vs semana anterior
      </div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg className="h-3.5 w-3.5 text-[var(--neon)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
      {children}
    </span>
  );
}
