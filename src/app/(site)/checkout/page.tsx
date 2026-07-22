"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { useCart } from "@/components/cart/CartContext";
import { useCurrency } from "@/components/currency/CurrencyContext";
import { ApiError, createOrder, getAddresses, getCheckoutOptions, subscribeToNewsletter } from "@/lib/api";
import { createRipple } from "@/lib/ripple";
import type { Address } from "@/types/account";
import type { CheckoutOptions, CreateOrderPayload } from "@/types/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
  const { items, hydrated, subtotal, clear } = useCart();
  const { formatPrice } = useCurrency();

  const [options, setOptions] = useState<CheckoutOptions | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  const [shippingMethodId, setShippingMethodId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");

  const [billingSame, setBillingSame] = useState(true);
  const [billFirstName, setBillFirstName] = useState("");
  const [billLastName, setBillLastName] = useState("");
  const [billStreet, setBillStreet] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billZip, setBillZip] = useState("");
  const [billCountry, setBillCountry] = useState("");

  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (hydrated && items.length === 0 && !orderPlacedRef.current) {
      router.replace("/cart");
    }
  }, [hydrated, items, router]);

  const [optionsAttempt, setOptionsAttempt] = useState(0);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  useEffect(() => {
    getCheckoutOptions()
      .then((opts) => {
        setOptionsError(null);
        setOptions(opts);
        if (opts.shipping_methods.length > 0) setShippingMethodId(opts.shipping_methods[0].id);
        if (opts.payment_methods.length > 0) setPaymentMethod(opts.payment_methods[0].code);
      })
      .catch(() => {
        setOptionsError("We couldn't load shipping and payment options. Please check your connection and retry.");
      });
  }, [optionsAttempt]);

  useEffect(() => {
    // Prefilling the form from the auth context once it resolves (asynchronously,
    // after AuthProvider's own token check) — this is external state syncing into
    // form defaults, not derived render state.
    if (!user) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setEmail(user.email);
    setPhone(user.phone ?? "");
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setShippingPhone(user.phone ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [user]);

  const applyAddress = (address: Address) => {
    const [addrFirst, ...addrRest] = address.recipient_name.split(" ");
    setFirstName(addrFirst ?? "");
    setLastName(addrRest.join(" "));
    setCountry(address.country);
    setStateRegion(address.state ?? "");
    setCity(address.city);
    setZip(address.zip ?? "");
    setStreet(address.address_line1);
    setApartment(address.address_line2 ?? "");
    setShippingPhone(address.phone ?? "");
    setSelectedAddressId(address.id);
  };

  useEffect(() => {
    if (!token) return;
    getAddresses(token)
      .then((addresses) => {
        setSavedAddresses(addresses);
        const defaultShipping = addresses.find((a) => a.type === "shipping" && a.is_default) ?? addresses[0];
        if (defaultShipping) applyAddress(defaultShipping);
      })
      .catch(() => {});
  }, [token]);

  const selectedShippingMethod = options?.shipping_methods.find((m) => m.id === shippingMethodId);
  const shippingAmount = selectedShippingMethod?.rate ?? 0;
  const total = subtotal + shippingAmount;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!shippingMethodId) {
      setError("Please select a shipping method.");
      return;
    }

    setSubmitting(true);

    const fullName = `${firstName} ${lastName}`.trim();

    const payload: CreateOrderPayload = {
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone || undefined,
      shipping_name: fullName,
      shipping_address_line1: street,
      shipping_address_line2: apartment || undefined,
      shipping_city: city,
      shipping_state: stateRegion || undefined,
      shipping_zip: zip || undefined,
      shipping_country: country,
      shipping_phone: shippingPhone || undefined,
      billing_same_as_shipping: billingSame,
      billing_name: billingSame ? undefined : `${billFirstName} ${billLastName}`.trim(),
      billing_address_line1: billingSame ? undefined : billStreet,
      billing_city: billingSame ? undefined : billCity,
      billing_zip: billingSame ? undefined : billZip,
      billing_country: billingSame ? undefined : billCountry,
      shipping_method_id: shippingMethodId,
      payment_method: paymentMethod,
      note: note || undefined,
      items: items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variant?.id ?? null,
        qty: item.qty,
      })),
    };

    try {
      const result = await createOrder(payload, token ?? undefined);

      if (newsletterOptIn && email) {
        subscribeToNewsletter(email).catch(() => {});
      }

      orderPlacedRef.current = true;
      clear();
      router.push(`/order-success?order=${result.order_number}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      if (err instanceof ApiError && err.unavailableItems && err.unavailableItems.length > 0) {
        setError(
          "Some items in your cart are no longer available in the quantity requested. Please review your cart and try again."
        );
      } else {
        setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="pt-20 md:pt-28 max-w-7xl mx-auto px-5 md:px-8 lg:px-10 pb-10 md:pb-14">
      <div className="flex items-center justify-center gap-2 md:gap-4 mb-10 md:mb-14">
        <div className="flex items-center gap-2 text-black/35">
          <span className="w-7 h-7 rounded-full border border-black/15 grid place-items-center text-[11px] font-display font-medium">
            1
          </span>
          <span className="hidden sm:inline text-xs md:text-sm font-display font-medium">Shopping Cart</span>
        </div>
        <i className="fa-solid fa-chevron-right text-[10px] text-black/20" />
        <div className="flex items-center gap-2 text-ink">
          <span className="w-7 h-7 rounded-full bg-primary grid place-items-center text-[11px] font-display font-semibold">
            2
          </span>
          <span className="text-xs md:text-sm font-display font-semibold">Checkout</span>
        </div>
        <i className="fa-solid fa-chevron-right text-[10px] text-black/20" />
        <div className="flex items-center gap-2 text-black/35">
          <span className="w-7 h-7 rounded-full border border-black/15 grid place-items-center text-[11px] font-display font-medium">
            3
          </span>
          <span className="hidden sm:inline text-xs md:text-sm font-display font-medium">Order Confirmation</span>
        </div>
      </div>

      <div className="text-center max-w-lg mx-auto mb-10 md:mb-14">
        <h1 className="font-display text-3xl md:text-4xl font-semibold">Secure Checkout</h1>
        <p className="text-black/50 text-sm md:text-base mt-2">Complete your order in just a few simple steps.</p>
      </div>

      <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
        <div className="lg:order-2 bg-white rounded-3xl shadow-card overflow-hidden mb-8 lg:mb-0 lg:sticky lg:top-28">
          <div className="px-6 py-7 lg:p-7">
            <h2 className="font-display text-lg font-semibold mb-6">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}:${item.variant?.id ?? "base"}`} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative">
                    <Image
                      src={item.imageUrl ?? `https://picsum.photos/seed/product-${item.productId}/200/200`}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-medium truncate">{item.name}</p>
                    <p className="text-black/45 text-xs mt-0.5">
                      {item.variant ? `${item.variant.label} · ` : ""}Qty {item.qty}
                    </p>
                  </div>
                  <p className="font-display text-sm font-semibold shrink-0">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 my-6" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-black/55">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-black/55">Shipping</dt>
                <dd className="font-medium">{shippingAmount > 0 ? formatPrice(shippingAmount) : "Free"}</dd>
              </div>
            </dl>

            <div className="border-t border-black/10 my-6" />

            <div className="flex justify-between items-baseline mb-7">
              <span className="font-display font-semibold text-base">Grand Total</span>
              <span className="font-display font-semibold text-2xl">{formatPrice(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-black/60 mb-7">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-shield-halved text-primary-dark" /> 100% Secure
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-lock text-primary-dark" /> SSL Encrypted
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-rotate-left text-primary-dark" /> Easy Returns
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-money-bill-wave text-primary-dark" /> Cash on Delivery
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                {error}{" "}
                <Link href="/cart" className="underline font-semibold">
                  Review Cart
                </Link>
              </p>
            )}

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              onClick={createRipple}
              className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
            >
              {submitting ? "Placing Order…" : "Place Order Securely"}
            </button>

            <p className="flex items-center justify-center gap-2 text-[11px] text-black/45 mt-4">
              <i className="fa-solid fa-lock" />
              Your information is protected with industry-standard encryption.
            </p>
          </div>
        </div>

        <form id="checkout-form" className="lg:order-1 space-y-6" onSubmit={handleSubmit}>
          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-6">Contact Information</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Phone Number
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>
            <label className="flex items-center gap-3 mt-5 text-sm text-black/60 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletterOptIn}
                onChange={(e) => setNewsletterOptIn(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Email me about new arrivals and exclusive offers.
            </label>
          </section>

          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-6">Shipping Address</h2>

            {savedAddresses.length > 0 && (
              <div className="mb-6">
                <label htmlFor="savedAddress" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Use a Saved Address
                </label>
                <select
                  id="savedAddress"
                  value={selectedAddressId}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setSelectedAddressId("new");
                      return;
                    }
                    const found = savedAddresses.find((a) => a.id === Number(e.target.value));
                    if (found) applyAddress(found);
                  }}
                  className="w-full appearance-none px-5 py-3.5 rounded-xl border border-black/10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
                >
                  {savedAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {address.recipient_name} — {address.address_line1}, {address.city}
                      {address.is_default ? " (Default)" : ""}
                    </option>
                  ))}
                  <option value="new">Enter a new address</option>
                </select>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firstName" className="block text-xs font-display font-medium text-black/50 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sana"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Khan"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-xs font-display font-medium text-black/50 mb-2">
                  State / Province
                </label>
                <input
                  id="state"
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="California"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-display font-medium text-black/50 mb-2">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Los Angeles"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-xs font-display font-medium text-black/50 mb-2">
                  ZIP / Postal Code
                </label>
                <input
                  id="zip"
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="90001"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="street" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Street Address
                </label>
                <input
                  id="street"
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="123 Rodeo Drive"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="apartment" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Apartment / Suite <span className="text-black/30">(Optional)</span>
                </label>
                <input
                  id="apartment"
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Apt, suite, unit"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="shippingPhone" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Phone Number
                </label>
                <input
                  id="shippingPhone"
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>
            </div>
          </section>

          {optionsError && (
            <section className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8 text-center">
              <p className="text-red-700 text-sm mb-4">{optionsError}</p>
              <button
                type="button"
                onClick={() => setOptionsAttempt((n) => n + 1)}
                className="font-display text-xs font-semibold uppercase tracking-wide bg-ink text-white rounded-full px-5 py-2.5 hover:bg-black/80 transition"
              >
                Retry
              </button>
            </section>
          )}

          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-6">Shipping Method</h2>
            <div className="space-y-3">
              {options?.shipping_methods.map((method) => (
                <label
                  key={method.id}
                  className="flex items-center gap-4 rounded-2xl border border-black/10 has-[:checked]:border-primary-dark has-[:checked]:bg-primary/10 px-5 py-4 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethodId === method.id}
                    onChange={() => setShippingMethodId(method.id)}
                    className="peer sr-only"
                  />
                  <span className="w-4 h-4 rounded-full border-2 border-black/20 peer-checked:border-primary-dark peer-checked:bg-primary-dark shrink-0 transition" />
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-sm font-semibold">
                        {method.name} <span className="text-black/40 font-normal">({method.zone_name})</span>
                      </p>
                      <p className="text-black/45 text-xs mt-0.5">{method.delivery_time}</p>
                    </div>
                    <span className="font-display text-sm font-semibold shrink-0">
                      {method.rate > 0 ? formatPrice(method.rate) : "Free"}
                    </span>
                  </div>
                </label>
              ))}
              {options && options.shipping_methods.length === 0 && (
                <p className="text-black/40 text-sm">No shipping methods are configured yet.</p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-6">Payment Method</h2>
            <div className="space-y-3">
              {options?.payment_methods.map((method) => (
                <label
                  key={method.code}
                  className="flex items-center gap-4 rounded-2xl border border-black/10 has-[:checked]:border-primary-dark has-[:checked]:bg-primary/10 px-5 py-4 cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method.code}
                    onChange={() => setPaymentMethod(method.code)}
                    className="peer sr-only"
                  />
                  <span className="w-4 h-4 rounded-full border-2 border-black/20 peer-checked:border-primary-dark peer-checked:bg-primary-dark shrink-0 transition" />
                  <div className="flex-1 flex items-center justify-between gap-4">
                    <p className="font-display text-sm font-semibold">{method.name}</p>
                    <i
                      className={`text-lg text-black/40 shrink-0 ${
                        method.code === "cod" ? "fa-solid fa-money-bill-wave" : "fa-solid fa-building-columns"
                      }`}
                    />
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === "bank_transfer" && options && options.bank_accounts.length > 0 && (
              <div className="mt-6 pt-6 border-t border-black/5 space-y-4">
                <p className="text-sm text-black/60">
                  Transfer the total amount to one of the accounts below. You&apos;ll upload your payment screenshot
                  right after placing the order.
                </p>
                {options.bank_accounts.map((account) => (
                  <div key={account.id} className="bg-black/[0.02] rounded-2xl p-5 text-sm">
                    <p className="font-display font-semibold mb-1">{account.bank_name}</p>
                    <p className="text-black/60">Account Title: {account.account_title}</p>
                    <p className="text-black/60">Account Number: {account.account_number}</p>
                    {account.iban && <p className="text-black/60">IBAN: {account.iban}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-5">Billing Address</h2>
            <label className="flex items-center gap-3 text-sm text-black/60 cursor-pointer">
              <input
                type="checkbox"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Billing address is same as shipping address.
            </label>

            {!billingSame && (
              <div className="grid sm:grid-cols-2 gap-5 mt-6 pt-6 border-t border-black/5">
                <div>
                  <label htmlFor="billFirstName" className="block text-xs font-display font-medium text-black/50 mb-2">
                    First Name
                  </label>
                  <input
                    id="billFirstName"
                    type="text"
                    required
                    value={billFirstName}
                    onChange={(e) => setBillFirstName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="billLastName" className="block text-xs font-display font-medium text-black/50 mb-2">
                    Last Name
                  </label>
                  <input
                    id="billLastName"
                    type="text"
                    required
                    value={billLastName}
                    onChange={(e) => setBillLastName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="billStreet" className="block text-xs font-display font-medium text-black/50 mb-2">
                    Street Address
                  </label>
                  <input
                    id="billStreet"
                    type="text"
                    required
                    value={billStreet}
                    onChange={(e) => setBillStreet(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="billCity" className="block text-xs font-display font-medium text-black/50 mb-2">
                    City
                  </label>
                  <input
                    id="billCity"
                    type="text"
                    required
                    value={billCity}
                    onChange={(e) => setBillCity(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="billZip" className="block text-xs font-display font-medium text-black/50 mb-2">
                    ZIP / Postal Code
                  </label>
                  <input
                    id="billZip"
                    type="text"
                    value={billZip}
                    onChange={(e) => setBillZip(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="billCountry" className="block text-xs font-display font-medium text-black/50 mb-2">
                    Country
                  </label>
                  <input
                    id="billCountry"
                    type="text"
                    required
                    value={billCountry}
                    onChange={(e) => setBillCountry(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            )}
          </section>

          <section className="bg-white rounded-3xl shadow-card p-6 md:p-8">
            <h2 className="font-display text-lg font-semibold mb-5">
              Order Notes <span className="text-black/35 font-normal text-sm">(Optional)</span>
            </h2>
            <label htmlFor="orderNotes" className="sr-only">
              Order notes
            </label>
            <textarea
              id="orderNotes"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add delivery instructions..."
              className="w-full px-5 py-4 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
            />
          </section>

          <div className="lg:hidden">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              onClick={createRipple}
              className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
            >
              {submitting ? "Placing Order…" : "Place Order Securely"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
