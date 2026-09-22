"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Download, Plug, PlugZap, Sparkles, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { StatusDot } from "@/components/ui/Badge";
import {
  AlertRepository,
  AssetRepository,
  ComplianceRepository,
  DashboardRepository,
  FeedRepository,
  IdentityRepository,
  IncidentRepository,
  IocRepository,
  ThreatRepository,
} from "@/services/repositories";
import { formatDate, formatNumber, timeAgo } from "@/lib/utils";
import type { Severity } from "@/types/domain";
import { DataTable, EmptyState, FilterChips, Panel, SeverityPill, Sparkline } from "@/features/dashboard/parts";
import { MitreHeatmap } from "@/features/dashboard/MitreHeatmap";

const ThreatActivityChart = dynamic(() => import("@/features/dashboard/ThreatActivityChart"), {
  ssr: false,
  loading: () => <div className="h-[240px] w-full animate-pulse rounded-lg bg-dc-green/5" />,
});

const severityKeys: Record<Severity, string> = {
  critical: "visibility.legendCritical",
  high: "visibility.legendHigh",
  medium: "visibility.legendMedium",
  low: "visibility.legendLow",
  info: "visibility.legendInfo",
};

/* ------------------------------- Overview ------------------------------ */

export function OverviewTab() {
  const { t, dict } = useI18n();
  const { toast } = useToast();
  const recent = ThreatRepository.list().slice(0, 5);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel title={t("dashboard.liveThreatActivity")} className="xl:col-span-2">
        <ThreatActivityChart />
      </Panel>

      <Panel title={t("dashboard.recentThreats")}>
        <ul className="flex flex-col divide-y divide-dc-border">
          {recent.map((threat) => (
            <li key={threat.id} className="flex items-center gap-2.5 py-2.5">
              <StatusDot severity={threat.severity} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] text-dc-text">{threat.category}</span>
                <span className="block font-mono text-[10px] text-dc-muted-2">
                  {threat.id} · {timeAgo(threat.detectedAt)}
                </span>
              </span>
              <span className="font-mono text-[11px] text-dc-text">{formatNumber(threat.count)}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title={t("dashboard.mitreHeatmap")} className="xl:col-span-2">
        <MitreHeatmap />
      </Panel>

      <Panel title={t("dashboard.aiSocAnalyst")}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-dc-green/40 bg-dc-green/10 text-dc-green">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-dc-green">
              {t("common.live")}
            </span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-dc-muted">{t("dashboard.analystNote")}</p>
          <Button size="sm" onClick={() => toast(t("dashboard.applyRecommendation"))}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {t("dashboard.applyRecommendation")}
          </Button>
          <dl className="grid grid-cols-2 gap-2 border-t border-dc-border pt-3 text-[11px]">
            <div>
              <dt className="text-dc-muted">{t("dashboard.meanTimeToRespond")}</dt>
              <dd className="font-mono text-dc-text">4m 12s</dd>
            </div>
            <div>
              <dt className="text-dc-muted">{t("dashboard.openIncidents")}</dt>
              <dd className="font-mono text-dc-text">{IncidentRepository.openCount()}</dd>
            </div>
          </dl>
          <p className="font-mono text-[10px] text-dc-muted-2">{dict.dashboard.subtitle}</p>
        </div>
      </Panel>
    </div>
  );
}

/* -------------------------------- Threats ------------------------------ */

export function ThreatsTab() {
  const { t } = useI18n();
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const threats = ThreatRepository.list(severity === "all" ? {} : { severity });

  return (
    <Panel
      title={`${t("dashboard.tabs.threats")} · ${threats.length}`}
      action={
        <FilterChips
          label={t("common.severity")}
          value={severity}
          onChange={setSeverity}
          options={[
            { value: "all", label: t("common.viewAll") },
            { value: "critical", label: t("visibility.legendCritical") },
            { value: "high", label: t("visibility.legendHigh") },
            { value: "medium", label: t("visibility.legendMedium") },
            { value: "low", label: t("visibility.legendLow") },
          ]}
        />
      }
    >
      {threats.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable
          caption={t("dashboard.tabs.threats")}
          headers={[t("common.category"), t("common.severity"), t("common.count"), t("common.trend"), t("common.status")]}
        >
          {threats.map((threat) => (
            <tr key={threat.id} className="hover:bg-dc-green/4">
              <td className="px-3 py-2.5">
                <span className="block font-medium text-dc-text">{threat.category}</span>
                <span className="block font-mono text-[10px] text-dc-muted-2">{threat.name}</span>
              </td>
              <td className="px-3 py-2.5">
                <SeverityPill severity={threat.severity} label={t(severityKeys[threat.severity])} />
              </td>
              <td className="px-3 py-2.5 font-mono text-dc-text">{formatNumber(threat.count)}</td>
              <td className="px-3 py-2.5 font-mono text-[11px]">
                <span className={threat.trend === "up" ? "text-[color:var(--sev-critical)]" : threat.trend === "down" ? "text-dc-green" : "text-dc-muted"}>
                  {threat.changePct > 0 ? "+" : ""}
                  {threat.changePct}%
                </span>
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-dc-muted">{threat.status}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </Panel>
  );
}

/* ------------------------------- Incidents ----------------------------- */

export function IncidentsTab() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"all" | "open" | "investigating" | "contained" | "resolved">("all");
  const incidents = IncidentRepository.list(status === "all" ? {} : { status });

  return (
    <Panel
      title={`${t("dashboard.tabs.incidents")} · ${incidents.length}`}
      action={
        <FilterChips
          label={t("common.status")}
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: t("common.viewAll") },
            { value: "open", label: "open" },
            { value: "investigating", label: "investigating" },
            { value: "contained", label: "contained" },
            { value: "resolved", label: "resolved" },
          ]}
        />
      }
    >
      {incidents.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable
          caption={t("dashboard.tabs.incidents")}
          headers={["ID", t("common.category"), t("common.severity"), "MITRE", t("dashboard.owner"), t("common.time")]}
        >
          {incidents.map((incident) => (
            <tr key={incident.id} className="hover:bg-dc-green/4">
              <td className="px-3 py-2.5 font-mono text-[11px] text-dc-green">{incident.id}</td>
              <td className="px-3 py-2.5 text-dc-text">{incident.title}</td>
              <td className="px-3 py-2.5">
                <SeverityPill severity={incident.severity} label={t(severityKeys[incident.severity])} />
              </td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-dc-muted">{incident.mitreTactic}</td>
              <td className="px-3 py-2.5 text-[11px] text-dc-muted">{incident.assignee}</td>
              <td className="px-3 py-2.5 font-mono text-[11px] text-dc-muted">{timeAgo(incident.updatedAt)}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </Panel>
  );
}

/* ------------------------------ Intelligence --------------------------- */

export function IntelligenceTab() {
  const { t } = useI18n();
  const feeds = FeedRepository.list();
  const iocs = IocRepository.list().slice(0, 8);

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title={t("nav.research")}>
        <DataTable caption={t("dashboard.tabs.intelligence")} headers={["Feed", "Provider", "Type", "Indicators", "Status"]}>
          {feeds.map((feed) => (
            <tr key={feed.id} className="hover:bg-dc-green/4">
              <td className="px-3 py-2.5 text-dc-text">{feed.name}</td>
              <td className="px-3 py-2.5 text-[11px] text-dc-muted">{feed.provider}</td>
              <td className="px-3 py-2.5 font-mono text-[10px] uppercase text-dc-muted-2">{feed.type}</td>
              <td className="px-3 py-2.5 font-mono text-dc-text">{formatNumber(feed.indicators)}</td>
              <td className="px-3 py-2.5">
                <span className={feed.status === "active" ? "text-dc-green" : feed.status === "degraded" ? "text-[color:var(--sev-medium)]" : "text-[color:var(--sev-critical)]"}>
                  {feed.status}
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <Panel title="IOC">
        <ul className="flex flex-col divide-y divide-dc-border">
          {iocs.map((ioc) => (
            <li key={ioc.id} className="flex items-center gap-3 py-2.5">
              <SeverityPill severity={ioc.severity} label={ioc.type} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[11.5px] text-dc-text">{ioc.value}</span>
                <span className="block truncate text-[10px] text-dc-muted-2">{ioc.tags[0]}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] text-dc-muted">{ioc.confidence}%</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ------------------------------ Compliance ----------------------------- */

export function ComplianceTab() {
  const { t } = useI18n();
  const frameworks = ComplianceRepository.list();

  return (
    <Panel title={t("compliance.supported")}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {frameworks.map((framework) => (
          <li key={framework.id} className="rounded-lg border border-dc-border p-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-dc-text">{framework.name}</span>
              <span className="font-mono text-[11px] text-dc-green">{framework.coverage}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-dc-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-dc-green-deep to-dc-green"
                style={{ width: `${framework.coverage}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-dc-muted-2">
              <span>
                {framework.controlsImplemented}/{framework.controlsTotal} {t("compliance.controls")}
              </span>
              <span>{formatDate(framework.lastAssessment)}</span>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* -------------------------------- Assets ------------------------------- */

export function AssetsTab() {
  const { t } = useI18n();
  const [type, setType] = useState<"all" | "endpoint" | "server" | "cloud" | "network" | "database" | "container">("all");
  const assets = AssetRepository.list(type === "all" ? {} : { type });

  return (
    <Panel
      title={`${t("dashboard.tabs.assets")} · ${assets.length}`}
      action={
        <FilterChips
          label={t("dashboard.tabs.assets")}
          value={type}
          onChange={setType}
          options={[
            { value: "all", label: t("common.viewAll") },
            { value: "endpoint", label: "endpoint" },
            { value: "server", label: "server" },
            { value: "cloud", label: "cloud" },
            { value: "database", label: "database" },
          ]}
        />
      }
    >
      {assets.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable caption={t("dashboard.tabs.assets")} headers={["Asset", t("common.category"), "Environment", t("dashboard.kpiRisk"), t("dashboard.owner")]}>
          {assets.slice(0, 12).map((asset) => (
            <tr key={asset.id} className="hover:bg-dc-green/4">
              <td className="px-3 py-2.5 font-mono text-[11.5px] text-dc-text">{asset.name}</td>
              <td className="px-3 py-2.5 font-mono text-[10px] uppercase text-dc-muted-2">{asset.type}</td>
              <td className="px-3 py-2.5 text-[11px] text-dc-muted">{asset.environment}</td>
              <td className="px-3 py-2.5">
                <span className={asset.riskScore > 78 ? "font-mono text-[color:var(--sev-critical)]" : asset.riskScore > 52 ? "font-mono text-[color:var(--sev-medium)]" : "font-mono text-dc-green"}>
                  {asset.riskScore}
                </span>
              </td>
              <td className="px-3 py-2.5 text-[11px] text-dc-muted">{asset.owner}</td>
            </tr>
          ))}
        </DataTable>
      )}
    </Panel>
  );
}

/* ------------------------------ Identities ----------------------------- */

export function IdentitiesTab() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<"all" | "privileged" | "no-mfa">("all");
  const identities = useMemo(() => {
    if (filter === "privileged") return IdentityRepository.list({ privileged: true });
    if (filter === "no-mfa") return IdentityRepository.withoutMfa();
    return IdentityRepository.list();
  }, [filter]);

  return (
    <Panel
      title={`${t("dashboard.tabs.identities")} · ${identities.length}`}
      action={
        <FilterChips
          label={t("dashboard.tabs.identities")}
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: t("common.viewAll") },
            { value: "privileged", label: "privileged" },
            { value: "no-mfa", label: "MFA off" },
          ]}
        />
      }
    >
      <DataTable caption={t("dashboard.tabs.identities")} headers={["Identity", "Role", "MFA", t("dashboard.kpiRisk"), t("common.status")]}>
        {identities.slice(0, 12).map((identity) => (
          <tr key={identity.id} className="hover:bg-dc-green/4">
            <td className="px-3 py-2.5">
              <span className="block text-dc-text">{identity.name}</span>
              <span className="block font-mono text-[10px] text-dc-muted-2">{identity.email}</span>
            </td>
            <td className="px-3 py-2.5 text-[11px] text-dc-muted">{identity.role}</td>
            <td className="px-3 py-2.5">
              <span className={identity.mfaEnabled ? "text-dc-green" : "text-[color:var(--sev-critical)]"}>
                {identity.mfaEnabled ? "on" : "off"}
              </span>
            </td>
            <td className="px-3 py-2.5 font-mono text-dc-text">{identity.riskScore}</td>
            <td className="px-3 py-2.5 font-mono text-[10px] uppercase text-dc-muted">{identity.status}</td>
          </tr>
        ))}
      </DataTable>
    </Panel>
  );
}

/* -------------------------------- Reports ------------------------------ */

export function ReportsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const reports = DashboardRepository.reports();

  const download = (name: string) => {
    const blob = new Blob([`Dark Coders report export\n${name}\nGenerated: ${new Date().toISOString()}\n`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast(t("dashboard.export"));
  };

  return (
    <Panel title={t("dashboard.tabs.reports")}>
      <ul className="flex flex-col divide-y divide-dc-border">
        {reports.map((report) => (
          <li key={report.id} className="flex items-center gap-3 py-3">
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] text-dc-text">{report.name}</span>
              <span className="block font-mono text-[10px] uppercase tracking-wider text-dc-muted-2">
                {report.type} · {report.period} · {(report.sizeKb / 1024).toFixed(1)} MB
              </span>
            </span>
            <span className="hidden font-mono text-[10px] text-dc-muted sm:block">{report.generatedAt}</span>
            <Button size="sm" variant="secondary" onClick={() => download(report.name)}>
              <Download className="h-3.5 w-3.5" />
              {t("dashboard.export")}
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------- Automation ---------------------------- */

export function AutomationTab() {
  const { t } = useI18n();
  const runs = DashboardRepository.automation();

  return (
    <Panel title={t("dashboard.automationRuns")}>
      <ul className="flex flex-col divide-y divide-dc-border">
        {runs.map((run) => (
          <li key={run.id} className="flex items-center gap-3 py-3">
            <StatusDot severity={run.status === "success" ? "info" : run.status === "running" ? "medium" : "critical"} pulse={run.status === "running"} />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] text-dc-text">{run.playbook}</span>
              <span className="block font-mono text-[10px] text-dc-muted-2">
                {run.trigger} · {timeAgo(run.startedAt)}
              </span>
            </span>
            <span className="font-mono text-[10px] uppercase text-dc-muted">{run.status}</span>
            <span className="hidden font-mono text-[10px] text-dc-muted sm:block">
              {run.durationMs ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

/* ------------------------------ Integrations --------------------------- */

export function IntegrationsTab() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [state, setState] = useState(() =>
    Object.fromEntries(DashboardRepository.integrations().map((i) => [i.id, i.connected])),
  );
  const integrations = DashboardRepository.integrations();

  const toggle = (id: string) => {
    setState((prev) => ({ ...prev, [id]: !prev[id] }));
    toast(t("toast.actionComplete"));
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {integrations.map((integration) => {
        const connected = state[integration.id];
        return (
          <div key={integration.id} className="dc-card flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-dc-border bg-dc-green/8 text-dc-green">
                {connected ? <PlugZap className="h-4 w-4" /> : <Plug className="h-4 w-4" />}
              </span>
              <span className="rounded border border-dc-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-dc-muted-2">
                {integration.category}
              </span>
            </div>
            <div>
              <h4 className="text-[13px] font-semibold text-dc-text">{integration.name}</h4>
              <p className="mt-1 text-[11.5px] leading-relaxed text-dc-muted">{integration.description}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(integration.id)}
              aria-pressed={connected}
              className={`mt-auto inline-flex items-center justify-between rounded-lg border px-3 py-2 text-[11px] transition-colors ${
                connected
                  ? "border-dc-green/40 bg-dc-green/10 text-dc-green"
                  : "border-dc-border text-dc-muted hover:border-dc-green/30 hover:text-dc-text"
              }`}
            >
              {connected ? t("dashboard.integrationsConnected") : t("common.optional")}
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-dc-green" : "bg-dc-muted-2"}`} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------- Settings ----------------------------- */

export function SettingsTab() {
  const { t, locale, setLocale } = useI18n();
  const { toast } = useToast();
  const [reduceMotion, setReduceMotion] = useState(false);
  const [alerts, setAlerts] = useState(true);

  const applyMotion = (value: boolean) => {
    setReduceMotion(value);
    document.documentElement.classList.toggle("dc-reduce-motion", value);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title={t("dashboard.tabs.settings")}>
        <div className="flex flex-col gap-5">
          <label className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-dc-text">{t("dashboard.settingsLanguage")}</span>
            <select
              value={locale}
              onChange={(e) => {
                setLocale(e.target.value as typeof locale);
                toast(t("toast.languageChanged"));
              }}
              className="rounded-lg border border-dc-border bg-dc-black/60 px-3 py-2 text-[13px] text-dc-text focus:border-dc-green focus:outline-none"
            >
              {["en", "fr", "ar", "es", "de", "pt", "it", "nl", "tr", "zh", "ja", "ko", "ru"].map((code) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-dc-text">{t("dashboard.settingsMotion")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={() => {
                applyMotion(!reduceMotion);
                toast(t("dashboard.settingsSaved"));
              }}
              className={`relative h-6 w-11 rounded-full border transition-colors ${
                reduceMotion ? "border-dc-green/50 bg-dc-green/25" : "border-dc-border bg-dc-black/60"
              }`}
            >
              <span
                className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-dc-green transition-all ${
                  reduceMotion ? "start-[22px]" : "start-0.5"
                }`}
                style={{ height: 18, width: 18 }}
              />
            </button>
          </label>

          <label className="flex items-center justify-between gap-4">
            <span className="text-[13px] text-dc-text">{t("dashboard.settingsAlerts")}</span>
            <button
              type="button"
              role="switch"
              aria-checked={alerts}
              onClick={() => {
                setAlerts(!alerts);
                toast(t("dashboard.settingsSaved"));
              }}
              className={`relative h-6 w-11 rounded-full border transition-colors ${
                alerts ? "border-dc-green/50 bg-dc-green/25" : "border-dc-border bg-dc-black/60"
              }`}
            >
              <span
                className={`absolute top-0.5 rounded-full bg-dc-green transition-all ${alerts ? "start-[22px]" : "start-0.5"}`}
                style={{ height: 18, width: 18 }}
              />
            </button>
          </label>
        </div>
      </Panel>

      <Panel title={t("dashboard.kpiRisk")}>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-dc-border p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-dc-muted-2">
              {t("dashboard.kpiRisk")}
            </p>
            <p className="mt-1 text-2xl font-bold text-dc-text">68</p>
            <Sparkline data={[72, 70, 74, 69, 67, 70, 66, 68]} />
          </div>
          <div className="rounded-lg border border-dc-border p-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-dc-muted-2">
              {t("dashboard.kpiAssets")}
            </p>
            <p className="mt-1 text-2xl font-bold text-dc-text">{AssetRepository.count()}</p>
            <Sparkline data={[300, 304, 302, 308, 310, 311, 312, 312]} color="#38bdf8" />
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-2 text-[12px] text-dc-muted">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-dc-green" /> {t("dashboard.settingsSaved")}
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-dc-green" />
            {AlertRepository.list().length} {t("dashboard.tabs.incidents")}
          </li>
        </ul>
      </Panel>
    </div>
  );
}
