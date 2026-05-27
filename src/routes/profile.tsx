import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatCPF, isValidCPF, maskCPF, onlyDigits } from "@/lib/cpf";
import { Pencil } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Perfil — DriveFlow" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [cpf, setCpf] = useState<string>(""); // stored 11 digits
  const [cpfEditing, setCpfEditing] = useState(false);
  const [cpfDraft, setCpfDraft] = useState<string>(""); // formatted draft
  const [cpfSaving, setCpfSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/" }); return; }
      setEmail(user.email || "");
      const { data: p } = await supabase.from("profiles").select("name, cpf").eq("id", user.id).maybeSingle();
      setName(p?.name || "");
      setCpf(p?.cpf || "");
      const { data: v } = await supabase.from("vehicles").select("*").eq("is_active", true).maybeSingle();
      setVehicle(v);
    })();
  }, [navigate]);

  async function saveProfile() {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão");
      const { error } = await supabase.from("profiles").update({ name }).eq("id", user.id);
      if (error) throw error;
      toast.success("Perfil atualizado");
    } catch (err) { toast.error(err instanceof Error ? err.message : "Erro"); }
    finally { setLoading(false); }
  }

  async function changePwd() {
    if (pwd.length < 6) { toast.error("Senha mínima 6 caracteres"); return; }
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) toast.error(error.message); else { toast.success("Senha alterada"); setPwd(""); }
  }

  async function saveVehicle() {
    if (!vehicle) return;
    const { error } = await supabase.from("vehicles").update({
      nickname: vehicle.nickname, brand: vehicle.brand, model: vehicle.model, year: vehicle.year,
      fuel_type: vehicle.fuel_type, km_per_liter: Number(vehicle.km_per_liter),
      fuel_price: Number(vehicle.fuel_price), maintenance_cost_per_km: Number(vehicle.maintenance_cost_per_km),
      monthly_installment: Number(vehicle.monthly_installment),
    }).eq("id", vehicle.id);
    if (error) toast.error(error.message); else toast.success("Veículo atualizado");
  }

  async function saveCpf() {
    const digits = onlyDigits(cpfDraft);
    if (!isValidCPF(digits)) { toast.error("CPF inválido"); return; }
    setCpfSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão");
      const { error } = await supabase.from("profiles").update({ cpf: digits }).eq("id", user.id);
      if (error) {
        if ((error as any).code === "23505") { toast.error("Este CPF já está cadastrado"); return; }
        throw error;
      }
      setCpf(digits);
      setCpfEditing(false);
      toast.success("CPF atualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar CPF");
    } finally {
      setCpfSaving(false);
    }
  }

  const cls = "w-full rounded-xl border border-border bg-input/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30";

  return (
    <AppShell title="Perfil">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="glass shadow-card rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold">Conta</h2>
          <div className="mt-4 space-y-3">
            <Lbl t="Nome"><input value={name} onChange={(e) => setName(e.target.value)} className={cls} /></Lbl>
            <Lbl t="E-mail"><input value={email} disabled className={cls + " opacity-60"} /></Lbl>
            <div>
              <span className="mb-1 block text-xs text-muted-foreground">CPF</span>
              {!cpfEditing ? (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-border bg-input/40 px-3 py-2 text-sm">
                  <span className={cpf ? "" : "text-muted-foreground"}>
                    {cpf ? maskCPF(cpf) : "Não cadastrado"}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCpfDraft(cpf ? formatCPF(cpf) : ""); setCpfEditing(true); }}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Pencil className="h-3 w-3" /> {cpf ? "Editar" : "Adicionar"}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    value={cpfDraft}
                    onChange={(e) => setCpfDraft(formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    maxLength={14}
                    className={cls}
                  />
                  {onlyDigits(cpfDraft).length === 11 && !isValidCPF(cpfDraft) && (
                    <p className="text-[11px] text-red-400">CPF inválido</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveCpf}
                      disabled={cpfSaving || !isValidCPF(cpfDraft)}
                      className="bg-gradient-primary shadow-glow flex-1 rounded-xl py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {cpfSaving ? "Salvando..." : "Salvar CPF"}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCpfEditing(false); setCpfDraft(""); }}
                      className="rounded-xl border border-border bg-card/60 px-4 text-xs hover:bg-card"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={saveProfile} disabled={loading} className="bg-gradient-primary shadow-glow w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">Salvar</button>
          </div>
          <div className="mt-6 border-t border-border/40 pt-4">
            <h3 className="text-sm font-medium">Alterar senha</h3>
            <div className="mt-3 flex gap-2">
              <input type="password" minLength={6} value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Nova senha (mín. 6 caracteres)" className={cls} />
              <button onClick={changePwd} disabled={pwd.length < 6} className="rounded-xl border border-border bg-card/60 px-4 text-xs hover:bg-card disabled:cursor-not-allowed disabled:opacity-50">Trocar</button>
            </div>
            {pwd.length > 0 && pwd.length < 6 && (
              <p className="mt-1.5 text-[11px] text-red-400">A senha deve ter pelo menos 6 caracteres ({pwd.length}/6)</p>
            )}
          </div>
        </section>

        {vehicle && (
          <section className="glass shadow-card rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold">Veículo</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Lbl t="Apelido"><input value={vehicle.nickname || ""} onChange={(e) => setVehicle({ ...vehicle, nickname: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Ano"><input type="number" value={vehicle.year || ""} onChange={(e) => setVehicle({ ...vehicle, year: Number(e.target.value) })} className={cls} /></Lbl>
              <Lbl t="Marca"><input value={vehicle.brand || ""} onChange={(e) => setVehicle({ ...vehicle, brand: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Modelo"><input value={vehicle.model || ""} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Combustível">
                <select value={vehicle.fuel_type} onChange={(e) => setVehicle({ ...vehicle, fuel_type: e.target.value })} className={cls}>
                  {["gasolina", "etanol", "diesel", "gnv", "flex", "elétrico"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </Lbl>
              <Lbl t="Km/L"><input type="number" step="0.1" value={vehicle.km_per_liter} onChange={(e) => setVehicle({ ...vehicle, km_per_liter: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Preço comb. (R$/L)"><input type="number" step="0.01" value={vehicle.fuel_price} onChange={(e) => setVehicle({ ...vehicle, fuel_price: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Manutenção R$/km"><input type="number" step="0.01" value={vehicle.maintenance_cost_per_km} onChange={(e) => setVehicle({ ...vehicle, maintenance_cost_per_km: e.target.value })} className={cls} /></Lbl>
              <Lbl t="Parcela mensal"><input type="number" step="0.01" value={vehicle.monthly_installment} onChange={(e) => setVehicle({ ...vehicle, monthly_installment: e.target.value })} className={cls} /></Lbl>
            </div>
            <button onClick={saveVehicle} className="bg-gradient-primary shadow-glow mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-primary-foreground">Salvar veículo</button>
          </section>
        )}
      </div>
    </AppShell>
  );
}

function Lbl({ t, children }: { t: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-xs text-muted-foreground">{t}</span>{children}</label>;
}
