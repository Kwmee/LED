"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [message, setMessage] = useState("Confirming authentication...");

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase client is not configured.");
      return;
    }

    const client = supabase;
    let cancelled = false;

    async function completeAuth() {
      try {
        const search = new URLSearchParams(window.location.search);
        const code = search.get("code");
        const errorDescription = search.get("error_description");

        if (errorDescription) {
          setMessage(errorDescription);
          return;
        }

        if (code) {
          const { error } = await client.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }
        }

        await client.auth.getSession();

        if (!cancelled) {
          setMessage("Authentication complete. Redirecting to configurator...");
          window.setTimeout(() => {
            router.replace("/configurator");
          }, 700);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : "Unable to complete authentication.");
        }
      }
    }

    completeAuth();

    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#d8dce1] px-6">
      <div className="w-full max-w-xl border border-slate-400 bg-[#f4f6f8]">
        <div className="border-b border-slate-400 bg-[#d7dce2] px-4 py-3">
          <h1 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
            Authentication Callback
          </h1>
        </div>
        <div className="px-4 py-6">
          <p className="text-sm text-slate-700">{message}</p>
        </div>
      </div>
    </main>
  );
}
