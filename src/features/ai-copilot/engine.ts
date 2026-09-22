import type { AIResponse, Severity } from "@/types/domain";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  AlertRepository,
  AssetRepository,
  ComplianceRepository,
  EventRepository,
  FeedRepository,
  IdentityRepository,
  IncidentRepository,
  RiskRepository,
  StatisticsService,
  ThreatRepository,
} from "@/services/repositories";

export type CopilotIntent =
  | "threat-summary"
  | "top-risks"
  | "compliance-status"
  | "incident-report"
  | "identity-posture"
  | "asset-posture"
  | "feed-coverage"
  | "matched-threat"
  | "fallback";

const intentKeywords: Record<Exclude<CopilotIntent, "fallback" | "matched-threat">, string[]> = {
  "threat-summary": [
    "summar", "threat", "today", "menace", "تهديد", "لخّص", "amenaza", "bedrohung", "zusammenfass",
    "威胁", "总结", "脅威", "要約", "위협", "요약", "угроз", "сводк",
  ],
  "top-risks": [
    "risk", "risque", "riesgo", "risiko", "risico", "risk", "危险", "风险", "リスク", "위험",
    "риск", "مخاطر", "مخاطرة",
  ],
  "compliance-status": [
    "complian", "iso", "soc 2", "soc2", "gdpr", "nist", "pci", "hipaa", "conform", "cumpl",
    "合规", "コンプライアンス", "준수", "соответств", "امتثال",
  ],
  "incident-report": [
    "incident report", "report", "rapport", "informe", "bericht", "报告", "レポート", "보고서",
    "отчёт", "отчет", "تقرير", "incident", "حادث",
  ],
  "identity-posture": [
    "identity", "mfa", "identit", "identidad", "identität", "identiteit", "kimlik", "身份",
    "アイデンティティ", "아이덴티티", "идентич", "هوية",
  ],
  "asset-posture": [
    "asset", "actif", "activo", "anlage", "bezit", "varlık", "资产", "資産", "자산", "актив",
    "أصول",
  ],
  "feed-coverage": [
    "feed", "flux", "fuente", "quelle", "bron", "kaynak", "源", "フィード", "피드", "источник",
    "مصدر",
  ],
};

const threatKeywords: Array<[string, string]> = [
  ["ransomware", "Ransomware"],
  ["rançongiciel", "Ransomware"],
  ["فدية", "Ransomware"],
  ["ransom", "Ransomware"],
  ["phishing", "Phishing"],
  ["hameçonnage", "Phishing"],
  ["تصيد", "Phishing"],
  ["malware", "Malware"],
  ["logiciel malveillant", "Malware"],
  ["برمجية خبيثة", "Malware"],
  ["c2", "C2 Callbacks"],
  ["callback", "C2 Callbacks"],
  ["ddos", "DDoS"],
  ["exploit", "Exploit"],
  ["vuln", "Exploit"],
  ["exfiltr", "Exfiltration"],
  ["credential", "Credential Abuse"],
  ["identifiant", "Credential Abuse"],
  ["بيانات الاعتماد", "Credential Abuse"],
  ["cloud", "Cloud Misuse"],
  ["insider", "Insider Threat"],
];

function classify(prompt: string): CopilotIntent {
  const text = prompt.toLowerCase();
  for (const [keyword, category] of threatKeywords) {
    if (text.includes(keyword)) {
      const matched = ThreatRepository.list().find((t) => t.category === category);
      if (matched) return "matched-threat";
    }
  }
  for (const [intent, keywords] of Object.entries(intentKeywords) as Array<
    [Exclude<CopilotIntent, "fallback" | "matched-threat">, string[]]
  >) {
    if (keywords.some((k) => text.includes(k))) return intent;
  }
  return "fallback";
}

function matchedThreatFromPrompt(prompt: string) {
  const text = prompt.toLowerCase();
  for (const [keyword, category] of threatKeywords) {
    if (text.includes(keyword)) {
      const matched = ThreatRepository.list().find((t) => t.category === category);
      if (matched) return matched;
    }
  }
  return null;
}

const severityLabelKey: Record<Severity, string> = {
  critical: "copilot.severityCritical",
  high: "copilot.severityHigh",
  medium: "copilot.severityMedium",
  low: "copilot.severityLow",
  info: "copilot.severityLow",
};

export function answerSecurityQuery(prompt: string, locale: Locale = defaultLocale): AIResponse {
  const dict = getDictionary(locale);
  const c = dict.copilot;
  const intent = classify(prompt);
  const queryId = `Q-${Math.abs(hashString(prompt)).toString(36).slice(0, 8)}`;
  const sev = (s: Severity) => dict.copilot[severityLabelKey[s].split(".")[1] as "severityCritical"];

  const base = { queryId, confidence: 0.86 };

  switch (intent) {
    case "threat-summary": {
      const counts = StatisticsService.headlineCounts();
      const topCategory = ThreatRepository.list()[0]?.category ?? "Credential Abuse";
      return {
        ...base,
        headline: c.threatSummary.headline,
        summary: c.threatSummary.summary
          .replace("{critical}", String(counts.criticalIncidents))
          .replace("{high}", String(counts.highAlerts))
          .replace("{events}", String(counts.suspiciousEvents)),
        bullets: [
          `${c.threatSummary.categoryLabel}: ${topCategory}`,
          `${ThreatRepository.list().length} threat families tracked across ${FeedRepository.active().length} active feeds`,
        ],
        recommendations: [c.threatSummary.rec1, c.threatSummary.rec2, c.threatSummary.rec3],
        sources: [c.threatSummary.sourceLabel, "SIEM", "EDR"],
        confidence: 0.92,
      };
    }
    case "top-risks": {
      const risks = RiskRepository.top(3);
      return {
        ...base,
        headline: c.topRisks.headline,
        summary: c.topRisks.summary
          .replace("{avg}", String(RiskRepository.averageScore()))
          .replace("{count}", String(RiskRepository.list().length))
          .replace("{critical}", String(RiskRepository.list().filter((r) => r.severity === "critical").length)),
        bullets: risks.map((r) => `${r.id} · ${r.title} — ${r.score}/100 (${sev(r.severity)})`),
        recommendations: [c.topRisks.rec1, c.topRisks.rec2, c.topRisks.rec3],
        sources: [c.topRisks.sourceLabel],
        confidence: 0.9,
      };
    }
    case "compliance-status": {
      const frameworks = ComplianceRepository.list();
      return {
        ...base,
        headline: c.compliance.headline,
        summary: c.compliance.summary
          .replace("{frameworks}", String(frameworks.length))
          .replace("{coverage}", String(ComplianceRepository.averageCoverage()))
          .replace("{attention}", String(ComplianceRepository.attention().length)),
        bullets: frameworks.slice(0, 5).map((f) => `${f.shortName} — ${f.coverage}% (${f.controlsImplemented}/${f.controlsTotal})`),
        recommendations: [c.compliance.rec1, c.compliance.rec2, c.compliance.rec3],
        sources: [c.compliance.sourceLabel],
        confidence: 0.88,
      };
    }
    case "incident-report": {
      const open = IncidentRepository.list({ status: "open" });
      const all = IncidentRepository.list();
      const highest = [...all].sort((a, b) => sevRank(b.severity) - sevRank(a.severity))[0];
      return {
        ...base,
        headline: c.incidentReport.headline,
        summary: c.incidentReport.summary
          .replace("{open}", String(IncidentRepository.openCount()))
          .replace("{severity}", highest ? sev(highest.severity) : "n/a")
          .replace("{incidentId}", highest?.id ?? "n/a"),
        bullets: open.slice(0, 4).map((i) => `${i.id} · ${i.title} — ${sev(i.severity)} · ${i.mitreTactic}`),
        recommendations: [c.incidentReport.rec1, c.incidentReport.rec2, c.incidentReport.rec3],
        sources: [c.incidentReport.sourceLabel],
        confidence: 0.87,
      };
    }
    case "identity-posture": {
      const total = IdentityRepository.count();
      const noMfa = IdentityRepository.withoutMfa().length;
      const highRisk = IdentityRepository.highRisk().length;
      return {
        ...base,
        headline: c.identity.headline,
        summary: c.identity.summary
          .replace("{total}", String(total))
          .replace("{noMfa}", String(noMfa))
          .replace("{highRisk}", String(highRisk)),
        bullets: IdentityRepository.withoutMfa()
          .slice(0, 3)
          .map((i) => `${i.name} — ${i.role} · ${i.email}`),
        recommendations: [c.identity.rec1, c.identity.rec2, c.identity.rec3],
        sources: [c.identity.sourceLabel],
        confidence: 0.89,
      };
    }
    case "asset-posture": {
      return {
        ...base,
        headline: c.assets.headline,
        summary: c.assets.summary
          .replace("{total}", String(AssetRepository.count()))
          .replace("{avg}", String(AssetRepository.averageRisk()))
          .replace("{atRisk}", String(AssetRepository.atRisk())),
        bullets: AssetRepository.list({})
          .filter((a) => a.status !== "healthy")
          .slice(0, 3)
          .map((a) => `${a.name} · ${a.environment} — risk ${a.riskScore}/100`),
        recommendations: [c.assets.rec1, c.assets.rec2, c.assets.rec3],
        sources: [c.assets.sourceLabel],
        confidence: 0.86,
      };
    }
    case "feed-coverage": {
      const feeds = FeedRepository.list();
      return {
        ...base,
        headline: c.feeds.headline,
        summary: c.feeds.summary
          .replace("{active}", String(FeedRepository.active().length))
          .replace("{total}", String(feeds.length))
          .replace("{indicators}", FeedRepository.totalIndicators().toLocaleString("en-US")),
        bullets: feeds.slice(0, 4).map((f) => `${f.name} — ${f.status} · reliability ${f.reliability}%`),
        recommendations: [c.feeds.rec1, c.feeds.rec2, c.feeds.rec3],
        sources: [c.feeds.sourceLabel],
        confidence: 0.85,
      };
    }
    case "matched-threat": {
      const threat = matchedThreatFromPrompt(prompt);
      if (threat) {
        return {
          ...base,
          headline: c.matched.headline,
          summary: c.matched.summary
            .replace("{name}", threat.name)
            .replace("{category}", threat.category)
            .replace("{severity}", sev(threat.severity))
            .replace("{count}", threat.count.toLocaleString("en-US")),
          bullets: [
            `${threat.id} · source ${threat.source}`,
            `${dict.common.severity}: ${sev(threat.severity)} · ${dict.common.status}: ${threat.status}`,
          ],
          recommendations: [c.matched.rec1, c.matched.rec2, c.matched.rec3],
          sources: [c.matched.sourceLabel],
          confidence: 0.91,
        };
      }
      break;
    }
    default:
      break;
  }

  const counts = StatisticsService.headlineCounts();
  return {
    ...base,
    headline: c.fallback.headline,
    summary: c.fallback.summary
      .replace("{critical}", String(counts.criticalIncidents))
      .replace("{alerts}", String(AlertRepository.list().length + EventRepository.list().length)),
    bullets: [
      `${ThreatRepository.list().length} threats · ${IncidentRepository.list().length} incidents`,
      `${ComplianceRepository.list().length} compliance frameworks`,
    ],
    recommendations: [c.fallback.rec1, c.fallback.rec2, c.fallback.rec3],
    sources: [c.fallback.sourceLabel],
    confidence: 0.7,
  };
}

function sevRank(severity: Severity): number {
  return { critical: 4, high: 3, medium: 2, low: 1, info: 0 }[severity];
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export const suggestedPrompts = [
  "compliance.quick1",
  "compliance.quick2",
  "compliance.quick3",
  "compliance.quick4",
] as const;
