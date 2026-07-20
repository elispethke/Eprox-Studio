"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export type WorkCategory = "all" | "websites" | "systems" | "apps";
export type WorkSort = "recent" | "az";

interface CategoryFilterProps {
  categories: { id: WorkCategory; label: string }[];
  active: WorkCategory;
  onChange: (category: WorkCategory) => void;
  sort: WorkSort;
  onSortChange: (sort: WorkSort) => void;
  sortLabels: Record<WorkSort, string>;
  sortAriaLabel: string;
}

/**
 * The reference's segmented selector: a glass pill rail where the active
 * indicator glides between options (shared layout animation), plus the
 * quiet "sort" dropdown on the right.
 */
export default function CategoryFilter({
  categories,
  active,
  onChange,
  sort,
  onSortChange,
  sortLabels,
  sortAriaLabel,
}: CategoryFilterProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSortOpen) return;
    const close = (event: globalThis.PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node))
        setIsSortOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [isSortOpen]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div
        role="tablist"
        aria-label={categories[0]?.label}
        className="flex items-center gap-1 rounded-full border border-sand/10 bg-sand/[0.03] p-1.5 backdrop-blur-sm"
      >
        {categories.map((category) => {
          const isActive = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(category.id)}
              className={`relative rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 sm:px-5 ${
                isActive ? "text-obsidian" : "text-sand/60 hover:text-sand"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="work-filter-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-rust-light to-rust shadow-[0_6px_18px_-6px_rgba(201,121,60,0.7)]"
                />
              )}
              <span className="relative z-10">{category.label}</span>
            </button>
          );
        })}
      </div>

      <div ref={sortRef} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isSortOpen}
          aria-label={sortAriaLabel}
          onClick={() => setIsSortOpen((open) => !open)}
          className="flex items-center gap-2 rounded-full border border-sand/10 bg-sand/[0.03] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-sand/70 transition-colors hover:border-rust/50 hover:text-sand"
        >
          {sortLabels[sort]}
          <ChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 text-rust transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {isSortOpen && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute right-0 top-full z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-sand/10 bg-obsidian-deep/95 p-1.5 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              {(Object.keys(sortLabels) as WorkSort[]).map((option) => (
                <li key={option} role="option" aria-selected={option === sort}>
                  <button
                    type="button"
                    onClick={() => {
                      onSortChange(option);
                      setIsSortOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                      option === sort
                        ? "text-rust"
                        : "text-sand/70 hover:bg-sand/[0.05] hover:text-sand"
                    }`}
                  >
                    {sortLabels[option]}
                    {option === sort && (
                      <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
