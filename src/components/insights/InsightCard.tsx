"use client";

import { motion } from "framer-motion";
import { Warning, CheckCircle, Lightbulb, Trophy } from "@phosphor-icons/react";
import type { Insight } from "@/types";
import { SECTORS } from "@/lib/sectors";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { useT } from "@/lib/i18n/useT";

const TYPE_CONFIG = {
  warning: {
    bg: "var(--insight-warning-bg)",
    border: "var(--insight-warning-border)",
    icon: <Warning size={18} weight="fill" color="var(--insight-warning-border)" />,
  },
  success: {
    bg: "var(--insight-success-bg)",
    border: "var(--insight-success-border)",
    icon: <CheckCircle size={18} weight="fill" color="var(--insight-success-border)" />,
  },
  tip: {
    bg: "var(--insight-tip-bg)",
    border: "var(--insight-tip-border)",
    icon: <Lightbulb size={18} weight="fill" color="var(--insight-tip-border)" />,
  },
  milestone: {
    bg: "var(--insight-milestone-bg)",
    border: "var(--insight-milestone-border)",
    icon: <Trophy size={18} weight="fill" color="var(--insight-milestone-border)" />,
  },
};

interface InsightCardProps {
  insight: Insight;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type];
  const sector = SECTORS.find((s) => s.id === insight.sectorId);
  const { t } = useT();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.08,
      }}
      style={{
        background: config.bg,
        borderRadius: 14,
        padding: "14px 16px",
        borderLeft: `3px solid ${config.border}`,
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
      }}
    >
      <span style={{ flexShrink: 0, marginTop: 1 }}>{config.icon}</span>
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 3,
            lineHeight: 1.3,
            maxWidth: "none",
          }}
        >
          {insight.title}
        </p>
        <p
          style={{
            fontSize: "0.8125rem",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            maxWidth: "none",
          }}
        >
          {insight.body}
        </p>
        {sector && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: config.border,
              background: `${config.border}18`,
              padding: "2px 8px",
              borderRadius: 999,
            }}
          >
            <SectorIcon sectorId={sector.id} size={12} color={config.border} />
            {t(`sectors.${sector.id}.label`)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
