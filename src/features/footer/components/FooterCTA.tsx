"use client";

import type { MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/lib/i18n/navigation";
import PillButton from "@/shared/components/ui/PillButton";
import { useAnchorScroll } from "@/shared/hooks/useAnchorScroll";
import { CONTACT_EMAIL } from "@/shared/lib/contact";

/**
 * Top block of the footer: big serif invitation (accent word in copper
 * italic), START A PROJECT pill that smooth-scrolls to the contact section,
 * and the studio email as an oversized link with an animated underline.
 */
export default function FooterCTA() {
  const t = useTranslations("footer");
  const pathname = usePathname();
  const scrollToAnchor = useAnchorScroll();

  const isHome = pathname === "/";
  const handleStartProject = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      event.preventDefault();
      scrollToAnchor("#contact");
    }
  };

  return (
    <div className="flex flex-col items-start gap-10 border-b border-espresso/10 py-16 md:py-20 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="max-w-2xl font-display text-4xl leading-tight tracking-tight text-espresso sm:text-5xl md:text-6xl">
          {t("ctaLead")}{" "}
          <em className="bg-gradient-to-r from-copper to-rust-dark bg-clip-text italic text-transparent">
            {t("ctaAccent")}
          </em>
        </h2>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="group relative mt-8 inline-block pb-1 font-display text-xl text-espresso/80 transition-colors hover:text-espresso sm:text-2xl"
        >
          {CONTACT_EMAIL}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-espresso/25"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-copper-light to-copper transition-transform duration-500 group-hover:scale-x-100"
          />
        </a>
      </div>

      <PillButton
        href={isHome ? "#contact" : "/#contact"}
        tone="light"
        onClick={handleStartProject}
      >
        {t("startProject")}
      </PillButton>
    </div>
  );
}
