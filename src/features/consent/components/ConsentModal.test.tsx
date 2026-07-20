import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  renderWithIntl,
  screen,
  waitFor,
  userEvent,
} from "@/test/renderWithIntl";
import ConsentModal from "./ConsentModal";

function clearConsentCookie() {
  document.cookie = "eprox-consent=; Max-Age=0; Path=/";
}

function readConsentCookie(): string | null {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith("eprox-consent="));
  return match?.split("=")[1] ?? null;
}

// The dialog opens on a real ~900ms delay (see useConsent's OPEN_DELAY_MS) —
// using real timers here (not vi.useFakeTimers) avoids fighting framer-motion's
// own requestAnimationFrame-driven animation loop.
describe("ConsentModal", () => {
  beforeEach(clearConsentCookie);
  afterEach(clearConsentCookie);

  it("does not render immediately on mount", () => {
    renderWithIntl(<ConsentModal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens after the delay when no choice is stored, focused on Accept", async () => {
    renderWithIntl(<ConsentModal />);

    const dialog = await screen.findByRole("dialog", {}, { timeout: 2000 });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Accept" })).toHaveFocus();
  });

  it("never opens when a choice is already stored", async () => {
    document.cookie = "eprox-consent=accepted; Path=/";
    renderWithIntl(<ConsentModal />);

    // Wait past the open delay and confirm it still never appeared.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Accept stores the choice and closes the dialog", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ConsentModal />);

    await screen.findByRole("dialog", {}, { timeout: 2000 });
    await user.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => expect(readConsentCookie()).toBe("accepted"));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("Decline stores the choice and closes the dialog", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ConsentModal />);

    await screen.findByRole("dialog", {}, { timeout: 2000 });
    await user.click(screen.getByRole("button", { name: "Decline" }));

    await waitFor(() => expect(readConsentCookie()).toBe("declined"));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });
});
