import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllProjects } from "@/lib/data";
import WorkGrid from "@/components/sections/WorkGrid";
import WorkBackgroundScene from "@/components/three/WorkBackgroundScene";

interface WorkPageProps {
  params: Promise<{ locale: string }>;
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("work");
  const projects = getAllProjects();
  const countLabel = `${Math.floor(projects.length / 10) * 10}+ ${t("projectCountLabel")}`;

  return (
    <main className="relative flex flex-1 flex-col overflow-hidden bg-obsidian">
      {/* rgba values are the rust/sage brand tokens at low opacity — Tailwind's
          theme() can't resolve nested DEFAULT keys with an opacity modifier
          inside an arbitrary gradient value. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_15%_10%,rgba(195,106,63,0.08),transparent_55%),radial-gradient(circle_at_85%_75%,rgba(122,132,113,0.12),transparent_50%)]"
      />
      <WorkBackgroundScene />

      <section className="px-6 pb-16 pt-32 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-rust">
            {countLabel}
          </span>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-sand sm:text-6xl md:text-7xl">
            {t("pageHeadline")}
          </h1>
          <p className="mt-6 max-w-2xl font-subtitle text-base text-sand/70 sm:text-lg">
            {t("pageSubheadline")}
          </p>
        </div>
      </section>

      <WorkGrid projects={projects} />
    </main>
  );
}
