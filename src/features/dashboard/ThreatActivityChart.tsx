"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { liveThreatActivity } from "@/data/mock";
import { useI18n } from "@/i18n/provider";

export default function ThreatActivityChart() {
  const { t } = useI18n();

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={liveThreatActivity} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="dc-area-threats" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff88" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#00ff88" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="dc-area-blocked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="dc-area-incidents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff8a3d" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#ff8a3d" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(0,255,136,0.08)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#5f776e", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "rgba(0,255,136,0.14)" }}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: "#5f776e", fontSize: 10, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "#0b1511",
              border: "1px solid rgba(0,255,136,0.24)",
              borderRadius: 10,
              fontSize: 12,
              color: "#e9fff6",
            }}
            labelStyle={{ color: "#7cffbe", fontFamily: "var(--font-mono)", fontSize: 11 }}
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="threats"
            name={t("dashboard.kpiThreats")}
            stroke="#00ff88"
            strokeWidth={2}
            fill="url(#dc-area-threats)"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="blocked"
            name={t("hero.statBlocked")}
            stroke="#38bdf8"
            strokeWidth={1.6}
            fill="url(#dc-area-blocked)"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="incidents"
            name={t("dashboard.kpiIncidents")}
            stroke="#ff8a3d"
            strokeWidth={1.6}
            fill="url(#dc-area-incidents)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
