import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-mocha text-cream">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-script text-3xl text-gold mb-1">Little Charlie&apos;s</p>
          <p className="text-xs tracking-[0.25em] uppercase text-gold/70 font-semibold mb-3">Bake Shop</p>
          <div className="w-10 h-px bg-parchment/30 mb-3" />
          <p className="text-sm text-parchment/70 leading-relaxed">
            Handcrafted baked goods made with love.
            <br />
            Est. 2016 &middot; Cortland, Ohio
          </p>
        </div>

        {/* Hours */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gold/80 mb-4">
            Hours
          </h4>
          <dl className="text-sm text-parchment/80 space-y-2">
            <div className="flex justify-between gap-4">
              <dt>Tuesday &ndash; Friday</dt>
              <dd className="text-right">
                <span className="block">7:30AM &ndash; 9AM <span className="text-parchment/50 text-xs">drive-thru</span></span>
                <span className="block">9AM &ndash; 4PM <span className="text-parchment/50 text-xs">storefront</span></span>
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Saturday</dt>
              <dd>9AM &ndash; 2PM</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Sunday &ndash; Monday</dt>
              <dd>Closed</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-parchment/80">
            <a
              href="tel:2342444104"
              className="hover:text-rose transition-colors"
            >
              &#9990; 234-244-4104
            </a>
          </p>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-xs uppercase tracking-widest text-gold/80 mb-4">
            Follow Along
          </h4>
          <ul className="text-sm text-parchment/80 space-y-2">
            <li>
              <a
                href="https://www.instagram.com/littlecharliesbakeshop/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/littlecharliesbakeshop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://www.tiktok.com/@littlecharliesbakeshop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rose transition-colors"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="mailto:littlecharliesbakeshop@hotmail.com"
                className="hover:text-rose transition-colors"
              >
                Email Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brown/30 py-4 text-center text-xs text-parchment/40">
        &copy; {new Date().getFullYear()} Little Charlie&apos;s Bakeshop. All
        rights reserved.
      </div>
    </footer>
  );
}
