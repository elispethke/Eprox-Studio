import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CarouselControls from "./CarouselControls";

const baseProps = {
  prevLabel: "Previous project",
  nextLabel: "Next project",
  playLabel: "Resume autoplay",
  pauseLabel: "Pause autoplay",
};

describe("CarouselControls", () => {
  it("calls onPrev / onNext when the arrows are clicked", async () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    const user = userEvent.setup();
    render(
      <CarouselControls
        {...baseProps}
        onPrev={onPrev}
        onNext={onNext}
        onTogglePlay={vi.fn()}
        isUserPaused={false}
      />
    );

    await user.click(screen.getByRole("button", { name: "Previous project" }));
    await user.click(screen.getByRole("button", { name: "Next project" }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("shows the pause control when autoplay is running, and toggles it", async () => {
    const onTogglePlay = vi.fn();
    const user = userEvent.setup();
    render(
      <CarouselControls
        {...baseProps}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onTogglePlay={onTogglePlay}
        isUserPaused={false}
      />
    );

    const toggle = screen.getByRole("button", { name: "Pause autoplay" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it("shows the resume control and aria-pressed=true when the visitor has paused", () => {
    render(
      <CarouselControls
        {...baseProps}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onTogglePlay={vi.fn()}
        isUserPaused
      />
    );

    const toggle = screen.getByRole("button", { name: "Resume autoplay" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("renders the progress dashes passed as children between the arrows", () => {
    render(
      <CarouselControls
        {...baseProps}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onTogglePlay={vi.fn()}
        isUserPaused={false}
      >
        <span data-testid="dashes">dashes-slot</span>
      </CarouselControls>
    );

    expect(screen.getByTestId("dashes")).toBeInTheDocument();
  });
});
