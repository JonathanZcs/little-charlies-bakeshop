import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getOrders, updateOrderStatus } from "@/lib/db";
import { sendDepositPaidSMS } from "@/lib/sms";

// Square sends a HMAC-SHA256 signature in x-square-hmacsha256-signature
function verifySignature(body: string, signature: string, notificationUrl: string): boolean {
  const secret = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  if (!secret) return false;
  const payload = notificationUrl + body;
  const expected = createHmac("sha256", secret).update(payload).digest("base64");
  return expected === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature") ?? "";
  const notificationUrl =
    process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/square`
      : "https://little-charlies-bakeshop-git-main-jz10.vercel.app/api/webhooks/square";

  if (!verifySignature(body, signature, notificationUrl)) {
    console.error("[webhook/square] Invalid signature");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const eventType = event.type as string;

  // Handle invoice payment events
  if (eventType === "invoice.payment_made" || eventType === "payment.completed") {
    const data = event.data as Record<string, unknown> | undefined;
    const obj = data?.object as Record<string, unknown> | undefined;
    const invoice = obj?.invoice as Record<string, unknown> | undefined;
    const orderId = invoice?.order_id as string | undefined;

    if (orderId) {
      // Find the order by Square order reference
      const orders = await getOrders("accepted");
      const matched = orders.find((o) => o.square_invoice_id && invoice?.id === o.square_invoice_id);
      if (matched) {
        const updated = await updateOrderStatus(matched.id, "deposit_paid");
        if (updated) {
          await sendDepositPaidSMS(updated).catch(console.error);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
