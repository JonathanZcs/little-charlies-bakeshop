import { describe, it, expect, beforeEach, vi } from "vitest";

// Inline the validation logic (mirrors what the contact route does) so we can
// test it independently without importing Next.js server machinery.
// Uses UTC date-string comparison to avoid local-timezone edge cases.
function isDateTooSoon(eventDate: string): boolean {
  const minDate = new Date();
  minDate.setUTCDate(minDate.getUTCDate() + 3);
  const minDateStr = minDate.toISOString().split("T")[0];
  return eventDate < minDateStr;
}

describe("3-day lead time validation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-10T12:00:00Z"));
  });

  it("rejects today", () => {
    expect(isDateTooSoon("2025-01-10")).toBe(true);
  });

  it("rejects tomorrow", () => {
    expect(isDateTooSoon("2025-01-11")).toBe(true);
  });

  it("rejects 2 days out", () => {
    expect(isDateTooSoon("2025-01-12")).toBe(true);
  });

  it("allows exactly 3 days out", () => {
    expect(isDateTooSoon("2025-01-13")).toBe(false);
  });

  it("allows 4 days out", () => {
    expect(isDateTooSoon("2025-01-14")).toBe(false);
  });

  it("allows a month out", () => {
    expect(isDateTooSoon("2025-02-10")).toBe(false);
  });
});
