import type { PortMapping } from "@/types/project";

const PORT_COLORS = [
  "#ef7d00",
  "#22c55e",
  "#38bdf8",
  "#f43f5e",
  "#a78bfa",
  "#facc15",
  "#14b8a6",
  "#fb7185"
];

export function buildPortMapping(
  totalColumns: number,
  pixelsPerPort: number,
  totalPixels: number
): PortMapping[] {
  if (totalColumns <= 0 || pixelsPerPort <= 0 || totalPixels <= 0) {
    return [];
  }

  const portsRequired = Math.ceil(totalPixels / pixelsPerPort);
  const columnsPerPort = Math.ceil(totalColumns / portsRequired);

  return Array.from({ length: portsRequired }, (_, index) => {
    const startColumn = index * columnsPerPort;
    const endColumn = Math.min(totalColumns - 1, startColumn + columnsPerPort - 1);

    return {
      portNumber: index + 1,
      startColumn,
      endColumn,
      color: PORT_COLORS[index % PORT_COLORS.length]
    };
  }).filter((port) => port.startColumn <= port.endColumn);
}
