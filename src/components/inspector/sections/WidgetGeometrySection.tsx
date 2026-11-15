import React from 'react';
import {
  Move,
  ChevronDown,
  ChevronRight,
  Maximize2,
  AlignCenter,
} from 'lucide-react';
import { XcfgWidget } from '../../../types/xcfg';
import { normToGrid, gridToNorm } from '../../../utils/gridMath';

export interface WidgetGeometrySectionProps {
  widget: XcfgWidget;
  grid: { cols: number; rows: number };
  onUpdateCoords: (X1: number, Y1: number, X2: number, Y2: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const WidgetGeometrySection: React.FC<WidgetGeometrySectionProps> = ({
  widget,
  grid,
  onUpdateCoords,
  isOpen,
  onToggle,
}) => {
  const gx1 = normToGrid(widget.X1, grid.cols);
  const gy1 = normToGrid(widget.Y1, grid.rows);
  const gx2 = normToGrid(widget.X2, grid.cols);
  const gy2 = normToGrid(widget.Y2, grid.rows);
  const gw = Math.max(1, gx2 - gx1);
  const gh = Math.max(1, gy2 - gy1);

  const handleGridChange = (newGx1: number, newGy1: number, newGx2: number, newGy2: number) => {
    const clampedGx1 = Math.max(0, Math.min(newGx1, grid.cols - 1));
    const clampedGy1 = Math.max(0, Math.min(newGy1, grid.rows - 1));
    const clampedGx2 = Math.max(clampedGx1 + 1, Math.min(newGx2, grid.cols));
    const clampedGy2 = Math.max(clampedGy1 + 1, Math.min(newGy2, grid.rows));

    const X1 = gridToNorm(clampedGx1, grid.cols);
    const Y1 = gridToNorm(clampedGy1, grid.rows);
    const X2 = gridToNorm(clampedGx2, grid.cols);
    const Y2 = gridToNorm(clampedGy2, grid.rows);

    onUpdateCoords(X1, Y1, X2, Y2);
  };

  const fitFullWidth = () => {
    handleGridChange(0, gy1, grid.cols, gy2);
  };

  const fitFullHeight = () => {
    handleGridChange(gx1, 0, gx2, grid.rows);
  };

  const centerHorizontally = () => {
    const w = gw;
    const newGx1 = Math.max(0, Math.floor((grid.cols - w) / 2));
    handleGridChange(newGx1, gy1, newGx1 + w, gy2);
  };

  const fillScreen = () => {
    handleGridChange(0, 0, grid.cols, grid.rows);
  };

  return (
    <div className="border-b border-xctrack-border/60">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-xctrack-card/60 hover:bg-white/[0.04] transition-colors border-b border-xctrack-border/40 select-none text-left"
      >
        <div className="flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">
            Size & Position (Grid)
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <span className="text-[10px] font-mono text-sky-400/90 font-medium">
          {gw} × {gh} cells
        </span>
      </button>

      {isOpen && (
        <div className="p-3 space-y-3 bg-slate-950/20">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Column (X1)</label>
              <input
                type="number"
                min={0}
                max={grid.cols - 1}
                value={gx1}
                onChange={(e) => handleGridChange(parseInt(e.target.value) || 0, gy1, gx2, gy2)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Row (Y1)</label>
              <input
                type="number"
                min={0}
                max={grid.rows - 1}
                value={gy1}
                onChange={(e) => handleGridChange(gx1, parseInt(e.target.value) || 0, gx2, gy2)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Width (Cols)</label>
              <input
                type="number"
                min={1}
                max={grid.cols - gx1}
                value={gw}
                onChange={(e) => handleGridChange(gx1, gy1, gx1 + (parseInt(e.target.value) || 1), gy2)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-white font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400">Height (Rows)</label>
              <input
                type="number"
                min={1}
                max={grid.rows - gy1}
                value={gh}
                onChange={(e) => handleGridChange(gx1, gy1, gx2, gy1 + (parseInt(e.target.value) || 1))}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-white font-mono"
              />
            </div>
          </div>

          {/* Quick Fit Controls */}
          <div className="pt-2 border-t border-xctrack-border space-y-1.5">
            <span className="text-[10px] text-gray-400 block font-medium">Quick Fit</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={fitFullWidth}
                className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
              >
                <Maximize2 className="w-3 h-3 rotate-45" /> Full Width
              </button>
              <button
                type="button"
                onClick={fitFullHeight}
                className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
              >
                <Maximize2 className="w-3 h-3" /> Full Height
              </button>
              <button
                type="button"
                onClick={centerHorizontally}
                className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
              >
                <AlignCenter className="w-3 h-3" /> Center Horiz
              </button>
              <button
                type="button"
                onClick={fillScreen}
                className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
              >
                <Maximize2 className="w-3 h-3" /> Fill Screen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
