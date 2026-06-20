import { describe, it, expect } from "vitest";

// Inline the auth check from the admin orders route so we can test it
// without importing Next.js internals.
function isAuthorized(headerValue: string | null, adminPassword: string | undefined): boolean {
  if (!adminPassword) return false;
  return headerValue === adminPassword;
}

describe("Admin API authorization", () => {
  const PASSWORD = "hunter2-secret";

  it("allows correct password", () => {
    expect(isAuthorized(PASSWORD, PASSWORD)).toBe(true);
  });

  it("rejects wrong password", () => {
    expect(isAuthorized("wrong", PASSWORD)).toBe(false);
  });

  it("rejects missing header (null)", () => {
    expect(isAuthorized(null, PASSWORD)).toBe(false);
  });

  it("rejects when ADMIN_PASSWORD env var is not set", () => {
    expect(isAuthorized(PASSWORD, undefined)).toBe(false);
  });

  it("rejects empty string header", () => {
    expect(isAuthorized("", PASSWORD)).toBe(false);
  });
});
