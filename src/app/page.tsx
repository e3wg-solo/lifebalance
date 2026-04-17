"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Leaf, ArrowRight, ChartPie, Lightning, CalendarBlank } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";

const FEATURES = [
  {
    icon: <ChartPie size={22} weight="fill" color="#7AAE7A" />,
    title: "Колесо жизни",
    desc: "8 сфер, визуализация баланса одним взглядом",
    bg: "#EAF4EA",
  },
  {
    icon: <CalendarBlank size={22} weight="fill" color="#6BAAD6" />,
    title: "30-дневные циклы",
    desc: "Трекинг прогресса с архивом всех периодов",
    bg: "#EDF4FB",
  },
  {
    icon: <Lightning size={22} weight="fill" color="#E09040" />,
    title: "Умные инсайты",
    desc: "Авто-анализ и советы по каждой сфере жизни",
    bg: "#FFF5EB",
  },
];

const SECTORS_PREVIEW = [
  { emoji: "🌿", label: "Здоровье", score: 8, color: "#C8DFC8" },
  { emoji: "⚡", label: "Спорт", score: 6, color: "#C5DCF0" },
  { emoji: "💛", label: "Семья", score: 9, color: "#F0DCA0" },
  { emoji: "🚀", label: "Карьера", score: 7, color: "#D4C5E2" },
  { emoji: "💎", label: "Доходы", score: 5, color: "#FDDCB5" },
  { emoji: "🎨", label: "Увлечения", score: 7, color: "#F5C5C5" },
  { emoji: "✨", label: "Жизнь", score: 8, color: "#B5E5D8" },
  { emoji: "🌍", label: "Путешествия", score: 4, color: "#E8D5C4" },
];

export default function LandingPage() {
  const router = useRouter();
  const isAuthenticated = useLifeBalanceStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -160, left: -120, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,223,200,0.35) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 200, right: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,197,226,0.3) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -100, left: "30%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,220,181,0.3) 0%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "#C8DFC8", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={18} weight="fill" color="#7AAE7A" />
            </div>
            <span style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-primary)" }}>LifeBalance</span>
          </div>
          <Link href="/login" style={{ textDecoration: "none" }}>
            <button className="btn btn-ghost" style={{ padding: "8px 16px" }}>
              Войти
            </button>
          </Link>
        </div>

        {/* Hero */}
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
                background: "#EAF4EA",
                borderRadius: 999,
                padding: "5px 14px",
                marginBottom: 24,
                border: "1px solid rgba(122,174,122,0.25)",
              }}
            >
              <span style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7AAE7A" }}>
                Новый 30-дневный цикл
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
              Колесо жизни
              <br />
              <span style={{ color: "#7AAE7A" }}>в твоих руках</span>
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
              8 сфер жизни. 30-дневные циклы. Умные инсайты.
              Начни строить баланс сегодня.
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
                  Начать бесплатно
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={14} weight="bold" color="white" />
                  </div>
                </motion.button>
              </Link>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: "none" }}>
                Без кредитной карты · Бесплатно
              </p>
            </div>
          </motion.div>
        </div>

        {/* Preview wheel mockup */}
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
            {SECTORS_PREVIEW.map((s, i) => (
              <motion.div
                key={s.label}
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
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "none" }}>
                    {s.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <div style={{ flex: 1, height: 3, background: "rgba(0,0,0,0.1)", borderRadius: 2, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.score * 10}%`, background: "rgba(0,0,0,0.25)", borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: "rgba(0,0,0,0.5)" }}>{s.score}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
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
              <div>
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

        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: 40 }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "none" }}>
            LifeBalance · Баланс начинается здесь
          </p>
        </div>
      </div>
    </div>
  );
}
