"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      inquiry: (form.elements.namedItem("inquiry") as HTMLTextAreaElement)
        .value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-14">
        <div className="w-16 h-16 bg-blush rounded-full mx-auto mb-5 flex items-center justify-center text-2xl">
          ✓
        </div>
        <h2 className="font-serif text-2xl text-mocha mb-2">
          Inquiry Received!
        </h2>
        <p className="text-brown font-light max-w-sm mx-auto leading-relaxed">
          Thank you! We&apos;ll be in touch soon. Remember, your order
          isn&apos;t confirmed until a deposit is received.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-rose text-sm underline cursor-pointer"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="name"
            className="block text-sm text-mocha mb-1.5 font-medium"
          >
            Name <span className="text-rose">*</span>
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border border-parchment bg-cream rounded-xl px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm text-mocha mb-1.5 font-medium"
          >
            Phone <span className="text-rose">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            required
            type="tel"
            className="w-full border border-parchment bg-cream rounded-xl px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors"
            placeholder="(234) 000-0000"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm text-mocha mb-1.5 font-medium"
        >
          Email <span className="text-rose">*</span>
        </label>
        <input
          id="email"
          name="email"
          required
          type="email"
          className="w-full border border-parchment bg-cream rounded-xl px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="inquiry"
          className="block text-sm text-mocha mb-1.5 font-medium"
        >
          Inquiry <span className="text-rose">*</span>
        </label>
        <textarea
          id="inquiry"
          name="inquiry"
          required
          rows={5}
          className="w-full border border-parchment bg-cream rounded-xl px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors resize-none"
          placeholder="Tell us about your order — what you'd like, your event date, quantity, and any special requests..."
        />
      </div>

      <p className="text-xs text-brown/55 italic">
        &#42; Orders are inquiry only and are not confirmed until a deposit is
        received.
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rose text-cream py-4 text-sm tracking-widest uppercase hover:bg-dusty-rose transition-colors disabled:opacity-60 cursor-pointer"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </button>

      {status === "error" && (
        <p className="text-center text-sm text-red-500">
          Something went wrong. Please try again or call us at 234-244-4104.
        </p>
      )}
    </form>
  );
}
