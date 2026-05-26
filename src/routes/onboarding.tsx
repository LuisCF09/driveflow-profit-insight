import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Cadastrar veículo — DriveFlow" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nickname: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    fuel_type: "gasolina",
    km_per_liter: 10,
    fuel_price: 5.8,
    maintenance_cost_per_km: 0.15,
    monthly_installment: 0,
  });

  function upd<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Sessão expirada. Faça login novamente.");
        navigate({ to: "/" });
        return;
      }
      const { error } = await supabase.from("vehicles").insert({
        user_id: user.id,
        ...form,
      });
      if (error) throw error;
      toast.success("Veículo cadastrado!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar veículo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/30 blur-[120px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-5">
        <DriveFlowLogo />
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Passo 1 de 1</span>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-16 pt-4">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
            Cadastre seu veículo
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Usamos esses dados para calcular seu lucro real, custo por km e desgaste.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass shadow-card space-y-4 rounded-2xl p-6 sm:p-8">
          <Field label="Apelido do veículo" value={form.nickname} onChange={(v) => upd("nickname", v)} placeholder="Ex: Meu Onix" required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marca" value={form.brand} onChange={(v) => upd("brand", v)} placeholder="Chevrolet" />
            <Field label="Modelo" value={form.model} onChange={(v) => upd("model", v)} placeholder="Onix" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ano" type="number" value={form.year} onChange={(v) => upd("year", Number(v))} />
            <SelectField label="Combustível" value={form.fuel_type} onChange={(v) => upd("fuel_type", v)} options={["gasolina", "etanol", "diesel", "gnv", "flex", "elétrico"]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Km por litro" type="number" step="0.1" value={form.km_per_liter} onChange={(v) => upd("km_per_liter", Number(v))} />
            <Field label="Preço do combustível (R$/L)" type="number" step="0.01" value={form.fuel_price} onChange={(v) => upd("fuel_price", Number(v))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Manutenção por km (R$)" type="number" step="0.01" value={form.maintenance_cost_per_km} onChange={(v) => upd("maintenance_cost_per_km", Number(v))} />
            <Field label="Parcela mensal (R$)" type="number" step="0.01" value={form.monthly_installment} onChange={(v) => upd("monthly_installment", Number(v))} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary shadow-glow mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Salvar veículo e continuar"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, value, onChange, ...rest }: { label: string; value: string | number; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
