interface GrainOverlayProps {
  /** "absolute" scopes the grain to its positioned ancestor (e.g. one section); "fixed" would pin it to the viewport if hoisted to the root layout. */
  position?: "absolute" | "fixed";
  opacity?: number;
  className?: string;
}

const NOISE_DATA_URI =
  "url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.85%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3CfeColorMatrix%20type%3D%22saturate%22%20values%3D%220%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')";

/**
 * Film-grain texture layered over dark sections (mix-blend-overlay, low
 * opacity) so flat obsidian fields read as cinema rather than a solid fill.
 */
export default function GrainOverlay({
  position = "absolute",
  opacity = 0.05,
  className = "",
}: GrainOverlayProps) {
  return (
    <div
      aria-hidden="true"
      style={{ opacity, backgroundImage: NOISE_DATA_URI }}
      className={`pointer-events-none inset-0 z-[2] mix-blend-overlay [background-size:180px_180px] ${position} ${className}`}
    />
  );
}
