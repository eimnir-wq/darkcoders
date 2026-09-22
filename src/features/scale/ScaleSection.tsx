"use client";

import { useI18n } from "@/i18n/provider";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";

export function ScaleSection() {
  const { t } = useI18n();

  const metrics = [
    { end: 500, suffix: "+", label: t("scale.orgs") },
    { end: 60, suffix: "+", label: t("scale.countries") },
    { end: 99.99, decimals: 2, suffix: "%", label: t("scale.uptime") },
    { end: 24, suffix: "/7", label: t("scale.monitoring") },
  ];

  return (
    <section id="scale" className="relative scroll-mt-24 overflow-hidden border-y border-dc-border py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-dc-black via-dc-bg to-dc-black" aria-hidden="true" />
      <div className="absolute inset-0 dc-grid-bg opacity-30" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dc-green/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-dc-green/8 blur-[150px]"
        aria-hidden="true"
      />

      <div className="dc-container relative">
        <Reveal>
          <span className="dc-label">{t("scale.label")}</span>
        </Reveal>

        <div className="mt-5 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <Reveal delay={0.05}>
            <h2 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-dc-text sm:text-5xl lg:text-[56px]">
              {t("scale.title1")}
              <br />
              <span className="text-dc-green dc-text-glow">{t("scale.title2")}</span>
            </h2>
            <p className="mt-5 max-w-lg text-[15px] italic leading-relaxed text-dc-muted">
              “{t("scale.quote")}”
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-dc-green">
              <span className="h-px w-8 bg-dc-green" aria-hidden="true" />
              {t("scale.tagline")}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="grid grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-dc-border bg-dc-surface/40 p-5 backdrop-blur"
                >
                  <dd className="text-3xl font-extrabold tracking-tight text-dc-green sm:text-4xl">
                    <Counter
                      end={metric.end}
                      decimals={metric.decimals ?? 0}
                      suffix={metric.suffix}
                    />
                  </dd>
                  <dt className="mt-1.5 text-[11.5px] uppercase tracking-wider text-dc-muted">
                    {metric.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
