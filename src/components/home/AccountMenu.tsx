"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";

export default function AccountMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="w-9 h-9 md:w-10 md:h-10 rounded-full" aria-hidden />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
      >
        <i className="fa-regular fa-user text-[13px] md:text-[15px]" />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 md:w-10 md:h-10 grid place-items-center rounded-full hover:bg-black/5 transition"
      >
        <i className="fa-solid fa-user text-[13px] md:text-[15px] text-primary-dark" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-white rounded-2xl shadow-card border border-black/5 py-2">
            <p className="px-4 py-2 text-xs text-black/40 truncate">{user.full_name}</p>
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm hover:bg-black/5 transition"
            >
              My Account
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-black/5 transition"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
