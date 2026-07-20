import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export default function SectionLabel({
  children,
  className = "",
}: SectionLabelProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-mono text-xl uppercase tracking-[0.15em] text-rust">
        {children}
      </span>
    </div>
  );
}
