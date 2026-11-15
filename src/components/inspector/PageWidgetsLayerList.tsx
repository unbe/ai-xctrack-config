import React, { useState } from 'react';
import {
  Layers,
  ArrowUpDown,
  Search,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  Copy,
  Trash2,
} from 'lucide-react';
import { XcfgWidget } from '../../types/xcfg';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { normToGrid } from '../../utils/gridMath';

export interface PageWidgetsLayerListProps {
  widgets: XcfgWidget[];
  currentGrid: { cols: number; rows: number };
  onSelectWidget: (index: number) => void;
  onReorderWidget: (from: number, to: number) => void;
  onDuplicateWidget: (index: number) => void;
  onDeleteWidget: (index: number) => void;
}

export const PageWidgetsLayerList: React.FC<PageWidgetsLayerListProps> = ({
  widgets,
  currentGrid,
  onSelectWidget,
  onReorderWidget,
  onDuplicateWidget,
  onDeleteWidget,
}) => {
  const [widgetSearchQuery, setWidgetSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'z-order' | 'page-order'>('z-order');

  const rawList = widgets.map((w, originalIndex) => ({ w, originalIndex }));
  const orderedList = viewMode === 'z-order' ? [...rawList].reverse() : rawList;

  const filteredWidgets = orderedList.filter(({ w, originalIndex }) => {
    if (!widgetSearchQuery) return true;
    const def = getWidgetDefinition(w.CLASS);
    const query = widgetSearchQuery.toLowerCase();
    const title = (w.titletext || def?.title || w.CLASS).toLowerCase();
    const shortName = (def?.shortName || '').toLowerCase();
    return title.includes(query) || shortName.includes(query) || `#${originalIndex + 1}`.includes(query);
  });

  return (
    <div className="w-80 bg-xctrack-card border-l border-xctrack-border flex flex-col h-full overflow-hidden select-none text-xs">
      {/* Header */}
      <div className="p-3 border-b border-xctrack-border bg-slate-950/40">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-white tracking-wide text-xs">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Widgets & Layers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode(viewMode === 'z-order' ? 'page-order' : 'z-order')}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-gray-300 hover:text-white border border-slate-700 transition-colors"
              title={viewMode === 'z-order' ? 'Switch to Page Order (#1..N)' : 'Switch to Layer Z-Order (Top to Bottom)'}
            >
              <ArrowUpDown className="w-2.5 h-2.5 text-sky-400" />
              <span>{viewMode === 'z-order' ? 'Z-Order' : 'Page #'}</span>
            </button>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
              {widgets.length} items
            </span>
          </div>
        </div>

        {/* Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search widgets & layers..."
            value={widgetSearchQuery}
            onChange={(e) => setWidgetSearchQuery(e.target.value)}
            className="w-full bg-xctrack-dark border border-xctrack-border rounded-lg pl-8 pr-2.5 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Scrollable Widget & Layer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {widgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No widgets on this page. Use the Widget Palette (+) to add widgets.
          </div>
        ) : filteredWidgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No widgets match &ldquo;{widgetSearchQuery}&rdquo;.
          </div>
        ) : (
          filteredWidgets.map(({ w, originalIndex }) => {
            const def = getWidgetDefinition(w.CLASS);
            const title = w.titletext || def?.title || w.CLASS.split('.').pop() || '';
            const gx1 = normToGrid(w.X1, currentGrid.cols);
            const gy1 = normToGrid(w.Y1, currentGrid.rows);
            const gx2 = normToGrid(w.X2, currentGrid.cols);
            const gy2 = normToGrid(w.Y2, currentGrid.rows);
            const isTop = originalIndex === widgets.length - 1;
            const isBottom = originalIndex === 0;

            return (
              <div
                key={originalIndex}
                onClick={() => onSelectWidget(originalIndex)}
                className="w-full text-left p-2 rounded-lg border border-xctrack-border bg-slate-900/60 hover:bg-slate-800/90 hover:border-sky-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
              >
                <div className="min-w-0 flex items-center gap-2 flex-1 mr-1">
                  <span
                    className="w-5 h-5 rounded bg-sky-950 text-sky-400 font-mono text-[10px] font-bold flex items-center justify-center border border-sky-800/60 flex-shrink-0"
                    title={`Page Index #${originalIndex + 1} • Layer ${originalIndex + 1} of ${widgets.length} (${isTop ? 'Top Layer' : isBottom ? 'Bottom Layer' : 'Mid Layer'})`}
                  >
                    #{originalIndex + 1}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold text-white truncate text-xs group-hover:text-sky-300 transition-colors">
                      {title}
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono truncate">
                      {def?.shortName || w.CLASS.split('.').pop()} • {gx2 - gx1}×{gy2 - gy1} at ({gx1},{gy1})
                    </div>
                  </div>
                </div>

                {/* Unified Layer Reordering & Quick Actions */}
                <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderWidget(originalIndex, widgets.length - 1);
                    }}
                    disabled={isTop}
                    className="p-1 hover:text-white text-gray-400 disabled:opacity-20 hover:bg-white/10 rounded transition-colors"
                    title="Bring to Front (Top Layer)"
                  >
                    <ChevronsUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderWidget(originalIndex, originalIndex + 1);
                    }}
                    disabled={isTop}
                    className="p-1 hover:text-white text-gray-400 disabled:opacity-20 hover:bg-white/10 rounded transition-colors"
                    title="Bring Forward (Up 1 Layer)"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderWidget(originalIndex, originalIndex - 1);
                    }}
                    disabled={isBottom}
                    className="p-1 hover:text-white text-gray-400 disabled:opacity-20 hover:bg-white/10 rounded transition-colors"
                    title="Send Backward (Down 1 Layer)"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderWidget(originalIndex, 0);
                    }}
                    disabled={isBottom}
                    className="p-1 hover:text-white text-gray-400 disabled:opacity-20 hover:bg-white/10 rounded transition-colors"
                    title="Send to Back (Bottom / Map Layer)"
                  >
                    <ChevronsDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateWidget(originalIndex);
                    }}
                    className="p-1 hover:text-white text-gray-400 hover:bg-white/10 rounded transition-colors"
                    title="Duplicate Widget"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteWidget(originalIndex);
                    }}
                    className="p-1 hover:text-red-400 text-gray-400 hover:bg-red-500/20 rounded transition-colors"
                    title="Delete Widget"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-2.5 border-t border-xctrack-border bg-slate-950/40 text-center text-[10px] text-gray-500">
        Z-order: higher layer widgets render over lower ones (e.g. gauges over maps).
      </div>
    </div>
  );
};
