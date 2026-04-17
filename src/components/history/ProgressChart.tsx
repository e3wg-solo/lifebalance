"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import type { LifeCycle } from "@/types";
import { SECTORS } from "@/lib/sectors";

// Radar chart data for a single cycle
export function WheelRadar({ cycle }: { cycle: LifeCycle }) {
  const data = SECTORS.map((s) => ({
    subject: s.label,
    value: cycle.scores[s.id]?.value ?? 5,
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(0,0,0,0.08)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "var(--text-secondary)", fontSize: 10, fontFamily: "Outfit, sans-serif" }}
        />
        <Radar
          name="Баланс"
          dataKey="value"
          stroke="#7AAE7A"
          fill="#C8DFC8"
          fillOpacity={0.5}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface ProgressChartProps {
  cycles: LifeCycle[];
  sectorId?: string;
}

// Line chart for history
export function ProgressChart({ cycles, sectorId }: ProgressChartProps) {
  if (!sectorId) {
    // Show average score per cycle
    const data = cycles.map((c) => {
      const vals = Object.values(c.scores).map((s) => s.value);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return {
        name: c.label ?? new Date(c.startDate).toLocaleDateString("ru-RU", { month: "short", year: "2-digit" }),
        avg: parseFloat(avg.toFixed(1)),
      };
    });

    return (
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7AAE7A" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7AAE7A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: 10,
              fontFamily: "Outfit, sans-serif",
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="avg" stroke="#7AAE7A" fill="url(#avgGrad)" strokeWidth={2} dot={{ r: 4, fill: "#7AAE7A" }} />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  // Show specific sector
  const sector = SECTORS.find((s) => s.id === sectorId);
  const data = cycles.map((c) => ({
    name: c.label ?? new Date(c.startDate).toLocaleDateString("ru-RU", { month: "short", year: "2-digit" }),
    value: c.scores[sectorId]?.value ?? 5,
  }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "Outfit, sans-serif" }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: "var(--text-muted)", fontFamily: "Outfit, sans-serif" }} />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: 10,
            fontFamily: "Outfit, sans-serif",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={sector?.colorDark ?? "#7AAE7A"}
          strokeWidth={2}
          dot={{ r: 4, fill: sector?.colorDark ?? "#7AAE7A" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
