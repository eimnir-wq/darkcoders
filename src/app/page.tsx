import type { Metadata } from "next";
import { Hero } from "@/features/hero/Hero";
import { HeroMetrics } from "@/features/hero/HeroMetrics";
import { Capabilities } from "@/features/capabilities/Capabilities";
import { GlobalThreatMap } from "@/features/threat-intelligence/GlobalThreatMap";
import { ComplianceSection } from "@/features/compliance/ComplianceSection";
import { TrustSection } from "@/features/trust/TrustSection";
import { ArchitectureFlow } from "@/features/architecture/ArchitectureFlow";
import { DashboardPreview } from "@/features/dashboard/DashboardPreview";
import { ScaleSection } from "@/features/scale/ScaleSection";
import { FinalCta } from "@/features/cta/FinalCta";

export const metadata: Metadata = {
  title: "Dark Coders — Cybersecurity Operations Platform",
  description:
    "AI-powered cybersecurity, threat intelligence, compliance and security operations for modern enterprises. Hunt In The Darkness!",
  alternates: { canonical: "/" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dark Coders",
  slogan: "Hunt In The Darkness!",
  description:
    "AI-powered cybersecurity, threat intelligence, compliance and security operations for modern enterprises.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:5555",
  logo: "/brand/darkcoders-logo.png",
  sameAs: [
    "https://www.linkedin.com",
    "https://x.com",
    "https://github.com",
    "https://www.youtube.com",
  ],
  knowsAbout: [
    "Threat Intelligence",
    "SIEM",
    "SOAR",
    "GRC",
    "Zero Trust",
    "Incident Response",
    "AI Security",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // Structured data is static and controlled — safe to inline.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <HeroMetrics />
      <Capabilities />
      <GlobalThreatMap />
      <ComplianceSection />
      <TrustSection />
      <ArchitectureFlow />
      <DashboardPreview />
      <ScaleSection />
      <FinalCta />
    </>
  );
}
