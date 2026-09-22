"use client";

import { useI18n } from "@/i18n/provider";
import { ComplianceRepository } from "@/services/repositories";
import { cn } from "@/lib/utils";
import type { ComplianceFramework } from "@/types/domain";

const statusStyles: Record<ComplianceFramework["status"], string> = {
  compliant: "text-dc-green border-dc-green/40 bg-dc-green/10",
  "in-progress": "text-[color:var(--sev-low)] border-[color:var(--sev-low)]/40 bg-[color:var(--sev-low)]/10",
  attention: "text-[color:var(--sev-medium)] border-[color:var(--sev-medium)]/40 bg-[color:var(--sev-medium)]/10",
};

export function FrameworkTiles() {
  const { t } = useI18n();
  const frameworks = ComplianceRepository.list();

  const statusLabel = (status: ComplianceFramework["status"]) =>
    status === "compliant"
      ? t("compliance.statusCompliant")
      : status === "in-progress"
        ? t("compliance.statusInProgress")
        : t("compliance.statusAttention");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {frameworks.map((framework) => (
        <div
          key={framework.id}
          className="dc-card dc-card-hover flex flex-col gap-3 p-4"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-dc-border bg-dc-green/8 font-mono text-[10px] font-bold text-dc-green">
              {framework.shortName.slice(0, 3).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-dc-text">{framework.shortName}</span>
              <span className="block truncate text-[10px] text-dc-muted-2">{framework.name}</span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-dc-muted">
              <span>{t("compliance.coverage")}</span>
              <span className="font-mono text-dc-text">{framework.coverage}%</span>
            </div>
            <div
              className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-dc-border"
              role="progressbar"
              aria-valuenow={framework.coverage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${framework.shortName} ${t("compliance.coverage")}`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-dc-green-deep to-dc-green"
                style={{ width: `${framework.coverage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-dc-muted-2">
              {framework.controlsImplemented}/{framework.controlsTotal} {t("compliance.controls")}
            </span>
            <span
              className={cn(
                "rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                statusStyles[framework.status],
              )}
            >
              {statusLabel(framework.status)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
