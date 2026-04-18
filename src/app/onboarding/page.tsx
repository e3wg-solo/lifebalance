"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Lightbulb } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { SECTORS } from "@/lib/sectors";
import type { OnboardingScores } from "@/lib/store";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { useT } from "@/lib/i18n/useT";
import { celebrate } from "@/lib/confetti";
import { haptic } from "@/lib/haptics";

const TOTAL = SECTORS.length;

function ScoreDots({
  value,
  color,
  colorDark,
  onChange,
}: {
  value: number;
  color: string;
  colorDark: string;
  onChange: (v: number) => void;
}) {
  const { t } = useT();
  return (
    <div>
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end", padding: "8px 0" }}>
        {Array.from({ length: 10 }, (_, i) => {
          const level = i + 1;
          const active = level <= value;
          const isCurrent = level === value;
          return (
            <motion.button
              key={level}
              onClick={() => { haptic("selection"); onChange(level); }}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.12, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label={`${level}`}
              style={{
                flex: 1,
                height: isCurrent ? 40 : active ? 30 : 18,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: active ? color : "var(--border-strong)",
                outline: isCurrent ? `2.5px solid ${colorDark}` : "none",
                outlineOffset: 2,
                transition: "height 0.2s cubic-bezier(0.175,0.885,0.32,1.275), background 0.15s",
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 6,
          fontSize: "0.6875rem",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        <span>{t("onboarding.minLabel")}</span>
        <span>{t("onboarding.maxLabel")}</span>
      </div>
    </div>
  );
}

function useLevelLabel() {
  const { t } = useT();
  return (v: number): string => {
    if (v <= 2) return t("scoreLabels.critical");
    if (v <= 4) return t("scoreLabels.weak");
    if (v <= 6) return t("scoreLabels.medium");
    if (v <= 8) return t("scoreLabels.good");
    return t("scoreLabels.excellent");
  };
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t, lang } = useT();
  const getLevelLabel = useLevelLabel();
  const { isAuthenticated, hasCompletedOnboarding, completeOnboarding } = useLifeBalanceStore();

  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<OnboardingScores>(() =>
    Object.fromEntries(SECTORS.map((s) => [s.id, 5]))
  );
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated or already onboarded
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (hasCompletedOnboarding) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  const sector = SECTORS[step];
  const currentScore = scores[sector.id] ?? 5;
  const progress = (step / TOTAL) * 100;

  const handleNext = () => {
    haptic("light");
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    haptic("light");
    if (step > 0) setStep((s) => s - 1);
  };

  const handleFinish = async () => {
    setSaving(true);
    await completeOnboarding(scores);
    celebrate({ intensity: "full" });
    // Let confetti play for a moment before navigating
    await new Promise((r) => setTimeout(r, 600));
    router.push("/dashboard");
  };

  const isLast = step === TOTAL - 1;

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Ambient background blob */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <motion.div
          key={sector.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "absolute",
            top: -200,
            right: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${sector.color}66 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: 520,
          margin: "0 auto",
          width: "100%",
          padding: "0 16px",
        }}
      >
        {/* Top bar */}
        <div style={{ paddingTop: 56, paddingBottom: 32 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                maxWidth: "none",
              }}
            >
              {t("onboarding.stepOf", { step: step + 1, total: TOTAL })}
            </p>
            <p
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                maxWidth: "none",
              }}
            >
              {t("onboarding.initialRating")}
            </p>
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: 4,
              background: "var(--border-strong)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${((step + 1) / TOTAL) * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              style={{
                height: "100%",
                background: sector.colorDark,
                borderRadius: 2,
              }}
            />
          </div>
        </div>

        {/* Sector card */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sector.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ flex: 1 }}
          >
            {/* Sector icon + label */}
            <div style={{ marginBottom: 32 }}>
              {/* Icon and name side by side */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 300, damping: 20 }}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 22,
                    background: sector.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: `0 8px 24px ${sector.color}88`,
                  }}
                >
                  <SectorIcon sectorId={sector.id} size={36} color={sector.colorDark} />
                </motion.div>

                <h1
                  style={{
                    fontSize: "2rem",
                    fontWeight: 900,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  {t(`sectors.${sector.id}.label`)}
                </h1>
              </div>

              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 8,
                  maxWidth: "none",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.4,
                }}
              >
                {t("onboarding.question", { sector: t(`sectors.${sector.id}.label`) })}
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.55,
                  maxWidth: "none",
                }}
              >
                {lang === "ru" ? sector.description : (sector.descriptionEn ?? sector.description)}
              </p>
            </div>

            {/* Score display */}
            <div style={{ marginBottom: 28 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: sector.colorDark,
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {currentScore}
                </span>
                <span
                  style={{
                    fontSize: "1.125rem",
                    color: "var(--text-muted)",
                    fontWeight: 500,
                  }}
                >
                  / 10
                </span>
                <span
                  style={{
                    marginLeft: 4,
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: sector.colorDark,
                    background: sector.color,
                    padding: "4px 12px",
                    borderRadius: 999,
                  }}
                >
                  {getLevelLabel(currentScore)}
                </span>
              </div>

              <ScoreDots
                value={currentScore}
                color={sector.color}
                colorDark={sector.colorDark}
                onChange={(v) =>
                  setScores((prev) => ({ ...prev, [sector.id]: v }))
                }
              />
            </div>

            {/* Quick tip */}
            <div
              style={{
                padding: "12px 16px",
                background: sector.color + "40",
                borderRadius: 14,
                borderLeft: `3px solid ${sector.colorDark}`,
                marginBottom: 32,
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Lightbulb size={16} weight="fill" color={sector.colorDark} style={{ marginTop: 2, flexShrink: 0 }} />
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  maxWidth: "none",
                }}
              >
                {lang === "ru" ? sector.tips.ru[0] : sector.tips.en[0]}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingBottom: "max(32px, env(safe-area-inset-bottom))",
            paddingTop: 8,
          }}
        >
          {step > 0 && (
            <motion.button
              onClick={handleBack}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost"
              style={{ flexShrink: 0, padding: "13px 16px" }}
              aria-label={t("common.back")}
            >
              <ArrowLeft size={18} />
            </motion.button>
          )}

          <motion.button
            onClick={handleNext}
            disabled={saving}
            whileTap={{ scale: 0.97 }}
            className="btn btn-primary"
            style={{
              flex: 1,
              justifyContent: "center",
              padding: "14px 24px",
              fontSize: "1rem",
              gap: 10,
              opacity: saving ? 0.7 : 1,
            }}
            id={isLast ? "onboarding-finish" : `onboarding-next-${step}`}
          >
            {saving ? (
              t("common.loading")
            ) : isLast ? (
              <>
                {t("onboarding.finishBtn")}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(128,128,128,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={14} weight="bold" color="currentColor" />
                </div>
              </>
            ) : (
              <>
                {t("onboarding.nextBtn")}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "rgba(128,128,128,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ArrowRight size={14} weight="bold" color="currentColor" />
                </div>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
