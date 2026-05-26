import { useState } from "react";

type Mode = "login" | "signup" | "recover";

export function AuthCard() {
  const [mode, setMode] = useState<Mode>("login");

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

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        {mode === "signup" && (
          <Field label="Nome" type="text" placeholder="Seu nome" />
        )}
        <Field label="Email" type="email" placeholder="voce@email.com" />
        {mode !== "recover" && (
          <Field label="Senha" type="password" placeholder="••••••••" />
        )}
        {mode === "signup" && (
          <Field label="Confirmar senha" type="password" placeholder="••••••••" />
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
          className="bg-gradient-primary shadow-glow group relative mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          {mode === "login" && "Entrar"}
          {mode === "signup" && "Criar minha conta"}
          {mode === "recover" && "Enviar link de recuperação"}
        </button>

        <div className="relative my-4 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
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
