"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { useWishlist } from "@/components/wishlist/WishlistContext";
import { getAccountSummary, getProducts } from "@/lib/api";
import { formatCurrency } from "@/lib/currency";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import type { AccountSummary } from "@/types/account";
import type { Product } from "@/types/storefront";

export default function AccountDashboardPage() {
  const { user, token } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [recommended, setRecommended] = useState<Product[]>([]);

  useEffect(() => {
    if (!token) return;
    getAccountSummary(token).then(setSummary);
  }, [token]);

  useEffect(() => {
    getProducts({ sort: "popular", per_page: 4 })
      .then((res) => setRecommended(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45">
        <Link href="/" className="hover:text-ink transition">
          Home
        </Link>
        <i className="fa-solid fa-chevron-right text-[9px]" />
        <span className="text-ink font-medium">My Account</span>
      </nav>

      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold">Hello, {user?.first_name} 👋</h1>
        <p className="text-black/50 text-sm md:text-base mt-1">Welcome back to Rinmora.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 grid place-items-center mb-3">
            <i className="fa-solid fa-bag-shopping text-primary-dark text-sm" />
          </div>
          <p className="font-display text-2xl font-semibold">{summary?.counts.orders_total ?? "—"}</p>
          <p className="text-black/45 text-xs mt-0.5">Total Orders</p>
        </div>
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 grid place-items-center mb-3">
            <i className="fa-regular fa-heart text-primary-dark text-sm" />
          </div>
          <p className="font-display text-2xl font-semibold">{wishlistItems.length}</p>
          <p className="text-black/45 text-xs mt-0.5">Wishlist Items</p>
        </div>
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 grid place-items-center mb-3">
            <i className="fa-solid fa-gem text-primary-dark text-sm" />
          </div>
          <p className="font-display text-2xl font-semibold">{summary?.reward_points ?? "—"}</p>
          <p className="text-black/45 text-xs mt-0.5">Reward Points</p>
        </div>
        <div className="bg-white rounded-3xl shadow-card p-5">
          <div className="w-10 h-10 rounded-full bg-primary/20 grid place-items-center mb-3">
            <i className="fa-solid fa-location-dot text-primary-dark text-sm" />
          </div>
          <p className="font-display text-2xl font-semibold">{summary?.counts.addresses_count ?? "—"}</p>
          <p className="text-black/45 text-xs mt-0.5">Saved Addresses</p>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="font-display text-xs font-semibold uppercase tracking-wide text-black/50 hover:text-ink transition"
          >
            View All
          </Link>
        </div>

        {summary && summary.recent_orders.length === 0 && (
          <p className="bg-white rounded-3xl shadow-card p-6 text-center text-black/45 text-sm">
            You haven&apos;t placed any orders yet.
          </p>
        )}

        <div className="space-y-4">
          {summary?.recent_orders.map((order) => (
            <div
              key={order.order_number}
              className="bg-white rounded-3xl shadow-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image
                  src={order.items[0]?.image_url ?? `https://picsum.photos/seed/order-${order.order_number}/160/160`}
                  alt={order.items[0]?.product_name ?? "Order"}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold">
                  #{order.order_number} <OrderStatusBadge status={order.status} />
                </p>
                <p className="text-black/45 text-xs mt-1">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"} · {formatCurrency(order.total)} ·{" "}
                  {new Date(order.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <Link
                href={`/account/orders/${order.order_number}`}
                className="shrink-0 font-display text-xs font-semibold uppercase tracking-wide border border-black/10 rounded-full px-4 py-2.5 hover:bg-black/5 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>

      {wishlistItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Wishlist</h2>
            <Link
              href="/wishlist"
              className="font-display text-xs font-semibold uppercase tracking-wide text-black/50 hover:text-ink transition"
            >
              View All
            </Link>
          </div>
          <div className="flex gap-4 md:gap-5 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0">
            {wishlistItems.slice(0, 6).map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="snap-item shrink-0 w-44 md:w-48 bg-white rounded-3xl shadow-card overflow-hidden"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image_url ?? `https://picsum.photos/seed/product-${product.id}/300/300`}
                    alt={product.name}
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5">
                  <p className="font-display text-xs font-medium truncate">{product.name}</p>
                  <p className="text-black/50 text-xs mt-0.5">{formatCurrency(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Personal Information</h2>
        <div className="bg-white rounded-3xl shadow-card p-6 md:p-7">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-sm text-black/45">Manage your account details</span>
            <Link
              href="/account/profile"
              className="font-display text-xs font-semibold uppercase tracking-wide border border-black/10 rounded-full px-4 py-2 hover:bg-black/5 transition"
            >
              Edit Profile
            </Link>
          </div>
          <dl className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">Name</dt>
              <dd className="font-medium">{user?.full_name}</dd>
            </div>
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">Email</dt>
              <dd className="font-medium">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">Phone</dt>
              <dd className="font-medium">{user?.phone ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      {recommended.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold mb-4">Recommended For You</h2>
          <div className="flex gap-4 md:gap-5 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0">
            {recommended.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="snap-item shrink-0 w-44 md:w-52 bg-white rounded-3xl shadow-card overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={product.image_url ?? `https://picsum.photos/seed/product-${product.id}/320/400`}
                    alt={product.name}
                    fill
                    sizes="208px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3.5">
                  <p className="font-display text-xs font-medium truncate">{product.name}</p>
                  <p className="text-black/50 text-xs mt-0.5">{formatCurrency(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
