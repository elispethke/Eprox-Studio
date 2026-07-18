import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

interface PillButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  /** Intercept navigation (e.g. to smooth-scroll an in-page anchor via Lenis). */
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const PILL_CLASSNAME =
  "group inline-flex items-center gap-2.5 rounded-full border border-rust/50 bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-sand transition-all duration-300 hover:border-rust hover:bg-rust/10 hover:shadow-[0_0_24px_-4px_rgba(201,121,60,0.55)]";

const ARROW_CLASSNAME =
  "h-3.5 w-3.5 text-rust transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5";

/**
 * Bordered pill CTA with a diagonal arrow — e.g. "LET'S TALK". Fills subtly
 * and glows on hover instead of hard-swapping to a solid background.
 */
export default function PillButton({
  href,
  children,
  className = "",
  onClick,
}: PillButtonProps) {
  const classes = `${PILL_CLASSNAME} ${className}`;

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {children}
        <ArrowUpRight aria-hidden="true" className={ARROW_CLASSNAME} />
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={classes}>
      {children}
      <ArrowUpRight aria-hidden="true" className={ARROW_CLASSNAME} />
    </Link>
  );
}
