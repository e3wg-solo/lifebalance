"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { haptic } from "@/lib/haptics";
import { useT } from "@/lib/i18n/useT";

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

export function SectorSlider({
  sectorId,
  label,
  color,
  colorDark,
  emoji,
  value,
  onChange,
}: SectorSliderProps) {
  const { t } = useT();

  const getLevelLabel = (v: number): string => {
    if (v <= 2) return t("scoreLabels.critical");
    if (v <= 4) return t("scoreLabels.weak");
    if (v <= 6) return t("scoreLabels.medium");
    if (v <= 8) return t("scoreLabels.good");
    return t("scoreLabels.excellent");
  };

  const handleClick = useCallback(
    (v: number) => {
      haptic("selection");
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
          <SectorIcon sectorId={sectorId} size={20} color={colorDark} />
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
              aria-label={`${level}`}
              style={{
                flex: 1,
                height: isCurrent ? 28 : active ? 22 : 16,
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: active ? color : "var(--border-strong)",
                outline: isCurrent ? `2px solid ${colorDark}` : "none",
                outlineOffset: 1,
                transition: "height 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.15s",
              }}
            />
          );
        })}
      </div>

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
        <span>1 — {t("scoreLabels.critical")}</span>
        <span>10 — {t("scoreLabels.excellent")}</span>
      </div>
    </div>
  );
}
