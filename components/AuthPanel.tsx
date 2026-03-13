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
      <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-white">Authentication</h2>
            <p className="mt-2 text-sm text-slate-300">
              Signed in as <span className="font-medium text-white">{user.email}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            disabled={authLoading}
            className="rounded-full border border-stroke px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-orange-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Sign out
          </button>
        </div>
        {authMessage ? <p className="mt-3 text-xs text-slate-300">{authMessage}</p> : null}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-medium text-white">Authentication</h2>
        <div className="flex rounded-full border border-stroke p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded-full px-3 py-1 ${
              mode === "sign-in" ? "bg-accent text-black" : "text-slate-300"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded-full px-3 py-1 ${
              mode === "sign-up" ? "bg-accent text-black" : "text-slate-300"
            }`}
          >
            Sign up
          </button>
        </div>
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-white outline-none transition focus:border-orange-300"
            required
          />
        </label>

        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            className="w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-white outline-none transition focus:border-orange-300"
            required
          />
        </label>

        <button
          type="submit"
          disabled={authLoading}
          className="w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          {authLoading
            ? "Working..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-400">
        After signup, you may be signed in immediately or asked to confirm your email first.
      </p>
      {authMessage ? <p className="mt-2 text-xs text-slate-300">{authMessage}</p> : null}
    </div>
  );
}
