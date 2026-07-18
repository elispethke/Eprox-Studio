import ProjectCardWeb from "@/features/projects/components/ProjectCardWeb";
import ProjectCardMobile from "@/features/projects/components/ProjectCardMobile";
import ProjectCardSystem from "@/features/projects/components/ProjectCardSystem";
import type { Project, ProjectCardVariant } from "@/features/projects/types";

interface ProjectCardProps {
  project: Project;
  className?: string;
  /** "carousel" (default) is the home fan-carousel anatomy — title column
   * beside the media. "grid" is the /work section grid anatomy — media
   * filling most of the card, title/category below it. */
  variant?: ProjectCardVariant;
}

/**
 * Renders the right card for a project's type. Consumers (the home
 * carousel, the /work grid) never branch on type themselves — they just
 * pass a project through here.
 */
export default function ProjectCard({ project, className, variant = "carousel" }: ProjectCardProps) {
  switch (project.type) {
    case "web":
      return <ProjectCardWeb project={project} className={className} variant={variant} />;
    case "mobile":
      return <ProjectCardMobile project={project} className={className} variant={variant} />;
    case "system":
      return <ProjectCardSystem project={project} className={className} variant={variant} />;
  }
}
