# Little Charlie's Bake Shop

Website for Little Charlie's Bake Shop — a custom order bakery based in Cortland, Ohio. Built with a rustic farmhouse aesthetic using sage greens, warm creams, and wood-grain textures.

## Tech Stack

- **Next.js** (App Router, Turbopack)
- **Tailwind CSS v4** — custom theme colors in `globals.css` via `@theme {}`
- **Fonts** — Playfair Display (headings), Lato (body), Dancing Script (accents) via `next/font/google`
- **TypeScript**

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero split layout, featured treats, custom orders CTA, about teaser |
| `/menu` | Seasonal menu — 6 category cards with photos and item/price listings |
| `/shop` | Filterable product grid — 12 items with photos and order links |
| `/about` | Bakery story, Alexis baking photo, stats plaque |
| `/contact` | Order inquiry form (name, phone, email, inquiry type) |
| `/follow` | Social media links — Instagram, Facebook, TikTok, Email |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Contact Form

The form posts to `/api/contact`. It currently validates inputs and logs to console. To enable email delivery, wire up [Resend](https://resend.com) or [SendGrid](https://sendgrid.com) in `src/app/api/contact/route.ts`.

## Images

All product and menu photos live in `public/images/`. The logo uses `mix-blend-multiply` to eliminate the baked-in background on light surfaces.

## Deploy

Deploy to [Vercel](https://vercel.com) — zero config required for Next.js App Router projects.

## Pending

- [ ] Wire email sending in `/api/contact`
- [ ] Add pie category photo (`menu-pies.jpg`)
- [ ] Revisit logo (transparent version via Canva or remove.bg)
- [ ] Deploy to Vercel
