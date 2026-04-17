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
  ArrowRight,
} from "@phosphor-icons/react";

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
    getTodayCheckin,
    addCheckin,
  } = useLifeBalanceStore();

  const [checkinMood, setCheckinMood] = useState<number | null>(null);
  const [showCheckin, setShowCheckin] = useState(false);

  useEffect(() => {
    if (!currentCycle) initCycle();
    else refreshInsights();
  }, [currentCycle, initCycle, refreshInsights]);

  useEffect(() => {
    const todayCheckin = getTodayCheckin();
    setShowCheckin(!todayCheckin);
  }, [getTodayCheckin]);

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

  const handleMoodSubmit = (mood: number) => {
    setCheckinMood(mood);
    addCheckin(mood);
    setShowCheckin(false);
  };

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Header */}
      <div
        style={{
          padding: "56px 24px 24px",
          background: "linear-gradient(180deg, rgba(200,223,200,0.2) 0%, transparent 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-muted)",
              fontWeight: 500,
              marginBottom: 2,
              maxWidth: "none",
            }}
          >
            Привет, {user?.name?.split(" ")[0] ?? "друг"} 👋
          </p>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1.15,
            }}
          >
            Твой жизненный
            <br />
            баланс
          </h1>
        </motion.div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 20,
          }}
        >
          <StatChip
            icon={<TrendUp size={14} weight="bold" color="#7AAE7A" />}
            label="Средний балл"
            value={avgScore.toFixed(1)}
            color="#EAF4EA"
          />
          <StatChip
            icon={<CalendarBlank size={14} weight="bold" color="#6BAAD6" />}
            label="До сброса"
            value={`${daysLeft}д`}
            color="#EDF4FB"
          />
          <StatChip
            icon={<Fire size={14} weight="fill" color="#E09040" />}
            label="Серия"
            value={`${user?.streakDays ?? 0}д`}
            color="#FFF5EB"
          />
        </div>
      </div>

      {/* Daily check-in */}
      {showCheckin && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          style={{ padding: "0 24px", marginBottom: 16 }}
        >
          <div
            className="card"
            style={{
              padding: "18px 20px",
              background: "linear-gradient(135deg, #F0DCA0 0%, #FDDCB5 100%)",
              border: "none",
            }}
          >
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#8A5A00", marginBottom: 12, maxWidth: "none" }}>
              Как ты сегодня?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { mood: 1, emoji: "😔" },
                { mood: 2, emoji: "😐" },
                { mood: 3, emoji: "🙂" },
                { mood: 4, emoji: "😊" },
                { mood: 5, emoji: "🤩" },
              ].map(({ mood, emoji }) => (
                <motion.button
                  key={mood}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  onClick={() => handleMoodSubmit(mood)}
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 12,
                    border: "none",
                    background: "rgba(255,255,255,0.6)",
                    fontSize: 22,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Wheel */}
      <div style={{ padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 24, delay: 0.1 }}
          className="card"
          style={{ padding: "24px 16px 16px", overflow: "hidden" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "0 8px" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Колесо жизни
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
            Нажми на сектор, чтобы изменить оценку
          </p>
        </motion.div>
      </div>

      {/* Sector grid */}
      <div style={{ padding: "16px 24px 0" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
          Все секторы
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
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
                  padding: "12px 14px",
                  background: isSelected ? sector.color : "var(--surface)",
                  borderRadius: 14,
                  border: `1.5px solid ${isSelected ? sector.colorDark : "var(--border)"}`,
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isSelected ? `0 4px 12px rgba(${sector.colorRgb}, 0.35)` : "var(--shadow-sm)",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                }}
              >
                <span style={{ fontSize: 20 }}>{sector.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "none",
                    }}
                  >
                    {sector.labelRu}
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
                        background: "rgba(0,0,0,0.08)",
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
        <div style={{ padding: "20px 24px 0" }}>
          <h2
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Инсайты
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {insights.map((insight, i) => (
              <InsightCard key={insight.id} insight={insight} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Sector detail bottom sheet */}
      {selectedSectorConfig && selectedScore && (
        <SectorDetail
          sector={selectedSectorConfig}
          score={selectedScore}
          historyValues={historyValues}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
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
      <p style={{ fontSize: "1.125rem", fontWeight: 800, color: "var(--text-primary)", maxWidth: "none" }}>
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
          background: "#C8DFC8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}
      >
        🌿
      </div>
    </div>
  );
}
