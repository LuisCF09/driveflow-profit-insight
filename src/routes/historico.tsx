import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  History,
  Loader2,
  Pencil,
  Trash2,
  Filter,
  ImageUp,
  Hand,
  Inbox,
  X,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico Financeiro — DriveFlow" },
      {
        name: "description",
        content:
          "Veja todos os seus registros financeiros importados ou inseridos manualmente no DriveFlow, com filtros por plataforma, período e origem.",
      },
    ],
  }),
  component: HistoricoPage,
});

type Entry = {
  id: string;
  user_id: string;
  platform_name: string;
  entry_date: string;
  gross_earnings: number | null;
  worked_hours: number | null;
  trips_count: number | null;
  kilometers: number | null;
  fuel_cost: number | null;
  extra_costs: number | null;
  source: string | null;
  imported_print_id: string | null;
  notes: string | null;
  created_at: string;
};

const RANGES = [
  { d: 7, label: "7 dias" },
  { d: 15, label: "15 dias" },
  { d: 30, label: "30 dias" },
  { d: 90, label: "90 dias" },
  { d: 180, label: "180 dias" },
  { d: 365, label: "1 ano" },
  { d: 0, label: "Todos" },
] as const;

const BRL = (n: number | null | undefined) =>
  (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function formatDateBR(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

function HistoricoPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [platformFilter, setPlatformFilter] = useState<string>("todas");
  const [range, setRange] = useState<number>(30);
  const [sourceFilter, setSourceFilter] = useState<"todos" | "manual" | "imported_print">("todos");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/" });
        return;
      }
      const { data, error } = await supabase
        .from("platform_entries")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("entry_date", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) {
        toast.error(`Falha ao carregar: ${error.message}`);
        return;
      }
      setEntries((data as Entry[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const platforms = useMemo(() => {
    const set = new Set(entries.map((e) => e.platform_name));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    const cutoff = range > 0 ? Date.now() - range * 24 * 60 * 60 * 1000 : 0;
    return entries.filter((e) => {
      if (platformFilter !== "todas" && e.platform_name !== platformFilter) return false;
      if (sourceFilter !== "todos") {
        const src = e.source ?? "manual";
        const normalized = src === "imported_print" ? "imported_print" : "manual";
        if (normalized !== sourceFilter) return false;
      }
      if (range > 0) {
        const t = new Date(e.entry_date).getTime();
        if (Number.isFinite(t) && t < cutoff) return false;
      }
      return true;
    });
  }, [entries, platformFilter, sourceFilter, range]);

  const summary = useMemo(() => {
    const totals = filtered.reduce(
      (acc, e) => {
        acc.gross += Number(e.gross_earnings ?? 0);
        acc.hours += Number(e.worked_hours ?? 0);
        acc.km += Number(e.kilometers ?? 0);
        return acc;
      },
      { gross: 0, hours: 0, km: 0 },
    );
    return {
      ...totals,
      perHour: totals.hours > 0 ? totals.gross / totals.hours : null,
      perKm: totals.km > 0 ? totals.gross / totals.km : null,
    };
  }, [filtered]);

  async function handleDelete(id: string) {
    if (!window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from("platform_entries").delete().eq("id", id);
      if (error) {
        toast.error(`Falha ao excluir: ${error.message}`);
        return;
      }
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Registro excluído.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveEdit() {
    if (!editing) return;
    const gross = Number(editing.gross_earnings);
    if (!editing.platform_name.trim() || !editing.entry_date || !Number.isFinite(gross) || gross <= 0) {
      toast.error("Preencha plataforma, data e ganho bruto.");
      return;
    }
    setSavingEdit(true);
    try {
      const payload = {
        platform_name: editing.platform_name.trim(),
        entry_date: editing.entry_date,
        gross_earnings: gross,
        worked_hours: editing.worked_hours,
        trips_count: editing.trips_count,
        kilometers: editing.kilometers,
        notes: editing.notes,
      };
      const { error } = await supabase
        .from("platform_entries")
        .update(payload)
        .eq("id", editing.id);
      if (error) {
        toast.error(`Falha ao salvar: ${error.message}`);
        return;
      }
      setEntries((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...payload } : e)));
      toast.success("Registro atualizado.");
      setEditing(null);
    } finally {
      setSavingEdit(false);
    }
  }

  return (
    <AppShell title="Histórico Financeiro">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
              <History className="h-5 w-5 text-[var(--neon)]" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                Histórico Financeiro
              </h1>
              <p className="text-sm text-muted-foreground">
                Todos os seus registros de ganhos por aplicativo, importados ou inseridos manualmente, organizados em um só lugar.
              </p>
            </div>
          </div>
        </section>

        {/* Cards de resumo */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <SummaryCard label="Total ganho" value={BRL(summary.gross)} />
          <SummaryCard label="Horas trabalhadas" value={`${summary.hours.toFixed(1)} h`} />
          <SummaryCard label="Km rodados" value={`${summary.km.toFixed(1)} km`} />
          <SummaryCard
            label="Média por hora"
            value={summary.perHour != null ? BRL(summary.perHour) : "—"}
          />
          <SummaryCard
            label="Média por km"
            value={summary.perKm != null ? BRL(summary.perKm) : "—"}
          />
        </section>

        {/* Filtros */}
        <section className="glass rounded-2xl p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4 text-[var(--neon)]" />
            Filtros
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FilterField label="Plataforma">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className={selectCls}
              >
                <option value="todas">Todas</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="Período">
              <select
                value={String(range)}
                onChange={(e) => setRange(Number(e.target.value))}
                className={selectCls}
              >
                {RANGES.map((r) => (
                  <option key={r.d} value={r.d}>
                    {r.label}
                  </option>
                ))}
              </select>
            </FilterField>
            <FilterField label="Origem">
              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value as "todos" | "manual" | "imported_print")
                }
                className={selectCls}
              >
                <option value="todos">Todos</option>
                <option value="manual">Manual</option>
                <option value="imported_print">Importado por print</option>
              </select>
            </FilterField>
          </div>
        </section>

        {/* Tabela / lista */}
        <section className="glass rounded-2xl p-2 sm:p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando registros...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card/60 ring-1 ring-border/60">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Nenhum registro encontrado para os filtros selecionados.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr className="border-b border-border/60">
                      <th className="px-3 py-2 text-left">Data</th>
                      <th className="px-3 py-2 text-left">Plataforma</th>
                      <th className="px-3 py-2 text-right">Ganho bruto</th>
                      <th className="px-3 py-2 text-right">Horas</th>
                      <th className="px-3 py-2 text-right">Corridas</th>
                      <th className="px-3 py-2 text-right">Km</th>
                      <th className="px-3 py-2 text-left">Origem</th>
                      <th className="px-3 py-2 text-left">Observações</th>
                      <th className="px-3 py-2 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr
                        key={e.id}
                        className="border-b border-border/30 transition-colors hover:bg-card/40"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          {formatDateBR(e.entry_date)}
                        </td>
                        <td className="px-3 py-2">{e.platform_name}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {BRL(e.gross_earnings)}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {e.worked_hours ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {e.trips_count ?? "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {e.kilometers ?? "—"}
                        </td>
                        <td className="px-3 py-2">
                          <SourcePill source={e.source} />
                        </td>
                        <td className="max-w-[260px] truncate px-3 py-2 text-muted-foreground">
                          {e.notes || "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditing({ ...e })}
                              title="Editar"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(e.id)}
                              disabled={deletingId === e.id}
                              title="Excluir"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
                            >
                              {deletingId === e.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile list */}
              <div className="space-y-3 md:hidden">
                {filtered.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-border/60 bg-card/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateBR(e.entry_date)}
                        </div>
                        <div className="font-medium">{e.platform_name}</div>
                      </div>
                      <SourcePill source={e.source} />
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <Mini label="Ganho" value={BRL(e.gross_earnings)} />
                      <Mini label="Horas" value={e.worked_hours ?? "—"} />
                      <Mini label="Corridas" value={e.trips_count ?? "—"} />
                      <Mini label="Km" value={e.kilometers ?? "—"} />
                    </div>
                    {e.notes && (
                      <p className="mt-2 text-xs text-muted-foreground">{e.notes}</p>
                    )}
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditing({ ...e })}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(e.id)}
                        disabled={deletingId === e.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 disabled:opacity-50"
                      >
                        {deletingId === e.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Modal de edição */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur"
          onClick={() => !savingEdit && setEditing(null)}
        >
          <div
            className="glass w-full max-w-lg rounded-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Editar registro</h2>
              <button
                type="button"
                onClick={() => !savingEdit && setEditing(null)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EditField label="Plataforma *">
                <input
                  type="text"
                  value={editing.platform_name}
                  onChange={(e) =>
                    setEditing({ ...editing, platform_name: e.target.value })
                  }
                  className={inputCls}
                />
              </EditField>
              <EditField label="Data *">
                <input
                  type="date"
                  value={editing.entry_date}
                  onChange={(e) => setEditing({ ...editing, entry_date: e.target.value })}
                  className={inputCls}
                />
              </EditField>
              <EditField label="Ganho bruto (R$) *">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.gross_earnings ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      gross_earnings: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </EditField>
              <EditField label="Horas trabalhadas">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.worked_hours ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      worked_hours: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </EditField>
              <EditField label="Corridas / entregas">
                <input
                  type="number"
                  min="0"
                  value={editing.trips_count ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      trips_count: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </EditField>
              <EditField label="Km rodados">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editing.kilometers ?? ""}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      kilometers: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className={inputCls}
                />
              </EditField>
              <div className="sm:col-span-2">
                <EditField label="Observações">
                  <textarea
                    value={editing.notes ?? ""}
                    onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                    rows={3}
                    className={`${inputCls} resize-y`}
                  />
                </EditField>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                disabled={savingEdit}
                className="rounded-xl border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="bg-gradient-primary shadow-glow inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {savingEdit ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

const inputCls =
  "w-full rounded-xl border border-border/60 bg-card/40 px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:bg-card/60";
const selectCls = `${inputCls} appearance-none`;

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-display text-lg font-semibold tabular-nums sm:text-xl">
        {value}
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-sm tabular-nums">{value}</div>
    </div>
  );
}

function SourcePill({ source }: { source: string | null }) {
  const isImport = source === "imported_print";
  const Icon = isImport ? ImageUp : Hand;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
        isImport
          ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
          : "border-sky-500/30 bg-sky-500/10 text-sky-300"
      }`}
    >
      <Icon className="h-3 w-3" />
      {isImport ? "Importado por print" : "Manual"}
    </span>
  );
}
