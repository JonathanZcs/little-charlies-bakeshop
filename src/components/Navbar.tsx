"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  // { href: "/shop", label: "Shop" }, // Phase 2 — Square shop not yet configured
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/follow", label: "Follow" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-warm-white border-b border-parchment shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0 flex flex-col items-center leading-none">
          <span className="font-script text-3xl text-mocha">little charlie&apos;s</span>
          <span className="text-[9px] tracking-[0.3em] uppercase text-brown font-sans mt-0.5">Bake Shop</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`relative text-sm tracking-widest uppercase transition-colors hover:text-rose font-sans pb-1 group ${
                  pathname === href ? "text-rose" : "text-brown"
                }`}
              >
                {label}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-rose transition-all duration-300 ${
                    pathname === href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="hidden md:inline-block shrink-0 border border-rose text-rose text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-rose hover:text-cream transition-colors"
        >
          Order Now
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-7 h-px bg-mocha transition-all duration-250 ${
              open ? "rotate-45 translate-y-1.75" : ""
            }`}
          />
          <span
            className={`block w-7 h-px bg-mocha transition-all duration-250 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-7 h-px bg-mocha transition-all duration-250 ${
              open ? "-rotate-45 -translate-y-1.75" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-warm-white border-t border-parchment">
          <ul className="flex flex-col px-6 py-6 gap-5">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block text-sm tracking-widest uppercase transition-colors hover:text-rose ${
                    pathname === href ? "text-rose" : "text-brown"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-parchment">
              <Link
                href="/contact"
                className="inline-block border border-rose text-rose text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-rose hover:text-cream transition-colors"
                onClick={() => setOpen(false)}
              >
                Order Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
