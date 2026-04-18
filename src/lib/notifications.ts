import type { LifeCycle, WeeklyPulse } from "@/types";

export function canNotify(): boolean {
  return typeof Notification !== "undefined" && Notification.permission === "granted";
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") return false;
  if (Notification.permission === "granted") return true;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!canNotify()) return;
  try {
    new Notification(title, {
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      ...options,
    });
  } catch {
    // Silently fail in environments where Notification constructor is restricted
  }
}

/**
 * Check if monthly cycle-end reminder should fire.
 * Fires when: cycle ends within 2 days and hasn't been completed.
 */
export function checkCycleEndReminder(cycle: LifeCycle | null): void {
  if (!cycle || cycle.completedAt) return;
  if (!canNotify()) return;

  const daysLeft = Math.round(
    (new Date(cycle.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 2 && daysLeft >= 0) {
    const key = `notified-cycle-end-${cycle.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    sendNotification("Цикл подходит к концу!", {
      body: `Осталось ${daysLeft} ${daysLeft === 1 ? "день" : "дня"}. Не забудь завершить цикл.`,
      tag: `cycle-end-${cycle.id}`,
    });
  }
}

/**
 * Check if weekly pulse reminder should fire.
 * Fires when current week has no pulse and it's been started (>= 1 day into the week).
 */
export function checkWeeklyPulseReminder(
  cycle: LifeCycle | null,
  weeklyPulses: WeeklyPulse[],
  weekNumber: number | null
): void {
  if (!cycle || weekNumber === null) return;
  if (!canNotify()) return;

  const hasPulse = weeklyPulses.some(
    (p) => p.cycleId === cycle.id && p.weekNumber === weekNumber
  );
  if (hasPulse) return;

  const start = new Date(cycle.startDate).getTime();
  const daysPassed = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  const weekStart = (weekNumber - 1) * 7;
  const daysIntoWeek = daysPassed - weekStart;

  if (daysIntoWeek >= 3) {
    const key = `notified-pulse-${cycle.id}-week${weekNumber}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    sendNotification(`Пульс недели ${weekNumber}/4`, {
      body: "Отметь, как прошла эта неделя — займёт меньше минуты.",
      tag: `pulse-${cycle.id}-w${weekNumber}`,
    });
  }
}
