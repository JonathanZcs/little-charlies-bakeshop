import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.warn("[db] DATABASE_URL not set — DB calls will fail until Neon is connected.");
}

export const sql = process.env.DATABASE_URL
  ? neon(process.env.DATABASE_URL)
  : null;

export type OrderStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "deposit_paid"
  | "completed";

export type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_type: string;
  event_date: string | null;
  details: string;
  status: OrderStatus;
  admin_note: string | null;
  square_invoice_id: string | null;
  square_invoice_url: string | null;
  deposit_amount_cents: number | null;
  accepted_at: string | null;
  declined_at: string | null;
  deposit_paid_at: string | null;
};

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_type: string;
  event_date: string | null;
  details: string;
}): Promise<Order | null> {
  if (!sql) return null;
  const rows = await sql`
    INSERT INTO orders (customer_name, customer_phone, customer_email, order_type, event_date, details)
    VALUES (${data.customer_name}, ${data.customer_phone}, ${data.customer_email},
            ${data.order_type}, ${data.event_date}, ${data.details})
    RETURNING *
  `;
  return rows[0] as Order;
}

export async function getOrders(status?: OrderStatus): Promise<Order[]> {
  if (!sql) return [];
  const rows = status
    ? await sql`SELECT * FROM orders WHERE status = ${status} ORDER BY created_at DESC`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC`;
  return rows as Order[];
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!sql) return null;
  const rows = await sql`SELECT * FROM orders WHERE id = ${id}`;
  return (rows[0] as Order) ?? null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!sql) return false;
  await sql`DELETE FROM orders WHERE id = ${id}`;
  return true;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra: Partial<Pick<Order, "admin_note" | "square_invoice_id" | "square_invoice_url" | "deposit_amount_cents">> = {}
): Promise<Order | null> {
  if (!sql) return null;
  const now = new Date().toISOString();
  const rows = await sql`
    UPDATE orders SET
      status               = ${status},
      admin_note           = COALESCE(${extra.admin_note ?? null}, admin_note),
      square_invoice_id    = COALESCE(${extra.square_invoice_id ?? null}, square_invoice_id),
      square_invoice_url   = COALESCE(${extra.square_invoice_url ?? null}, square_invoice_url),
      deposit_amount_cents = COALESCE(${extra.deposit_amount_cents ?? null}, deposit_amount_cents),
      accepted_at          = CASE WHEN ${status} = 'accepted' THEN ${now} ELSE accepted_at END,
      declined_at          = CASE WHEN ${status} = 'declined' THEN ${now} ELSE declined_at END,
      deposit_paid_at      = CASE WHEN ${status} = 'deposit_paid' THEN ${now} ELSE deposit_paid_at END
    WHERE id = ${id}
    RETURNING *
  `;
  return (rows[0] as Order) ?? null;
}
