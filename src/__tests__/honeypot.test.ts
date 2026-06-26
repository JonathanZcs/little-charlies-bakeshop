import { describe, it, expect } from "vitest";

// Mirrors the contact route's honeypot check.
function isHoneypotTripped(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

describe("Honeypot spam detection on /api/contact", () => {
  it("ignores null (real user — field not in form data)", () => {
    expect(isHoneypotTripped(null)).toBe(false);
  });

  it("ignores undefined (real user — field never set)", () => {
    expect(isHoneypotTripped(undefined)).toBe(false);
  });

  it("ignores empty string (real user — autofill suppressed)", () => {
    expect(isHoneypotTripped("")).toBe(false);
  });

  it("ignores whitespace only", () => {
    expect(isHoneypotTripped("   ")).toBe(false);
  });

  it("trips on common bot-injected URL", () => {
    expect(isHoneypotTripped("https://spam.example.com")).toBe(true);
  });

  it("trips on plain text (bot misidentified field)", () => {
    expect(isHoneypotTripped("Acme Corp")).toBe(true);
  });

  it("trips even on a single character", () => {
    expect(isHoneypotTripped("a")).toBe(true);
  });
});
