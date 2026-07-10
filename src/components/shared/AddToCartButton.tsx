"use client";

import { createRipple } from "@/lib/ripple";
import type { MouseEvent, ReactNode } from "react";

export default function AddToCartButton({
  className = "",
  children = "Add to Cart",
  onAdd,
  disabled = false,
}: {
  className?: string;
  children?: ReactNode;
  onAdd?: () => void;
  disabled?: boolean;
}) {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (disabled) return;
    createRipple(e);
    onAdd?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`btn-ripple ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}
