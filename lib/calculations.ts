import { calculateResolutionFromDimensions } from "@/lib/resolution";
import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";
import type {
  ConfigurationSummary,
  PanelGrid,
  PortMapping,
  ScreenPixels
} from "@/types/project";

export function calculateScreenPixels(
  widthM: number,
  heightM: number,
  pitchMm: number
): ScreenPixels {
  return calculateResolutionFromDimensions(widthM, heightM, pitchMm);
}

export function calculateTotalPixels(widthPixels: number, heightPixels: number) {
  return widthPixels * heightPixels;
}

export function calculateRequiredPorts(totalPixels: number, pixelsPerPort: number) {
  return Math.ceil(totalPixels / pixelsPerPort);
}

export function calculatePanelGrid(
  widthPixels: number,
  heightPixels: number,
  panel: Panel
): PanelGrid {
  const columns = Math.ceil(widthPixels / panel.pixelWidth);
  const rows = Math.ceil(heightPixels / panel.pixelHeight);

  return {
    columns,
    rows,
    totalPanels: columns * rows
  };
}

export function isProcessorCompatible(
  totalPixels: number,
  requiredPorts: number,
  processor: Processor
) {
  return totalPixels <= processor.maxPixels && requiredPorts <= processor.ports;
}

type SummaryParams = {
  widthM: number;
  heightM: number;
  pitch: number;
  panel: Panel;
  processor: Processor;
  screenPixels: ScreenPixels;
  totalPixels: number;
  panelGrid: PanelGrid;
  portMapping: PortMapping[];
};

export function buildConfigurationSummary({
  widthM,
  heightM,
  pitch,
  panel,
  processor,
  screenPixels,
  totalPixels,
  panelGrid,
  portMapping
}: SummaryParams): ConfigurationSummary {
  return {
    widthM,
    heightM,
    pitch,
    resolution: screenPixels,
    totalPixels,
    panel,
    processor,
    panelGrid,
    portsRequired: calculateRequiredPorts(totalPixels, processor.pixelsPerPort),
    portMapping
  };
}
