import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProgressDashes from "./ProgressDashes";

const LABELS = ["Vertix Studio", "Nextmotion", "Spacia Interiors"];

describe("ProgressDashes", () => {
  it("renders one dash per project and marks the active one", () => {
    render(
      <ProgressDashes
        count={3}
        activeIndex={1}
        onSelect={vi.fn()}
        goToLabel="Go to project"
        labels={LABELS}
      />
    );

    const dashes = screen.getAllByRole("button");
    expect(dashes).toHaveLength(3);
    expect(dashes[1]).toHaveAttribute("aria-current", "true");
    expect(dashes[0]).toHaveAttribute("aria-current", "false");
    expect(dashes[2]).toHaveAttribute("aria-current", "false");
  });

  it("calls onSelect with the clicked index", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <ProgressDashes
        count={3}
        activeIndex={0}
        onSelect={onSelect}
        goToLabel="Go to project"
        labels={LABELS}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /go to project: spacia interiors/i })
    );

    expect(onSelect).toHaveBeenCalledWith(2);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
