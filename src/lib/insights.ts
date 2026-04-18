import type { SectorScore, Insight } from "@/types";
import { SECTORS } from "@/lib/sectors";
import { getTranslation, resolveLanguage, interpolate } from "./i18n";

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export function generateInsights(
  scores: Record<string, SectorScore>,
  language?: string
): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();
  const allValues = Object.values(scores).map((s) => s.value);
  const avg = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  const lang = resolveLanguage(language as "ru" | "en" | "system" | undefined);
  const dict = getTranslation(lang) as unknown as Record<string, unknown>;
  const t = (key: string, vars?: Record<string, string | number>) =>
    interpolate(getNestedValue(dict, key), vars);
  const sectorLabel = (id: string) => t(`sectors.${id}.label`);

  const sorted = [...Object.values(scores)].sort((a, b) => a.value - b.value);
  const lowest = sorted[0];
  const lowestSector = SECTORS.find((s) => s.id === lowest.id);

  if (lowest.value <= 4 && lowestSector) {
    const tip = lang === "ru" ? lowestSector.tips.ru[0] : lowestSector.tips.en[0];
    insights.push({
      id: `low-${lowest.id}`,
      sectorId: lowest.id,
      type: "warning",
      title: lang === "ru"
        ? `${sectorLabel(lowest.id)} требует внимания`
        : `${sectorLabel(lowest.id)} needs attention`,
      body: lang === "ru"
        ? `Оценка ${lowest.value}/10 — самый низкий показатель. Попробуй: ${tip}`
        : `Score ${lowest.value}/10 — your lowest. Try: ${tip}`,
      generatedAt: now,
    });
  }

  const highest = sorted[sorted.length - 1];
  const highestSector = SECTORS.find((s) => s.id === highest.id);
  if (highest.value >= 8 && highestSector) {
    insights.push({
      id: `high-${highest.id}`,
      sectorId: highest.id,
      type: "success",
      title: lang === "ru"
        ? `${sectorLabel(highest.id)} на высоте!`
        : `${sectorLabel(highest.id)} is thriving!`,
      body: lang === "ru"
        ? `${highest.value}/10 — отличный результат. Продолжай в том же духе!`
        : `${highest.value}/10 — great result. Keep it up!`,
      generatedAt: now,
    });
  }

  if (avg < 6) {
    insights.push({
      id: "balance-tip",
      sectorId: "life",
      type: "tip",
      title: lang === "ru" ? "Работа над балансом" : "Working on balance",
      body: lang === "ru"
        ? `Средний балл ${avg.toFixed(1)}/10. Небольшое улучшение в 2–3 областях кардинально меняет общее ощущение жизни.`
        : `Average score ${avg.toFixed(1)}/10. Small improvements in 2–3 areas can dramatically change your overall sense of well-being.`,
      generatedAt: now,
    });
  }

  if (allValues.every((v) => v >= 7)) {
    insights.push({
      id: "milestone-all7",
      sectorId: "life",
      type: "milestone",
      title: lang === "ru" ? "Все секторы на высоте!" : "All sectors are thriving!",
      body: lang === "ru"
        ? "Каждая область жизни выше 7 баллов — это настоящий баланс. Зафиксируй этот момент!"
        : "Every life area is above 7 — that's true balance. Capture this moment!",
      generatedAt: now,
    });
  }

  const gap = highest.value - lowest.value;
  if (gap >= 6) {
    insights.push({
      id: "gap-insight",
      sectorId: lowest.id,
      type: "tip",
      title: lang === "ru" ? "Большой разброс показателей" : "Large score spread",
      body: lang === "ru"
        ? `Разница между лучшим (${highest.value}) и слабейшим (${lowest.value}) сектором — ${gap} баллов. Небольшое внимание слабым областям улучшит общий баланс.`
        : `Gap between best (${highest.value}) and weakest (${lowest.value}) is ${gap} points. A little focus on weaker areas will improve overall balance.`,
      generatedAt: now,
    });
  }

  return insights.slice(0, 4);
}
