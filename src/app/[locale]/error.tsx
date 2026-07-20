"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import SectionLabel from "@/shared/components/ui/SectionLabel";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Route-level error boundary, styled like the 404: same obsidian/copper
 * language, generic copy (details go to the server log / error tracker,
 * never to the visitor) and a retry affordance.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error("[boundary]", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-obsidian px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,121,60,0.18)_0%,rgba(201,121,60,0.06)_45%,transparent_70%)] blur-2xl"
      />
      <GrainOverlay opacity={0.05} />

      <div className="relative z-10 flex flex-col items-center">
        <SectionLabel>{t("kicker")}</SectionLabel>
        <h1 className="mt-6 max-w-md font-display text-3xl tracking-tight text-sand sm:text-4xl">
          {t("headline")}
        </h1>
        <p className="mt-4 max-w-sm font-subtitle text-sm text-sand/60 sm:text-base">
          {t("body")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-rust/50 bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-sand transition-all duration-300 hover:border-rust hover:bg-rust/10 hover:shadow-[0_0_24px_-4px_rgba(201,121,60,0.55)]"
        >
          {t("retry")}
        </button>
      </div>
    </main>
  );
}
