import { beforeEach, describe, expect, it } from "vitest";
import { readStoredChoice } from "./useConsent";

function clearConsentCookie() {
  document.cookie = "eprox-consent=; Max-Age=0; Path=/";
}

describe("readStoredChoice", () => {
  beforeEach(clearConsentCookie);

  it("returns null when no choice was stored", () => {
    expect(readStoredChoice()).toBeNull();
  });

  it("reads back an accepted choice", () => {
    document.cookie = "eprox-consent=accepted; Path=/";
    expect(readStoredChoice()).toBe("accepted");
  });

  it("reads back a declined choice", () => {
    document.cookie = "eprox-consent=declined; Path=/";
    expect(readStoredChoice()).toBe("declined");
  });

  it("ignores tampered values", () => {
    document.cookie = "eprox-consent=whatever; Path=/";
    expect(readStoredChoice()).toBeNull();
  });
});
