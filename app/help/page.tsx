"use client";

import { AppLayout } from "@/components/AppLayout";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

export default function HelpPage() {
  const { user, authLoading, authMessage, authTone, signIn, signUp, signOut } =
    useSupabaseAuth();

  return (
    <AppLayout
      user={user}
      authLoading={authLoading}
      authMessage={authMessage}
      authTone={authTone}
      onSignIn={signIn}
      onSignUp={(email, password) =>
        signUp(
          email,
          password,
          process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? window.location.origin
        )
      }
      onSignOut={signOut}
      status={{
        left: "Help",
        center: "Engineering workflow notes",
        right: "Use hardware library for custom models"
      }}
    >
      <div className="min-h-[calc(100vh-88px)] bg-white">
        <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
          Help
        </div>
        <div className="grid gap-3 p-3 text-sm text-gray-800">
          <p>1. Set screen width, height and pixel pitch in the configurator sidebar.</p>
          <p>2. Select panel and processor models from the hardware library.</p>
          <p>3. Review panel count, resolution, ports, power and weight in the results panel.</p>
          <p>4. Use the hardware library page to create your own custom panels and processors.</p>
          <p>5. Save the project once you are authenticated through Supabase.</p>
        </div>
      </div>
    </AppLayout>
  );
}
