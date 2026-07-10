"use client";

import { useState } from "react";
import { createRipple } from "@/lib/ripple";
import { subscribeToNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (new FormData(e.currentTarget).get("email") as string) ?? "";

    setStatus("loading");
    setError(null);

    try {
      await subscribeToNewsletter(email);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-16 md:py-24">
      <div className="relative rounded-4xl bg-ink text-white overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative px-8 py-14 md:py-20 text-center max-w-xl mx-auto">
          <h2 className="font-display text-2xl md:text-4xl font-semibold mb-3">Stay in Style</h2>
          <p className="text-white/60 mb-8 text-sm md:text-base">
            Subscribe for early access to new arrivals, private sales, and styling edits.
          </p>
          {status === "done" ? (
            <p className="font-display text-sm font-semibold text-primary">You&apos;re subscribed. Welcome to Rinmora!</p>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full text-ink text-sm outline-none focus:ring-2 focus:ring-primary bg-white"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                onClick={createRipple}
                className="btn-ripple shrink-0 bg-primary text-ink font-display font-semibold text-sm tracking-wide uppercase px-8 py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
              >
                {status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && error && <p className="text-red-300 text-xs mt-3">{error}</p>}
        </div>
      </div>
    </section>
  );
}
