import type { Metadata } from "next";
import ShopGrid from "./ShopGrid";
import { getShopItems } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Order online from Little Charlie's Bakeshop — brownies, cinnamon rolls, poptarts, macarons, sourdough loaves, cookies, and more. Pickup in Cortland, Ohio.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const items = await getShopItems();

  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Fresh &amp; Handcrafted
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">Our Shop</p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-md mx-auto font-light text-lg leading-relaxed">
          Browse our current offerings and place your order directly.
        </p>
      </section>

      {/* Shop Grid */}
      <section className="py-16 px-6 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <ShopGrid items={items} />
        </div>
      </section>

      {/* Custom order CTA */}
      <section className="py-14 px-6 bg-linear-to-r from-blush/40 to-parchment/50 text-center">
        <h2 className="font-serif text-3xl text-mocha mb-3">
          Don&apos;t See What You Need?
        </h2>
        <p className="text-brown mb-7 font-light max-w-md mx-auto">
          We love custom orders. Reach out and tell us what you have in mind.
        </p>
        <a
          href="/contact"
          className="bg-mocha text-cream px-10 py-4 text-sm tracking-widest uppercase hover:bg-brown transition-colors"
        >
          Send an Inquiry
        </a>
      </section>
    </>
  );
}
