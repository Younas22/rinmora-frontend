import type { Metadata } from "next";
import Link from "next/link";
import { getFaqs } from "@/lib/api";
import FaqAccordion from "@/components/pages/FaqAccordion";

export const metadata: Metadata = {
  title: "FAQ — Rinmora",
  description: "Frequently asked questions about Rinmora orders, shipping, returns, payments, and more.",
};

export default async function FaqPage() {
  const { data: faqs, categories } = await getFaqs();

  return (
    <main className="pt-16 md:pt-20">
      <section className="max-w-3xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-8 text-center">
        <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
          Support Center
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-semibold mt-3">Frequently Asked Questions</h1>
        <p className="text-black/50 text-sm md:text-base mt-3">Everything you need to know about shopping with Rinmora.</p>
      </section>

      <section className="max-w-4xl mx-auto px-5 md:px-8 pb-16 md:pb-20">
        <FaqAccordion faqs={faqs} categories={categories} />
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
        <div className="bg-ink text-white rounded-4xl px-6 md:px-10 py-10 md:py-14 text-center relative overflow-hidden">
          <div className="relative">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">Still Need Help?</h2>
            <p className="text-white/60 text-sm md:text-base mb-8 max-w-md mx-auto">
              Our support team is happy to help with anything not covered above.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-primary text-ink font-display font-semibold text-sm tracking-wide uppercase px-9 py-4 rounded-full hover:bg-primary-dark transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
