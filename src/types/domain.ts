export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type ThreatStatus = "blocked" | "mitigated" | "monitoring" | "investigating" | "contained";

export type Trend = "up" | "down" | "flat";

export interface Threat {
  id: string;
  name: string;
  category: string;
  severity: Severity;
  count: number;
  trend: Trend;
  changePct: number;
  source: string;
  detectedAt: string;
  status: ThreatStatus;
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: "open" | "investigating" | "contained" | "resolved";
  assignee: string;
  createdAt: string;
  updatedAt: string;
  affectedAssets: number;
  mitreTactic: string;
}

export interface IOC {
  id: string;
  type: "ip" | "domain" | "hash" | "url" | "email";
  value: string;
  severity: Severity;
  confidence: number;
  firstSeen: string;
  source: string;
  tags: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: "endpoint" | "server" | "cloud" | "network" | "database" | "container";
  environment: "production" | "staging" | "development";
  riskScore: number;
  owner: string;
  region: string;
  status: "healthy" | "at-risk" | "compromised";
}

export interface Identity {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  mfaEnabled: boolean;
  privileged: boolean;
  riskScore: number;
  lastActive: string;
  status: "active" | "suspended" | "dormant";
}

export interface Control {
  id: string;
  framework: string;
  code: string;
  title: string;
  status: "implemented" | "partial" | "planned";
}

export interface Evidence {
  id: string;
  controlId: string;
  type: "document" | "screenshot" | "log" | "attestation";
  collectedAt: string;
  automated: boolean;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  shortName: string;
  coverage: number;
  controlsTotal: number;
  controlsImplemented: number;
  lastAssessment: string;
  status: "compliant" | "in-progress" | "attention";
}

export interface Risk {
  id: string;
  title: string;
  severity: Severity;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  score: number;
  owner: string;
  trend: Trend;
  status: "open" | "mitigating" | "accepted" | "closed";
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  category: string;
  timestamp: string;
  status: "new" | "acknowledged" | "closed";
  source: string;
  description: string;
}

export interface SecurityEvent {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  timestamp: string;
  status: string;
  sourceIp: string;
  region: string;
  lat: number;
  lon: number;
}

export interface ThreatFeed {
  id: string;
  name: string;
  provider: string;
  type: "commercial" | "open-source" | "internal" | "government";
  indicators: number;
  status: "active" | "degraded" | "offline";
  lastSync: string;
  reliability: number;
}

export interface AIQuery {
  id: string;
  prompt: string;
  intent: "threat-summary" | "top-risks" | "compliance-status" | "incident-report" | "unknown";
  createdAt: string;
}

export interface AIResponse {
  queryId: string;
  headline: string;
  summary: string;
  bullets: string[];
  recommendations: string[];
  sources: string[];
  confidence: number;
}

export interface GeoThreatNode {
  id: string;
  label: string;
  country: string;
  lat: number;
  lon: number;
  severity: Severity;
  count: number;
  vector: string;
}

export interface DashboardKpi {
  id: string;
  labelKey: string;
  value: number;
  suffix?: string;
  deltaPct: number;
  trend: Trend;
  severity: Severity;
  series: number[];
}

export interface TimeSeriesPoint {
  label: string;
  threats: number;
  blocked: number;
  incidents: number;
}

export interface MitreCell {
  tactic: string;
  technique: string;
  count: number;
  severity: Severity;
}

export interface Integration {
  id: string;
  name: string;
  category: "SIEM" | "SOAR" | "Cloud" | "Identity" | "Threat Intel" | "Data";
  connected: boolean;
  description: string;
}

export interface AutomationRun {
  id: string;
  playbook: string;
  status: "success" | "running" | "failed";
  startedAt: string;
  durationMs: number;
  trigger: string;
}

export interface Report {
  id: string;
  name: string;
  type: "executive" | "compliance" | "incident" | "threat" | "audit";
  generatedAt: string;
  period: string;
  sizeKb: number;
}
