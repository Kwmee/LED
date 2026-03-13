import type { PortMapping } from "@/types/project";

type ResultsPanelProps = {
  widthPixels: number;
  heightPixels: number;
  totalPixels: number;
  panelGridLabel: string;
  requiredPorts: number;
  processorCompatibility: boolean;
  portMapping: PortMapping[];
  canSave: boolean;
  saveState: "idle" | "saving" | "saved" | "error";
  saveMessage: string;
  onSave: () => Promise<void>;
};

function StatRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)] border-b border-slate-300 text-sm last:border-b-0">
      <div className="border-r border-slate-300 bg-[#dde2e7] px-3 py-2 font-medium text-slate-700">
        {label}
      </div>
      <div className="px-3 py-2 font-mono text-slate-900">{value}</div>
    </div>
  );
}

export function ResultsPanel({
  widthPixels,
  heightPixels,
  totalPixels,
  panelGridLabel,
  requiredPorts,
  processorCompatibility,
  portMapping,
  canSave,
  saveState,
  saveMessage,
  onSave
}: ResultsPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-400 bg-[#d7dce2] px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
          Results
        </h2>
      </div>

      <div className="border-b border-slate-300">
        <StatRow label="Resolution" value={`${widthPixels} x ${heightPixels}`} />
        <StatRow label="Total Pixels" value={totalPixels.toLocaleString()} />
        <StatRow label="Panel Grid" value={panelGridLabel} />
        <StatRow label="Ports Req." value={String(requiredPorts)} />
        <StatRow
          label="Processor"
          value={processorCompatibility ? "COMPATIBLE" : "LIMIT EXCEEDED"}
        />
      </div>

      <div className="border-b border-slate-300">
        <div className="border-b border-slate-300 bg-[#dde2e7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          Port Mapping
        </div>
        <div className="max-h-[320px] overflow-auto">
          {portMapping.length === 0 ? (
            <div className="px-3 py-3 text-sm text-slate-500">No port allocation available.</div>
          ) : (
            portMapping.map((port) => (
              <div
                key={port.portNumber}
                className="grid grid-cols-[24px_72px_minmax(0,1fr)] items-center border-b border-slate-300 px-3 py-2 text-sm last:border-b-0"
              >
                <span
                  className="h-3 w-3 border border-slate-500"
                  style={{ backgroundColor: port.color }}
                />
                <span className="font-mono text-slate-800">P{port.portNumber}</span>
                <span className="font-mono text-slate-700">
                  COL {port.startColumn + 1} - {port.endColumn + 1}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="px-4 py-4">
        <button
          type="button"
          onClick={onSave}
          disabled={!canSave}
          className="w-full border border-slate-600 bg-[#c9d0d8] px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-[#bfc7d0] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-[#e5e7eb] disabled:text-slate-400"
        >
          {saveState === "saving" ? "Saving..." : canSave ? "Save Project" : "Sign in to save"}
        </button>
        {saveMessage ? <p className="mt-2 text-xs text-slate-600">{saveMessage}</p> : null}
      </div>
    </div>
  );
}
