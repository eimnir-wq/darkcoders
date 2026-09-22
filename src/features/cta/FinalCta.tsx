"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useAppModals } from "@/components/providers/AppModals";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  const { t } = useI18n();
  const { openAuth } = useAppModals();

  return (
    <section id="cta" className="scroll-mt-24 py-20 lg:py-28">
      <div className="dc-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-dc-green/40 bg-gradient-to-br from-dc-green via-dc-green-deep to-[#00b862] p-8 shadow-[0_0_90px_-30px_rgba(0,255,136,0.7)] sm:p-12 lg:p-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(#050807 1px, transparent 1px), linear-gradient(90deg, #050807 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-dc-black/10 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative max-w-2xl">
              <h2 className="text-balance text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-dc-black sm:text-4xl lg:text-[46px]">
                {t("finalCta.title1")}
                <br />
                {t("finalCta.title2")}
              </h2>
              <p className="mt-4 text-[15px] font-medium text-dc-black/75">{t("finalCta.subtitle")}</p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={() => openAuth("trial")}
                  className="bg-dc-black text-dc-green hover:bg-dc-surface-2 hover:text-dc-green-soft"
                >
                  {t("finalCta.ctaPrimary")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => openAuth("demo")}
                  className="border-dc-black/50 text-dc-black hover:border-dc-black hover:bg-dc-black/10"
                >
                  {t("finalCta.ctaSecondary")}
                </Button>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-dc-black/60">
                {t("finalCta.note")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
