import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/db";
import { createDepositInvoice } from "@/lib/square";
import { Resend } from "resend";
import { isAuthorizedRequest } from "@/lib/admin-session";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action, note, depositCents } = body as {
    action: "accept" | "decline" | "send_invoice" | "complete";
    note?: string;
    depositCents?: number;
  };

  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  switch (action) {
    case "accept": {
      const updated = await updateOrderStatus(id, "accepted", { admin_note: note });
      // Send acceptance email to customer
      await getResend().emails.send({
        from: "Little Charlie's Bakeshop <onboarding@resend.dev>",
        to: process.env.VERCEL_ENV === "production" ? order.customer_email : "jonz0917@yahoo.com",
        subject: "Your Order Inquiry — We'd Love to Help! 🎂",
        html: buildAcceptanceEmail(order.customer_name, order.order_type, note),
      }).catch(console.error);
      return NextResponse.json({ success: true });
    }

    case "decline": {
      const updated = await updateOrderStatus(id, "declined", { admin_note: note });
      await getResend().emails.send({
        from: "Little Charlie's Bakeshop <onboarding@resend.dev>",
        to: process.env.VERCEL_ENV === "production" ? order.customer_email : "jonz0917@yahoo.com",
        subject: "Your Order Inquiry — Little Charlie's Bakeshop",
        html: buildDeclineEmail(order.customer_name, order.order_type, note),
      }).catch(console.error);
      return NextResponse.json({ success: true });
    }

    case "send_invoice": {
      const cents = depositCents ?? 5000; // default $50 deposit
      const invoice = await createDepositInvoice(order, cents);
      if (invoice) {
        await updateOrderStatus(id, "accepted", {
          square_invoice_id: invoice.invoiceId,
          square_invoice_url: invoice.invoiceUrl,
          deposit_amount_cents: invoice.depositAmountCents,
        });
      }
      return NextResponse.json({ success: true, invoice });
    }

    case "complete": {
      await updateOrderStatus(id, "completed");
      return NextResponse.json({ success: true });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

function buildAcceptanceEmail(name: string, orderType: string, note?: string | null) {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="background:#5c7a5c;padding:36px 40px;text-align:center;">
  <p style="margin:0;color:#d4e8d4;font-size:10px;letter-spacing:5px;text-transform:uppercase;">LITTLE CHARLIE&rsquo;S BAKESHOP</p>
  <p style="margin:8px 0 0;color:#fff;font-size:24px;font-family:Georgia,serif;font-style:italic;">We&rsquo;d love to make this for you!</p>
</td></tr>
<tr><td style="background:#fff;padding:36px 40px;">
  <p style="font-size:16px;color:#3d2b1f;">Hi ${firstName},</p>
  <p style="font-size:14px;color:#3d2b1f;line-height:1.8;">
    Great news — we&rsquo;d love to take your <strong>${orderType}</strong> order!
    ${note ? `<br><br>${note}` : ""}
  </p>
  <p style="font-size:14px;color:#3d2b1f;line-height:1.8;">
    We&rsquo;ll be in touch soon to work out the details and arrange a deposit.
    Please note that your order is <strong>not confirmed</strong> until a deposit has been received.
  </p>
  <p style="font-size:14px;color:#3d2b1f;line-height:1.8;">
    Feel free to reply to this email or call us at <strong>234-244-4104</strong> with any questions!
  </p>
  <p style="font-size:14px;color:#3d2b1f;margin-top:24px;">
    With love,<br><em style="font-family:Georgia,serif;font-size:16px;">Little Charlie&rsquo;s Bakeshop</em>
  </p>
</td></tr>
<tr><td style="padding:18px 40px;text-align:center;">
  <p style="margin:0;font-size:10px;color:#aaa;letter-spacing:2px;text-transform:uppercase;">Cortland, OH &nbsp;&middot;&nbsp; 234-244-4104</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

function buildDeclineEmail(name: string, orderType: string, reason?: string | null) {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
<tr><td style="background:#5c7a5c;padding:36px 40px;text-align:center;">
  <p style="margin:0;color:#d4e8d4;font-size:10px;letter-spacing:5px;text-transform:uppercase;">LITTLE CHARLIE&rsquo;S BAKESHOP</p>
  <p style="margin:8px 0 0;color:#fff;font-size:24px;font-family:Georgia,serif;font-style:italic;">Thank you for reaching out</p>
</td></tr>
<tr><td style="background:#fff;padding:36px 40px;">
  <p style="font-size:16px;color:#3d2b1f;">Hi ${firstName},</p>
  <p style="font-size:14px;color:#3d2b1f;line-height:1.8;">
    Thank you so much for your interest in a <strong>${orderType}</strong> from Little Charlie&rsquo;s Bakeshop.
    Unfortunately, we&rsquo;re unable to take this order at this time.
    ${reason ? `<br><br>${reason}` : ""}
  </p>
  <p style="font-size:14px;color:#3d2b1f;line-height:1.8;">
    We hope to be able to help with a future order — please don&rsquo;t hesitate to reach out again!
  </p>
  <p style="font-size:14px;color:#3d2b1f;margin-top:24px;">
    With love,<br><em style="font-family:Georgia,serif;font-size:16px;">Little Charlie&rsquo;s Bakeshop</em>
  </p>
</td></tr>
<tr><td style="padding:18px 40px;text-align:center;">
  <p style="margin:0;font-size:10px;color:#aaa;letter-spacing:2px;text-transform:uppercase;">Cortland, OH &nbsp;&middot;&nbsp; 234-244-4104</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
