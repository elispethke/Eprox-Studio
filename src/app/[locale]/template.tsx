"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route-enter transition: content settles in from a slight rise while a
 * copper-edged obsidian curtain sweeps up and away. Remounts per navigation
 * (template semantics), so every page change gets the ritual; on first load
 * it plays invisibly beneath the preloader.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion() ?? false;

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-[105] origin-top bg-obsidian"
      >
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-rust to-transparent" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
