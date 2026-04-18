"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";
import { SECTORS } from "@/lib/sectors";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import { haptic } from "@/lib/haptics";

interface WeeklyPulseSheetProps {
  weekNumber: 1 | 2 | 3 | 4;
  cycleId: string;
  onClose: () => void;
  onSaved?: () => void;
}

export function WeeklyPulseSheet({ weekNumber, cycleId, onClose, onSaved }: WeeklyPulseSheetProps) {
  const { t } = useT();
  const { addWeeklyPulse } = useLifeBalanceStore();

  // Seed inputs from the most recent source of truth for this cycle:
  // existing pulse for the same week > latest prior pulse > cycle scores > 5.
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const s = useLifeBalanceStore.getState();
    const sameWeek = s.weeklyPulses.find(
      (p) => p.cycleId === cycleId && p.weekNumber === weekNumber
    );
    const priorWeek = s.weeklyPulses
      .filter((p) => p.cycleId === cycleId && p.weekNumber < weekNumber)
      .sort((a, b) => b.weekNumber - a.weekNumber)[0];
    const sourcePulse = sameWeek ?? priorWeek;
    const cycle = s.currentCycle?.id === cycleId ? s.currentCycle : null;

    const out: Record<string, number> = {};
    SECTORS.forEach((sector) => {
      if (sourcePulse) out[sector.id] = sourcePulse.scores[sector.id] ?? 5;
      else if (cycle) out[sector.id] = cycle.scores[sector.id]?.value ?? 5;
      else out[sector.id] = 5;
    });
    return out;
  });

  const [note, setNote] = useState(() => {
    const s = useLifeBalanceStore.getState();
    const sameWeek = s.weeklyPulses.find(
      (p) => p.cycleId === cycleId && p.weekNumber === weekNumber
    );
    return sameWeek?.note ?? "";
  });
  const [saving, setSaving] = useState(false);

  const handleScoreChange = useCallback((sectorId: string, value: number) => {
    haptic("selection");
    setScores((prev) => ({ ...prev, [sectorId]: value }));
  }, []);

  const handleSave = async () => {
    haptic("success");
    setSaving(true);
    await new Promise((r) => setTimeout(r, 200));
    addWeeklyPulse(cycleId, weekNumber, scores, note || undefined);
    setSaving(false);
    onSaved?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <>
        {/* Backdrop */}
        <motion.div
          key="pulse-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        />

        {/* Sheet */}
        <motion.div
          key="pulse-sheet"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: "var(--surface)",
            borderRadius: "28px 28px 0 0",
            padding: "28px 24px 40px",
            maxHeight: "90dvh",
            overflowY: "auto",
            boxShadow: "0 -8px 40px rgba(0,0,0,0.12)",
          }}
        >

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
                {t("weeklyPulse.title", { week: weekNumber })}
              </h2>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", marginTop: 4, maxWidth: "none" }}>
                {t("weeklyPulse.subtitle")}
              </p>
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
            >
              <X size={16} weight="bold" color="var(--text-secondary)" />
            </button>
          </div>

          {/* Sector mini sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
            {SECTORS.map((sector) => {
              const val = scores[sector.id] ?? 5;
              return (
                <div key={sector.id}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <SectorIcon sectorId={sector.id} size={16} color={sector.colorDark} />
                      <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>
                        {t(`sectors.${sector.id}.label`)}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.875rem", fontWeight: 800, color: sector.colorDark }}>{val}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "2px 0" }}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const level = i + 1;
                      const active = level <= val;
                      const isCurrent = level === val;
                      return (
                        <motion.button
                          key={level}
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleScoreChange(sector.id, level)}
                          style={{
                            flex: 1,
                            height: isCurrent ? 24 : active ? 18 : 12,
                            borderRadius: 8,
                            border: "none",
                            cursor: "pointer",
                            background: active ? sector.color : "var(--border-strong)",
                            outline: isCurrent ? `2px solid ${sector.colorDark}` : "none",
                            outlineOffset: 1,
                            transition: "height 0.2s cubic-bezier(0.175,0.885,0.32,1.275), background 0.15s",
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              {t("weeklyPulse.noteLabel")}
            </label>
            <textarea
              className="input"
              placeholder={t("weeklyPulse.notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={{ resize: "none", lineHeight: 1.5 }}
            />
          </div>

          <motion.button
            className="btn btn-primary"
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            style={{ width: "100%", justifyContent: "center", padding: "14px 24px", fontSize: "1rem" }}
          >
            {saving ? t("common.loading") : t("weeklyPulse.saveBtn")}
          </motion.button>
        </motion.div>
      </>
    </AnimatePresence>
  );
}
