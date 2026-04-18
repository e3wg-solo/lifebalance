"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useLifeBalanceStore } from "@/lib/store";

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const hydrateFromSupabase = useLifeBalanceStore((s) => s.hydrateFromSupabase);
  const resetStore = useLifeBalanceStore((s) => s.resetStore);

  useEffect(() => {
    // Hydrate immediately if a session already exists (e.g. page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        hydrateFromSupabase(session.user.id);
      }
    });

    // Subscribe to future auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        hydrateFromSupabase(session.user.id);
      } else {
        resetStore();
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrateFromSupabase, resetStore]);

  return <>{children}</>;
}
