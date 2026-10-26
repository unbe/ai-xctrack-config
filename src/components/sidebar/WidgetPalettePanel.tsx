import React, { useState } from 'react';
import { Search, Plus, Sparkles, Filter, X } from 'lucide-react';
import {
  WIDGET_CATALOG,
  WIDGET_CATEGORIES,
  searchWidgets,
  getWidgetsByCategory,
  WidgetCategory,
} from '../../data/widgets-catalog';
import { WidgetDefinition, XcfgWidget } from '../../types/xcfg';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { gridToNorm } from '../../utils/gridMath';

export const WidgetPalettePanel: React.FC = () => {
  const store = useEditorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const currentGrid = editorStore.getCurrentGrid();

  // Filter widgets
  let displayedWidgets: WidgetDefinition[] = WIDGET_CATALOG;
  if (searchQuery.trim()) {
    displayedWidgets = searchWidgets(searchQuery);
  } else if (selectedCategory !== 'All') {
    displayedWidgets = getWidgetsByCategory()[selectedCategory as WidgetCategory] || [];
  }

  const handleAddWidget = (def: WidgetDefinition) => {
    // Center the widget on the canvas according to its default grid size
    const gw = Math.min(def.defaultGrid.width, currentGrid.cols);
    const gh = Math.min(def.defaultGrid.height, currentGrid.rows);

    const gx1 = Math.max(0, Math.floor((currentGrid.cols - gw) / 2));
    const gy1 = Math.max(0, Math.floor((currentGrid.rows - gh) / 2));
    const gx2 = gx1 + gw;
    const gy2 = gy1 + gh;

    const newWidget: XcfgWidget = {
      CLASS: def.className,
      X1: gridToNorm(gx1, currentGrid.cols),
      Y1: gridToNorm(gy1, currentGrid.rows),
      X2: gridToNorm(gx2, currentGrid.cols),
      Y2: gridToNorm(gy2, currentGrid.rows),
      _border: def.className.includes('Button') ? true : false,
      _bg: def.className.includes('Button') ? 80 : 100, // 100 = transparent
      _theme: '',
    };

    // Initialize default properties from definition
    for (const prop of def.properties) {
      if (prop.defaultValue !== undefined && newWidget[prop.key] === undefined) {
        newWidget[prop.key] = JSON.parse(JSON.stringify(prop.defaultValue));
      }
    }

    editorStore.addWidget(newWidget);
  };

  return (
    <div className="w-72 bg-xctrack-card border-r border-xctrack-border flex flex-col h-full select-none text-xs">
      {/* Search Header */}
      <div className="p-3 border-b border-xctrack-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white tracking-wide text-xs">Widget Library</span>
          <span className="text-[10px] font-mono text-gray-400">
            {displayedWidgets.length} / {WIDGET_CATALOG.length}
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search widgets (e.g. speed, alt, map)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-xctrack-dark border border-xctrack-border rounded-lg pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px]">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'All' && !searchQuery
                ? 'bg-sky-600 text-white font-medium'
                : 'bg-xctrack-dark text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {WIDGET_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
              className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat && !searchQuery
                  ? 'bg-sky-600 text-white font-medium'
                  : 'bg-xctrack-dark text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Widgets List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {displayedWidgets.map((def) => (
          <div
            key={def.className}
            onClick={() => handleAddWidget(def)}
            className="p-2.5 rounded-lg bg-xctrack-dark/70 border border-xctrack-border hover:border-sky-500/60 hover:bg-xctrack-dark/90 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-1 mb-1">
              <div>
                <span className="font-semibold text-gray-200 text-xs group-hover:text-sky-300 transition-colors">
                  {def.title}
                </span>
                <span className="text-[10px] font-mono text-gray-400 ml-1.5 block">
                  {def.shortName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {def.isPro && (
                  <span className="px-1 py-0.2 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300 font-mono text-[9px] font-bold">
                    PRO
                  </span>
                )}
                <span className="px-1.5 py-0.2 rounded bg-black/40 text-gray-400 font-mono text-[9px]">
                  {def.defaultGrid.width}×{def.defaultGrid.height}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
              {def.description}
            </p>

            <div className="mt-2 pt-1.5 border-t border-xctrack-border/40 flex items-center justify-between text-[10px]">
              <span className="text-gray-400 font-medium">{def.category}</span>
              <span className="text-sky-400 font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3 h-3" /> Add to canvas
              </span>
            </div>
          </div>
        ))}

        {displayedWidgets.length === 0 && (
          <div className="text-center text-gray-500 py-8 text-xs">
            No widgets found matching &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
};
