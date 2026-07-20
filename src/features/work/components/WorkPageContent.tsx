"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, Layers, Smartphone } from "lucide-react";
import {
  webProjects,
  systemProjects,
  mobileProjects,
} from "@/features/projects";
import { useAnchorScroll } from "@/shared/hooks/useAnchorScroll";
import WorkHero from "./WorkHero";
import CategoryFilter, {
  type WorkCategory,
  type WorkSort,
} from "./CategoryFilter";
import ProjectSection from "./ProjectSection";
import GalleryCard from "./GalleryCard";
import AppCard from "./AppCard";
import WorkCTA from "./WorkCTA";
import { sortProjects } from "../lib/sortProjects";

const APPS_GRID_CLASSNAME =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6";

/**
 * Client orchestrator for /work: computes the indicator counts straight
 * from the project arrays (never hardcoded), drives the category
 * filter/sort state, and renders the three section grids in the fixed
 * Websites → Systems → Apps order. Category clicks smooth-scroll to the
 * matching section (Lenis); a scroll-spy keeps the active tab in sync.
 */
export default function WorkPageContent() {
  const t = useTranslations("work");
  const scrollToAnchor = useAnchorScroll();

  const [category, setCategory] = useState<WorkCategory>("all");
  const [sort, setSort] = useState<WorkSort>("recent");

  const sectionRefs = useRef<
    Record<Exclude<WorkCategory, "all">, HTMLElement | null>
  >({
    websites: null,
    systems: null,
    apps: null,
  });

  useEffect(() => {
    const entries = Object.entries(sectionRefs.current) as [
      Exclude<WorkCategory, "all">,
      HTMLElement | null,
    ][];
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((entry) => entry.isIntersecting);
        if (visible) {
          const match = entries.find(([, el]) => el === visible.target);
          if (match) setCategory(match[0]);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    entries.forEach(([, el]) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const stats = useMemo(
    () => [
      {
        value:
          webProjects.length + systemProjects.length + mobileProjects.length,
        label: t("stats.total"),
      },
      { value: webProjects.length, label: t("stats.websites") },
      { value: systemProjects.length, label: t("stats.systems") },
      { value: mobileProjects.length, label: t("stats.apps") },
    ],
    [t]
  );

  const categories = useMemo(
    () => [
      { id: "all" as const, label: t("filter.all") },
      { id: "websites" as const, label: t("filter.websites") },
      { id: "systems" as const, label: t("filter.systems") },
      { id: "apps" as const, label: t("filter.apps") },
    ],
    [t]
  );

  const sortLabels: Record<WorkSort, string> = {
    recent: t("filter.sortRecent"),
    az: t("filter.sortAz"),
  };

  const handleCategoryChange = (next: WorkCategory) => {
    setCategory(next);
    if (next === "all") {
      scrollToAnchor("#work-top");
    } else {
      scrollToAnchor(`#${next}`);
    }
  };

  const sortedWeb = useMemo(() => sortProjects(webProjects, sort), [sort]);
  const sortedSystems = useMemo(
    () => sortProjects(systemProjects, sort),
    [sort]
  );
  const sortedApps = useMemo(() => sortProjects(mobileProjects, sort), [sort]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6">
      <div id="work-top" className="pb-16 pt-32 md:pb-20 md:pt-40">
        <WorkHero stats={stats} />
      </div>

      <div className="sticky top-20 z-30 -mx-6 border-y border-sand/[0.06] bg-obsidian/70 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl">
          <CategoryFilter
            categories={categories}
            active={category}
            onChange={handleCategoryChange}
            sort={sort}
            onSortChange={setSort}
            sortLabels={sortLabels}
            sortAriaLabel={t("filter.sortLabel")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-20 py-20 md:gap-24">
        <div
          ref={(el) => {
            sectionRefs.current.websites = el;
          }}
        >
          <ProjectSection
            id="websites"
            icon={Globe}
            title={t("sections.websites.title")}
            count={webProjects.length}
            description={t("sections.websites.description")}
            viewAllLabel={t("viewAllProjects")}
            onViewAll={() => scrollToAnchor("#websites")}
          >
            {sortedWeb.map((project) => (
              <GalleryCard key={project.id} project={project} />
            ))}
          </ProjectSection>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.systems = el;
          }}
        >
          <ProjectSection
            id="systems"
            icon={Layers}
            title={t("sections.systems.title")}
            count={systemProjects.length}
            description={t("sections.systems.description")}
            viewAllLabel={t("viewAllProjects")}
            onViewAll={() => scrollToAnchor("#systems")}
          >
            {sortedSystems.map((project) => (
              <GalleryCard key={project.id} project={project} />
            ))}
          </ProjectSection>
        </div>

        <div
          ref={(el) => {
            sectionRefs.current.apps = el;
          }}
        >
          <ProjectSection
            id="apps"
            icon={Smartphone}
            title={t("sections.apps.title")}
            count={mobileProjects.length}
            description={t("sections.apps.description")}
            viewAllLabel={t("viewAllProjects")}
            onViewAll={() => scrollToAnchor("#apps")}
            gridClassName={APPS_GRID_CLASSNAME}
          >
            {sortedApps.map((project) => (
              <AppCard key={project.id} project={project} />
            ))}
          </ProjectSection>
        </div>
      </div>

      <div className="pb-24 md:pb-32">
        <WorkCTA />
      </div>
    </div>
  );
}
