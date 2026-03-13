"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";

type AuthPanelProps = {
  user: User | null;
  authLoading: boolean;
  authMessage: string;
  authTone: "neutral" | "success" | "error";
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function AuthPanel({
  user,
  authLoading,
  authMessage,
  authTone,
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

  const messageClasses =
    authTone === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : authTone === "success"
        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
        : "border-slate-300 bg-[#f0f3f6] text-slate-600";

  if (user) {
    return (
      <section className="border-b border-slate-300">
        <div className="flex items-center justify-between border-b border-slate-300 bg-[#dde2e7] px-2 py-1.5">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            Authentication
          </h2>
          <button
            type="button"
            onClick={onSignOut}
            disabled={authLoading}
            className="border border-slate-400 bg-[#f5f6f8] px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-[#e8ebef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
        <div className="px-2 py-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">Current user</p>
            <p className="mt-1 text-[12px] text-slate-900">
              Signed in as <span className="font-medium">{user.email}</span>
            </p>
          </div>
          {authMessage ? (
            <p className={`mt-2 border px-2 py-1.5 text-[11px] ${messageClasses}`}>{authMessage}</p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-slate-300">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 bg-[#dde2e7] px-2 py-1.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
          Authentication
        </h2>
        <div className="flex border border-slate-400 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`px-2 py-1 ${
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
            className={`border-l border-slate-400 px-2 py-1 ${
              mode === "sign-up"
                ? "bg-[#bcc5ce] text-slate-900"
                : "bg-[#eef1f4] text-slate-600"
            }`}
          >
            Sign up
          </button>
        </div>
      </div>

      <form className="grid gap-2 px-2 py-2" onSubmit={handleSubmit}>
        <label className="block text-[12px]">
          <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
            required
          />
        </label>

        <label className="block text-[12px]">
          <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
            required
          />
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full border border-slate-600 bg-[#c9d0d8] px-2 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-900 transition hover:bg-[#bfc7d0] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-[#e5e7eb] disabled:text-slate-400"
        >
          {authLoading
            ? "Working..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <div className="border-t border-slate-300 px-2 py-2">
        <p className="text-[11px] text-slate-500">
          After signup, Supabase may sign you in immediately or require email confirmation.
        </p>
        {authMessage ? (
          <p className={`mt-2 border px-2 py-1.5 text-[11px] ${messageClasses}`}>{authMessage}</p>
        ) : null}
      </div>
    </section>
  );
}
