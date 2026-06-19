import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Wire up email sending (e.g. Resend, SendGrid, Nodemailer)
    // For now, log the inquiry server-side
    console.log("New inquiry from:", name, phone, email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
