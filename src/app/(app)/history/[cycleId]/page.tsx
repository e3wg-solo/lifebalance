"use client";

import { useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, PencilSimple, LockSimpleOpen, NotePencil } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { SECTORS } from "@/lib/sectors";
import { WheelOfLife } from "@/components/wheel/WheelOfLife";
import { SectorIcon } from "@/components/icons/SectorIcon";
import { useT } from "@/lib/i18n/useT";
import { haptic } from "@/lib/haptics";

export default function CycleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, lang } = useT();
  const cycleId = params?.cycleId as string;
  const dateFmt = lang === "ru" ? "ru-RU" : "en-US";

  const { cycles, weeklyPulses, updateCycleScore, updateCycleNote } = useLifeBalanceStore();
  const cycle = cycles.find((c) => c.id === cycleId);

  const [editMode, setEditMode] = useState(false);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);
  const [noteSaved, setNoteSaved] = useState(false);
  const cycleNoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!cycle) {
    return (
      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)" }}>{lang === "ru" ? "Цикл не найден" : "Cycle not found"}</p>
        <button onClick={() => router.back()} className="btn btn-ghost" style={{ marginTop: 16 }}>
          {t("common.back")}
        </button>
      </div>
    );
  }

  const scores = cycle.scores;
  const vals = Object.values(scores).map((s) => s.value);
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

  // Get weekly pulses for this cycle sorted by weekNumber
  const pulses = weeklyPulses
    .filter((p) => p.cycleId === cycleId)
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const handleScoreEdit = useCallback(
    (sectorId: string, value: number) => {
      haptic("selection");
      updateCycleScore(cycleId, sectorId, value);
    },
    [cycleId, updateCycleScore]
  );

  const handleCycleNote = useCallback(
    (note: string) => {
      updateCycleNote(cycleId, note);
      if (cycleNoteTimer.current) clearTimeout(cycleNoteTimer.current);
      cycleNoteTimer.current = setTimeout(() => {
        setNoteSaved(true);
        setTimeout(() => setNoteSaved(false), 2000);
      }, 500);
    },
    [cycleId, updateCycleNote]
  );

  const sectorNoteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const [sectorNoteSaved, setSectorNoteSaved] = useState<Record<string, boolean>>({});

  const handleSectorNote = useCallback(
    (sectorId: string, note: string) => {
      updateCycleScore(cycleId, sectorId, scores[sectorId]?.value ?? 5, note);
      if (sectorNoteTimers.current[sectorId]) clearTimeout(sectorNoteTimers.current[sectorId]);
      sectorNoteTimers.current[sectorId] = setTimeout(() => {
        setSectorNoteSaved((prev) => ({ ...prev, [sectorId]: true }));
        setTimeout(() => setSectorNoteSaved((prev) => ({ ...prev, [sectorId]: false })), 2000);
      }, 400);
    },
    [cycleId, scores, updateCycleScore]
  );

  return (
    <div style={{ padding: "0 0 40px", overflow: "hidden", maxWidth: "100vw" }}>
      {/* Header */}
      <div style={{ padding: "24px 16px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => { haptic("light"); router.back(); }}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "1px solid var(--border-strong)",
              background: "var(--surface-hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} color="var(--text-primary)" />
          </motion.button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2 }}>
              {cycle.label}
            </h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: "none" }}>
              {new Date(cycle.startDate).toLocaleDateString(dateFmt, { day: "numeric", month: "short" })}
              {" — "}
              {new Date(cycle.endDate).toLocaleDateString(dateFmt, { day: "numeric", month: "short" })}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => { haptic("light"); setEditMode((e) => !e); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 14px",
              borderRadius: 999,
              border: `1.5px solid ${editMode ? "var(--accent)" : "var(--border-strong)"}`,
              background: editMode ? "var(--chip-green-bg)" : "var(--surface)",
              cursor: "pointer",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: editMode ? "var(--accent)" : "var(--text-secondary)",
            }}
          >
            {editMode ? <LockSimpleOpen size={15} weight="fill" /> : <PencilSimple size={15} weight="bold" />}
            {editMode ? t("history.editMode") : t("history.openEdit")}
          </motion.button>
        </div>

        {editMode && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "8px 12px",
              background: "var(--chip-green-bg)",
              borderRadius: 10,
              fontSize: "0.75rem",
              color: "var(--chip-green-text)",
              fontWeight: 500,
            }}
          >
            {t("history.editHint")}
          </motion.div>
        )}
      </div>

      {/* Summary chips */}
      <div style={{ padding: "0 16px", display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ background: "var(--chip-green-bg)", borderRadius: 999, padding: "5px 14px" }}>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--chip-green-text)" }}>
            {avg.toFixed(1)} / 10
          </span>
        </div>
        {cycle.completedAt && (
          <div style={{ background: "var(--chip-blue-bg)", borderRadius: 999, padding: "5px 14px" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--chip-blue-text)" }}>
              {t("common.completed")}
            </span>
          </div>
        )}
        {!cycle.completedAt && (
          <div style={{ background: "var(--chip-orange-bg)", borderRadius: 999, padding: "5px 14px" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--chip-orange-text)" }}>
              {t("common.current")}
            </span>
          </div>
        )}
      </div>

      {/* Wheel (read-only) */}
      <div style={{ padding: "0 16px", marginBottom: 20 }}>
        <div className="card" style={{ padding: "20px 12px 12px" }}>
          <WheelOfLife scores={scores} interactive={false} />
        </div>
      </div>

      {/* Weekly pulse sparklines */}
      {pulses.length > 0 && (
        <div style={{ padding: "0 16px", marginBottom: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
              {t("history.weeklyProgress")}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SECTORS.map((sector) => {
                const sectorPulses = pulses.map((p) => ({
                  week: p.weekNumber,
                  value: p.scores[sector.id] ?? 5,
                }));
                return (
                  <div key={sector.id} style={{ padding: "10px 12px", background: "var(--surface-hover)", borderRadius: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <SectorIcon sectorId={sector.id} size={13} color={sector.colorDark} />
                      <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                        {t(`sectors.${sector.id}.label`)}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 32 }}>
                      {[1, 2, 3, 4].map((wk) => {
                        const pulse = sectorPulses.find((p) => p.week === wk);
                        const val = pulse?.value;
                        return (
                          <div
                            key={wk}
                            title={val !== undefined ? `${t("history.week")} ${wk}: ${val}/10` : `${t("history.week")} ${wk}`}
                            style={{
                              flex: 1,
                              height: val !== undefined ? `${(val / 10) * 100}%` : "20%",
                              minHeight: 4,
                              background: val !== undefined ? sector.colorDark : "var(--border)",
                              borderRadius: 3,
                              opacity: val !== undefined ? 0.6 + (val / 10) * 0.4 : 0.3,
                              transition: "height 0.3s ease",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {pulses.length === 0 && (
        <div style={{ padding: "0 16px", marginBottom: 20 }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "center" }}>
            {t("history.noWeeklyData")}
          </p>
        </div>
      )}

      {/* Sector notes accordion */}
      <div style={{ padding: "0 16px", marginBottom: 20 }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12 }}>
          {t("common.notes")}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SECTORS.map((sector) => {
            const score = scores[sector.id];
            const hasNote = score?.note && score.note.trim().length > 0;
            const isExpanded = expandedSector === sector.id;

            return (
              <div key={sector.id} className="card" style={{ overflow: "hidden" }}>
                <button
                  onClick={() => {
                    haptic("light");
                    setExpandedSector(isExpanded ? null : sector.id);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: sector.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <SectorIcon sectorId={sector.id} size={16} color={sector.colorDark} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "none" }}>
                        {t(`sectors.${sector.id}.label`)}
                      </p>
                      {hasNote && !isExpanded && (
                        <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {score!.note}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {hasNote && <NotePencil size={14} color={sector.colorDark} weight="fill" />}
                    <span style={{ fontSize: "1rem", fontWeight: 800, color: sector.colorDark }}>{score?.value ?? 5}</span>
                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
                        {editMode ? (
                          <>
                            {/* Score edit mini-slider */}
                            <div style={{ marginBottom: 12, paddingTop: 14 }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                                  {t("common.score")}
                                </span>
                                <span style={{ fontWeight: 800, color: sector.colorDark }}>{score?.value ?? 5}/10</span>
                              </div>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                {Array.from({ length: 10 }, (_, i) => {
                                  const level = i + 1;
                                  const active = level <= (score?.value ?? 5);
                                  const isCurrent = level === score?.value;
                                  return (
                                    <motion.button
                                      key={level}
                                      whileTap={{ scale: 0.85 }}
                                      onClick={() => handleScoreEdit(sector.id, level)}
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

                            {/* Note textarea */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                              <label style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                                {t("sectorDetail.noteLabel")}
                              </label>
                              <AnimatePresence>
                                {sectorNoteSaved[sector.id] && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--chip-green-text)", background: "var(--chip-green-bg)", padding: "2px 8px", borderRadius: 999 }}
                                  >
                                    {t("common.saved")}
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </div>
                            <textarea
                              className="input"
                              placeholder={t("sectorDetail.notePlaceholder")}
                              defaultValue={score?.note ?? ""}
                              rows={2}
                              onChange={(e) => handleSectorNote(sector.id, e.target.value)}
                              style={{ resize: "none", lineHeight: 1.5 }}
                            />
                          </>
                        ) : (
                          <div style={{ paddingTop: 12 }}>
                            {hasNote ? (
                              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, maxWidth: "none" }}>
                                {score!.note}
                              </p>
                            ) : (
                              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", fontStyle: "italic", maxWidth: "none" }}>
                                {lang === "ru" ? "Нет заметки" : "No note"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cycle-level note */}
      <div style={{ padding: "0 16px" }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <label style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {t("history.cycleNoteLabel")}
            </label>
            <AnimatePresence>
              {noteSaved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--chip-green-text)", background: "var(--chip-green-bg)", padding: "2px 8px", borderRadius: 999 }}
                >
                  {t("common.saved")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <textarea
            className="input"
            placeholder={t("history.cycleNotePlaceholder")}
            defaultValue={cycle.notes ?? ""}
            rows={3}
            onChange={(e) => handleCycleNote(e.target.value)}
            style={{ resize: "none", lineHeight: 1.6 }}
          />
        </div>
      </div>
    </div>
  );
}
