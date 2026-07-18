import { Link } from "@/lib/i18n/navigation";

interface LogoProps {
  /** Text color for the wordmark and hex stroke. The accent ("E") stays rust regardless. */
  variant?: "light" | "dark";
  /** Renders only the hex mark, without the "EPROX STUDIO" wordmark — used where space is tight (e.g. Hero's corner signature). */
  showWordmark?: boolean;
  className?: string;
}

const HEX_POINTS = "40,22 31,37.588 13,37.588 4,22 13,6.412 31,6.412";

/**
 * Flat-sided hex mark with the "E" glyph centered inside — the wordmark's
 * icon half. Kept as its own function so the corner signature in the Hero
 * can render just the mark, without the "EPROX STUDIO" text beside it.
 */
function LogoMark({ variant }: { variant: "light" | "dark" }) {
  const strokeColor = variant === "light" ? "stroke-rust/70" : "stroke-obsidian/70";

  return (
    <svg
      viewBox="0 0 44 44"
      className={`h-11 w-11 ${strokeColor}`}
      fill="none"
      aria-hidden="true"
    >
      <polygon points={HEX_POINTS} strokeWidth="1.5" />
      <text
        x="22"
        y="27"
        textAnchor="middle"
        className="fill-rust font-subtitle text-[15px] font-bold"
        stroke="none"
      >
        E
      </text>
    </svg>
  );
}

export default function Logo({
  variant = "light",
  showWordmark = true,
  className = "",
}: LogoProps) {
  const textColor = variant === "light" ? "text-sand" : "text-obsidian";

  return (
    <Link
      href="/"
      aria-label="Eprox Studio — home"
      className={`flex items-center gap-3 ${className}`}
    >
      <LogoMark variant={variant} />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-subtitle text-lg font-bold tracking-[0.15em] ${textColor}`}
          >
            EPROX
          </span>
          <span className="mt-1 font-mono text-[10px] tracking-[0.35em] text-sand/50">
            STUDIO
          </span>
        </span>
      )}
    </Link>
  );
}
