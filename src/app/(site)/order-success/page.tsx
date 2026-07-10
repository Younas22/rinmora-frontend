"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { formatCurrency } from "@/lib/currency";
import { getOrder } from "@/lib/api";
import PaymentProofUploader from "@/components/shop/PaymentProofUploader";
import type { OrderDetail } from "@/types/checkout";

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="pt-16 md:pt-20">
          <p className="text-center text-black/40 text-sm py-24">Loading your order…</p>
        </main>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const orderNumber = searchParams.get("order") ?? "";
  const email = searchParams.get("email") ?? undefined;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderNumber) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setLoading(false);
      setNotFound(true);
      return;
    }

    getOrder(orderNumber, email, token ?? undefined)
      .then((data) => {
        if (!data) {
          setNotFound(true);
          return;
        }
        setOrder(data);
      })
      .finally(() => setLoading(false));
  }, [orderNumber, email, token]);

  if (loading) {
    return (
      <main className="pt-16 md:pt-20">
        <p className="text-center text-black/40 text-sm py-24">Loading your order…</p>
      </main>
    );
  }

  if (notFound || !order) {
    return (
      <main className="pt-16 md:pt-20">
        <section className="max-w-2xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <h1 className="font-display text-2xl font-semibold mb-3">Order Not Found</h1>
          <p className="text-black/50 text-sm mb-8">
            We couldn&apos;t find this order, or you don&apos;t have access to view it.
          </p>
          <Link
            href="/shop"
            className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Continue Shopping
          </Link>
        </section>
      </main>
    );
  }

  const isBankTransfer = order.payment?.method === "bank_transfer";

  return (
    <main className="pt-16 md:pt-20">
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-14 md:py-20 text-center fade-up">
        <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-7 rounded-full bg-primary/20 grid place-items-center">
          <i className="fa-solid fa-check text-3xl text-ink" />
        </div>

        <h1 className="font-display text-2xl md:text-4xl font-semibold mb-3">Thank You For Your Order!</h1>
        <p className="text-black/50 text-sm md:text-base mb-10">
          Your order has been successfully placed. A confirmation has been sent to your email.
        </p>

        <div className="bg-white rounded-3xl shadow-card p-6 md:p-8 text-left">
          <dl className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">
                Order Number
              </dt>
              <dd className="font-display font-semibold">#{order.order_number}</dd>
            </div>
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">Status</dt>
              <dd className="font-display font-semibold capitalize">{order.status}</dd>
            </div>
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">
                Shipping Address
              </dt>
              <dd className="font-medium text-black/70">
                {order.shipping_address.line1}
                {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}, {order.shipping_address.city}
                {order.shipping_address.zip ? ` ${order.shipping_address.zip}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-black/40 text-xs uppercase tracking-wide font-display font-medium mb-1">
                Payment Method
              </dt>
              <dd className="font-medium text-black/70">{order.payment?.method_name ?? "—"}</dd>
            </div>
            <div className="sm:col-span-2 pt-4 border-t border-black/5 flex items-baseline justify-between">
              <dt className="font-display font-semibold text-base">Order Total</dt>
              <dd className="font-display font-semibold text-xl">{formatCurrency(order.total)}</dd>
            </div>
          </dl>
        </div>

        {isBankTransfer && (
          <div className="mt-6">
            <PaymentProofUploader
              orderNumber={order.order_number}
              initialProofUrl={order.payment?.proof_url ?? null}
              email={email}
              token={token ?? undefined}
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/shop"
            className="btn-ripple w-full sm:w-auto bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
