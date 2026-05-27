import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Car, Receipt, Target, FileBarChart, User, Crown, LogOut, Menu, X, Plus } from "lucide-react";
import { DriveFlowLogo } from "@/components/DriveFlowLogo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddRideDialog } from "@/components/AddRideDialog";

const NAV = [
  { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
  { to: "/rides", label: "Corridas", icon: Car },
  { to: "/expenses", label: "Despesas", icon: Receipt },
  { to: "/goals", label: "Metas", icon: Target },
  { to: "/reports", label: "Relatórios", icon: FileBarChart },
  { to: "/profile", label: "Perfil", icon: User },
  { to: "/premium", label: "Premium", icon: Crown },
] as const;

export function AppShell({ children, title, onChanged }: { children: ReactNode; title: string; onChanged?: () => void }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate({ to: "/" }); return; }
      const { data: p } = await supabase.from("profiles").select("name").eq("id", user.id).maybeSingle();
      setUserName(p?.name || user.email || "");
    })();
  }, [navigate]);

  async function logout() {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    navigate({ to: "/" });
  }

  return (
    <div className="bg-hero relative min-h-screen">
      <div className="grid-bg pointer-events-none fixed inset-0" />

      {/* Sidebar desktop */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="px-6 py-5"><DriveFlowLogo /></div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link key={n.to} to={n.to} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary/15 text-foreground ring-1 ring-primary/30" : "text-muted-foreground hover:bg-card/60 hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />{n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-card/60 hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-card p-4 shadow-2xl">
            <div className="flex items-center justify-between px-2 pb-4"><DriveFlowLogo /><button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const active = pathname === n.to; const Icon = n.icon;
                return (
                  <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active ? "bg-primary/15 text-foreground" : "text-muted-foreground"}`}>
                    <Icon className="h-4 w-4" /> {n.label}
                  </Link>
                );
              })}
              <button onClick={logout} className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/60 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
            <h1 className="font-display text-lg font-semibold sm:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-muted-foreground sm:inline">Olá, {userName}</span>
            <button onClick={() => setAddOpen(true)} className="bg-gradient-primary shadow-glow inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-primary-foreground">
              <Plus className="h-3.5 w-3.5" /> Corrida
            </button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>

      <AddRideDialog open={addOpen} onOpenChange={setAddOpen} onSaved={() => { setAddOpen(false); onChanged?.(); }} />
    </div>
  );
}
