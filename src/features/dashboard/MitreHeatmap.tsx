"use client";

import { mitreHeatmap } from "@/data/mock";
import { useI18n } from "@/i18n/provider";
import { severityVar } from "@/lib/utils";
import type { Severity } from "@/types/domain";

const severityKeys: Record<Severity, string> = {
  critical: "visibility.legendCritical",
  high: "visibility.legendHigh",
  medium: "visibility.legendMedium",
  low: "visibility.legendLow",
  info: "visibility.legendInfo",
};

const tactics = Array.from(new Set(mitreHeatmap.map((cell) => cell.tactic)));

export function MitreHeatmap() {
  const { t } = useI18n();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-separate border-spacing-1">
        <caption className="sr-only">{t("dashboard.mitreHeatmap")}</caption>
        <thead>
          <tr>
            <th scope="col" className="w-32" />
            {[0, 1, 2, 3].map((col) => (
              <th
                key={col}
                scope="col"
                className="pb-1 text-start font-mono text-[9px] uppercase tracking-wider text-dc-muted-2"
              >
                T{col + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tactics.map((tactic) => (
            <tr key={tactic}>
              <th
                scope="row"
                className="pe-2 text-end font-mono text-[10px] font-normal leading-tight text-dc-muted"
              >
                {tactic}
              </th>
              {mitreHeatmap
                .filter((cell) => cell.tactic === tactic)
                .map((cell) => (
                  <td key={cell.technique}>
                    <div
                      className="flex h-8 items-center justify-center rounded border text-[10px] font-mono"
                      style={{
                        background: `${severityVar[cell.severity]}22`,
                        borderColor: `${severityVar[cell.severity]}66`,
                        color: severityVar[cell.severity],
                      }}
                      title={`${cell.technique} · ${cell.count} · ${t(severityKeys[cell.severity])}`}
                    >
                      {cell.count}
                    </div>
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
