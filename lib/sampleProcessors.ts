import type { Processor } from "@/types/processor";

export const sampleProcessors: Processor[] = [
  {
    id: "proc-novastar-mx40",
    brand: "NovaStar",
    model: "MX40 Pro",
    maxPixels: 10000000,
    ports: 20,
    pixelsPerPort: 650000
  },
  {
    id: "proc-brompton-s8",
    brand: "Brompton",
    model: "S8",
    maxPixels: 5300000,
    ports: 8,
    pixelsPerPort: 650000
  },
  {
    id: "proc-colorlight-z6",
    brand: "Colorlight",
    model: "Z6 Pro",
    maxPixels: 8800000,
    ports: 12,
    pixelsPerPort: 650000
  }
];
