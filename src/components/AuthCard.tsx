import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup" | "recover";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();

  function clearError() {
    if (formError) setFormError(null);
  }

  function translateError(message: string) {
    const m = message.toLowerCase();
    if (m.includes("invalid login")) return "Email ou senha incorretos.";
    if (m.includes("already registered") || m.includes("user already")) return "Este email já está cadastrado. Faça login.";
    if (m.includes("pwned") || m.includes("leaked") || m.includes("compromised") || m.includes("weak password")) return "Esta senha é muito comum ou foi vazada em outros sites. Escolha uma senha mais forte (combine letras, números e símbolos).";
    if (m.includes("at least") && m.includes("character")) return "A senha deve ter pelo menos 6 caracteres.";
    if (m.includes("password should") || m.includes("password must")) return "Senha não atende aos requisitos. Tente uma combinação mais forte.";
    if (m.includes("password")) return message;
    if (m.includes("email")) return "Email inválido.";
    return message;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
        if (password !== confirm) throw new Error("As senhas não coincidem.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Vamos cadastrar seu veículo.");
        navigate({ to: "/onboarding" });
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Enviamos um link de recuperação para seu email.");
        setMode("login");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Algo deu errado.";
      toast.error(translateError(msg));
    } finally {
      setLoading(false);
    }
  }

  const submitLabel = loading
    ? mode === "signup" ? "Criando conta..." : mode === "login" ? "Entrando..." : "Enviando..."
    : mode === "signup" ? "Criar minha conta" : mode === "login" ? "Entrar" : "Enviar link de recuperação";

  return (
    <div className="glass shadow-card relative w-full max-w-md rounded-2xl p-6 sm:p-8">
      <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[var(--neon)] to-transparent opacity-60" />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">
            {mode === "login" && "Entrar"}
            {mode === "signup" && "Criar conta"}
            {mode === "recover" && "Recuperar senha"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" && "Acesse seu painel financeiro."}
            {mode === "signup" && "Comece a calcular seu lucro real."}
            {mode === "recover" && "Enviaremos um link para seu email."}
          </p>
        </div>
        <span className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
          Beta
        </span>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <Field label="Nome" type="text" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <Field label="Email" type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {mode !== "recover" && (
          <div>
            <Field label="Senha" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            {mode === "signup" && password.length > 0 && (
              <div className="mt-1.5 space-y-1">
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary/60">
                  <div
                    className={`h-full transition-all ${
                      password.length < 6 ? "bg-red-500" : password.length < 10 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(100, (password.length / 12) * 100)}%` }}
                  />
                </div>
                <p className={`text-[11px] ${password.length < 6 ? "text-red-400" : "text-muted-foreground"}`}>
                  {password.length < 6 ? `A senha deve ter pelo menos 6 caracteres (${password.length}/6)` : "Senha válida"}
                </p>
              </div>
            )}
          </div>
        )}
        {mode === "signup" && (
          <div>
            <Field label="Confirmar senha" type="password" placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={6} />
            {confirm.length > 0 && confirm !== password && (
              <p className="mt-1 text-[11px] text-red-400">As senhas não coincidem</p>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setMode("recover")}
              className="text-xs text-muted-foreground transition-colors hover:text-neon"
            >
              Esqueci minha senha
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-primary shadow-glow group relative mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {submitLabel}
        </button>

        <div className="relative my-4 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={async () => {
            try {
              const { lovable } = await import("@/integrations/lovable");
              const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/dashboard` });
              if (result.error) toast.error("Não foi possível entrar com Google.");
            } catch {
              toast.error("Login com Google indisponível no momento.");
            }
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
        >
          <GoogleIcon /> Continuar com Google
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {mode !== "signup" ? (
          <>
            Novo no DriveFlow?{" "}
            <button onClick={() => setMode("signup")} className="font-medium text-neon hover:underline">
              Criar conta grátis
            </button>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <button onClick={() => setMode("login")} className="font-medium text-neon hover:underline">
              Entrar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...rest}
        className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 4 14.6 3 12 3 6.9 3 2.8 7.1 2.8 12.2S6.9 21.4 12 21.4c6.9 0 9.3-4.8 9.3-7.7 0-.5 0-.9-.1-1.5H12z"/>
    </svg>
  );
}
