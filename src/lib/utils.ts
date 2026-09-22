import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Severity } from "@/types/domain";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export function timeAgo(iso: string | number, reference: number = Date.now()): string {
  const then = typeof iso === "number" ? iso : new Date(iso).getTime();
  const diff = Math.max(0, reference - then);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function formatDate(iso: string, locale = "en-GB"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const severityVar: Record<Severity, string> = {
  critical: "var(--sev-critical)",
  high: "var(--sev-high)",
  medium: "var(--sev-medium)",
  low: "var(--sev-low)",
  info: "var(--sev-info)",
};

export const severityClasses: Record<Severity, string> = {
  critical: "text-[color:var(--sev-critical)] border-[color:var(--sev-critical)]/40 bg-[color:var(--sev-critical)]/10",
  high: "text-[color:var(--sev-high)] border-[color:var(--sev-high)]/40 bg-[color:var(--sev-high)]/10",
  medium: "text-[color:var(--sev-medium)] border-[color:var(--sev-medium)]/40 bg-[color:var(--sev-medium)]/10",
  low: "text-[color:var(--sev-low)] border-[color:var(--sev-low)]/40 bg-[color:var(--sev-low)]/10",
  info: "text-[color:var(--sev-info)] border-[color:var(--sev-info)]/40 bg-[color:var(--sev-info)]/10",
};

export const severityGlyph: Record<Severity, string> = {
  critical: "▲",
  high: "◆",
  medium: "■",
  low: "●",
  info: "○",
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}
