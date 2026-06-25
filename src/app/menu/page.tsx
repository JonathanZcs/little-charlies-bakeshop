import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RotatingPhoto from "./RotatingPhoto";
import { getMenuCards, getMenuItems } from "@/lib/db";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Little Charlie's Bakeshop full menu — drinks, breakfast, custom cakes, macarons, sourdough, cookies, cheesecakes, and pies. Made fresh in Cortland, Ohio.",
};

export const dynamic = "force-dynamic";

type UiItem = { name: string; desc?: string; price?: string };
type UiCard = { name: string; images: string[]; items: UiItem[]; note?: string; imgClass?: string };

function SectionDivider({ label, sub, id }: { label: string; sub: string; id: string }) {
  return (
    <div id={id} className="text-center pt-16 pb-10 px-6 scroll-mt-16">
      <p className="text-rose/60 text-xs tracking-[0.4em] uppercase mb-1">{sub}</p>
      <p className="font-script text-4xl md:text-5xl text-rose mb-4">{label}</p>
      <div className="flex items-center justify-center gap-4">
        <div className="h-px w-16 bg-parchment" />
        <span className="text-parchment text-xs">&#10022;</span>
        <div className="h-px w-16 bg-parchment" />
      </div>
    </div>
  );
}

function MenuCardGrid({ cards }: { cards: UiCard[] }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-cream border border-parchment overflow-hidden group"
        >
          <div className="relative h-56 overflow-hidden">
            {card.images.length > 1 ? (
              <RotatingPhoto
                images={card.images}
                alt={card.name}
                sizes="(max-width: 640px) 100vw, 50vw"
                imgClass={card.imgClass}
              />
            ) : card.images.length === 1 ? (
              <Image
                src={card.images[0]}
                alt={card.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className={`object-cover group-hover:scale-105 transition-transform duration-500 ${card.imgClass ?? "object-center"}`}
              />
            ) : (
              <div className="w-full h-full bg-blush" />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-mocha/75 via-mocha/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
              <p className="font-script text-2xl text-cream drop-shadow">{card.name}</p>
            </div>
          </div>

          <div className="px-6 pt-5 pb-6">
            <ul className="space-y-0">
              {card.items.map((item) => (
                <li key={item.name} className="border-b border-parchment/50 py-2.5">
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-sm text-brown">{item.name}</span>
                    {item.price && (
                      <span className="text-sm text-rose font-semibold shrink-0">{item.price}</span>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-xs text-brown/50 italic mt-0.5">{item.desc}</p>
                  )}
                </li>
              ))}
            </ul>
            {card.note && (
              <p className="text-xs text-brown/40 italic mt-4">{card.note}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function MenuPage() {
  const [dbCards, dbItems] = await Promise.all([getMenuCards(), getMenuItems()]);

  function cardsForSection(section: string): UiCard[] {
    return dbCards
      .filter((c) => c.section === section)
      .map((c) => ({
        name: c.card_name,
        images: c.images ?? [],
        note: c.note ?? undefined,
        imgClass: c.img_class ?? undefined,
        items: dbItems
          .filter((i) => i.card_id === c.id)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((i) => ({
            name: i.item_name,
            desc: i.description ?? undefined,
            price: i.price ?? undefined,
          })),
      }));
  }

  const bakeryCards = cardsForSection("bakery");
  const breakfastCards = cardsForSection("breakfast");
  const drinksCards = cardsForSection("drinks");

  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Little Charlie&rsquo;s Bakeshop
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">Our Menu</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-md mx-auto font-light text-base leading-relaxed mb-10">
          Baked goods, breakfast, and drinks &mdash; all made from scratch in Cortland, Ohio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { label: "Drinks", id: "drinks" },
            { label: "Breakfast", id: "breakfast" },
            { label: "Bakery", id: "bakery" },
            { label: "Custom Orders", id: "custom-orders" },
          ].map((n) => (
            <a
              key={n.label}
              href={`#${n.id}`}
              className="text-xs tracking-widest uppercase text-rose border border-rose/50 px-5 py-2.5 hover:bg-blush hover:border-rose transition-colors"
            >
              {n.label}
            </a>
          ))}
        </div>
      </section>

      {/* Bakery */}
      <section className="bg-warm-white">
        <SectionDivider label="Bakery" sub="Custom Orders · Made to Order" id="bakery" />
        <MenuCardGrid cards={bakeryCards} />
        <p className="text-center pb-12 text-xs text-brown/40 italic px-6">
          &#42; Prices and availability subject to change. Call to confirm &mdash; 234-244-4104.
        </p>
      </section>

      {/* Breakfast */}
      <section className="bg-cream">
        <SectionDivider label="Breakfast" sub="Served Tue – Sat · Made Fresh Daily" id="breakfast" />
        <MenuCardGrid cards={breakfastCards} />
        <div className="pb-12" />
      </section>

      {/* Drinks */}
      <section className="bg-warm-white">
        <SectionDivider label="Drinks" sub="Iced & Hot · Matcha · Seasonal Specials" id="drinks" />
        <MenuCardGrid cards={drinksCards} />
        <div className="pb-12" />
      </section>

      {/* Custom Orders CTA */}
      <section id="custom-orders" className="py-16 px-6 bg-blush text-center scroll-mt-16">
        <div className="max-w-2xl mx-auto border border-parchment p-10 md:p-14 relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-parchment" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-parchment" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-parchment" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-parchment" />
          <p className="text-rose/70 text-xs tracking-[0.35em] uppercase mb-2">Custom Orders</p>
          <p className="font-script text-4xl text-rose mb-4">Made Just for You</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-parchment" />
            <span className="text-parchment text-xs">&#10022;</span>
            <div className="h-px w-10 bg-parchment" />
          </div>
          <p className="text-brown leading-relaxed mb-2 text-base font-light">
            Looking for a custom cake, decorated cookies, or a special dessert for your event?
            We&apos;d love to make something unforgettable.
          </p>
          <p className="text-xs text-brown/50 italic mb-8">
            Orders are inquiry only and not confirmed until a deposit is received.
          </p>
          <Link
            href="/contact"
            className="bg-mocha text-cream px-10 py-3.5 text-xs tracking-widest uppercase hover:bg-brown transition-colors"
          >
            Send an Inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
