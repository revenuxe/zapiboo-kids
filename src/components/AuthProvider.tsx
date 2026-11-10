"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getSupabaseConfig } from "@/integrations/supabase/config";

const postAuthRedirectKey = "zapiboo-post-auth-redirect";

function resumePostAuthRedirect() {
  if (typeof window === "undefined") return;
  const target = window.sessionStorage.getItem(postAuthRedirectKey);
  if (!target || !target.startsWith("/pickup?bookingAuth=1")) return;
  if (`${window.location.pathname}${window.location.search}` === target) {
    window.sessionStorage.removeItem(postAuthRedirectKey);
    return;
  }
  window.sessionStorage.removeItem(postAuthRedirectKey);
  window.location.replace(target);
}

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: false,
});

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: ReactNode;
}) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(Boolean(getSupabaseConfig()));
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);
  useEffect(() => {
    // Public pages can render before a Supabase project is configured.
    if (!getSupabaseConfig()) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setUser(null);
          return;
        }
        setUser(data.session?.user ?? null);
        if (data.session) resumePostAuthRedirect();
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) resumePostAuthRedirect();
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
