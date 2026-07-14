import { Link } from "@/lib/i18n/navigation";

interface LogoProps {
  /** Color of the "E" glyph. "PROX" is always rendered in rust. */
  variant?: "light" | "dark";
}

export default function Logo({ variant = "light" }: LogoProps) {
  const glyphColor = variant === "light" ? "text-sand" : "text-obsidian";

  return (
    <Link
      href="/"
      aria-label="Eprox Studio — home"
      className="font-display text-2xl tracking-wide"
    >
      <span className={glyphColor}>E</span>
      <span className="text-rust">PROX</span>
    </Link>
  );
}
