"use client";

import { ArrowRight, Building2, Cloud, Landmark, ShieldCheck, RadioTower, Factory, Check } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useAppModals } from "@/components/providers/AppModals";
import { Button } from "@/components/ui/Button";
import { Chip, StatusDot } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ThreatGlobe } from "@/features/hero/ThreatGlobe";
import { LiveThreatPanel } from "@/features/hero/LiveThreatPanel";

const sectors = [
  { labelKey: "trust.government", Icon: ShieldCheck },
  { labelKey: "trust.enterprise", Icon: Building2 },
  { labelKey: "trust.financial", Icon: Landmark },
  { labelKey: "trust.telecom", Icon: RadioTower },
  { labelKey: "trust.cloud", Icon: Cloud },
  { labelKey: "trust.critical", Icon: Factory },
];

export function Hero() {
  const { t } = useI18n();
  const { openAuth } = useAppModals();

  return (
    <section className="relative overflow-hidden pt-[68px]">
      <div className="pointer-events-none absolute inset-0 dc-grid-bg dc-radial-fade opacity-70" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 start-1/3 h-[520px] w-[520px] rounded-full bg-dc-green/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="dc-container relative pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:gap-16">
          <div className="flex flex-col items-start">
            <Reveal y={16}>
              <Chip>{t("hero.badge")}</Chip>
            </Reveal>

            <Reveal delay={0.06} y={22}>
              <h1 className="mt-5 text-balance text-[38px] font-extrabold leading-[1.03] tracking-[-0.03em] text-dc-text sm:text-[52px] lg:text-[58px] xl:text-[64px]">
                {t("hero.title1")}
                <br />
                {t("hero.title2")}{" "}
                <span className="dc-text-glow text-dc-green">{t("hero.title3")}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12} y={20}>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-dc-muted sm:text-base">
                {t("hero.subtitle")}
              </p>
            </Reveal>

            <Reveal delay={0.18} y={18}>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => openAuth("trial")}>
                  {t("hero.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
                <Button size="lg" variant="secondary" onClick={() => openAuth("demo")}>
                  {t("hero.ctaSecondary")}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.24} y={16}>
              <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {[t("hero.point1"), t("hero.point2"), t("hero.point3")].map((point) => (
                  <li key={point} className="flex items-center gap-1.5 text-[12.5px] text-dc-muted">
                    <Check className="h-3.5 w-3.5 text-dc-green" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.3} y={16} className="mt-10 w-full">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-dc-muted-2">
                {t("hero.trustedBy")}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
                {sectors.map(({ labelKey, Icon }) => (
                  <span key={labelKey} className="flex items-center gap-2 text-dc-muted/70">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[12px] font-semibold uppercase tracking-wider">{t(labelKey)}</span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} y={28} className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[620px] lg:mx-0 lg:-ms-10 lg:max-w-[660px] xl:-ms-14">
              <ThreatGlobe className="absolute inset-0 h-full w-full" />

              <div className="absolute left-[2%] top-[12%] hidden rounded-lg border border-[color:var(--sev-critical)]/40 bg-dc-black/85 px-3 py-2 backdrop-blur sm:block">
                <span className="flex items-center gap-2">
                  <StatusDot severity="critical" pulse />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--sev-critical)]">
                    {t("hero.ransomware")}
                  </span>
                </span>
                <span className="mt-0.5 block text-[11px] text-dc-muted">{t("hero.activeCampaign")}</span>
              </div>

              <div className="absolute right-[16%] top-[30%] hidden rounded-lg border border-dc-green/40 bg-dc-black/85 px-3 py-2 backdrop-blur md:block">
                <span className="flex items-center gap-2">
                  <StatusDot severity="info" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-dc-green">
                    {t("hero.threatBlocked")}
                  </span>
                </span>
                <span className="mt-0.5 block font-mono text-[11px] text-dc-text">192.168.1.0</span>
                <span className="block text-[10px] text-dc-muted">{t("hero.maliciousIp")}</span>
              </div>

              <div className="absolute bottom-[22%] left-[2%] hidden rounded-lg border border-[color:var(--sev-medium)]/40 bg-dc-black/85 px-3 py-2 backdrop-blur md:block">
                <span className="flex items-center gap-2">
                  <StatusDot severity="medium" pulse />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--sev-medium)]">
                    {t("hero.suspiciousLogin")}
                  </span>
                </span>
                <span className="mt-0.5 block text-[11px] text-dc-muted">{t("hero.multiLocations")}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center lg:mt-0 lg:absolute lg:end-0 lg:top-1/2 lg:-translate-y-1/2">
              <LiveThreatPanel />
            </div>
          </Reveal>
        </div>
      </div>

      <div className="dc-container">
        <div className="dc-hairline" />
      </div>
    </section>
  );
}
