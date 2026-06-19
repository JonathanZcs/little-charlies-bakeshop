import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Follow Us",
  description:
    "Follow Little Charlie's Bakeshop on Instagram, Facebook, and TikTok for the latest treats, seasonal specials, and behind-the-scenes baking.",
};

const socials = [
  {
    name: "Instagram",
    handle: "@littlecharliesbakeshop",
    url: "https://www.instagram.com/littlecharliesbakeshop/",
    desc: "Our latest creations, behind-the-scenes content, and seasonal specials.",
    cta: "Follow on Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    handle: "Little Charlie's Bakeshop",
    url: "https://www.facebook.com/littlecharliesbakeshop",
    desc: "Announcements, events, community posts, and updates.",
    cta: "Follow on Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    handle: "@littlecharliesbakeshop",
    url: "https://www.tiktok.com/@littlecharliesbakeshop",
    desc: "Watch our baking process, treat reveals, and fun behind-the-scenes videos.",
    cta: "Follow on TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "Email",
    handle: "littlecharliesbakeshop@hotmail.com",
    url: "mailto:littlecharliesbakeshop@hotmail.com",
    desc: "Reach us directly for custom orders, questions, or just to say hello.",
    cta: "Send an Email",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
];

export default function FollowPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Stay Connected
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">
          Follow Along
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-md mx-auto font-light text-lg leading-relaxed">
          Stay up to date with seasonal menus, new treats, and a peek behind the
          scenes.
        </p>
      </section>

      {/* Social cards */}
      <section className="py-16 px-6 bg-warm-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-7">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target={s.name !== "Email" ? "_blank" : undefined}
              rel={s.name !== "Email" ? "noopener noreferrer" : undefined}
              className="group bg-cream border border-parchment rounded-2xl p-8 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-blush/50 rounded-full flex items-center justify-center text-rose">
                {s.icon}
              </div>
              <div>
                <h2 className="font-serif text-xl text-mocha font-semibold mb-0.5">
                  {s.name}
                </h2>
                <p className="text-rose text-xs tracking-wide">{s.handle}</p>
              </div>
              <p className="text-brown text-sm leading-relaxed font-light flex-1">
                {s.desc}
              </p>
              <span className="text-rose text-sm tracking-widest uppercase border-b border-rose pb-0.5 self-start group-hover:text-dusty-rose transition-colors">
                {s.cta} &rarr;
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
