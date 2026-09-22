"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, X, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navItems, type NavItem } from "@/config/nav";
import { useI18n } from "@/i18n/provider";
import { useAppModals } from "@/components/providers/AppModals";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

function DesktopNavItem({ item }: { item: NavItem }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-dc-text/80 transition-colors hover:bg-dc-green/5 hover:text-dc-green"
        >
          {t(item.labelKey)}
        </Link>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
          open ? "bg-dc-green/5 text-dc-green" : "text-dc-text/80 hover:bg-dc-green/5 hover:text-dc-green",
        )}
      >
        {t(item.labelKey)}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.16 }}
            className="absolute start-0 top-full z-50 pt-2"
          >
            <ul
              className={cn(
                "dc-panel grid gap-1 p-2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)]",
                item.columns === 2 ? "w-[520px] grid-cols-2" : "w-[280px] grid-cols-1",
              )}
            >
              {item.children.map((child) => (
                <li key={`${child.labelKey}-${child.href}`}>
                  <Link
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-dc-green/8"
                  >
                    {child.icon && (
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-dc-border bg-dc-green/5 text-dc-green">
                        <DynamicIcon name={child.icon} className="h-4 w-4" />
                      </span>
                    )}
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-dc-text">{t(child.labelKey)}</span>
                      {child.descKey && (
                        <span className="line-clamp-2 text-xs leading-relaxed text-dc-muted">
                          {t(child.descKey)}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function SiteHeader() {
  const { t } = useI18n();
  const { openAuth, openSearch } = useAppModals();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("nav.platform");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[90] transition-all duration-300",
          scrolled
            ? "border-b border-dc-border bg-dc-black/85 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-dc-black/80 to-transparent",
        )}
      >
        <div className="dc-container flex h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3" aria-label="Dark Coders — Home">
              <Logo height={26} priority />
            </Link>
            <span className="hidden border-s border-dc-border ps-3 font-mono text-[10px] uppercase tracking-[0.22em] text-dc-green/70 2xl:inline">
              {t("footer.tagline")}
            </span>
          </div>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <DesktopNavItem key={item.labelKey} item={item} />
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              aria-label={t("nav.search")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-dc-muted transition-colors hover:bg-dc-green/5 hover:text-dc-green"
            >
              <Search className="h-4 w-4" />
            </button>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <button
              type="button"
              onClick={() => openAuth("login")}
              className="hidden h-9 items-center whitespace-nowrap rounded-lg px-3 text-sm font-medium text-dc-text/80 transition-colors hover:text-dc-green md:inline-flex"
            >
              {t("nav.login")}
            </button>
            <Button size="sm" className="hidden sm:inline-flex" onClick={() => openAuth("trial")}>
              {t("nav.trial")}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t("nav.menu")}
              aria-expanded={drawerOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-dc-text transition-colors hover:bg-dc-green/5 hover:text-dc-green lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[120] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={t("nav.closeMenu")}
              className="absolute inset-0 bg-dc-black/80 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
              tabIndex={-1}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={t("nav.menu")}
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute end-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-s border-dc-border bg-dc-surface/98 backdrop-blur-xl"
            >
              <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-dc-border px-4">
                <Logo height={22} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label={t("nav.closeMenu")}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-dc-muted hover:bg-dc-green/5 hover:text-dc-green"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-4">
                <ul className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const expanded = openSection === item.labelKey;
                    return (
                      <li key={item.labelKey} className="border-b border-dc-border/60 last:border-0">
                        {item.children ? (
                          <>
                            <button
                              type="button"
                              aria-expanded={expanded}
                              onClick={() => setOpenSection(expanded ? null : item.labelKey)}
                              className="flex w-full items-center justify-between py-3.5 text-start text-[15px] font-semibold text-dc-text"
                            >
                              {t(item.labelKey)}
                              <ChevronDown
                                className={cn("h-4 w-4 text-dc-green transition-transform", expanded && "rotate-180")}
                              />
                            </button>
                            <AnimatePresence initial={false}>
                              {expanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.24 }}
                                  className="overflow-hidden"
                                >
                                  {item.children.map((child) => (
                                    <li key={`${child.labelKey}-${child.href}`}>
                                      <Link
                                        href={child.href}
                                        onClick={() => setDrawerOpen(false)}
                                        className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-dc-muted transition-colors hover:bg-dc-green/5 hover:text-dc-text"
                                      >
                                        {child.icon && (
                                          <DynamicIcon name={child.icon} className="h-4 w-4 text-dc-green" />
                                        )}
                                        {t(child.labelKey)}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setDrawerOpen(false)}
                            className="block py-3.5 text-[15px] font-semibold text-dc-text"
                          >
                            {t(item.labelKey)}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5 flex flex-col gap-2.5">
                  <Button
                    size="lg"
                    onClick={() => {
                      setDrawerOpen(false);
                      openAuth("trial");
                    }}
                  >
                    {t("nav.trial")}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setDrawerOpen(false);
                      openAuth("login");
                    }}
                  >
                    {t("nav.login")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      setDrawerOpen(false);
                      openSearch();
                    }}
                  >
                    <Search className="h-4 w-4" />
                    {t("nav.search")}
                  </Button>
                </div>
              </nav>

              <div className="shrink-0 border-t border-dc-border p-4">
                <LanguageSwitcher />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
