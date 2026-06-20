# Smoke Test Checklist — Little Charlie's Bakeshop Order System

Run this checklist against a **Vercel Preview deployment** before merging to main.
All external services should be in **sandbox/trial mode** during testing.

---

## Prerequisites

- [ ] Vercel Preview deployment is live (push `develop` branch to remote)
- [ ] All env vars set in Vercel (Preview environment) — see `pending-from-jonathan.md`
- [ ] Square sandbox mode: `SQUARE_ACCESS_TOKEN` uses the **Sandbox** token (from Square Developer → Sandbox tab)
- [ ] Twilio trial account active; Alexis's test number is a verified Twilio number
- [ ] Neon DB schema is created (`src/lib/schema.sql` run in Neon SQL Editor)

---

## 1. Contact Form → Order Created

**Steps:**
1. Go to `/contact` on the Preview URL
2. Fill out the form with a test order (pick a date at least 3 days from today)
3. Submit

**Expected:**
- [ ] Success message appears on the page
- [ ] Alexis's email (`littlecharliesbakeshop@hotmail.com`) receives the notification email
- [ ] Email contains Order ID, customer info, and "View in Admin" button
- [ ] SMS arrives on Alexis's phone: "🎂 New Order Inquiry!"
- [ ] Order appears in Neon DB (check via Neon SQL Editor: `SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;`)

**Lead-time enforcement:**
- [ ] Try submitting with today's date → should get an error
- [ ] Try submitting with a date 2 days out → should get an error
- [ ] Try submitting with a date exactly 3 days out → should succeed

---

## 2. Admin Login

**Steps:**
1. Go to `/admin` on the Preview URL
2. You should be redirected to `/admin/login`
3. Enter the wrong password → should show an error
4. Enter the correct `ADMIN_PASSWORD` → should redirect to `/admin`
5. Refresh `/admin` → should stay logged in (cookie lasts 30 days)

**Expected:**
- [ ] Unauthenticated access to `/admin` redirects to login
- [ ] Wrong password shows error, stays on login page
- [ ] Correct password grants access
- [ ] Session persists across page refresh

---

## 3. Admin Dashboard — Order Visible

**Steps:**
1. Log in to `/admin`
2. Verify the test order from step 1 appears under the **Pending** tab
3. Check that customer name, order type, email, phone, and event date are all displayed correctly

**Expected:**
- [ ] Order appears in Pending tab
- [ ] All customer fields display correctly
- [ ] Status badge shows "Pending"

---

## 4. Accept an Order

**Steps:**
1. In the admin dashboard, find the pending test order
2. (Optional) Add an admin note in the note field
3. Click **Accept**

**Expected:**
- [ ] Order moves to **Accepted** tab (refresh page)
- [ ] Customer receives an acceptance email ("We'd Love to Help! 🎂")
- [ ] Acceptance email shows the admin note if one was added
- [ ] Alexis's phone receives SMS: "✅ Order accepted —"
- [ ] DB row updated: `status = 'accepted'`, `accepted_at` is set

---

## 5. Send Square Deposit Invoice

**Steps:**
1. In the admin dashboard, find the accepted order
2. Set deposit amount (default $50 — leave as is for testing)
3. Click **Send Deposit Invoice**

**Expected:**
- [ ] Customer receives a Square-generated invoice email (from Square, not Resend)
- [ ] Invoice shows "Little Charlie's Bakeshop" title and correct deposit amount
- [ ] Admin dashboard shows the Square invoice link on the order card
- [ ] DB row updated: `square_invoice_id` and `square_invoice_url` are populated

> **Square Sandbox tip:** Use Square's test card `4111 1111 1111 1111`, CVV `111`, expiry any future date.

---

## 6. Pay the Invoice (Square Sandbox)

**Steps:**
1. Open the Square invoice from the customer email (or copy the invoice URL from the admin dashboard)
2. Pay using the Square sandbox test card
3. Wait ~30 seconds for the webhook to fire

**Expected:**
- [ ] Square processes the payment successfully
- [ ] Webhook fires at `/api/webhooks/square`
- [ ] Order moves to **Deposit Paid** tab in admin dashboard
- [ ] Alexis's phone receives SMS: "💰 $50.00 deposit received!"
- [ ] DB row updated: `status = 'deposit_paid'`, `deposit_paid_at` is set

> **Webhook troubleshooting:** Check Vercel function logs (Dashboard → Deployments → Functions → `/api/webhooks/square`). Square also shows webhook delivery attempts in Developer Dashboard → Webhooks → Recent Deliveries.

---

## 7. Mark Order Completed

**Steps:**
1. In the admin dashboard, find the deposit-paid order
2. Click **Mark Completed**

**Expected:**
- [ ] Order moves to **Completed** tab
- [ ] DB row updated: `status = 'completed'`

---

## 8. Decline an Order

**Steps:**
1. Submit a second test order via `/contact`
2. In admin, click **Decline** (optionally add a reason)

**Expected:**
- [ ] Customer receives a decline email ("Thank you for reaching out")
- [ ] Decline email shows the reason if one was added
- [ ] Alexis's phone receives SMS: "❌ Order declined —"
- [ ] Order moves to **Declined** tab
- [ ] DB row updated: `status = 'declined'`, `declined_at` is set

---

## 9. Webhook Signature Security

This is verified automatically by the unit tests (`npm test`), but confirm manually:

- [ ] `npm test` passes all 33 tests, including `webhook-signature.test.ts`
- [ ] Sending a POST to `/api/webhooks/square` with a bad signature returns 401

```bash
curl -X POST https://[your-preview-url]/api/webhooks/square \
  -H "Content-Type: application/json" \
  -H "x-square-hmacsha256-signature: invalidsig" \
  -d '{"type":"invoice.payment_made"}' \
  -w "\nHTTP %{http_code}\n"
# Expected: HTTP 401
```

---

## 10. Graceful Degradation

Confirm that the site doesn't break if services are unconfigured:

- [ ] Remove `DATABASE_URL` from a test env → contact form still submits (email sends, DB step silently skipped)
- [ ] Remove Twilio vars → orders still work (SMS step silently skipped, no crash)
- [ ] Remove Square vars → accept/invoice flow still works up to invoice step (Square step returns null gracefully)

---

## After All Tests Pass

1. Merge `develop` → `main` (tell Jonathan/Claude to do this)
2. Add all env vars to **Production** environment in Vercel (not just Preview)
3. Switch Square `SQUARE_ACCESS_TOKEN` to the **Production** token
4. Register the production webhook URL in Square Developer dashboard:
   `https://[production-domain]/api/webhooks/square`
5. Share `/admin` URL and password with Alexis
6. Do one final live end-to-end test with a real $1 order to confirm production flow
