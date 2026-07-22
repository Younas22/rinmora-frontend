"use client";

import { useCart } from "./CartContext";

export default function CartToast() {
  const { notice } = useCart();

  return (
    <div
      className={`fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-[90] w-[calc(100%-2rem)] max-w-sm px-4 sm:w-auto sm:px-0 transition-all duration-300 ${
        notice ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-ink text-white text-sm font-display font-medium px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl sm:rounded-full shadow-soft flex items-center gap-2.5">
        <i className="fa-solid fa-circle-check text-primary shrink-0" />
        <span className="leading-snug">{notice}</span>
      </div>
    </div>
  );
}
