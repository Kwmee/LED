type ScreenInputProps = {
  widthM: number;
  heightM: number;
  pitch: number;
  onWidthChange: (value: number) => void;
  onHeightChange: (value: number) => void;
  onPitchChange: (value: number) => void;
};

export function ScreenInput({
  widthM,
  heightM,
  pitch,
  onWidthChange,
  onHeightChange,
  onPitchChange
}: ScreenInputProps) {
  return (
    <section className="border-b border-slate-300">
      <div className="border-b border-slate-300 bg-[#dde2e7] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
        Screen Size
      </div>
      <div className="grid gap-3 px-3 py-3">
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Width (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={widthM}
            onChange={(event) => onWidthChange(Number(event.target.value))}
            className="w-full border border-slate-400 bg-white px-2 py-2 text-slate-900 outline-none focus:border-slate-700"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Height (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={heightM}
            onChange={(event) => onHeightChange(Number(event.target.value))}
            className="w-full border border-slate-400 bg-white px-2 py-2 text-slate-900 outline-none focus:border-slate-700"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-slate-600">Pixel Pitch (mm)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={pitch}
            onChange={(event) => onPitchChange(Number(event.target.value))}
            className="w-full border border-slate-400 bg-white px-2 py-2 text-slate-900 outline-none focus:border-slate-700"
          />
        </label>
      </div>
    </section>
  );
}
