interface ProjectBadgeProps {
  label: string;
}

/** Tiny tech chip on project cards — quiet glass pill in the mono voice. */
export default function ProjectBadge({ label }: ProjectBadgeProps) {
  return (
    <span className="rounded-full border border-sand/10 bg-sand/[0.04] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-sand/70">
      {label}
    </span>
  );
}
