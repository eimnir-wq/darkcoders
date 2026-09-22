"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const select = (next: Locale) => {
    setLocale(next);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.selectLanguage")}
        className={cn(
          "inline-flex items-center gap-2 rounded-[10px] border border-transparent px-2.5 py-2 text-sm font-medium text-dc-muted transition-colors hover:border-dc-border hover:text-dc-text",
          compact && "px-2",
        )}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="font-mono text-[12px] uppercase tracking-widest">{locale}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={t("nav.selectLanguage")}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="absolute end-0 z-50 mt-2 max-h-[320px] w-56 overflow-auto rounded-xl border border-dc-border bg-dc-surface-2/98 p-1.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur"
          >
            {locales.map((code) => {
              const meta = localeMeta[code];
              const active = code === locale;
              return (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => select(code)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors",
                      active ? "bg-dc-green/10 text-dc-green" : "text-dc-text/85 hover:bg-dc-green/5",
                    )}
                  >
                    <span className="flex flex-col">
                      <span className="font-medium">{meta.native}</span>
                      <span className="text-[11px] text-dc-muted">{meta.label}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
