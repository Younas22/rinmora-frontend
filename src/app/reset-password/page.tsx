"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import AuthMinimalHeader from "@/components/auth/AuthMinimalHeader";
import PasswordField from "@/components/auth/PasswordField";
import { ApiError, resetPassword } from "@/lib/api";
import { createRipple } from "@/lib/ripple";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await resetPassword({ token, email, password, password_confirmation: passwordConfirmation });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AuthMinimalHeader backHref="/login" backLabel="Back to Sign In" />

      <main className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-md fade-up">
          {!token || !email ? (
            <div className="bg-white rounded-3xl shadow-card p-7 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 grid place-items-center">
                <i className="fa-solid fa-triangle-exclamation text-xl text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Invalid Reset Link</h1>
              <p className="text-black/50 text-sm mb-8">
                This password reset link is missing information. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
              >
                Request New Link
              </Link>
            </div>
          ) : done ? (
            <div className="bg-white rounded-3xl shadow-card p-7 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 grid place-items-center">
                <i className="fa-solid fa-circle-check text-xl text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Password Reset</h1>
              <p className="text-black/50 text-sm mb-8">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="btn-ripple inline-block bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide px-8 py-4 rounded-full hover:bg-primary-dark transition"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-card p-7 md:p-10 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 grid place-items-center">
                <i className="fa-solid fa-key text-xl text-primary-dark" />
              </div>
              <h1 className="font-display text-2xl font-semibold mb-2">Reset Your Password</h1>
              <p className="text-black/50 text-sm mb-8">Choose a new password for {email}.</p>

              <form className="space-y-5 text-left" onSubmit={handleSubmit}>
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
                )}

                <PasswordField
                  id="newPassword"
                  label="New Password"
                  placeholder="Create a new password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                />

                <PasswordField
                  id="newPasswordConfirmation"
                  label="Confirm New Password"
                  placeholder="Re-enter your new password"
                  value={passwordConfirmation}
                  onChange={setPasswordConfirmation}
                  autoComplete="new-password"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  onClick={createRipple}
                  className="btn-ripple w-full bg-primary text-ink font-display font-semibold text-sm uppercase tracking-wide py-4 rounded-full hover:bg-primary-dark transition disabled:opacity-60"
                >
                  {submitting ? "Resetting…" : "Reset Password"}
                </button>
              </form>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 mt-7 font-display text-xs font-semibold uppercase tracking-wide text-black/55 hover:text-ink transition"
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
