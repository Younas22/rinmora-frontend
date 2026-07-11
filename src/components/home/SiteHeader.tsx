"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import AccountMenu from "./AccountMenu";

const NAV_LINKS = [
  { href: "/shop", label: "Shop", icon: "fa-bag-shopping" },
  { href: "/categories", label: "Categories", icon: "fa-grip" },
  { href: "/shop?sort=latest", label: "New Arrivals", icon: "fa-sparkles" },
  { href: "/about", label: "About", icon: "fa-circle-info" },
];

export default function SiteHeader({ logoUrl }: { logoUrl?: string | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const logoSrc = logoUrl || "/logo-01.png";
  const { user, logout } = useAuth();
  const { totalCount: cartCount } = useCart();
  const { items: wishlistItems } = useWishlist();

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header id="site-header" className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center h-16 md:h-20">
          <div className="flex items-center justify-self-start min-w-0">
            <button
              aria-label="Open menu"
              className="lg:hidden w-9 h-9 shrink-0 grid place-items-center rounded-full hover:bg-black/5 transition"
              onClick={() => setMenuOpen(true)}
            >
              <i className="fa-solid fa-bars text-base" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 font-display text-[13px] tracking-wide uppercase font-medium">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="group relative py-1.5">
                  {link.label}
                  <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-primary-dark transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <Link href="/" className="justify-self-center select-none shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="Rinmora" className="h-12 md:h-16 w-auto max-w-[190px] md:max-w-[230px] object-contain" />
          </Link>

          <div className="flex items-center justify-self-end gap-0.5 md:gap-1.5">
            <Link
              href="/search"
              aria-label="Search"
              className="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className="fa-solid fa-magnifying-glass text-[13px] md:text-[15px]" />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="hidden sm:grid relative w-9 h-9 md:w-10 md:h-10 place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className={`${wishlistItems.length > 0 ? "fa-solid text-primary-dark" : "fa-regular"} fa-heart text-[13px] md:text-[15px]`} />
              {wishlistItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping bag"
              className="relative w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
            >
              <i className="fa-solid fa-bag-shopping text-[13px] md:text-[15px]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <AccountMenu />
          </div>
        </div>
      </div>
    </header>

      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-colors duration-300 ${
          menuOpen ? "bg-black/50" : "bg-black/0 invisible pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 z-10 h-full w-[80%] max-w-xs bg-primary shadow-soft px-6 pt-6 pb-6 flex flex-col transition-transform duration-300 ease-out ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} alt="Rinmora" className="h-11 w-auto max-w-[150px] object-contain" />
            <button
              aria-label="Close menu"
              className="w-10 h-10 shrink-0 grid place-items-center rounded-full bg-white/40 hover:bg-white/70 transition"
              onClick={() => setMenuOpen(false)}
            >
              <i className="fa-solid fa-xmark text-lg" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
            <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-ink/40 mb-2.5 px-1">
              Menu
            </p>
            <div className="flex flex-col gap-2.5">
              {[{ href: "/", label: "Home", icon: "fa-house" }, ...NAV_LINKS].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 bg-white shadow-sm rounded-2xl px-5 py-3.5 font-display text-[15px] font-medium hover:bg-ink hover:text-white transition-colors"
                >
                  <i className={`fa-solid ${link.icon} w-4 text-primary-dark text-sm`} />
                  {link.label}
                </Link>
              ))}
            </div>

            <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-ink/40 mt-6 mb-2.5 px-1">
              Quick Links
            </p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 bg-white shadow-sm rounded-2xl py-3.5 hover:bg-ink hover:text-white transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass text-primary-dark text-sm" />
                <span className="font-display text-[11px] font-medium">Search</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="relative flex flex-col items-center gap-1.5 bg-white shadow-sm rounded-2xl py-3.5 hover:bg-ink hover:text-white transition-colors"
              >
                <i className="fa-solid fa-heart text-primary-dark text-sm" />
                <span className="font-display text-[11px] font-medium">Wishlist</span>
                {wishlistItems.length > 0 && (
                  <span className="absolute top-2 right-2.5 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                onClick={() => setMenuOpen(false)}
                className="relative flex flex-col items-center gap-1.5 bg-white shadow-sm rounded-2xl py-3.5 hover:bg-ink hover:text-white transition-colors"
              >
                <i className="fa-solid fa-bag-shopping text-primary-dark text-sm" />
                <span className="font-display text-[11px] font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2.5 bg-primary text-ink text-[10px] font-bold w-4 h-4 rounded-full grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <p className="text-[11px] font-display font-semibold uppercase tracking-wider text-ink/40 mt-6 mb-2.5 px-1">
              Account
            </p>
            <div className="flex flex-col gap-2.5">
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 bg-white shadow-sm rounded-2xl px-5 py-3.5 font-display text-[15px] font-medium hover:bg-ink hover:text-white transition-colors"
                  >
                    <i className="fa-solid fa-user w-4 text-primary-dark text-sm" />
                    My Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 text-left bg-white shadow-sm rounded-2xl px-5 py-3.5 font-display text-[15px] font-medium hover:bg-ink hover:text-white transition-colors"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-primary-dark text-sm" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 bg-ink text-white rounded-2xl px-5 py-3.5 font-display text-[15px] font-semibold hover:bg-black/80 transition-colors"
                >
                  <i className="fa-solid fa-right-to-bracket text-sm" />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-4 pt-5 mt-5 border-t border-black/10">
            <i className="fa-brands fa-instagram text-xl" />
            <i className="fa-brands fa-facebook text-xl" />
            <i className="fa-brands fa-tiktok text-xl" />
          </div>
        </div>
      </div>
    </>
  );
}
