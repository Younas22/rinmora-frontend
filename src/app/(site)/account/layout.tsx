"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import AccountNav from "@/components/account/AccountNav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?redirect=/account");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="pt-16 md:pt-20">
        <p className="text-center text-black/40 text-sm py-24">Loading your account…</p>
      </main>
    );
  }

  return (
    <main className="pt-16 md:pt-20 pb-24 lg:pb-0">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-8 md:py-10">
        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 lg:items-start">
          <AccountNav />
          <div className="space-y-8 md:space-y-10 mt-8 lg:mt-0 min-w-0">{children}</div>
        </div>
      </div>
    </main>
  );
}
