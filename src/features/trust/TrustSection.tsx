"use client";

import {
  Building2,
  Cloud,
  Factory,
  Landmark,
  RadioTower,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";

const sectors: Array<{ key: string; Icon: LucideIcon }> = [
  { key: "trust.cloud", Icon: Cloud },
  { key: "trust.enterprise", Icon: Building2 },
  { key: "trust.financial", Icon: Landmark },
  { key: "trust.telecom", Icon: RadioTower },
  { key: "trust.critical", Icon: Factory },
  { key: "trust.government", Icon: ShieldCheck },
];

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section id="trust" className="scroll-mt-24 border-y border-dc-border bg-dc-bg/60 py-16 lg:py-20">
      <div className="dc-container">
        <Reveal>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="dc-label">{t("trust.label")}</span>
            <p className="max-w-2xl text-[12px] text-dc-muted-2">* {t("trust.note")}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {sectors.map(({ key, Icon }, index) => (
            <Reveal key={key} delay={index * 0.06} className="h-full">
              <div className="dc-card dc-card-hover flex h-full flex-col items-center justify-center gap-3 px-4 py-7 text-center">
                <Icon className="h-6 w-6 text-dc-green/80" aria-hidden="true" />
                <span className="text-[12px] font-semibold uppercase tracking-wider text-dc-muted">
                  {t(key)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
