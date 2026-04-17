import type { SectorScore, Insight } from "@/types";
import { SECTORS } from "@/lib/sectors";

export function generateInsights(scores: Record<string, SectorScore>): Insight[] {
  const insights: Insight[] = [];
  const now = new Date().toISOString();
  const allValues = Object.values(scores).map((s) => s.value);
  const avg = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  // Lowest sector warning
  const sorted = [...Object.values(scores)].sort((a, b) => a.value - b.value);
  const lowest = sorted[0];
  const lowestSector = SECTORS.find((s) => s.id === lowest.id);

  if (lowest.value <= 4 && lowestSector) {
    insights.push({
      id: `low-${lowest.id}`,
      sectorId: lowest.id,
      type: "warning",
      title: `${lowestSector.labelRu} требует внимания`,
      body: `Оценка ${lowest.value}/10 — самый низкий показатель. Попробуй: ${lowestSector.tips[0]}`,
      generatedAt: now,
    });
  }

  // Highest sector — celebrate
  const highest = sorted[sorted.length - 1];
  const highestSector = SECTORS.find((s) => s.id === highest.id);
  if (highest.value >= 8 && highestSector) {
    insights.push({
      id: `high-${highest.id}`,
      sectorId: highest.id,
      type: "success",
      title: `${highestSector.labelRu} на высоте!`,
      body: `${highest.value}/10 — отличный результат. Продолжай в том же духе!`,
      generatedAt: now,
    });
  }

  // Balance tip if avg < 6
  if (avg < 6) {
    insights.push({
      id: "balance-tip",
      sectorId: "life",
      type: "tip",
      title: "Работа над балансом",
      body: `Средний балл ${avg.toFixed(1)}/10. Небольшое улучшение в 2–3 областях кардинально меняет общее ощущение жизни.`,
      generatedAt: now,
    });
  }

  // Milestone: all sectors >= 7
  if (allValues.every((v) => v >= 7)) {
    insights.push({
      id: "milestone-all7",
      sectorId: "life",
      type: "milestone",
      title: "Все секторы на высоте! 🎉",
      body: "Каждая область жизни выше 7 баллов — это настоящий баланс. Зафиксируй этот момент!",
      generatedAt: now,
    });
  }

  // Uneven spread: gap between max and min > 6
  const gap = highest.value - lowest.value;
  if (gap >= 6) {
    insights.push({
      id: "gap-insight",
      sectorId: lowest.id,
      type: "tip",
      title: "Большой разброс показателей",
      body: `Разница между лучшим (${highest.value}) и слабейшим (${lowest.value}) сектором — ${gap} баллов. Небольшое внимание слабым областям улучшит общий баланс.`,
      generatedAt: now,
    });
  }

  return insights.slice(0, 4); // max 4 insights
}
