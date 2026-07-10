import type { Metadata } from "next";
import ContactForm from "@/components/pages/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Rinmora",
  description: "Get in touch with the Rinmora team.",
};

export default function ContactPage() {
  return (
    <main className="pt-16 md:pt-20">
      <section className="relative overflow-hidden">
        <div className="relative max-w-3xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 text-center">
          <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
            Get In Touch
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3">We&apos;d Love to Hear From You</h1>
          <p className="text-black/50 text-sm md:text-base mt-3">
            Questions about an order, a product, or just want to say hello? Our team typically replies within 24
            hours.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 md:px-8 lg:px-10 pb-16 md:pb-24">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
          <ContactForm />

          <div className="space-y-5">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-display font-semibold text-sm mb-5">Store Information</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-envelope text-primary-dark mt-0.5" />
                  <span className="text-black/65">support@rinmora.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-phone text-primary-dark mt-0.5" />
                  <span className="text-black/65">+1 (555) 012-3456</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-regular fa-clock text-primary-dark mt-0.5" />
                  <span className="text-black/65">Mon – Sat: 9:00 AM – 7:00 PM</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot text-primary-dark mt-0.5" />
                  <span className="text-black/65">123 Rodeo Drive, Los Angeles, CA 90001</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-card p-6">
              <h3 className="font-display font-semibold text-sm mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
                >
                  <i className="fa-brands fa-instagram" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
                >
                  <i className="fa-brands fa-facebook-f" />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="w-10 h-10 rounded-full bg-black/[0.04] grid place-items-center hover:bg-primary transition"
                >
                  <i className="fa-brands fa-tiktok" />
                </a>
              </div>
            </div>

            <div className="bg-primary/15 rounded-3xl p-6">
              <h3 className="font-display font-semibold text-sm mb-3">Quick Answers</h3>
              <ul className="space-y-2 text-sm text-black/65">
                <li>
                  <a href="/faq" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> Where is my order?
                  </a>
                </li>
                <li>
                  <a href="/returns" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> How do I return an item?
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-ink transition inline-flex items-center gap-2">
                    <i className="fa-solid fa-arrow-right text-[10px]" /> What payment methods do you accept?
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
