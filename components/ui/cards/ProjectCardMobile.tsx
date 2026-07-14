import PhoneFrame from "@/components/ui/PhoneFrame";
import CardGlassWrapper from "@/components/ui/cards/CardGlassWrapper";
import type { MobileProject } from "@/types/project";

interface ProjectCardMobileProps {
  project: MobileProject;
  className?: string;
}

export default function ProjectCardMobile({
  project,
  className,
}: ProjectCardMobileProps) {
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
