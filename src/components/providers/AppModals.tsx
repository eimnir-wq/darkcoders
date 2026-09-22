"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthModal, type AuthMode } from "@/features/auth/AuthModal";
import { SearchDialog } from "@/components/layout/SearchDialog";

interface AppModalsValue {
  openAuth: (mode: AuthMode) => void;
  openSearch: () => void;
}

const AppModalsContext = createContext<AppModalsValue | null>(null);

export function AppModalsProvider({ children }: { children: ReactNode }) {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const openAuth = useCallback((mode: AuthMode) => setAuthMode(mode), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(() => ({ openAuth, openSearch }), [openAuth, openSearch]);

  return (
    <AppModalsContext.Provider value={value}>
      {children}
      <SearchDialog key={searchOpen ? "search-open" : "search-closed"} open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </AppModalsContext.Provider>
  );
}

export function useAppModals() {
  const ctx = useContext(AppModalsContext);
  if (!ctx) throw new Error("useAppModals must be used within AppModalsProvider");
  return ctx;
}
