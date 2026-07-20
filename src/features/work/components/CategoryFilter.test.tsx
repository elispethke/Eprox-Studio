import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "./CategoryFilter";

const CATEGORIES = [
  { id: "all" as const, label: "All" },
  { id: "websites" as const, label: "Websites" },
  { id: "systems" as const, label: "Systems" },
  { id: "apps" as const, label: "Apps" },
];

const SORT_LABELS = { recent: "Most Recent", az: "A–Z" };

describe("CategoryFilter", () => {
  it("marks the active category tab as selected", () => {
    render(
      <CategoryFilter
        categories={CATEGORIES}
        active="websites"
        onChange={vi.fn()}
        sort="recent"
        onSortChange={vi.fn()}
        sortLabels={SORT_LABELS}
        sortAriaLabel="Sort"
      />
    );

    expect(screen.getByRole("tab", { name: "Websites" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("tab", { name: "Apps" })).toHaveAttribute(
      "aria-selected",
      "false"
    );
  });

  it("calls onChange with the clicked category id", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryFilter
        categories={CATEGORIES}
        active="all"
        onChange={onChange}
        sort="recent"
        onSortChange={vi.fn()}
        sortLabels={SORT_LABELS}
        sortAriaLabel="Sort"
      />
    );

    await user.click(screen.getByRole("tab", { name: "Systems" }));
    expect(onChange).toHaveBeenCalledWith("systems");
  });

  it("opens the sort menu and calls onSortChange with the picked option", async () => {
    const onSortChange = vi.fn();
    const user = userEvent.setup();
    render(
      <CategoryFilter
        categories={CATEGORIES}
        active="all"
        onChange={vi.fn()}
        sort="recent"
        onSortChange={onSortChange}
        sortLabels={SORT_LABELS}
        sortAriaLabel="Sort"
      />
    );

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Sort" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    // The li carries role="option" for a11y; the actual click target is the
    // button nested inside it.
    await user.click(screen.getByRole("button", { name: "A–Z" }));
    expect(onSortChange).toHaveBeenCalledWith("az");
  });
});
