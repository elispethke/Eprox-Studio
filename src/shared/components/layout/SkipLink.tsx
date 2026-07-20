"use client";

import { useTranslations } from "next-intl";

/**
 * Keyboard-first "skip to content" link: visually hidden until focused,
 * then surfaces as a copper pill above the header. Every page's <main>
 * carries id="main-content".
 */
export default function SkipLink() {
  const t = useTranslations("a11y");

  return (
    <a
      href="#main-content"
      className="sr-only z-[110] rounded-full bg-gradient-to-r from-copper to-rust-dark px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-linen focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:outline-none focus:ring-2 focus:ring-copper/60"
    >
      {t("skipToContent")}
    </a>
  );
}
