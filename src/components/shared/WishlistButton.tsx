"use client";

import type { MouseEvent } from "react";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import type { Product } from "@/types/storefront";

export default function WishlistButton({
  product,
  className = "",
  iconClassName = "text-xs",
}: {
  product: Product;
  className?: string;
  iconClassName?: string;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(product.id);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={handleClick}
      className={className}
    >
      <i className={`${active ? "fa-solid text-primary-dark" : "fa-regular"} fa-heart ${iconClassName}`} />
    </button>
  );
}
