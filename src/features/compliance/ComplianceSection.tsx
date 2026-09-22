"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { FrameworkTiles } from "@/features/compliance/FrameworkTiles";
import { CopilotPanel } from "@/features/ai-copilot/CopilotPanel";
import { ComplianceRepository } from "@/services/repositories";

export function ComplianceSection() {
  const { t } = useI18n();

  return (
    <section id="compliance" className="scroll-mt-24 py-20 lg:py-28">
      <div className="dc-container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <div>
            <SectionHeading
              label={t("compliance.label")}
              title={
                <>
                  {t("compliance.title1")}
                  <br />
                  <span className="text-dc-green">{t("compliance.title2")}</span>
                </>
              }
              subtitle={t("compliance.subtitle")}
            />

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button variant="secondary" href="#dashboard">
                {t("compliance.explore")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
              <span className="font-mono text-[11px] text-dc-muted">
                {ComplianceRepository.averageCoverage()}% · {ComplianceRepository.totalControls()}{" "}
                {t("compliance.controls")}
              </span>
            </div>

            <div className="mt-8">
              <FrameworkTiles />
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-dc-muted-2">* {t("compliance.disclaimer")}</p>
          </div>

          <Reveal delay={0.1} className="lg:sticky lg:top-24 lg:self-start">
            <div id="copilot" className="scroll-mt-24">
              <CopilotPanel />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
