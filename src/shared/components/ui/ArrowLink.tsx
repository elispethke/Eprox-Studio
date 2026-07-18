import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

interface ArrowLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const LABEL_CLASSNAME =
  "font-mono text-xs uppercase tracking-[0.2em] text-sand";

/**
 * Text link with a diagonal arrow and a two-layer underline: a faint line
 * that's always visible, plus an accent line that sweeps in from the left
 * on hover — e.g. "VIEW OUR WORK".
 */
export default function ArrowLink({ href, children, className = "" }: ArrowLinkProps) {
  const content = (
    <>
      <span className={LABEL_CLASSNAME}>{children}</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-3.5 w-3.5 text-rust transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-sand/30"
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rust transition-transform duration-300 group-hover:scale-x-100"
      />
    </>
  );

  const classes = `group relative inline-flex items-center gap-2 pb-1.5 ${className}`;

  if (href.startsWith("#")) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
