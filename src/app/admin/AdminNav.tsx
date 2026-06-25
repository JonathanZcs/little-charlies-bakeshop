import Link from "next/link";

const navLinks = [
  { href: "/admin", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/recipes", label: "Recipes" },
  { href: "/admin/finances", label: "Finances" },
];

export default function AdminNav({ active }: { active?: string }) {
  return (
    <nav className="bg-cream border-b border-parchment px-6 py-2 flex items-center gap-1 overflow-x-auto">
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`px-4 py-2 text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${
            active === label
              ? "bg-rose text-cream"
              : "text-brown/60 hover:text-rose border border-transparent hover:border-parchment"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
