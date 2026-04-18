export type Language = "ru" | "en" | "system";

export interface SectorScore {
  id: string;
  value: number; // 1–10
  note?: string;
  updatedAt: string; // ISO date
}

export interface WeeklyPulse {
  id: string;
  cycleId: string;
  weekNumber: 1 | 2 | 3 | 4;
  scores: Record<string, number>; // sectorId → 1..10
  note?: string;
  createdAt: string;
}

export interface LifeCycle {
  id: string;
  userId: string;
  startDate: string; // ISO date — first day of cycle
  endDate: string; // ISO date — last day (startDate + 30d)
  scores: Record<string, SectorScore>;
  completedAt?: string;
  label?: string; // e.g. "April 2026"
  notes?: string; // cycle-level note
}

export interface DailyCheckin {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1–5
  note?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: string;
  streakDays: number;
  lastCheckinDate?: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    reminderDay: number; // day of month 1–28
    language: Language;
    haptics: boolean;
  };
}

export interface Insight {
  id: string;
  sectorId: string;
  type: "warning" | "success" | "tip" | "milestone";
  title: string;
  body: string;
  generatedAt: string;
}

export interface AppState {
  user: UserProfile | null;
  cycles: LifeCycle[];
  currentCycle: LifeCycle | null;
  checkins: DailyCheckin[];
  insights: Insight[];
  weeklyPulses: WeeklyPulse[];
}
