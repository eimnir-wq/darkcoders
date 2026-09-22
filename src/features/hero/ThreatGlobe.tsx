"use client";

import { useEffect, useRef } from "react";
import { useMotionOK } from "@/hooks/useMotionPreference";
import { getWorldDots } from "@/data/worldDots";

const R = 122;
const GLOBE_DOTS = (() => {
  const all = getWorldDots();
  const stride = Math.max(1, Math.floor(all.length / 620));
  return all.filter((_, i) => i % stride === 0);
})();

function project(lon: number, lat: number, rotationDeg: number) {
  const phi = (lat * Math.PI) / 180;
  const theta = ((lon + rotationDeg) * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  return {
    x: R * cosPhi * Math.sin(theta),
    y: -R * Math.sin(phi),
    z: cosPhi * Math.cos(theta),
  };
}

export function ThreatGlobe({ className }: { className?: string }) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const motionOK = useMotionOK();

  useEffect(() => {
    let frame = 0;
    let rotation = 0;
    let last = 0;
    let running = true;

    const build = () => {
      let d = "";
      for (const dot of GLOBE_DOTS) {
        const p = project(dot.lon, dot.lat, rotation);
        if (p.z <= 0.03) continue;
        const depth = 0.45 + 0.55 * p.z;
        const r = 0.55 + 0.85 * depth;
        d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}m${(-r).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(r * 2).toFixed(2)} 0a${r.toFixed(2)} ${r.toFixed(2)} 0 1 0 ${(-r * 2).toFixed(2)} 0`;
      }
      pathRef.current?.setAttribute("d", d);
    };

    if (!motionOK) {
      rotation = 18;
      build();
      return;
    }

    const loop = (time: number) => {
      if (!running) return;
      if (time - last > 33) {
        rotation = (rotation + 0.22) % 360;
        build();
        last = time;
      }
      frame = requestAnimationFrame(loop);
    };

    build();
    frame = requestAnimationFrame(loop);

    const onVisibility = () => {
      running = document.visibilityState === "visible";
      if (running) frame = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [motionOK]);

  return (
    <div className={className}>
      <svg viewBox="-170 -170 340 340" className="h-full w-full" role="img" aria-label="Global threat activity globe">
        <defs>
          <radialGradient id="dc-globe-core" cx="42%" cy="36%" r="70%">
            <stop offset="0%" stopColor="#0d2a20" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#08170f" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#050807" stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id="dc-globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#00ff88" stopOpacity="0" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.22" />
          </radialGradient>
          <filter id="dc-globe-blur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        <circle r={R + 6} fill="url(#dc-globe-glow)" />
        <circle r={R} fill="url(#dc-globe-core)" stroke="rgba(0,255,136,0.28)" strokeWidth="0.8" />

        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse
            key={`meridian-${i}`}
            cx="0"
            cy="0"
            rx={Math.max(2, R * Math.abs(Math.cos((i * Math.PI) / 6)))}
            ry={R}
            fill="none"
            stroke="rgba(0,255,136,0.12)"
            strokeWidth="0.7"
          />
        ))}
        {[-60, -30, 0, 30, 60].map((lat) => (
          <ellipse
            key={`parallel-${lat}`}
            cx="0"
            cy={-R * Math.sin((lat * Math.PI) / 180)}
            rx={R * Math.cos((lat * Math.PI) / 180)}
            ry={Math.max(2, (R * Math.cos((lat * Math.PI) / 180)) * 0.16)}
            fill="none"
            stroke="rgba(0,255,136,0.12)"
            strokeWidth="0.7"
          />
        ))}

        <path
          ref={pathRef}
          fill="#00ff88"
          fillOpacity="0.72"
          filter="url(#dc-globe-blur)"
          className="[filter:drop-shadow(0_0_3px_rgba(0,255,136,0.55))]"
        />

        <g className="animate-dc-spin-slow" style={{ transformOrigin: "center" }}>
          <ellipse rx={R + 16} ry={R * 0.32} fill="none" stroke="rgba(0,255,136,0.22)" strokeWidth="0.8" strokeDasharray="3 7" />
          <ellipse rx={R * 0.32} ry={R + 16} fill="none" stroke="rgba(0,255,136,0.14)" strokeWidth="0.8" strokeDasharray="3 7" transform="rotate(28)" />
        </g>
      </svg>
    </div>
  );
}
