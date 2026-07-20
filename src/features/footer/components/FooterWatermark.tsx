"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Giant outline "EPROX" watermark closing the page — pure typographic
 * signature in a hairline espresso stroke, rising softly into view.
 */
export default function FooterWatermark() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none overflow-hidden"
    >
      <motion.p
        initial={prefersReducedMotion ? false : { y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        style={{ WebkitTextStroke: "1px rgba(43,36,32,0.14)" }}
        className="-mb-[0.16em] text-center font-subtitle text-[clamp(6rem,19vw,18rem)] font-bold leading-none tracking-[0.04em] text-transparent"
      >
        EPROX
      </motion.p>
    </div>
  );
}
