"use client";

import { useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTORS } from "@/lib/sectors";
import type { SectorScore } from "@/types";

const SIZE = 340;
const CENTER = SIZE / 2;
const MAX_RADIUS = 130;
const MIN_RADIUS = 18;
const SECTOR_COUNT = SECTORS.length;
const ANGLE_STEP = (2 * Math.PI) / SECTOR_COUNT;

function polarToXY(angle: number, radius: number) {
  return {
    x: CENTER + radius * Math.cos(angle - Math.PI / 2),
    y: CENTER + radius * Math.sin(angle - Math.PI / 2),
  };
}

function buildSectorPath(index: number, value: number): string {
  const r = MIN_RADIUS + ((value - 1) / 9) * (MAX_RADIUS - MIN_RADIUS);
  const startAngle = index * ANGLE_STEP;
  const endAngle = (index + 1) * ANGLE_STEP;
  const gap = 0.04; // small gap between sectors

  const p1 = polarToXY(startAngle + gap, MIN_RADIUS);
  const p2 = polarToXY(startAngle + gap, r);
  const p3 = polarToXY(endAngle - gap, r);
  const p4 = polarToXY(endAngle - gap, MIN_RADIUS);

  const largeArc = endAngle - startAngle - gap * 2 > Math.PI ? 1 : 0;

  return [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${MIN_RADIUS} ${MIN_RADIUS} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
    "Z",
  ].join(" ");
}

function buildGridRing(level: number): string {
  const r = MIN_RADIUS + ((level - 1) / 9) * (MAX_RADIUS - MIN_RADIUS);
  const points = Array.from({ length: SECTOR_COUNT }, (_, i) => {
    const angle = i * ANGLE_STEP - Math.PI / 2;
    return `${CENTER + r * Math.cos(angle)},${CENTER + r * Math.sin(angle)}`;
  });
  return points.join(" ");
}

interface WheelOfLifeProps {
  scores: Record<string, SectorScore>;
  onSectorClick?: (sectorId: string) => void;
  selectedSector?: string | null;
  interactive?: boolean;
}

export function WheelOfLife({
  scores,
  onSectorClick,
  selectedSector,
  interactive = true,
}: WheelOfLifeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleClick = useCallback(
    (id: string) => {
      if (interactive && onSectorClick) {
        onSectorClick(id);
      }
    },
    [interactive, onSectorClick]
  );

  return (
    <div className="relative flex items-center justify-center">
      <svg
        ref={svgRef}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ maxWidth: "100%", height: "auto" }}
        aria-label="Колесо жизненного баланса"
      >
        {/* Background circle */}
        <circle cx={CENTER} cy={CENTER} r={MAX_RADIUS + 10} fill="rgba(0,0,0,0.03)" />

        {/* Grid rings */}
        {[2, 4, 6, 8, 10].map((level) => (
          <polygon
            key={level}
            points={buildGridRing(level)}
            fill="none"
            stroke="rgba(0,0,0,0.07)"
            strokeWidth="1"
            strokeDasharray={level === 10 ? "none" : "3,3"}
          />
        ))}

        {/* Grid spokes */}
        {SECTORS.map((_, i) => {
          const angle = i * ANGLE_STEP - Math.PI / 2;
          return (
            <line
              key={i}
              x1={CENTER + MIN_RADIUS * Math.cos(angle)}
              y1={CENTER + MIN_RADIUS * Math.sin(angle)}
              x2={CENTER + (MAX_RADIUS + 4) * Math.cos(angle)}
              y2={CENTER + (MAX_RADIUS + 4) * Math.sin(angle)}
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Sector fills */}
        {SECTORS.map((sector, i) => {
          const score = scores[sector.id]?.value ?? 5;
          const isSelected = selectedSector === sector.id;
          const path = buildSectorPath(i, score);

          return (
            <motion.path
              key={sector.id}
              d={path}
              fill={sector.color}
              stroke={sector.colorDark}
              strokeWidth={isSelected ? 2 : 1}
              strokeLinejoin="round"
              opacity={selectedSector && !isSelected ? 0.55 : 1}
              initial={{ scale: 0.6, opacity: 0, transformOrigin: `${CENTER}px ${CENTER}px` }}
              animate={{
                scale: isSelected ? 1.04 : 1,
                opacity: selectedSector && !isSelected ? 0.55 : 1,
                transformOrigin: `${CENTER}px ${CENTER}px`,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
                delay: i * 0.04,
              }}
              whileHover={interactive ? { scale: 1.06, opacity: 1 } : {}}
              style={{ cursor: interactive ? "pointer" : "default" }}
              onClick={() => handleClick(sector.id)}
              aria-label={`${sector.labelRu}: ${score}/10`}
            />
          );
        })}

        {/* Score labels inside sectors */}
        {SECTORS.map((sector, i) => {
          const score = scores[sector.id]?.value ?? 5;
          const midAngle = (i + 0.5) * ANGLE_STEP - Math.PI / 2;
          const r = MIN_RADIUS + ((score - 1) / 9) * (MAX_RADIUS - MIN_RADIUS);
          const labelR = Math.max(r / 2 + MIN_RADIUS, 32);
          const lx = CENTER + labelR * Math.cos(midAngle);
          const ly = CENTER + labelR * Math.sin(midAngle);

          return (
            <motion.text
              key={`label-${sector.id}`}
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fontFamily="Outfit, sans-serif"
              fill={sector.colorDark}
              opacity={score > 2 ? 1 : 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: score > 2 ? 1 : 0 }}
              transition={{ delay: i * 0.04 + 0.3 }}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {score}
            </motion.text>
          );
        })}

        {/* Center hub */}
        <circle cx={CENTER} cy={CENTER} r={MIN_RADIUS - 2} fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="1.5" />

        {/* Outer labels */}
        {SECTORS.map((sector, i) => {
          const midAngle = (i + 0.5) * ANGLE_STEP - Math.PI / 2;
          const labelR = MAX_RADIUS + 22;
          const lx = CENTER + labelR * Math.cos(midAngle);
          const ly = CENTER + labelR * Math.sin(midAngle);

          return (
            <motion.text
              key={`outer-${sector.id}`}
              x={lx}
              y={ly + 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fontFamily="Outfit, sans-serif"
              fill="var(--text-secondary)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 + 0.5 }}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {sector.label}
            </motion.text>
          );
        })}
      </svg>
    </div>
  );
}
