"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface LineRevealProps {
  /** Pre-split lines — each animates up from behind its own overflow mask. */
  lines: string[];
  /** Extra classes for each line's wrapper (typography lives on the parent). */
  lineClassName?: string;
  /** Seconds before the first line starts. */
  delay?: number;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const LINE_VARIANTS = {
  hidden: { y: "110%" },
  visible: (custom: number) => ({
    y: "0%",
    transition: {
      duration: 0.9,
      ease: EASE_OUT_EXPO,
      delay: custom,
    },
  }),
} as const;

/**
 * Masked line reveal — the split-text signature used across section
 * headlines: each line rises from behind an overflow mask with a soft
 * expo ease, staggered top to bottom. Instant under prefers-reduced-motion.
 * Purely presentational; wrap it in the heading element that carries the
 * typography classes.
 */
export function LineReveal({
  lines,
  lineClassName = "",
  delay = 0,
}: LineRevealProps): ReactNode {
  const prefersReducedMotion = useReducedMotion() ?? false;

  if (prefersReducedMotion) {
    return (
      <>
        {lines.map((line) => (
          <span key={line} className={`block ${lineClassName}`}>
            {line}
          </span>
        ))}
      </>
    );
  }

  return (
    <>
      {lines.map((line, index) => (
        <span
          key={line}
          className="block overflow-hidden pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className={`block ${lineClassName}`}
            variants={LINE_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            custom={delay + index * 0.12}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </>
  );
}

/**
 * Splits a headline into visually balanced lines for LineReveal. Pure and
 * deterministic: breaks at word boundaries aiming at `maxChars` per line.
 */
export function splitIntoLines(text: string, maxChars = 22): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current && (current + " " + word).length > maxChars) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}
