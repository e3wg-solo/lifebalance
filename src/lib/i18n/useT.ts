"use client";

import { useMemo } from "react";
import { useLifeBalanceStore } from "@/lib/store";
import { getTranslation, resolveLanguage, interpolate } from "./index";
import type { Translations } from "./ru";

type PathsToStringLeaves<T> = T extends string
  ? []
  : {
      [K in keyof T]: [K, ...PathsToStringLeaves<T[K]>];
    }[keyof T];

type Join<T extends (string | number)[]> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R extends (string | number)[]]
  ? `${F & string}.${Join<R>}`
  : string;

export type TranslationKey = Join<PathsToStringLeaves<Translations>>;

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export function useT() {
  const lang = useLifeBalanceStore((s) => s.user?.preferences?.language);
  const resolved = useMemo(() => resolveLanguage(lang), [lang]);
  const dict = useMemo(() => getTranslation(resolved), [resolved]);

  function t(key: string, vars?: Record<string, string | number>): string {
    const raw = getNestedValue(dict as unknown as Record<string, unknown>, key);
    return interpolate(raw, vars);
  }

  return { t, lang: resolved };
}
