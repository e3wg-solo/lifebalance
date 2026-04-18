"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChartPie,
  ClockCounterClockwise,
  Gear,
  House,
} from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { haptic } from "@/lib/haptics";
import { useT } from "@/lib/i18n/useT";

export function BottomNav() {
  const pathname = usePathname();
  const user = useLifeBalanceStore((s) => s.user);
  const { t } = useT();

  const NAV_ITEMS = [
    { href: "/dashboard", label: t("nav.home"), icon: House },
    { href: "/wheel", label: t("nav.wheel"), icon: ChartPie },
    { href: "/history", label: t("nav.history"), icon: ClockCounterClockwise },
    { href: "/settings", label: t("nav.settings"), icon: Gear },
  ];

  if (!user) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        padding: "0 16px 16px",
        // Lift the nav above the home indicator AND above the physical
        // corner curvature, so its sides aren't clipped on rounded screens.
        paddingBottom: "max(16px, calc(env(safe-area-inset-bottom) + 12px))",
      }}
    >
      <div
        className="glass"
        style={{
          display: "flex",
          borderRadius: 24,
          padding: "6px 8px",
          gap: 4,
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => haptic("light")}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "8px 4px",
                borderRadius: 16,
                background: active ? "rgba(122,174,122,0.15)" : "transparent",
                textDecoration: "none",
                transition: "background 0.2s",
                position: "relative",
              }}
              aria-label={label}
            >
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: "rgba(122,174,122,0.12)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                weight={active ? "fill" : "regular"}
                color={active ? "#7AAE7A" : "var(--text-muted)"}
              />
              <span
                style={{
                  fontSize: "0.625rem",
                  fontWeight: 600,
                  color: active ? "#7AAE7A" : "var(--text-muted)",
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
