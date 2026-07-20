import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Manrope, Space_Mono, Playfair_Display } from "next/font/google";
import { routing, locales, type Locale } from "@/lib/i18n/config";
import { brandColors } from "@/shared/lib/brand";
import { SITE_NAME, SITE_URL } from "@/shared/lib/site";
import Header from "@/shared/components/layout/Header";
import LenisProvider from "@/shared/components/layout/LenisProvider";
import SkipLink from "@/shared/components/layout/SkipLink";
import { Footer } from "@/features/footer";
import { ConsentModal, ConsentAnalytics } from "@/features/consent";
import { Preloader, ScrollProgress } from "@/features/experience";
import WebVitalsReporter from "@/shared/components/layout/WebVitalsReporter";
import "@/shared/styles/globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Only the weights the design system actually uses: 400 (section titles),
// 700 (emphasis), 900 (hero display). Italic carries the copper accent.
const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

function localeAlternates(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}/${locale}${path}`])
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s — ${SITE_NAME}`,
    },
    description: t("description"),
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: localeAlternates(),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    icons: {
      icon: [
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      other: [
        { rel: "mask-icon", url: "/mask-icon.svg", color: brandColors.rust },
      ],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
    email: "contact@eproxstudio.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${spaceMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Preloader />
            <ScrollProgress />
            <SkipLink />
            <Header />
            {children}
            <Footer />
            <ConsentModal />
            <ConsentAnalytics />
            <WebVitalsReporter />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
