import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import LegalPage from "./LegalPage";

describe("accessibility (axe)", () => {
  it("LegalPage has no detectable a11y violations", async () => {
    const { container } = render(
      <LegalPage
        kicker="Legal"
        title="Privacy Policy"
        updated="Last updated: July 2026"
        sections={[
          {
            heading: "What we collect",
            body: "Only what you type into the form.",
          },
          { heading: "Your rights", body: "Write to us any time." },
        ]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
