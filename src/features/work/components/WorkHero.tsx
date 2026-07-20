"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import SectionLabel from "@/shared/components/ui/SectionLabel";
import WorkStats, { type WorkStat } from "./WorkStats";

interface WorkHeroProps {
  stats: WorkStat[];
}

const REVEAL = {
  initial: { opacity: 0, y: 32, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
} as const;

/**
 * Page hero mirroring the approved reference: kicker, the two-line serif
 * title whose second line carries the EXACT living-gradient treatment of
 * the home hero's EPROX word (same sweep, same glow), the supporting line,
 * and the auto-computed indicators on the right.
 */
export default function WorkHero({ stats }: WorkHeroProps) {
  const t = useTranslations("work");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const reveal = (delay: number) =>
    prefersReducedMotion
      ? {}
      : {
          ...REVEAL,
          transition: {
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1] as const,
            delay,
          },
        };

  return (
    <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
      <div>
        <motion.div {...reveal(0)}>
          <SectionLabel>{t("kicker")}</SectionLabel>
        </motion.div>
        <motion.h1
          {...reveal(0.08)}
          className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="block text-sand">{t("titleLine1")}</span>
          {/* Same living gradient as the home hero's EPROX word. */}
          <span className="block bg-gradient-to-r from-rust via-sand to-rust bg-gradient-sweep bg-clip-text text-transparent animate-gradient-sweep drop-shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
            {t("titleLine2")}
          </span>
        </motion.h1>
        <motion.p
          {...reveal(0.16)}
          className="mt-6 max-w-md font-subtitle text-sm text-sand/60 sm:text-base"
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <motion.div {...reveal(0.22)} className="lg:justify-self-end">
        <WorkStats stats={stats} />
      </motion.div>
    </div>
  );
}
