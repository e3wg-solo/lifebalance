"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLifeBalanceStore } from "@/lib/store";
import { SECTORS } from "@/lib/sectors";
import { ProgressChart } from "@/components/history/ProgressChart";
import { WheelOfLife } from "@/components/wheel/WheelOfLife";

export default function HistoryPage() {
  const { cycles } = useLifeBalanceStore();
  const [selectedSector, setSelectedSector] = useState<string | undefined>(undefined);

  const completedCycles = cycles.filter((c) => c.completedAt);
  const allCycles = cycles;

  if (allCycles.length === 0) {
    return (
      <div style={{ padding: "56px 24px", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
          История
        </h1>
        <div
          style={{
            marginTop: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 64 }}>📈</span>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-secondary)", maxWidth: "none" }}>
            История пока пуста
          </p>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", maxWidth: 260, textAlign: "center" }}>
            Заполни первый цикл и возвращайся через 30 дней
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Header */}
      <div style={{ padding: "56px 24px 20px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
          История
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          {allCycles.length} {allCycles.length === 1 ? "цикл" : "цикла"} · трекинг с{" "}
          {new Date(allCycles[0].startDate).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Overall progress chart */}
      <div style={{ padding: "0 24px", marginBottom: 20 }}>
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Средний балл
            </h2>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "var(--surface-hover)", padding: "3px 10px", borderRadius: 999 }}>
              Все циклы
            </span>
          </div>
          <ProgressChart cycles={allCycles} />
        </div>
      </div>

      {/* Sector filter */}
      <div style={{ padding: "0 24px", marginBottom: 16 }}>
        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 10, maxWidth: "none" }}>
          По секторам
        </p>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
          {SECTORS.map((s) => (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.93 }}
              onClick={() => setSelectedSector(selectedSector === s.id ? undefined : s.id)}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 999,
                border: `1.5px solid ${selectedSector === s.id ? s.colorDark : "var(--border)"}`,
                background: selectedSector === s.id ? s.color : "var(--surface)",
                cursor: "pointer",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                transition: "all 0.15s",
              }}
            >
              {s.emoji}
              <span>{s.labelRu}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {selectedSector && (
        <div style={{ padding: "0 24px", marginBottom: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
              {SECTORS.find((s) => s.id === selectedSector)?.labelRu}
            </h2>
            <ProgressChart cycles={allCycles} sectorId={selectedSector} />
          </div>
        </div>
      )}

      {/* Cycles list */}
      <div style={{ padding: "0 24px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
          Все циклы
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...allCycles].reverse().map((cycle, i) => {
            const vals = Object.values(cycle.scores).map((s) => s.value);
            const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
            const isActive = !cycle.completedAt;

            return (
              <motion.div
                key={cycle.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card"
                style={{ overflow: "hidden" }}
              >
                {/* Cycle header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "none" }}>
                        {cycle.label}
                      </p>
                      {isActive && (
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: "#7AAE7A",
                            background: "#EAF4EA",
                            padding: "2px 8px",
                            borderRadius: 999,
                          }}
                        >
                          Текущий
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2, maxWidth: "none" }}>
                      {new Date(cycle.startDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                      {" — "}
                      {new Date(cycle.endDate).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, maxWidth: "none" }}>
                      {avg.toFixed(1)}
                    </p>
                    <p style={{ fontSize: "0.625rem", color: "var(--text-muted)", fontWeight: 500, maxWidth: "none" }}>
                      средний
                    </p>
                  </div>
                </div>

                {/* Sector mini bars */}
                <div style={{ padding: "12px 16px", display: "flex", gap: 4 }}>
                  {SECTORS.map((s) => {
                    const v = cycle.scores[s.id]?.value ?? 5;
                    return (
                      <div key={s.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{ width: "100%", height: 36, background: "rgba(0,0,0,0.05)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${(v / 10) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.03 }}
                            style={{
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: s.color,
                              borderTop: `2px solid ${s.colorDark}`,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.5625rem", color: "var(--text-muted)", fontWeight: 600 }}>
                          {v}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
