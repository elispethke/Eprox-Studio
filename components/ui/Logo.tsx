import { Link } from "@/lib/i18n/navigation";

interface LogoProps {
  /** Color of the "E" glyph. "X" is always rendered in rust. */
  variant?: "light" | "dark";
}

export default function Logo({ variant = "light" }: LogoProps) {
  const glyphColor = variant === "light" ? "text-sand" : "text-obsidian";

  return (
    <Link
      href="/"
      aria-label="Eprox Studio — home"
      className="flex h-11 w-11 items-center justify-center rounded-xl border border-rust/70 font-display text-xl tracking-wide"
    >
      <span className={glyphColor}>E</span>
      <span className="text-rust">X</span>
    </Link>
  );
}
