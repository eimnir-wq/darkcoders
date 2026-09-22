"use client";

import { useI18n } from "@/i18n/provider";
import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

export function HeroMetrics() {
  const { t } = useI18n();

  const metrics = [
    { end: 250, suffix: "M+", label: t("metrics.iocs") },
    { end: 180, suffix: "+", label: t("metrics.countries") },
    { end: 50, suffix: "+", label: t("metrics.feeds") },
    { end: 0.9, decimals: 1, prefix: "<", suffix: "s", label: t("metrics.detection") },
  ];

  return (
    <section aria-label="Platform metrics" className="relative border-y border-dc-border bg-dc-bg/60">
      <div className="dc-container">
        <dl className="grid grid-cols-2 divide-dc-border lg:grid-cols-4 lg:divide-x">
          {metrics.map((metric, i) => (
            <Reveal key={metric.label} delay={i * 0.06}>
              <div className="flex flex-col gap-1 px-2 py-7 lg:px-8">
                <dd className="text-3xl font-extrabold tracking-tight text-dc-green sm:text-4xl">
                  <Counter
                    end={metric.end}
                    decimals={metric.decimals ?? 0}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </dd>
                <dt className="text-[12.5px] font-medium uppercase tracking-wider text-dc-muted">
                  {metric.label}
                </dt>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
