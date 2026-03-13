import Link from "next/link";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

type SidebarConfigProps = {
  widthM: number;
  heightM: number;
  pitch: number;
  brightness: number;
  refreshRate: number;
  pitches: number[];
  panels: Panel[];
  processors: Processor[];
  selectedPanelId: string;
  selectedProcessorId: string;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onPitchChange: (value: number) => void;
  onBrightnessChange: (value: number) => void;
  onRefreshRateChange: (value: number) => void;
  onPanelChange: (value: string) => void;
  onProcessorChange: (value: string) => void;
  onCalculate: () => void;
  canManageHardware: boolean;
};

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-gray-300">
      <div className="border-b border-gray-300 bg-gray-50 px-2 py-2 text-sm font-semibold text-gray-800">
        {title}
      </div>
      <div className="grid gap-2 p-2">{children}</div>
    </section>
  );
}

export function SidebarConfig({
  widthM,
  heightM,
  pitch,
  brightness,
  refreshRate,
  pitches,
  panels,
  processors,
  selectedPanelId,
  selectedProcessorId,
  onWidthChange,
  onHeightChange,
  onPitchChange,
  onBrightnessChange,
  onRefreshRateChange,
  onPanelChange,
  onProcessorChange,
  onCalculate,
  canManageHardware
}: SidebarConfigProps) {
  return (
    <div className="h-full border-r border-gray-300 bg-white">
      <div className="border-b border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
        Configuration
      </div>

      <Section title="Screen Size">
        <label className="text-sm text-gray-800">
          <span className="mb-1 block">Width (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={widthM}
            onChange={(event) => onWidthChange(Number(event.target.value))}
            className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
          />
        </label>
        <label className="text-sm text-gray-800">
          <span className="mb-1 block">Height (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={heightM}
            onChange={(event) => onHeightChange(Number(event.target.value))}
            className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
          />
        </label>
      </Section>

      <Section title="Pixel Pitch">
        <select
          value={pitch}
          onChange={(event) => onPitchChange(Number(event.target.value))}
          className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
        >
          {pitches.map((item) => (
            <option key={item} value={item}>
              {item.toFixed(1)} mm
            </option>
          ))}
        </select>
      </Section>

      <Section title="Panel Model">
        <select
          value={selectedPanelId}
          onChange={(event) => onPanelChange(event.target.value)}
          className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
        >
          {panels.map((panel) => (
            <option key={panel.id} value={panel.id}>
              {panel.brand} {panel.model}
              {panel.source === "custom" ? " (Custom)" : ""}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Processor">
        <select
          value={selectedProcessorId}
          onChange={(event) => onProcessorChange(event.target.value)}
          className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
        >
          {processors.map((processor) => (
            <option key={processor.id} value={processor.id}>
              {processor.brand} {processor.model}
              {processor.source === "custom" ? " (Custom)" : ""}
            </option>
          ))}
        </select>
      </Section>

      <Section title="Advanced Settings">
        <label className="text-sm text-gray-800">
          <span className="mb-1 block">Brightness (nits)</span>
          <input
            type="number"
            min="100"
            step="100"
            value={brightness}
            onChange={(event) => onBrightnessChange(Number(event.target.value))}
            className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
          />
        </label>
        <label className="text-sm text-gray-800">
          <span className="mb-1 block">Refresh Rate (Hz)</span>
          <input
            type="number"
            min="960"
            step="120"
            value={refreshRate}
            onChange={(event) => onRefreshRateChange(Number(event.target.value))}
            className="h-9 w-full border border-gray-300 bg-white px-2 text-sm text-gray-800 outline-none"
          />
        </label>
      </Section>

      <div className="grid gap-2 p-2">
        <button
          type="button"
          onClick={onCalculate}
          className="border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800"
        >
          Calculate
        </button>
        <Link
          href="/hardware"
          className="border border-gray-300 bg-white px-3 py-2 text-center text-sm text-gray-800"
        >
          {canManageHardware ? "Manage Hardware Library" : "View Hardware Library"}
        </Link>
      </div>
    </div>
  );
}
