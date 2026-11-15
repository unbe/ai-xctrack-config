import React from 'react';
import {
  X,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
} from 'lucide-react';
import { XcfgWidget } from '../../types/xcfg';
import { getWidgetDefinition } from '../../data/widgets-catalog';

export interface InspectorHeaderProps {
  selectedIdx: number;
  widgets: XcfgWidget[];
  widget: XcfgWidget;
  onSelectWidget: (index: number) => void;
  onClearSelection: () => void;
  onReorderWidget: (from: number, to: number) => void;
  onDuplicateWidget: () => void;
  onDeleteWidget: () => void;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({
  selectedIdx,
  widgets,
  widget,
  onSelectWidget,
  onClearSelection,
  onReorderWidget,
  onDuplicateWidget,
  onDeleteWidget,
}) => {
  const def = getWidgetDefinition(widget.CLASS);

  return (
    <>
      {/* Top Quick Widget Switcher & Back to Layers Dropdown */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-xctrack-border text-xs">
        <button
          onClick={onClearSelection}
          className="flex items-center gap-1 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-medium border border-slate-700 transition-colors text-[11px]"
          title="Back to all Widgets & Layers list"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Widgets</span>
        </button>

        <span className="text-[10px] font-mono text-sky-400 font-semibold px-1 py-0.5 rounded bg-sky-950 border border-sky-800">
          #{selectedIdx + 1}
        </span>

        {/* Dropdown to switch widget from list */}
        <select
          value={selectedIdx}
          onChange={(e) => onSelectWidget(parseInt(e.target.value))}
          className="flex-1 bg-xctrack-dark border border-xctrack-border rounded px-2 py-1 text-xs text-white truncate focus:outline-none focus:border-sky-500 cursor-pointer"
          title="Select widget from page list"
        >
          {widgets.map((w, idx) => {
            const d = getWidgetDefinition(w.CLASS);
            return (
              <option key={idx} value={idx}>
                #{idx + 1}: {w.titletext || d?.title || w.CLASS.split('.').pop()}
              </option>
            );
          })}
        </select>

        {/* Prev / Next buttons */}
        <button
          onClick={() => {
            const prev = (selectedIdx - 1 + widgets.length) % widgets.length;
            onSelectWidget(prev);
          }}
          className="p-1 rounded bg-xctrack-dark border border-xctrack-border hover:text-white text-gray-400 transition-colors"
          title="Previous Widget"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            const next = (selectedIdx + 1) % widgets.length;
            onSelectWidget(next);
          }}
          className="p-1 rounded bg-xctrack-dark border border-xctrack-border hover:text-white text-gray-400 transition-colors"
          title="Next Widget"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClearSelection}
          className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          title="Close Inspector & View Page Widget List"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Widget Header Actions with Layer Controls */}
      <div className="p-2.5 border-b border-xctrack-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-white truncate text-xs">
            {def ? def.title : widget.CLASS.split('.').pop()}
          </span>
          {def?.isPro && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              PRO
            </span>
          )}
          <span className="text-[10px] text-gray-500 font-mono">
            (Layer {selectedIdx + 1}/{widgets.length})
          </span>
        </div>

        {/* Unified Layer Reordering & Actions for Selected Widget */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => onReorderWidget(selectedIdx, widgets.length - 1)}
            disabled={selectedIdx === widgets.length - 1}
            title="Bring to Front (Top Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onReorderWidget(selectedIdx, selectedIdx + 1)}
            disabled={selectedIdx === widgets.length - 1}
            title="Bring Forward (Up 1 Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onReorderWidget(selectedIdx, selectedIdx - 1)}
            disabled={selectedIdx === 0}
            title="Send Backward (Down 1 Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onReorderWidget(selectedIdx, 0)}
            disabled={selectedIdx === 0}
            title="Send to Back (Bottom / Map Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-gray-700 mx-0.5" />
          <button
            onClick={onDuplicateWidget}
            title="Duplicate Widget"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDeleteWidget}
            title="Delete Widget"
            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
};
