import Link from "next/link";
import Image from "next/image";

const stats = [
  { label: "Est.", value: "2016" },
  { label: "Location", value: "Cortland, OH" },
  { label: "Specialty", value: "Custom Orders" },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Our Story
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose">
          About Us
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-6 bg-warm-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
          {/* Photo */}
          <div className="relative">
            <div className="relative h-96 md:h-130 overflow-hidden border border-parchment">
              <Image
                src="/images/family-about.jpg"
                alt="Alexis baking in her kitchen"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
            {/* Est. plaque */}
            <div className="absolute -bottom-5 -right-5 bg-cream border border-parchment px-6 py-4 text-center shadow-sm hidden md:block">
              <p className="font-script text-2xl text-rose/70">est.</p>
              <p className="font-serif text-3xl font-bold text-rose/60 leading-none">2016</p>
              <p className="text-xs tracking-widest uppercase text-brown/40 mt-1">Cortland, OH</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="font-script text-2xl md:text-3xl text-rose italic leading-relaxed mb-8">
              &ldquo;Every treat I make comes from a place of love &mdash; just
              like the one that started it all.&rdquo;
            </p>

            <div className="space-y-5 text-brown leading-8 font-light">
              <p>
                Little Charlie&apos;s Bakeshop began in 2016, born out of a
                mother&apos;s love for her son Charlie. What started as a handful
                of homemade goodies for his baptism celebration quickly turned
                into something much bigger &mdash; a true passion for the craft of
                baking.
              </p>
              <p>
                Alexis, a self-taught baker, poured herself into learning every
                technique, from the perfect macaron shell to the ideal sourdough
                ferment. Every item that leaves our kitchen is handcrafted from
                scratch with the finest ingredients and a whole lot of heart.
              </p>
              <p>
                Based right here in Cortland, Ohio, we&apos;re proud to serve our
                local community with seasonal menus, custom orders, and everyday
                treats that bring joy to every occasion.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {stats.map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-blush border border-parchment py-6 px-3 text-center"
                >
                  <p className="text-rose/70 text-xs tracking-[0.3em] uppercase mb-1">
                    {label}
                  </p>
                  <p className="font-serif text-2xl text-mocha font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-blush text-center">
        <p className="font-script text-4xl text-rose mb-3">We&apos;d Love to Bake for You</p>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown mb-7 font-light max-w-md mx-auto">
          From custom cakes to weekly sourdough, reach out and let&apos;s create
          something special together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-rose text-cream px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-dusty-rose transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/menu"
            className="border border-rose text-rose px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-warm-white transition-colors"
          >
            View Menu
          </Link>
        </div>
      </section>
    </>
  );
}
