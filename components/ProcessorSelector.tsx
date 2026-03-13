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
    <section className="border-b border-slate-300">
      <div className="flex items-center justify-between border-b border-slate-300 bg-[#dde2e7] px-3 py-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
          Processor
        </h2>
        <span className="text-[11px] text-slate-500">{processors.length} presets</span>
      </div>
      <div className="px-3 py-3">
      <select
        value={selectedProcessorId}
        onChange={(event) => onSelect(event.target.value)}
        className="w-full border border-slate-400 bg-white px-2 py-2 text-sm text-slate-900 outline-none focus:border-slate-700"
      >
        {processors.map((processor) => (
          <option key={processor.id} value={processor.id}>
            {processor.brand} {processor.model} | {processor.maxPixels.toLocaleString()} px |{" "}
            {processor.ports} ports
          </option>
        ))}
      </select>
      </div>
    </section>
  );
}
