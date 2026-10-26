import React from 'react';
import {
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  Trash2,
  Layers,
  Eye,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { normToGrid } from '../../utils/gridMath';

export const LayerOrderPanel: React.FC = () => {
  const store = useEditorStore();
  const currentPage = editorStore.getCurrentPage();
  const widgets = currentPage?.widgets || [];
  const currentGrid = editorStore.getCurrentGrid();
  const selectedIndices = store.selectedWidgetIndices;

  // In XCTrack, array order controls Z-index:
  // widgets[0] is rendered at the bottom (e.g. background map),
  // widgets[widgets.length - 1] is rendered at the very top.
  // We display the layers with top-most layer at top of UI.
  const reversedLayers = [...widgets].map((w, originalIdx) => ({
    widget: w,
    originalIndex: originalIdx,
  })).reverse();

  return (
    <div className="w-64 bg-xctrack-card border-r border-xctrack-border flex flex-col h-full select-none text-xs">
      <div className="p-3 border-b border-xctrack-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-white tracking-wide text-xs">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span>Layers (Z-Order)</span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {widgets.length} items
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {reversedLayers.map(({ widget, originalIndex }) => {
          const isSelected = selectedIndices.includes(originalIndex);
          const def = getWidgetDefinition(widget.CLASS);
          const title = widget.titletext || def?.title || widget.CLASS.split('.').pop() || '';

          const gx1 = normToGrid(widget.X1, currentGrid.cols);
          const gy1 = normToGrid(widget.Y1, currentGrid.rows);
          const gx2 = normToGrid(widget.X2, currentGrid.cols);
          const gy2 = normToGrid(widget.Y2, currentGrid.rows);

          return (
            <div
              key={originalIndex}
              onClick={() => editorStore.selectWidget(originalIndex, false)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-500/60 ring-1 ring-sky-500/30 text-white'
                  : 'bg-xctrack-dark/70 border-xctrack-border hover:border-gray-600 text-gray-300'
              }`}
            >
              <div className="truncate mr-1">
                <div className="font-medium truncate text-xs">{title}</div>
                <div className="text-[10px] text-gray-500 font-mono">
                  {def?.shortName || ''} • {gx2 - gx1}×{gy2 - gy1} at ({gx1},{gy1})
                </div>
              </div>

              {/* Layer Actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderWidget(originalIndex, widgets.length - 1);
                  }}
                  disabled={originalIndex === widgets.length - 1}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Bring to Front"
                >
                  <ChevronsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderWidget(originalIndex, originalIndex + 1);
                  }}
                  disabled={originalIndex === widgets.length - 1}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Bring Forward"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderWidget(originalIndex, originalIndex - 1);
                  }}
                  disabled={originalIndex === 0}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Send Backward"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderWidget(originalIndex, 0);
                  }}
                  disabled={originalIndex === 0}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Send to Back"
                >
                  <ChevronsDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {widgets.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-xs">
            No widgets on this page
          </div>
        )}
      </div>
    </div>
  );
};
