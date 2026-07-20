"use client";

import { useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "@/lib/i18n/navigation";
import { useHeaderScroll } from "@/shared/hooks/useHeaderScroll";
import { useAnchorScroll } from "@/shared/hooks/useAnchorScroll";
import Logo from "@/shared/components/ui/Logo";
import NavLink from "@/shared/components/ui/NavLink";
import PillButton from "@/shared/components/ui/PillButton";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import MobileMenuToggle from "@/shared/components/ui/MobileMenuToggle";

const NAV_ITEMS = [
  { key: "vision", href: "#vision" },
  { key: "foundation", href: "#foundation" },
  { key: "work", href: "#work" },
  { key: "projects", href: "/work" },
  { key: "contact", href: "#contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const isScrolled = useHeaderScroll();
  const pathname = usePathname();
  const scrollToAnchor = useAnchorScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const isHome = pathname === "/";
  const letsTalkHref = isHome ? "#contact" : "/#contact";
  const handleLetsTalk = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      event.preventDefault();
      scrollToAnchor("#contact");
    }
    closeMobileMenu();
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-silver/10 bg-obsidian/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} href={item.href}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSwitcher />
          <PillButton href={letsTalkHref} onClick={handleLetsTalk}>
            {t("letsTalk")}
          </PillButton>
        </div>

        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen((open) => !open)}
        />
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-silver/10 bg-obsidian/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-6 px-6 py-8">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.key}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  {t(item.key)}
                </NavLink>
              ))}
              <div className="flex items-center gap-6 pt-2">
                <LanguageSwitcher />
                <PillButton
                  href={letsTalkHref}
                  onClick={handleLetsTalk}
                  className="flex-1 justify-center"
                >
                  {t("letsTalk")}
                </PillButton>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
