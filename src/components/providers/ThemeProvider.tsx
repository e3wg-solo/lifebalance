"use client";

import { useEffect } from "react";
import { useLifeBalanceStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const user = useLifeBalanceStore((s) => s.user);
  const theme = user?.preferences?.theme ?? "system";

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (theme === "light") {
      root.removeAttribute("data-theme");
    } else {
      // system
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = (dark: boolean) => {
        if (dark) root.setAttribute("data-theme", "dark");
        else root.removeAttribute("data-theme");
      };
      apply(mq.matches);
      mq.addEventListener("change", (e) => apply(e.matches));
      return () => mq.removeEventListener("change", (e) => apply(e.matches));
    }
  }, [theme]);

  return <>{children}</>;
}
