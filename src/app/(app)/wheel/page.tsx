"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLifeBalanceStore } from "@/lib/store";
import { SECTORS } from "@/lib/sectors";
import { WheelOfLife } from "@/components/wheel/WheelOfLife";
import { SectorSlider } from "@/components/wheel/SectorSlider";
import { SectorDetail } from "@/components/wheel/SectorDetail";
import { getSector } from "@/lib/sectors";
import { useT } from "@/lib/i18n/useT";

export default function WheelPage() {
  const { currentCycle, updateScore, selectedSector, setSelectedSector, cycles } = useLifeBalanceStore();
  const { t } = useT();
  const [note, setNote] = useState<Record<string, string>>({});

  if (!currentCycle) return null;

  const scores = currentCycle.scores;
  const selectedSectorConfig = selectedSector ? getSector(selectedSector) : null;
  const selectedScore = selectedSector ? scores[selectedSector] : null;

  const historyValues = cycles.slice(0, -1).map((c) => ({
    cycle: c.label ?? "",
    value: c.scores[selectedSector ?? ""]?.value ?? 5,
  }));

  return (
    <div style={{ padding: "0 0 24px", overflow: "hidden", maxWidth: "100vw" }}>
      <div style={{ padding: "24px 16px 20px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
          {t("wheel.title")}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          {t("wheel.subtitle")}
        </p>
      </div>

      <div style={{ padding: "0 16px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          className="card"
          style={{ padding: "20px 12px 16px" }}
        >
          <WheelOfLife
            scores={scores}
            selectedSector={selectedSector}
            onSectorClick={(id) => setSelectedSector(selectedSector === id ? null : id)}
          />
        </motion.div>
      </div>

      <div style={{ padding: "20px 16px 0" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
          {t("wheel.adjustScores")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card"
              style={{ padding: "16px 16px" }}
            >
              <SectorSlider
                sectorId={sector.id}
                label={t(`sectors.${sector.id}.label`)}
                color={sector.color}
                colorDark={sector.colorDark}
                emoji={sector.emoji}
                value={scores[sector.id]?.value ?? 5}
                onChange={(v) => updateScore(sector.id, v, note[sector.id])}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {selectedSectorConfig && selectedScore && (
        <SectorDetail
          sector={selectedSectorConfig}
          score={selectedScore}
          historyValues={historyValues}
          onClose={() => setSelectedSector(null)}
          onScoreChange={(id, v) => updateScore(id, v)}
          onNoteChange={(id, n) => {
            setNote((prev) => ({ ...prev, [id]: n }));
            updateScore(id, scores[id]?.value ?? 5, n);
          }}
        />
      )}
    </div>
  );
}
