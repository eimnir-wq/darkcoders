"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface CountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  start?: number;
}

/** Animates a number from `start` to `end` using requestAnimationFrame. */
export function useCountUp({ end, duration = 1600, decimals = 0, start = 0 }: CountUpOptions) {
  const [value, setValue] = useState(start);
  const frame = useRef<number | null>(null);
  const started = useRef(false);

  const run = useCallback(() => {
    if (started.current) return;
    started.current = true;
    const reduce =
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) ||
      process.env.NEXT_PUBLIC_REDUCED_MOTION === "1";
    if (reduce) {
      setValue(end);
      return;
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + (end - start) * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [duration, end, start]);

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  return { value, display, run } as const;
}
