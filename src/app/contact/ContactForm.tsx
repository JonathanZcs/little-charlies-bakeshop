"use client";

import { useState, useRef } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border border-parchment bg-cream px-4 py-3 text-sm text-mocha placeholder-brown/40 focus:outline-none focus:border-rose transition-colors";

const labelClass = "block text-xs tracking-widest uppercase text-brown mb-1.5 font-medium";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [photoNames, setPhotoNames] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", { method: "POST", body: data });
      setStatus(res.ok ? "sent" : "error");
      if (res.ok) {
        form.reset();
        setPhotoNames([]);
      }
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
          Thank you! We&apos;ll be in touch soon. Please note your order is{" "}
          <strong>not confirmed</strong> until we reach out and a deposit is received.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
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
            Pickup Date <span className="text-brown/40 normal-case tracking-normal text-xs font-light">(optional · 3 day min.)</span>
          </label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            min={(() => { const d = new Date(); d.setUTCDate(d.getUTCDate() + 3); return d.toISOString().split("T")[0]; })()}
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

      {/* Inspiration Photos */}
      <div>
        <label className={labelClass}>
          Inspiration Photos <span className="text-brown/40 normal-case tracking-normal text-xs font-light">(optional · up to 5 images)</span>
        </label>
        <div
          className="border border-dashed border-parchment bg-cream px-4 py-5 text-center cursor-pointer hover:border-rose transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            id="photos"
            name="photos"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.currentTarget.files ?? []).slice(0, 5);
              setPhotoNames(files.map((f) => f.name));
            }}
          />
          {photoNames.length > 0 ? (
            <div className="space-y-1">
              {photoNames.map((n) => (
                <p key={n} className="text-xs text-rose truncate">{n}</p>
              ))}
              <p className="text-xs text-brown/40 mt-2">Click to change</p>
            </div>
          ) : (
            <div>
              <svg className="w-6 h-6 text-parchment mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-xs text-brown/50">Click to upload inspiration photos</p>
              <p className="text-xs text-brown/30 mt-1">JPG, PNG, HEIC — up to 5 photos</p>
            </div>
          )}
        </div>
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
