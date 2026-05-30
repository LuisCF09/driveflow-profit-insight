import { createFileRoute, Link } from "@tanstack/react-router";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — DriveFlow" },
      { name: "description", content: "Termos de uso do DriveFlow: organização financeira para motoristas e entregadores." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <main className="bg-hero relative min-h-screen">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/"><DriveFlowLogo /></Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
      </header>

      <article className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-display mb-2 text-3xl font-semibold text-foreground sm:text-4xl">Termos de Uso</h1>
        <p className="mb-8 text-xs uppercase tracking-widest">DriveFlow</p>

        <Section title="1. Sobre o DriveFlow">
          <p>O DriveFlow é uma ferramenta de organização financeira voltada para motoristas e entregadores. O objetivo é ajudar você a entender melhor seus ganhos, custos e lucro estimado a partir das informações que você mesmo registra.</p>
        </Section>

        <Section title="2. Sem afiliação com plataformas de trabalho">
          <p>O DriveFlow não tem qualquer afiliação oficial, parceria ou vínculo com Uber, 99, iFood, Mercado Livre, Rappi ou outras plataformas mencionadas no aplicativo. Os nomes dessas empresas são citados apenas para facilitar a organização dos seus próprios registros.</p>
        </Section>

        <Section title="3. Responsabilidade pelas informações">
          <p>Você é responsável por inserir informações corretas e completas. O DriveFlow não verifica a veracidade dos dados informados e seus resultados dependem diretamente da qualidade do que for registrado.</p>
        </Section>

        <Section title="4. Cálculos são estimativas">
          <p>Os cálculos de lucro, ganho por hora e ganho por quilômetro são estimativas baseadas nos dados informados por você. Não são valores oficiais nem garantia de resultado financeiro.</p>
        </Section>

        <Section title="5. Leitura de prints">
          <p>Quando disponível, a leitura automática de prints pode cometer erros de interpretação. Os dados extraídos sempre devem ser revisados por você antes de serem salvos. O DriveFlow não se responsabiliza por valores incorretos que sejam aceitos sem revisão.</p>
        </Section>

        <Section title="6. Sem garantia de ganhos">
          <p>O DriveFlow não garante aumento de renda, ganhos financeiros, resultados de trabalho ou qualquer benefício econômico. A ferramenta apenas organiza e apresenta informações financeiras.</p>
        </Section>

        <Section title="7. Dados sensíveis em prints">
          <p>Evite enviar prints contendo dados sensíveis desnecessários, como CPF, endereço, documentos, dados bancários ou informações pessoais que não sejam estritamente financeiras. Confira sempre a imagem antes de enviar.</p>
        </Section>

        <Section title="8. Atualizações do serviço">
          <p>O DriveFlow pode passar por atualizações, melhorias, mudanças de funcionalidades, ajustes de planos e correções a qualquer momento, com o objetivo de melhorar a experiência do usuário.</p>
        </Section>

        <Section title="9. Aceitação dos termos">
          <p>Ao utilizar o DriveFlow, você concorda com estes termos. Se não concordar, recomendamos não utilizar a plataforma.</p>
        </Section>

        <p className="mt-10 text-xs text-muted-foreground/80">Última atualização: maio de 2026</p>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 font-display text-lg font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
