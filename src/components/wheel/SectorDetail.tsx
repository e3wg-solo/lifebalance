"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { SectorConfig } from "@/lib/sectors";
import { getRotatingTips } from "@/lib/sectors";
import type { SectorScore } from "@/types";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { SectorSlider } from "./SectorSlider";
import { useT } from "@/lib/i18n/useT";

interface SectorDetailProps {
  sector: SectorConfig | null;
  score: SectorScore | null;
  historyValues?: { cycle: string; value: number }[];
  cycleIndex?: number;
  onClose: () => void;
  onScoreChange: (sectorId: string, value: number) => void;
  onNoteChange?: (sectorId: string, note: string) => void;
}

export function SectorDetail({
  sector,
  score,
  historyValues = [],
  cycleIndex = 0,
  onClose,
  onScoreChange,
  onNoteChange,
}: SectorDetailProps) {
  const { t, lang } = useT();
  const [noteSaved, setNoteSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNoteChange = useCallback(
    (sectorId: string, note: string) => {
      if (onNoteChange) {
        onNoteChange(sectorId, note);
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          setNoteSaved(true);
          setTimeout(() => setNoteSaved(false), 2000);
        }, 400);
      }
    },
    [onNoteChange]
  );

  if (!sector || !score) return null;

  const tips = getRotatingTips(sector, cycleIndex, lang, 3);

  return (
    <AnimatePresence>
      {sector && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 40,
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              background: "var(--surface)",
              borderRadius: "28px 28px 0 0",
              padding: "28px 24px 40px",
              maxHeight: "85dvh",
              overflowY: "auto",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
            }}
          >
            {/* Handle */}

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: sector.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SectorIcon sectorId={sector.id} size={28} color={sector.colorDark} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {t(`sectors.${sector.id}.label`)}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                      maxWidth: "none",
                    }}
                  >
                    {lang === "ru" ? sector.description : (sector.descriptionEn ?? sector.description)}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                aria-label={t("common.close")}
              >
                <X size={16} weight="bold" color="var(--text-secondary)" />
              </button>
            </div>

            {/* Slider */}
            <div
              style={{
                background: "var(--surface-hover)",
                borderRadius: 16,
                padding: "16px 16px",
                marginBottom: 20,
              }}
            >
              <SectorSlider
                sectorId={sector.id}
                label={t(`sectors.${sector.id}.label`)}
                color={sector.color}
                colorDark={sector.colorDark}
                emoji={sector.emoji}
                value={score.value}
                onChange={(v) => onScoreChange(sector.id, v)}
              />
            </div>

            {/* Note input */}
            {onNoteChange && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <label
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {t("sectorDetail.noteLabel")}
                  </label>
                  <AnimatePresence>
                    {noteSaved && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          fontSize: "0.6875rem",
                          fontWeight: 600,
                          color: "var(--chip-green-text)",
                          background: "var(--chip-green-bg)",
                          padding: "2px 8px",
                          borderRadius: 999,
                        }}
                      >
                        {t("common.saved")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <textarea
                  className="input"
                  placeholder={t("sectorDetail.notePlaceholder")}
                  defaultValue={score.note ?? ""}
                  rows={2}
                  onChange={(e) => handleNoteChange(sector.id, e.target.value)}
                  style={{ resize: "none", lineHeight: 1.5 }}
                />
              </div>
            )}

            {/* History mini-chart */}
            {historyValues.length > 1 && (
              <div style={{ marginBottom: 20 }}>
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 10,
                    maxWidth: "none",
                  }}
                >
                  {t("sectorDetail.historyLabel")}
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 48 }}>
                  {historyValues.slice(-8).map((h, i) => (
                    <div
                      key={i}
                      title={`${h.cycle}: ${h.value}/10`}
                      style={{
                        flex: 1,
                        background: sector.color,
                        borderRadius: 4,
                        height: `${(h.value / 10) * 100}%`,
                        minHeight: 4,
                        border: `1px solid ${sector.colorDark}`,
                        opacity: 0.5 + (i / historyValues.length) * 0.5,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div>
              <p
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 10,
                  maxWidth: "none",
                }}
              >
                {t("sectorDetail.tipsLabel")}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {tips.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 12px",
                      background: sector.color + "40",
                      borderRadius: 10,
                      borderLeft: `3px solid ${sector.colorDark}`,
                    }}
                  >
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", lineHeight: 1.5, maxWidth: "none" }}>
                      {tip}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
