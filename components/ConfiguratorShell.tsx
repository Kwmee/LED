"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ResultsPanel } from "@/components/ResultsPanel";
import { SidebarConfig } from "@/components/SidebarConfig";
import {
  buildConfigurationSummary,
  calculatePanelGrid,
  calculateRequiredPorts,
  calculateScreenPixels,
  calculateTotalPixels,
  isProcessorCompatible
} from "@/lib/calculations";
import { buildPortMapping } from "@/lib/portMapping";
import { fetchCustomPanels, fetchCustomProcessors } from "@/lib/hardwareQueries";
import { useSupabaseAuth } from "@/lib/useSupabaseAuth";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

const LedCanvas = dynamic(
  () => import("@/components/LedCanvas").then((module) => module.LedCanvas),
  { ssr: false }
);

const DEFAULT_PITCHES = [1.2, 1.5, 1.9, 2.5, 2.6, 2.9, 3.9, 4.8];

function getPublicAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

type ConfiguratorShellProps = {
  panels: Panel[];
  processors: Processor[];
};

export function ConfiguratorShell({ panels, processors }: ConfiguratorShellProps) {
  const [widthM, setWidthM] = useState(6);
  const [heightM, setHeightM] = useState(3);
  const [pitch, setPitch] = useState(2.6);
  const [brightness, setBrightness] = useState(1200);
  const [refreshRate, setRefreshRate] = useState(3840);
  const [panelId, setPanelId] = useState(panels[0]?.id ?? "");
  const [processorId, setProcessorId] = useState(processors[0]?.id ?? "");
  const [zoom, setZoom] = useState(1);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const [customPanels, setCustomPanels] = useState<Panel[]>([]);
  const [customProcessors, setCustomProcessors] = useState<Processor[]>([]);
  const {
    user,
    session,
    authLoading,
    authMessage,
    authTone,
    signIn,
    signUp,
    signOut
  } = useSupabaseAuth();

  useEffect(() => {
    if (!session || !user) {
      setCustomPanels([]);
      setCustomProcessors([]);
      return;
    }

    Promise.all([fetchCustomPanels(session), fetchCustomProcessors(session)])
      .then(([panelRows, processorRows]) => {
        setCustomPanels(panelRows);
        setCustomProcessors(processorRows);
      })
      .catch(() => {
        setCustomPanels([]);
        setCustomProcessors([]);
      });
  }, [session, user]);

  const availablePanels = useMemo(() => [...panels, ...customPanels], [customPanels, panels]);
  const availableProcessors = useMemo(
    () => [...processors, ...customProcessors],
    [customProcessors, processors]
  );
  const availablePitches = useMemo(() => {
    const combined = new Set([...DEFAULT_PITCHES, ...availablePanels.map((item) => item.pitch)]);
    return [...combined].sort((a, b) => a - b);
  }, [availablePanels]);

  const selectedPanel = useMemo(
    () => availablePanels.find((item) => item.id === panelId) ?? null,
    [availablePanels, panelId]
  );
  const selectedProcessor = useMemo(
    () => availableProcessors.find((item) => item.id === processorId) ?? null,
    [availableProcessors, processorId]
  );

  useEffect(() => {
    if (!selectedPanel && availablePanels[0]) {
      setPanelId(availablePanels[0].id);
    }
  }, [availablePanels, selectedPanel]);

  useEffect(() => {
    if (!selectedProcessor && availableProcessors[0]) {
      setProcessorId(availableProcessors[0].id);
    }
  }, [availableProcessors, selectedProcessor]);

  const screenPixels = useMemo(
    () => calculateScreenPixels(widthM, heightM, pitch),
    [widthM, heightM, pitch]
  );
  const totalPixels = calculateTotalPixels(screenPixels.widthPixels, screenPixels.heightPixels);
  const panelGrid = useMemo(
    () =>
      selectedPanel
        ? calculatePanelGrid(
            screenPixels.widthPixels,
            screenPixels.heightPixels,
            selectedPanel
          )
        : null,
    [screenPixels.widthPixels, screenPixels.heightPixels, selectedPanel]
  );

  const requiredPorts = useMemo(
    () =>
      selectedProcessor ? calculateRequiredPorts(totalPixels, selectedProcessor.pixelsPerPort) : 0,
    [totalPixels, selectedProcessor]
  );

  const processorCompatibility = useMemo(
    () => selectedProcessor && isProcessorCompatible(totalPixels, requiredPorts, selectedProcessor),
    [totalPixels, requiredPorts, selectedProcessor]
  );

  const portMapping = useMemo(
    () =>
      panelGrid && selectedProcessor
        ? buildPortMapping(panelGrid.columns, selectedProcessor.pixelsPerPort, totalPixels)
        : [],
    [panelGrid, selectedProcessor, totalPixels]
  );
  const totalPanels = panelGrid?.totalPanels ?? 0;
  const configurationSummary = useMemo(
    () =>
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
        : null,
    [
      widthM,
      heightM,
      pitch,
      selectedPanel,
      selectedProcessor,
      screenPixels,
      totalPixels,
      panelGrid,
      portMapping
    ]
  );

  const totalWeightKg = useMemo(
    () =>
      selectedPanel?.weightKg != null ? selectedPanel.weightKg * totalPanels : null,
    [selectedPanel, totalPanels]
  );

  const totalPowerW = useMemo(
    () =>
      selectedPanel?.powerMaxW != null ? selectedPanel.powerMaxW * totalPanels : null,
    [selectedPanel, totalPanels]
  );

  const handleSave = useCallback(async () => {
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
          panel_source: selectedPanel.source ?? "default",
          processor_id: selectedProcessor.id,
          processor_source: selectedProcessor.source ?? "default",
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
  }, [
    configurationSummary,
    selectedPanel,
    selectedProcessor,
    session,
    pitch,
    widthM,
    heightM
  ]);

  return (
    <AppLayout
      user={user}
      authLoading={authLoading}
      authMessage={authMessage}
      authTone={authTone}
      onSignIn={signIn}
      onSignUp={(email, password) => signUp(email, password, getPublicAppUrl())}
      onSignOut={signOut}
      status={{
        left: `Panel: ${selectedPanel ? `${selectedPanel.brand} ${selectedPanel.model}` : "N/A"}`,
        center: `Processor: ${
          selectedProcessor ? `${selectedProcessor.brand} ${selectedProcessor.model}` : "N/A"
        }`,
        right: saveMessage || `Brightness ${brightness} nits | Refresh ${refreshRate} Hz`
      }}
    >
      <div className="grid min-h-[calc(100vh-88px)] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_260px]">
        <SidebarConfig
          widthM={widthM}
          heightM={heightM}
          pitch={pitch}
          brightness={brightness}
          refreshRate={refreshRate}
          pitches={availablePitches}
          panels={availablePanels}
          processors={availableProcessors}
          selectedPanelId={panelId}
          selectedProcessorId={processorId}
          onWidthChange={setWidthM}
          onHeightChange={setHeightM}
          onPitchChange={setPitch}
          onBrightnessChange={setBrightness}
          onRefreshRateChange={setRefreshRate}
          onPanelChange={setPanelId}
          onProcessorChange={setProcessorId}
          onCalculate={() => setSaveMessage("Values recalculated.")}
          canManageHardware={Boolean(user)}
        />
        <div className="border-r border-gray-300 bg-white">
          <LedCanvas
            panelGrid={panelGrid}
            portMapping={portMapping}
            panel={selectedPanel}
            widthPixels={screenPixels.widthPixels}
            heightPixels={screenPixels.heightPixels}
            zoom={zoom}
            onZoomChange={setZoom}
          />
        </div>
        <div className="bg-white">
          <ResultsPanel
            widthPixels={screenPixels.widthPixels}
            heightPixels={screenPixels.heightPixels}
            totalPixels={totalPixels}
            totalPanels={totalPanels}
            panelGridLabel={panelGrid ? `${panelGrid.columns} x ${panelGrid.rows}` : "N/A"}
            requiredPorts={requiredPorts}
            processorCompatibility={Boolean(processorCompatibility)}
            portMapping={portMapping}
            totalWeightKg={totalWeightKg}
            totalPowerW={totalPowerW}
            canSave={Boolean(configurationSummary && user && saveState !== "saving")}
            saveState={saveState}
            saveMessage={saveMessage}
            onSave={handleSave}
          />
        </div>
      </div>
    </AppLayout>
  );
}
