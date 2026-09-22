"use client";

import { useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Download, RefreshCw } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useToast } from "@/components/ui/Toast";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { DashboardRepository, StatisticsService } from "@/services/repositories";
import { cn, formatNumber } from "@/lib/utils";
import { Sparkline } from "@/features/dashboard/parts";
import {
  AssetsTab,
  AutomationTab,
  ComplianceTab,
  IdentitiesTab,
  IncidentsTab,
  IntegrationsTab,
  IntelligenceTab,
  OverviewTab,
  ReportsTab,
  SettingsTab,
  ThreatsTab,
} from "@/features/dashboard/tabs";

const tabKeys = [
  "overview",
  "threats",
  "incidents",
  "intelligence",
  "compliance",
  "assets",
  "identities",
  "reports",
  "automation",
  "integrations",
  "settings",
] as const;

type TabKey = (typeof tabKeys)[number];

export function DashboardPreview() {
  const { t, dict } = useI18n();
  const { toast } = useToast();
  const [tab, setTab] = useState<TabKey>("overview");
  const [refreshKey, setRefreshKey] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const kpis = DashboardRepository.kpis();

  const onTabKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabKeys.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabKeys.length) % tabKeys.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabKeys.length - 1;
    else return;
    event.preventDefault();
    setTab(tabKeys[next]!);
    tabRefs.current[next]?.focus();
  };

  const exportData = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      tab,
      statistics: StatisticsService.headlineCounts(),
      severity: StatisticsService.severityBreakdown(),
      threats: DashboardRepository.kpis(),
      compliance: DashboardRepository.integrations().length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dark-coders-${tab}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast(t("dashboard.export"));
  };

  const renderTab = () => {
    switch (tab) {
      case "overview":
        return <OverviewTab key={`overview-${refreshKey}`} />;
      case "threats":
        return <ThreatsTab />;
      case "incidents":
        return <IncidentsTab />;
      case "intelligence":
        return <IntelligenceTab />;
      case "compliance":
        return <ComplianceTab />;
      case "assets":
        return <AssetsTab />;
      case "identities":
        return <IdentitiesTab />;
      case "reports":
        return <ReportsTab />;
      case "automation":
        return <AutomationTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <section id="dashboard" className="scroll-mt-24 py-20 lg:py-28">
      <div className="dc-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading label={t("dashboard.label")} title={t("dashboard.title")} subtitle={t("dashboard.subtitle")} />
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setRefreshKey((k) => k + 1);
                toast(t("toast.actionComplete"));
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t("dashboard.refresh")}
            </Button>
            <Button size="sm" onClick={exportData}>
              <Download className="h-3.5 w-3.5" />
              {t("dashboard.export")}
            </Button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[20px] border border-dc-border bg-dc-bg/70">
          <div
            role="tablist"
            aria-label={t("dashboard.label")}
            className="flex gap-1 overflow-x-auto border-b border-dc-border bg-dc-surface/60 p-2"
          >
            {tabKeys.map((key, index) => (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                id={`tab-${key}`}
                aria-selected={tab === key}
                aria-controls={`panel-${key}`}
                tabIndex={tab === key ? 0 : -1}
                onClick={() => setTab(key)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                className={cn(
                  "shrink-0 rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors",
                  tab === key
                    ? "bg-dc-green/12 text-dc-green"
                    : "text-dc-muted hover:bg-dc-green/5 hover:text-dc-text",
                )}
              >
                {dict.dashboard.tabs[key]}
              </button>
            ))}
          </div>

          <div className="p-4 lg:p-5">
            <dl className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <div key={kpi.id} className="rounded-xl border border-dc-border bg-dc-surface/40 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <dt className="text-[11px] uppercase tracking-wider text-dc-muted">
                      {t(kpi.labelKey)}
                    </dt>
                    <span
                      className={cn(
                        "inline-flex items-center gap-0.5 font-mono text-[10px]",
                        kpi.trend === "up" && kpi.severity !== "critical"
                          ? "text-dc-green"
                          : kpi.trend === "up"
                            ? "text-[color:var(--sev-critical)]"
                            : "text-dc-green",
                      )}
                    >
                      {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.deltaPct > 0 ? "+" : ""}
                      {kpi.deltaPct}%
                    </span>
                  </div>
                  <dd dir="ltr" className="mt-1.5 text-2xl font-extrabold tracking-tight text-dc-text">
                    {formatNumber(kpi.value)}
                    {kpi.suffix && <span className="text-sm text-dc-muted">{kpi.suffix}</span>}
                  </dd>
                  <Sparkline data={kpi.series} color={kpi.trend === "up" && kpi.severity === "critical" ? "#ff3b5c" : "#00ff88"} />
                </div>
              ))}
            </dl>

            <div
              role="tabpanel"
              id={`panel-${tab}`}
              aria-labelledby={`tab-${tab}`}
              tabIndex={0}
              className="focus-visible:outline-none"
            >
              {renderTab()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
