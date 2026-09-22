"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { WorldThreatMap } from "@/features/threat-intelligence/WorldThreatMap";
import { TopThreatsPanel } from "@/features/threat-intelligence/TopThreatsPanel";
import { heroStats } from "@/data/mock";
import { formatNumber, severityVar } from "@/lib/utils";
import type { GeoThreatNode, Severity } from "@/types/domain";

const legendKeys: Array<{ severity: Severity; key: string }> = [
  { severity: "critical", key: "visibility.legendCritical" },
  { severity: "high", key: "visibility.legendHigh" },
  { severity: "medium", key: "visibility.legendMedium" },
  { severity: "low", key: "visibility.legendLow" },
  { severity: "info", key: "visibility.legendInfo" },
];

export function GlobalThreatMap() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<GeoThreatNode | null>(null);

  const stats = [
    { value: "250M+", label: t("metrics.iocs") },
    { value: "180+", label: t("metrics.countries") },
    { value: "50+", label: t("metrics.feeds") },
    { value: "<1s", label: t("metrics.detection") },
  ];

  return (
    <section id="visibility" className="relative scroll-mt-24 overflow-hidden border-y border-dc-border bg-dc-bg py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 dc-grid-bg opacity-40" aria-hidden="true" />
      <div className="dc-container relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <SectionHeading
              label={t("visibility.label")}
              title={
                <>
                  {t("visibility.title1")}
                  <br />
                  <span className="text-dc-green">{t("visibility.title2")}</span>
                </>
              }
              subtitle={t("visibility.subtitle")}
            />

            <Reveal className="mt-8">
              <div className="relative overflow-hidden rounded-[20px] border border-dc-border bg-dc-black/60">
                <div className="aspect-[2/1] w-full">
                  <WorldThreatMap selectedId={selected?.id ?? null} onSelect={setSelected} />
                </div>

                <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-2 p-4">
                  <span className="dc-chip pointer-events-auto">
                    {t("visibility.mapLegend")} · {heroStats.countriesMonitored}+ {t("visibility.nodes")}
                  </span>
                  <div className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-lg border border-dc-border bg-dc-black/70 px-3 py-1.5 backdrop-blur">
                    {legendKeys.map(({ severity, key }) => (
                      <span key={severity} className="flex items-center gap-1.5 text-[10px] text-dc-muted">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: severityVar[severity], boxShadow: `0 0 8px ${severityVar[severity]}` }}
                          aria-hidden="true"
                        />
                        {t(key)}
                      </span>
                    ))}
                  </div>
                </div>

                {selected && (
                  <div className="absolute bottom-4 start-4 w-[240px] rounded-xl border border-dc-border bg-dc-surface-2/95 p-3.5 backdrop-blur">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-dc-green">
                        {selected.country}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className="text-[10px] text-dc-muted hover:text-dc-green"
                        aria-label={t("common.close")}
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-dc-text">{selected.label}</p>
                    <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <dt className="text-dc-muted">{t("common.count")}</dt>
                        <dd dir="ltr" className="font-mono text-dc-text">{formatNumber(selected.count)}</dd>
                      </div>
                      <div>
                        <dt className="text-dc-muted">{t("common.category")}</dt>
                        <dd className="font-mono text-dc-text">{selected.vector}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </Reveal>

            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-dc-border bg-dc-surface/50 p-4">
                  <dd dir="ltr" className="text-2xl font-extrabold tracking-tight text-dc-text">{stat.value}</dd>
                  <dt className="mt-1 text-[11px] uppercase tracking-wider text-dc-muted">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <Reveal delay={0.1}>
            <TopThreatsPanel
              onViewMap={() => document.getElementById("visibility")?.scrollIntoView({ behavior: "smooth" })}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
