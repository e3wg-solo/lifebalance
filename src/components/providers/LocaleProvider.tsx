"use client";

import { useEffect } from "react";
import { useLifeBalanceStore } from "@/lib/store";
import { resolveLanguage } from "@/lib/i18n";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const lang = useLifeBalanceStore((s) => s.user?.preferences?.language);

  useEffect(() => {
    const resolved = resolveLanguage(lang);
    document.documentElement.lang = resolved;
  }, [lang]);

  return <>{children}</>;
}
