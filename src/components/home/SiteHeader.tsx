"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import AccountMenu from "./AccountMenu";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/shop?sort=latest", label: "New Arrivals" },
  { href: "/about", label: "About" },
];

export default function SiteHeader({ logoUrl }: { logoUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = logoUrl || "/logo-01.png";
  const { user, logout } = useAuth();
  const { totalCount: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header
      id="site-header"
      className="fixed top-0 inset-x-0 z-50 bg-primary border-b border-black/10 lg:bg-white/95 lg:backdrop-blur-md lg:border-black/5"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center gap-2">
            <button
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
              onClick={() => setMenuOpen(true)}
            >
              <i className="fa-solid fa-bars text-lg" />
            </button>

            <nav className="hidden lg:flex items-center gap-8 font-display text-[13px] tracking-wide uppercase font-medium">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-primary-dark transition">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="Rinmora" className="h-14 md:h-20 w-auto" />
          </Link>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="w-10 h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className="fa-solid fa-magnifying-glass text-[15px]" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:grid relative w-10 h-10 place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className={`${wishlistItems.length > 0 ? "fa-solid text-primary-dark" : "fa-regular"} fa-heart text-[15px]`} />
              <span className="absolute top-1 right-1 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                {wishlistItems.length}
              </span>
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className="fa-solid fa-bag-shopping text-[15px]" />
              <span className="absolute top-1 right-1 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                {cartCount}
              </span>
            </Link>
            <AccountMenu />
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-colors duration-300 ${
          menuOpen ? "bg-black/50" : "bg-black/0 invisible pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 z-10 h-full w-[80%] max-w-xs bg-primary shadow-soft px-7 pt-7 pb-10 flex flex-col gap-1 transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="Rinmora" className="h-12 w-auto" />
            <button
              aria-label="Close menu"
              className="w-10 h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { href: "/", label: "Home" },
              ...NAV_LINKS,
              { href: "/search", label: "Search" },
              { href: "/wishlist", label: "Wishlist" },
              { href: "/cart", label: "Cart" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="bg-white shadow-sm rounded-2xl px-5 py-4 font-display text-base font-medium hover:bg-ink hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="bg-white shadow-sm rounded-2xl px-5 py-4 font-display text-base font-medium hover:bg-ink hover:text-white transition-colors"
                >
                  My Account
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="text-left bg-white shadow-sm rounded-2xl px-5 py-4 font-display text-base font-medium hover:bg-ink hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="bg-white shadow-sm rounded-2xl px-5 py-4 font-display text-base font-medium hover:bg-ink hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="mt-auto flex items-center gap-4 pt-6">
            <i className="fa-brands fa-instagram text-xl" />
            <i className="fa-brands fa-facebook text-xl" />
            <i className="fa-brands fa-tiktok text-xl" />
          </div>
        </div>
      </div>
    </header>
  );
}
