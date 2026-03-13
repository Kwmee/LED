import type { Panel } from "@/types/panel";
import type { Processor } from "@/types/processor";

export type ScreenPixels = {
  widthPixels: number;
  heightPixels: number;
};

export type PanelGrid = {
  columns: number;
  rows: number;
  totalPanels: number;
};

export type PortMapping = {
  portNumber: number;
  startColumn: number;
  endColumn: number;
  color: string;
};

export type ConfigurationSummary = {
  widthM: number;
  heightM: number;
  pitch: number;
  resolution: ScreenPixels;
  totalPixels: number;
  panel: Panel;
  processor: Processor;
  panelGrid: PanelGrid;
  portsRequired: number;
  portMapping: PortMapping[];
};

export type ProjectRecord = {
  id: string;
  userId: string;
  widthM: number;
  heightM: number;
  pitch: number;
  panelId: string;
  processorId: string;
  configJson: ConfigurationSummary;
  createdAt: string;
};
