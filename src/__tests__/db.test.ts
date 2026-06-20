import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock @neondatabase/serverless before importing db.ts
const mockSql = vi.fn();
vi.mock("@neondatabase/serverless", () => ({
  neon: () => mockSql,
}));

// Provide DATABASE_URL so the module initialises sql instead of returning null
vi.stubEnv("DATABASE_URL", "postgresql://mock");

// Import AFTER mocks are in place
const { createOrder, getOrders, getOrder, updateOrderStatus } = await import("@/lib/db");

const SAMPLE_ORDER = {
  id: "order-uuid-1",
  created_at: "2025-01-10T12:00:00Z",
  customer_name: "Jane Doe",
  customer_phone: "555-0100",
  customer_email: "jane@example.com",
  order_type: "Decorated Cookies",
  event_date: "2025-01-20",
  details: "A dozen sugar cookies with pink frosting.",
  status: "pending" as const,
  admin_note: null,
  square_invoice_id: null,
  square_invoice_url: null,
  deposit_amount_cents: null,
  accepted_at: null,
  declined_at: null,
  deposit_paid_at: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("createOrder", () => {
  it("returns the inserted order", async () => {
    mockSql.mockResolvedValueOnce([SAMPLE_ORDER]);
    const result = await createOrder({
      customer_name: "Jane Doe",
      customer_phone: "555-0100",
      customer_email: "jane@example.com",
      order_type: "Decorated Cookies",
      event_date: "2025-01-20",
      details: "A dozen sugar cookies with pink frosting.",
    });
    expect(result).toEqual(SAMPLE_ORDER);
    expect(mockSql).toHaveBeenCalledOnce();
  });
});

describe("getOrders", () => {
  it("returns all orders when no status filter given", async () => {
    mockSql.mockResolvedValueOnce([SAMPLE_ORDER]);
    const result = await getOrders();
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("pending");
  });

  it("filters by status", async () => {
    mockSql.mockResolvedValueOnce([{ ...SAMPLE_ORDER, status: "accepted" }]);
    const result = await getOrders("accepted");
    expect(result[0].status).toBe("accepted");
  });

  it("returns empty array when no rows", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await getOrders();
    expect(result).toEqual([]);
  });
});

describe("getOrder", () => {
  it("returns the matching order", async () => {
    mockSql.mockResolvedValueOnce([SAMPLE_ORDER]);
    const result = await getOrder("order-uuid-1");
    expect(result?.id).toBe("order-uuid-1");
  });

  it("returns null when not found", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await getOrder("does-not-exist");
    expect(result).toBeNull();
  });
});

describe("updateOrderStatus", () => {
  it("returns the updated order on success", async () => {
    const updated = { ...SAMPLE_ORDER, status: "accepted" as const, accepted_at: "2025-01-10T13:00:00Z" };
    mockSql.mockResolvedValueOnce([updated]);
    const result = await updateOrderStatus("order-uuid-1", "accepted");
    expect(result?.status).toBe("accepted");
    expect(result?.accepted_at).toBeTruthy();
  });

  it("passes extra fields through", async () => {
    const updated = { ...SAMPLE_ORDER, status: "accepted" as const, square_invoice_id: "inv_123", deposit_amount_cents: 5000 };
    mockSql.mockResolvedValueOnce([updated]);
    const result = await updateOrderStatus("order-uuid-1", "accepted", {
      square_invoice_id: "inv_123",
      deposit_amount_cents: 5000,
    });
    expect(result?.square_invoice_id).toBe("inv_123");
    expect(result?.deposit_amount_cents).toBe(5000);
  });

  it("returns null when order not found", async () => {
    mockSql.mockResolvedValueOnce([]);
    const result = await updateOrderStatus("missing", "declined");
    expect(result).toBeNull();
  });
});

describe("graceful no-op when DATABASE_URL is not set", () => {
  it("createOrder returns null", async () => {
    // Re-import with DATABASE_URL explicitly cleared (vi.unstubAllEnvs doesn't remove
    // real env vars — on Vercel the var is set in the build environment itself)
    vi.resetModules();
    vi.stubEnv("DATABASE_URL", "");
    const { createOrder: co } = await import("@/lib/db");
    const result = await co({
      customer_name: "Test",
      customer_phone: "555",
      customer_email: "t@t.com",
      order_type: "Cake",
      event_date: null,
      details: "test",
    });
    expect(result).toBeNull();
    expect(mockSql).not.toHaveBeenCalled();
  });
});
