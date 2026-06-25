import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSession, ADMIN_COOKIE } from "@/lib/admin-session";
import { isSquareConfigured, getLocationSummary, getSalesSummary } from "@/lib/square";
import AdminNav from "../AdminNav";

export const metadata = { title: "Admin — Finances" };
export const dynamic = "force-dynamic";

function centsToDisplay(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function AdminFinancesPage() {
  const cookieStore = await cookies();
  if (!isValidSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  const configured = isSquareConfigured();
  let locationName: string | null = null;
  let totalCents = 0;
  let orderCount = 0;

  if (configured) {
    const locationId = process.env.SQUARE_LOCATION_ID!;
    const [location, orders] = await Promise.all([
      getLocationSummary(),
      getSalesSummary(locationId),
    ]);

    locationName = (location?.name as string) ?? null;

    if (orders) {
      orderCount = orders.length;
      for (const order of orders) {
        const totalMoney = order.total_money as { amount?: number } | undefined;
        if (totalMoney?.amount) {
          totalCents += totalMoney.amount;
        }
      }
    }
  }

  const avgCents = orderCount > 0 ? Math.round(totalCents / orderCount) : 0;

  return (
    <div className="min-h-screen bg-warm-white">
      <header className="bg-cream border-b border-parchment px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <span className="font-script text-2xl text-rose">little charlie&apos;s</span>
          <span className="text-xs tracking-[0.25em] uppercase text-brown ml-3">Financial Overview</span>
        </div>
      </header>

      <AdminNav active="Finances" />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-mocha">Financial Overview</h1>
          {locationName && (
            <p className="text-brown/50 text-sm mt-1">{locationName}</p>
          )}
        </div>

        {!configured ? (
          /* Setup card */
          <div className="bg-cream border border-parchment p-8 max-w-2xl relative">
            <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-parchment" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-parchment" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-parchment" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-parchment" />

            <p className="font-serif text-xl text-mocha mb-2">Connect Square</p>
            <p className="text-sm text-brown/60 font-light mb-6">
              Add these environment variables in your Vercel project settings to enable financial reporting.
            </p>

            <div className="space-y-4">
              <div className="bg-warm-white border border-parchment p-4">
                <p className="text-[10px] uppercase tracking-widest text-brown/40 mb-1">Variable name</p>
                <code className="font-mono text-sm text-mocha">SQUARE_ACCESS_TOKEN</code>
                <p className="text-xs text-brown/50 mt-1.5">
                  From{" "}
                  <span className="font-mono text-xs bg-parchment/30 px-1">developer.squareup.com</span>
                  {" → "}your app{" → "}Production{" → "}Access Token
                </p>
              </div>
              <div className="bg-warm-white border border-parchment p-4">
                <p className="text-[10px] uppercase tracking-widest text-brown/40 mb-1">Variable name</p>
                <code className="font-mono text-sm text-mocha">SQUARE_LOCATION_ID</code>
                <p className="text-xs text-brown/50 mt-1.5">
                  From Square Dashboard{" → "}Account &amp; Settings{" → "}Business information
                </p>
              </div>
            </div>

            <p className="text-xs text-brown/40 italic mt-6">
              After adding these variables, redeploy on Vercel and this page will show your sales data.
            </p>
          </div>
        ) : (
          /* Stats */
          <div className="space-y-6">
            <p className="text-xs text-brown/40 tracking-widest uppercase">
              Current month · Data refreshes every 5 minutes
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Sales This Month" value={centsToDisplay(totalCents)} />
              <StatCard label="Transactions" value={String(orderCount)} />
              <StatCard label="Avg Order Value" value={centsToDisplay(avgCents)} />
            </div>

            <div className="bg-cream border border-parchment p-5 text-sm text-brown/50 font-light">
              Sales figures include completed Square orders for the current calendar month.
              Square invoices and in-person payments are included once marked completed.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream border border-parchment p-6 relative">
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-parchment" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-parchment" />
      <p className="text-[10px] uppercase tracking-widest text-brown/40 mb-3">{label}</p>
      <p className="font-serif text-3xl text-mocha">{value}</p>
    </div>
  );
}
