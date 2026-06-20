import twilio from "twilio";
import type { Order } from "./db";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER; // e.g. +13302001234
const toNumber   = process.env.BAKERY_PHONE_NUMBER;  // Alexis's cell, e.g. +12342444104

function client() {
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
}

export async function sendOrderAlertSMS(order: Order) {
  const c = client();
  if (!c || !fromNumber || !toNumber) {
    console.warn("[sms] Twilio not configured — skipping SMS.");
    return;
  }

  const dateStr = order.event_date
    ? new Date(order.event_date + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "no date set";

  await c.messages.create({
    from: fromNumber,
    to: toNumber,
    body:
      `🎂 New Order Inquiry!\n` +
      `${order.order_type} — ${order.customer_name}\n` +
      `Pickup: ${dateStr}\n` +
      `Phone: ${order.customer_phone}\n` +
      `Review at: littlecharliesbakeshop.com/admin`,
  });
}
