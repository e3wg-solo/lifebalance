"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useLifeBalanceStore } from "@/lib/store";
import { BottomNav } from "@/components/layout/BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 90 }}>
      {children}
      <BottomNav />
    </div>
  );
}
