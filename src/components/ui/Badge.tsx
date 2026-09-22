import type { ReactNode } from "react";
import { cn, severityClasses, severityGlyph } from "@/lib/utils";
import type { Severity } from "@/types/domain";

export function Chip({
  children,
  className,
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span className={cn("dc-chip", className)}>
      {icon}
      {children}
    </span>
  );
}

export function SeverityBadge({
  severity,
  label,
  className,
}: {
  severity: Severity;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em]",
        severityClasses[severity],
        className,
      )}
      title={label}
    >
      <span aria-hidden="true">{severityGlyph[severity]}</span>
      {label}
    </span>
  );
}

export function StatusDot({ severity, pulse = false }: { severity: Severity; pulse?: boolean }) {
  const color = `var(--sev-${severity})`;
  return (
    <span className="relative inline-flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
      <span
        className="absolute inset-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
      {pulse && (
        <span
          className="absolute inset-0 animate-dc-pulse rounded-full"
          style={{ background: color, opacity: 0.5 }}
        />
      )}
    </span>
  );
}

export function LiveBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-dc-green/40 bg-dc-green/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-dc-green">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-dc-green opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-dc-green" />
      </span>
      {label}
    </span>
  );
}
