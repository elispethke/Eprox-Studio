import { defineRouting } from "next-intl/routing";

export const locales = ["en", "pt", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // English is the site's official language: never auto-redirect based on
  // the browser's Accept-Language — visitors switch manually if they want.
  localeDetection: false,
});
