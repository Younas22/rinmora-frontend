"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { ApiError, getAccountOrders } from "@/lib/api";
import { useCurrency } from "@/components/currency/CurrencyContext";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import type { OrderDetail } from "@/types/checkout";
import type { PaginationMeta } from "@/types/storefront";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AccountOrdersPage() {
  const { token, loading: authLoading } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<OrderDetail[] | null>(null);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    (async () => {
      if (!token) {
        setLoading(false);
        setError("Please sign in to view your orders.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await getAccountOrders(token, { status: status || undefined, page });
        if (cancelled) return;
        setOrders(res.data);
        setMeta(res.meta);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Couldn't load your orders. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, authLoading, status, page]);

  return (
    <>
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45 mb-4">
          <Link href="/account" className="hover:text-ink transition">
            My Account
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-ink font-medium">My Orders</span>
        </nav>
        <h1 className="font-display text-3xl md:text-4xl font-semibold">My Orders</h1>
        <p className="text-black/50 text-sm md:text-base mt-2">Track, manage, and review your Rinmora purchases.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto snap-row -mx-5 px-5 md:mx-0 md:px-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={`snap-item shrink-0 font-display text-xs uppercase tracking-wide px-5 py-2.5 rounded-full transition ${
              status === tab.value ? "bg-ink text-white font-semibold" : "border border-black/10 hover:bg-black/5 font-medium"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-black/40 text-sm py-16">Loading orders…</p>}

      {!loading && error && (
        <section className="max-w-lg mx-auto py-16 text-center fade-up">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/15 grid place-items-center">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-primary-dark" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">Couldn&apos;t Load Orders</h2>
          <p className="text-black/50 text-sm mb-6">{error}</p>
          <Link
            href="/login"
            className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Sign In
          </Link>
        </section>
      )}

      {!loading && !error && orders && orders.length === 0 && (
        <section className="max-w-lg mx-auto py-16 text-center fade-up">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/15 grid place-items-center">
            <i className="fa-solid fa-box-open text-4xl text-primary-dark" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-black/50 text-sm mb-6">
            {status ? "No orders match this status yet." : "You haven't placed any orders with us yet."}
          </p>
          <Link
            href="/shop"
            className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Start Shopping
          </Link>
        </section>
      )}

      <div className="space-y-5">
        {orders?.map((order) => (
          <article key={order.order_number} className="bg-white rounded-3xl shadow-card p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-black/5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-black/50">
                <span>
                  <span className="text-black/35">Order</span>{" "}
                  <span className="font-display font-semibold text-ink">#{order.order_number}</span>
                </span>
                <span>
                  <span className="text-black/35">Placed</span>{" "}
                  <span className="font-medium text-black/70">
                    {new Date(order.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </span>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex -space-x-4 shrink-0">
                {order.items.slice(0, 3).map((item, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-card"
                  >
                    <Image
                      src={item.image_url ?? `https://picsum.photos/seed/order-item-${order.order_number}-${i}/160/160`}
                      alt={item.product_name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold">
                  {order.items[0]?.product_name}
                  {order.items.length > 1 && (
                    <span className="text-black/40 font-normal"> + {order.items.length - 1} more</span>
                  )}
                </p>
                <p className="text-black/45 text-xs mt-0.5">
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>
              <p className="font-display font-semibold text-base shrink-0">{formatPrice(order.total)}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-black/5">
              <Link
                href={`/account/orders/${order.order_number}`}
                className="font-display text-xs font-semibold uppercase tracking-wide border border-black/10 rounded-full px-4 py-2 hover:bg-black/5 transition"
              >
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {meta && meta.last_page > 1 && (
        <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === meta.current_page ? "page" : undefined}
              className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full grid place-items-center text-sm font-display transition ${
                p === meta.current_page
                  ? "bg-ink text-white font-semibold"
                  : "border border-black/10 hover:bg-black/5 font-medium"
              }`}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </>
  );
}
