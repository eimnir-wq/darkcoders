import {
  alerts,
  assets,
  automationRuns,
  complianceFrameworks,
  dashboardKpis,
  geoThreatNodes,
  identities,
  incidents,
  integrations,
  iocs,
  liveThreatActivity,
  mitreHeatmap,
  reports,
  risks,
  securityEvents,
  threatFeeds,
  threats,
  topThreats,
} from "@/data/mock";
import type { Severity } from "@/types/domain";

function bySeverity<T extends { severity: Severity }>(items: T[], severity?: Severity): T[] {
  if (!severity) return items;
  return items.filter((item) => item.severity === severity);
}

function sortByTimeDesc<T extends { timestamp?: string; detectedAt?: string; updatedAt?: string }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => {
    const at = a.timestamp ?? a.detectedAt ?? a.updatedAt ?? "";
    const bt = b.timestamp ?? b.detectedAt ?? b.updatedAt ?? "";
    return bt.localeCompare(at);
  });
}

export const ThreatRepository = {
  list: (opts: { severity?: Severity; category?: string } = {}) => {
    let result = bySeverity(threats, opts.severity);
    if (opts.category) result = result.filter((t) => t.category === opts.category);
    return result;
  },
  top: () => topThreats,
  categories: () => Array.from(new Set(threats.map((t) => t.category))),
  get: (id: string) => threats.find((t) => t.id === id) ?? null,
};

export const IncidentRepository = {
  list: (opts: { severity?: Severity; status?: string } = {}) => {
    let result = bySeverity(incidents, opts.severity);
    if (opts.status) result = result.filter((i) => i.status === opts.status);
    return result;
  },
  get: (id: string) => incidents.find((i) => i.id === id) ?? null,
  openCount: () => incidents.filter((i) => i.status === "open" || i.status === "investigating").length,
  bySeverity: () =>
    (["critical", "high", "medium", "low"] as Severity[]).map((severity) => ({
      severity,
      count: incidents.filter((i) => i.severity === severity).length,
    })),
};

export const IocRepository = {
  list: (opts: { severity?: Severity; type?: string } = {}) => {
    let result = bySeverity(iocs, opts.severity);
    if (opts.type) result = result.filter((i) => i.type === opts.type);
    return result;
  },
  total: () => iocs.length,
};

export const AssetRepository = {
  list: (opts: { type?: string; environment?: string } = {}) => {
    let result = assets;
    if (opts.type) result = result.filter((a) => a.type === opts.type);
    if (opts.environment) result = result.filter((a) => a.environment === opts.environment);
    return result;
  },
  count: () => assets.length,
  atRisk: () => assets.filter((a) => a.status !== "healthy").length,
  averageRisk: () =>
    Math.round(assets.reduce((acc, a) => acc + a.riskScore, 0) / Math.max(1, assets.length)),
};

export const IdentityRepository = {
  list: (opts: { privileged?: boolean; status?: string } = {}) => {
    let result = identities;
    if (opts.privileged !== undefined) result = result.filter((i) => i.privileged === opts.privileged);
    if (opts.status) result = result.filter((i) => i.status === opts.status);
    return result;
  },
  withoutMfa: () => identities.filter((i) => !i.mfaEnabled),
  highRisk: () => identities.filter((i) => i.riskScore > 70),
  count: () => identities.length,
};

export const ComplianceRepository = {
  list: () => complianceFrameworks,
  get: (id: string) => complianceFrameworks.find((f) => f.id === id) ?? null,
  averageCoverage: () =>
    Math.round(
      complianceFrameworks.reduce((acc, f) => acc + f.coverage, 0) /
        Math.max(1, complianceFrameworks.length),
    ),
  attention: () => complianceFrameworks.filter((f) => f.status === "attention"),
  totalControls: () => complianceFrameworks.reduce((acc, f) => acc + f.controlsTotal, 0),
  implementedControls: () =>
    complianceFrameworks.reduce((acc, f) => acc + f.controlsImplemented, 0),
};

export const RiskRepository = {
  list: () => risks,
  top: (n = 5) => [...risks].sort((a, b) => b.score - a.score).slice(0, n),
  averageScore: () => Math.round(risks.reduce((acc, r) => acc + r.score, 0) / Math.max(1, risks.length)),
};

export const AlertRepository = {
  list: (opts: { severity?: Severity; status?: string } = {}) => {
    let result = bySeverity(alerts, opts.severity);
    if (opts.status) result = result.filter((a) => a.status === opts.status);
    return result;
  },
  recent: (n = 6) => sortByTimeDesc(alerts).slice(0, n),
  newCount: () => alerts.filter((a) => a.status === "new").length,
};

export const EventRepository = {
  list: () => securityEvents,
  recent: (n = 8) => sortByTimeDesc(securityEvents).slice(0, n),
  geoNodes: () => geoThreatNodes,
};

export const FeedRepository = {
  list: () => threatFeeds,
  active: () => threatFeeds.filter((f) => f.status === "active"),
  totalIndicators: () => threatFeeds.reduce((acc, f) => acc + f.indicators, 0),
};

export const DashboardRepository = {
  kpis: () => dashboardKpis,
  activity: () => liveThreatActivity,
  mitre: () => mitreHeatmap,
  integrations: () => integrations,
  automation: () => automationRuns,
  reports: () => reports,
};

export const StatisticsService = {
  severityBreakdown: () =>
    (["critical", "high", "medium", "low", "info"] as Severity[]).map((severity) => ({
      severity,
      threats: threats.filter((t) => t.severity === severity).length,
      incidents: incidents.filter((i) => i.severity === severity).length,
      alerts: alerts.filter((a) => a.severity === severity).length,
    })),
  headlineCounts: () => ({
    criticalIncidents: incidents.filter((i) => i.severity === "critical").length,
    highAlerts: alerts.filter((a) => a.severity === "high").length,
    suspiciousEvents: securityEvents.length,
    threatsBlocked: threats.reduce((acc, t) => acc + t.count, 0),
  }),
};

export type Repositories = {
  threats: typeof ThreatRepository;
  incidents: typeof IncidentRepository;
  compliance: typeof ComplianceRepository;
  assets: typeof AssetRepository;
};

export const repositories: Repositories = {
  threats: ThreatRepository,
  incidents: IncidentRepository,
  compliance: ComplianceRepository,
  assets: AssetRepository,
};
