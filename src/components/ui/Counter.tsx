"use client";

import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { useEffect } from "react";

export function Counter({
  end,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const { display, run } = useCountUp({ end, decimals, duration: 1800 });

  useEffect(() => {
    if (inView) run();
  }, [inView, run]);

  return (
    <span ref={ref} className={className} aria-live="polite" dir="ltr">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
