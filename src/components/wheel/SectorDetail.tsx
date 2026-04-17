"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import type { SectorConfig } from "@/lib/sectors";
import type { SectorScore } from "@/types";
import { SectorSlider } from "./SectorSlider";

interface SectorDetailProps {
  sector: SectorConfig | null;
  score: SectorScore | null;
  historyValues?: { cycle: string; value: number }[];
  onClose: () => void;
  onScoreChange: (sectorId: string, value: number) => void;
  onNoteChange?: (sectorId: string, note: string) => void;
}

export function SectorDetail({
  sector,
  score,
  historyValues = [],
  onClose,
  onScoreChange,
  onNoteChange,
}: SectorDetailProps) {
  if (!sector || !score) return null;

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
            <div
              style={{
                width: 40,
                height: 4,
                background: "var(--border-strong)",
                borderRadius: 2,
                margin: "0 auto 24px",
              }}
            />

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
                    fontSize: 24,
                  }}
                >
                  {sector.emoji}
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
                    {sector.labelRu}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-muted)",
                      marginTop: 2,
                      maxWidth: "none",
                    }}
                  >
                    {sector.description}
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
                aria-label="Закрыть"
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
                label={sector.labelRu}
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
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 6,
                  }}
                >
                  Заметка (необязательно)
                </label>
                <textarea
                  className="input"
                  placeholder="Что повлияло на эту оценку?"
                  defaultValue={score.note ?? ""}
                  rows={2}
                  onChange={(e) => onNoteChange(sector.id, e.target.value)}
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
                  История
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
                Советы
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sector.tips.map((tip, i) => (
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
