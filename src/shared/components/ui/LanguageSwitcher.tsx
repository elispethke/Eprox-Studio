"use client";

import { useLocale } from "next-intl";
import { routing, type Locale } from "@/lib/i18n/config";
import { Link, usePathname } from "@/lib/i18n/navigation";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  pt: "PT",
  de: "DE",
};

export default function LanguageSwitcher() {
  const activeLocale = useLocale();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 font-mono text-xs tracking-wider">
      {routing.locales.map((locale, index) => {
        const isActive = locale === activeLocale;

        return (
          <span key={locale} className="flex items-center gap-2">
            {index > 0 && <span className="text-silver/30">|</span>}
            <Link
              href={pathname}
              locale={locale}
              aria-current={isActive ? "true" : undefined}
              className={
                isActive
                  ? "text-rust"
                  : "text-sand/70 transition-colors hover:text-sand"
              }
            >
              {LOCALE_LABELS[locale]}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
