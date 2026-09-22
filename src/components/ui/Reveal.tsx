"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useMotionOK } from "@/hooks/useMotionPreference";

/**
 * Scroll/mount reveal.
 *
 * The element is rendered fully visible by default and only receives the
 * entrance animation once it has been observed. If JavaScript animation is
 * unavailable, reduced motion is requested, or the element never intersects,
 * the content simply stays visible — it can never be trapped at opacity 0.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const motionOK = useMotionOK();

  useEffect(() => {
    const node = ref.current;
    if (!node || !motionOK) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionOK]);

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={shown ? "in" : undefined}
      style={
        {
          ...style,
          "--dc-reveal-y": `${y}px`,
          animationDelay: shown ? `${delay}s` : undefined,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
