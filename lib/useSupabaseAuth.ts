"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

export type AuthTone = "neutral" | "success" | "error";

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [authTone, setAuthTone] = useState<AuthTone>("neutral");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) {
        return;
      }

      if (error) {
        setAuthMessage(error.message);
        setAuthTone("error");
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!mounted) {
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function signIn(email: string, password: string) {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return false;
    }

    setAuthLoading(true);
    setAuthMessage("");
    setAuthTone("neutral");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      setAuthMessage("Session started.");
      setAuthTone("success");
      return true;
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign in.");
      setAuthTone("error");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signUp(email: string, password: string, appUrl: string) {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return false;
    }

    setAuthLoading(true);
    setAuthMessage("");
    setAuthTone("neutral");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: appUrl ? `${appUrl}/auth/callback` : undefined
        }
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setAuthMessage("Account created and session started.");
        setAuthTone("success");
        return true;
      }

      if (data.user) {
        setAuthMessage("Account created. Check your inbox or spam folder to confirm the email.");
        setAuthTone("success");
        return true;
      }

      setAuthMessage("Signup request processed.");
      setAuthTone("neutral");
      return true;
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to create account.");
      setAuthTone("error");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOut() {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setAuthMessage("Signed out.");
      setAuthTone("neutral");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign out.");
      setAuthTone("error");
    } finally {
      setAuthLoading(false);
    }
  }

  return {
    user,
    session,
    authLoading,
    authMessage,
    authTone,
    signIn,
    signUp,
    signOut
  };
}
