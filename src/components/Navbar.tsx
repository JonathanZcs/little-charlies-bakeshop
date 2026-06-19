"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Seasonal Menu" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/follow", label: "Follow" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-warm-white border-b border-parchment shadow-sm">
      <nav className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/images/logo.png"
            alt="Little Charlie's Bake Shop"
            width={130}
            height={130}
            className="h-16 w-auto mix-blend-multiply"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-base tracking-wide transition-colors hover:text-rose font-sans ${
                  pathname === href
                    ? "text-rose font-semibold"
                    : "text-brown"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-0.5 bg-mocha transition-all duration-200 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-mocha transition-all duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-mocha transition-all duration-200 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-warm-white border-t border-parchment px-6 py-5">
          <ul className="flex flex-col gap-4">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block text-sm tracking-wide transition-colors hover:text-rose ${
                    pathname === href
                      ? "text-rose font-semibold"
                      : "text-brown"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
