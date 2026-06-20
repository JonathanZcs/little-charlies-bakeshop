import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { put } from "@vercel/blob";
import { createOrder } from "@/lib/db";
import { sendOrderAlertSMS } from "@/lib/sms";

const getResend = () => new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name      = formData.get("name") as string | null;
    const phone     = formData.get("phone") as string | null;
    const email     = formData.get("email") as string | null;
    const orderType = formData.get("orderType") as string | null;
    const eventDate = formData.get("eventDate") as string | null;
    const inquiry   = formData.get("inquiry") as string | null;
    const photos    = formData.getAll("photos") as File[];

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !orderType?.trim() || !inquiry?.trim()) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    // Enforce 3-day lead time server-side.
    if (eventDate?.trim()) {
      const minDate = new Date();
      minDate.setUTCDate(minDate.getUTCDate() + 3);
      const minDateStr = minDate.toISOString().split("T")[0];
      if (eventDate.trim() < minDateStr) {
        return NextResponse.json({ error: "Event date must be at least 3 days from today." }, { status: 400 });
      }
    }

    const eventDateVal = eventDate?.trim() || null;
    const eventDateStr = eventDateVal
      ? new Date(eventDateVal).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : null;

    // Upload inspiration photos to Vercel Blob (skip gracefully if token not set)
    const imageUrls: string[] = [];
    if (photos.length > 0 && (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)) {
      await Promise.all(
        photos
          .filter((f) => f.size > 0)
          .slice(0, 5)
          .map(async (file) => {
            const blob = await put(`orders/${Date.now()}-${file.name}`, file, { access: "public" });
            imageUrls.push(blob.url);
          })
      ).catch((e) => console.error("[contact] Photo upload failed:", e));
    }

    // 1. Save order to database
    const order = await createOrder({
      customer_name:  name.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      order_type:     orderType.trim(),
      event_date:     eventDateVal,
      details:        inquiry.trim(),
      image_urls:     imageUrls,
    });

    // 2. Send notification email to Alexis (skip gracefully if API key not configured)
    if (process.env.RESEND_API_KEY) {
      await getResend().emails.send({
        from: "Order Inquiry - Little Charlie's <onboarding@resend.dev>",
        to: process.env.VERCEL_ENV === "production" ? "littlecharliesbakeshop@hotmail.com" : "jonz0917@yahoo.com",
        replyTo: email as string,
        subject: `Order Inquiry — ${name} (${orderType})`,
        html: buildOrderEmail({ name, phone, email, orderType, eventDateStr, inquiry, imageUrls, orderId: order?.id }),
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
  imageUrls?: string[];
  orderId?: string;
}) {
  const { name, phone, email, orderType, eventDateStr, inquiry, imageUrls, orderId } = opts;
  const firstName = name.split(" ")[0];
  const adminUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}/admin`
    : `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://littlecharliesbakeshop.com"}/admin`;
  const replySubject = encodeURIComponent(`Re: Your Order Inquiry — Little Charlie's Bakeshop`);
  const replyBody = encodeURIComponent(`Hi ${firstName},\n\nThank you for reaching out to Little Charlie's Bakeshop!\n\n\n\n\n\n--\nAlexis\nLittle Charlie's Bakeshop | Cortland, Ohio | 234-244-4104`);
  const mailtoHref = `mailto:${email}?subject=${replySubject}&amp;body=${replyBody}`;

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
                <td style="padding:11px 12px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px;vertical-align:top;">Pickup Date</td>
                <td style="padding:11px 12px;font-size:15px;color:#2d2017;font-weight:bold;">${eventDateStr}</td>
              </tr>` : ""}
            </table>

            <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5c7a5c;padding-bottom:10px;border-bottom:1px solid #e8e0d5;">Order Details</p>
            <div style="background:#f2f7f2;border:1px solid #dce8dc;padding:18px 20px;margin-bottom:28px;">
              <p style="margin:0;font-size:14px;color:#3d2c1e;line-height:1.8;">${inquiry.replace(/\n/g, "<br>")}</p>
            </div>

            ${imageUrls && imageUrls.length > 0 ? `
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5c7a5c;padding-bottom:10px;border-bottom:1px solid #e8e0d5;">Inspiration Photos</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                ${imageUrls.map(url => `
                <td style="padding:4px;width:${Math.floor(100/imageUrls.length)}%;">
                  <a href="${url}" target="_blank" style="display:block;">
                    <img src="${url}" alt="Inspiration photo" style="width:100%;max-width:160px;height:120px;object-fit:cover;display:block;border:1px solid #e8e0d5;" />
                  </a>
                </td>`).join("")}
              </tr>
            </table>` : ""}

          </td>
        </tr>

        <!-- CTAs -->
        <tr>
          <td style="background:#f9f6f2;padding:24px 40px;text-align:center;border-top:1px solid #e8e0d5;">
            <a href="${adminUrl}" style="display:inline-block;background:#5c7a5c;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:14px 32px;text-decoration:none;font-weight:bold;margin-right:8px;">View in Admin</a>
            <a href="${mailtoHref}" style="display:inline-block;background:#3d2b1f;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:14px 32px;text-decoration:none;font-weight:bold;">Email ${firstName} Back</a>
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
