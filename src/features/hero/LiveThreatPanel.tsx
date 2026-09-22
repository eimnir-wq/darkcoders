"use client";

import { ArrowDownRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { useLiveFeed, useLiveStats } from "@/hooks/useLiveFeed";
import { LiveBadge, StatusDot } from "@/components/ui/Badge";
import { heroStats } from "@/data/mock";
import { formatNumber, timeAgo } from "@/lib/utils";

export function LiveThreatPanel() {
  const { t } = useI18n();
  const { events } = useLiveFeed(6, 4200);
  const bump = useLiveStats();

  const stats = [
    {
      label: t("hero.statBlocked"),
      value: formatNumber(heroStats.threatsBlocked + bump),
      delta: "+23%",
      up: true,
    },
    {
      label: t("hero.statIncidents"),
      value: formatNumber(heroStats.activeIncidents),
      delta: "-12%",
      up: false,
    },
    {
      label: t("hero.statUptime"),
      value: `${heroStats.uptime}%`,
      delta: "+0.01%",
      up: true,
    },
  ];

  return (
    <div className="dc-panel w-full max-w-[420px] p-5 shadow-[0_40px_120px_-40px_rgba(0,255,136,0.35)] lg:max-w-[380px]">
      <div className="flex items-center justify-between gap-3">
        <LiveBadge label={t("hero.liveTitle")} />
        <ShieldCheck className="h-4 w-4 text-dc-green/70" aria-hidden="true" />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-dc-border bg-dc-black/40 p-3">
            <dd dir="ltr" className="font-mono text-lg font-bold tracking-tight text-dc-text">{stat.value}</dd>
            <dt className="mt-0.5 text-[11px] leading-tight text-dc-muted">{stat.label}</dt>
            <span
              className={`mt-1.5 inline-flex items-center gap-0.5 font-mono text-[10px] ${
                stat.up ? "text-dc-green" : "text-[color:var(--sev-critical)]"
              }`}
            >
              {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {stat.delta}
            </span>
          </div>
        ))}
      </dl>

      <div className="mt-5">
        <div className="mb-2.5 flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-dc-muted">
            {t("hero.realtime")}
          </h3>
          <span className="font-mono text-[10px] text-dc-green/70">{events.length}</span>
        </div>
        <ul className="flex flex-col gap-1" aria-live="polite">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-center gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-dc-green/5"
            >
              <StatusDot severity={event.severity} pulse={event.severity === "critical"} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12.5px] text-dc-text/90">{t(event.titleKey)}</span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-dc-muted-2">
                  {event.category} · {event.region}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[10px] text-dc-muted">
                {timeAgo(event.timestamp)} {t("common.ago")}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#visibility"
        className="mt-4 flex items-center justify-between rounded-lg border border-dc-border bg-dc-green/5 px-3.5 py-2.5 text-[12.5px] font-medium text-dc-green transition-colors hover:bg-dc-green/10"
      >
        {t("hero.viewMap")}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
