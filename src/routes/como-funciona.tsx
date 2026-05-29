import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Receipt, ImageUp, BarChart3, Crown, Info } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — DriveFlow" },
      {
        name: "description",
        content:
          "Entenda como o DriveFlow ajuda motoristas e entregadores a calcular o lucro real, organizando ganhos, custos, km e horas trabalhadas.",
      },
    ],
  }),
  component: ComoFuncionaPage,
});

const CARDS = [
  {
    icon: TrendingUp,
    title: "Registre seus ganhos",
    text: "Adicione quanto você ganhou em plataformas como Uber, 99, iFood, Mercado Livre, Rappi ou outras.",
  },
  {
    icon: Receipt,
    title: "Adicione seus custos",
    text: "Informe gastos com combustível, manutenção, pedágio, estacionamento e outros custos do trabalho.",
  },
  {
    icon: ImageUp,
    title: "Importe prints e comprovantes",
    text: "Envie prints dos seus aplicativos para facilitar o preenchimento dos dados financeiros.",
  },
  {
    icon: BarChart3,
    title: "Veja seu lucro real",
    text: "O DriveFlow calcula lucro líquido, ganho por hora, custo por km e desempenho por período.",
  },
];

function ComoFuncionaPage() {
  return (
    <AppShell title="Como funciona">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Hero */}
        <section className="text-center">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Entenda seu lucro real como{" "}
            <span className="bg-gradient-to-r from-[var(--neon)] to-primary bg-clip-text text-transparent">
              motorista ou entregador
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            O DriveFlow ajuda você a organizar seus ganhos, custos, quilômetros rodados e
            horas trabalhadas em um só lugar. Assim, você entende quanto realmente está
            lucrando no dia a dia.
          </p>
        </section>

        {/* Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className="glass rounded-2xl p-5 transition-colors hover:bg-card/60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                    <Icon className="h-5 w-5 text-[var(--neon)]" />
                  </div>
                  <div>
                    <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Passo {i + 1}
                    </div>
                    <h3 className="font-display text-lg font-semibold">{c.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{c.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Plano pago */}
        <section className="glass rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
              <Crown className="h-5 w-5 text-[var(--neon)]" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">O que você está pagando?</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                No plano pago, o usuário tem acesso a relatórios mais completos, histórico
                financeiro, comparativos entre plataformas e futuramente leitura inteligente
                de prints com IA.
              </p>
            </div>
          </div>
        </section>

        {/* Observação */}
        <section className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/30 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            O DriveFlow não substitui os aplicativos de corrida ou entrega. Ele serve para
            organizar e analisar seus ganhos de forma mais clara.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
