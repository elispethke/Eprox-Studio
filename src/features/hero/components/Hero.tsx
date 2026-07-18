"use client";

import { useTranslations } from "next-intl";
import SectionLabel from "@/shared/components/ui/SectionLabel";
import ArrowLink from "@/shared/components/ui/ArrowLink";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import { useHeroIntro } from "../hooks/useHeroIntro";
import ScrollIndicator from "../ScrollIndicator";
import HeroFooterTag from "../HeroFooterTag";

function GlassAsset() {
  return <div className="h-full w-full" aria-hidden="true" />;
}

const TITLE_SIZE_CLASSNAME =
  "block text-[3.25rem] font-normal leading-[0.9] sm:text-[5rem] md:text-[6.5rem] lg:text-[7.5rem]";

export default function Hero() {
  const t = useTranslations("hero");
  const { sectionRef, curtainRef, wordsRef } = useHeroIntro();

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-obsidian"
    >
      {/* Decorative ring behind the headline, suggesting depth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[4%] top-1/2 z-[1] h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-rust/15 sm:h-[620px] sm:w-[620px]"
      />

      {/* 3D glass/liquid-copper asset, right side, bleeding toward center. */}
      <div className="pointer-events-none absolute inset-y-0 right-[-30%] z-[2] w-full opacity-30 sm:right-[-15%] sm:opacity-50 lg:right-[-6%] lg:w-[62%] lg:opacity-100">
        <GlassAsset />
      </div>

      {/* Vignette — darkens the frame edges to pull focus back to center. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,10,0.7)_100%)]"
      />
      <GrainOverlay className="z-[4]" opacity={0.05} />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-center px-6 pb-28 pt-32 lg:px-10 lg:pb-0 lg:pt-24">
        <div className="max-w-xl">
          <div data-hero-fade className="mb-7">
            <SectionLabel>{t("kicker")}</SectionLabel>
          </div>

          <div ref={wordsRef}>
            <h1 className="font-display tracking-tight">
              <span data-hero-word className={`${TITLE_SIZE_CLASSNAME} text-sand`}>
                {t("titleLine1")}
              </span>
              <span
                data-hero-word
                className={`${TITLE_SIZE_CLASSNAME} bg-gradient-to-br from-rust-light via-rust to-rust-dark bg-clip-text italic text-transparent`}
              >
                {t("titleLine2")}
              </span>
            </h1>
          </div>

          <p
            data-hero-fade
            className="mt-8 max-w-md font-subtitle text-sm text-sand/60 sm:text-base"
          >
            {t("description")}
          </p>

          <div data-hero-fade className="mt-10">
            <ArrowLink href="#work">{t("viewWork")}</ArrowLink>
          </div>
        </div>
      </div>

      <div
        data-hero-fade
        className="absolute bottom-10 left-6 z-10 lg:bottom-12 lg:left-10"
      >
        <ScrollIndicator label={t("scrollToExplore")} />
      </div>

      <div
        data-hero-fade
        className="absolute bottom-10 right-6 z-10 hidden sm:block lg:bottom-12 lg:right-10"
      >
        <HeroFooterTag tagline={t("footerTagline")} />
      </div>

      {/* Curtain wipe — covers the section on mount, then GSAP scales it away. */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-obsidian"
      />
    </section>
  );
}
