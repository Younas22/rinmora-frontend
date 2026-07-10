"use client";

import { useMemo, useState } from "react";
import type { Faq, FaqCategory } from "@/types/cms";

const CATEGORY_LABELS: Record<FaqCategory, string> = {
  orders: "Orders",
  shipping: "Shipping",
  returns: "Returns",
  payments: "Payments",
  products: "Products",
  account: "Account",
};

export default function FaqAccordion({ faqs, categories }: { faqs: Faq[]; categories: FaqCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<FaqCategory | null>(null);
  const [openId, setOpenId] = useState<number | null>(faqs[0]?.id ?? null);

  const visibleFaqs = useMemo(
    () => (activeCategory ? faqs.filter((faq) => faq.category === activeCategory) : faqs),
    [faqs, activeCategory]
  );

  return (
    <>
      <div className="flex gap-2 overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 md:flex-wrap md:justify-center">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 font-display text-xs font-semibold uppercase tracking-wide px-5 py-2.5 rounded-full transition ${
            activeCategory === null ? "bg-ink text-white" : "border border-black/10 hover:bg-black/5"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 font-display text-xs font-medium uppercase tracking-wide px-5 py-2.5 rounded-full transition ${
              activeCategory === category ? "bg-ink text-white" : "border border-black/10 hover:bg-black/5"
            }`}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <div className="space-y-4 mt-6">
        {visibleFaqs.length === 0 && (
          <p className="text-center text-black/45 text-sm py-10">No questions in this category yet.</p>
        )}
        {visibleFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-display text-sm md:text-base font-semibold">{faq.question}</span>
                <i
                  className={`fa-solid fa-chevron-down text-xs shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && <div className="px-6 pb-6 text-sm text-black/60 leading-relaxed">{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
