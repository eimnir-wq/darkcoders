"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  detectLocale,
  dirOf,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  t: (path: string, vars?: Record<string, string | number>) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolvePath(source: unknown, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
  return typeof value === "string" ? value : undefined;
}

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)dc\.locale=([^;]+)/);
  const value = match?.[1];
  return isLocale(value) ? value : null;
}

export function I18nProvider({
  children,
  initialLocale = defaultLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const stored =
        (typeof window !== "undefined" && window.localStorage.getItem(LOCALE_STORAGE_KEY)) || null;
      const fromCookie = readCookieLocale();
      if (isLocale(stored)) {
        setLocaleState((prev) => (stored === prev ? prev : stored));
        return;
      }
      if (fromCookie) {
        setLocaleState((prev) => (fromCookie === prev ? prev : fromCookie));
        return;
      }
      if (typeof navigator !== "undefined") {
        const detected = detectLocale(navigator.languages ?? [navigator.language]);
        setLocaleState((prev) => (detected === prev ? prev : detected));
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const dir = dirOf(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      document.cookie = `dc.locale=${locale};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* storage unavailable */
    }
  }, [locale]);

  const dict = useMemo(() => getDictionary(locale), [locale]);
  const dir = dirOf(locale);

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const raw = resolvePath(dict, path) ?? resolvePath(getDictionary(defaultLocale), path) ?? path;
      if (!vars) return raw;
      return Object.entries(vars).reduce(
        (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
        raw,
      );
    },
    [dict],
  );

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir, dict, t, setLocale }),
    [locale, dir, dict, t, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
