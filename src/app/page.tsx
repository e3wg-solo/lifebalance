"use client";

import { useEffect, useState, memo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Sparkle,
  ChartPie,
  CalendarBlank,
  Lightning,
  Pulse,
  ClockCounterClockwise,
  Lock,
  Plus,
} from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { WheelOfLife } from "@/components/wheel/WheelOfLife";
import { SECTORS } from "@/lib/sectors";
import type { SectorScore } from "@/types";

const _NOW = new Date().toISOString();
const _VALUES: Record<string, number> = {
  health: 7, sport: 5, family: 8, career: 6,
  income: 4, hobbies: 7, life: 6, travel: 3,
};
const SAMPLE_SCORES: Record<string, SectorScore> = Object.fromEntries(
  Object.entries(_VALUES).map(([id, value]) => [id, { id, value, updatedAt: _NOW }])
);

// Isolated, memoized floating wrapper for the hero wheel (perpetual micro-motion)
const FloatingWheel = memo(function FloatingWheel() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: "100%", maxWidth: 380, margin: "0 auto" }}
    >
      <WheelOfLife scores={SAMPLE_SCORES} interactive={false} />
    </motion.div>
  );
});

function BentoTile({
  title,
  desc,
  icon,
  iconBg,
  iconColor,
  children,
  big,
  delay = 0,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  children?: React.ReactNode;
  big?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: big ? 24 : 20,
        boxShadow: "var(--shadow-card)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
        }}
      >
        {icon}
      </div>
      <div style={{ marginTop: "auto" }}>
        <h3
          style={{
            fontSize: big ? "1.125rem" : "1rem",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            marginBottom: 6,
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            maxWidth: "none",
          }}
        >
          {desc}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

function FaqItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: i * 0.05 }}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "18px 20px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          color: "var(--text-primary)",
        }}
      >
        <span style={{ fontSize: "0.9375rem", fontWeight: 700 }}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "var(--surface-hover)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--text-secondary)",
          }}
        >
          <Plus size={14} weight="bold" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p
              style={{
                padding: "0 20px 20px",
                fontSize: "0.9375rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                maxWidth: "none",
              }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);
  const { t } = useT();

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const bentoTiles = [
    {
      title: t("landing.feat1Title"),
      desc: t("landing.feat1Desc"),
      icon: <ChartPie size={20} weight="fill" />,
      iconBg: "var(--chip-green-bg)",
      iconColor: "#7AAE7A",
      big: true,
    },
    {
      title: t("landing.feat2Title"),
      desc: t("landing.feat2Desc"),
      icon: <CalendarBlank size={20} weight="fill" />,
      iconBg: "var(--chip-blue-bg)",
      iconColor: "#6BAAD6",
    },
    {
      title: t("landing.feat3Title"),
      desc: t("landing.feat3Desc"),
      icon: <Pulse size={20} weight="bold" />,
      iconBg: "#F5C5C540",
      iconColor: "#D97070",
    },
    {
      title: t("landing.feat4Title"),
      desc: t("landing.feat4Desc"),
      icon: <Lightning size={20} weight="fill" />,
      iconBg: "var(--chip-orange-bg)",
      iconColor: "#E09040",
    },
    {
      title: t("landing.feat5Title"),
      desc: t("landing.feat5Desc"),
      icon: <ClockCounterClockwise size={20} weight="bold" />,
      iconBg: "#D4C5E240",
      iconColor: "#9B7EC8",
    },
    {
      title: t("landing.feat6Title"),
      desc: t("landing.feat6Desc"),
      icon: <Lock size={20} weight="fill" />,
      iconBg: "#B5E5D840",
      iconColor: "#45B69A",
    },
  ];

  const faqs = [
    { q: t("landing.faq1Q"), a: t("landing.faq1A") },
    { q: t("landing.faq2Q"), a: t("landing.faq2A") },
    { q: t("landing.faq3Q"), a: t("landing.faq3A") },
    { q: t("landing.faq4Q"), a: t("landing.faq4A") },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Decorative background orbs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -160, left: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,223,200,0.35) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 300, right: -180, width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,197,226,0.28) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -120, left: "25%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,220,181,0.28) 0%, transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav style={{ position: "relative", zIndex: 2 }}>
        <div className="landing-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, paddingBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F7F8E9", border: "1px solid rgba(122,174,122,0.2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <Image src="/icons/logo.svg" alt="" width={22} height={22} priority />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>LifeBalance</span>
          </div>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ padding: "8px 16px" }}>
              {t("landing.login")}
            </button>
          </Link>
        </div>
      </nav>

      <main className="landing-container">
        {/* ─────────── HERO ─────────── */}
        <section className="landing-hero">
          <div className="landing-hero-text">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "var(--chip-green-bg)",
                borderRadius: 999,
                padding: "6px 14px",
                marginBottom: 22,
                border: "1px solid rgba(122,174,122,0.28)",
              }}
            >
              <Sparkle size={12} weight="fill" color="var(--chip-green-text)" />
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--chip-green-text)" }}>
                {t("landing.badge")}
              </span>
            </motion.div>

            <motion.h1
              className="landing-h1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
            >
              {t("landing.h1Top")}
              <br />
              <span style={{ color: "var(--chip-green-text)" }}>{t("landing.h1Bottom")}</span>
            </motion.h1>

            <motion.p
              className="landing-lead"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
            >
              {t("landing.lead")}
            </motion.p>

            <motion.div
              className="landing-cta-row"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <Link href="/register" style={{ textDecoration: "none", flex: "0 0 auto" }}>
                <motion.button
                  className="btn btn-primary"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  style={{ width: "100%", justifyContent: "center", padding: "14px 22px", fontSize: "0.9375rem", gap: 10 }}
                  id="cta-register"
                >
                  {t("landing.ctaPrimary")}
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={12} weight="bold" />
                  </div>
                </motion.button>
              </Link>
              <Link href="/login" style={{ textDecoration: "none", flex: "0 0 auto" }}>
                <motion.button
                  className="btn btn-ghost"
                  whileTap={{ scale: 0.97 }}
                  style={{ width: "100%", justifyContent: "center", padding: "14px 22px", fontSize: "0.9375rem" }}
                >
                  {t("landing.ctaSecondary")}
                </motion.button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{
                marginTop: 22,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: "var(--text-muted)",
                fontSize: "0.8125rem",
              }}
            >
              <ShieldCheck size={14} weight="regular" />
              <span>{t("landing.trust")}</span>
            </motion.div>
          </div>

          <motion.div
            className="landing-hero-visual"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <FloatingWheel />
          </motion.div>
        </section>

        {/* ─────────── PROBLEM ─────────── */}
        <section className="landing-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <span className="landing-kicker">{t("landing.problemKicker")}</span>
            <h2 className="landing-section-title" style={{ margin: "0 auto" }}>{t("landing.problemTitle")}</h2>
          </div>
          <div className="landing-problems">
            {[t("landing.problem1"), t("landing.problem2"), t("landing.problem3")].map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  padding: "22px 20px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 20,
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  gap: 14,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ flex: "0 0 auto", width: 6, height: 6, borderRadius: "50%", background: ["#D97070", "#E09040", "#9B7EC8"][i], marginTop: 10 }} />
                <p style={{ fontSize: "0.9375rem", color: "var(--text-primary)", lineHeight: 1.55, maxWidth: "none", fontWeight: 500 }}>
                  {p}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─────────── STEPS ─────────── */}
        <section className="landing-section">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="landing-kicker">{t("landing.stepsKicker")}</span>
            <h2 className="landing-section-title" style={{ margin: "0 auto" }}>{t("landing.stepsTitle")}</h2>
          </div>
          <div className="landing-steps">
            {[
              { label: t("landing.step1Label"), title: t("landing.step1Title"), desc: t("landing.step1Desc"), tone: "#7AAE7A", bg: "var(--chip-green-bg)" },
              { label: t("landing.step2Label"), title: t("landing.step2Title"), desc: t("landing.step2Desc"), tone: "#6BAAD6", bg: "var(--chip-blue-bg)" },
              { label: t("landing.step3Label"), title: t("landing.step3Title"), desc: t("landing.step3Desc"), tone: "#E09040", bg: "var(--chip-orange-bg)" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: 28,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 24,
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: s.bg,
                    fontWeight: 800,
                    fontSize: "1rem",
                    color: s.tone,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.label}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.015em", marginBottom: 8 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: "none" }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─────────── BENTO ─────────── */}
        <section className="landing-section">
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="landing-kicker">{t("landing.bentoKicker")}</span>
            <h2 className="landing-section-title" style={{ margin: "0 auto" }}>{t("landing.bentoTitle")}</h2>
          </div>
          <div className="landing-bento">
            {bentoTiles.map((tile, i) => (
              <BentoTile
                key={i}
                title={tile.title}
                desc={tile.desc}
                icon={tile.icon}
                iconBg={tile.iconBg}
                iconColor={tile.iconColor}
                big={tile.big}
                delay={i * 0.06}
              >
                {tile.big && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    {SECTORS.slice(0, 8).map((s, idx) => {
                      const score = [7, 5, 8, 6, 4, 7, 6, 3][idx];
                      return (
                        <div
                          key={s.id}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 9px",
                            borderRadius: 999,
                            background: s.color + "80",
                            border: `1px solid ${s.colorDark}40`,
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: s.colorDark,
                            }}
                          />
                          <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>
                            {score}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </BentoTile>
            ))}
          </div>
        </section>

        {/* ─────────── FAQ ─────────── */}
        <section className="landing-section">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 className="landing-section-title" style={{ margin: "0 auto" }}>{t("landing.faqTitle")}</h2>
          </div>
          <div className="landing-faq">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} i={i} />
            ))}
          </div>
        </section>

        {/* ─────────── FINAL CTA ─────────── */}
        <section className="landing-section">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "relative",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 32,
              padding: "clamp(32px, 5vw, 56px)",
              textAlign: "center",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.6 }}>
              <div style={{ position: "absolute", top: -80, left: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(122,174,122,0.25) 0%, transparent 70%)" }} />
              <div style={{ position: "absolute", bottom: -80, right: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,220,181,0.3) 0%, transparent 70%)" }} />
            </div>
            <div style={{ position: "relative" }}>
              <span className="landing-kicker" style={{ color: "#7AAE7A" }}>{t("landing.finalKicker")}</span>
              <h2
                style={{
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: "var(--text-primary)",
                  maxWidth: 640,
                  margin: "0 auto 16px",
                }}
              >
                {t("landing.finalTitle")}
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: 520,
                  margin: "0 auto 28px",
                }}
              >
                {t("landing.finalDesc")}
              </p>
              <Link href="/register" style={{ textDecoration: "none", display: "inline-block" }}>
                <motion.button
                  className="btn btn-primary"
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ y: -1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  style={{ padding: "16px 28px", fontSize: "1rem", gap: 10 }}
                >
                  {t("landing.finalCta")}
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={14} weight="bold" />
                  </div>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer style={{ textAlign: "center", padding: "32px 0 48px" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "none" }}>
            {t("landing.footer")}
          </p>
        </footer>
      </main>
    </div>
  );
}
