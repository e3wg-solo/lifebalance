import { SECTORS } from "@/lib/sectors";

const SECTOR_COLORS = SECTORS.map((s) => s.colorDark);

interface CelebrateOptions {
  origin?: { x: number; y: number };
  intensity?: "light" | "full";
}

export async function celebrate(opts: CelebrateOptions = {}) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const confetti = (await import("canvas-confetti")).default;
  const origin = opts.origin ?? { y: 0.7 };

  if (opts.intensity === "light") {
    confetti({
      particleCount: 40,
      spread: 55,
      origin,
      colors: SECTOR_COLORS,
      ticks: 150,
    });
    return;
  }

  // Full celebration — two bursts
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { x: 0.3, y: 0.65 },
    colors: SECTOR_COLORS,
  });
  setTimeout(() => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { x: 0.7, y: 0.65 },
      colors: SECTOR_COLORS,
    });
  }, 200);
}
