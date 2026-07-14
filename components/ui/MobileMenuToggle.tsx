"use client";

import { motion } from "framer-motion";

interface MobileMenuToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LINE_CLASSNAME = "absolute h-px w-6 bg-sand";

export default function MobileMenuToggle({
  isOpen,
  onToggle,
}: MobileMenuToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      aria-expanded={isOpen}
      className="relative flex h-6 w-6 items-center justify-center md:hidden"
    >
      <motion.span
        className={LINE_CLASSNAME}
        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -6 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <motion.span
        className={LINE_CLASSNAME}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className={LINE_CLASSNAME}
        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 6 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </button>
  );
}
