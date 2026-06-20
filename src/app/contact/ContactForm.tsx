"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border border-parchment bg-cream px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors";

const labelClass = "block text-xs tracking-widest uppercase text-brown mb-1.5 font-medium";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = {
      name:      (form.elements.namedItem("name")      as HTMLInputElement).value,
      phone:     (form.elements.namedItem("phone")     as HTMLInputElement).value,
      email:     (form.elements.namedItem("email")     as HTMLInputElement).value,
      orderType: (form.elements.namedItem("orderType") as HTMLSelectElement).value,
      eventDate: (form.elements.namedItem("eventDate") as HTMLInputElement).value,
      inquiry:   (form.elements.namedItem("inquiry")   as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-14">
        <div className="w-16 h-16 bg-blush mx-auto mb-5 flex items-center justify-center">
          <svg className="w-7 h-7 text-rose" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-mocha mb-2">Inquiry Received!</h2>
        <p className="text-brown font-light max-w-sm mx-auto leading-relaxed">
          Thank you! We&apos;ll be in touch soon. Remember, your order isn&apos;t
          confirmed until a deposit is received.
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

      {/* Name + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-rose">*</span>
          </label>
          <input id="name" name="name" required placeholder="Your full name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone <span className="text-rose">*</span>
          </label>
          <input id="phone" name="phone" required type="tel" placeholder="(234) 000-0000" className={inputClass} />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email <span className="text-rose">*</span>
        </label>
        <input id="email" name="email" required type="email" placeholder="you@example.com" className={inputClass} />
      </div>

      {/* Order Type + Event Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="orderType" className={labelClass}>
            Order Type <span className="text-rose">*</span>
          </label>
          <div className="relative">
            <select
              id="orderType"
              name="orderType"
              required
              defaultValue=""
              className={inputClass + " cursor-pointer appearance-none pr-10 py-3.5"}
            >
              <option value="" disabled>Select an option...</option>
              <option>Custom Cake</option>
              <option>Decorated Cookies</option>
              <option>Sourdough / Bread</option>
              <option>Macarons</option>
              <option>Cupcakes</option>
              <option>Classes</option>
              <option>Other / General Inquiry</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="eventDate" className={labelClass}>
            Event Date <span className="text-brown/40 normal-case tracking-normal text-xs font-light">(optional)</span>
          </label>
          <p className="text-xs text-brown/40 italic mb-1.5">Minimum 3 days lead time required.</p>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            min={(() => { const d = new Date(); d.setDate(d.getDate() + 3); return d.toISOString().split("T")[0]; })()}
            className={inputClass + " cursor-pointer py-3.5"}
            onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
          />
        </div>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="inquiry" className={labelClass}>
          Order Details <span className="text-rose">*</span>
        </label>
        <textarea
          id="inquiry"
          name="inquiry"
          required
          rows={5}
          className={inputClass + " resize-none"}
          placeholder="Describe your order — theme, size, quantity, flavors, allergies, or any special requests..."
        />
      </div>

      <p className="text-xs text-brown/50 italic">
        Orders are inquiry only and are not confirmed until a deposit is received.
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-rose text-cream py-4 text-xs tracking-widest uppercase hover:bg-dusty-rose transition-colors disabled:opacity-60 cursor-pointer"
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
