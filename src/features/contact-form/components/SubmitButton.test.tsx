import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
  it("idle: shows the label, is enabled", () => {
    render(
      <SubmitButton
        status="idle"
        idleLabel="Send Message"
        loadingLabel="Sending"
      />
    );
    const button = screen.getByRole("button", { name: /send message/i });
    expect(button).toBeEnabled();
  });

  it("loading: shows the loading label and disables the button", () => {
    render(
      <SubmitButton
        status="loading"
        idleLabel="Send Message"
        loadingLabel="Sending"
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Sending")).toBeInTheDocument();
  });

  it("success: shows the idle label again (with a check) and stays disabled", () => {
    render(
      <SubmitButton
        status="success"
        idleLabel="Send Message"
        loadingLabel="Sending"
      />
    );
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("error: falls back to the idle content and re-enables the button", () => {
    render(
      <SubmitButton
        status="error"
        idleLabel="Send Message"
        loadingLabel="Sending"
      />
    );
    expect(screen.getByRole("button")).toBeEnabled();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });
});
