import Link from "next/link";
import Image from "next/image";
import Divider from "@/components/Divider";

const featuredItems = [
  {
    name: "French Macarons",
    desc: "Delicate almond shells with creamy seasonal fillings",
    price: "$18 / 6pk",
    emoji: "🎀",
  },
  {
    name: "Jumbo Brownies",
    desc: "Rich, fudgy chocolate brownies with crispy edges",
    price: "$20 / 4pk",
    emoji: "🍫",
  },
  {
    name: "Sourdough Loaf",
    desc: "Artisan slow-fermented sourdough with a golden crust",
    price: "$12",
    emoji: "🍞",
  },
  {
    name: "Decorated Cookies",
    desc: "Beautifully hand-decorated sugar cookies for any occasion",
    price: "Seasonal",
    emoji: "🍪",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — split layout: left logo/text, right family photo */}
      <section className="relative bg-cream overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-140">

          {/* Left: logo + text */}
          <div className="flex flex-col items-center md:items-start justify-center py-16 px-8 md:px-14 text-center md:text-left relative">
            {/* Corner frame on left panel */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-parchment hidden md:block" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-parchment hidden md:block" />

            <Image
              src="/images/logo.png"
              alt="Little Charlie's Bake Shop"
              width={380}
              height={380}
              className="w-64 h-64 md:w-80 md:h-80 object-contain mb-2 mix-blend-multiply"
              priority
            />

            <p className="font-script text-2xl text-rose mb-1">
              Simple. Fresh. Made with Love.
            </p>
            <p className="text-brown/60 text-xs tracking-[0.3em] uppercase mb-6">
              Est. 2016 &middot; Cortland, Ohio
            </p>

            <p className="text-brown text-base leading-relaxed mb-8 font-light max-w-sm">
              Handcrafted baked goods made with love. Custom orders, seasonal
              menus, and everyday treats baked right here in Cortland, Ohio.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/shop"
                className="bg-rose text-cream px-7 py-3 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/contact"
                className="border border-rose text-rose px-7 py-3 text-xs tracking-widest uppercase hover:bg-blush transition-colors"
              >
                Place an Order
              </Link>
            </div>
          </div>

          {/* Right: family photo */}
          <div className="relative min-h-75 md:min-h-full overflow-hidden bg-blush">
            <Image
              src="/images/family.jpg"
              alt="The heart behind Little Charlie's"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
              priority
            />
            {/* Overlay caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-mocha/60 px-6 py-4 text-center z-10">
              <p className="font-script text-2xl text-gold">thank you for supporting local</p>
              <p className="text-cream/70 text-xs tracking-widest uppercase mt-0.5">♥ Cortland, Ohio</p>
            </div>
          </div>

        </div>
      </section>

      {/* Hours Banner */}
      <section className="bg-dusty-rose text-cream py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-sm">
          <div className="flex items-center gap-3">
            <span className="text-gold">&#10022;</span>
            <span className="text-cream/90 tracking-wide">
              Tue &ndash; Sat &nbsp;9AM &ndash; 4PM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold">&#10022;</span>
            <span className="text-cream/90 tracking-wide">
              Sun &ndash; Mon &nbsp;Closed
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold">&#10022;</span>
            <a
              href="tel:2342444104"
              className="text-cream/90 tracking-wide hover:text-gold transition-colors"
            >
              234-244-4104
            </a>
          </div>
        </div>
      </section>

      {/* Featured Treats */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-script text-3xl text-rose mb-1">fresh from the oven</p>
            <h2 className="font-serif text-3xl text-mocha tracking-wide">
              Our Signature Treats
            </h2>
            <Divider />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.name}
                className="bg-cream p-7 text-center border border-parchment hover:border-rose/40 hover:shadow-md transition-all"
              >
                <div className="w-14 h-14 bg-blush mx-auto mb-4 flex items-center justify-center text-3xl border border-parchment/60">
                  {item.emoji}
                </div>
                <h3 className="font-serif text-lg text-mocha font-semibold mb-2">
                  {item.name}
                </h3>
                <div className="w-6 h-px bg-parchment mx-auto mb-2" />
                <p className="text-brown text-sm leading-relaxed mb-3">
                  {item.desc}
                </p>
                <span className="text-rose text-sm font-semibold">
                  {item.price}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="text-rose text-xs tracking-widest uppercase border-b border-rose pb-0.5 hover:text-dusty-rose transition-colors"
            >
              View Full Shop &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Orders CTA */}
      <section className="py-20 px-8 bg-blush">
        <div className="max-w-2xl mx-auto text-center border border-parchment p-10 md:p-14 relative">
          {/* Corner accents */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-parchment" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-parchment" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-parchment" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-parchment" />

          <p className="text-rose/70 text-xs tracking-[0.35em] uppercase mb-2">Custom Orders</p>
          <p className="font-script text-4xl text-rose mb-3">Made Just for You</p>
          <Divider symbol="♥" />
          <p className="text-brown leading-relaxed mt-4 mb-4 text-base font-light">
            Looking for a custom cake, a dozen decorated cookies, or a special
            dessert for your event? We&apos;d love to make something
            unforgettable.
          </p>
          <p className="text-xs text-brown/50 italic mb-8">
            Orders are inquiry only and are not confirmed until a deposit is received.
          </p>
          <Link
            href="/contact"
            className="bg-mocha text-cream px-10 py-3.5 text-xs tracking-widest uppercase hover:bg-brown transition-colors"
          >
            Send an Inquiry
          </Link>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-20 px-6 bg-warm-white">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-rose/70 text-xs tracking-[0.35em] uppercase mb-2">
              Our Story
            </p>
            <p className="font-script text-4xl text-rose mb-3">Baked with Heart</p>
            <Divider />
            <p className="text-brown leading-relaxed mt-5 mb-6 font-light text-base">
              Little Charlie&apos;s Bakeshop started in 2016 as a sweet gesture
              for a baptism — and grew into a full-fledged bakery born from
              passion, love, and a lot of flour. Every item is made by hand
              right here in Cortland, Ohio.
            </p>
            <Link
              href="/about"
              className="text-rose text-xs tracking-widest uppercase border-b border-rose pb-0.5 hover:text-dusty-rose transition-colors"
            >
              Read Our Story &rarr;
            </Link>
          </div>
          {/* Rustic est. plaque */}
          <div className="w-52 h-52 md:w-60 md:h-60 shrink-0 border-2 border-parchment flex flex-col items-center justify-center text-center p-6 relative">
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-parchment/70" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-parchment/70" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-parchment/70" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-parchment/70" />
            <span className="font-script text-4xl text-rose/60">est.</span>
            <span className="font-serif text-5xl font-bold text-rose/50 leading-none">2016</span>
            <div className="w-10 h-px bg-parchment my-2" />
            <span className="text-xs tracking-[0.2em] uppercase text-brown/50">Cortland, OH</span>
          </div>
        </div>
      </section>
    </>
  );
}


