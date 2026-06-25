import { getOrders, deleteOrder } from "@/lib/db";
import type { Order } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";
import AdminNav from "./AdminNav";
import AdminPageHeader from "./AdminPageHeader";

export const metadata = { title: "Admin — Orders" };
export const dynamic = "force-dynamic";

async function logout() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function todayET(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function tomorrowET(): string {
  const d = new Date(todayET() + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function isPast(eventDate: string | null): boolean {
  if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return false;
  return eventDate < todayET();
}

type DateGroup = {
  dateKey: string | null;
  label: string;
  sublabel: string;
  headerClasses: string;
  countClasses: string;
  orders: Order[];
};

function groupByPickupDate(orders: Order[], ascending: boolean): DateGroup[] {
  const today = todayET();
  const tomorrow = tomorrowET();

  const map = new Map<string, Order[]>();
  const noDate: Order[] = [];

  for (const order of orders) {
    if (!order.event_date || !/^\d{4}-\d{2}-\d{2}$/.test(order.event_date)) {
      noDate.push(order);
    } else {
      if (!map.has(order.event_date)) map.set(order.event_date, []);
      map.get(order.event_date)!.push(order);
    }
  }

  const sortedKeys = [...map.keys()].sort(ascending ? undefined : (a, b) => b.localeCompare(a));

  const groups: DateGroup[] = sortedKeys.map((key) => {
    const dateStr = new Date(key + "T12:00:00Z").toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    const diffDays = Math.round(
      (new Date(key + "T12:00:00Z").getTime() - new Date(today + "T12:00:00Z").getTime()) / 86400000
    );

    if (key === today) {
      return { dateKey: key, label: "Today", sublabel: dateStr, headerClasses: "bg-red-50 border-red-200 text-red-700", countClasses: "bg-red-100 text-red-600", orders: map.get(key)! };
    }
    if (key === tomorrow) {
      return { dateKey: key, label: "Tomorrow", sublabel: dateStr, headerClasses: "bg-amber-50 border-amber-200 text-amber-700", countClasses: "bg-amber-100 text-amber-600", orders: map.get(key)! };
    }
    if (diffDays > 0 && diffDays <= 7) {
      return { dateKey: key, label: dateStr, sublabel: `in ${diffDays} days`, headerClasses: "bg-parchment border-parchment text-brown", countClasses: "bg-warm-white text-brown/60", orders: map.get(key)! };
    }
    return { dateKey: key, label: dateStr, sublabel: diffDays < 0 ? `${Math.abs(diffDays)} days ago` : `in ${diffDays} days`, headerClasses: "bg-parchment border-parchment text-brown", countClasses: "bg-warm-white text-brown/60", orders: map.get(key)! };
  });

  if (noDate.length > 0) {
    groups.push({
      dateKey: null,
      label: "No Pickup Date",
      sublabel: "date not specified",
      headerClasses: "bg-warm-white border-parchment text-brown/40",
      countClasses: "bg-parchment text-brown/40",
      orders: noDate,
    });
  }

  return groups;
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; sort?: string }>;
}) {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const activeTab = params.tab === "past" ? "past" : "upcoming";
  const sortMode = params.sort === "newest" ? "newest" : "pickup";

  const allOrders = await getOrders();
  const upcoming = allOrders.filter((o) => !isPast(o.event_date));
  const past = allOrders.filter((o) => isPast(o.event_date));

  const tabBase = activeTab === "past" ? "/admin?tab=past" : "/admin";
  const sortToggleHref =
    sortMode === "newest"
      ? tabBase
      : activeTab === "past"
      ? "/admin?tab=past&sort=newest"
      : "/admin?sort=newest";

  // For grouped view: sort upcoming asc, past desc
  // For newest view: orders already come from DB sorted by created_at DESC
  const ordersForTab = activeTab === "past" ? past : upcoming;

  const groups =
    sortMode === "pickup"
      ? groupByPickupDate(ordersForTab, activeTab === "upcoming")
      : null;

  return (
    <div className="admin-shell min-h-screen bg-warm-white">
      {/* Header */}
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Order Inquiries</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://www.littlecharliesbakeshop.com" className="text-xs text-brown/60 hover:text-rose tracking-widest uppercase">
            ← Site
          </a>
          <form action={logout}>
            <button type="submit" className="text-xs text-brown/60 hover:text-rose tracking-widest uppercase cursor-pointer">
              Sign Out
            </button>
          </form>
        </div>
      </header>

      <AdminNav active="Orders" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <AdminPageHeader
          title="Order Inquiries"
          subtitle="Custom cake and order requests from your website."
        />

        {/* Tabs + Sort */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex gap-2">
            <Link
              href={sortMode === "newest" ? "/admin?sort=newest" : "/admin"}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors flex items-center gap-2 ${
                activeTab === "upcoming" ? "bg-rose text-cream" : "border border-parchment text-brown hover:border-rose hover:text-rose"
              }`}
            >
              Upcoming
              {upcoming.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "upcoming" ? "bg-white/20 text-cream" : "bg-parchment text-brown/60"}`}>
                  {upcoming.length}
                </span>
              )}
            </Link>
            <Link
              href={sortMode === "newest" ? "/admin?tab=past&sort=newest" : "/admin?tab=past"}
              className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors flex items-center gap-2 ${
                activeTab === "past" ? "bg-rose text-cream" : "border border-parchment text-brown hover:border-rose hover:text-rose"
              }`}
            >
              Past Inquiries
              {past.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "past" ? "bg-white/20 text-cream" : "bg-parchment text-brown/60"}`}>
                  {past.length}
                </span>
              )}
            </Link>
          </div>

          {/* Sort toggle */}
          <Link
            href={sortToggleHref}
            className="text-xs tracking-widest uppercase text-brown/50 hover:text-rose transition-colors flex items-center gap-1.5 border border-parchment px-3 py-2 hover:border-rose"
          >
            <span>{sortMode === "pickup" ? "↕ By Pickup Date" : "↕ Newest First"}</span>
            <span className="text-[10px] opacity-60">switch</span>
          </Link>
        </div>

        {ordersForTab.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-parchment bg-cream/40">
            <p className="text-lg font-light text-brown/50">
              No {activeTab === "past" ? "past inquiries" : "upcoming inquiries"} yet.
            </p>
            <p className="text-sm text-brown/35 mt-1">
              {activeTab === "past"
                ? "Completed and past-date requests will land here."
                : "New order requests from your website will appear here."}
            </p>
          </div>
        ) : sortMode === "newest" || !groups ? (
          /* Flat list — newest received first */
          <div className="space-y-4">
            {ordersForTab.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          /* Grouped by pickup date */
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.dateKey ?? "no-date"}>
                {/* Date section header */}
                <div className={`flex items-center justify-between px-4 py-2.5 border mb-3 ${group.headerClasses}`}>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-base font-medium">{group.label}</span>
                    {group.sublabel && group.sublabel !== group.label && (
                      <span className="text-xs opacity-60">{group.sublabel}</span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${group.countClasses}`}>
                    {group.orders.length} {group.orders.length === 1 ? "inquiry" : "inquiries"}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPickupUrgency(eventDate: string | null): { label: string; classes: string } | null {
  if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return null;
  const pickup = new Date(eventDate + "T12:00:00Z");
  const today  = new Date(todayET() + "T12:00:00Z");
  const diffDays = Math.round((pickup.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 0)  return null;
  if (diffDays === 0) return { label: "TODAY",              classes: "bg-red-100 text-red-700 border border-red-200" };
  if (diffDays === 1) return { label: "TOMORROW",           classes: "bg-amber-100 text-amber-700 border border-amber-200" };
  if (diffDays <= 3)  return { label: `IN ${diffDays} DAYS`, classes: "bg-amber-50 text-amber-600 border border-amber-200" };
  return { label: `IN ${diffDays} DAYS`, classes: "bg-parchment text-brown/60 border border-parchment" };
}

function OrderCard({ order }: { order: Order }) {
  const tz = "America/New_York";

  const pickupStr =
    order.event_date && /^\d{4}-\d{2}-\d{2}$/.test(order.event_date)
      ? new Date(order.event_date + "T12:00:00Z").toLocaleDateString("en-US", {
          weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: tz,
        })
      : null;

  const urgency = getPickupUrgency(order.event_date);

  const createdStr = new Date(order.created_at).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: tz,
  });

  return (
    <div className="bg-cream border border-parchment p-6">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <span className="font-serif text-lg text-mocha">{order.customer_name}</span>
          <p className="text-sm text-brown/70 font-medium mt-0.5">{order.order_type}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-brown/40 flex items-center gap-1.5">
              <span>📅</span>
              <span>
                Pickup:{" "}
                <span className={pickupStr ? "text-brown/60" : "italic text-brown/30"}>
                  {pickupStr ?? "not specified"}
                </span>
              </span>
            </p>
            {urgency && (
              <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 ${urgency.classes}`}>
                {urgency.label}
              </span>
            )}
          </div>
          <p className="text-xs text-brown/30 mt-0.5">Received {createdStr}</p>
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
