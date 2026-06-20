import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Order } from "@/lib/db";

const mockCreate = vi.fn().mockResolvedValue({ sid: "SM123" });
vi.mock("twilio", () => ({
  default: vi.fn(() => ({
    messages: { create: mockCreate },
  })),
}));

const SAMPLE_ORDER: Order = {
  id: "order-uuid-1",
  created_at: "2025-01-10T12:00:00Z",
  customer_name: "Jane Doe",
  customer_phone: "555-0100",
  customer_email: "jane@example.com",
  order_type: "Decorated Cookies",
  event_date: "2025-01-20",
  details: "A dozen sugar cookies.",
  status: "pending",
  admin_note: null,
  square_invoice_id: null,
  square_invoice_url: null,
  deposit_amount_cents: null,
  accepted_at: null,
  declined_at: null,
  deposit_paid_at: null,
  image_urls: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadSms() {
  return import("@/lib/sms");
}

describe("SMS — skips gracefully when not configured", () => {
  it("sendOrderAlertSMS does not throw when Twilio env vars are absent", async () => {
    const { sendOrderAlertSMS } = await loadSms();
    await expect(sendOrderAlertSMS(SAMPLE_ORDER)).resolves.toBeUndefined();
    expect(mockCreate).not.toHaveBeenCalled();
  });
});

describe("SMS — sends when fully configured", () => {
  beforeEach(() => {
    vi.stubEnv("TWILIO_ACCOUNT_SID", "ACtest");
    vi.stubEnv("TWILIO_AUTH_TOKEN", "authtest");
    vi.stubEnv("TWILIO_PHONE_NUMBER", "+13300000001");
    vi.stubEnv("BAKERY_PHONE_NUMBER", "+13300000002");
  });

  it("sendOrderAlertSMS calls messages.create with order info", async () => {
    const { sendOrderAlertSMS } = await loadSms();
    await sendOrderAlertSMS(SAMPLE_ORDER);
    expect(mockCreate).toHaveBeenCalledOnce();
    const arg = mockCreate.mock.calls[0][0] as { body: string; from: string; to: string };
    expect(arg.body).toContain("Jane Doe");
    expect(arg.body).toContain("Decorated Cookies");
    expect(arg.to).toBe("+13300000002");
    expect(arg.from).toBe("+13300000001");
  });

  it("sendOrderAlertSMS formats pickup date correctly", async () => {
    const { sendOrderAlertSMS } = await loadSms();
    await sendOrderAlertSMS(SAMPLE_ORDER);
    const arg = mockCreate.mock.calls[0][0] as { body: string };
    expect(arg.body).toContain("Pickup:");
    expect(arg.body).toContain("Jan");
  });

  it("sendOrderAlertSMS sends to all comma-separated recipients", async () => {
    vi.stubEnv("BAKERY_PHONE_NUMBER", "+13300000002,+13300000003");
    const { sendOrderAlertSMS } = await loadSms();
    await sendOrderAlertSMS(SAMPLE_ORDER);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });
});
