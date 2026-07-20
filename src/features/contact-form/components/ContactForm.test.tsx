import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  renderWithIntl,
  screen,
  waitFor,
  userEvent,
} from "@/test/renderWithIntl";
import ContactForm from "./ContactForm";

// user-event simulates a single visitor — typing into several fields must
// be sequential, not Promise.all'd, or focus/keystrokes race and fields end
// up empty.
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email Address"), "ada@example.com");
  await user.type(screen.getByLabelText("Subject"), "New project");
  await user.type(
    screen.getByLabelText("Your Message"),
    "We would like to build a premium marketing site."
  );
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders every field, the honeypot, and the submit button", () => {
    renderWithIntl(<ContactForm />);

    expect(screen.getByLabelText("Your Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Message")).toBeInTheDocument();
    // Honeypot exists but must never be reachable via Tab.
    const honeypot = screen.getByLabelText("Website", { selector: "input" });
    expect(honeypot).toHaveAttribute("tabIndex", "-1");
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("blocks submission and shows inline errors when fields are empty", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findAllByText("This field is required")
    ).not.toHaveLength(0);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("flags an invalid email without touching the network", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(screen.getByLabelText("Your Name"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email Address"), "not-an-email");
    await user.type(screen.getByLabelText("Subject"), "New project");
    await user.type(
      screen.getByLabelText("Your Message"),
      "We would like to build a premium marketing site."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Enter a valid email address")
    ).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits a valid form to the internal relay and shows the success state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/message sent/i)).toBeInTheDocument()
    );

    // The client only ever talks to the internal relay — never a third party.
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" })
    );
    const [, requestInit] = fetchMock.mock.calls[0];
    expect(String(requestInit.body)).not.toContain("formspree");

    // Fields reset after a successful submit.
    expect(screen.getByLabelText("Your Name")).toHaveValue("");
  });

  it("shows a generic error and keeps the form filled when the relay fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() =>
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    );
    expect(screen.getByLabelText("Your Name")).toHaveValue("Ada Lovelace");
  });
});
