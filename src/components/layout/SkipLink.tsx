"use client";

import { useI18n } from "@/i18n/provider";

export function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-md focus:bg-dc-green focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-dc-black"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
