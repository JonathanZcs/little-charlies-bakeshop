import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, inquiry } = body as Record<string, unknown>;

    if (
      typeof name !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string" ||
      typeof inquiry !== "string" ||
      !name.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !inquiry.trim()
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Little Charlie's Bakeshop <onboarding@resend.dev>",
      to: "jonz0917@yahoo.com",
      subject: `New Order Inquiry from ${name}`,
      html: `
        <h2>New Order Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Inquiry:</strong></p>
        <p>${inquiry.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
