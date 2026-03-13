import type { Panel } from "@/types/panel";

type PanelSelectorProps = {
  panels: Panel[];
  selectedPanelId: string;
  onSelect: (panelId: string) => void;
};

export function PanelSelector({
  panels,
  selectedPanelId,
  onSelect
}: PanelSelectorProps) {
  return (
    <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Panel selection</h2>
        <span className="text-xs text-slate-400">{panels.length} presets</span>
      </div>
      <select
        value={selectedPanelId}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-4 w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-sm text-white outline-none transition focus:border-orange-300"
      >
        {panels.map((panel) => (
          <option key={panel.id} value={panel.id}>
            {panel.brand} {panel.model} | {panel.widthMm}x{panel.heightMm} mm |{" "}
            {panel.pixelWidth}x{panel.pixelHeight}
          </option>
        ))}
      </select>
    </div>
  );
}
