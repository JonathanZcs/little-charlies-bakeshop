import { getOrders } from "@/lib/db";
import type { Order, OrderStatus } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";

function selfBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export const metadata = { title: "Admin — Orders" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending:      "Pending",
  accepted:     "Accepted",
  declined:     "Declined",
  deposit_paid: "Deposit Paid",
  completed:    "Completed",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:      "bg-amber-100 text-amber-800",
  accepted:     "bg-blue-100 text-blue-800",
  declined:     "bg-red-100 text-red-800",
  deposit_paid: "bg-green-100 text-green-800",
  completed:    "bg-gray-100 text-gray-600",
};

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const activeTab = (params.tab as OrderStatus | "all") ?? "pending";

  const [orders, allOrders] = await Promise.all([
    activeTab === "all" ? getOrders() : getOrders(activeTab as OrderStatus),
    getOrders(),
  ]);

  const countByStatus = allOrders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const tabs: Array<{ key: string; label: string }> = [
    { key: "pending",      label: "Pending" },
    { key: "accepted",     label: "Accepted" },
    { key: "deposit_paid", label: "Deposit Paid" },
    { key: "declined",     label: "Declined" },
    { key: "completed",    label: "Completed" },
    { key: "all",          label: "All Orders" },
  ];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Order Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-brown/60 hover:text-rose tracking-widest uppercase">
            ← Site
          </Link>
          <form action={logout}>
            <button type="submit" className="text-xs text-brown/60 hover:text-rose tracking-widest uppercase cursor-pointer">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => {
            const count = tab.key === "all" ? allOrders.length : (countByStatus[tab.key] ?? 0);
            return (
              <Link
                key={tab.key}
                href={`/admin?tab=${tab.key}`}
                className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors flex items-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-rose text-cream"
                    : "border border-parchment text-brown hover:border-rose hover:text-rose"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key ? "bg-white/20 text-cream" : "bg-parchment text-brown/60"
                  }`}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="text-center py-20 text-brown/40">
            <p className="text-lg font-light">No {activeTab === "all" ? "" : activeTab} orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const dateStr = order.event_date
    ? new Date(order.event_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : null;

  const createdStr = new Date(order.created_at).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });

  return (
    <div className="bg-cream border border-parchment p-6">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-serif text-lg text-mocha">{order.customer_name}</span>
            <span className={`text-xs px-2 py-0.5 font-medium ${STATUS_COLORS[order.status as OrderStatus]}`}>
              {STATUS_LABELS[order.status as OrderStatus]}
            </span>
          </div>
          <p className="text-sm text-brown/70 font-medium">{order.order_type}</p>
          {dateStr && <p className="text-xs text-rose mt-0.5">📅 {dateStr}</p>}
          <p className="text-xs text-brown/40 mt-1">Received {createdStr}</p>
        </div>
        <div className="sm:text-right text-sm space-y-0.5 shrink-0">
          <a href={`tel:${order.customer_phone.replace(/\D/g, "")}`} className="text-brown hover:text-rose transition-colors block">
            {order.customer_phone}
          </a>
          <a href={`mailto:${order.customer_email}`} className="text-rose hover:underline block break-all">
            {order.customer_email}
          </a>
        </div>
      </div>

      {/* Details */}
      <div className="bg-warm-white border border-parchment/60 px-4 py-3 mb-4 text-sm text-brown/80 leading-relaxed whitespace-pre-wrap">
        {order.details}
      </div>

      {/* Square invoice link */}
      {order.square_invoice_url && (
        <div className="mb-4 text-xs text-brown/60">
          <span className="font-medium">Invoice sent:</span>{" "}
          <a href={order.square_invoice_url} target="_blank" rel="noopener noreferrer" className="text-rose hover:underline">
            {order.square_invoice_url}
          </a>
          {order.deposit_amount_cents && (
            <span className="ml-2">· Deposit: ${(order.deposit_amount_cents / 100).toFixed(2)}</span>
          )}
        </div>
      )}

      {/* Actions */}
      {order.status === "pending" && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-parchment">
          <AcceptForm orderId={order.id} />
          <DeclineForm orderId={order.id} />
        </div>
      )}

      {order.status === "accepted" && !order.square_invoice_url && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-parchment">
          <SendInvoiceForm orderId={order.id} />
          <DeclineForm orderId={order.id} label="Cancel" />
        </div>
      )}

      {order.status === "deposit_paid" && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-parchment">
          <MarkCompletedForm orderId={order.id} />
        </div>
      )}

      {order.admin_note && (
        <p className="mt-3 text-xs text-brown/50 italic">Note: {order.admin_note}</p>
      )}
    </div>
  );
}

function AcceptForm({ orderId }: { orderId: string }) {
  async function accept(formData: FormData) {
    "use server";
    const note = formData.get("note") as string | null;
    const res = await fetch(
      `${selfBaseUrl()}/api/admin/orders/${orderId}`,
      { method: "PATCH", body: JSON.stringify({ action: "accept", note }), headers: { "Content-Type": "application/json", "x-admin-key": process.env.ADMIN_PASSWORD ?? "" } }
    );
    if (!res.ok) console.error("Accept failed", await res.text());
    redirect("/admin?tab=accepted");
  }

  return (
    <form action={accept} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
      <input
        name="note"
        placeholder="Optional note to customer..."
        className="border border-parchment bg-warm-white px-3 py-2 text-xs text-mocha focus:outline-none focus:border-rose w-full sm:w-64"
      />
      <button
        type="submit"
        className="bg-rose text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors cursor-pointer whitespace-nowrap"
      >
        ✓ Accept
      </button>
    </form>
  );
}

function DeclineForm({ orderId, label = "✕ Decline" }: { orderId: string; label?: string }) {
  async function decline(formData: FormData) {
    "use server";
    const note = formData.get("note") as string | null;
    const res = await fetch(
      `${selfBaseUrl()}/api/admin/orders/${orderId}`,
      { method: "PATCH", body: JSON.stringify({ action: "decline", note }), headers: { "Content-Type": "application/json", "x-admin-key": process.env.ADMIN_PASSWORD ?? "" } }
    );
    if (!res.ok) console.error("Decline failed", await res.text());
    redirect("/admin?tab=declined");
  }

  return (
    <form action={decline} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:items-center">
      <input
        name="note"
        placeholder="Reason (optional)..."
        className="border border-parchment bg-warm-white px-3 py-2 text-xs text-mocha focus:outline-none focus:border-rose w-full sm:w-48"
      />
      <button
        type="submit"
        className="border border-brown/30 text-brown/60 px-5 py-2 text-xs tracking-widest uppercase hover:border-red-400 hover:text-red-500 transition-colors cursor-pointer whitespace-nowrap"
      >
        {label}
      </button>
    </form>
  );
}

function SendInvoiceForm({ orderId }: { orderId: string }) {
  async function sendInvoice(formData: FormData) {
    "use server";
    const depositDollars = parseFloat((formData.get("deposit") as string) ?? "50");
    const depositCents = Math.round(depositDollars * 100);
    const res = await fetch(
      `${selfBaseUrl()}/api/admin/orders/${orderId}`,
      { method: "PATCH", body: JSON.stringify({ action: "send_invoice", depositCents }), headers: { "Content-Type": "application/json", "x-admin-key": process.env.ADMIN_PASSWORD ?? "" } }
    );
    if (!res.ok) console.error("Invoice failed", await res.text());
    redirect("/admin?tab=accepted");
  }

  return (
    <form action={sendInvoice} className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <div className="flex items-center border border-parchment bg-warm-white self-start">
        <span className="px-3 py-2 text-xs text-brown/60">$</span>
        <input
          name="deposit"
          type="number"
          defaultValue="50"
          min="1"
          step="0.01"
          className="w-20 py-2 pr-3 text-xs text-mocha focus:outline-none bg-transparent"
        />
      </div>
      <button
        type="submit"
        className="bg-mocha text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-brown transition-colors cursor-pointer"
      >
        Send Deposit Invoice
      </button>
    </form>
  );
}

function MarkCompletedForm({ orderId }: { orderId: string }) {
  async function complete() {
    "use server";
    const res = await fetch(
      `${selfBaseUrl()}/api/admin/orders/${orderId}`,
      { method: "PATCH", body: JSON.stringify({ action: "complete" }), headers: { "Content-Type": "application/json", "x-admin-key": process.env.ADMIN_PASSWORD ?? "" } }
    );
    if (!res.ok) console.error("Complete failed", await res.text());
    redirect("/admin?tab=completed");
  }

  return (
    <form action={complete}>
      <button
        type="submit"
        className="bg-mocha text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-brown transition-colors cursor-pointer"
      >
        ✓ Mark Completed
      </button>
    </form>
  );
}
