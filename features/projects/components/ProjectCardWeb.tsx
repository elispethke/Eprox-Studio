import BrowserFrame from "@/components/ui/BrowserFrame";
import CardGlassWrapper from "@/features/projects/components/CardGlassWrapper";
import type { ProjectCardVariant, WebProject } from "@/features/projects/types";

interface ProjectCardWebProps {
  project: WebProject;
  className?: string;
  variant?: ProjectCardVariant;
}

export default function ProjectCardWeb({ project, className, variant = "carousel" }: ProjectCardWebProps) {
  if (variant === "grid") {
    return (
      <CardGlassWrapper className={className}>
        <div className="flex flex-col">
          {/* aspect-ratio lives on the media area itself, not the whole
              card, so the screenshot gets real height instead of a thin
              strip squeezed by a 16:9 constraint on card + text combined. */}
          <div className="aspect-[4/3] p-3 sm:p-4">
            <BrowserFrame
              src={project.coverImage}
              alt={project.title}
              bordered={false}
              className="h-full"
            />
          </div>
          <div className="flex flex-col gap-1 p-6">
            <h3 className="font-display text-lg leading-tight text-sand sm:text-xl">
              {project.title}
            </h3>
            <p className="font-subtitle text-xs text-sand/60 sm:text-sm">
              {project.category}
            </p>
          </div>
        </div>
      </CardGlassWrapper>
    );
  }

  return (
    <CardGlassWrapper className={className}>
      <div className="flex h-full">
        <div className="flex w-[40%] shrink-0 flex-col justify-end gap-2 p-5 sm:p-6">
          <h3 className="font-display text-xl leading-tight text-sand sm:text-2xl">
            {project.title}
          </h3>
          <p className="font-subtitle text-xs text-sand/60 sm:text-sm">
            {project.category}
          </p>
        </div>

        <div className="flex-1 py-3 pr-3 sm:py-4 sm:pr-4">
          <BrowserFrame
            src={project.coverImage}
            alt={project.title}
            bordered={false}
            className="h-full"
          />
        </div>
      </div>
    </CardGlassWrapper>
  );
}
