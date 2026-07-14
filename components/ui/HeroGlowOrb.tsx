"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";

const PULSE_TRANSITION = {
  duration: 6,
  repeat: Infinity,
  repeatType: "mirror",
  ease: "easeInOut",
} as const;

// Values below are specified exactly (percentages, px, gradient stops,
// shadow spread) rather than derived from Tailwind's spacing scale, so
// they're expressed as inline styles instead of arbitrary-value classes.
const HALO_STYLE: CSSProperties = {
  width: "clamp(320px, 45vw, 550px)",
  height: "clamp(320px, 45vw, 550px)",
  top: "clamp(-200px, -15vw, -120px)",
  right: "clamp(-260px, -20vw, -150px)",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, #C36A3F 0%, rgba(195,106,63,0.35) 40%, transparent 70%)",
  filter: "blur(80px)",
  opacity: 0.7,
};

const SPHERE_STYLE: CSSProperties = {
  width: "clamp(200px, 28vw, 360px)",
  height: "clamp(200px, 28vw, 360px)",
  top: "clamp(-140px, -8vw, -80px)",
  right: "clamp(-180px, -10vw, -100px)",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 35% 35%, #E8935F 0%, #C36A3F 22%, #A4512C 42%, #4A2614 65%, #19100B 85%)",
  boxShadow: "0 0 120px 40px rgba(195,106,63,0.4)",
};

/**
 * Large planet-like glow orb anchored to the Hero's top-right corner,
 * partially cut off by the section edge. Two layers: a soft blurred halo
 * (atmosphere) and a sharper shaded sphere on top. Both sit above the
 * flow-lines canvas (z-0) and under the z-10 text.
 */
export default function HeroGlowOrb() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1]"
        style={HALO_STYLE}
      />
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0.92, 1, 0.92] }}
        transition={prefersReducedMotion ? undefined : PULSE_TRANSITION}
        className="pointer-events-none absolute z-[1]"
        style={SPHERE_STYLE}
      />
    </>
  );
}
