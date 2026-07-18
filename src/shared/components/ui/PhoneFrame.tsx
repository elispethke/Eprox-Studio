"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useCardParallax } from "@/shared/hooks/useCardParallax";
import { useVideoInView } from "@/shared/hooks/useVideoInView";

interface PhoneFrameCommonProps {
  alt: string;
  className?: string;
  /** Set false when nesting inside another frame that supplies its own border/shadow. */
  bordered?: boolean;
}

interface PhoneFrameImageProps extends PhoneFrameCommonProps {
  src: string;
}

interface PhoneFrameVideoProps extends PhoneFrameCommonProps {
  /** MP4 (H.264) source — always required as the universal fallback. */
  videoSrc: string;
  /** Optional smaller WebM source, tried first. */
  videoSrcWebm?: string;
  /** Cover frame shown before the video loads or plays. */
  poster: string;
}

type PhoneFrameProps = PhoneFrameImageProps | PhoneFrameVideoProps;

export default function PhoneFrame(props: PhoneFrameProps) {
  const { alt, className, bordered = true } = props;
  const { containerRef, x, y, onPointerMove, onPointerLeave } =
    useCardParallax({ strength: 6 });
  const { containerRef: viewportRef, videoRef } = useVideoInView();

  const frameClassName = bordered
    ? "border-[6px] border-obsidian shadow-2xl shadow-obsidian/60"
    : "border-[6px] border-obsidian/60";

  return (
    <div
      ref={viewportRef}
      className={`relative mx-auto aspect-[9/19.5] h-full max-h-full overflow-hidden rounded-[2.25rem] bg-obsidian ${frameClassName} ${className ?? ""}`}
    >
      <div className="absolute left-1/2 top-0 z-10 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-obsidian" />

      <div
        ref={containerRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="relative h-full w-full overflow-hidden rounded-[1.75rem]"
      >
        <motion.div style={{ x, y }} className="absolute -inset-2">
          {"videoSrc" in props ? (
            <video
              ref={videoRef}
              poster={props.poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            >
              {props.videoSrcWebm ? (
                <source src={props.videoSrcWebm} type="video/webm" />
              ) : null}
              <source src={props.videoSrc} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={props.src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 20vw, 60vw"
              className="object-cover"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
