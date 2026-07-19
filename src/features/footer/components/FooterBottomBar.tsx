"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import BackToTopButton from "./BackToTopButton";

const LEGAL_LINK_CLASSNAME =
  "font-subtitle text-xs text-espresso/50 transition-colors hover:text-copper";

/** Copyright strip: dynamic year, legal links, back-to-top control. */
export default function FooterBottomBar() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col-reverse items-center gap-6 border-t border-espresso/10 py-8 sm:flex-row sm:justify-between">
      <p className="font-subtitle text-xs text-espresso/50">
        © {year} Eprox Studio. {t("rights")}
      </p>

      <div className="flex items-center gap-8">
        {/* Placeholder routes — the legal pages don't exist yet. */}
        <Link href="/privacy" className={LEGAL_LINK_CLASSNAME}>
          {t("privacy")}
        </Link>
        <Link href="/terms" className={LEGAL_LINK_CLASSNAME}>
          {t("terms")}
        </Link>
        <BackToTopButton label={t("backToTop")} />
      </div>
    </div>
  );
}
