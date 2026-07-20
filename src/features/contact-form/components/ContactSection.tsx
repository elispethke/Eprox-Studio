"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin } from "lucide-react";
import SectionLabel from "@/shared/components/ui/SectionLabel";
import GrainOverlay from "@/shared/components/ui/GrainOverlay";
import { useParallaxLayer } from "@/shared/hooks/useParallaxLayer";
import { LineReveal, splitIntoLines } from "@/shared/hooks/useLineReveal";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SOCIAL_LINKS,
} from "@/shared/lib/contact";
import ContactForm from "./ContactForm";

const REVEAL_TRANSITION = { duration: 0.9, ease: [0.16, 1, 0.3, 1] } as const;

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 48, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.25 },
  transition: { ...REVEAL_TRANSITION, delay },
});

/**
 * Light-base contact section (only the Hero stays dark, per the brand
 * guide): linen background with a copper glow, grain, and two parallax
 * planes — the abstract ring shapes drift slower than the form column, so
 * scrolling reads as depth rather than a flat page.
 */
export default function ContactSection() {
  const t = useTranslations("contact");
  const sectionRef = useRef<HTMLElement>(null);

  const backgroundY = useParallaxLayer(sectionRef, 60);
  const cardY = useParallaxLayer(sectionRef, -30);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative z-40 overflow-hidden bg-linen py-24 md:py-32"
    >
      {/* Bridge from the dark world above: a soft obsidian veil dissolving
          into the linen, so the theme shift reads as intentional. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-obsidian/20 to-transparent"
      />

      {/* Far plane: glow + abstract rings echoing the hero's light traces. */}
      <motion.div
        aria-hidden="true"
        style={{ y: backgroundY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-[15%] top-[-10%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(212,152,110,0.28)_0%,rgba(232,194,160,0.12)_45%,transparent_72%)] blur-2xl" />
        <div className="absolute -left-[10%] bottom-[-18%] h-[480px] w-[480px] rounded-full border border-copper/25" />
        <div className="absolute -left-[4%] bottom-[-8%] h-[300px] w-[300px] rounded-full border border-copper/15" />
        <div className="absolute right-[8%] top-[18%] h-[140px] w-[140px] rounded-full border border-espresso/10" />
      </motion.div>

      <GrainOverlay opacity={0.05} />

      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-6 lg:px-10">
        <span className="font-mono text-sm text-espresso/40">(04)</span>

        <div className="mt-8 grid items-start gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <motion.div {...revealProps(0)}>
              <SectionLabel>{t("kicker")}</SectionLabel>
              <h2 className="mt-5 max-w-md font-display text-4xl tracking-tight text-espresso sm:text-5xl">
                <LineReveal lines={splitIntoLines(t("headline"), 18)} />
              </h2>
              <p className="mt-5 max-w-sm font-subtitle text-sm text-espresso/60 sm:text-base">
                {t("subheadline")}
              </p>
            </motion.div>

            <motion.dl {...revealProps(0.15)} className="mt-12 space-y-7">
              {(
                [
                  {
                    label: t("info.emailLabel"),
                    value: CONTACT_EMAIL,
                    href: `mailto:${CONTACT_EMAIL}`,
                    Icon: Mail,
                  },
                  {
                    label: t("info.phoneLabel"),
                    value: CONTACT_PHONE,
                    href: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
                    Icon: Phone,
                  },
                  {
                    label: t("info.addressLabel"),
                    value: CONTACT_ADDRESS,
                    href: undefined,
                    Icon: MapPin,
                  },
                ] as const
              ).map(({ label, value, href, Icon }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-copper/40 text-copper">
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-espresso/60">
                      {label}
                    </dt>
                    <dd className="mt-1 font-subtitle text-sm text-espresso">
                      {href ? (
                        <a
                          href={href}
                          className="transition-colors hover:text-copper"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </motion.dl>

            <motion.div {...revealProps(0.25)} className="mt-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-espresso/60">
                {t("info.followLabel")}
              </span>
              <div className="mt-4 flex gap-3">
                {SOCIAL_LINKS.map(({ label, href, monogram }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-espresso/15 font-mono text-[10px] tracking-[0.1em] text-espresso/70 transition-all duration-300 hover:border-copper hover:text-copper hover:shadow-[0_6px_20px_-6px_rgba(212,152,110,0.6)]"
                  >
                    <span aria-hidden="true">{monogram}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Near plane: the glass card drifts slightly against the rings. */}
          <motion.div {...revealProps(0.1)} style={{ y: cardY }}>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
