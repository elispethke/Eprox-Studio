"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ProjectSectionProps {
  id: string;
  icon: LucideIcon;
  title: string;
  count: number;
  description: string;
  viewAllLabel: string;
  onViewAll: () => void;
  children: ReactNode;
  /** Override the default 1/2/3/4/5-column responsive grid (e.g. for narrower phone-mockup cards). */
  gridClassName?: string;
}

const DEFAULT_GRID_CLASSNAME =
  "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const GRID_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
} as const;

export const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
} as const;

/**
 * One category block from the reference: copper-ringed icon, serif title
 * with a superscript count, supporting line, and the "view all" affordance
 * on the right — followed by the staggered card grid and a fading hairline
 * separator below.
 */
export default function ProjectSection({
  id,
  icon: Icon,
  title,
  count,
  description,
  viewAllLabel,
  onViewAll,
  children,
  gridClassName = DEFAULT_GRID_CLASSNAME,
}: ProjectSectionProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <section id={id} aria-label={title} className="relative">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-rust/40 text-rust">
            <Icon aria-hidden="true" className="h-4.5 w-4.5" />
          </span>
          <div>
            <h2 className="font-display text-2xl tracking-tight text-sand sm:text-3xl">
              {title}
              <sup className="ml-2 font-mono text-xs tracking-[0.1em] text-rust">
                {count}
              </sup>
            </h2>
            <p className="mt-1.5 max-w-md font-subtitle text-sm text-sand/55">
              {description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-sand/60 transition-colors hover:text-rust"
        >
          {viewAllLabel}
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </div>

      <motion.div
        variants={prefersReducedMotion ? undefined : GRID_VARIANTS}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className={`mt-8 grid gap-5 ${gridClassName}`}
      >
        {children}
      </motion.div>

      <div
        aria-hidden="true"
        className="mt-16 h-px w-full bg-gradient-to-r from-transparent via-sand/15 to-transparent"
      />
    </section>
  );
}
