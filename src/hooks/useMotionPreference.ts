"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Central motion preference.
 *
 * Returns `true` when animation should run. Animation is disabled when the
 * user requests reduced motion, or when the deployment sets
 * NEXT_PUBLIC_REDUCED_MOTION=1 (kiosk, low-power and QA environments).
 * When disabled, components render their final state so content is always
 * visible — including with JavaScript-driven animation unavailable.
 */
export function useMotionOK(): boolean {
  const prefersReduced = useReducedMotion();
  const forcedOff = process.env.NEXT_PUBLIC_REDUCED_MOTION === "1";
  return !prefersReduced && !forcedOff;
}
