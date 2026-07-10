"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthMinimalHeader from "@/components/auth/AuthMinimalHeader";
import PasswordField from "@/components/auth/PasswordField";
import { ApiError, loginCustomer } from "@/lib/api";
import { createRipple } from "@/lib/ripple";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <>
          <AuthMinimalHeader backHref="/shop" backLabel="Back to Shop" />
          <main className="min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16">
            <p className="text-center text-black/40 text-sm">Loading…</p>
          </main>
        </>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, setSession } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, user, redirectTo, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = await loginCustomer(email, password);
      setSession(payload.token, payload.user);
      router.replace(redirectTo);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthMinimalHeader backHref="/shop" backLabel="Back to Shop" />

      <main className="lg:grid lg:grid-cols-2 min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-80px)]">
        <div className="hidden lg:block relative">
          <Image
            src="https://picsum.photos/seed/rinmora-login-lifestyle/900/1200"
            alt="Woman carrying a Rinmora handbag"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="font-display text-2xl font-semibold leading-snug">
              &ldquo;Elegance you can carry, every day.&rdquo;
            </p>
            <p className="text-white/70 text-sm mt-2">— The Rinmora Woman</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 md:px-8 py-12 md:py-16">
          <div className="w-full max-w-sm fade-up">
            <div className="text-center mb-9">
              <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
                Welcome Back
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-semibold mt-2">Sign In</h1>
              <p className="text-black/50 text-sm mt-2">
                Sign in to track orders, manage your wishlist, and enjoy a faster checkout.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <div>
                <label htmlFor="loginEmail" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Email Address
                </label>
                <input
                  id="loginEmail"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <PasswordField
                id="loginPassword"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={setPassword}
                autoComplete="current-password"
              />

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2.5 text-black/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  Remember Me
                </label>
                <Link href="/forgot-password" className="font-medium text-black/60 hover:text-ink transition">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                onClick={createRipple}
                className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
              >
                {submitting ? "Signing In…" : "Sign In"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-7">
              <div className="h-px flex-1 bg-black/10" />
              <span className="text-xs font-display font-medium text-black/40 uppercase tracking-wide">Or</span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 border border-black/10 rounded-full py-3.5 text-sm font-display font-medium text-black/40 cursor-not-allowed"
              >
                <i className="fa-brands fa-google text-base" /> Continue with Google
              </button>
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 border border-black/10 rounded-full py-3.5 text-sm font-display font-medium text-black/40 cursor-not-allowed"
              >
                <i className="fa-brands fa-facebook text-base" /> Continue with Facebook
              </button>
            </div>

            <p className="text-center text-sm text-black/55 mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-display font-semibold text-ink hover:text-primary-dark transition">
                Create Account
              </Link>
            </p>

            <p className="flex items-center justify-center gap-2 text-[11px] text-black/40 mt-8">
              <i className="fa-solid fa-lock" />
              Your information is protected with industry-standard encryption.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
