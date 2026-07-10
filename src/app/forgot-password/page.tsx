"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import AuthMinimalHeader from "@/components/auth/AuthMinimalHeader";
import { forgotPassword } from "@/lib/api";
import { createRipple } from "@/lib/ripple";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resendLabel, setResendLabel] = useState("Resend Link");

  const sendResetLink = async (targetEmail: string) => {
    setSubmitting(true);
    try {
      await forgotPassword(targetEmail);
      setSentTo(targetEmail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendResetLink(email);
  };

  const handleResend = async () => {
    if (!sentTo) return;
    await sendResetLink(sentTo);
    setResendLabel("Link Resent ✓");
    setTimeout(() => setResendLabel("Resend Link"), 2500);
  };

  return (
    <>
      <AuthMinimalHeader backHref="/login" backLabel="Back to Sign In" />

      <main className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md fade-up">
          {!sentTo ? (
            <div className="bg-white rounded-3xl shadow-card p-7 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 grid place-items-center">
                <i className="fa-solid fa-key text-xl text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Forgot Your Password?</h1>
              <p className="text-black/50 text-sm mb-8">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>

              <form className="space-y-5 text-left" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="resetEmail" className="block text-xs font-display font-medium text-black/50 mb-2">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  onClick={createRipple}
                  className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-7 font-display text-xs font-semibold uppercase tracking-wide text-black/55 hover:text-ink transition"
              >
                <i className="fa-solid fa-arrow-left text-[10px]" /> Back to Login
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-card p-7 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 grid place-items-center">
                <i className="fa-solid fa-envelope-circle-check text-xl text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Check Your Email</h1>
              <p className="text-black/50 text-sm mb-1">We&apos;ve sent a password reset link to</p>
              <p className="font-display font-semibold text-sm mb-8">{sentTo}</p>

              <p className="text-black/45 text-xs mb-7">Didn&apos;t receive the email? Check your spam folder, or</p>

              <button
                type="button"
                onClick={handleResend}
                className="font-display text-xs font-semibold uppercase tracking-wide text-ink underline underline-offset-4 hover:text-primary-dark transition"
              >
                {resendLabel}
              </button>

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 mt-8 font-display text-xs font-semibold uppercase tracking-wide text-black/55 hover:text-ink transition"
              >
                <i className="fa-solid fa-arrow-left text-[10px]" /> Back to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
