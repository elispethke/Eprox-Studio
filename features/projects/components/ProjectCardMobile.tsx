import PhoneFrame from "@/components/ui/PhoneFrame";
import CardGlassWrapper from "@/features/projects/components/CardGlassWrapper";
import type { MobileProject, ProjectCardVariant } from "@/features/projects/types";

interface ProjectCardMobileProps {
  project: MobileProject;
  className?: string;
  variant?: ProjectCardVariant;
}

export default function ProjectCardMobile({
  project,
  className,
  variant = "carousel",
}: ProjectCardMobileProps) {
  if (variant === "grid") {
    return (
      <CardGlassWrapper className={className}>
        <div className="flex h-full flex-col">
          <div className="flex-1 p-3 sm:p-4">
            <PhoneFrame
              alt={project.title}
              videoSrc={project.videoSrc}
              videoSrcWebm={project.videoSrcWebm}
              poster={project.poster}
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
          <PhoneFrame
            alt={project.title}
            videoSrc={project.videoSrc}
            videoSrcWebm={project.videoSrcWebm}
            poster={project.poster}
            bordered={false}
            className="h-full"
          />
        </div>
      </div>
    </CardGlassWrapper>
  );
}
