import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Divider from "@/components/Divider";

export const metadata: Metadata = {
  title: "Little Charlie's Bakeshop | Handcrafted Baked Goods in Cortland, OH",
  description:
    "Little Charlie's Bakeshop — custom cakes, decorated cookies, sourdough bread, macarons, and seasonal treats handcrafted in Cortland, Ohio. Custom orders welcome.",
};

const featuredItems = [
  {
    name: "French Macarons",
    desc: "Delicate almond shells with creamy seasonal fillings",
    price: "$18 / 6pk",
    image: "/images/macarons.jpg",
  },
  {
    name: "Jumbo Brownies",
    desc: "Rich, fudgy chocolate brownies with crispy edges",
    price: "$20 / 4pk",
    image: "/images/brownie-4pk.jpg",
  },
  {
    name: "Sourdough Loaf",
    desc: "Artisan slow-fermented sourdough with a golden crust",
    price: "$12",
    image: "/images/sourdough-loaf.jpg",
  },
  {
    name: "Decorated Cookies",
    desc: "Beautifully hand-decorated sugar cookies for any occasion",
    price: "Seasonal",
    image: "/images/decorated-sugar-cookies-1.jpg",
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
              src="/images/logo-stamp.png"
              alt="Little Charlie's Bake Shop"
              width={380}
              height={380}
              className="w-64 h-64 md:w-80 md:h-80 object-contain mb-2"
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
                href="/contact"
                className="bg-rose text-cream px-7 py-3 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors"
              >
                Place an Inquiry
              </Link>
              <Link
                href="/menu"
                className="border border-rose text-rose px-7 py-3 text-xs tracking-widest uppercase hover:bg-blush transition-colors"
              >
                View Menu
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
              className="object-cover object-center"
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
              Tue &ndash; Fri &nbsp;7:30AM &ndash; 4PM
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gold">&#10022;</span>
            <span className="text-cream/90 tracking-wide">
              Sat &nbsp;9AM &ndash; 3PM
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
                className="bg-cream border border-parchment hover:border-rose/40 hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-mocha/10" />
                </div>
                <div className="p-6 text-center">
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
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="text-rose text-xs tracking-widest uppercase border-b border-rose pb-0.5 hover:text-dusty-rose transition-colors"
            >
              View Full Menu &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Orders Photo Scroll */}
      <section className="bg-blush pt-16 overflow-hidden">
        <p className="text-center text-rose/70 text-xs tracking-[0.4em] uppercase mb-6">Custom Creations</p>
        <div className="relative">
          <div className="flex gap-4 animate-marquee w-max">
            {[
              "/images/custom-cake1.jpg",
              "/images/custom-cookies4.jpg",
              "/images/custom-cake5.jpg",
              "/images/decorated-cookies2.jpg",
              "/images/custom-cake7.jpg",
              "/images/custom-cookies5.jpg",
              "/images/decorated-cake.jpg",
              "/images/custom-cookies6.jpg",
              "/images/custom-cake2.jpg",
              "/images/custom-cupcake.jpg",
              "/images/custom-cookies7.jpg",
              "/images/custom-cake3.jpg",
              "/images/decorated-sugar-cookies-1.jpg",
              "/images/custom-cake6.jpg",
              "/images/custom-cookies8.jpg",
              "/images/decorated-cookies3.jpg",
              // duplicated for seamless loop
              "/images/custom-cake1.jpg",
              "/images/custom-cookies4.jpg",
              "/images/custom-cake5.jpg",
              "/images/decorated-cookies2.jpg",
              "/images/custom-cake7.jpg",
              "/images/custom-cookies5.jpg",
              "/images/decorated-cake.jpg",
              "/images/custom-cookies6.jpg",
              "/images/custom-cake2.jpg",
              "/images/custom-cupcake.jpg",
              "/images/custom-cookies7.jpg",
              "/images/custom-cake3.jpg",
              "/images/decorated-sugar-cookies-1.jpg",
              "/images/custom-cake6.jpg",
              "/images/custom-cookies8.jpg",
              "/images/decorated-cookies3.jpg",
            ].map((src, i) => (
              <div key={i} className="relative h-64 w-56 shrink-0 overflow-hidden">
                <Image
                  src={src}
                  alt="Custom creation"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Orders CTA */}
      <section className="py-16 px-8 bg-blush">
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

      {/* Testimonials */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">What People Are Saying</p>
            <p className="font-script text-4xl text-rose mb-1">Customer Love</p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-px w-10 bg-parchment" />
              <span className="text-gold text-sm tracking-widest">★★★★★</span>
              <div className="h-px w-10 bg-parchment" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                quote: "The macarons are the best I've had in my life. Best little bakery around — great variety and the butter whip frosting is wonderful.",
                name: "Kristi R.",
              },
              {
                quote: "I ordered a custom cake and gave them a picture for my daughter's 16th birthday. They were spot on — the picture was identical. We were so pleased when we opened the box.",
                name: "Vicki S.",
              },
              {
                quote: "Best banana pudding cookie ever and the brown sugar pop tart crust is perfect — the best crust I've ever tasted. A hidden gem!",
                name: "Angelina R.",
              },
              {
                quote: "We got to the car, opened the sourdough bread and took a bite — I think we took a pound off of it sitting in the car. It was sooooo good. Warm and delicious.",
                name: "Mara C.",
              },
              {
                quote: "Absolutely phenomenal products and such a cute atmosphere. I've tried the classic sourdough and two specialty flavors — crisp on the outside, moist on the inside. WOW.",
                name: "Naomi D.",
              },
              {
                quote: "Every time I've visited the staff were so friendly and helpful! The cookies are the best and very flavorful. They also carry my new favorite coffee!",
                name: "Kenneth H.",
              },
            ].map(({ quote, name }) => (
              <div key={name} className="bg-warm-white border border-parchment p-7 flex flex-col gap-4 relative">
                <span className="font-script text-5xl text-rose/20 leading-none absolute top-4 left-5 select-none">&ldquo;</span>
                <p className="text-brown leading-relaxed font-light text-sm pt-4">{quote}</p>
                <div className="mt-auto pt-4 border-t border-parchment flex items-center justify-between">
                  <span className="text-mocha text-sm font-semibold">{name}</span>
                  <span className="text-gold text-xs tracking-widest">★★★★★</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Photo Scroll */}
      <section className="bg-warm-white pt-16 overflow-hidden">
        <div className="text-center mb-6">
          <p className="text-rose/70 text-xs tracking-[0.4em] uppercase">The Heart Behind the Bakes</p>
        </div>
        <div className="relative">
          <div className="flex gap-4 animate-marquee-reverse w-max">
            {[
              "/images/family-1.jpg",
              "/images/family-2.jpg",
              "/images/family-3.jpg",
              "/images/family-4.jpg",
              "/images/family-6.jpg",
              "/images/family-7.jpg",
              "/images/family-about.jpg",
              "/images/family.jpg",
              // duplicated for seamless loop
              "/images/family-1.jpg",
              "/images/family-2.jpg",
              "/images/family-3.jpg",
              "/images/family-4.jpg",
              "/images/family-6.jpg",
              "/images/family-7.jpg",
              "/images/family-about.jpg",
              "/images/family.jpg",
            ].map((src, i) => (
              <div key={i} className="relative h-72 w-64 shrink-0 overflow-hidden">
                <Image
                  src={src}
                  alt="The family behind Little Charlie's Bakeshop"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
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


