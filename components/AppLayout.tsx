import type { User } from "@supabase/supabase-js";
import { Header } from "@/components/Header";
import { StatusBar } from "@/components/StatusBar";
import type { AuthTone } from "@/lib/useSupabaseAuth";

type AppLayoutProps = {
  user: User | null;
  authLoading: boolean;
  authMessage: string;
  authTone: AuthTone;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  onSignOut: () => Promise<void>;
  status: {
    left: string;
    center?: string;
    right?: string;
  };
  children: React.ReactNode;
};

export function AppLayout({
  user,
  authLoading,
  authMessage,
  authTone,
  onSignIn,
  onSignUp,
  onSignOut,
  status,
  children
}: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-800">
      <Header
        user={user}
        authLoading={authLoading}
        authMessage={authMessage}
        authTone={authTone}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onSignOut={onSignOut}
      />
      <main className="min-h-0 flex-1">{children}</main>
      <StatusBar left={status.left} center={status.center} right={status.right} />
    </div>
  );
}
