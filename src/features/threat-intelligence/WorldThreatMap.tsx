"use client";

import { useMemo } from "react";
import { getWorldDots } from "@/data/worldDots";
import { geoThreatNodes } from "@/data/mock";
import { severityVar } from "@/lib/utils";
import type { GeoThreatNode } from "@/types/domain";

const W = 720;
const H = 360;

function project(lon: number, lat: number) {
  return {
    x: ((lon + 180) / 360) * W,
    y: ((90 - lat) / 180) * H,
  };
}

export function WorldThreatMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (node: GeoThreatNode | null) => void;
}) {
  const dotsPath = useMemo(() => {
    let d = "";
    for (const dot of getWorldDots()) {
      if (dot.lat < -58) continue;
      const { x, y } = project(dot.lon, dot.lat);
      d += `M${x.toFixed(1)} ${y.toFixed(1)}m-1.15 0a1.15 1.15 0 1 0 2.3 0a1.15 1.15 0 1 0 -2.3 0`;
    }
    return d;
  }, []);

  const nodes = useMemo(
    () => geoThreatNodes.map((node) => ({ node, ...project(node.lon, node.lat) })),
    [],
  );

  const arcs = useMemo(() => {
    const picked = nodes.filter((_, i) => i % 3 === 0).slice(0, 7);
    return picked.map((from, i) => {
      const to = nodes[(nodes.indexOf(from) + 4) % nodes.length]!;
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2 - Math.abs(from.x - to.x) * 0.22 - 18;
      return {
        id: `${from.node.id}-${to.node.id}`,
        d: `M${from.x.toFixed(1)} ${from.y.toFixed(1)} Q${midX.toFixed(1)} ${midY.toFixed(1)} ${to.x.toFixed(1)} ${to.y.toFixed(1)}`,
        severity: from.node.severity,
        delay: i * 0.5,
      };
    });
  }, [nodes]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="img"
      aria-label="World map of live cyber threat activity"
    >
      <defs>
        <radialGradient id="dc-map-glow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
        <filter id="dc-node-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#dc-map-glow)" />
      <path d={dotsPath} fill="#12a86c" fillOpacity="0.9" />
      <path d={dotsPath} fill="#00ff88" fillOpacity="0.18" />

      {arcs.map((arc) => (
        <path
          key={arc.id}
          d={arc.d}
          fill="none"
          stroke={severityVar[arc.severity]}
          strokeWidth="1"
          strokeOpacity="0.45"
          className="dc-dash-path"
          style={{ animationDelay: `${arc.delay}s` }}
        />
      ))}

      {nodes.map(({ node, x, y }) => {
        const active = selectedId === node.id;
        const r = active ? 7 : 4 + Math.min(4, node.count / 260);
        return (
          <g
            key={node.id}
            transform={`translate(${x} ${y})`}
            className="cursor-pointer"
            onClick={() => onSelect(active ? null : node)}
            onMouseEnter={() => onSelect(node)}
            tabIndex={0}
            role="button"
            aria-label={`${node.label}, ${node.country}: ${node.count} ${node.vector} events`}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(active ? null : node);
              }
            }}
          >
            <circle
              r={r * 2.6}
              fill={severityVar[node.severity]}
              fillOpacity={active ? 0.22 : 0.1}
              className="animate-dc-pulse"
              style={{ transformOrigin: "center" }}
            />
            <circle
              r={r}
              fill={severityVar[node.severity]}
              filter="url(#dc-node-glow)"
              stroke="#050807"
              strokeWidth="1"
            />
            {active && (
              <>
                <line x1={0} y1={-r - 3} x2={0} y2={-18} stroke={severityVar[node.severity]} strokeWidth="1" />
                <circle cy={-20} r="2.4" fill={severityVar[node.severity]} />
              </>
            )}
            <title>{`${node.label} · ${node.country} — ${node.count} ${node.vector}`}</title>
          </g>
        );
      })}
    </svg>
  );
}
