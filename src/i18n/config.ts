export const locales = [
  "en",
  "fr",
  "ar",
  "es",
  "de",
  "pt",
  "it",
  "nl",
  "tr",
  "zh",
  "ja",
  "ko",
  "ru",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export interface LocaleMeta {
  code: Locale;
  label: string;
  native: string;
  dir: "ltr" | "rtl";
  region: string;
}

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { code: "en", label: "English", native: "English", dir: "ltr", region: "Global" },
  fr: { code: "fr", label: "French", native: "Français", dir: "ltr", region: "France" },
  ar: { code: "ar", label: "Arabic", native: "العربية", dir: "rtl", region: "MENA" },
  es: { code: "es", label: "Spanish", native: "Español", dir: "ltr", region: "Spain" },
  de: { code: "de", label: "German", native: "Deutsch", dir: "ltr", region: "Germany" },
  pt: { code: "pt", label: "Portuguese", native: "Português", dir: "ltr", region: "Portugal" },
  it: { code: "it", label: "Italian", native: "Italiano", dir: "ltr", region: "Italy" },
  nl: { code: "nl", label: "Dutch", native: "Nederlands", dir: "ltr", region: "Netherlands" },
  tr: { code: "tr", label: "Turkish", native: "Türkçe", dir: "ltr", region: "Türkiye" },
  zh: { code: "zh", label: "Chinese", native: "中文", dir: "ltr", region: "China" },
  ja: { code: "ja", label: "Japanese", native: "日本語", dir: "ltr", region: "Japan" },
  ko: { code: "ko", label: "Korean", native: "한국어", dir: "ltr", region: "Korea" },
  ru: { code: "ru", label: "Russian", native: "Русский", dir: "ltr", region: "Russia" },
};

export const LOCALE_STORAGE_KEY = "dc.locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

/** Detect a supported locale from an Accept-Language header or navigator.languages. */
export function detectLocale(candidates: readonly string[]): Locale {
  for (const raw of candidates) {
    if (!raw) continue;
    const tag = raw.toLowerCase();
    const base = tag.split("-")[0];
    const match = locales.find((l) => l === base);
    if (match) return match;
  }
  return defaultLocale;
}
