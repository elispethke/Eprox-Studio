"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline copper progress bar pinned above the header — a quiet, constant
 * sense of place in the page. Hidden under prefers-reduced-motion.
 */
export default function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-gradient-to-r from-rust-light via-rust to-rust-dark"
    />
  );
}
