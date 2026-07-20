"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

// One play per SPA session (module scope — the project deliberately uses no
// web storage). Hard reloads replay it, which is the classic SOTD behavior.
let hasPlayedThisSession = false;

const COUNT_DURATION_S = 1.3;
const EXIT_DELAY_S = 0.25;

/**
 * Brand entrance ritual: obsidian curtain with the hexagon mark drawing its
 * stroke while a counter runs 0→100, then the curtain lifts to reveal the
 * hero. Skipped entirely under prefers-reduced-motion and on client-side
 * navigations within the same session.
 */
export default function Preloader() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isDone, setIsDone] = useState(hasPlayedThisSession);
  const progress = useMotionValue(0);
  const counterText = useTransform(progress, (value) =>
    String(Math.round(value)).padStart(3, "0")
  );

  useEffect(() => {
    if (hasPlayedThisSession) return;
    if (prefersReducedMotion) {
      // Deferred a tick: satisfies the no-sync-setState-in-effect rule and
      // still removes the curtain before the visitor can notice it.
      const skip = setTimeout(() => {
        hasPlayedThisSession = true;
        setIsDone(true);
      }, 0);
      return () => clearTimeout(skip);
    }

    const controls = animate(progress, 100, {
      duration: COUNT_DURATION_S,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        hasPlayedThisSession = true;
        setTimeout(() => setIsDone(true), EXIT_DELAY_S * 1000);
      },
    });
    return () => controls.stop();
  }, [prefersReducedMotion, progress]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          aria-hidden="true"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="pointer-events-none fixed inset-0 z-[120] flex flex-col items-center justify-center bg-obsidian"
        >
          <svg viewBox="0 0 44 44" className="h-20 w-20" fill="none">
            <motion.polygon
              points="40,22 31,37.588 13,37.588 4,22 13,6.412 31,6.412"
              stroke="#C9793C"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: COUNT_DURATION_S,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
            <motion.text
              x="22"
              y="27"
              textAnchor="middle"
              className="fill-rust font-subtitle text-[15px] font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: COUNT_DURATION_S * 0.55, duration: 0.4 }}
            >
              E
            </motion.text>
          </svg>

          <div className="mt-8 flex flex-col items-center">
            <span className="font-subtitle text-sm font-bold tracking-[0.3em] text-sand">
              EPROX
            </span>
            <span className="mt-1 font-mono text-[9px] tracking-[0.45em] text-sand/50">
              STUDIO
            </span>
          </div>

          <motion.span className="absolute bottom-10 right-10 font-mono text-xs tracking-[0.2em] text-rust">
            {counterText}
          </motion.span>

          <div className="absolute bottom-10 left-10 h-px w-24 overflow-hidden bg-sand/15">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: COUNT_DURATION_S,
                ease: [0.65, 0, 0.35, 1],
              }}
              className="h-full origin-left bg-gradient-to-r from-rust-light to-rust"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
