"use client";

import { useCart } from "./CartContext";

export default function CartToast() {
  const { notice } = useCart();

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] transition-all duration-300 ${
        notice ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-ink text-white text-sm font-display font-medium px-6 py-3.5 rounded-full shadow-soft flex items-center gap-2.5">
        <i className="fa-solid fa-circle-check text-primary" />
        {notice}
      </div>
    </div>
  );
}
