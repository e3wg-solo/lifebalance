"use client";

import { useEffect } from "react";
import { useLifeBalanceStore } from "@/lib/store";
import { checkCycleEndReminder, checkWeeklyPulseReminder } from "@/lib/notifications";

export function NotificationScheduler() {
  const { currentCycle, weeklyPulses, user, getCurrentWeekNumber } = useLifeBalanceStore();
  const notificationsEnabled = user?.preferences?.notifications ?? true;

  useEffect(() => {
    if (!notificationsEnabled) return;

    const weekNumber = getCurrentWeekNumber();
    checkCycleEndReminder(currentCycle);
    checkWeeklyPulseReminder(currentCycle, weeklyPulses, weekNumber);

    // Re-check every hour
    const interval = setInterval(() => {
      const wk = getCurrentWeekNumber();
      checkCycleEndReminder(currentCycle);
      checkWeeklyPulseReminder(currentCycle, weeklyPulses, wk);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentCycle, weeklyPulses, notificationsEnabled, getCurrentWeekNumber]);

  return null;
}
