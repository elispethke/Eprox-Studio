"use client";

import type { ReactNode, MouseEvent } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useAnchorScroll } from "@/shared/hooks/useAnchorScroll";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void;
}

const LINK_CLASSNAME =
  "font-subtitle text-sm text-sand/80 transition-colors hover:text-rust";

/**
 * Section anchors (e.g. "#vision") smooth-scroll via Lenis when already on
 * the home page, and route to "/#vision" from any other page. Real internal
 * paths (e.g. "/work") go through locale-aware routing.
 */
export default function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const scrollToAnchor = useAnchorScroll();

  if (href.startsWith("#")) {
    if (pathname === "/") {
      const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        scrollToAnchor(href);
        onClick?.();
      };
      return (
        <a href={href} onClick={handleClick} className={LINK_CLASSNAME}>
          {children}
        </a>
      );
    }
    return (
      <Link href={`/${href}`} onClick={onClick} className={LINK_CLASSNAME}>
        {children}
      </Link>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={LINK_CLASSNAME}>
      {children}
    </Link>
  );
}
