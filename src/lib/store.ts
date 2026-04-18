"use client";

// One-time wipe of legacy localStorage state from the pre-Supabase era.
if (typeof window !== "undefined" && !localStorage.getItem("lifebalance-wiped-v1")) {
  localStorage.removeItem("lifebalance-store");
  localStorage.setItem("lifebalance-wiped-v1", "1");
}

import { create } from "zustand";
import type { LifeCycle, UserProfile, DailyCheckin, Insight, SectorScore, WeeklyPulse } from "@/types";

// Only log in development — never expose Supabase error details (which may
// contain user emails, UUIDs, or query fragments) to production consoles.
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(...args);
  }
};
import { SECTORS } from "@/lib/sectors";
import { generateInsights } from "@/lib/insights";
import { supabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

export type OnboardingScores = Record<string, number>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function rowToCycle(row: {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  scores: unknown;
  completed_at: string | null;
  label: string | null;
  notes: string | null;
}): LifeCycle {
  return {
    id: row.id,
    userId: row.user_id,
    startDate: row.start_date,
    endDate: row.end_date,
    scores: (row.scores as Record<string, SectorScore>) ?? {},
    completedAt: row.completed_at ?? undefined,
    label: row.label ?? undefined,
    notes: row.notes ?? undefined,
  };
}

function rowToWeeklyPulse(row: {
  id: string;
  cycle_id: string;
  week_number: number;
  scores: unknown;
  note: string | null;
  created_at: string;
}): WeeklyPulse {
  return {
    id: row.id,
    cycleId: row.cycle_id,
    weekNumber: row.week_number as 1 | 2 | 3 | 4,
    scores: (row.scores as Record<string, number>) ?? {},
    note: row.note ?? undefined,
    createdAt: row.created_at,
  };
}

function rowToCheckin(row: {
  id: string;
  user_id: string;
  date: string;
  mood: number;
  note: string | null;
}): DailyCheckin {
  return {
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mood: row.mood,
    note: row.note ?? undefined,
  };
}

function buildDefaultPrefs(): UserProfile["preferences"] {
  return {
    theme: "system",
    notifications: true,
    reminderDay: 1,
    language: "system",
    haptics: true,
  };
}

function createNewCycleObj(userId: string): Omit<LifeCycle, "id"> {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);
  const scores: Record<string, SectorScore> = {};
  SECTORS.forEach((s) => {
    scores[s.id] = { id: s.id, value: 5, updatedAt: now.toISOString() };
  });
  return {
    userId,
    startDate: now.toISOString(),
    endDate: end.toISOString(),
    scores,
    label: now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
  };
}

// ---------------------------------------------------------------------------
// Store interface
// ---------------------------------------------------------------------------

interface LifeBalanceStore {
  // Auth
  user: UserProfile | null;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  isHydrating: boolean;

  // Public auth methods (called from UI)
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;

  // Internal: called by SupabaseAuthProvider after session change
  hydrateFromSupabase: (userId: string) => Promise<void>;
  resetStore: () => void;

  updateUser: (patch: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (scores: OnboardingScores) => Promise<void>;

  // Cycles
  cycles: LifeCycle[];
  currentCycle: LifeCycle | null;
  initCycle: () => Promise<void>;
  updateScore: (sectorId: string, value: number, note?: string) => Promise<void>;
  updateCycleScore: (cycleId: string, sectorId: string, value: number, note?: string) => Promise<void>;
  updateCycleNote: (cycleId: string, note: string) => Promise<void>;
  completeCycle: () => Promise<void>;

  // Weekly pulses
  weeklyPulses: WeeklyPulse[];
  addWeeklyPulse: (cycleId: string, weekNumber: 1 | 2 | 3 | 4, scores: Record<string, number>, note?: string) => Promise<void>;
  getCurrentWeekNumber: () => 1 | 2 | 3 | 4 | null;
  hasWeeklyPulse: (cycleId: string, weekNumber: number) => boolean;
  getWeekStreak: () => number;

  // Check-ins
  checkins: DailyCheckin[];
  addCheckin: (mood: number, note?: string) => Promise<void>;
  getTodayCheckin: () => DailyCheckin | undefined;

  // Insights
  insights: Insight[];
  refreshInsights: () => void;

  // UI
  selectedSector: string | null;
  setSelectedSector: (id: string | null) => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useLifeBalanceStore = create<LifeBalanceStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  isHydrating: false,
  cycles: [],
  currentCycle: null,
  checkins: [],
  insights: [],
  weeklyPulses: [],
  selectedSector: null,

  // ─── Auth ────────────────────────────────────────────────────────────────

  login: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    // hydrateFromSupabase will be called by SupabaseAuthProvider via onAuthStateChange
  },

  register: async (email, password, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    // profile row is created by the handle_new_user DB trigger
    // session + hydration are handled by onAuthStateChange
  },

  logout: async () => {
    await supabase.auth.signOut();
    // Purge SW cache so the next user on this device sees no cached data
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage("CLEAR_CACHE")).catch(() => {});
    }
    get().resetStore();
  },

  resetStore: () => {
    set({
      user: null,
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      cycles: [],
      currentCycle: null,
      checkins: [],
      insights: [],
      weeklyPulses: [],
      selectedSector: null,
    });
  },

  hydrateFromSupabase: async (userId) => {
    set({ isHydrating: true });
    try {
      // Parallel fetch: profile + cycles + pulses + checkins
      const [profileRes, cyclesRes, pulsesRes, checkinsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("cycles").select("*").eq("user_id", userId).order("start_date", { ascending: false }).limit(60),
        supabase
          .from("weekly_pulses")
          .select("*, cycles!inner(user_id)")
          .eq("cycles.user_id", userId)
          .limit(240),
        supabase.from("daily_checkins").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(90),
      ]);

      const profileRow = profileRes.data;
      const prefs = (profileRow?.preferences as UserProfile["preferences"] | null) ?? buildDefaultPrefs();

      const user: UserProfile = {
        id: userId,
        email: profileRow?.email ?? "",
        name: profileRow?.name ?? undefined,
        avatar: profileRow?.avatar ?? undefined,
        createdAt: profileRow?.created_at ?? new Date().toISOString(),
        streakDays: profileRow?.streak_days ?? 0,
        lastCheckinDate: profileRow?.last_checkin_date ?? undefined,
        preferences: prefs,
      };

      const cycles = (cyclesRes.data ?? []).map(rowToCycle);
      const currentCycle = cycles.find((c) => !c.completedAt) ?? null;
      const weeklyPulses = (pulsesRes.data ?? []).map(rowToWeeklyPulse);
      const checkins = (checkinsRes.data ?? []).map(rowToCheckin);
      const hasCompletedOnboarding = cycles.length > 0;

      set({
        user,
        isAuthenticated: true,
        hasCompletedOnboarding,
        cycles,
        currentCycle,
        weeklyPulses,
        checkins,
        isHydrating: false,
      });

      get().refreshInsights();
    } catch (err) {
      devLog("[store] hydrateFromSupabase error", err);
      set({ isHydrating: false });
    }
  },

  updateUser: async (patch) => {
    const { user } = get();
    if (!user) return;
    const optimistic = { ...user, ...patch };
    set({ user: optimistic });

    const dbPatch: {
      name?: string | null;
      email?: string | null;
      avatar?: string | null;
      streak_days?: number;
      last_checkin_date?: string | null;
      preferences?: Json;
    } = {};
    if (patch.name !== undefined) dbPatch.name = patch.name ?? null;
    if (patch.email !== undefined) dbPatch.email = patch.email ?? null;
    if (patch.avatar !== undefined) dbPatch.avatar = patch.avatar ?? null;
    if (patch.streakDays !== undefined) dbPatch.streak_days = patch.streakDays;
    if (patch.lastCheckinDate !== undefined) dbPatch.last_checkin_date = patch.lastCheckinDate ?? null;
    if (patch.preferences !== undefined) dbPatch.preferences = patch.preferences as unknown as Json;

    const { error } = await supabase.from("profiles").update(dbPatch).eq("id", user.id);
    if (error) {
      devLog("[store] updateUser error", error);
      set({ user }); // rollback
    }
  },

  // ─── Onboarding ──────────────────────────────────────────────────────────

  completeOnboarding: async (scores) => {
    const { user, cycles, weeklyPulses } = get();
    if (!user) return;
    const now = new Date();

    const existing = cycles.find((c) => !c.completedAt);

    if (existing) {
      // Update existing uncompleted cycle
      const updatedScores: Record<string, SectorScore> = {};
      Object.entries(scores).forEach(([id, value]) => {
        updatedScores[id] = { id, value, updatedAt: now.toISOString() };
      });
      const updated: LifeCycle = { ...existing, scores: updatedScores };
      set((state) => ({
        cycles: state.cycles.map((c) => (c.id === existing.id ? updated : c)),
        currentCycle: updated,
        hasCompletedOnboarding: true,
      }));

      await supabase.from("cycles").update({ scores: updatedScores as unknown as Json }).eq("id", existing.id);

      const hasWeek1 = weeklyPulses.some((p) => p.cycleId === existing.id && p.weekNumber === 1);
      if (!hasWeek1) {
        const week1: WeeklyPulse = {
          id: crypto.randomUUID(),
          cycleId: existing.id,
          weekNumber: 1,
          scores: { ...scores },
          createdAt: existing.startDate,
        };
        set((state) => ({ weeklyPulses: [...state.weeklyPulses, week1] }));
        await supabase.from("weekly_pulses").upsert({
          id: week1.id,
          cycle_id: existing.id,
          week_number: 1,
          scores: scores as unknown as Json,
          created_at: existing.startDate,
        });
      }
      get().refreshInsights();
      return;
    }

    // Create fresh cycle
    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    const sectorScores: Record<string, SectorScore> = {};
    Object.entries(scores).forEach(([id, value]) => {
      sectorScores[id] = { id, value, updatedAt: now.toISOString() };
    });

    const { data: cycleRow, error: cycleErr } = await supabase
      .from("cycles")
      .insert({
        user_id: user.id,
        start_date: now.toISOString(),
        end_date: end.toISOString(),
        scores: sectorScores as unknown as Json,
        label: now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
      })
      .select()
      .single();

    if (cycleErr || !cycleRow) {
      devLog("[store] completeOnboarding insert cycle error", cycleErr);
      return;
    }

    const newCycle = rowToCycle(cycleRow);

    const week1Pulse: WeeklyPulse = {
      id: crypto.randomUUID(),
      cycleId: newCycle.id,
      weekNumber: 1,
      scores: { ...scores },
      createdAt: now.toISOString(),
    };

    await supabase.from("weekly_pulses").upsert({
      id: week1Pulse.id,
      cycle_id: newCycle.id,
      week_number: 1,
      scores: scores as unknown as Json,
      created_at: now.toISOString(),
    });

    set((state) => ({
      cycles: [newCycle, ...state.cycles],
      currentCycle: newCycle,
      hasCompletedOnboarding: true,
      weeklyPulses: [...state.weeklyPulses, week1Pulse],
    }));
    get().refreshInsights();
  },

  // ─── Cycles ──────────────────────────────────────────────────────────────

  initCycle: async () => {
    const { user, cycles } = get();
    if (!user) return;

    const now = new Date();
    const active = cycles.find((c) => {
      return !c.completedAt && new Date(c.endDate) > now;
    });

    if (active) {
      set({ currentCycle: active });
      return;
    }

    const cycleData = createNewCycleObj(user.id);
    const { data: cycleRow, error } = await supabase
      .from("cycles")
      .insert({
        user_id: user.id,
        start_date: cycleData.startDate,
        end_date: cycleData.endDate,
        scores: cycleData.scores as unknown as Json,
        label: cycleData.label,
      })
      .select()
      .single();

    if (error || !cycleRow) {
      devLog("[store] initCycle error", error);
      return;
    }
    const newCycle = rowToCycle(cycleRow);
    set((state) => ({
      cycles: [newCycle, ...state.cycles],
      currentCycle: newCycle,
    }));
  },

  updateScore: async (sectorId, value, note) => {
    const { currentCycle } = get();
    if (!currentCycle) return;

    const prev = currentCycle.scores[sectorId];
    const updated: LifeCycle = {
      ...currentCycle,
      scores: {
        ...currentCycle.scores,
        [sectorId]: {
          id: sectorId,
          value,
          note: note !== undefined ? note : prev?.note,
          updatedAt: new Date().toISOString(),
        },
      },
    };
    set((state) => ({
      currentCycle: updated,
      cycles: state.cycles.map((c) => (c.id === updated.id ? updated : c)),
    }));

    const { error } = await supabase
      .from("cycles")
      .update({ scores: updated.scores as unknown as Json })
      .eq("id", currentCycle.id);

    if (error) {
      devLog("[store] updateScore error", error);
      set((state) => ({
        currentCycle: state.cycles.find((c) => c.id === currentCycle.id) ?? state.currentCycle,
      }));
    } else {
      get().refreshInsights();
    }
  },

  updateCycleScore: async (cycleId, sectorId, value, note) => {
    const { cycles } = get();
    const cycle = cycles.find((c) => c.id === cycleId);
    if (!cycle) return;

    const prev = cycle.scores[sectorId];
    const updatedScores = {
      ...cycle.scores,
      [sectorId]: {
        id: sectorId,
        value,
        note: note !== undefined ? note : prev?.note,
        updatedAt: new Date().toISOString(),
      },
    };
    const updated = { ...cycle, scores: updatedScores };
    set((state) => ({
      cycles: state.cycles.map((c) => (c.id === cycleId ? updated : c)),
      currentCycle: state.currentCycle?.id === cycleId ? updated : state.currentCycle,
    }));

    const { error } = await supabase
      .from("cycles")
      .update({ scores: updatedScores as unknown as Json })
      .eq("id", cycleId);

    if (error) devLog("[store] updateCycleScore error", error);
  },

  updateCycleNote: async (cycleId, note) => {
    set((state) => {
      const cycles = state.cycles.map((c) => (c.id === cycleId ? { ...c, notes: note } : c));
      const currentCycle =
        state.currentCycle?.id === cycleId ? { ...state.currentCycle, notes: note } : state.currentCycle;
      return { cycles, currentCycle };
    });

    const { error } = await supabase.from("cycles").update({ notes: note }).eq("id", cycleId);
    if (error) devLog("[store] updateCycleNote error", error);
  },

  completeCycle: async () => {
    const { currentCycle, user } = get();
    if (!currentCycle || !user) return;
    const now = new Date().toISOString();

    const completed = { ...currentCycle, completedAt: now };
    set((state) => ({
      cycles: state.cycles.map((c) => (c.id === completed.id ? completed : c)),
    }));

    await supabase.from("cycles").update({ completed_at: now }).eq("id", currentCycle.id);

    // Create next cycle
    await get().initCycle();
  },

  // ─── Weekly pulses ───────────────────────────────────────────────────────

  addWeeklyPulse: async (cycleId, weekNumber, scores, note) => {
    const pulse: WeeklyPulse = {
      id: crypto.randomUUID(),
      cycleId,
      weekNumber,
      scores,
      note,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      weeklyPulses: [
        ...state.weeklyPulses.filter(
          (p) => !(p.cycleId === cycleId && p.weekNumber === weekNumber)
        ),
        pulse,
      ],
    }));

    const { error } = await supabase.from("weekly_pulses").upsert(
      {
        id: pulse.id,
        cycle_id: cycleId,
        week_number: weekNumber,
        scores: scores as unknown as Json,
        note: note ?? null,
        created_at: pulse.createdAt,
      },
      { onConflict: "cycle_id,week_number" }
    );
    if (error) devLog("[store] addWeeklyPulse error", error);
  },

  getCurrentWeekNumber: () => {
    const { currentCycle } = get();
    if (!currentCycle) return null;
    const start = new Date(currentCycle.startDate).getTime();
    const daysPassed = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
    if (daysPassed < 7) return 1;
    if (daysPassed < 14) return 2;
    if (daysPassed < 21) return 3;
    return 4;
  },

  hasWeeklyPulse: (cycleId, weekNumber) => {
    return get().weeklyPulses.some((p) => p.cycleId === cycleId && p.weekNumber === weekNumber);
  },

  getWeekStreak: () => {
    const { weeklyPulses, cycles, currentCycle } = get();

    const weekKey = (d: Date) => {
      const u = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      const dow = u.getUTCDay() || 7;
      u.setUTCDate(u.getUTCDate() + 4 - dow);
      const yearStart = new Date(Date.UTC(u.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((u.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${u.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
    };

    const active = new Set<string>();
    weeklyPulses.forEach((p) => active.add(weekKey(new Date(p.createdAt))));
    cycles.forEach((c) => {
      active.add(weekKey(new Date(c.startDate)));
      if (c.completedAt) active.add(weekKey(new Date(c.completedAt)));
    });
    if (currentCycle) {
      Object.values(currentCycle.scores).forEach((s) =>
        active.add(weekKey(new Date(s.updatedAt)))
      );
    }

    if (active.size === 0) return 0;

    const cursor = new Date();
    if (!active.has(weekKey(cursor))) {
      cursor.setDate(cursor.getDate() - 7);
      if (!active.has(weekKey(cursor))) return 0;
    }

    let streak = 0;
    while (active.has(weekKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 7);
    }
    return streak;
  },

  // ─── Check-ins ───────────────────────────────────────────────────────────

  addCheckin: async (mood, note) => {
    const { user } = get();
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    const checkin: DailyCheckin = {
      id: crypto.randomUUID(),
      userId: user.id,
      date: today,
      mood,
      note,
    };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = user.lastCheckinDate === yesterday.toISOString().split("T")[0];
    const streak = wasYesterday ? (user.streakDays ?? 0) + 1 : 1;

    set((state) => ({
      checkins: [...state.checkins.filter((c) => c.date !== today), checkin],
      user: state.user ? { ...state.user, streakDays: streak, lastCheckinDate: today } : null,
    }));

    const [, profileErr] = await Promise.all([
      supabase.from("daily_checkins").upsert(
        { id: checkin.id, user_id: user.id, date: today, mood, note: note ?? null },
        { onConflict: "user_id,date" }
      ),
      supabase.from("profiles").update({ streak_days: streak, last_checkin_date: today }).eq("id", user.id),
    ]).then(([c, p]) => [c.error, p.error]);

    if (profileErr) devLog("[store] addCheckin profile update error", profileErr);
  },

  getTodayCheckin: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().checkins.find((c) => c.date === today);
  },

  // ─── Insights ────────────────────────────────────────────────────────────

  refreshInsights: () => {
    const { currentCycle, user } = get();
    if (!currentCycle) return;
    const insights = generateInsights(currentCycle.scores, user?.preferences?.language);
    set({ insights });
  },

  setSelectedSector: (id) => set({ selectedSector: id }),
}));
