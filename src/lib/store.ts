"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LifeCycle, UserProfile, DailyCheckin, Insight, SectorScore } from "@/types";
import { SECTORS } from "@/lib/sectors";
import { generateInsights } from "@/lib/insights";

function createNewCycle(userId: string): LifeCycle {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  const scores: Record<string, SectorScore> = {};
  SECTORS.forEach((s) => {
    scores[s.id] = {
      id: s.id,
      value: 5,
      updatedAt: now.toISOString(),
    };
  });

  return {
    id: crypto.randomUUID(),
    userId,
    startDate: now.toISOString(),
    endDate: end.toISOString(),
    scores,
    label: now.toLocaleDateString("ru-RU", { month: "long", year: "numeric" }),
  };
}

interface LifeBalanceStore {
  // Auth (mock)
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<UserProfile>) => void;

  // Cycles
  cycles: LifeCycle[];
  currentCycle: LifeCycle | null;
  initCycle: () => void;
  updateScore: (sectorId: string, value: number, note?: string) => void;
  completeCycle: () => void;

  // Check-ins
  checkins: DailyCheckin[];
  addCheckin: (mood: number, note?: string) => void;
  getTodayCheckin: () => DailyCheckin | undefined;

  // Insights
  insights: Insight[];
  refreshInsights: () => void;

  // UI
  selectedSector: string | null;
  setSelectedSector: (id: string | null) => void;
}

export const useLifeBalanceStore = create<LifeBalanceStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      cycles: [],
      currentCycle: null,
      checkins: [],
      insights: [],
      selectedSector: null,

      login: (email, name) => {
        const existing = get().user;
        const user: UserProfile = existing ?? {
          id: crypto.randomUUID(),
          email,
          name: name ?? email.split("@")[0],
          createdAt: new Date().toISOString(),
          streakDays: 0,
          preferences: {
            theme: "system",
            notifications: true,
            reminderDay: 1,
          },
        };
        set({ user, isAuthenticated: true });
        // init cycle if none
        if (!get().currentCycle) {
          get().initCycle();
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (patch) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...patch } : null,
        })),

      initCycle: () => {
        const { user, cycles } = get();
        if (!user) return;

        const now = new Date();
        // Check if we have an active cycle (started < 30 days ago)
        const active = cycles.find((c) => {
          const end = new Date(c.endDate);
          return end > now;
        });

        if (active) {
          set({ currentCycle: active });
        } else {
          const newCycle = createNewCycle(user.id);
          set((state) => ({
            cycles: [...state.cycles, newCycle],
            currentCycle: newCycle,
          }));
        }
      },

      updateScore: (sectorId, value, note) => {
        set((state) => {
          if (!state.currentCycle) return state;
          const updated: LifeCycle = {
            ...state.currentCycle,
            scores: {
              ...state.currentCycle.scores,
              [sectorId]: {
                id: sectorId,
                value,
                note,
                updatedAt: new Date().toISOString(),
              },
            },
          };
          const cycles = state.cycles.map((c) =>
            c.id === updated.id ? updated : c
          );
          return { currentCycle: updated, cycles };
        });
        get().refreshInsights();
      },

      completeCycle: () => {
        const { currentCycle, user } = get();
        if (!currentCycle || !user) return;
        const completed: LifeCycle = {
          ...currentCycle,
          completedAt: new Date().toISOString(),
        };
        const newCycle = createNewCycle(user.id);
        set((state) => ({
          cycles: [...state.cycles.map((c) => (c.id === completed.id ? completed : c)), newCycle],
          currentCycle: newCycle,
        }));
      },

      addCheckin: (mood, note) => {
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
        // Update streak
        const lastDate = user.lastCheckinDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const wasYesterday = lastDate === yesterday.toISOString().split("T")[0];
        const streak = wasYesterday ? (user.streakDays ?? 0) + 1 : 1;

        set((state) => ({
          checkins: [...state.checkins.filter((c) => c.date !== today), checkin],
          user: state.user
            ? { ...state.user, streakDays: streak, lastCheckinDate: today }
            : null,
        }));
      },

      getTodayCheckin: () => {
        const today = new Date().toISOString().split("T")[0];
        return get().checkins.find((c) => c.date === today);
      },

      refreshInsights: () => {
        const { currentCycle } = get();
        if (!currentCycle) return;
        const insights = generateInsights(currentCycle.scores);
        set({ insights });
      },

      setSelectedSector: (id) => set({ selectedSector: id }),
    }),
    {
      name: "lifebalance-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        cycles: state.cycles,
        currentCycle: state.currentCycle,
        checkins: state.checkins,
        insights: state.insights,
      }),
    }
  )
);
