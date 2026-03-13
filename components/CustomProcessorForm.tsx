"use client";

import { useState } from "react";
import type { Processor } from "@/types/processor";
import type { CustomProcessorInput } from "@/lib/hardwareQueries";

type CustomProcessorFormProps = {
  initialValue?: Processor | null;
  isSubmitting: boolean;
  onSubmit: (values: CustomProcessorInput) => Promise<void>;
  onCancel: () => void;
};

function numberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function CustomProcessorForm({
  initialValue,
  isSubmitting,
  onSubmit,
  onCancel
}: CustomProcessorFormProps) {
  const [brand, setBrand] = useState(initialValue?.brand ?? "");
  const [model, setModel] = useState(initialValue?.model ?? "");
  const [ports, setPorts] = useState(String(initialValue?.ports ?? ""));
  const [pixelsPerPort, setPixelsPerPort] = useState(String(initialValue?.pixelsPerPort ?? ""));
  const [maxPixels, setMaxPixels] = useState(
    initialValue?.source === "custom" ? String(initialValue.maxPixels ?? "") : ""
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await onSubmit({
      brand,
      model,
      ports: Number(ports),
      pixelsPerPort: Number(pixelsPerPort),
      maxPixels: numberOrNull(maxPixels)
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
              Ports
            </span>
            <input
              type="number"
              min="1"
              value={ports}
              onChange={(event) => setPorts(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
          <label className="text-[12px]">
            <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
              Pixels/Port
            </span>
            <input
              type="number"
              min="1"
              value={pixelsPerPort}
              onChange={(event) => setPixelsPerPort(event.target.value)}
              className="h-8 w-full border border-slate-400 bg-white px-2 text-slate-900 outline-none focus:border-slate-700"
              required
            />
          </label>
        </div>

        <label className="text-[12px]">
          <span className="mb-1 block font-medium uppercase tracking-[0.04em] text-slate-600">
            Max Pixels
          </span>
          <input
            type="number"
            min="1"
            value={maxPixels}
            onChange={(event) => setMaxPixels(event.target.value)}
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
          {isSubmitting ? "Saving..." : initialValue ? "Update Processor" : "Create Processor"}
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
