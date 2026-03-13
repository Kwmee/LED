"use client";

import { useMemo, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import type { Panel } from "@/types/panel";
import type { PanelGrid, PortMapping } from "@/types/project";

type LedCanvasProps = {
  panelGrid: PanelGrid | null;
  portMapping: PortMapping[];
  panel: Panel | null;
  widthPixels: number;
  heightPixels: number;
  zoom: number;
  onZoomChange: (value: number) => void;
};

const CANVAS_WIDTH = 980;
const CANVAS_HEIGHT = 620;
const PADDING = 24;

export function LedCanvas({
  panelGrid,
  portMapping,
  panel,
  widthPixels,
  heightPixels,
  zoom,
  onZoomChange
}: LedCanvasProps) {
  const cellSize = useMemo(() => {
    if (!panelGrid || panelGrid.columns === 0 || panelGrid.rows === 0) {
      return 48;
    }

    const availableWidth = CANVAS_WIDTH - PADDING * 2;
    const availableHeight = CANVAS_HEIGHT - PADDING * 2;

    return Math.max(
      12,
      Math.min(availableWidth / panelGrid.columns, availableHeight / panelGrid.rows) * zoom
    );
  }, [panelGrid, zoom]);

  const panelColors = useMemo(() => {
    if (!panelGrid) {
      return [];
    }

    return Array.from({ length: panelGrid.columns * panelGrid.rows }, (_, index) => {
      const column = index % panelGrid.columns;
      const assignedPort = portMapping.find(
        (port) => column >= port.startColumn && column <= port.endColumn
      );

      return assignedPort?.color ?? "#1f2937";
    });
  }, [panelGrid, portMapping]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-slate-300 bg-[#d7dce2] px-3 py-2">
        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Canvas
          </h2>
          <div className="mt-0.5 text-sm font-medium text-gray-800">
            Display Resolution: {widthPixels} x {heightPixels}
          </div>
        </div>
        <label className="flex items-center gap-2 text-[12px] text-slate-600">
          <span className="font-semibold uppercase tracking-[0.06em]">Zoom</span>
          <input
            type="range"
            min="0.6"
            max="1.8"
            step="0.1"
            value={zoom}
            onChange={(event) => onZoomChange(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="flex-1 overflow-auto bg-[#eef2f5] p-2">
        <div className="inline-block border border-slate-400 bg-white">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#d8dde3" />
            {!panelGrid || !panel ? (
              <Text
                x={CANVAS_WIDTH / 2 - 140}
                y={CANVAS_HEIGHT / 2 - 14}
                text="Select panel and processor to render the wall"
                fill="#64748b"
                fontSize={18}
              />
            ) : (
              <>
                {Array.from({ length: panelGrid.rows }).map((_, rowIndex) =>
                  Array.from({ length: panelGrid.columns }).map((__, columnIndex) => {
                    const x = PADDING + columnIndex * cellSize;
                    const y = PADDING + rowIndex * cellSize;
                    const colorIndex = rowIndex * panelGrid.columns + columnIndex;

                    return (
                      <Rect
                        key={`${rowIndex}-${columnIndex}`}
                        x={x}
                        y={y}
                        width={cellSize - 2}
                        height={cellSize - 2}
                        fill={panelColors[colorIndex]}
                        stroke="#475569"
                        strokeWidth={0.8}
                      />
                    );
                  })
                )}
                <Text
                  x={PADDING}
                  y={CANVAS_HEIGHT - 28}
                  text={`${panelGrid.columns} x ${panelGrid.rows} panels | ${widthPixels} x ${heightPixels} px | ${panel.brand} ${panel.model}`}
                  fill="#334155"
                  fontSize={14}
                />
              </>
            )}
          </Layer>
        </Stage>
        </div>
      </div>
    </div>
  );
}
