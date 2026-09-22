export interface NavChild {
  labelKey: string;
  descKey?: string;
  href: string;
  icon?: string;
}

export interface NavItem {
  labelKey: string;
  href: string;
  children?: NavChild[];
  columns?: 1 | 2;
}

export const navItems: NavItem[] = [
  {
    labelKey: "nav.platform",
    href: "#platform",
    columns: 2,
    children: [
      { labelKey: "capabilities.threatOps.title", descKey: "capabilities.threatOps.desc", href: "#platform", icon: "ShieldAlert" },
      { labelKey: "capabilities.compliance.title", descKey: "capabilities.compliance.desc", href: "#compliance", icon: "FileCheck2" },
      { labelKey: "capabilities.identity.title", descKey: "capabilities.identity.desc", href: "#platform", icon: "Fingerprint" },
      { labelKey: "capabilities.ai.title", descKey: "capabilities.ai.desc", href: "#copilot", icon: "BrainCircuit" },
      { labelKey: "capabilities.sovereign.title", descKey: "capabilities.sovereign.desc", href: "#platform", icon: "ServerCog" },
      { labelKey: "dashboard.label", descKey: "dashboard.subtitle", href: "#dashboard", icon: "LayoutDashboard" },
    ],
  },
  {
    labelKey: "nav.solutions",
    href: "#visibility",
    columns: 2,
    children: [
      { labelKey: "visibility.title1", descKey: "visibility.subtitle", href: "#visibility", icon: "Globe2" },
      { labelKey: "architecture.detection", descKey: "architecture.detectionDesc", href: "#architecture", icon: "Radar" },
      { labelKey: "architecture.response", descKey: "architecture.responseDesc", href: "#architecture", icon: "Zap" },
      { labelKey: "architecture.reporting", descKey: "architecture.reportingDesc", href: "#architecture", icon: "FileBarChart" },
    ],
  },
  {
    labelKey: "nav.industries",
    href: "#trust",
    columns: 2,
    children: [
      { labelKey: "trust.cloud", href: "#trust", icon: "Cloud" },
      { labelKey: "trust.enterprise", href: "#trust", icon: "Building2" },
      { labelKey: "trust.financial", href: "#trust", icon: "Landmark" },
      { labelKey: "trust.telecom", href: "#trust", icon: "RadioTower" },
      { labelKey: "trust.critical", href: "#trust", icon: "Factory" },
      { labelKey: "trust.government", href: "#trust", icon: "ShieldCheck" },
    ],
  },
  {
    labelKey: "nav.research",
    href: "#architecture",
    children: [
      { labelKey: "footer.resourceLinks.blog", href: "#architecture", icon: "Newspaper" },
      { labelKey: "footer.resourceLinks.research", href: "#architecture", icon: "FlaskConical" },
      { labelKey: "footer.resourceLinks.docs", href: "#architecture", icon: "BookOpen" },
      { labelKey: "footer.resourceLinks.support", href: "#architecture", icon: "LifeBuoy" },
    ],
  },
  {
    labelKey: "nav.company",
    href: "#scale",
    children: [
      { labelKey: "footer.companyLinks.about", href: "#scale", icon: "Users" },
      { labelKey: "footer.companyLinks.careers", href: "#scale", icon: "Briefcase" },
      { labelKey: "footer.companyLinks.partners", href: "#trust", icon: "Handshake" },
      { labelKey: "footer.companyLinks.contact", href: "#cta", icon: "Mail" },
    ],
  },
  {
    labelKey: "nav.pricing",
    href: "#cta",
  },
];

export interface SearchEntry {
  labelKey: string;
  descKey?: string;
  href: string;
  category: string;
}

export const searchIndex: SearchEntry[] = [
  { labelKey: "capabilities.threatOps.title", descKey: "capabilities.threatOps.desc", href: "#platform", category: "Platform" },
  { labelKey: "capabilities.compliance.title", descKey: "capabilities.compliance.desc", href: "#compliance", category: "Platform" },
  { labelKey: "capabilities.identity.title", descKey: "capabilities.identity.desc", href: "#platform", category: "Platform" },
  { labelKey: "capabilities.ai.title", descKey: "capabilities.ai.desc", href: "#copilot", category: "Platform" },
  { labelKey: "capabilities.sovereign.title", descKey: "capabilities.sovereign.desc", href: "#platform", category: "Platform" },
  { labelKey: "visibility.title1", descKey: "visibility.subtitle", href: "#visibility", category: "Threat Intelligence" },
  { labelKey: "dashboard.title", descKey: "dashboard.subtitle", href: "#dashboard", category: "Dashboard" },
  { labelKey: "architecture.label", descKey: "architecture.subtitle", href: "#architecture", category: "Architecture" },
  { labelKey: "compliance.copilotTitle", descKey: "compliance.copilotGreeting", href: "#copilot", category: "AI Copilot" },
  { labelKey: "trust.label", descKey: "trust.note", href: "#trust", category: "Trust" },
  { labelKey: "scale.title1", descKey: "scale.quote", href: "#scale", category: "Company" },
  { labelKey: "footer.platformLinks.threatOps", href: "#platform", category: "Platform" },
  { labelKey: "footer.platformLinks.compliance", href: "#compliance", category: "Platform" },
  { labelKey: "footer.resourceLinks.docs", href: "#architecture", category: "Resources" },
  { labelKey: "footer.resourceLinks.research", href: "#architecture", category: "Resources" },
  { labelKey: "nav.pricing", href: "#cta", category: "Company" },
];
