import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import FloatingField from "./FloatingField";

describe("FloatingField accessibility (axe)", () => {
  it("has no detectable a11y violations, idle and errored", async () => {
    const { container } = render(
      <form>
        <FloatingField
          id="name"
          label="Your Name"
          value=""
          onChange={() => undefined}
        />
        <FloatingField
          id="email"
          label="Email Address"
          type="email"
          value="nope"
          onChange={() => undefined}
          error="Enter a valid email address"
        />
      </form>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
