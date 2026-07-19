"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import type { ContactStatus } from "../hooks/useContactForm";

interface SubmitButtonProps {
  status: ContactStatus;
  idleLabel: string;
  loadingLabel: string;
}

const CONTENT_TRANSITION = { duration: 0.25, ease: "easeOut" } as const;

/**
 * Submit CTA with one visual per lifecycle state: label+arrow (idle),
 * spinner (loading), springy check (success). The error shake lives on the
 * form wrapper, not here, so the whole card reacts.
 */
export default function SubmitButton({
  status,
  idleLabel,
  loadingLabel,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={status === "loading" || status === "success"}
      className="group relative inline-flex h-12 min-w-[13rem] items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-copper to-rust-dark px-7 font-mono text-xs uppercase tracking-[0.2em] text-linen transition-all duration-300 hover:shadow-[0_10px_30px_-8px_rgba(212,152,110,0.7)] disabled:cursor-default"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "loading" ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={CONTENT_TRANSITION}
            className="inline-flex items-center gap-2.5"
          >
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            {loadingLabel}
          </motion.span>
        ) : status === "success" ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 380, damping: 18 }}
            className="inline-flex items-center gap-2.5"
          >
            <Check aria-hidden="true" className="h-4 w-4" />
            {idleLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={CONTENT_TRANSITION}
            className="inline-flex items-center gap-2.5"
          >
            {idleLabel}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
