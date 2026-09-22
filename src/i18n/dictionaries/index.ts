import { en, type Dictionary } from "./en";
import { fr } from "./fr";
import { ar } from "./ar";
import { es } from "./es";
import { de } from "./de";
import { pt } from "./pt";
import { it } from "./it";
import { nl } from "./nl";
import { tr } from "./tr";
import { zh } from "./zh";
import { ja } from "./ja";
import { ko } from "./ko";
import { ru } from "./ru";
import type { Locale } from "../config";
import type { PartialDictionary } from "../types";

export const dictionaries: Record<Locale, PartialDictionary> = {
  en,
  fr,
  ar,
  es,
  de,
  pt,
  it,
  nl,
  tr,
  zh,
  ja,
  ko,
  ru,
};

export function getDictionary(locale: Locale): Dictionary {
  return deepMerge(en as unknown as Record<string, unknown>, dictionaries[locale] as Record<string, unknown>) as unknown as Dictionary;
}

type Plain = Record<string, unknown>;

function isPlainObject(value: unknown): value is Plain {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T extends Plain, U extends Plain>(base: T, override: U): Plain {
  const out: Plain = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    const current = out[key];
    if (isPlainObject(current) && isPlainObject(value)) {
      out[key] = deepMerge(current, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export type { Dictionary };
