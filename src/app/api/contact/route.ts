import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createOrder } from "@/lib/db";
import { sendOrderAlertSMS } from "@/lib/sms";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, orderType, eventDate, inquiry } = body as Record<string, unknown>;

    if (
      typeof name !== "string" || !name.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof orderType !== "string" || !orderType.trim() ||
      typeof inquiry !== "string" || !inquiry.trim()
    ) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Enforce 3-day lead time server-side.
    // Compare YYYY-MM-DD strings directly to avoid timezone issues (both sides are UTC date strings).
    if (typeof eventDate === "string" && eventDate.trim()) {
      const minDate = new Date();
      minDate.setUTCDate(minDate.getUTCDate() + 3);
      const minDateStr = minDate.toISOString().split("T")[0];
      if (eventDate.trim() < minDateStr) {
        return NextResponse.json({ error: "Event date must be at least 3 days from today." }, { status: 400 });
      }
    }

    const eventDateVal = typeof eventDate === "string" && eventDate.trim() ? eventDate : null;

    const eventDateStr = eventDateVal
      ? new Date(eventDateVal).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : null;

    // 1. Save order to database
    const order = await createOrder({
      customer_name:  name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      order_type:     orderType.trim(),
      event_date:     eventDateVal,
      details:        (inquiry as string).trim(),
    });

    // 2. Send notification email to Alexis (skip gracefully if API key not configured)
    if (process.env.RESEND_API_KEY) {
      await getResend().emails.send({
        from: "Order Inquiry - Little Charlie's <onboarding@resend.dev>",
        to: process.env.VERCEL_ENV === "production" ? "littlecharliesbakeshop@hotmail.com" : "jonz0917@yahoo.com",
        replyTo: email as string,
        subject: `Order Inquiry — ${name} (${orderType})`,
        html: buildOrderEmail({ name: name as string, phone: phone as string, email: email as string, orderType: orderType as string, eventDateStr, inquiry: inquiry as string, orderId: order?.id }),
      }).catch((e: unknown) => console.error("[contact] Email failed:", e));
    } else {
      console.warn("[contact] RESEND_API_KEY not set — skipping email");
    }

    // 3. Send SMS alert to Alexis
    if (order) {
      await sendOrderAlertSMS(order).catch((e) =>
        console.error("[sms] Failed to send alert:", e)
      );
    }

    // TODO: Send customer confirmation email once verified domain is set up in Resend.

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] POST failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function buildOrderEmail(opts: {
  name: string;
  phone: string;
  email: string;
  orderType: string;
  eventDateStr: string | null;
  inquiry: string;
  orderId?: string;
}) {
  const { name, phone, email, orderType, eventDateStr, inquiry, orderId } = opts;
  const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlecharliesbakeshop.com"}/admin`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head>
<body style="margin:0;padding:0;background:#f0ebe3;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0ebe3;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#5c7a5c;padding:36px 40px;text-align:center;">
            <p style="margin:0;color:#d4e8d4;font-size:10px;letter-spacing:5px;text-transform:uppercase;">LITTLE CHARLIE&rsquo;S BAKESHOP</p>
            <p style="margin:8px 0 0;color:#ffffff;font-size:24px;font-family:Georgia,serif;font-style:italic;font-weight:normal;">New Order Inquiry</p>
            ${orderId ? `<p style="margin:6px 0 0;color:#d4e8d4;font-size:11px;">Order ID: ${orderId}</p>` : ""}
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px 28px;">

            <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5c7a5c;padding-bottom:10px;border-bottom:1px solid #e8e0d5;">Contact Information</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr style="background:#eef4ee;">
                <td style="padding:11px 12px;font-size:10px;color:#5c7a5c;text-transform:uppercase;letter-spacing:1px;width:110px;vertical-align:top;font-weight:bold;">Order Type</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;font-weight:bold;">${orderType}</td>
              </tr>
              <tr style="background:#f9f6f2;">
                <td style="padding:11px 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;width:110px;vertical-align:top;">Name</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;font-weight:bold;">${name}</td>
              </tr>
              <tr style="background:#ffffff;">
                <td style="padding:11px 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Phone</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;">${phone}</td>
              </tr>
              <tr style="background:#f9f6f2;">
                <td style="padding:11px 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Email</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;"><a href="mailto:${email}" style="color:#5c7a5c;text-decoration:none;">${email}</a></td>
              </tr>
              ${eventDateStr ? `
              <tr style="background:#ffffff;">
                <td style="padding:11px 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Event Date</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;font-weight:bold;">${eventDateStr}</td>
              </tr>` : ""}
            </table>

            <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5c7a5c;padding-bottom:10px;border-bottom:1px solid #e8e0d5;">Order Details</p>
            <div style="background:#f2f7f2;border:1px solid #dce8dc;padding:18px 20px;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#3d2c1e;line-height:1.8;">${inquiry.replace(/\n/g, "<br>")}</p>
            </div>

          </td>
        </tr>

        <!-- CTAs -->
        <tr>
          <td style="background:#f9f6f2;padding:24px 40px;text-align:center;border-top:1px solid #e8e0d5;">
            <a href="${adminUrl}" style="display:inline-block;background:#5c7a5c;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:14px 32px;text-decoration:none;font-weight:bold;margin-right:8px;">View in Admin</a>
            <a href="mailto:${email}?subject=Re%3A Your Order Inquiry — Little Charlie%27s Bakeshop&body=Hi ${encodeURIComponent(name.split(" ")[0])}%2C%0D%0A%0D%0AThank you for your inquiry! I%27d love to help — %0D%0A%0D%0A%0D%0A%0D%0ALittle Charlie%27s Bakeshop%0D%0ACortland%2C Ohio %7C 234-244-4104" style="display:inline-block;background:#3d2b1f;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:14px 32px;text-decoration:none;font-weight:bold;">Email ${name.split(" ")[0]} Back</a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:18px 40px;text-align:center;">
            <p style="margin:0;font-size:10px;color:#aaa;letter-spacing:2px;text-transform:uppercase;">Little Charlie&rsquo;s Bakeshop &nbsp;&middot;&nbsp; Cortland, OH &nbsp;&middot;&nbsp; 234-244-4104</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}
