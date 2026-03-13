"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/AuthPanel";
import { PanelSelector } from "@/components/PanelSelector";
import { ProcessorSelector } from "@/components/ProcessorSelector";
import { ScreenInput } from "@/components/ScreenInput";
import {
  buildConfigurationSummary,
  calculatePanelGrid,
  calculateRequiredPorts,
  calculateScreenPixels,
  calculateTotalPixels,
  isProcessorCompatible
} from "@/lib/calculations";
import { buildPortMapping } from "@/lib/portMapping";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

const LedCanvas = dynamic(
  () => import("@/components/LedCanvas").then((module) => module.LedCanvas),
  {
    ssr: false
  }
);

type ConfiguratorShellProps = {
  panels: Panel[];
  processors: Processor[];
};

export function ConfiguratorShell({
  panels,
  processors
}: ConfiguratorShellProps) {
  const [widthM, setWidthM] = useState(6);
  const [heightM, setHeightM] = useState(3);
  const [pitch, setPitch] = useState(2.6);
  const [panelId, setPanelId] = useState(panels[0]?.id ?? "");
  const [processorId, setProcessorId] = useState(processors[0]?.id ?? "");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        setAuthMessage(error.message);
        return;
      }

      setSession(data.session);
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) {
        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const selectedPanel = useMemo(
    () => panels.find((panel) => panel.id === panelId) ?? null,
    [panelId, panels]
  );
  const selectedProcessor = useMemo(
    () => processors.find((processor) => processor.id === processorId) ?? null,
    [processorId, processors]
  );

  const screenPixels = useMemo(
    () => calculateScreenPixels(widthM, heightM, pitch),
    [widthM, heightM, pitch]
  );
  const totalPixels = calculateTotalPixels(screenPixels.widthPixels, screenPixels.heightPixels);
  const panelGrid = selectedPanel
    ? calculatePanelGrid(screenPixels.widthPixels, screenPixels.heightPixels, selectedPanel)
    : null;
  const requiredPorts = selectedProcessor
    ? calculateRequiredPorts(totalPixels, selectedProcessor.pixelsPerPort)
    : 0;
  const processorCompatibility =
    selectedProcessor && isProcessorCompatible(totalPixels, requiredPorts, selectedProcessor);
  const portMapping =
    panelGrid && selectedProcessor
      ? buildPortMapping(panelGrid.columns, selectedProcessor.pixelsPerPort, totalPixels)
      : [];

  const configurationSummary =
    selectedPanel && selectedProcessor && panelGrid
      ? buildConfigurationSummary({
          widthM,
          heightM,
          pitch,
          panel: selectedPanel,
          processor: selectedProcessor,
          screenPixels,
          totalPixels,
          panelGrid,
          portMapping
        })
      : null;

  async function handleSave() {
    if (!configurationSummary || !selectedPanel || !selectedProcessor || !session?.access_token) {
      return;
    }

    setSaveState("saving");
    setSaveMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          width_m: widthM,
          height_m: heightM,
          pitch,
          panel_id: selectedPanel.id,
          processor_id: selectedProcessor.id,
          config_json: configurationSummary
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Unable to save project");
      }

      setSaveState("saved");
      setSaveMessage("Project saved in Supabase.");
    } catch (error) {
      setSaveState("error");
      setSaveMessage(error instanceof Error ? error.message : "Unable to save project");
    }
  }

  async function handleSignIn(email: string, password: string) {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      setAuthMessage("Session started.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignUp(email: string, password: string) {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setAuthMessage("Account created and session started.");
        return;
      }

      if (data.user) {
        setAuthMessage(
          "Account created. Check your inbox or spam folder to confirm the email if confirmation is enabled in Supabase."
        );
        return;
      }

      setAuthMessage("Signup request processed. Review your Supabase email confirmation settings.");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setAuthMessage("Signed out.");
      setSaveMessage("");
      setSaveState("idle");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign out.");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
      <section className="space-y-6 rounded-3xl border border-stroke bg-surface/85 p-6 shadow-xl shadow-black/20 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-orange-300">Configurator</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">LED Wall Configurator</h1>
          <p className="mt-2 text-sm text-slate-300">
            Define the target wall, choose hardware, and validate processor load and
            port usage.
          </p>
        </div>

        <AuthPanel
          user={user}
          authLoading={authLoading}
          authMessage={authMessage}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSignOut={handleSignOut}
        />

        <ScreenInput
          widthM={widthM}
          heightM={heightM}
          pitch={pitch}
          onWidthChange={setWidthM}
          onHeightChange={setHeightM}
          onPitchChange={setPitch}
        />

        <PanelSelector panels={panels} selectedPanelId={panelId} onSelect={setPanelId} />

        <ProcessorSelector
          processors={processors}
          selectedProcessorId={processorId}
          onSelect={setProcessorId}
        />

        <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
          <h2 className="text-sm font-medium text-white">Calculated output</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-stroke p-3">
              <dt className="text-slate-400">Resolution</dt>
              <dd className="mt-1 font-medium text-white">
                {screenPixels.widthPixels} x {screenPixels.heightPixels}
              </dd>
            </div>
            <div className="rounded-xl border border-stroke p-3">
              <dt className="text-slate-400">Total pixels</dt>
              <dd className="mt-1 font-medium text-white">{totalPixels.toLocaleString()}</dd>
            </div>
            <div className="rounded-xl border border-stroke p-3">
              <dt className="text-slate-400">Panel grid</dt>
              <dd className="mt-1 font-medium text-white">
                {panelGrid ? `${panelGrid.columns} x ${panelGrid.rows}` : "Select panel"}
              </dd>
            </div>
            <div className="rounded-xl border border-stroke p-3">
              <dt className="text-slate-400">Ports required</dt>
              <dd className="mt-1 font-medium text-white">{requiredPorts}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl border border-stroke p-3 text-sm">
            <p className="text-slate-400">Processor status</p>
            <p
              className={`mt-1 font-medium ${
                processorCompatibility ? "text-emerald-300" : "text-red-300"
              }`}
            >
              {processorCompatibility
                ? "Compatible with current wall load."
                : "Processor limit exceeded or not enough ports."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!configurationSummary || saveState === "saving" || !user}
            className="mt-4 w-full rounded-full bg-accent px-4 py-3 text-sm font-medium text-black transition hover:bg-orange-300 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
          >
            {saveState === "saving"
              ? "Saving..."
              : user
                ? "Save project"
                : "Sign in to save"}
          </button>

          {saveMessage ? <p className="mt-2 text-xs text-slate-300">{saveMessage}</p> : null}
        </div>
      </section>

      <section className="space-y-6">
        <LedCanvas
          panelGrid={panelGrid}
          portMapping={portMapping}
          panel={selectedPanel}
          widthPixels={screenPixels.widthPixels}
          heightPixels={screenPixels.heightPixels}
        />

        <div className="rounded-3xl border border-stroke bg-surface/85 p-6 shadow-xl shadow-black/20 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Port distribution</h2>
          <div className="mt-4 space-y-3">
            {portMapping.map((port) => (
              <div
                key={port.portNumber}
                className="flex items-center justify-between rounded-2xl border border-stroke bg-canvas/70 px-4 py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: port.color }}
                  />
                  <span className="font-medium text-white">Port {port.portNumber}</span>
                </div>
                <span className="text-slate-300">
                  Columns {port.startColumn + 1}-{port.endColumn + 1}
                </span>
              </div>
            ))}
            {portMapping.length === 0 ? (
              <p className="text-sm text-slate-400">Select a panel and processor to map ports.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
