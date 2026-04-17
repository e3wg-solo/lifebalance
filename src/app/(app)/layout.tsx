"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLifeBalanceStore } from "@/lib/store";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);
  const hasCompletedOnboarding = useLifeBalanceStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (!hasCompletedOnboarding) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  if (!isAuthenticated || !hasCompletedOnboarding) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      {children}
      <BottomNav />
    </div>
  );
}

