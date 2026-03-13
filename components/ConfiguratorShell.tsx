"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { AuthPanel } from "@/components/AuthPanel";
import { MainLayout } from "@/components/MainLayout";
import { PanelSelector } from "@/components/PanelSelector";
import { ProcessorSelector } from "@/components/ProcessorSelector";
import { ResultsPanel } from "@/components/ResultsPanel";
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
  const [authTone, setAuthTone] = useState<"neutral" | "success" | "error">("neutral");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        setAuthMessage(error.message);
        setAuthTone("error");
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
      setAuthTone("error");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");
    setAuthTone("neutral");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      setAuthMessage("Session started.");
      setAuthTone("success");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign in.");
      setAuthTone("error");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignUp(email: string, password: string) {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return;
    }

    setAuthLoading(true);
    setAuthMessage("");
    setAuthTone("neutral");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window === "undefined"
              ? undefined
              : `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        setAuthMessage("Account created and session started.");
        setAuthTone("success");
        return;
      }

      if (data.user) {
        setAuthMessage(
          "Account created. Check your inbox or spam folder to confirm the email if confirmation is enabled in Supabase."
        );
        setAuthTone("success");
        return;
      }

      setAuthMessage("Signup request processed. Review your Supabase email confirmation settings.");
      setAuthTone("neutral");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to create account.");
      setAuthTone("error");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    if (!supabase) {
      setAuthMessage("Supabase client is not configured.");
      setAuthTone("error");
      return;
    }

    setAuthLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setAuthMessage("Signed out.");
      setAuthTone("neutral");
      setSaveMessage("");
      setSaveState("idle");
    } catch (error) {
      setAuthMessage(error instanceof Error ? error.message : "Unable to sign out.");
      setAuthTone("error");
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <MainLayout
      header={
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
              Engineering Configurator
            </p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900">LED Wall Configurator</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="border border-slate-400 bg-[#eef1f4] px-3 py-1">Mode: Main</span>
            <span className="border border-slate-400 bg-[#eef1f4] px-3 py-1">
              Processor Check
            </span>
          </div>
        </div>
      }
      left={
        <div>
          <div className="border-b border-slate-400 bg-[#d7dce2] px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
              Configuration
            </h2>
          </div>
          <AuthPanel
            user={user}
            authLoading={authLoading}
            authMessage={authMessage}
            authTone={authTone}
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
        </div>
      }
      center={
        <LedCanvas
          panelGrid={panelGrid}
          portMapping={portMapping}
          panel={selectedPanel}
          widthPixels={screenPixels.widthPixels}
          heightPixels={screenPixels.heightPixels}
        />
      }
      right={
        <ResultsPanel
          widthPixels={screenPixels.widthPixels}
          heightPixels={screenPixels.heightPixels}
          totalPixels={totalPixels}
          panelGridLabel={panelGrid ? `${panelGrid.columns} x ${panelGrid.rows}` : "N/A"}
          requiredPorts={requiredPorts}
          processorCompatibility={Boolean(processorCompatibility)}
          portMapping={portMapping}
          canSave={Boolean(configurationSummary && user && saveState !== "saving")}
          saveState={saveState}
          saveMessage={saveMessage}
          onSave={handleSave}
        />
      }
    />
  );
}
