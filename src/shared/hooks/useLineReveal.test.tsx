import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineReveal, splitIntoLines } from "./useLineReveal";

describe("splitIntoLines", () => {
  it("never loses or reorders words", () => {
    const text = "Transforming Ideas into Digital Products";
    expect(splitIntoLines(text, 22).join(" ")).toBe(text);
  });

  it("respects the target line length at word boundaries", () => {
    const lines = splitIntoLines("one two three four five six seven", 10);
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(14); // word overflow tolerance
    }
  });

  it("keeps a single long word intact", () => {
    expect(splitIntoLines("Extraordinary", 5)).toEqual(["Extraordinary"]);
  });

  it("handles the empty string", () => {
    expect(splitIntoLines("", 20)).toEqual([]);
  });
});

describe("LineReveal", () => {
  it("renders every line's text", () => {
    render(
      <h2>
        <LineReveal lines={["Where It", "All Began"]} />
      </h2>
    );
    expect(screen.getByText("Where It")).toBeInTheDocument();
    expect(screen.getByText("All Began")).toBeInTheDocument();
  });
});
