import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";
import { searchVehicles, type VehicleEntry } from "@/data/vehicleDatabase";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Cadastrar veículo — DriveFlow" }] }),
  component: OnboardingPage,
});

type Step = "search" | "details";

function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("search");
  const [loading, setLoading] = useState(false);

  // Etapa 1 — busca
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<VehicleEntry | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualType, setManualType] = useState<"carro" | "moto">("carro");

  const results = useMemo(() => searchVehicles(query, 30), [query]);

  // Etapa 2 — detalhes
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [fuelType, setFuelType] = useState<string>("gasolina");
  const [kmPerLiter, setKmPerLiter] = useState<number>(10);
  const [fuelPrice, setFuelPrice] = useState<number>(5.8);

  function chooseVehicle(v: VehicleEntry) {
    setSelected(v);
    setManualMode(false);
    setFuelType(v.defaultFuel);
    if (v.averageKmPerLiter) setKmPerLiter(v.averageKmPerLiter);
    setStep("details");
  }

  function goManual() {
    if (!manualBrand.trim() || !manualModel.trim()) {
      toast.error("Informe marca e modelo.");
      return;
    }
    setSelected({
      brand: manualBrand.trim(),
      model: manualModel.trim(),
      type: manualType,
      defaultFuel: "gasolina",
    });
    setStep("details");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
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
        nickname: `${selected.brand} ${selected.model}`,
        brand: selected.brand,
        model: selected.model,
        year,
        fuel_type: fuelType,
        km_per_liter: kmPerLiter,
        fuel_price: fuelPrice,
        maintenance_cost_per_km: 0.15,
        monthly_installment: 0,
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
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Passo {step === "search" ? 1 : 2} de 2
        </span>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-16 pt-4">
        {step === "search" ? (
          <>
            <div className="mb-6">
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Qual o seu veículo?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Encontre seu carro ou moto na nossa base. Você ajusta os detalhes em seguida.
              </p>
            </div>

            <div className="glass shadow-card rounded-2xl p-6 sm:p-8">
              {!manualMode ? (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
                      Pesquisar
                    </span>
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Pesquise marca ou modelo do veículo"
                      className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
                    />
                  </label>

                  <div className="mt-4 max-h-[360px] space-y-1.5 overflow-y-auto">
                    {query.trim() === "" ? (
                      <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                        Comece a digitar a marca ou modelo (ex: Onix, Honda CG, HB20)
                      </p>
                    ) : results.length === 0 ? (
                      <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                        Nenhum veículo encontrado.
                      </p>
                    ) : (
                      results.map((v) => (
                        <button
                          key={`${v.brand}-${v.model}`}
                          type="button"
                          onClick={() => chooseVehicle(v)}
                          className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-input/40 px-3.5 py-2.5 text-left text-sm transition-all hover:border-primary/40 hover:bg-input"
                        >
                          <div>
                            <div className="font-medium text-foreground">
                              {v.brand} <span className="text-muted-foreground">·</span> {v.model}
                            </div>
                            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                              {v.type} · {v.defaultFuel}
                            </div>
                          </div>
                          <span className="text-xs text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            selecionar →
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setManualMode(true)}
                    className="mt-4 w-full rounded-xl border border-dashed border-border px-3.5 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    Não encontrei meu veículo — cadastrar manualmente
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Marca" value={manualBrand} onChange={setManualBrand} placeholder="Ex: Chevrolet" />
                    <Field label="Modelo" value={manualModel} onChange={setManualModel} placeholder="Ex: Onix" />
                  </div>
                  <SelectField
                    label="Tipo"
                    value={manualType}
                    onChange={(v) => setManualType(v as "carro" | "moto")}
                    options={["carro", "moto"]}
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setManualMode(false)}
                      className="flex-1 rounded-xl border border-border px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Voltar à busca
                    </button>
                    <button
                      type="button"
                      onClick={goManual}
                      className="bg-gradient-primary shadow-glow flex-1 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-primary-foreground"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Detalhes do veículo
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {selected?.brand} · {selected?.model}{" "}
                <button
                  type="button"
                  onClick={() => setStep("search")}
                  className="ml-2 text-primary hover:underline"
                >
                  trocar
                </button>
              </p>
            </div>

            <form onSubmit={handleSave} className="glass shadow-card space-y-4 rounded-2xl p-6 sm:p-8">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ano" type="number" value={year} onChange={(v) => setYear(Number(v))} />
                <SelectField
                  label="Combustível"
                  value={fuelType}
                  onChange={setFuelType}
                  options={["gasolina", "etanol", "diesel", "gnv", "flex", "elétrico"]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Consumo médio (km/L)"
                  type="number"
                  step="0.1"
                  value={kmPerLiter}
                  onChange={(v) => setKmPerLiter(Number(v))}
                />
                <Field
                  label="Preço do combustível (R$/L)"
                  type="number"
                  step="0.01"
                  value={fuelPrice}
                  onChange={(v) => setFuelPrice(Number(v))}
                />
              </div>

              <p className="text-[11px] text-muted-foreground">
                Quilometragem atual é opcional e pode ser preenchida depois em Configurações → Veículo.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-primary shadow-glow mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {loading ? "Salvando..." : "Salvar veículo e continuar"}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input/60 px-3.5 py-2.5 text-sm text-foreground outline-none transition-all focus:border-primary focus:bg-input focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
