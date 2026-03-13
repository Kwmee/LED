import type { Processor } from "@/types/processor";

type ProcessorSelectorProps = {
  processors: Processor[];
  selectedProcessorId: string;
  onSelect: (processorId: string) => void;
};

export function ProcessorSelector({
  processors,
  selectedProcessorId,
  onSelect
}: ProcessorSelectorProps) {
  return (
    <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Processor selection</h2>
        <span className="text-xs text-slate-400">{processors.length} presets</span>
      </div>
      <select
        value={selectedProcessorId}
        onChange={(event) => onSelect(event.target.value)}
        className="mt-4 w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-sm text-white outline-none transition focus:border-orange-300"
      >
        {processors.map((processor) => (
          <option key={processor.id} value={processor.id}>
            {processor.brand} {processor.model} | {processor.maxPixels.toLocaleString()} px |{" "}
            {processor.ports} ports
          </option>
        ))}
      </select>
    </div>
  );
}
