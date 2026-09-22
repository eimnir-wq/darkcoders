"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { ThreatRepository } from "@/services/repositories";
import { StatusDot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";

const severityKey = {
  critical: "visibility.legendCritical",
  high: "visibility.legendHigh",
  medium: "visibility.legendMedium",
  low: "visibility.legendLow",
  info: "visibility.legendInfo",
} as const;

export function TopThreatsPanel({ onViewMap }: { onViewMap: () => void }) {
  const { t } = useI18n();
  const threats = ThreatRepository.top();

  return (
    <div className="dc-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-dc-green">
          {t("visibility.topThreats")}
        </h3>
        <span className="font-mono text-[10px] text-dc-muted-2">{threats.length}</span>
      </div>

      <ul className="mt-4 flex flex-col divide-y divide-dc-border">
        {threats.map((threat) => (
          <li key={threat.id} className="flex items-center gap-3 py-3">
            <StatusDot severity={threat.severity} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-dc-text">{threat.category}</span>
              <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-dc-muted-2">
                {t(severityKey[threat.severity])} · {threat.source}
              </span>
            </span>
            <span className="shrink-0 text-end">
              <span className="block font-mono text-[13px] font-semibold text-dc-text">
                {formatNumber(threat.count)}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 font-mono text-[10px] ${
                  threat.trend === "up"
                    ? "text-[color:var(--sev-critical)]"
                    : threat.trend === "down"
                      ? "text-dc-green"
                      : "text-dc-muted"
                }`}
              >
                {threat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                {threat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                {threat.trend === "flat" && <Minus className="h-3 w-3" />}
                {threat.changePct > 0 ? "+" : ""}
                {threat.changePct}%
              </span>
            </span>
          </li>
        ))}
      </ul>

      <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={onViewMap}>
        {t("common.viewLiveMap")}
        <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
      </Button>
    </div>
  );
}
