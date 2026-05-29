import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Plan = "free" | "premium";

export function useSubscription() {
  const [plan, setPlan] = useState<Plan>("free");
  const [status, setStatus] = useState<string>("active");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (!cancelled) setLoading(false); return; }
        const { data } = await supabase
          .from("subscriptions")
          .select("plan, status")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        if (cancelled) return;
        if (data) {
          setPlan((data.plan as Plan) || "free");
          setStatus(data.status || "active");
        }
      } catch (err) {
        console.error("[useSubscription] failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isPremium = plan === "premium" && status === "active";
  return { plan, status, isPremium, loading };
}
