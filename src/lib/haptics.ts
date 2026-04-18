import { useLifeBalanceStore } from "@/lib/store";

export type HapticKind = "light" | "medium" | "selection" | "success";

const PATTERNS: Record<HapticKind, number[]> = {
  light: [8],
  medium: [14],
  selection: [6],
  success: [12, 30, 12],
};

export function haptic(kind: HapticKind = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const hapticsEnabled = useLifeBalanceStore.getState().user?.preferences?.haptics ?? true;
  if (!hapticsEnabled) return;
  navigator.vibrate(PATTERNS[kind]);
}
