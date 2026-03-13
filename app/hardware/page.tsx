"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { CustomHardwareList } from "@/components/CustomHardwareList";
import { samplePanels } from "@/lib/sampleData";
import { sampleProcessors } from "@/lib/sampleProcessors";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";

export default function HardwarePage() {
  const [tab, setTab] = useState<"panels" | "processors" | "custom">("panels");
  const { user, session, authLoading, authMessage, authTone, signIn, signUp, signOut } =
    useSupabaseAuth();

  const content = useMemo(() => {
    if (tab === "panels") {
      return (
        <table className="w-full border-collapse text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Brand</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Model</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Pitch</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Size</th>
              <th className="border-b border-gray-300 px-3 py-2 text-left">Pixels</th>
            </tr>
          </thead>
          <tbody>
            {samplePanels.map((panel) => (
              <tr key={panel.id}>
                <td className="border-b border-r border-gray-300 px-3 py-2">{panel.brand}</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">{panel.model}</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">{panel.pitch} mm</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">
                  {panel.widthMm} x {panel.heightMm} mm
                </td>
                <td className="border-b border-gray-300 px-3 py-2">
                  {panel.pixelWidth} x {panel.pixelHeight}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (tab === "processors") {
      return (
        <table className="w-full border-collapse text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Brand</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Model</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Ports</th>
              <th className="border-b border-r border-gray-300 px-3 py-2 text-left">Pixels/Port</th>
              <th className="border-b border-gray-300 px-3 py-2 text-left">Max Pixels</th>
            </tr>
          </thead>
          <tbody>
            {sampleProcessors.map((processor) => (
              <tr key={processor.id}>
                <td className="border-b border-r border-gray-300 px-3 py-2">{processor.brand}</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">{processor.model}</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">{processor.ports}</td>
                <td className="border-b border-r border-gray-300 px-3 py-2">
                  {processor.pixelsPerPort.toLocaleString()}
                </td>
                <td className="border-b border-gray-300 px-3 py-2">
                  {processor.maxPixels.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return <CustomHardwareList session={session} user={user} />;
  }, [session, tab, user]);

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
        left: `Library: ${tab}`,
        center: user ? `User: ${user.email}` : "Guest session",
        right: tab === "custom" ? "User-owned hardware management" : "Default hardware database"
      }}
    >
      <div className="min-h-[calc(100vh-88px)] bg-white">
        <div className="flex border-b border-gray-300 bg-gray-50">
          <button
            type="button"
            onClick={() => setTab("panels")}
            className={`border-r border-gray-300 px-3 py-2 text-sm ${
              tab === "panels" ? "bg-white text-gray-800" : "text-gray-600"
            }`}
          >
            Panels
          </button>
          <button
            type="button"
            onClick={() => setTab("processors")}
            className={`border-r border-gray-300 px-3 py-2 text-sm ${
              tab === "processors" ? "bg-white text-gray-800" : "text-gray-600"
            }`}
          >
            Processors
          </button>
          <button
            type="button"
            onClick={() => setTab("custom")}
            className={`px-3 py-2 text-sm ${
              tab === "custom" ? "bg-white text-gray-800" : "text-gray-600"
            }`}
          >
            My Custom Hardware
          </button>
        </div>
        <div>{content}</div>
      </div>
    </AppLayout>
  );
}
