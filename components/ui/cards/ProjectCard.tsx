import ProjectCardWeb from "@/components/ui/cards/ProjectCardWeb";
import ProjectCardMobile from "@/components/ui/cards/ProjectCardMobile";
import ProjectCardSystem from "@/components/ui/cards/ProjectCardSystem";
import type { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

/**
 * Renders the right card for a project's type. Consumers (the home
 * carousel, the /work grid) never branch on type themselves — they just
 * pass a project through here.
 */
export default function ProjectCard({ project, className }: ProjectCardProps) {
  switch (project.type) {
    case "web":
      return <ProjectCardWeb project={project} className={className} />;
    case "mobile":
      return <ProjectCardMobile project={project} className={className} />;
    case "system":
      return <ProjectCardSystem project={project} className={className} />;
  }
}
