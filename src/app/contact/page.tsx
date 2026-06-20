import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Custom Orders",
  description:
    "Place a custom order with Little Charlie's Bakeshop. Inquire about custom cakes, decorated cookies, and special occasion treats in Cortland, Ohio.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-cream py-20 px-6 text-center relative">
        <div className="absolute inset-4 border border-parchment/40 pointer-events-none hidden sm:block" />
        <p className="text-rose/70 text-xs tracking-[0.4em] uppercase mb-2">
          Get in Touch
        </p>
        <p className="font-script text-5xl md:text-6xl text-rose mb-3">
          Contact Us
        </p>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="h-px w-12 bg-parchment" />
          <span className="text-parchment">&#10022;</span>
          <div className="h-px w-12 bg-parchment" />
        </div>
        <p className="text-brown max-w-md mx-auto font-light text-lg leading-relaxed">
          Have a question or ready to place a custom order? We&apos;d love to
          hear from you.
        </p>
      </section>

      <section className="py-16 px-6 bg-warm-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="font-serif text-xs uppercase tracking-widest text-rose mb-3">
                Phone
              </h3>
              <a
                href="tel:2342444104"
                className="text-mocha hover:text-rose transition-colors"
              >
                234-244-4104
              </a>
            </div>
            <div>
              <h3 className="font-serif text-xs uppercase tracking-widest text-rose mb-3">
                Email
              </h3>
              <a
                href="mailto:littlecharliesbakeshop@hotmail.com"
                className="text-mocha hover:text-rose transition-colors break-all"
              >
                littlecharliesbakeshop@hotmail.com
              </a>
            </div>
            <div>
              <h3 className="font-serif text-xs uppercase tracking-widest text-rose mb-3">
                Location
              </h3>
              <p className="text-brown">Cortland, Ohio</p>
            </div>
            <div>
              <h3 className="font-serif text-xs uppercase tracking-widest text-rose mb-3">
                Hours
              </h3>
              <div className="text-brown text-sm leading-7 space-y-1">
                <p>Tue &ndash; Fri</p>
                <p className="pl-3 text-brown/70">7:30AM &ndash; 9AM <span className="text-xs">drive-thru</span></p>
                <p className="pl-3 text-brown/70">9AM &ndash; 4PM <span className="text-xs">storefront</span></p>
                <p>Sat: 9AM &ndash; 2PM</p>
                <p>Sun &ndash; Mon: Closed</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
