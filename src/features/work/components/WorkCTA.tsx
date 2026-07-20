"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";

/**
 * Closing invitation panel from the reference: a wide glass slab with a
 * copper horizon glow, kicker, serif question and the conversation CTA.
 */
export default function WorkCTA() {
  const t = useTranslations("work.cta");
  const prefersReducedMotion = useReducedMotion() ?? false;

  return (
    <motion.aside
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 40, filter: "blur(8px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-sand/10 bg-obsidian-deep/70 px-7 py-12 backdrop-blur-xl sm:px-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -top-[60%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,121,60,0.25)_0%,rgba(201,121,60,0.08)_45%,transparent_72%)] blur-2xl"
      />
      <GrainOverlay opacity={0.04} />

      <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-rust">
            {t("kicker")}
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-sand sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-3 font-subtitle text-sm text-sand/60 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <Link
          href="/#contact"
          className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-rust/60 px-7 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-sand transition-all duration-300 hover:border-rust hover:bg-rust/10 hover:shadow-[0_0_30px_-6px_rgba(201,121,60,0.6)]"
        >
          {t("button")}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 text-rust transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </motion.aside>
  );
}
