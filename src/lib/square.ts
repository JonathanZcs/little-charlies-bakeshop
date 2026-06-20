import { SquareClient, SquareEnvironment } from "square";
import type { Order } from "./db";

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
