"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Severity } from "@/types/domain";
import { BASE_TIME, mulberry32 } from "@/data/mock";

export interface LiveEvent {
  id: string;
  titleKey: string;
  severity: Severity;
  category: string;
  timestamp: number;
  status: string;
  sourceIp: string;
  region: string;
}

const eventPool: Array<{ titleKey: string; severity: Severity; category: string; status: string }> = [
  { titleKey: "events.malware", severity: "critical", category: "Malware", status: "blocked" },
  { titleKey: "events.login", severity: "high", category: "Identity", status: "investigating" },
  { titleKey: "events.phishing", severity: "high", category: "Phishing", status: "blocked" },
  { titleKey: "events.vuln", severity: "critical", category: "Exploit", status: "mitigated" },
  { titleKey: "events.ddos", severity: "medium", category: "DDoS", status: "mitigated" },
  { titleKey: "events.credential", severity: "high", category: "Identity", status: "monitoring" },
  { titleKey: "events.exfiltration", severity: "critical", category: "Exfiltration", status: "contained" },
  { titleKey: "events.beacon", severity: "high", category: "C2", status: "monitoring" },
];

const regions = [
  "Paris", "London", "Frankfurt", "Amsterdam", "Madrid", "Rome", "Casablanca",
  "Riyadh", "Dubai", "New York", "Singapore", "Tokyo", "Sydney", "Toronto",
];

function buildEvent(seed: number, timestamp: number, index: number): LiveEvent {
  const rng = mulberry32(seed);
  const template = eventPool[Math.floor(rng() * eventPool.length)]!;
  return {
    id: `LIVE-${seed}-${index}`,
    titleKey: template.titleKey,
    severity: template.severity,
    category: template.category,
    timestamp,
    status: template.status,
    sourceIp: `${10 + Math.floor(rng() * 240)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}.${Math.floor(rng() * 255)}`,
    region: regions[Math.floor(rng() * regions.length)]!,
  };
}

export function useLiveFeed(initialCount = 6, intervalMs = 4200) {
  const initial = useMemo(
    () =>
      Array.from({ length: initialCount }, (_, i) =>
        buildEvent(1200 + i, BASE_TIME - (i * 7 + 2) * 60_000, i),
      ),
    [initialCount],
  );

  const [events, setEvents] = useState<LiveEvent[]>(initial);
  const [pulse, setPulse] = useState(0);
  const tick = useRef(initialCount);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      tick.current += 1;
      const seed = 1200 + tick.current;
      const next = buildEvent(seed, Date.now(), tick.current);
      setEvents((prev) => [next, ...prev].slice(0, initialCount));
      setPulse((p) => p + 1);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [initialCount, intervalMs]);

  return { events, pulse } as const;
}

export function useLiveStats(seed = 42) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      const rng = mulberry32(seed + Math.floor(Date.now() / 1000) % 100000);
      setOffset((prev) => prev + Math.floor(3 + rng() * 24));
    }, 3000);
    return () => window.clearInterval(id);
  }, [seed]);

  return offset;
}
