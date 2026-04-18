"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLifeBalanceStore } from "@/lib/store";
import { SECTORS } from "@/lib/sectors";
import { WheelOfLife } from "@/components/wheel/WheelOfLife";
import { SectorDetail } from "@/components/wheel/SectorDetail";
import { InsightCard } from "@/components/insights/InsightCard";
import { getSector } from "@/lib/sectors";
import {
  Fire,
  CalendarBlank,
  TrendUp,
  HandWaving,
} from "@phosphor-icons/react";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { WeeklyPulseSheet } from "@/components/wheel/WeeklyPulseSheet";
import { useT } from "@/lib/i18n/useT";
import { haptic } from "@/lib/haptics";

export default function DashboardPage() {
  const {
    user,
    currentCycle,
    insights,
    selectedSector,
    setSelectedSector,
    updateScore,
    initCycle,
    refreshInsights,
    getCurrentWeekNumber,
    hasWeeklyPulse,
    getWeekStreak,
  } = useLifeBalanceStore();
  const { t } = useT();
  const [showPulseSheet, setShowPulseSheet] = useState(false);


  useEffect(() => {
    if (!currentCycle) initCycle();
    else refreshInsights();
  }, [currentCycle, initCycle, refreshInsights]);


  if (!currentCycle) return <Loading />;

  const scores = currentCycle.scores;
  const avgScore =
    Object.values(scores).reduce((sum, s) => sum + s.value, 0) /
    Object.keys(scores).length;

  const daysLeft = Math.max(
    0,
    Math.round(
      (new Date(currentCycle.endDate).getTime() - Date.now()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const selectedSectorConfig = selectedSector
    ? getSector(selectedSector)
    : null;
  const selectedScore = selectedSector ? scores[selectedSector] : null;

  // Build history values for selected sector
  const cycles = useLifeBalanceStore.getState().cycles;
  const historyValues = cycles
    .slice(0, -1)
    .map((c) => ({
      cycle: c.label ?? "",
      value: c.scores[selectedSector ?? ""]?.value ?? 5,
    }));
  const cycleIndex = cycles.length - 1;
  const currentWeek = getCurrentWeekNumber();
  const weekStreak = getWeekStreak();
  const pulseNeeded =
    currentCycle &&
    currentWeek !== null &&
    !hasWeeklyPulse(currentCycle.id, currentWeek);


  return (
    <div style={{ padding: "0 0 24px", overflow: "hidden", maxWidth: "100vw" }}>
      {/* Header */}
      <div
        style={{
          padding: "24px 16px 24px",
          background: "none",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              marginBottom: 6,
              maxWidth: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t("dashboard.greeting", { name: user?.name?.split(" ")[0] ?? "friend" })}
            <HandWaving size={15} weight="regular" color="var(--text-muted)" />
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.15,
              marginBottom: 0,
            }}
          >
            {t("dashboard.title")}
          </h1>
        </motion.div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 24,
          }}
        >
          <StatChip
            icon={<TrendUp size={14} weight="bold" color="var(--chip-green-text)" />}
            label={t("dashboard.avgScore")}
            value={avgScore.toFixed(1)}
            color="var(--chip-green-bg)"
            textColor="var(--chip-green-text)"
          />
          <StatChip
            icon={<CalendarBlank size={14} weight="bold" color="var(--chip-blue-text)" />}
            label={t("dashboard.resetIn")}
            value={`${daysLeft}${t("common.daysShort")}`}
            color="var(--chip-blue-bg)"
            textColor="var(--chip-blue-text)"
          />
          <StatChip
            icon={<Fire size={14} weight="fill" color="var(--chip-orange-text)" />}
            label={t("dashboard.streak")}
            value={`${weekStreak}${t("common.weeksShort")}`}
            color="var(--chip-orange-bg)"
            textColor="var(--chip-orange-text)"
          />
        </div>
      </div>

      {/* Wheel */}
      <div style={{ padding: "0 16px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
          className="card"
          style={{ padding: "24px 16px 16px", overflow: "hidden" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 8px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {t("dashboard.wheelTitle")}
            </h2>
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                background: "var(--surface-hover)",
                padding: "3px 10px",
                borderRadius: 999,
              }}
            >
              {currentCycle.label}
            </span>
          </div>

          <WheelOfLife
            scores={scores}
            selectedSector={selectedSector}
            onSectorClick={(id) =>
              setSelectedSector(selectedSector === id ? null : id)
            }
          />

          <p
            style={{
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: 12,
              maxWidth: "none",
            }}
          >
            {t("dashboard.tapHint")}
          </p>
        </motion.div>
      </div>

      {/* Weekly pulse banner */}
      {pulseNeeded && currentWeek && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: "12px 16px 0" }}
        >
          <div
            style={{
              background: "var(--chip-blue-bg)",
              border: "1px solid var(--chip-blue-text)30",
              borderRadius: 16,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--chip-blue-text)20", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarBlank size={18} weight="fill" color="var(--chip-blue-text)" />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "none" }}>
                  {t("dashboard.weeklyPulseBanner", { week: currentWeek })}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", maxWidth: "none" }}>
                  {t("dashboard.weeklyPulseSubtitle")}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { haptic("light"); setShowPulseSheet(true); }}
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: 999,
                background: "var(--chip-blue-text)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 600,
              }}
            >
              {t("dashboard.weeklyPulseBtn")}
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Sector grid */}
      <div style={{ padding: "20px 16px 0" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
          {t("dashboard.allSectors")}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 10,
          }}
        >
          {SECTORS.map((sector, i) => {
            const score = scores[sector.id]?.value ?? 5;
            const isSelected = selectedSector === sector.id;

            return (
              <motion.button
                key={sector.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 + 0.2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() =>
                  setSelectedSector(isSelected ? null : sector.id)
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 12px",
                  background: isSelected ? sector.color : "var(--surface)",
                  borderRadius: 14,
                  border: `1.5px solid ${isSelected ? sector.colorDark : "var(--border)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isSelected ? `0 4px 12px rgba(${sector.colorRgb}, 0.35)` : "var(--shadow-sm)",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  minWidth: 0,
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <SectorIcon sectorId={sector.id} size={20} color={sector.colorDark} weight={isSelected ? "fill" : "regular"} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.25,
                      maxWidth: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      wordBreak: "break-word",
                    }}
                  >
                    {t(`sectors.${sector.id}.label`)}
                    {scores[sector.id]?.note && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: sector.colorDark,
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                        title="Есть заметка"
                      />
                    )}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 3,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        background: "var(--border-strong)",
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score * 10}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 + 0.3 }}
                        style={{
                          height: "100%",
                          background: sector.colorDark,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        color: sector.colorDark,
                        minWidth: 16,
                      }}
                    >
                      {score}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div style={{ padding: "20px 16px 0" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            {t("insights.title")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Sector detail bottom sheet */}
      {/* Weekly pulse sheet */}
      {showPulseSheet && currentCycle && currentWeek && (
        <WeeklyPulseSheet
          weekNumber={currentWeek}
          cycleId={currentCycle.id}
          onClose={() => setShowPulseSheet(false)}
        />
      )}

      {selectedSectorConfig && selectedScore && (
        <SectorDetail
          sector={selectedSectorConfig}
          score={selectedScore}
          historyValues={historyValues}
          cycleIndex={cycleIndex}
          onClose={() => setSelectedSector(null)}
          onScoreChange={(sectorId, value) => updateScore(sectorId, value)}
          onNoteChange={(sectorId, note) => updateScore(sectorId, scores[sectorId]?.value ?? 5, note)}
        />
      )}
    </div>
  );
}

// Helper components
function StatChip({
  icon,
  label,
  value,
  color,
  textColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  textColor?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: color,
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
        {icon}
        <span style={{ fontSize: "0.625rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <p style={{ fontSize: "1.125rem", fontWeight: 800, color: textColor ?? "var(--text-primary)", maxWidth: "none" }}>
        {value}
      </p>
    </div>
  );
}

function Loading() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
      }}
    >
      <div
        className="animate-pulse-gentle"
        style={{
          width: 48,
          height: 48,
          borderRadius: 16,
          background: "var(--chip-green-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SectorIcon sectorId="health" size={28} color="#7AAE7A" />
      </div>
    </div>
  );
}
