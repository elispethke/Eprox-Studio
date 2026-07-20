import { describe, expect, it } from "vitest";
import { contactSchema } from "./schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "New project",
  message: "We would like to build a premium marketing site.",
  website: "",
};

describe("contactSchema", () => {
  it("accepts a complete, valid submission", () => {
    const parsed = contactSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false
    );
  });

  it("rejects a too-short message", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(
      false
    );
  });

  it("rejects missing required fields", () => {
    expect(contactSchema.safeParse({ ...valid, name: " " }).success).toBe(
      false
    );
    expect(contactSchema.safeParse({ ...valid, subject: "" }).success).toBe(
      false
    );
  });

  it("ALLOWS a filled honeypot — the route answers it with a fake success", () => {
    const parsed = contactSchema.safeParse({
      ...valid,
      website: "http://spam.example",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.website).toBe("http://spam.example");
  });

  it("defaults the honeypot to empty when omitted", () => {
    const withoutHoneypot: Partial<typeof valid> = { ...valid };
    delete withoutHoneypot.website;
    const parsed = contactSchema.safeParse(withoutHoneypot);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.website).toBe("");
  });

  it("trims whitespace around text fields", () => {
    const parsed = contactSchema.safeParse({ ...valid, name: "  Ada  " });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.name).toBe("Ada");
  });
});
