"use client";

import { ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const stages = [
  { key: "data", num: "01" },
  { key: "ingestion", num: "02" },
  { key: "intelligence", num: "03" },
  { key: "detection", num: "04" },
  { key: "analysis", num: "05" },
  { key: "response", num: "06" },
  { key: "reporting", num: "07" },
] as const;

export function ArchitectureFlow() {
  const { t } = useI18n();

  return (
    <section id="architecture" className="relative scroll-mt-24 overflow-hidden py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,255,136,0.08), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div className="dc-container relative">
        <SectionHeading
          align="center"
          label={t("architecture.label")}
          title={
            <>
              {t("architecture.title1")}{" "}
              <span className="text-dc-green">{t("architecture.title2")}</span>
            </>
          }
          subtitle={t("architecture.subtitle")}
        />

        <div className="mt-14 grid gap-3 lg:grid-cols-7 lg:gap-2">
          {stages.map((stage, index) => (
            <Reveal key={stage.key} delay={index * 0.06} className="h-full">
              <div
                className={cn(
                  "dc-card dc-card-hover group relative flex h-full flex-col gap-2 p-4",
                  "lg:items-start",
                )}
              >
                <span className="font-mono text-[10px] tracking-widest text-dc-green/70">{stage.num}</span>
                <h3 className="font-mono text-[12px] font-bold uppercase tracking-[0.14em] text-dc-text">
                  {t(`architecture.${stage.key}`)}
                </h3>
                <p className="text-[11.5px] leading-relaxed text-dc-muted">
                  {t(`architecture.${stage.key}Desc`)}
                </p>

                <span className="mt-2 h-px w-full bg-gradient-to-r from-dc-green/60 to-transparent" />

                {index < stages.length - 1 && (
                  <ChevronRight
                    className="absolute -end-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-dc-green/50 lg:block rtl:rotate-180"
                    aria-hidden="true"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
