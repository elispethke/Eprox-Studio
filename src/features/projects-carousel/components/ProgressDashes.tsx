"use client";

interface ProgressDashesProps {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  /** aria-label prefix for each dash, e.g. "Go to project". */
  goToLabel: string;
  labels: string[];
}

/**
 * Dash-style progress indicator: one short muted dash per project, with the
 * active one longer and brighter, inside a subtle pill housing.
 */
export default function ProgressDashes({
  count,
  activeIndex,
  onSelect,
  goToLabel,
  labels,
}: ProgressDashesProps) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-sand/10 bg-sand/[0.03] px-6 py-4">
      {Array.from({ length: count }, (_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${goToLabel}: ${labels[index]}`}
            aria-current={isActive}
            className="group flex h-4 items-center"
          >
            <span
              className={`h-[3px] rounded-full transition-all duration-500 ${
                isActive
                  ? "w-10 bg-sand"
                  : "w-6 bg-sand/25 group-hover:bg-sand/50"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
