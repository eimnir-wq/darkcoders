import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_STORAGE_KEY, type Locale } from "./config";

export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_STORAGE_KEY)?.value;
  return isLocale(value) ? value : defaultLocale;
}
