"use client";

import { ArrowRight, ShieldAlert, FileCheck2, Fingerprint, BrainCircuit, ServerCog, type LucideIcon } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

interface Capability {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  featureKeys: string[];
  href: string;
}

const capabilities: Capability[] = [
  {
    icon: ShieldAlert,
    titleKey: "capabilities.threatOps.title",
    descKey: "capabilities.threatOps.desc",
    featureKeys: ["capabilities.threatOps.f1", "capabilities.threatOps.f2", "capabilities.threatOps.f3", "capabilities.threatOps.f4"],
    href: "#dashboard",
  },
  {
    icon: FileCheck2,
    titleKey: "capabilities.compliance.title",
    descKey: "capabilities.compliance.desc",
    featureKeys: ["capabilities.compliance.f1", "capabilities.compliance.f2", "capabilities.compliance.f3", "capabilities.compliance.f4"],
    href: "#compliance",
  },
  {
    icon: Fingerprint,
    titleKey: "capabilities.identity.title",
    descKey: "capabilities.identity.desc",
    featureKeys: ["capabilities.identity.f1", "capabilities.identity.f2", "capabilities.identity.f3", "capabilities.identity.f4"],
    href: "#dashboard",
  },
  {
    icon: BrainCircuit,
    titleKey: "capabilities.ai.title",
    descKey: "capabilities.ai.desc",
    featureKeys: ["capabilities.ai.f1", "capabilities.ai.f2", "capabilities.ai.f3", "capabilities.ai.f4"],
    href: "#copilot",
  },
  {
    icon: ServerCog,
    titleKey: "capabilities.sovereign.title",
    descKey: "capabilities.sovereign.desc",
    featureKeys: ["capabilities.sovereign.f1", "capabilities.sovereign.f2", "capabilities.sovereign.f3", "capabilities.sovereign.f4"],
    href: "#architecture",
  },
];

export function Capabilities() {
  const { t } = useI18n();

  return (
    <section id="platform" className="scroll-mt-24 py-20 lg:py-28">
      <div className="dc-container">
        <SectionHeading
          label={t("capabilities.label")}
          title={t("capabilities.title")}
          subtitle={t("capabilities.subtitle")}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Reveal key={capability.titleKey} delay={index * 0.05} className="h-full">
                <a
                  href={capability.href}
                  className={cn(
                    "dc-card dc-card-hover group flex h-full flex-col p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dc-green",
                  )}
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-dc-border bg-dc-green/8 text-dc-green transition-all duration-300 group-hover:border-dc-green/50 group-hover:bg-dc-green/15 group-hover:shadow-[0_0_28px_-8px_rgba(0,255,136,0.7)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-4 text-[16px] font-bold tracking-tight text-dc-text">
                    {t(capability.titleKey)}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-dc-muted">{t(capability.descKey)}</p>

                  <ul className="mt-4 flex flex-col gap-1.5 border-t border-dc-border pt-4">
                    {capability.featureKeys.map((key) => (
                      <li key={key} className="flex items-start gap-2 text-[12px] text-dc-muted">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-dc-green" aria-hidden="true" />
                        {t(key)}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-dc-green">
                    {t("common.learnMore")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180" />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
