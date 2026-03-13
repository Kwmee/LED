"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { CustomHardwareList } from "@/components/CustomHardwareList";
import { MainLayout } from "@/components/MainLayout";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

export default function CustomHardwarePage() {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase client is not configured.");
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) {
        return;
      }

      if (error) {
        setMessage(error.message);
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

  return (
    <MainLayout
      header={
        <div className="flex items-center justify-between px-3 py-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              Engineering Configurator
            </p>
            <h1 className="mt-0.5 text-[15px] font-semibold text-slate-900">Custom Hardware</h1>
          </div>
          <div className="border border-slate-400 bg-[#eef1f4] px-2 py-1 text-[11px] text-slate-600">
            {user ? user.email : "Authentication required"}
          </div>
        </div>
      }
      left={
        <CustomHardwareList
          session={session}
          user={user}
          onPanelsChange={() => undefined}
          onProcessorsChange={() => undefined}
        />
      }
      center={
        <div className="h-full">
          <div className="border-b border-slate-400 bg-[#d7dce2] px-3 py-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Instructions
            </h2>
          </div>
          <div className="grid gap-3 px-3 py-3 text-[12px] text-slate-700">
            <p>
              Create user-owned panel and processor models here when the default library does not
              cover the hardware installed on site.
            </p>
            <p>
              Any custom model you save becomes available in the main configurator selectors and is
              marked as custom.
            </p>
            <p>
              Only the authenticated user can see, edit, or delete the models created in this
              workspace.
            </p>
            {message ? <p className="border border-slate-300 bg-white px-2 py-2">{message}</p> : null}
          </div>
        </div>
      }
      right={
        <div className="h-full">
          <div className="border-b border-slate-400 bg-[#d7dce2] px-3 py-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Access
            </h2>
          </div>
          <div className="grid gap-2 px-3 py-3 text-[12px] text-slate-700">
            <p>Default hardware remains visible to all users.</p>
            <p>Custom hardware requires Supabase authentication.</p>
            <p>RLS policies isolate each user&apos;s models at database level.</p>
          </div>
        </div>
      }
    />
  );
}
