"use client";

import { useState } from "react";
import Image from "next/image";

type ShopItemProp = {
  name: string;
  price: string;
  category: string;
  image_path?: string | null;
  image?: string | null;
  link: string;
};

const hardcodedProducts = [
  {
    name: "Mommy & Me Cinnamon Roll Class",
    price: "$60.00",
    category: "Classes",
    image: "/images/mommy-me-cinnamon-roll-class.webp",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p389/Mommy_%26_me_cinnamon_roll_class.html",
  },
  {
    name: "Individual Brownie",
    price: "$5.00",
    category: "Baked Goods",
    image: "/images/brownie.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p385/individual_chocolate_chip_brownie.html",
  },
  {
    name: "Jumbo Cinnamon Roll",
    price: "$6.00",
    category: "Sourdough",
    image: "/images/cinnamon-roll.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p388/jumbo_sourdough_cinnamon_roll_w%2F_icing.html",
  },
  {
    name: "4-Pack Poptarts",
    price: "$16.00",
    category: "Baked Goods",
    image: "/images/poptarts.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p387/4pk_poptart.html",
  },
  {
    name: "4-Pack Jumbo Brownies",
    price: "$20.00",
    category: "Baked Goods",
    image: "/images/brownie-4pk.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p384/4pk_jumbo_brownies.html",
  },
  {
    name: "Individual Cheese Danish",
    price: "$4.00",
    category: "Pastries",
    image: "/images/danish.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p386/individual_blueberry_cheese_danish.html",
  },
  {
    name: "Sourdough Loaf",
    price: "$12.00",
    category: "Sourdough",
    image: "/images/sourdough-loaf.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p382/sourdough_loaf.html",
  },
  {
    name: "4-Pack Jumbo Cookies",
    price: "$20.00",
    category: "Baked Goods",
    image: "/images/cookies-4pk.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p383/4pk_jumbo_cookies.html",
  },
  {
    name: "Individual Scone",
    price: "$4.00",
    category: "Sourdough",
    image: "/images/scone.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p380/individual_sourdough_fig_scone.html",
  },
  {
    name: "6-Pack French Macarons",
    price: "$18.00",
    category: "Macarons",
    image: "/images/macarons.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p381/6pk_French_macarons.html",
  },
  {
    name: "Banana Bread Loaf",
    price: "$18.00",
    category: "Baked Goods",
    image: "/images/banana-bread.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p379/Chocolate_chip_banana_bread_loaf_with_walnuts.html",
  },
  {
    name: "Sourdough Starter",
    price: "$5.00",
    category: "Sourdough",
    image: "/images/sourdough-starter.jpg",
    emoji: null,
    link: "http://www.littlecharliesbakeshop.com/store/p377/sourdough_starter.html",
  },
];

export default function ShopGrid({ items }: { items?: ShopItemProp[] }) {
  const products: ShopItemProp[] = items ?? hardcodedProducts;
  const allCategories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 text-sm tracking-wide transition-colors cursor-pointer border ${
              active === cat
                ? "bg-rose text-cream border-rose"
                : "bg-cream border-parchment text-brown hover:border-rose hover:text-rose"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const imgSrc = product.image_path ?? product.image ?? null;
          return (
          <div
            key={product.name}
            className="bg-cream border border-parchment flex flex-col group hover:border-rose/50 hover:shadow-md transition-all"
          >
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-warm-white">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blush" />
              )}
              <div className="absolute top-3 left-3 bg-cream/90 px-2 py-0.5 text-xs tracking-widest uppercase text-rose border border-parchment">
                {product.category}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col flex-1 p-5">
              <h3 className="font-serif text-lg text-mocha font-semibold leading-snug mb-auto">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-parchment">
                <span className="text-mocha font-bold text-lg">{product.price}</span>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-rose text-cream px-5 py-2 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors"
                >
                  Order
                </a>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </>
  );
}
