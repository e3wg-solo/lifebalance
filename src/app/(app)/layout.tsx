"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLifeBalanceStore } from "@/lib/store";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationScheduler } from "@/components/providers/NotificationScheduler";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useLifeBalanceStore((s) => s.hasCompletedOnboarding);
  const isHydrating = useLifeBalanceStore((s) => s.isHydrating);

  useEffect(() => {
    if (isHydrating) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, hasCompletedOnboarding, isHydrating, router]);

  // While Supabase session is being verified, show nothing (avoids flash)
  if (isHydrating) return null;
  if (!isAuthenticated || !hasCompletedOnboarding) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      <NotificationScheduler />
      {children}
      <BottomNav />
    </div>
  );
}
