"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import fr from "@/locales/fr.json";
import en from "@/locales/en.json";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export type Lang = "fr" | "en";
export const SUPPORTED_LANGS: Lang[] = ["fr", "en"];
export const DEFAULT_LANG: Lang = "fr";

const dictionaries: Record<Lang, typeof fr> = { fr, en };

// ─────────────────────────────────────────────────────────────────────────────
// pickLang — helper for backend records with title_fr / title_en fields
// ─────────────────────────────────────────────────────────────────────────────
export function pickLang<T extends Record<string, unknown>>(
  record: T,
  field: string,
  lang: Lang,
  fallback: Lang = DEFAULT_LANG
): string {
  return (
    (record[`${field}_${lang}`] as string) ||
    (record[`${field}_${fallback}`] as string) ||
    (record[field] as string) ||
    ""
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Nested dot-path resolver — t("hero.title") → string
// ─────────────────────────────────────────────────────────────────────────────
function resolve(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────
interface I18nContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Returns a string for scalar keys, or the raw value (array/object) for compound keys */
  t: (path: string) => string;
  /** Returns the raw value at path (string, array, object…) */
  tRaw: (path: string) => unknown;
  /** Pick a localised field from a backend record */
  pick: <T extends Record<string, unknown>>(record: T, field: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("reaagess_lang") as Lang | null;
      if (stored && SUPPORTED_LANGS.includes(stored)) setLangState(stored);
    } catch {
      // localStorage not available (SSR, private mode)
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("reaagess_lang", l);
    } catch {}
  }, []);

  const dict = dictionaries[lang] as unknown as Record<string, unknown>;

  const tRaw = useCallback(
    (path: string): unknown => resolve(dict, path),
    [dict]
  );

  const t = useCallback(
    (path: string): string => {
      const val = resolve(dict, path);
      if (typeof val === "string") return val;
      return path; // fallback: return the key itself
    },
    [dict]
  );

  const pick = useCallback(
    <T extends Record<string, unknown>>(record: T, field: string): string =>
      pickLang(record, field, lang),
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tRaw, pick }}>
      {children}
    </I18nContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
