import { getOrders, deleteOrder } from "@/lib/db";
import type { Order } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";

export const metadata = { title: "Admin — Orders" };
export const dynamic = "force-dynamic";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const orders = await getOrders();

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Order Inquiries</span>
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
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs tracking-widest uppercase text-brown/40">
            {orders.length} {orders.length === 1 ? "inquiry" : "inquiries"} total
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 text-brown/40">
            <p className="text-lg font-light">No order inquiries yet.</p>
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
  const tz = "America/New_York";

  const pickupStr = order.event_date && /^\d{4}-\d{2}-\d{2}$/.test(order.event_date)
    ? new Date(order.event_date + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: tz })
    : null;

  const createdStr = new Date(order.created_at).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: tz,
  });

  return (
    <div className="bg-cream border border-parchment p-6">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-serif text-lg text-mocha">{order.customer_name}</span>
          </div>
          <p className="text-sm text-brown/70 font-medium">{order.order_type}</p>
          {pickupStr && <p className="text-xs text-rose mt-0.5">📅 Pickup: {pickupStr}</p>}
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

      {/* Inspiration photos */}
      {order.image_urls && order.image_urls.length > 0 && (
        <div className="mb-4">
          <p className="text-xs tracking-widest uppercase text-brown/40 mb-2">Inspiration Photos</p>
          <div className="flex flex-wrap gap-2">
            {order.image_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Inspiration ${i + 1}`} className="w-24 h-24 object-cover border border-parchment hover:border-rose transition-colors" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Delete */}
      <div className="flex justify-end pt-3 border-t border-parchment">
        <DeleteForm orderId={order.id} />
      </div>
    </div>
  );
}

function DeleteForm({ orderId }: { orderId: string }) {
  async function remove() {
    "use server";
    await deleteOrder(orderId);
    redirect("/admin");
  }

  return (
    <form action={remove}>
      <button
        type="submit"
        className="text-xs text-brown/30 hover:text-red-400 transition-colors cursor-pointer tracking-widest uppercase"
      >
        Delete
      </button>
    </form>
  );
}
