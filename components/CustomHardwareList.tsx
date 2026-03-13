"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  deleteCustomPanel,
  deleteCustomProcessor,
  fetchCustomPanels,
  fetchCustomProcessors,
  upsertCustomPanel,
  upsertCustomProcessor
} from "@/lib/hardwareQueries";
import { CustomPanelForm } from "@/components/CustomPanelForm";
import { CustomProcessorForm } from "@/components/CustomProcessorForm";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

type CustomHardwareListProps = {
  session: Session | null;
  user: User | null;
  onPanelsChange?: (panels: Panel[]) => void;
  onProcessorsChange?: (processors: Processor[]) => void;
};

type PanelFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; panel: Panel };

type ProcessorFormState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; processor: Processor };

export function CustomHardwareList({
  session,
  user,
  onPanelsChange,
  onProcessorsChange
}: CustomHardwareListProps) {
  const [customPanels, setCustomPanels] = useState<Panel[]>([]);
  const [customProcessors, setCustomProcessors] = useState<Processor[]>([]);
  const [panelFormState, setPanelFormState] = useState<PanelFormState>({ mode: "closed" });
  const [processorFormState, setProcessorFormState] = useState<ProcessorFormState>({
    mode: "closed"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const refreshHardware = useCallback(async () => {
    if (!session || !user) {
      setCustomPanels([]);
      setCustomProcessors([]);
      onPanelsChange?.([]);
      onProcessorsChange?.([]);
      return;
    }

    const [panels, processors] = await Promise.all([
      fetchCustomPanels(session),
      fetchCustomProcessors(session)
    ]);

    setCustomPanels(panels);
    setCustomProcessors(processors);
    onPanelsChange?.(panels);
    onProcessorsChange?.(processors);
  }, [onPanelsChange, onProcessorsChange, session, user]);

  useEffect(() => {
    refreshHardware().catch((error) => {
      setStatusMessage(error instanceof Error ? error.message : "Unable to load custom hardware.");
    });
  }, [refreshHardware]);

  const canManage = Boolean(user && session);
  const customSummary = useMemo(
    () => `${customPanels.length} panels | ${customProcessors.length} processors`,
    [customPanels.length, customProcessors.length]
  );

  async function handlePanelSubmit(values: Parameters<typeof upsertCustomPanel>[1]) {
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await upsertCustomPanel(
        session,
        values,
        panelFormState.mode === "edit" ? panelFormState.panel.id : undefined
      );
      setPanelFormState({ mode: "closed" });
      setStatusMessage("Custom panel saved.");
      await refreshHardware();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to save custom panel.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleProcessorSubmit(values: Parameters<typeof upsertCustomProcessor>[1]) {
    setIsSubmitting(true);
    setStatusMessage("");

    try {
      await upsertCustomProcessor(
        session,
        values,
        processorFormState.mode === "edit" ? processorFormState.processor.id : undefined
      );
      setProcessorFormState({ mode: "closed" });
      setStatusMessage("Custom processor saved.");
      await refreshHardware();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to save custom processor."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeletePanel(panelId: string) {
    setStatusMessage("");

    try {
      await deleteCustomPanel(session, panelId);
      setStatusMessage("Custom panel deleted.");
      await refreshHardware();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Unable to delete custom panel.");
    }
  }

  async function handleDeleteProcessor(processorId: string) {
    setStatusMessage("");

    try {
      await deleteCustomProcessor(session, processorId);
      setStatusMessage("Custom processor deleted.");
      await refreshHardware();
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to delete custom processor."
      );
    }
  }

  return (
    <section className="border-b border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-300 bg-[#dde2e7] px-2 py-1.5">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
            Custom Hardware
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{customSummary}</p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPanelFormState({ mode: "create" })}
            disabled={!canManage}
            className="border border-slate-400 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-700 disabled:cursor-not-allowed disabled:bg-[#eceff2] disabled:text-slate-400"
          >
            Add Panel
          </button>
          <button
            type="button"
            onClick={() => setProcessorFormState({ mode: "create" })}
            disabled={!canManage}
            className="border border-slate-400 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-700 disabled:cursor-not-allowed disabled:bg-[#eceff2] disabled:text-slate-400"
          >
            Add Proc.
          </button>
        </div>
      </div>

      {!canManage ? (
        <div className="px-2 py-2 text-[12px] text-slate-500">
          Sign in to create and manage your own panel and processor models.
        </div>
      ) : null}

      {panelFormState.mode !== "closed" ? (
        <CustomPanelForm
          initialValue={panelFormState.mode === "edit" ? panelFormState.panel : null}
          isSubmitting={isSubmitting}
          onSubmit={handlePanelSubmit}
          onCancel={() => setPanelFormState({ mode: "closed" })}
        />
      ) : null}

      {processorFormState.mode !== "closed" ? (
        <CustomProcessorForm
          initialValue={processorFormState.mode === "edit" ? processorFormState.processor : null}
          isSubmitting={isSubmitting}
          onSubmit={handleProcessorSubmit}
          onCancel={() => setProcessorFormState({ mode: "closed" })}
        />
      ) : null}

      <div className="border-t border-slate-300">
        <div className="border-b border-slate-300 bg-[#eef1f4] px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-600">
          Panels
        </div>
        {customPanels.length === 0 ? (
          <div className="px-2 py-2 text-[12px] text-slate-500">No custom panels.</div>
        ) : (
          customPanels.map((panel) => (
            <div
              key={panel.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-300 px-2 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-slate-800">
                  {panel.brand} {panel.model} <span className="text-slate-500">(Custom)</span>
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {panel.pitch} mm | {panel.pixelWidth}x{panel.pixelHeight}px | {panel.widthMm}x
                  {panel.heightMm} mm
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPanelFormState({ mode: "edit", panel })}
                  className="border border-slate-400 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeletePanel(panel.id)}
                  className="border border-slate-400 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-300">
        <div className="border-b border-slate-300 bg-[#eef1f4] px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-600">
          Processors
        </div>
        {customProcessors.length === 0 ? (
          <div className="px-2 py-2 text-[12px] text-slate-500">No custom processors.</div>
        ) : (
          customProcessors.map((processor) => (
            <div
              key={processor.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-b border-slate-300 px-2 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate text-[12px] font-medium text-slate-800">
                  {processor.brand} {processor.model}{" "}
                  <span className="text-slate-500">(Custom)</span>
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  {processor.ports} ports | {processor.pixelsPerPort.toLocaleString()} px/port |{" "}
                  {processor.maxPixels.toLocaleString()} px
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setProcessorFormState({ mode: "edit", processor })}
                  className="border border-slate-400 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProcessor(processor.id)}
                  className="border border-slate-400 bg-white px-2 py-1 text-[11px] text-slate-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {statusMessage ? (
        <div className="border-t border-slate-300 px-2 py-2 text-[11px] text-slate-600">
          {statusMessage}
        </div>
      ) : null}
    </section>
  );
}
