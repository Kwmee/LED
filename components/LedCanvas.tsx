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
};

const CANVAS_WIDTH = 920;
const CANVAS_HEIGHT = 560;
const PADDING = 36;

export function LedCanvas({
  panelGrid,
  portMapping,
  panel,
  widthPixels,
  heightPixels
}: LedCanvasProps) {
  const [zoom, setZoom] = useState(1);

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
    <div className="rounded-3xl border border-stroke bg-surface/85 p-6 shadow-xl shadow-black/20 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">LED wall visualization</h2>
          <p className="mt-1 text-sm text-slate-300">
            Panel grid, port colors, and wall dimensions rendered with React Konva.
          </p>
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-300">
          <span>Zoom</span>
          <input
            type="range"
            min="0.6"
            max="1.8"
            step="0.1"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-stroke bg-canvas">
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="#0b1320" />
            {!panelGrid || !panel ? (
              <Text
                x={CANVAS_WIDTH / 2 - 140}
                y={CANVAS_HEIGHT / 2 - 14}
                text="Select panel and processor to render the wall"
                fill="#94a3b8"
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
                        stroke="#dbe4f0"
                        strokeWidth={0.8}
                        cornerRadius={2}
                      />
                    );
                  })
                )}
                <Text
                  x={PADDING}
                  y={CANVAS_HEIGHT - 28}
                  text={`${panelGrid.columns} x ${panelGrid.rows} panels | ${widthPixels} x ${heightPixels} px | ${panel.brand} ${panel.model}`}
                  fill="#e2e8f0"
                  fontSize={14}
                />
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
