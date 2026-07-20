"use client";

import { motion } from "framer-motion";

interface ProgressDashesProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  /** aria-label prefix for each dash, e.g. "Go to project". */
  goToLabel: string;
  labels: string[];
  /** While autoplaying, the active dash fills over the interval — a visual countdown to the next slide. */
  isAutoPlaying?: boolean;
  autoPlayIntervalMs?: number;
}

/**
 * Dash-style progress indicator: one short muted dash per project; the
 * active one is longer and — while autoplay runs — fills with light over
 * the interval, so the rhythm of the carousel is legible at a glance.
 */
export default function ProgressDashes({
  count,
  activeIndex,
  onSelect,
  goToLabel,
  labels,
  isAutoPlaying = false,
  autoPlayIntervalMs = 2000,
}: ProgressDashesProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-sand/10 bg-sand/[0.03] px-6 py-4">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${goToLabel}: ${labels[index]}`}
            aria-current={isActive}
            className="group flex h-4 items-center"
          >
            {isActive ? (
              <span className="relative h-[3px] w-10 overflow-hidden rounded-full bg-sand/25">
                {isAutoPlaying ? (
                  <motion.span
                    key={`${index}-fill`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{
                      duration: autoPlayIntervalMs / 1000,
                      ease: "linear",
                    }}
                    className="absolute inset-0 origin-left rounded-full bg-sand"
                  />
                ) : (
                  <span className="absolute inset-0 rounded-full bg-sand" />
                )}
              </span>
            ) : (
              <span className="h-[3px] w-6 rounded-full bg-sand/25 transition-colors duration-500 group-hover:bg-sand/50" />
            )}
          </button>
        );
      })}
    </div>
  );
}
