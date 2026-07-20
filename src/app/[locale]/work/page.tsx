import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkBackgroundScene, WorkPageContent } from "@/features/work";

interface WorkPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("workTitle"), description: t("workDescription") };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="relative isolate flex flex-1 flex-col overflow-hidden bg-obsidian outline-none"
    >
      {/* rgba values are the rust/sage brand tokens at low opacity — Tailwind's
          theme() can't resolve nested DEFAULT keys with an opacity modifier
          inside an arbitrary gradient value. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_10%,rgba(201,121,60,0.18),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(122,132,113,0.24),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(226,232,240,0.05),transparent_60%)]"
      />
      {/* Grayscale film-grain, not a brand color — gives the obsidian field
          visible texture instead of a flat fill, layered under the 3D scene. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.05] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3CfeColorMatrix%20type%3D%22saturate%22%20values%3D%220%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')] [background-size:180px_180px]"
      />
      <WorkBackgroundScene />

      <WorkPageContent />
    </main>
  );
}
