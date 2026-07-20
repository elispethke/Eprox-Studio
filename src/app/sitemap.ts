import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/shared/lib/site";

const ROUTES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/work", priority: 0.8, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}/en${path}`,
    lastModified: new Date(),
    priority,
    changeFrequency,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
      ),
    },
  }));
}
