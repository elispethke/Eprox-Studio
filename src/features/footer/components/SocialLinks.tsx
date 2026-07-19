"use client";

import { motion } from "framer-motion";
import { SOCIAL_LINKS } from "@/shared/lib/contact";
import { useMagnetic } from "../hooks/useMagnetic";

function MagneticSocial({
  label,
  href,
  monogram,
}: (typeof SOCIAL_LINKS)[number]) {
  const { x, y, handlers } = useMagnetic();

  return (
    <motion.a
      style={{ x, y }}
      {...handlers}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso/15 font-mono text-[10px] tracking-[0.1em] text-espresso/70 transition-colors duration-300 hover:border-copper hover:text-copper hover:shadow-[0_6px_20px_-6px_rgba(212,152,110,0.6)]"
    >
      <span aria-hidden="true">{monogram}</span>
    </motion.a>
  );
}

/** Monogram social circles with the magnetic hover treatment. */
export default function SocialLinks() {
  return (
    <div className="flex gap-3">
      {SOCIAL_LINKS.map((social) => (
        <MagneticSocial key={social.label} {...social} />
      ))}
    </div>
  );
}
