import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Manrope, Space_Mono } from "next/font/google";
import { routing } from "@/lib/i18n/config";
import { brandColors } from "@/lib/brand";
import Header from "@/components/layout/Header";
import LenisProvider from "@/components/layout/LenisProvider";
import "./globals.css";

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

// TODO: --font-display currently falls back to Manrope. Swap this for
// Clash Display (via Fontshare) or the Casko font files once they're added
// to public/fonts, e.g. via next/font/local pointing at those files.
const displayFallback = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Eprox Studio",
  description:
    "We design and build precise, performant digital architecture for brands that intend to last. Beyond websites and applications—we engineer experiences.",
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${spaceMono.variable} ${displayFallback.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <Header />
            {children}
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
