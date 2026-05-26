import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Painel — DriveFlow" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/" });
        return;
      }
      const { data: vehicles } = await supabase.from("vehicles").select("id").limit(1);
      if (!vehicles || vehicles.length === 0) {
        navigate({ to: "/onboarding" });
        return;
      }
      const { data: profile } = await supabase.from("profiles").select("name").eq("id", user.id).maybeSingle();
      setUserName(profile?.name || user.email || "");
      setLoading(false);
    })();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    navigate({ to: "/" });
  }

  if (loading) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center">
        <div className="text-sm text-muted-foreground">Carregando seu painel...</div>
      </main>
    );
  }

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <DriveFlowLogo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">Olá, {userName}</span>
          <button onClick={logout} className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs hover:bg-card">
            Sair
          </button>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 pt-4">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Painel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Em breve: registro de corridas, despesas e seu lucro real em tempo real.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Stat label="Lucro líquido (mês)" value="R$ 0,00" />
          <Stat label="Custo por km" value="R$ 0,00" />
          <Stat label="R$ / hora" value="R$ 0,00" />
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
