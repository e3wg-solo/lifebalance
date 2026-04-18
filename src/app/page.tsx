"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, ArrowRight, ChartPie, Lightning, CalendarBlank } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { SECTORS } from "@/lib/sectors";

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);
  const { t } = useT();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const FEATURES = [
    {
      icon: <ChartPie size={22} weight="fill" color="#7AAE7A" />,
      title: t("landing.featureWheel") || t("dashboard.wheelTitle"),
      desc: t("landing.featureWheelDesc") || "8 areas, visualize your balance at a glance",
      bg: "var(--chip-green-bg)",
    },
    {
      icon: <CalendarBlank size={22} weight="fill" color="#6BAAD6" />,
      title: t("landing.featureCycles") || "30-day cycles",
      desc: t("landing.featureCyclesDesc") || "Track progress with a full archive of all periods",
      bg: "var(--chip-blue-bg)",
    },
    {
      icon: <Lightning size={22} weight="fill" color="#E09040" />,
      title: t("landing.featureInsights") || t("insights.title"),
      desc: t("landing.featureInsightsDesc") || "Auto-analysis and tips for every life area",
      bg: "var(--chip-orange-bg)",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -160, left: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,223,200,0.35) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 200, right: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,197,226,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -100, left: "30%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,220,181,0.3) 0%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--chip-green-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={18} weight="fill" color="#7AAE7A" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>LifeBalance</span>
          </div>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ padding: "8px 16px" }}>
              {t("landing.login")}
            </button>
          </Link>
        </div>

        <div style={{ paddingTop: 64, paddingBottom: 40, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--chip-green-bg)",
                borderRadius: 999,
                padding: "5px 14px",
                marginBottom: 24,
                border: "1px solid rgba(122,174,122,0.25)",
              }}
            >
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7AAE7A" }}>
                {t("landing.badge")}
              </span>
              <span style={{ fontSize: 10, color: "#7AAE7A" }}>✦</span>
            </div>

            <h1
              style={{
                fontSize: "2.75rem",
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                marginBottom: 20,
              }}
            >
              {t("landing.title1")}
              <br />
              <span style={{ color: "#7AAE7A" }}>{t("landing.title2")}</span>
            </h1>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                maxWidth: 340,
                margin: "0 auto 32px",
              }}
            >
              {t("landing.subtitle")}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
              <Link href="/register" style={{ textDecoration: "none", width: "100%", maxWidth: 280 }}>
                <motion.button
                  className="btn btn-primary"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "14px 24px",
                    fontSize: "1rem",
                    gap: 10,
                  }}
                  id="cta-register"
                >
                  {t("landing.cta")}
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(128,128,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={14} weight="bold" color="currentColor" />
                  </div>
                </motion.button>
              </Link>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: "none" }}>
                {t("landing.free")}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="card"
          style={{ padding: "20px 16px", marginBottom: 32 }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {SECTORS.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: s.color + "55",
                  borderRadius: 12,
                  border: `1px solid ${s.color}`,
                }}
              >
                <SectorIcon sectorId={s.id} size={18} color={s.colorDark} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "none" }}>
                    {t(`sectors.${s.id}.label`)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <div style={{ flex: 1, height: 3, background: "var(--border-strong)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(5 + i) * 10}%`, background: "var(--text-secondary)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-secondary)" }}>{5 + (i % 4)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                background: "var(--surface)",
                borderRadius: 16,
                border: "1px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: f.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "none" }}>
                  {f.title}
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", maxWidth: "none" }}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "none" }}>
            {t("landing.footer")}
          </p>
        </div>
      </div>
    </div>
  );
}
