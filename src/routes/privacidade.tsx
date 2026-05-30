import { createFileRoute, Link } from "@tanstack/react-router";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade — DriveFlow" },
      { name: "description", content: "Como o DriveFlow coleta, usa e protege seus dados financeiros e pessoais." },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <main className="bg-hero relative min-h-screen">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/"><DriveFlowLogo /></Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
      </header>

      <article className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-4 text-sm leading-relaxed text-muted-foreground">
        <h1 className="font-display mb-2 text-3xl font-semibold text-foreground sm:text-4xl">Política de Privacidade</h1>
        <p className="mb-8 text-xs uppercase tracking-widest">DriveFlow</p>

        <Section title="1. Dados que podemos coletar">
          <ul className="ml-5 list-disc space-y-1">
            <li>Nome</li>
            <li>Email</li>
            <li>Dados do veículo (modelo, consumo, custos)</li>
            <li>Registros financeiros (corridas, despesas)</li>
            <li>Ganhos informados por você</li>
            <li>Custos como combustível, manutenção e outros</li>
            <li>Prints enviados por você para importação</li>
            <li>Informações de uso da plataforma</li>
          </ul>
        </Section>

        <Section title="2. Para que usamos seus dados">
          <ul className="ml-5 list-disc space-y-1">
            <li>Organizar o seu histórico financeiro</li>
            <li>Calcular lucro estimado, ganho por hora e por km</li>
            <li>Gerar relatórios e gráficos</li>
            <li>Melhorar a sua experiência de uso</li>
            <li>Permitir o recurso de importação por print</li>
          </ul>
        </Section>

        <Section title="3. Sobre os prints enviados">
          <p>Os prints enviados são usados apenas para tentar identificar informações financeiras (ganho, horas, corridas, plataforma) e facilitar o preenchimento dos seus registros. Você sempre revisa os dados antes de salvar.</p>
        </Section>

        <Section title="4. Edição e exclusão">
          <p>Você pode editar ou excluir seus registros a qualquer momento, incluindo prints importados. Ao excluir um print importado, a imagem correspondente também é removida do armazenamento sempre que possível.</p>
        </Section>

        <Section title="5. Não vendemos seus dados">
          <p>O DriveFlow não vende seus dados pessoais para terceiros. Seus dados existem para que você consiga organizar sua própria vida financeira.</p>
        </Section>

        <Section title="6. Dados sensíveis em prints">
          <p>Para sua segurança, evite enviar prints contendo CPF, endereço, documentos, dados bancários ou outras informações sensíveis que não sejam necessárias para o controle financeiro.</p>
        </Section>

        <Section title="7. Proteção e isolamento por usuário">
          <p>Seus dados são protegidos por autenticação e por regras de acesso aplicadas no banco de dados. Cada usuário só consegue acessar os próprios registros — outros usuários não têm acesso às suas informações.</p>
        </Section>

        <Section title="8. Suporte e remoção de dados">
          <p>Se você precisar de suporte, quiser tirar dúvidas sobre os seus dados ou solicitar a remoção da sua conta e informações, entre em contato com a nossa equipe pela página de <Link to="/contato" className="text-foreground underline">Contato</Link>.</p>
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
