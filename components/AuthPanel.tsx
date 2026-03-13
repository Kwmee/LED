"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";

type AuthPanelProps = {
  user: User | null;
  authLoading: boolean;
  authMessage: string;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function AuthPanel({
  user,
  authLoading,
  authMessage,
  onSignIn,
  onSignUp,
  onSignOut
}: AuthPanelProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "sign-in") {
      await onSignIn(email, password);
      return;
    }

    await onSignUp(email, password);
  }

  if (user) {
    return (
      <section className="border-b border-slate-300">
        <div className="flex items-center justify-between border-b border-slate-300 bg-[#dde2e7] px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
            Authentication
          </h2>
          <button
            type="button"
            onClick={onSignOut}
            disabled={authLoading}
            className="border border-slate-400 bg-[#f5f6f8] px-3 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-[#e8ebef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
        <div className="px-3 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Current user</p>
            <p className="mt-1 text-sm text-slate-900">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          </div>
          {authMessage ? <p className="mt-2 text-xs text-slate-600">{authMessage}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-300">
      <div className="flex items-center justify-between gap-4 border-b border-slate-300 bg-[#dde2e7] px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          Authentication
        </h2>
        <div className="flex border border-slate-400 text-xs">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`px-3 py-1 ${
              mode === "sign-in"
                ? "bg-[#bcc5ce] text-slate-900"
                : "bg-[#eef1f4] text-slate-600"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`border-l border-slate-400 px-3 py-1 ${
              mode === "sign-up"
                ? "bg-[#bcc5ce] text-slate-900"
                : "bg-[#eef1f4] text-slate-600"
            }`}
          >
            Sign up
          </button>
        </div>
      </div>

      <form className="grid gap-3 px-3 py-3" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full border border-slate-400 bg-white px-2 py-2 text-slate-900 outline-none focus:border-slate-700"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            className="w-full border border-slate-400 bg-white px-2 py-2 text-slate-900 outline-none focus:border-slate-700"
            required
          />
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full border border-slate-600 bg-[#c9d0d8] px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-[#bfc7d0] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-[#e5e7eb] disabled:text-slate-400"
        >
          {authLoading
            ? "Working..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <div className="border-t border-slate-300 px-3 py-3">
        <p className="text-xs text-slate-500">
          After signup, Supabase may sign you in immediately or require email confirmation.
        </p>
        {authMessage ? <p className="mt-2 text-xs text-slate-600">{authMessage}</p> : null}
      </div>
    </section>
  );
}
