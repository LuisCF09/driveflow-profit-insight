import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Ride, Expense, Vehicle } from "@/lib/finance";

export function useDriveFlowData() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [ridesRes, expRes, vehRes] = await Promise.all([
        supabase.from("rides").select("*").order("date", { ascending: false }),
        supabase.from("expenses").select("*").order("date", { ascending: false }),
        supabase.from("vehicles").select("*").eq("is_active", true).limit(1),
      ]);
      setRides((ridesRes.data as Ride[]) || []);
      setExpenses((expRes.data as Expense[]) || []);
      setVehicle((vehRes.data?.[0] as Vehicle) || null);
    } catch (err) {
      console.error("[useDriveFlowData] reload failed", err);
      setRides([]); setExpenses([]); setVehicle(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  return { rides, expenses, vehicle, loading, reload };
}
