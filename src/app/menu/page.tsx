import Link from "next/link";
import Image from "next/image";

const menuCategories = [
  {
    name: "Pies",
    icon: "",
    image: "/images/menu-pies-v2.jpg",
    items: [
      { name: "Seasonal Fruit Pie", price: "Starting at $28" },
      { name: "Cream Pie", price: "Starting at $28" },
      { name: "Nut Pie", price: "Starting at $30" },
    ],
    note: "Whole pies only. Pre-order required.",
  },
  {
    name: "Decorated Cookies",
    icon: "🍪",
    image: "/images/menu-cookies.jpg",
    items: [
      { name: "1 Dozen (standard)", price: "$45" },
      { name: "1 Dozen (custom shape)", price: "Starting at $50" },
      { name: "Gift Set", price: "Starting at $30" },
    ],
    note: "Custom designs welcome. Lead time required.",
  },
  {
    name: "Cheesecake",
    icon: "🎂",
    image: "/images/menu-cheesecake.jpg",
    items: [
      { name: "Classic New York", price: "$40" },
      { name: "Seasonal Flavor", price: "$42" },
      { name: "Cheesecake Bites (6pk)", price: "$18" },
    ],
    note: "Available whole or by the slice.",
  },
  {
    name: "Cakes",
    icon: "🩷",
    image: "/images/menu-cake.jpg",
    items: [
      { name: "Custom Layer Cake", price: "Contact for Quote" },
      { name: "Smash Cake", price: "Starting at $25" },
      { name: "Cupcakes (1 dozen)", price: "Starting at $36" },
    ],
    note: "Custom cakes require deposit to confirm.",
  },
  {
    name: "Sourdough",
    icon: "🍞",
    image: "/images/menu-sourdough.jpeg",
    items: [
      { name: "Sourdough Loaf", price: "$12" },
      { name: "Jumbo Cinnamon Roll w/ Icing", price: "$6" },
      { name: "Sourdough Fig Scone", price: "$4" },
      { name: "Sourdough Starter", price: "$5" },
    ],
  },
  {
    name: "French Macarons",
    icon: "🎀",
    image: "/images/menu-macarons.jpg",
    items: [
      { name: "6pk French Macarons", price: "$18" },
      { name: "1 Dozen Macarons", price: "$34" },
    ],
    note: "Seasonal flavors. Pre-order recommended.",
  },
];

export default function MenuPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Available Now
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">
          Seasonal Menu
        </p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-lg mx-auto leading-relaxed mb-8 font-light text-lg">
          Our menu changes with the seasons. Call us to place your order or
          check our Instagram for the latest offerings.
        </p>
        <a
          href="tel:2342444104"
          className="inline-block bg-rose text-cream px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-dusty-rose transition-colors"
        >
          Call to Order &mdash; 234-244-4104
        </a>
      </section>

      {/* Menu Grid */}
      <section className="py-16 px-6 bg-warm-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-7">
          {menuCategories.map((cat) => (
          <div key={cat.name} className="bg-cream border border-parchment relative group overflow-hidden">
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-parchment/60 z-10" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-parchment/60 z-10" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-parchment/60 z-10" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-parchment/60 z-10" />
            {/* Category photo */}
            {cat.image ? (
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-mocha/30" />
                <div className="absolute bottom-3 left-5">
                  <h2 className="font-script text-2xl text-cream drop-shadow">{cat.name}</h2>
                </div>
              </div>
            ) : (
              <div className="h-20 bg-blush flex items-center px-6">
                <h2 className="font-script text-2xl text-rose">{cat.name}</h2>
              </div>
            )}
            <div className="p-6">
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex justify-between items-baseline border-b border-parchment/70 pb-2 last:border-0"
                  >
                    <span className="text-brown text-sm">{item.name}</span>
                    <span className="text-rose text-sm font-semibold ml-4 shrink-0">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
              {cat.note && (
                <p className="mt-4 text-xs text-brown/60 italic">{cat.note}</p>
              )}
            </div>
          </div>))}
        </div>

        <p className="text-center mt-10 text-sm text-brown/60 italic">
          &#42; Menu items are seasonal and subject to availability. Call to
          confirm current offerings.
        </p>
      </section>

      {/* Order CTA */}
      <section className="py-14 px-6 bg-linear-to-r from-blush/40 to-parchment/50 text-center">
        <h2 className="font-serif text-3xl text-mocha mb-3">
          Ready to Order?
        </h2>
        <p className="text-brown mb-7 font-light">
          Fill out an inquiry form and we&apos;ll be in touch to confirm your
          order.
        </p>
        <Link
          href="/contact"
          className="bg-mocha text-cream px-10 py-4 text-sm tracking-widest uppercase hover:bg-brown transition-colors"
        >
          Send an Inquiry
        </Link>
      </section>
    </>
  );
}
