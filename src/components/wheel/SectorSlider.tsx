"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";

interface SectorSliderProps {
  sectorId: string;
  label: string;
  color: string;
  colorDark: string;
  emoji: string;
  value: number;
  onChange: (value: number) => void;
}

const LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getLevelLabel(v: number): string {
  if (v <= 2) return "Критично";
  if (v <= 4) return "Слабо";
  if (v <= 6) return "Средне";
  if (v <= 8) return "Хорошо";
  return "Отлично";
}

export function SectorSlider({
  sectorId,
  label,
  color,
  colorDark,
  emoji,
  value,
  onChange,
}: SectorSliderProps) {
  const handleClick = useCallback(
    (v: number) => {
      onChange(v);
    },
    [onChange]
  );

  return (
    <div className="sector-slider" data-sector={sectorId}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>{emoji}</span>
          <span
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "0.9375rem",
              color: "var(--text-primary)",
            }}
          >
            {label}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: colorDark,
              background: color,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            {getLevelLabel(value)}
          </span>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: colorDark,
              minWidth: 24,
              textAlign: "right",
            }}
          >
            {value}
          </span>
        </div>
      </div>

      {/* Dot track */}
      <div
        style={{
          display: "flex",
          gap: 6,
          alignItems: "center",
          padding: "4px 0",
        }}
      >
        {LEVELS.map((level) => {
          const active = level <= value;
          const isCurrent = level === value;

          return (
            <motion.button
              key={level}
              onClick={() => handleClick(level)}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              aria-label={`Оценка ${level}`}
              style={{
                flex: 1,
                height: isCurrent ? 28 : active ? 22 : 16,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: active ? color : "rgba(0,0,0,0.07)",
                outline: isCurrent ? `2px solid ${colorDark}` : "none",
                outlineOffset: 1,
                transition: "height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.15s",
                position: "relative",
              }}
            >
              {isCurrent && (
                <motion.div
                  layoutId={`current-${sectorId}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    background: colorDark,
                    opacity: 0.25,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Min–Max labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
          fontSize: "0.6875rem",
          color: "var(--text-muted)",
          fontWeight: 500,
        }}
      >
        <span>1 — Критично</span>
        <span>10 — Идеально</span>
      </div>
    </div>
  );
}
