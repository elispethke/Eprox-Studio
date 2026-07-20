"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

export interface WorkStat {
  value: number;
  label: string;
}

interface WorkStatsProps {
  /** Values are ALWAYS derived from the project arrays — never hardcoded. */
  stats: WorkStat[];
}

function CountUp({ value }: { value: number }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const progress = useMotionValue(0);
  const text = useTransform(progress, (v) => String(Math.round(v)));

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      progress.set(value);
      return;
    }
    const controls = animate(progress, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [isInView, prefersReducedMotion, progress, value]);

  return (
    <motion.span ref={ref} aria-hidden="true">
      {text}
    </motion.span>
  );
}

/**
 * The hero's indicator row: big copper serif numerals counting up on view,
 * separated by hairlines. Screen readers get the final numbers directly.
 */
export default function WorkStats({ stats }: WorkStatsProps) {
  return (
    <dl className="flex flex-wrap items-start gap-x-0 gap-y-8">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`flex flex-col gap-1.5 px-6 first:pl-0 last:pr-0 sm:px-8 ${
            index > 0 ? "border-l border-sand/10" : ""
          }`}
        >
          <dd className="font-display text-4xl leading-none text-rust sm:text-5xl">
            <CountUp value={stat.value} />
            <span className="sr-only">{stat.value}</span>
          </dd>
          <dt className="max-w-[7.5rem] font-subtitle text-xs leading-snug text-sand/55">
            {stat.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
