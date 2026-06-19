const socials = [
  {
    name: "Instagram",
    handle: "@littlecharliesbakeshop",
    url: "https://www.instagram.com/littlecharliesbakeshop/",
    emoji: "📸",
    desc: "Our latest creations, behind-the-scenes content, and seasonal specials.",
    cta: "Follow on Instagram",
  },
  {
    name: "Facebook",
    handle: "Little Charlie's Bakeshop",
    url: "https://www.facebook.com/littlecharliesbakeshop",
    emoji: "📘",
    desc: "Announcements, events, community posts, and updates.",
    cta: "Follow on Facebook",
  },
  {
    name: "TikTok",
    handle: "@littlecharliesbakeshop",
    url: "https://www.tiktok.com/@littlecharliesbakeshop",
    emoji: "🎵",
    desc: "Watch our baking process, treat reveals, and fun behind-the-scenes videos.",
    cta: "Follow on TikTok",
  },
  {
    name: "Email",
    handle: "littlecharliesbakeshop@hotmail.com",
    url: "mailto:littlecharliesbakeshop@hotmail.com",
    emoji: "✉️",
    desc: "Reach us directly for custom orders, questions, or just to say hello.",
    cta: "Send an Email",
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
              <div className="w-14 h-14 bg-blush/50 rounded-full flex items-center justify-center text-2xl">
                {s.emoji}
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
