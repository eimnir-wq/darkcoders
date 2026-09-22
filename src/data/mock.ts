import type {
  Alert,
  Asset,
  AutomationRun,
  ComplianceFramework,
  DashboardKpi,
  GeoThreatNode,
  IOC,
  Identity,
  Incident,
  Integration,
  MitreCell,
  Report,
  Risk,
  SecurityEvent,
  Threat,
  ThreatFeed,
  TimeSeriesPoint,
} from "@/types/domain";

/* ------------------------------------------------------------------
   Deterministic PRNG — guarantees stable values across renders,
   server/client hydration and tests. Never use Math.random() here.
------------------------------------------------------------------ */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fixed reference instant — keeps mock timestamps hydration-safe. */
export const BASE_TIME = Date.UTC(2026, 8, 22, 12, 0, 0);

export function minutesAgo(minutes: number): string {
  return new Date(BASE_TIME - minutes * 60_000).toISOString();
}

export function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)] as T;
}

export function range<T>(rng: () => number, min: number, max: number, map: (v: number) => T): T[] {
  const out: T[] = [];
  const count = Math.floor(min + rng() * (max - min + 1));
  for (let i = 0; i < count; i += 1) out.push(map(rng()));
  return out;
}

/* ---------------------------- Threats ---------------------------- */

const threatSeeds: Array<Pick<Threat, "name" | "category" | "severity" | "count" | "trend" | "changePct" | "source" | "status">> = [
  { name: "LockBit 4.0 Ransomware", category: "Ransomware", severity: "critical", count: 1248, trend: "up", changePct: 23, source: "Global Sensor Grid", status: "blocked" },
  { name: "Credential Phishing Campaign", category: "Phishing", severity: "high", count: 892, trend: "up", changePct: 12, source: "Mail Gateway", status: "blocked" },
  { name: "AsyncRAT Dropper", category: "Malware", severity: "high", count: 734, trend: "flat", changePct: 1, source: "EDR Network", status: "mitigated" },
  { name: "Cobalt Strike C2 Callback", category: "C2 Callbacks", severity: "critical", count: 421, trend: "down", changePct: -8, source: "NDR Sensors", status: "contained" },
  { name: "Volumetric DDoS Burst", category: "DDoS", severity: "medium", count: 311, trend: "down", changePct: -14, source: "Edge Scrubbing", status: "mitigated" },
  { name: "Kerberoasting Attempt", category: "Credential Abuse", severity: "high", count: 268, trend: "up", changePct: 19, source: "Identity Telemetry", status: "investigating" },
  { name: "Supply Chain Package Inject", category: "Supply Chain", severity: "critical", count: 142, trend: "up", changePct: 34, source: "SBOM Monitor", status: "investigating" },
  { name: "DNS Tunneling Exfiltration", category: "Exfiltration", severity: "high", count: 187, trend: "flat", changePct: 0, source: "DNS Analytics", status: "monitoring" },
  { name: "Cloud Key Abuse", category: "Cloud Misuse", severity: "medium", count: 233, trend: "up", changePct: 7, source: "CSPM", status: "blocked" },
  { name: "Insider Data Staging", category: "Insider Threat", severity: "medium", count: 96, trend: "down", changePct: -5, source: "DLP", status: "monitoring" },
  { name: "Zero-Day Exploit Attempt", category: "Exploit", severity: "critical", count: 78, trend: "up", changePct: 41, source: "Virtual Patching", status: "blocked" },
  { name: "Botnet Scanning Activity", category: "Reconnaissance", severity: "low", count: 512, trend: "flat", changePct: 2, source: "Honeypot Mesh", status: "monitoring" },
];

export const threats: Threat[] = threatSeeds.map((seed, i) => ({
  id: `THR-${String(1041 + i)}`,
  detectedAt: minutesAgo(8 + i * 37),
  ...seed,
}));

export const topThreats = threats.slice(0, 5);

/* --------------------------- Incidents --------------------------- */

export const incidents: Incident[] = [
  { id: "INC-2026-001", title: "Privileged account anomaly", severity: "high", status: "investigating", assignee: "S. Benali", createdAt: minutesAgo(180), updatedAt: minutesAgo(12), affectedAssets: 4, mitreTactic: "Privilege Escalation" },
  { id: "INC-2026-002", title: "Unauthorized access attempt on SRV-001", severity: "critical", status: "open", assignee: "Unassigned", createdAt: minutesAgo(90), updatedAt: minutesAgo(6), affectedAssets: 1, mitreTactic: "Initial Access" },
  { id: "INC-2026-003", title: "Suspected phishing email to finance", severity: "high", status: "contained", assignee: "Y. Affif", createdAt: minutesAgo(320), updatedAt: minutesAgo(45), affectedAssets: 12, mitreTactic: "Phishing" },
  { id: "INC-2026-004", title: "Possible data leak on APP-CRM", severity: "medium", status: "investigating", assignee: "S. Benali", createdAt: minutesAgo(1440), updatedAt: minutesAgo(120), affectedAssets: 2, mitreTactic: "Exfiltration" },
  { id: "INC-2026-005", title: "Public S3 bucket detected", severity: "critical", status: "resolved", assignee: "M. Idrissi", createdAt: minutesAgo(1500), updatedAt: minutesAgo(300), affectedAssets: 3, mitreTactic: "Collection" },
  { id: "INC-2026-006", title: "Anomalous outbound traffic from DB-04", severity: "medium", status: "investigating", assignee: "Y. Affif", createdAt: minutesAgo(420), updatedAt: minutesAgo(30), affectedAssets: 1, mitreTactic: "Command and Control" },
  { id: "INC-2026-007", title: "MFA fatigue campaign against executives", severity: "high", status: "open", assignee: "Unassigned", createdAt: minutesAgo(75), updatedAt: minutesAgo(9), affectedAssets: 7, mitreTactic: "Credential Access" },
  { id: "INC-2026-008", title: "Container escape attempt on k8s-prod", severity: "critical", status: "contained", assignee: "M. Idrissi", createdAt: minutesAgo(600), updatedAt: minutesAgo(180), affectedAssets: 5, mitreTactic: "Execution" },
];

/* ------------------------------ IOCs ----------------------------- */

const iocSeeds: Array<[IOC["type"], string, string]> = [
  ["ip", "185.220.101.42", "Tor exit node observed in C2 traffic"],
  ["ip", "45.155.205.233", "Known Cobalt Strike team server"],
  ["domain", "secure-login-verify.io", "Credential phishing kit"],
  ["domain", "cdn-update-service.net", "Malware distribution"],
  ["hash", "d41d8cd98f00b204e9800998ecf8427e", "AsyncRAT dropper payload"],
  ["hash", "9f2a1c7be4d0a35f8c1e6b7d2a4f0c91", "Ransomware encryptor"],
  ["url", "https://paypa1-secure.com/session", "Phishing landing page"],
  ["email", "billing@micros0ft-support.com", "Business email compromise"],
  ["ip", "103.75.201.17", "Brute-force source"],
  ["domain", "api-telemetry-sync.org", "DNS tunneling endpoint"],
  ["hash", "5c3e9a17f0b2d8461e7a9c4f8b1d2e60", "Loader stager"],
  ["url", "http://45.155.205.233/beacon", "C2 beacon URL"],
  ["ip", "91.219.236.88", "Scanning botnet node"],
  ["domain", "invoice-share-docs.com", "Malicious attachment host"],
  ["hash", "1a2b3c4d5e6f708192a3b4c5d6e7f809", "Cryptominer binary"],
  ["email", "ceo-urgent@exec-mail.co", "CEO fraud sender"],
  ["ip", "212.83.146.9", "Exploit kit host"],
  ["domain", "vpn-gateway-portal.net", "Credential harvesting"],
  ["url", "https://bit.ly/3xR4nd0m", "Redirect to malware"],
  ["hash", "77e1a4c9b2d8f0356e7c1a9b4d2f8e60", "Web shell signature"],
];

export const iocs: IOC[] = iocSeeds.map(([type, value, tag], i) => {
  const rng = mulberry32(900 + i);
  const severity = pick(rng, ["critical", "high", "medium", "low"] as const);
  return {
    id: `IOC-${2001 + i}`,
    type,
    value,
    severity,
    confidence: 62 + Math.floor(rng() * 37),
    firstSeen: minutesAgo(30 + i * 73),
    source: pick(rng, ["Global Sensor Grid", "Partner Feed", "Internal Hunt", "Government Feed"]),
    tags: [tag],
  };
});

/* ----------------------------- Assets ---------------------------- */

export const assets: Asset[] = Array.from({ length: 24 }, (_, i) => {
  const rng = mulberry32(4100 + i);
  const type = pick(rng, ["endpoint", "server", "cloud", "network", "database", "container"] as const);
  const riskScore = Math.floor(rng() * 100);
  const status = riskScore > 78 ? "compromised" : riskScore > 52 ? "at-risk" : "healthy";
  return {
    id: `AST-${3100 + i}`,
    name: `${type === "cloud" ? "cloud" : type === "container" ? "pod" : type}-${(i + 1).toString().padStart(3, "0")}`,
    type,
    environment: pick(rng, ["production", "staging", "development"] as const),
    riskScore,
    owner: pick(rng, ["Platform Team", "Cloud Ops", "Data Engineering", "IT Infrastructure"]),
    region: pick(rng, ["eu-west-1", "us-east-1", "me-south-1", "ap-southeast-1"]),
    status,
  };
});

/* --------------------------- Identities -------------------------- */

const people = [
  ["Amine Rahali", "SOC Lead"],
  ["Sara Benali", "GRC Manager"],
  ["Youssef Affif", "Incident Responder"],
  ["Mehdi Idrissi", "Cloud Security Engineer"],
  ["Lina Haddad", "Threat Intelligence Analyst"],
  ["Omar Cherkaoui", "Platform Engineer"],
  ["Nadia Fassi", "Compliance Officer"],
  ["Karim Benjelloun", "DevSecOps Engineer"],
  ["Salma Idrissi", "Security Architect"],
  ["Hassan Alami", "IAM Engineer"],
  ["Rim Bennis", "Detection Engineer"],
  ["Tarik El Fassi", "CTI Researcher"],
  ["Yasmine Naciri", "Risk Analyst"],
  ["Bilal Mansouri", "Network Security Engineer"],
  ["Houda Berrada", "Privacy Officer"],
  ["Anas Kabbaj", "Automation Engineer"],
  ["Imane Tazi", "Security Awareness Lead"],
  ["Reda Benkirane", "Penetration Tester"],
  ["Soukaina Aloui", "Data Protection Analyst"],
  ["Zakaria Benali", "SOC Analyst Tier 2"],
] as const;

export const identities: Identity[] = people.map(([name, role], i) => {
  const rng = mulberry32(5200 + i);
  const riskScore = Math.floor(rng() * 100);
  const mfaEnabled = rng() > 0.18;
  return {
    id: `IDN-${7001 + i}`,
    name,
    email: `${name.toLowerCase().replace(/[^a-z]+/g, ".")}@darkcoders.com`,
    role,
    department: pick(rng, ["Security", "Engineering", "Compliance", "Operations", "Research"]),
    mfaEnabled,
    privileged: rng() > 0.7,
    riskScore,
    lastActive: minutesAgo(2 + i * 41),
    status: riskScore > 82 ? "suspended" : rng() > 0.85 ? "dormant" : "active",
  };
});

/* -------------------------- Compliance --------------------------- */

const frameworkSeeds: Array<[string, string, number, number, ComplianceFramework["status"], string]> = [
  ["ISO/IEC 27001", "ISO 27001", 89, 114, "compliant", "2026-08-30"],
  ["SOC 2 Type II", "SOC 2", 86, 61, "compliant", "2026-08-18"],
  ["NIST Cybersecurity Framework", "NIST", 82, 108, "in-progress", "2026-07-29"],
  ["PCI DSS v4.0", "PCI DSS", 76, 240, "attention", "2026-06-15"],
  ["GDPR", "GDPR", 91, 42, "compliant", "2026-09-02"],
  ["NCA ECC", "NCA ECC", 84, 88, "in-progress", "2026-07-11"],
  ["HIPAA", "HIPAA", 73, 54, "attention", "2026-05-27"],
  ["FedRAMP Moderate", "FedRAMP", 68, 323, "in-progress", "2026-06-30"],
  ["CIS Controls v8", "CIS", 80, 153, "in-progress", "2026-08-05"],
  ["COBIT 2019", "COBIT", 77, 40, "in-progress", "2026-06-21"],
  ["ITIL 4", "ITIL", 74, 34, "in-progress", "2026-07-02"],
];

export const complianceFrameworks: ComplianceFramework[] = frameworkSeeds.map(
  ([name, shortName, coverage, controlsTotal, status, lastAssessment], i) => ({
    id: `FW-${i + 1}`,
    name,
    shortName,
    coverage,
    controlsTotal,
    controlsImplemented: Math.round((coverage / 100) * controlsTotal),
    lastAssessment,
    status,
  }),
);

export const risks: Risk[] = [
  ["Customer data leakage", "critical", 4, 5, "S. Benali", "up", "mitigating"],
  ["Ransomware on file servers", "critical", 3, 5, "M. Idrissi", "up", "open"],
  ["Unpatched internet-facing systems", "high", 4, 4, "O. Cherkaoui", "flat", "mitigating"],
  ["Third-party vendor access", "high", 3, 4, "N. Fassi", "up", "open"],
  ["Excessive privileged accounts", "high", 3, 4, "H. Alami", "down", "mitigating"],
  ["Cloud misconfiguration", "medium", 4, 3, "M. Idrissi", "down", "mitigating"],
  ["Weak backup restoration testing", "medium", 2, 4, "O. Cherkaoui", "flat", "accepted"],
  ["Insider threat detection gaps", "high", 3, 4, "R. Bennis", "up", "open"],
].map(([title, severity, likelihood, impact, owner, trend, status], i) => ({
  id: `RSK-${String(i + 1).padStart(3, "0")}`,
  title: title as string,
  severity: severity as Risk["severity"],
  likelihood: likelihood as Risk["likelihood"],
  impact: impact as Risk["impact"],
  score: (likelihood as number) * (impact as number) * 4,
  owner: owner as string,
  trend: trend as Risk["trend"],
  status: status as Risk["status"],
}));

/* ---------------------------- Alerts ----------------------------- */

export const alerts: Alert[] = [
  ["Malware detected and blocked", "critical", "Malware", "EDR Network", "Signature match on AsyncRAT dropper; process terminated and host isolated."],
  ["Suspicious login attempt", "high", "Identity", "Identity Telemetry", "Impossible-travel login from two geographies within 9 minutes."],
  ["Phishing domain detected", "high", "Phishing", "Mail Gateway", "Newly registered domain impersonating corporate SSO portal."],
  ["Vulnerability exploit attempt", "critical", "Exploit", "Virtual Patching", "Attempted exploitation of CVE-2026-31847 against edge appliance."],
  ["DDoS attack mitigated", "medium", "DDoS", "Edge Scrubbing", "312 Gbps volumetric burst absorbed at the scrubbing center."],
  ["Credential stuffing detected", "high", "Identity", "Identity Telemetry", "Distributed low-and-slow login failures across 240 accounts."],
  ["Data exfiltration attempt", "critical", "Exfiltration", "DLP", "Large archive upload to unsanctioned storage endpoint."],
  ["C2 beacon identified", "critical", "C2", "NDR Sensors", "Periodic DNS beacon matching known Cobalt Strike profile."],
  ["Ransomware canary tripped", "critical", "Ransomware", "File Integrity", "Canary file modified on backup share; snapshot protection engaged."],
  ["Privilege escalation attempt", "high", "Privilege", "Endpoint Sensors", "Token manipulation attempt blocked on production host."],
].map(([title, severity, category, source, description], i) => ({
  id: `ALR-${String(9001 + i)}`,
  title: title as string,
  severity: severity as Alert["severity"],
  category: category as string,
  timestamp: minutesAgo(3 + i * 29),
  status: i < 4 ? "new" : i < 7 ? "acknowledged" : "closed",
  source: source as string,
  description: description as string,
}));

/* ------------------------ Security events ------------------------ */

const eventGeo: Array<[string, string, number, number]> = [
  ["Paris", "France", 48.8566, 2.3522],
  ["London", "United Kingdom", 51.5074, -0.1278],
  ["Frankfurt", "Germany", 50.1109, 8.6821],
  ["Amsterdam", "Netherlands", 52.3676, 4.9041],
  ["Madrid", "Spain", 40.4168, -3.7038],
  ["Rome", "Italy", 41.9028, 12.4964],
  ["Stockholm", "Sweden", 59.3293, 18.0686],
  ["Warsaw", "Poland", 52.2297, 21.0122],
  ["Casablanca", "Morocco", 33.5731, -7.5898],
  ["Riyadh", "Saudi Arabia", 24.7136, 46.6753],
  ["Dubai", "UAE", 25.2048, 55.2708],
  ["Istanbul", "Türkiye", 41.0082, 28.9784],
  ["New York", "United States", 40.7128, -74.006],
  ["San Francisco", "United States", 37.7749, -122.4194],
  ["Toronto", "Canada", 43.6532, -79.3832],
  ["São Paulo", "Brazil", -23.5505, -46.6333],
  ["Singapore", "Singapore", 1.3521, 103.8198],
  ["Tokyo", "Japan", 35.6762, 139.6503],
  ["Seoul", "South Korea", 37.5665, 126.978],
  ["Sydney", "Australia", -33.8688, 151.2093],
  ["Mumbai", "India", 19.076, 72.8777],
  ["Cape Town", "South Africa", -33.9249, 18.4241],
  ["Nairobi", "Kenya", -1.2921, 36.8219],
  ["Tel Aviv", "Israel", 32.0853, 34.7818],
];

export const geoThreatNodes: GeoThreatNode[] = eventGeo.map(([label, country, lat, lon], i) => {
  const rng = mulberry32(3300 + i);
  return {
    id: `GEO-${i + 1}`,
    label,
    country,
    lat,
    lon,
    severity: pick(rng, ["critical", "high", "high", "medium", "medium", "low", "info"] as const),
    count: 40 + Math.floor(rng() * 960),
    vector: pick(rng, ["Ransomware", "Phishing", "C2", "DDoS", "Exploit", "Exfiltration", "Scanning"]),
  };
});

const eventTitles = [
  "Malware detected and blocked",
  "Suspicious login attempt",
  "Phishing domain detected",
  "Vulnerability exploit attempt",
  "DDoS attack mitigated",
  "Credential stuffing detected",
  "Data exfiltration attempt",
  "C2 beacon identified",
];

export const securityEvents: SecurityEvent[] = Array.from({ length: 14 }, (_, i) => {
  const rng = mulberry32(6100 + i);
  const geo = eventGeo[Math.floor(rng() * eventGeo.length)] as [string, string, number, number];
  return {
    id: `EVT-${String(5001 + i)}`,
    title: pick(rng, eventTitles),
    category: pick(rng, ["Malware", "Identity", "Phishing", "Exploit", "DDoS", "Exfiltration"]),
    severity: pick(rng, ["critical", "high", "medium", "low", "info"] as const),
    timestamp: minutesAgo(2 + i * 11),
    status: pick(rng, ["blocked", "mitigated", "monitoring", "investigating"]),
    sourceIp: `${10 + Math.floor(rng() * 240)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`,
    region: geo[0],
    lat: geo[2],
    lon: geo[3],
  };
});

/* -------------------------- Threat feeds ------------------------- */

export const threatFeeds: ThreatFeed[] = [
  ["Dark Coders Global Grid", "Dark Coders", "internal", 84_200_000, "active", 99],
  ["Government CERT Feed", "National CERT", "government", 12_400_000, "active", 97],
  ["Commercial CTI Premium", "Vendor CTI", "commercial", 31_800_000, "active", 95],
  ["Open Source OSINT", "Community", "open-source", 48_600_000, "degraded", 78],
  ["Malware Sandbox Feed", "Dark Coders Labs", "internal", 9_300_000, "active", 96],
  ["Botnet Tracker", "Partner Network", "commercial", 6_750_000, "active", 92],
  ["Phishing Intelligence", "Vendor CTI", "commercial", 4_120_000, "active", 94],
  ["Vulnerability Intelligence", "Government CERT", "government", 2_980_000, "active", 93],
  ["Dark Web Monitor", "Dark Coders Labs", "internal", 1_640_000, "active", 88],
  ["Industry ISAC", "ISAC", "open-source", 3_410_000, "active", 90],
  ["Cloud Threat Feed", "Vendor CTI", "commercial", 5_220_000, "active", 91],
  ["Honeypot Mesh", "Dark Coders", "internal", 7_980_000, "offline", 84],
].map(([name, provider, type, indicators, status, reliability], i) => ({
  id: `FEED-${i + 1}`,
  name: name as string,
  provider: provider as string,
  type: type as ThreatFeed["type"],
  indicators: indicators as number,
  status: status as ThreatFeed["status"],
  lastSync: minutesAgo(2 + i * 7),
  reliability: reliability as number,
}));

/* --------------------------- Dashboard --------------------------- */

function series(seed: number, base: number, variance: number, points = 24): number[] {
  const rng = mulberry32(seed);
  return Array.from({ length: points }, (_, i) => {
    const wave = Math.sin((i / points) * Math.PI * 2) * variance * 0.4;
    return Math.max(1, Math.round(base + wave + (rng() - 0.5) * variance));
  });
}

export const dashboardKpis: DashboardKpi[] = [
  { id: "kpi-threats", labelKey: "dashboard.kpiThreats", value: 12436, deltaPct: 23, trend: "up", severity: "critical", series: series(11, 420, 160) },
  { id: "kpi-incidents", labelKey: "dashboard.kpiIncidents", value: 342, deltaPct: -12, trend: "down", severity: "high", series: series(22, 14, 8) },
  { id: "kpi-risk", labelKey: "dashboard.kpiRisk", value: 68, suffix: "/100", deltaPct: -4, trend: "down", severity: "medium", series: series(33, 70, 12) },
  { id: "kpi-assets", labelKey: "dashboard.kpiAssets", value: 312, deltaPct: 8, trend: "up", severity: "low", series: series(44, 300, 20) },
];

export const liveThreatActivity: TimeSeriesPoint[] = Array.from({ length: 24 }, (_, i) => {
  const rng = mulberry32(770 + i);
  return {
    label: `${String(i).padStart(2, "0")}:00`,
    threats: Math.round(180 + rng() * 260),
    blocked: Math.round(160 + rng() * 240),
    incidents: Math.round(4 + rng() * 22),
  };
});

const tactics = [
  "Initial Access",
  "Execution",
  "Persistence",
  "Privilege Escalation",
  "Defense Evasion",
  "Credential Access",
  "Discovery",
  "Lateral Movement",
  "Collection",
  "Exfiltration",
  "Command and Control",
  "Impact",
];

export const mitreHeatmap: MitreCell[] = tactics.flatMap((tactic, ti) =>
  Array.from({ length: 4 }, (_, j) => {
    const rng = mulberry32(8800 + ti * 10 + j);
    const count = Math.floor(rng() * 100);
    const severity = count > 74 ? "critical" : count > 52 ? "high" : count > 30 ? "medium" : count > 12 ? "low" : "info";
    return {
      tactic,
      technique: `${tactic.split(" ")[0]} T${1000 + ti * 10 + j}`,
      count,
      severity,
    } as MitreCell;
  }),
);

/* ------------------------- Integrations -------------------------- */

export const integrations: Integration[] = [
  ["Splunk Enterprise Security", "SIEM", true, "Bidirectional alert and event sync."],
  ["Elastic / OpenSearch", "SIEM", true, "Log ingestion and search federation."],
  ["Cortex XSOAR", "SOAR", true, "Playbook execution and case sync."],
  ["AWS Security Hub", "Cloud", true, "Findings and posture ingestion."],
  ["Microsoft Azure Defender", "Cloud", true, "Cloud workload protection signals."],
  ["Okta", "Identity", true, "Identity risk and MFA enforcement."],
  ["Microsoft Entra ID", "Identity", false, "Directory sync and conditional access."],
  ["CrowdStrike Falcon", "Threat Intel", true, "Endpoint detections and IOCs."],
  ["MISP", "Threat Intel", true, "Open-source threat sharing."],
  ["Snowflake", "Data", false, "Security data lake export."],
  ["MinIO Object Storage", "Data", true, "Evidence and artifact storage."],
  ["Keycloak", "Identity", true, "Enterprise SSO federation."],
].map(([name, category, connected, description], i) => ({
  id: `INT-${i + 1}`,
  name: name as string,
  category: category as Integration["category"],
  connected: connected as boolean,
  description: description as string,
}));

export const automationRuns: AutomationRun[] = [
  ["Contain compromised endpoint", "success", 3, 1840, "EDR alert"],
  ["Enrich IOC from threat feeds", "success", 8, 620, "New IOC"],
  ["Disable leaked credentials", "running", 12, 0, "Identity alert"],
  ["Open incident from critical alert", "success", 26, 410, "SIEM correlation"],
  ["Quarantine phishing message", "success", 34, 760, "Mail gateway"],
  ["Snapshot backup volumes", "failed", 51, 2200, "Ransomware canary"],
].map(([playbook, status, minutes, durationMs, trigger], i) => ({
  id: `RUN-${i + 1}`,
  playbook: playbook as string,
  status: status as AutomationRun["status"],
  startedAt: minutesAgo(minutes as number),
  durationMs: durationMs as number,
  trigger: trigger as string,
}));

export const reports: Report[] = [
  ["Executive Security Posture — Q3", "executive", "2026-09-20", "Q3 2026", 2840],
  ["ISO 27001 Continuous Audit", "compliance", "2026-09-18", "September 2026", 1620],
  ["Incident Report INC-2026-002", "incident", "2026-09-22", "Ad hoc", 410],
  ["Global Threat Landscape — Weekly", "threat", "2026-09-21", "Week 38", 2210],
  ["SOC 2 Evidence Package", "audit", "2026-09-15", "Q3 2026", 5480],
  ["PCI DSS Gap Assessment", "compliance", "2026-09-10", "Q3 2026", 1980],
].map(([name, type, generatedAt, period, sizeKb], i) => ({
  id: `RPT-${i + 1}`,
  name: name as string,
  type: type as Report["type"],
  generatedAt: generatedAt as string,
  period: period as string,
  sizeKb: sizeKb as number,
}));

/* --------------------------- Aggregates -------------------------- */

export const heroStats = {
  threatsBlocked: 12436,
  activeIncidents: 342,
  uptime: 99.99,
  iocsProcessed: 250_000_000,
  countriesMonitored: 180,
  threatFeeds: 50,
  detectionMs: 0.8,
};

export const scaleStats = {
  organizations: 500,
  countries: 60,
  uptime: 99.99,
  monitoring: 24,
};
