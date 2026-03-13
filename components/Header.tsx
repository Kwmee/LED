"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { AuthTone } from "@/lib/useSupabaseAuth";

type HeaderProps = {
  user: User | null;
  authLoading: boolean;
  authMessage: string;
  authTone: AuthTone;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => Promise<void>;
};

export function Header({
  user,
  authLoading,
  authMessage,
  authTone,
  onSignIn,
  onSignUp,
  onSignOut
}: HeaderProps) {
  const pathname = usePathname();
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const messageClasses =
    authTone === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : authTone === "success"
        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
        : "border-gray-300 bg-gray-50 text-gray-600";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok =
      mode === "sign-in" ? await onSignIn(email, password) : await onSignUp(email, password);

    if (ok) {
      setShowLogin(false);
    }
  }

  function linkClass(href: string) {
    return `border-r border-gray-300 px-3 py-2 text-sm text-gray-800 ${
      pathname === href ? "bg-white font-medium" : "bg-gray-50"
    }`;
  }

  return (
    <>
      <div className="grid h-14 grid-cols-[auto_1fr_auto] items-center border-b border-gray-300 bg-gray-50">
        <div className="border-r border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
          LED Wall Configurator
        </div>
        <nav className="flex items-stretch">
          <Link href="/projects" className={linkClass("/projects")}>
            Projects
          </Link>
          <Link href="/hardware" className={linkClass("/hardware")}>
            Hardware Library
          </Link>
          <Link href="/help" className={linkClass("/help")}>
            Help
          </Link>
          <Link href="/configurator" className={linkClass("/configurator")}>
            Configurator
          </Link>
        </nav>
        <div className="flex items-center gap-2 px-3">
          {user ? (
            <>
              <div className="border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800">
                {user.email}
              </div>
              <button
                type="button"
                onClick={onSignOut}
                className="border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowLogin(true)}
              className="border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {showLogin ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[rgba(15,23,42,0.25)] px-4">
          <div className="w-full max-w-md border border-gray-300 bg-white">
            <div className="flex items-center justify-between border-b border-gray-300 bg-gray-50 px-3 py-2">
              <div className="text-sm font-semibold text-gray-800">Authentication</div>
              <button
                type="button"
                onClick={() => setShowLogin(false)}
                className="border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800"
              >
                Close
              </button>
            </div>

            <div className="flex border-b border-gray-300">
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className={`border-r border-gray-300 px-3 py-2 text-sm ${
                  mode === "sign-in" ? "bg-white text-gray-800" : "bg-gray-50 text-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("sign-up")}
                className={`px-3 py-2 text-sm ${
                  mode === "sign-up" ? "bg-white text-gray-800" : "bg-gray-50 text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form className="grid gap-3 p-3" onSubmit={handleSubmit}>
              <label className="text-sm text-gray-800">
                <span className="mb-1 block">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
                  required
                />
              </label>
              <label className="text-sm text-gray-800">
                <span className="mb-1 block">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
                  required
                />
              </label>
              <button
                type="submit"
                disabled={authLoading}
                className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 disabled:text-gray-400"
              >
                {authLoading ? "Working..." : mode === "sign-in" ? "Sign In" : "Create Account"}
              </button>
              {authMessage ? (
                <div className={`border px-2 py-2 text-sm ${messageClasses}`}>{authMessage}</div>
              ) : null}
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
