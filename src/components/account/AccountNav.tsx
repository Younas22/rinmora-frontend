"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

const NAV_LINKS = [
  { href: "/account", label: "Dashboard", icon: "fa-solid fa-gauge" },
  { href: "/account/orders", label: "My Orders", icon: "fa-solid fa-bag-shopping" },
  { href: "/wishlist", label: "Wishlist", icon: "fa-regular fa-heart" },
  { href: "/account/addresses", label: "Addresses", icon: "fa-solid fa-location-dot" },
  { href: "/account/profile", label: "Profile & Settings", icon: "fa-regular fa-user" },
];

const MOBILE_LINKS = [
  { href: "/account", label: "Dashboard", icon: "fa-solid fa-gauge" },
  { href: "/account/orders", label: "Orders", icon: "fa-solid fa-bag-shopping" },
  { href: "/wishlist", label: "Wishlist", icon: "fa-regular fa-heart" },
  { href: "/account/profile", label: "Profile", icon: "fa-regular fa-user" },
];

export default function AccountNav() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (href: string) => (href === "/account" ? pathname === "/account" : pathname.startsWith(href));

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-28">
        <div className="bg-white rounded-3xl shadow-card p-4 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-display text-sm transition ${
                isActive(link.href)
                  ? "bg-primary/20 text-ink font-semibold"
                  : "text-black/60 hover:bg-black/5 font-medium"
              }`}
            >
              <i className={`${link.icon} w-4 text-center`} /> {link.label}
            </Link>
          ))}
          <div className="border-t border-black/5 my-2" />
          <button
            type="button"
            onClick={logout}
            className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-black/60 hover:bg-black/5 font-display text-sm font-medium transition"
          >
            <i className="fa-solid fa-right-from-bracket w-4 text-center" /> Logout
          </button>
        </div>
      </aside>

      <nav
        aria-label="Account navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/5 grid grid-cols-5"
      >
        {MOBILE_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center gap-1 py-3 transition ${
              isActive(link.href) ? "text-ink" : "text-black/45 hover:text-ink"
            }`}
          >
            <i className={`${link.icon} text-base`} />
            <span className="text-[10px] font-display font-medium">{link.label}</span>
          </Link>
        ))}
        <button
          type="button"
          onClick={logout}
          className="flex flex-col items-center justify-center gap-1 py-3 text-black/45 hover:text-ink transition"
        >
          <i className="fa-solid fa-right-from-bracket text-base" />
          <span className="text-[10px] font-display font-medium">Logout</span>
        </button>
      </nav>
    </>
  );
}
