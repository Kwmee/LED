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
    <section className="border-b border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-300 bg-[#dde2e7] px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          Panel
        </h2>
        <span className="text-[11px] text-slate-500">{panels.length} presets</span>
      </div>
      <div className="px-3 py-3">
      <select
        value={selectedPanelId}
        onChange={(event) => onSelect(event.target.value)}
        className="w-full border border-slate-400 bg-white px-2 py-2 text-sm text-slate-900 outline-none focus:border-slate-700"
      >
        {panels.map((panel) => (
          <option key={panel.id} value={panel.id}>
            {panel.brand} {panel.model} | {panel.widthMm}x{panel.heightMm} mm |{" "}
            {panel.pixelWidth}x{panel.pixelHeight}
          </option>
        ))}
      </select>
      </div>
    </section>
  );
}
