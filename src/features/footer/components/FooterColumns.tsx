"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import Logo from "@/shared/components/ui/Logo";
import { useAnchorScroll } from "@/shared/hooks/useAnchorScroll";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
} from "@/shared/lib/contact";
import { useMagnetic } from "@/shared/hooks/useMagnetic";
import SocialLinks from "./SocialLinks";
import FooterNewsletter from "./FooterNewsletter";

const COLUMN_VARIANTS = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
} as const;

const COLUMN_TITLE_CLASSNAME =
  "font-mono text-[10px] uppercase tracking-[0.25em] text-espresso/60";

function ColumnTitle({ children }: { children: ReactNode }) {
  return <span className={COLUMN_TITLE_CLASSNAME}>{children}</span>;
}

/** Sitemap entry with magnetic hover; anchors smooth-scroll on the home page. */
function MagneticFooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const scrollToAnchor = useAnchorScroll();
  const { x, y, handlers } = useMagnetic(0.25, 5);

  const isAnchor = href.startsWith("#");
  const isHome = pathname === "/";
  const linkClassName =
    "inline-block font-subtitle text-sm text-espresso/70 transition-colors hover:text-copper";

  if (isAnchor && isHome) {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      scrollToAnchor(href);
    };
    return (
      <motion.a
        style={{ x, y }}
        {...handlers}
        href={href}
        onClick={handleClick}
        className={linkClassName}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.span style={{ x, y }} {...handlers} className="inline-block">
      <Link href={isAnchor ? `/${href}` : href} className={linkClassName}>
        {children}
      </Link>
    </motion.span>
  );
}

/**
 * The footer's four-column grid (brand/socials, sitemap, services, contact)
 * plus the newsletter, revealed in a stagger as the block enters the
 * viewport. Sitemap mirrors the header nav — real destinations only.
 */
export default function FooterColumns() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const sitemap = [
    { label: tNav("vision"), href: "#vision" },
    { label: tNav("foundation"), href: "#foundation" },
    { label: tNav("work"), href: "#work" },
    { label: tNav("projects"), href: "/work" },
    { label: tNav("contact"), href: "#contact" },
  ];

  const services = [
    t("serviceItems.web"),
    t("serviceItems.branding"),
    t("serviceItems.mobile"),
    t("serviceItems.systems"),
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.12 }}
      className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10"
    >
      <motion.div variants={COLUMN_VARIANTS} className="space-y-6">
        <Logo variant="dark" />
        <p className="max-w-[240px] font-subtitle text-sm text-espresso/60">
          {t("tagline")}
        </p>
        <SocialLinks />
      </motion.div>

      <motion.div variants={COLUMN_VARIANTS}>
        <ColumnTitle>{t("sitemap")}</ColumnTitle>
        <ul className="mt-4 space-y-3">
          {sitemap.map((item) => (
            <li key={item.href}>
              <MagneticFooterLink href={item.href}>
                {item.label}
              </MagneticFooterLink>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={COLUMN_VARIANTS}>
        <ColumnTitle>{t("services")}</ColumnTitle>
        <ul className="mt-4 space-y-3">
          {services.map((service) => (
            <li
              key={service}
              className="font-subtitle text-sm text-espresso/70"
            >
              {service}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={COLUMN_VARIANTS} className="space-y-8">
        <div>
          <ColumnTitle>{t("contactCol")}</ColumnTitle>
          <ul className="mt-4 space-y-3 font-subtitle text-sm text-espresso/70">
            <li>{CONTACT_ADDRESS}</li>
            <li>
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="transition-colors hover:text-copper"
              >
                {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="transition-colors hover:text-copper"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
            {t("hours") && <li>{t("hours")}</li>}
          </ul>
        </div>
        <FooterNewsletter />
      </motion.div>
    </motion.div>
  );
}
