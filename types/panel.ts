export type Panel = {
  id: string;
  brand: string;
  model: string;
  widthMm: number;
  heightMm: number;
  pixelWidth: number;
  pixelHeight: number;
  pitch: number;
  source?: "default" | "custom";
  userId?: string;
  weightKg?: number | null;
  powerMaxW?: number | null;
};
