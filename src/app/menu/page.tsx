import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Little Charlie's Bakeshop full menu — drinks, breakfast, custom cakes, macarons, sourdough, cookies, cheesecakes, and pies. Made fresh in Cortland, Ohio.",
};

type MenuItem = { name: string; desc?: string; price?: string };

type MenuCard = {
  name: string;
  images: string[];
  items: MenuItem[];
  note?: string;
  imgClass?: string;
};

const drinksCards: MenuCard[] = [
  {
    name: "Lattes",
    imgClass: "object-top",
    images: [
      "/images/latte.jpg",
      "/images/coffee-1.jpg",
      "/images/coffee-2.jpg",
      "/images/coffee-4.jpg",
      "/images/coffee-6.jpg",
    ],
    items: [
      { name: "White Chocolate Caramel" },
      { name: "Cinnamon Roll" },
      { name: "Cookie Butter" },
      { name: "Brown Sugar Shaken Espresso" },
      { name: "Banana Bread Dirty Chai" },
    ],
    note: "Available iced or hot. More flavors available in store.",
  },
  {
    name: "Specialty Drinks",
    imgClass: "object-top",
    images: ["/images/matcha.jpg", "/images/coffee-6.jpg"],
    items: [
      {
        name: "Dirty Coconut",
        desc: "Diet Coke, vanilla, lime, coconut cream",
      },
      { name: "Strawberry Matcha" },
      { name: "Honey Matcha" },
    ],
    note: "Seasonal specials rotate regularly. Pricing in store.",
  },
];

const breakfastCards: MenuCard[] = [
  {
    name: "Warm Breakfast",
    images: [
      "/images/avocado-toast.jpg",
      "/images/breakfast-focaccia.jpg",
      "/images/sourdough-toast.jpg",
    ],
    items: [
      {
        name: "Breakfast Burrito",
        desc: "eggs, potato, spinach, onion, garlic, cheese blend, bacon",
      },
      {
        name: "Avocado Toast",
        desc: "smashed avocado, everything seasoning on sourdough",
      },
      { name: "Breakfast Focaccia" },
      { name: "Pepperoni Roll" },
    ],
    note: "Served Tue – Sat. Items subject to daily availability. Pricing in store.",
  },
  {
    name: "Sourdough Bagels",
    images: [
      "/images/bagels-1.jpg",
      "/images/bagels-2.jpg",
      "/images/bagels.jpg",
    ],
    items: [
      { name: "Cream Cheese" },
      { name: "Butter" },
      { name: "Bacon Chive Cream Cheese" },
      { name: "Blueberry Cream Cheese" },
    ],
    note: "Made in-house daily. Pricing in store.",
  },
];

const bakeryCards: MenuCard[] = [
  {
    name: "Decorated Cookies",
    images: ["/images/menu-cookies.jpg"],
    items: [
      { name: "1 Dozen — Standard", price: "$45" },
      { name: "1 Dozen — Custom Shape", price: "From $50" },
      { name: "Gift Set", price: "From $30" },
    ],
    note: "Custom designs welcome. Lead time required.",
  },
  {
    name: "Cakes & Cupcakes",
    images: [
      "/images/menu-cake.jpg",
      "/images/cupcakes-1.jpg",
      "/images/cupcakes-2.jpg",
      "/images/cupcakes-3.jpg",
    ],
    items: [
      { name: "6in Double Layer", price: "$55" },
      { name: "6in Triple Layer", price: "$65" },
      { name: "Cupcakes (1 Dozen)", price: "From $36" },
      { name: "Smash Cake", price: "From $25" },
    ],
    note: "Custom cakes require deposit to confirm.",
  },
  {
    name: "Sourdough",
    images: ["/images/menu-sourdough.jpeg", "/images/sourdough-loaf.jpg"],
    items: [
      { name: "Sourdough Loaf", price: "$12" },
      { name: "Jumbo Cinnamon Roll", price: "$6" },
      { name: "Scone", price: "$4" },
      { name: "Sourdough Starter", price: "$5" },
    ],
  },
  {
    name: "Pies",
    images: ["/images/menu-pies-v2.jpg"],
    items: [
      { name: "Seasonal Fruit Pie", price: "From $28" },
      { name: "Cream Pie", price: "From $28" },
      { name: "Nut Pie", price: "From $30" },
    ],
    note: "Whole pies only. Pre-order required.",
  },
  {
    name: "Cheesecake",
    images: ["/images/cheesecake-whole.jpg", "/images/cheesecake-slice.jpg"],
    items: [
      { name: "Classic New York", price: "$40" },
      { name: "Seasonal Flavor", price: "$42" },
      { name: "Shooters (6pk)", price: "$22.50" },
      { name: "Whole 9in", price: "$55" },
    ],
    note: "Pre-order recommended.",
  },
  {
    name: "French Macarons",
    images: ["/images/menu-macarons.jpg", "/images/macarons.jpg"],
    items: [
      { name: "6-Pack", price: "$18" },
      { name: "1 Dozen", price: "$34" },
    ],
    note: "Seasonal flavors. Pre-order recommended.",
  },
];

function SectionDivider({
  label,
  sub,
  id,
}: {
  label: string;
  sub: string;
  id: string;
}) {
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

function MenuCardGrid({ cards }: { cards: MenuCard[] }) {
  return (
    <div className="max-w-5xl mx-auto px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-cream border border-parchment overflow-hidden group"
        >
          {/* Photo */}
          <div className="relative h-56 overflow-hidden">
            <Image
              src={card.images[0]}
              alt={card.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className={`object-cover group-hover:scale-105 transition-transform duration-500 ${card.imgClass ?? "object-center"}`}
            />
            <div className="absolute inset-0 bg-linear-to-t from-mocha/75 via-mocha/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
              <p className="font-script text-2xl text-cream drop-shadow">
                {card.name}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 pt-5 pb-6">
            <ul className="space-y-0">
              {card.items.map((item) => (
                <li
                  key={item.name}
                  className="border-b border-parchment/50 py-2.5"
                >
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="text-sm text-brown">{item.name}</span>
                    {item.price && (
                      <span className="text-sm text-rose font-semibold shrink-0">
                        {item.price}
                      </span>
                    )}
                  </div>
                  {item.desc && (
                    <p className="text-xs text-brown/50 italic mt-0.5">
                      {item.desc}
                    </p>
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

export default function MenuPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Little Charlie&rsquo;s Bakeshop
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">
          Our Menu
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-md mx-auto font-light text-base leading-relaxed mb-10">
          Baked goods, breakfast, and drinks &mdash; all made from scratch in
          Cortland, Ohio.
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
      <section
        id="custom-orders"
        className="py-16 px-6 bg-blush text-center scroll-mt-16"
      >
        <div className="max-w-2xl mx-auto border border-parchment p-10 md:p-14 relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-parchment" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-parchment" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-parchment" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-parchment" />
          <p className="text-rose/70 text-xs tracking-[0.35em] uppercase mb-2">
            Custom Orders
          </p>
          <p className="font-script text-4xl text-rose mb-4">Made Just for You</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-parchment" />
            <span className="text-parchment text-xs">&#10022;</span>
            <div className="h-px w-10 bg-parchment" />
          </div>
          <p className="text-brown leading-relaxed mb-2 text-base font-light">
            Looking for a custom cake, decorated cookies, or a special dessert
            for your event? We&apos;d love to make something unforgettable.
          </p>
          <p className="text-xs text-brown/50 italic mb-8">
            Orders are inquiry only and not confirmed until a deposit is
            received.
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
