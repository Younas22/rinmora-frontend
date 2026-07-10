"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AuthMinimalHeader from "@/components/auth/AuthMinimalHeader";
import PasswordField from "@/components/auth/PasswordField";
import { ApiError, registerCustomer } from "@/lib/api";
import { createRipple } from "@/lib/ripple";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading, setSession } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = await registerCustomer({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSession(payload.token, payload.user);
      router.replace("/");
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
            src="https://picsum.photos/seed/rinmora-register-lifestyle/900/1200"
            alt="Woman with a Rinmora handbag collection"
            fill
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <p className="font-display text-2xl font-semibold leading-snug">
              Join a community that values quality, craft, and confidence.
            </p>
            <p className="text-white/70 text-sm mt-2">— Welcome to Rinmora</p>
          </div>
        </div>

        <div className="flex items-center justify-center px-5 md:px-8 py-12 md:py-16">
          <div className="w-full max-w-sm fade-up">
            <div className="text-center mb-8">
              <span className="font-display text-xs tracking-[0.25em] uppercase text-primary-dark font-semibold">
                Join Rinmora
              </span>
              <h1 className="font-display text-2xl md:text-3xl font-semibold mt-2">Create Account</h1>
              <p className="text-black/50 text-sm mt-2">
                Create an account to enjoy faster checkout and exclusive member offers.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="regFirstName" className="block text-xs font-display font-medium text-black/50 mb-2">
                    First Name
                  </label>
                  <input
                    id="regFirstName"
                    type="text"
                    required
                    placeholder="Sana"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
                <div>
                  <label htmlFor="regLastName" className="block text-xs font-display font-medium text-black/50 mb-2">
                    Last Name
                  </label>
                  <input
                    id="regLastName"
                    type="text"
                    required
                    placeholder="Khan"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="regEmail" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Email Address
                </label>
                <input
                  id="regEmail"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div>
                <label htmlFor="regPhone" className="block text-xs font-display font-medium text-black/50 mb-2">
                  Phone Number
                </label>
                <input
                  id="regPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <PasswordField
                id="regPassword"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />

              <PasswordField
                id="regConfirmPassword"
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={passwordConfirmation}
                onChange={setPasswordConfirmation}
                autoComplete="new-password"
              />

              <label className="flex items-start gap-2.5 text-sm text-black/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5"
                />
                <span>
                  I agree to Rinmora&apos;s{" "}
                  <a href="#" className="font-medium text-ink underline underline-offset-2">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-ink underline underline-offset-2">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                onClick={createRipple}
                className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
              >
                {submitting ? "Creating Account…" : "Create Account"}
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
              Already have an account?{" "}
              <Link href="/login" className="font-display font-semibold text-ink hover:text-primary-dark transition">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
