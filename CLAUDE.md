@AGENTS.md

# Little Charlie's Bakeshop — Agent Guide

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** with App Router, React 19, TypeScript |
| Styling | **Tailwind CSS v4** — no `tailwind.config.js`, configured via `@theme` in `globals.css` |
| Database | **Neon** (serverless PostgreSQL) — `@neondatabase/serverless`, env: `DATABASE_URL` |
| File storage | **Vercel Blob** — `@vercel/blob`, env: `BLOB_READ_WRITE_TOKEN` |
| Email | **Resend** — env: `RESEND_API_KEY` |
| SMS | **Twilio** — env: `TWILIO_*` |
| Payments | **Square** — Phase 2, not yet active |
| Deployment | **Vercel** — auto-deploys `main`. Never push directly to `main`. |
| Testing | **Vitest** — `npm test` |
| Analytics | Vercel Analytics (already wired in layout) |

## Critical: Tailwind v4 is different

This project uses Tailwind CSS **v4**, which is a major breaking change from v3:
- No `tailwind.config.js` or `tailwind.config.ts` — configuration lives in `src/app/globals.css` under `@theme`
- No `theme.extend` — all custom tokens go in `@theme {}`
- Utilities are generated automatically from the `@theme` block
- `@apply` still works but prefer utility classes in JSX

## Critical: Color semantics — don't trust the names

The color tokens use bakery-evocative names that **do not map to their literal color**:

| Token | Actual color | Use for |
|-------|-------------|---------|
| `cream` | `#faf0dc` aged parchment | Main background |
| `warm-white` | `#f5e8cc` deeper parchment | Section alt background |
| `parchment` | `#d4b896` warm tan | Borders, dividers |
| `blush` | `#dde8d4` soft sage tint | Card/section backgrounds |
| `rose` | `#5a7a4a` **sage green** | Primary accent, links, CTAs |
| `dusty-rose` | `#3d5c30` **forest green** | Hover/dark accent |
| `brown` | `#6b5040` warm bark | Body text |
| `mocha` | `#2c1f14` deep dark brown | Headings |
| `gold` | `#c4956a` honey/wood | Warm highlights, stars |

## Fonts

| Class | Font | Use for |
|-------|------|---------|
| `font-serif` | Playfair Display | Section headings (`h2`, `h3`) |
| `font-sans` | Lato | Body text, nav, labels (default) |
| `font-script` | Dancing Script | Decorative text, taglines |

## Dev commands

```bash
npm run dev      # local dev server (port 3000)
npm run build    # production build — run to check for TypeScript/build errors
npm test         # vitest run
npm run lint     # eslint
```

**Always run `npm run build` before pushing.** Vercel will fail if the build breaks.

## File structure

```
src/
  app/
    page.tsx          # Home page
    layout.tsx        # Root layout — fonts, metadata, SiteShell, Analytics
    globals.css       # Tailwind v4 @theme + animations
    about/            # About page
    menu/             # Menu page
    contact/          # Contact / order inquiry form
    follow/           # Social follow page
    shop/             # Phase 2 — Square shop, NOT live, keep nav link commented out
    admin/            # Admin panel — protected, handle with care
    api/              # API routes
  components/
    Navbar.tsx        # Sticky top nav, mobile hamburger
    Footer.tsx        # Site footer
    Divider.tsx       # Decorative parchment divider line
    SiteShell.tsx     # Wraps Navbar + Footer around {children}
  lib/
    db.ts             # Neon DB client
    square.ts         # Square client — Phase 2
    sms.ts            # Twilio SMS helpers
    schema.sql        # DB schema
    admin-session.ts  # Admin auth
  __tests__/          # Vitest test files
```

## Design conventions

- **Corner accents**: many sections use `absolute` `w-4 h-4 border-t border-l border-parchment` divs in corners — replicate when adding new bordered boxes
- **Section structure**: usually `py-20 px-6` on the outer section, `max-w-6xl mx-auto` on the inner container
- **CTAs**: uppercase tracking-widest text, 8px–10px padding, either `bg-rose text-cream` (primary) or `border border-rose text-rose` (secondary)
- **Script headings**: pair a `font-script` tagline above a `font-serif` heading — see homepage pattern
- **Divider**: use `<Divider />` component between heading and body in most sections

## Branch and PR rules

- **Never push to `main`** — Vercel auto-deploys from main
- Feature branches: `feat/description` or `fix/description`
- Push to `develop` or a feature branch, open a PR
- Run `npm run build` and `npm test` before pushing — both must pass

## What's off-limits

- **`/shop`** — Phase 2, Square not configured. Don't activate the nav link.
- **`/admin`** — Don't change auth logic without understanding `src/lib/admin-session.ts`
- **Env vars** — Never hardcode secrets. All env vars live in Vercel dashboard + `.env.local` (not in repo)
- **Images in `public/images/`** — Don't delete existing images; add new ones alongside

## Environment variables needed for full local dev

```
DATABASE_URL          # Neon connection string
BLOB_READ_WRITE_TOKEN # Vercel Blob
RESEND_API_KEY        # Resend email
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
SQUARE_ACCESS_TOKEN   # Phase 2
```

Most features work without these in dev; API routes that use them will 500 if the var is missing.
