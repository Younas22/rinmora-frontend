"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser, logoutCustomer } from "@/lib/api";
import type { AuthUser } from "@/types/auth";

const TOKEN_KEY = "rinmora_token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = localStorage.getItem(TOKEN_KEY);

      if (!stored) {
        setLoading(false);
        return;
      }

      setToken(stored);

      try {
        const currentUser = await getCurrentUser(stored);
        if (!cancelled) setUser(currentUser);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (!cancelled) setToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const updateUser = useCallback((newUser: AuthUser) => {
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    const currentToken = token;
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    if (currentToken) {
      logoutCustomer(currentToken).catch(() => {});
    }
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, setSession, updateUser, logout }),
    [user, token, loading, setSession, updateUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
