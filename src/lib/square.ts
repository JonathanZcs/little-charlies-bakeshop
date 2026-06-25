import { SquareClient, SquareEnvironment } from "square";
import type { Order } from "./db";

// ── Raw fetch helpers for the finances dashboard ──────────────────────────────

const SQUARE_BASE = "https://connect.squareup.com/v2";

function squareHeaders() {
  return {
    "Square-Version": "2024-02-22",
    Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export function isSquareConfigured() {
  return !!(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_LOCATION_ID);
}

export async function getLocationSummary() {
  if (!isSquareConfigured()) return null;
  const locationId = process.env.SQUARE_LOCATION_ID!;
  const res = await fetch(`${SQUARE_BASE}/locations/${locationId}`, {
    headers: squareHeaders(),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.location as Record<string, unknown>) ?? null;
}

export async function getSalesSummary(locationId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const body = {
    location_ids: [locationId],
    query: {
      filter: {
        date_time_filter: { created_at: { start_at: startOfMonth } },
        state_filter: { states: ["COMPLETED"] },
      },
    },
    limit: 500,
  };

  const res = await fetch(`${SQUARE_BASE}/orders/search`, {
    method: "POST",
    headers: squareHeaders(),
    body: JSON.stringify(body),
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.orders as Record<string, unknown>[]) ?? [];
}

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const locationId  = process.env.SQUARE_LOCATION_ID;

const environment =
  process.env.NODE_ENV === "production" ? SquareEnvironment.Production : SquareEnvironment.Sandbox;

function client() {
  if (!accessToken) return null;
  return new SquareClient({ token: accessToken, environment });
}

export type InvoiceResult = {
  invoiceId: string;
  invoiceUrl: string;
  depositAmountCents: number;
};

/**
 * Creates a Square customer + invoice for a deposit, sends it to the customer's email.
 * depositAmountCents: how much to charge as deposit (e.g. 5000 = $50.00)
 */
export async function createDepositInvoice(
  order: Order,
  depositAmountCents: number
): Promise<InvoiceResult | null> {
  const c = client();
  if (!c || !locationId) {
    console.warn("[square] Square not configured — skipping invoice creation.");
    return null;
  }

  // 1. Create customer
  const customerRes = await c.customers.create({
    givenName: order.customer_name.split(" ")[0],
    familyName: order.customer_name.split(" ").slice(1).join(" ") || "",
    emailAddress: order.customer_email,
    phoneNumber: order.customer_phone,
    referenceId: order.id,
  });
  const customerId = customerRes.customer?.id;
  if (!customerId) throw new Error("Failed to create Square customer");

  // 2. Create a Square order (line item: deposit)
  const orderRes = await c.orders.create({
    order: {
      locationId,
      customerId,
      lineItems: [
        {
          name: `Deposit — ${order.order_type}`,
          quantity: "1",
          basePriceMoney: { amount: BigInt(depositAmountCents), currency: "USD" },
        },
      ],
      referenceId: order.id,
    },
    idempotencyKey: `order-${order.id}`,
  });
  const squareOrderId = orderRes.order?.id;
  if (!squareOrderId) throw new Error("Failed to create Square order");

  // 3. Create invoice
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const invoiceRes = await c.invoices.create({
    invoice: {
      locationId,
      orderId: squareOrderId,
      primaryRecipient: { customerId },
      title: `Little Charlie's Bakeshop — ${order.order_type} Deposit`,
      description: `Deposit to confirm your ${order.order_type} order. Balance due on pickup.`,
      deliveryMethod: "EMAIL",
      paymentRequests: [
        {
          requestType: "DEPOSIT",
          dueDate: dueDate.toISOString().split("T")[0],
          fixedAmountRequestedMoney: { amount: BigInt(depositAmountCents), currency: "USD" },
          automaticPaymentSource: "NONE",
          reminders: [{ message: "Friendly reminder: your deposit for Little Charlie's Bakeshop is due soon.", relativeScheduledDays: -1 }],
        },
      ],
    },
    idempotencyKey: `invoice-${order.id}`,
  });

  const invoice = invoiceRes.invoice;
  if (!invoice?.id) throw new Error("Failed to create Square invoice");

  // 4. Publish (send) the invoice
  await c.invoices.publish({
    invoiceId: invoice.id,
    version: invoice.version ?? 0,
    idempotencyKey: `publish-${order.id}`,
  });

  return {
    invoiceId: invoice.id,
    invoiceUrl: invoice.publicUrl ?? "",
    depositAmountCents,
  };
}
