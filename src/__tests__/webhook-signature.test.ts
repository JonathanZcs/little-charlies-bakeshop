import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";

// Inline the verification logic from the webhook route so we can unit-test
// it without Next.js request machinery.
function verifySquareSignature(body: string, signature: string, notificationUrl: string, secret: string): boolean {
  const payload = notificationUrl + body;
  const expected = createHmac("sha256", secret).update(payload).digest("base64");
  return expected === signature;
}

const SECRET = "test-webhook-secret";
const URL = "https://example.com/api/webhooks/square";

function makeSignature(body: string): string {
  return createHmac("sha256", SECRET).update(URL + body).digest("base64");
}

describe("Square webhook HMAC-SHA256 verification", () => {
  it("accepts a valid signature", () => {
    const body = JSON.stringify({ type: "invoice.payment_made" });
    const sig = makeSignature(body);
    expect(verifySquareSignature(body, sig, URL, SECRET)).toBe(true);
  });

  it("rejects a tampered body", () => {
    const body = JSON.stringify({ type: "invoice.payment_made" });
    const sig = makeSignature(body);
    const tampered = JSON.stringify({ type: "payment.completed", extra: "injected" });
    expect(verifySquareSignature(tampered, sig, URL, SECRET)).toBe(false);
  });

  it("rejects a wrong secret", () => {
    const body = JSON.stringify({ type: "invoice.payment_made" });
    const sig = makeSignature(body);
    expect(verifySquareSignature(body, sig, URL, "wrong-secret")).toBe(false);
  });

  it("rejects an empty signature", () => {
    const body = JSON.stringify({ type: "invoice.payment_made" });
    expect(verifySquareSignature(body, "", URL, SECRET)).toBe(false);
  });

  it("rejects when URL differs", () => {
    const body = JSON.stringify({ type: "invoice.payment_made" });
    const sig = makeSignature(body);
    const differentUrl = "https://attacker.com/api/webhooks/square";
    expect(verifySquareSignature(body, sig, differentUrl, SECRET)).toBe(false);
  });
});
