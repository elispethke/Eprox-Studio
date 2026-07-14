import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}

const LINK_CLASSNAME =
  "font-subtitle text-sm text-sand/80 transition-colors hover:text-rust";

/**
 * Section anchors (e.g. "#vision") don't go through locale-aware routing —
 * only real internal paths (e.g. "/") do.
 */
export default function NavLink({ href, children, onClick }: NavLinkProps) {
  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={onClick} className={LINK_CLASSNAME}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={LINK_CLASSNAME}>
      {children}
    </Link>
  );
}
