"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchIndex } from "@/config/nav";
import { ComplianceRepository } from "@/services/repositories";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

interface Result {
  label: string;
  desc?: string;
  href: string;
  category: string;
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const corpus = useMemo<Result[]>(() => {
    const base: Result[] = searchIndex.map((entry) => ({
      label: t(entry.labelKey),
      desc: entry.descKey ? t(entry.descKey) : undefined,
      href: entry.href,
      category: entry.category,
    }));
    const frameworks: Result[] = ComplianceRepository.list().map((f) => ({
      label: f.name,
      desc: `${f.coverage}% · ${f.controlsImplemented}/${f.controlsTotal}`,
      href: "#compliance",
      category: t("compliance.supported"),
    }));
    return [...base, ...frameworks];
  }, [t]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return corpus.slice(0, 8);
    return corpus
      .filter((item) => `${item.label} ${item.desc ?? ""} ${item.category}`.toLowerCase().includes(q))
      .slice(0, 10);
  }, [corpus, query]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (event.key === "Enter" && results[active]) {
        event.preventDefault();
        window.location.hash = results[active]!.href.replace("#", "");
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label={t("common.close")}
            className="absolute inset-0 cursor-default bg-dc-black/80 backdrop-blur-sm"
            onClick={onClose}
            tabIndex={-1}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.search")}
            initial={{ opacity: 0, y: -12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="dc-panel relative z-10 w-full max-w-xl overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-dc-border px-4">
              <Search className="h-4 w-4 shrink-0 text-dc-green" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder={t("nav.searchPlaceholder")}
                aria-label={t("nav.search")}
                className="h-14 w-full bg-transparent text-sm text-dc-text placeholder:text-dc-muted-2 focus:outline-none"
              />
              <kbd className="hidden rounded border border-dc-border px-1.5 py-0.5 font-mono text-[10px] text-dc-muted sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-dc-muted">{t("nav.searchNoResults")}</p>
              ) : (
                <ul className="flex flex-col gap-0.5">
                  {results.map((item, index) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setActive(index)}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors",
                          index === active ? "bg-dc-green/10" : "hover:bg-dc-green/5",
                        )}
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-sm font-medium text-dc-text">{item.label}</span>
                          {item.desc && (
                            <span className="truncate text-xs text-dc-muted">{item.desc}</span>
                          )}
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-dc-green/80">
                            {item.category}
                          </span>
                          {index === active && <CornerDownLeft className="h-3.5 w-3.5 text-dc-green" />}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-dc-border px-4 py-2.5 text-[11px] text-dc-muted">
              {t("nav.searchHint")}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
