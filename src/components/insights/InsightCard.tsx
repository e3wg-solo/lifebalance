"use client";

import { motion } from "framer-motion";
import type { Insight } from "@/types";
import { SECTORS } from "@/lib/sectors";

const TYPE_CONFIG = {
  warning: {
    bg: "var(--insight-warning-bg)",
    border: "var(--insight-warning-border)",
    emoji: "⚠️",
  },
  success: {
    bg: "var(--insight-success-bg)",
    border: "var(--insight-success-border)",
    emoji: "✅",
  },
  tip: {
    bg: "var(--insight-tip-bg)",
    border: "var(--insight-tip-border)",
    emoji: "💡",
  },
  milestone: {
    bg: "var(--insight-milestone-bg)",
    border: "var(--insight-milestone-border)",
    emoji: "🏆",
  },
};

interface InsightCardProps {
  insight: Insight;
  index?: number;
}

export function InsightCard({ insight, index = 0 }: InsightCardProps) {
  const config = TYPE_CONFIG[insight.type];
  const sector = SECTORS.find((s) => s.id === insight.sectorId);

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
      <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{config.emoji}</span>
      <div>
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
            {sector.emoji} {sector.labelRu}
          </span>
        )}
      </div>
    </motion.div>
  );
}
