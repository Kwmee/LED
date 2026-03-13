"use client";

import { useState } from "react";
import type { Panel } from "@/types/panel";
import type { CustomPanelInput } from "@/lib/hardwareQueries";

type CustomPanelFormProps = {
  initialValue?: Panel | null;
  isSubmitting: boolean;
  onSubmit: (values: CustomPanelInput) => Promise<void>;
  onCancel: () => void;
};

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function CustomPanelForm({
  initialValue,
  isSubmitting,
  onSubmit,
  onCancel
}: CustomPanelFormProps) {
  const [brand, setBrand] = useState(initialValue?.brand ?? "");
  const [model, setModel] = useState(initialValue?.model ?? "");
  const [pitchMm, setPitchMm] = useState(String(initialValue?.pitch ?? ""));
  const [panelWidthMm, setPanelWidthMm] = useState(String(initialValue?.widthMm ?? ""));
  const [panelHeightMm, setPanelHeightMm] = useState(String(initialValue?.heightMm ?? ""));
  const [pixelWidth, setPixelWidth] = useState(String(initialValue?.pixelWidth ?? ""));
  const [pixelHeight, setPixelHeight] = useState(String(initialValue?.pixelHeight ?? ""));
  const [weightKg, setWeightKg] = useState(initialValue?.weightKg?.toString() ?? "");
  const [powerMaxW, setPowerMaxW] = useState(initialValue?.powerMaxW?.toString() ?? "");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      brand,
      model,
      pitchMm: Number(pitchMm),
      panelWidthMm: Number(panelWidthMm),
      panelHeightMm: Number(panelHeightMm),
      pixelWidth: Number(pixelWidth),
      pixelHeight: Number(pixelHeight),
      weightKg: numberOrNull(weightKg),
      powerMaxW: numberOrNull(powerMaxW)
    });
  }

  return (
    <form className="border-t border-slate-300 bg-[#f6f7f9]" onSubmit={handleSubmit}>
      <div className="grid gap-2 px-2 py-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Brand
            </span>
            <input
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Model
            </span>
            <input
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Pitch
            </span>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={pitchMm}
              onChange={(event) => setPitchMm(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Width mm
            </span>
            <input
              type="number"
              min="1"
              value={panelWidthMm}
              onChange={(event) => setPanelWidthMm(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Height mm
            </span>
            <input
              type="number"
              min="1"
              value={panelHeightMm}
              onChange={(event) => setPanelHeightMm(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Pixel W
            </span>
            <input
              type="number"
              min="1"
              value={pixelWidth}
              onChange={(event) => setPixelWidth(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Pixel H
            </span>
            <input
              type="number"
              min="1"
              value={pixelHeight}
              onChange={(event) => setPixelHeight(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Weight kg
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
            />
          </label>
        </div>

        <label className="text-[12px]">
          <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
            Max Power W
          </span>
          <input
            type="number"
            min="0"
            value={powerMaxW}
            onChange={(event) => setPowerMaxW(event.target.value)}
            className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
          />
        </label>
      </div>

      <div className="flex gap-2 border-t border-slate-300 px-2 py-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-slate-600 bg-[#c9d0d8] px-2 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-900 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-[#e5e7eb]"
        >
          {isSubmitting ? "Saving..." : initialValue ? "Update Panel" : "Create Panel"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-slate-400 bg-white px-2 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
