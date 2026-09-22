"use client";

import type { ReactNode } from "react";
import { cn, severityVar } from "@/lib/utils";
import type { Severity } from "@/types/domain";
import { useI18n } from "@/i18n/provider";

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("dc-card p-4", className)}>
      {(title || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-dc-green">{title}</h3>
          )}
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Sparkline({ data, color = "#00ff88" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 28 - ((value - min) / range) * 24;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-7 w-full" aria-hidden="true">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function SeverityPill({ severity, label }: { severity: Severity; label: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
      style={{
        color: severityVar[severity],
        borderColor: `${severityVar[severity]}55`,
        background: `${severityVar[severity]}18`,
      }}
    >
      {label}
    </span>
  );
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-1.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
            value === option.value
              ? "border-dc-green/50 bg-dc-green/12 text-dc-green"
              : "border-dc-border text-dc-muted hover:border-dc-green/30 hover:text-dc-text",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-dc-border py-10 text-center">
      <span className="font-mono text-[11px] uppercase tracking-widest text-dc-muted-2">
        {message ?? t("common.empty")}
      </span>
    </div>
  );
}

export function DataTable({
  headers,
  children,
  caption,
}: {
  headers: string[];
  children: ReactNode;
  caption: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-start text-[12.5px]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-dc-border">
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-3 py-2 text-start font-mono text-[10px] uppercase tracking-wider text-dc-muted-2"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dc-border/60">{children}</tbody>
      </table>
    </div>
  );
}
