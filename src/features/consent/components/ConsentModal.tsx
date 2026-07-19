"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useLenis } from "@/shared/components/layout/LenisProvider";
import { useConsent } from "../hooks/useConsent";

const CARD_TRANSITION = { duration: 0.7, ease: [0.16, 1, 0.3, 1] } as const;

/**
 * Privacy & cookies consent dialog, shown once per stored choice (180 days).
 * Deliberately modal: no backdrop/Escape dismissal — the visitor answers
 * with Accept or Decline. Page scroll is frozen (Lenis + body overflow)
 * while it's open.
 */
export default function ConsentModal() {
  const t = useTranslations("consent");
  const { isOpen, choose } = useConsent();
  const lenis = useLenis();
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    acceptRef.current?.focus();
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, lenis]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-obsidian/60 p-4 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            aria-describedby="consent-body"
            initial={{ opacity: 0, y: 48, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            transition={CARD_TRANSITION}
            className="relative w-full max-w-md rounded-3xl bg-obsidian-deep/95 p-8 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-9"
          >
            <span aria-hidden="true" className="glass-border-copper" />

            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rust/40 text-rust">
                <Cookie aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-rust">
                {t("kicker")}
              </span>
            </div>

            <h2
              id="consent-title"
              className="mt-5 font-display text-2xl tracking-tight text-sand sm:text-[1.7rem]"
            >
              {t("title")}
            </h2>
            <p
              id="consent-body"
              className="mt-3 font-subtitle text-sm leading-relaxed text-sand/60"
            >
              {t("body")}{" "}
              <Link
                href="/privacy"
                className="text-rust underline decoration-rust/40 underline-offset-2 transition-colors hover:decoration-rust"
              >
                {t("privacyLink")}
              </Link>
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                ref={acceptRef}
                type="button"
                onClick={() => choose("accepted")}
                className="flex-1 rounded-full bg-gradient-to-r from-copper to-rust-dark px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-linen transition-shadow hover:shadow-[0_10px_30px_-8px_rgba(212,152,110,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper/60"
              >
                {t("accept")}
              </button>
              <button
                type="button"
                onClick={() => choose("declined")}
                className="flex-1 rounded-full border border-sand/25 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-sand transition-colors hover:border-rust hover:text-rust focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sand/40"
              >
                {t("decline")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
