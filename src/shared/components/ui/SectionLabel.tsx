import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Uppercase, tracked kicker label followed by a short accent rule — the
 * "(03) DIGITAL ENGINEERING —" pattern used above section headlines.
 */
export default function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-rust">
        {children}
      </span>
      <span aria-hidden="true" className="h-px w-10 bg-rust/60" />
    </div>
  );
}
