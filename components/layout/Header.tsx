"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useHeaderScroll } from "@/hooks/useHeaderScroll";
import Logo from "@/components/ui/Logo";
import NavLink from "@/components/ui/NavLink";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import MobileMenuToggle from "@/components/ui/MobileMenuToggle";

const NAV_ITEMS = [
  { key: "home", href: "/" },
  { key: "vision", href: "#vision" },
  { key: "foundation", href: "#foundation" },
  { key: "capabilities", href: "#capabilities" },
  { key: "contact", href: "#contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const isScrolled = useHeaderScroll();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.key} href={item.href}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <LanguageSwitcher />
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
            className="overflow-hidden border-t border-silver/10 bg-obsidian/95 backdrop-blur-md md:hidden"
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
              <LanguageSwitcher />
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
