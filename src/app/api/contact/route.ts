import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const eventDateStr = typeof eventDate === "string" && eventDate.trim()
      ? new Date(eventDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : null;

    await resend.emails.send({
      from: "Order Inquiry - Little Charlie's <onboarding@resend.dev>",
      to: process.env.NODE_ENV === "development" ? "jonz0917@yahoo.com" : "littlecharliesbakeshop@hotmail.com",
      replyTo: email as string,
      subject: `Order Inquiry — ${name} (${orderType})`,
      html: `
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
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px 28px;">

            <!-- Contact info -->
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

            <!-- Order details -->
            <p style="margin:0 0 16px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5c7a5c;padding-bottom:10px;border-bottom:1px solid #e8e0d5;">Order Details</p>
            <div style="background:#f2f7f2;border:1px solid #dce8dc;padding:18px 20px;">
              <p style="margin:0;font-size:14px;color:#3d2c1e;line-height:1.8;">${inquiry.replace(/\n/g, "<br>")}</p>
            </div>

          </td>
        </tr>

        <!-- Reply CTA -->
        <tr>
          <td style="background:#f9f6f2;padding:24px 40px;text-align:center;border-top:1px solid #e8e0d5;">
            <a href="mailto:${email}?subject=Re%3A Your Order Inquiry — Little Charlie%27s Bakeshop&body=Hi ${encodeURIComponent((name as string).split(' ')[0])}%2C%0D%0A%0D%0AThank you for your inquiry! I%27d love to help — %0D%0A%0D%0A%0D%0A%0D%0ALittle Charlie%27s Bakeshop%0D%0ACortland%2C Ohio %7C 234-244-4104" style="display:inline-block;background:#5c7a5c;color:#ffffff;font-size:11px;letter-spacing:3px;text-transform:uppercase;padding:14px 48px;text-decoration:none;font-weight:bold;">Email ${name} Back</a>
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
      `,
    });

    // TODO: Send customer confirmation email here once a verified domain is set up in Resend.
    // The onboarding@resend.dev test sender can only deliver to the Resend account email —
    // arbitrary customer addresses require a verified domain (e.g. littlecharliesbakeshop.com).
    // Email content is already designed: greeting, inquiry received message, "View Our Menu" CTA, sign-off.

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
