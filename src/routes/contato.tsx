import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — DriveFlow" },
      { name: "description", content: "Fale com a equipe do DriveFlow: dúvidas, sugestões e suporte." },
    ],
  }),
  component: ContatoPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Informe seu nome").max(120, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(255),
  subject: z.string().trim().min(1, "Informe o assunto").max(160),
  message: z.string().trim().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(4000),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    const parsed = schema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      const fieldErrors: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("contact_messages").insert({
        user_id: user?.id ?? null,
        name: parsed.data.name,
        email: parsed.data.email,
        subject: parsed.data.subject,
        message: parsed.data.message,
      });
      if (error) throw error;
      toast.success("Mensagem enviada com sucesso. Em breve entraremos em contato.");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      console.error("[contato] envio falhou", err);
      toast.error("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-hero relative min-h-screen">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-5">
        <Link to="/"><DriveFlowLogo /></Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Voltar</Link>
      </header>

      <section className="relative z-10 mx-auto max-w-2xl px-6 pb-20 pt-4">
        <h1 className="font-display mb-2 text-3xl font-semibold text-foreground sm:text-4xl">Fale com o DriveFlow</h1>
        <p className="mb-8 text-sm text-muted-foreground">Tem dúvidas, sugestões ou encontrou algum problema? Envie uma mensagem para nossa equipe.</p>

        <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-5 sm:p-6">
          <Field label="Nome" value={name} onChange={(v) => setName(v)} error={errors.name} placeholder="Como podemos te chamar" />
          <Field label="Email" type="email" value={email} onChange={(v) => setEmail(v)} error={errors.email} placeholder="seu@email.com" />
          <Field label="Assunto" value={subject} onChange={(v) => setSubject(v)} error={errors.subject} placeholder="Resumo da sua mensagem" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Mensagem</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={4000}
              placeholder="Conte com mais detalhes como podemos ajudar"
              className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary shadow-glow inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label, value, onChange, error, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  error?: string; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
