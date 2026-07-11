"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { getAccountOrder } from "@/lib/api";
import { useCurrency } from "@/components/currency/CurrencyContext";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import PaymentProofUploader from "@/components/shop/PaymentProofUploader";
import type { OrderDetail } from "@/types/checkout";

export default function AccountOrderDetailPage() {
  const params = useParams<{ number: string }>();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    getAccountOrder(token, params.number)
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setOrder(data);
      })
      .finally(() => setLoading(false));
  }, [token, params.number]);

  if (loading) {
    return <p className="text-center text-black/40 text-sm py-16">Loading order…</p>;
  }

  if (notFound || !order) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="font-display text-xl font-semibold mb-3">Order Not Found</h1>
        <p className="text-black/50 text-sm mb-6">This order doesn&apos;t exist or doesn&apos;t belong to your account.</p>
        <Link
          href="/account/orders"
          className="font-display text-sm font-semibold uppercase tracking-wide border border-black/10 rounded-full px-6 py-3 hover:bg-black/5 transition"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const isBankTransfer = order.payment?.method === "bank_transfer";
  const showProofUploader = isBankTransfer && order.payment?.status !== "success";

  return (
    <>
      <div>
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs md:text-sm text-black/45 mb-4">
          <Link href="/account" className="hover:text-ink transition">
            My Account
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <Link href="/account/orders" className="hover:text-ink transition">
            My Orders
          </Link>
          <i className="fa-solid fa-chevron-right text-[9px]" />
          <span className="text-ink font-medium">#{order.order_number}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl md:text-3xl font-semibold">#{order.order_number}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-black/50 text-sm mt-2">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-8 lg:items-start space-y-8 lg:space-y-0">
        <div className="space-y-6 min-w-0">
          <div className="bg-white rounded-3xl shadow-card p-5 md:p-6">
            <h2 className="font-display font-semibold text-sm mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/5 shrink-0">
                    <Image
                      src={item.image_url ?? `https://picsum.photos/seed/order-item-${order.order_number}-${i}/160/160`}
                      alt={item.product_name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product_name}</p>
                    {item.variant_label && <p className="text-black/45 text-xs">{item.variant_label}</p>}
                  </div>
                  <p className="text-black/50 text-sm shrink-0">Qty {item.quantity}</p>
                  <p className="text-sm font-semibold shrink-0 w-20 text-right">{formatPrice(item.line_total)}</p>
                  {order.status === "delivered" && item.product_slug && (
                    <Link
                      href={`/products/${item.product_slug}#reviews`}
                      className="text-xs font-display font-semibold uppercase tracking-wide shrink-0 whitespace-nowrap px-3 py-2 rounded-full border border-black/10 hover:bg-black/5 transition"
                    >
                      {item.already_reviewed ? "Edit Review" : "Rate this product"}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {order.events && order.events.length > 0 && (
            <div className="bg-white rounded-3xl shadow-card p-5 md:p-6">
              <h2 className="font-display font-semibold text-sm mb-5">Order Timeline</h2>
              <ol className="relative border-l border-black/10 ml-2 space-y-6">
                {order.events.map((event, i) => (
                  <li key={i} className="ml-4">
                    <span
                      className={`absolute -left-[5px] w-2.5 h-2.5 rounded-full ${
                        i === 0 ? "bg-primary-dark" : "bg-black/20"
                      }`}
                    />
                    <p className="text-sm font-medium">{event.title}</p>
                    {event.description && <p className="text-black/45 text-xs">{event.description}</p>}
                    <p className="text-black/40 text-xs">
                      {new Date(event.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {showProofUploader && (
            <PaymentProofUploader
              orderNumber={order.order_number}
              initialProofUrl={order.payment?.proof_url ?? null}
              token={token ?? undefined}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-card p-5 md:p-6">
            <h2 className="font-display font-semibold text-sm mb-3">Shipping Address</h2>
            <p className="text-black/60 text-sm leading-relaxed">
              {order.shipping_address.name}
              <br />
              {order.shipping_address.line1}
              {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}
              <br />
              {order.shipping_address.city}
              {order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}{" "}
              {order.shipping_address.zip ?? ""}
              <br />
              {order.shipping_address.country}
              {order.shipping_address.phone && (
                <>
                  <br />
                  {order.shipping_address.phone}
                </>
              )}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-card p-5 md:p-6">
            <h2 className="font-display font-semibold text-sm mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black/50">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black/50">Shipping</span>
                <span>{formatPrice(order.shipping_amount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-black/5">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
            {order.payment && (
              <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                <p className="text-black/45 text-xs">{order.payment.method_name}</p>
                <span
                  className={`text-[10px] font-display font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    order.payment.status === "success"
                      ? "bg-green-600/10 text-green-700"
                      : "bg-primary/20 text-primary-dark"
                  }`}
                >
                  {order.payment.status === "success" ? "Paid" : "Pending"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
