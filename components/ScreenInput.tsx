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
    <div className="rounded-2xl border border-stroke bg-canvas/70 p-4">
      <h2 className="text-sm font-medium text-white">Screen size</h2>
      <div className="mt-4 space-y-4">
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Width (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={widthM}
            onChange={(event) => onWidthChange(Number(event.target.value))}
            className="w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-white outline-none transition focus:border-orange-300"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Height (m)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={heightM}
            onChange={(event) => onHeightChange(Number(event.target.value))}
            className="w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-white outline-none transition focus:border-orange-300"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block text-slate-300">Pixel pitch (mm)</span>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={pitch}
            onChange={(event) => onPitchChange(Number(event.target.value))}
            className="w-full rounded-xl border border-stroke bg-surface px-3 py-2 text-white outline-none transition focus:border-orange-300"
          />
        </label>
      </div>
    </div>
  );
}
