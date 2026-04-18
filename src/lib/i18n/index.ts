import { ru } from "./ru";
import { en } from "./en";
export type { Translations } from "./ru";
export type { Language } from "@/types";

export const translations = { ru, en } as const;

export function getTranslation(lang: "ru" | "en") {
  return translations[lang] ?? translations.ru;
}

/**
 * Resolve effective language: "system" → detect from navigator, default ru
 */
export function resolveLanguage(pref: string | undefined): "ru" | "en" {
  if (pref === "ru") return "ru";
  if (pref === "en") return "en";
  // system or undefined → detect
  if (typeof navigator !== "undefined") {
    const nav = navigator.language ?? "";
    return nav.startsWith("ru") ? "ru" : "en";
  }
  return "ru";
}

/**
 * Interpolate {key} placeholders in a string
 */
export function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
