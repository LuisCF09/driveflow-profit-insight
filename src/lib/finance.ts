export type Ride = {
  id: string;
  date: string;
  app: string | null;
  gross_earnings: number;
  km_driven: number;
  hours_worked: number;
  total_minutes?: number | null;
  note: string | null;
  vehicle_id: string | null;
};

export function rideMinutes(r: Ride): number {
  if (r.total_minutes != null && Number(r.total_minutes) > 0) return Number(r.total_minutes);
  return Math.round(Number(r.hours_worked || 0) * 60);
}

export function formatMinutes(min: number): string {
  const m = Math.max(0, Math.round(min));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h === 0) return `${rest} minutos`;
  if (rest === 0) return `${h} ${h === 1 ? "hora" : "horas"}`;
  return `${h} ${h === 1 ? "hora" : "horas"} ${rest} ${rest === 1 ? "minuto" : "minutos"}`;
}

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string | null;
  vehicle_id: string | null;
};

export type Vehicle = {
  id: string;
  nickname: string;
  brand: string | null;
  model: string | null;
  fuel_type: string;
  km_per_liter: number;
  fuel_price: number;
  maintenance_cost_per_km: number;
  monthly_installment: number;
};

export function fuelCost(km: number, v: Vehicle | null) {
  if (!v || !v.km_per_liter) return 0;
  return (km / v.km_per_liter) * Number(v.fuel_price || 0);
}
export function wearCost(km: number, v: Vehicle | null) {
  if (!v) return 0;
  return km * Number(v.maintenance_cost_per_km || 0);
}
export function rideCost(km: number, v: Vehicle | null) {
  return fuelCost(km, v) + wearCost(km, v);
}
export function rideProfit(r: Ride, v: Vehicle | null) {
  return Number(r.gross_earnings) - rideCost(Number(r.km_driven), v);
}

export function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function inRange(dateISO: string, days: number) {
  const d = new Date(dateISO);
  const now = new Date();
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days + 1);
  cutoff.setHours(0, 0, 0, 0);
  return d >= cutoff;
}

export function isSameMonth(dateISO: string) {
  const d = new Date(dateISO);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function isToday(dateISO: string) {
  const d = new Date(dateISO);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function summarize(rides: Ride[], expenses: Expense[], v: Vehicle | null) {
  const gross = rides.reduce((s, r) => s + Number(r.gross_earnings), 0);
  const km = rides.reduce((s, r) => s + Number(r.km_driven), 0);
  const hours = rides.reduce((s, r) => s + Number(r.hours_worked), 0);
  const fuel = fuelCost(km, v);
  const wear = wearCost(km, v);
  const exp = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const profit = gross - fuel - wear - exp;
  return { gross, km, hours, fuel, wear, exp, profit, rides: rides.length };
}

export function seriesByDay(rides: Ride[], expenses: Expense[], v: Vehicle | null, days: number) {
  const buckets: Record<string, { date: string; gross: number; km: number; exp: number }> = {};
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    buckets[key] = { date: key, gross: 0, km: 0, exp: 0 };
  }
  for (const r of rides) {
    const key = r.date.slice(0, 10);
    if (buckets[key]) {
      buckets[key].gross += Number(r.gross_earnings);
      buckets[key].km += Number(r.km_driven);
    }
  }
  for (const e of expenses) {
    const key = e.date.slice(0, 10);
    if (buckets[key]) buckets[key].exp += Number(e.amount);
  }
  return Object.values(buckets).map((b) => {
    const cost = rideCost(b.km, v) + b.exp;
    return {
      date: b.date,
      label: new Date(b.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      receita: Math.round(b.gross * 100) / 100,
      custos: Math.round(cost * 100) / 100,
      lucro: Math.round((b.gross - cost) * 100) / 100,
    };
  });
}
