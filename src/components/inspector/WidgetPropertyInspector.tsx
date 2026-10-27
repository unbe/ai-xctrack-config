import React, { useState } from 'react';
import {
  X,
  Trash2,
  Copy,
  Layers,
  Move,
  Maximize2,
  Minimize2,
  AlignCenter,
  AlignJustify,
  Eye,
  Type,
  Palette,
  Sliders,
  Settings2,
  Code,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ArrowLeft,
  ArrowUpDown,
  Plus,
  Search,
  Map as MapIcon,
  Mountain,
  Navigation,
  Wind,
  CloudRain,
  Flame,
  Radio,
  Compass,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { normToGrid, gridToNorm } from '../../utils/gridMath';
import { parseXctrackColor, rgbaToHex8, rgbaToSignedInt, parseHexColor } from '../../utils/colorMath';
import { XcfgWidget } from '../../types/xcfg';
import {
  MAP_THEMES,
  TERRAIN_STYLES,
  MAP_APPEARANCE_PRESETS,
  getMapTheme,
  getTerrainStyle,
  MapAppearancePreset,
} from '../../data/map-styles';
import { MapStyleGalleryModal } from './MapStyleGalleryModal';

export const WidgetPropertyInspector: React.FC = () => {
  const store = useEditorStore();
  const [activeSection, setActiveSection] = useState<'all' | 'geometry' | 'appearance' | 'specific' | 'raw'>('all');
  const [showRawJson, setShowRawJson] = useState(false);
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');
  const [widgetSearchQuery, setWidgetSearchQuery] = useState('');
  const [mapGalleryOpen, setMapGalleryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'z-order' | 'page-order'>('z-order');

  const page = editorStore.getCurrentPage();
  const widgets = page?.widgets || [];
  const selectedIdx = store.selectedWidgetIndices[0];
  const widget = page && selectedIdx !== undefined ? page.widgets[selectedIdx] : undefined;

  // If no widget is selected: display the full Page Widgets & Layers List
  if (!widget) {
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

    const currentGrid = editorStore.getCurrentGrid();

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
              No widgets match "{widgetSearchQuery}".
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
                  onClick={() => editorStore.selectWidget(originalIndex, false)}
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
                        editorStore.reorderWidget(originalIndex, widgets.length - 1);
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
                        editorStore.reorderWidget(originalIndex, originalIndex + 1);
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
                        editorStore.reorderWidget(originalIndex, originalIndex - 1);
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
                        editorStore.reorderWidget(originalIndex, 0);
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
                        editorStore.duplicateWidget(originalIndex);
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
                        editorStore.deleteWidget(originalIndex);
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
  }

  const w = widget as Record<string, any>;
  const def = getWidgetDefinition(widget.CLASS);
  const currentGrid = editorStore.getCurrentGrid();
  const isMapWidget = widget.CLASS.includes('WXCAssistant') || widget.CLASS.includes('WCompMap');

  // Map appearance settings
  const appearance = w.mapWidget_mapAppearance || {};
  const currentTheme = appearance.theme || (w.mapWidget_showOpenStreet === false ? 'None' : 'ClearpilotForest');
  const currentTerrain = appearance.terrain || (w.mapWidget_showTerrain === false ? 'None' : 'Light');
  const isRoadmapEnabled = currentTheme !== 'None' && w.mapWidget_showOpenStreet !== false;
  const isTerrainEnabled = currentTerrain !== 'None' && w.mapWidget_showTerrain !== false;

  // Grid coordinates
  const gx1 = normToGrid(widget.X1, currentGrid.cols);
  const gy1 = normToGrid(widget.Y1, currentGrid.rows);
  const gx2 = normToGrid(widget.X2, currentGrid.cols);
  const gy2 = normToGrid(widget.Y2, currentGrid.rows);
  const gw = Math.max(1, gx2 - gx1);
  const gh = Math.max(1, gy2 - gy1);

  // Property update helpers
  const updateProp = (key: string, value: any) => {
    editorStore.updateWidget(selectedIdx, { [key]: value });
  };

  const handleSetMapAppearance = (newTheme: string, newTerrain: string) => {
    editorStore.updateWidget(selectedIdx, {
      mapWidget_mapAppearance: {
        theme: newTheme,
        terrain: newTerrain,
      },
      mapWidget_showOpenStreet: newTheme !== 'None',
      mapWidget_showTerrain: newTerrain !== 'None',
    });
  };

  const handleToggleRoadmap = (enabled: boolean) => {
    const nextTheme = enabled
      ? currentTheme === 'None'
        ? 'ClearpilotForest'
        : currentTheme
      : 'None';
    handleSetMapAppearance(nextTheme, currentTerrain);
  };

  const handleToggleTerrain = (enabled: boolean) => {
    const nextTerrain = enabled
      ? currentTerrain === 'None'
        ? 'Light'
        : currentTerrain
      : 'None';
    handleSetMapAppearance(currentTheme, nextTerrain);
  };

  const handleGridChange = (newGx1: number, newGy1: number, newGx2: number, newGy2: number) => {
    const clampedGx1 = Math.max(0, Math.min(newGx1, currentGrid.cols - 1));
    const clampedGy1 = Math.max(0, Math.min(newGy1, currentGrid.rows - 1));
    const clampedGx2 = Math.max(clampedGx1 + 1, Math.min(newGx2, currentGrid.cols));
    const clampedGy2 = Math.max(clampedGy1 + 1, Math.min(newGy2, currentGrid.rows));

    const X1 = gridToNorm(clampedGx1, currentGrid.cols);
    const Y1 = gridToNorm(clampedGy1, currentGrid.rows);
    const X2 = gridToNorm(clampedGx2, currentGrid.cols);
    const Y2 = gridToNorm(clampedGy2, currentGrid.rows);

    editorStore.updateWidget(selectedIdx, { X1, Y1, X2, Y2 });
  };

  const fitFullWidth = () => {
    handleGridChange(0, gy1, currentGrid.cols, gy2);
  };

  const fitFullHeight = () => {
    handleGridChange(gx1, 0, gx2, currentGrid.rows);
  };

  const centerHorizontally = () => {
    const w = gw;
    const newGx1 = Math.max(0, Math.floor((currentGrid.cols - w) / 2));
    handleGridChange(newGx1, gy1, newGx1 + w, gy2);
  };

  const fillScreen = () => {
    handleGridChange(0, 0, currentGrid.cols, currentGrid.rows);
  };

  const getHexColor = (val: any, fallback = '#ff962d') => {
    if (val === undefined || val === null) return fallback;
    const rgba = parseXctrackColor(val);
    const r = rgba.r.toString(16).padStart(2, '0');
    const g = rgba.g.toString(16).padStart(2, '0');
    const b = rgba.b.toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  };

  const handleColorChange = (key: string, hex: string) => {
    const rgba = parseHexColor(hex);
    const signedInt = rgbaToSignedInt(rgba);
    updateProp(key, signedInt);
  };

  const standardManagedKeys = new Set([
    'CLASS', 'X1', 'Y1', 'X2', 'Y2',
    '_border', '_bg', '_theme',
    '_title', 'titletext', '_unit', '_hide_labels', '_units',
    'rotation', 'showCompass', 'mapWidget_scale', 'tracklog_color',
    'mapWidget_mapAppearance', 'mapWidget_showOpenStreet', 'mapWidget_showTerrain',
    'mapWidget_showRainRadar', 'mapWidget_showKK7', 'mapWidget_KK7opacity',
    'mapWidget_KK7timed', 'mapWidget_KK7timedOpacity', 'mapWidget_showAirspaces',
    'mapWidget_emergencyObstacles', 'mapWidget_drawScale', 'mapWidget_pilotPosCenter',
    'mapWidget_drawBearing', 'wpt_showWaypoints', 'wpt_showCities', 'wpt_showTakeoffs',
    'nav_showWind', 'faiAreas',
    'action', 'longClick', 'phone_number',
    'text', 'text_size', 'color_text', 'bold', 'italic', 'align',
    'url', 'refresh_interval', 'allowGsp',
  ]);

  const rawKeys = Object.keys(widget).filter((k) => !standardManagedKeys.has(k));

  return (
    <div className="w-80 bg-xctrack-card border-l border-xctrack-border flex flex-col h-full overflow-hidden select-none text-xs">
      {/* Top Quick Widget Switcher & Back to Layers Dropdown */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-950/80 border-b border-xctrack-border text-xs">
        <button
          onClick={() => editorStore.clearSelection()}
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
          onChange={(e) => editorStore.selectWidget(parseInt(e.target.value), false)}
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
            editorStore.selectWidget(prev, false);
          }}
          className="p-1 rounded bg-xctrack-dark border border-xctrack-border hover:text-white text-gray-400 transition-colors"
          title="Previous Widget"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            const next = (selectedIdx + 1) % widgets.length;
            editorStore.selectWidget(next, false);
          }}
          className="p-1 rounded bg-xctrack-dark border border-xctrack-border hover:text-white text-gray-400 transition-colors"
          title="Next Widget"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => editorStore.clearSelection()}
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
            onClick={() => editorStore.reorderWidget(selectedIdx, widgets.length - 1)}
            disabled={selectedIdx === widgets.length - 1}
            title="Bring to Front (Top Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editorStore.reorderWidget(selectedIdx, selectedIdx + 1)}
            disabled={selectedIdx === widgets.length - 1}
            title="Bring Forward (Up 1 Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editorStore.reorderWidget(selectedIdx, selectedIdx - 1)}
            disabled={selectedIdx === 0}
            title="Send Backward (Down 1 Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editorStore.reorderWidget(selectedIdx, 0)}
            disabled={selectedIdx === 0}
            title="Send to Back (Bottom / Map Layer)"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-gray-700 mx-0.5" />
          <button
            onClick={() => editorStore.duplicateSelectedWidgets()}
            title="Duplicate Widget"
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editorStore.deleteSelectedWidgets()}
            title="Delete Widget"
            className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-xctrack-border bg-black/10 text-[10px] font-medium text-gray-400">
        <button
          onClick={() => setActiveSection('all')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeSection === 'all'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent hover:text-white'
          }`}
        >
          All
        </button>
        {isMapWidget && (
          <button
            onClick={() => setActiveSection('specific')}
            className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
              activeSection === 'specific'
                ? 'border-sky-500 text-sky-400 font-semibold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Map Styles
          </button>
        )}
        <button
          onClick={() => setActiveSection('geometry')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeSection === 'geometry'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent hover:text-white'
          }`}
        >
          Size & Pos
        </button>
        <button
          onClick={() => setActiveSection('appearance')}
          className={`flex-1 py-1.5 text-center transition-colors border-b-2 ${
            activeSection === 'appearance'
              ? 'border-sky-500 text-sky-400 font-semibold'
              : 'border-transparent hover:text-white'
          }`}
        >
          Border & BG
        </button>
      </div>

      {/* Scrollable Properties Form */}
      <div className="flex-1 overflow-y-auto divide-y divide-xctrack-border/60">
        {/* MAP SETTINGS & MAP APPEARANCE */}
        {isMapWidget && (activeSection === 'all' || activeSection === 'specific') && (
          <div className="p-3 space-y-3.5 bg-slate-950/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5 text-sky-400" /> Map Appearance & Style
              </span>
              <button
                onClick={() => setMapGalleryOpen(true)}
                className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/60 transition-colors shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Browse Gallery</span>
              </button>
            </div>

            {/* Road Map (OSM Vector) Primary Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-xctrack-dark border border-xctrack-border">
              <div>
                <span className="text-xs text-white block font-medium">Road Map (OpenStreetMap)</span>
                <span className="text-[10px] text-gray-400">
                  {isRoadmapEnabled
                    ? `Active: ${getMapTheme(currentTheme).name}`
                    : 'Disabled (No road vectors, terrain only)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isRoadmapEnabled}
                onChange={(e) => handleToggleRoadmap(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Active Style Badge & Quick Switcher */}
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Road Theme:</span>
                <span className="font-semibold text-sky-400">{getMapTheme(currentTheme).name}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-400">Terrain Relief:</span>
                <span className="font-semibold text-emerald-400">{getTerrainStyle(currentTerrain).name}</span>
              </div>

              {/* Vector Road Map Theme Dropdown */}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <label className="text-[10px] text-gray-400 block font-medium">Vector Road Map Style</label>
                <select
                  value={currentTheme}
                  onChange={(e) => handleSetMapAppearance(e.target.value, currentTerrain)}
                  className="w-full bg-xctrack-dark border border-xctrack-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {MAP_THEMES.map((theme) => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name} {theme.isPro ? '[PRO]' : ''} {theme.hasRoads ? '' : '(No Roads)'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Terrain & Hillshading Dropdown */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] text-gray-400 block font-medium">Terrain Relief / Hillshading</label>
                <select
                  value={currentTerrain}
                  onChange={(e) => handleSetMapAppearance(currentTheme, e.target.value)}
                  className="w-full bg-xctrack-dark border border-xctrack-border rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  {TERRAIN_STYLES.map((terrain) => (
                    <option key={terrain.id} value={terrain.id}>
                      {terrain.name} {terrain.isPro ? '[PRO]' : ''} {terrain.hasHillshading ? '• Hillshaded' : '• Flat'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Popular Presets Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                Quick Popular Presets
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { theme: 'ClearpilotForest', terrain: 'Light', label: 'Clearpilot [forests]' },
                  { theme: 'HyperpilotBlack', terrain: 'DarkShading', label: 'Hyperpilot-black' },
                  { theme: 'Clearpilot', terrain: 'XContest', label: 'XContest Topo' },
                  { theme: 'Osmagray', terrain: 'LightShading', label: 'OSMAGRAY (E-Ink)' },
                  { theme: 'Newtron', terrain: 'DarkShading', label: 'NEWTRON' },
                  { theme: 'None', terrain: 'Light', label: 'Relief Only (No Roads)' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSetMapAppearance(preset.theme, preset.terrain)}
                    className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                      currentTheme === preset.theme && currentTerrain === preset.terrain
                        ? 'bg-sky-600 text-white border-sky-500 font-semibold shadow-sm'
                        : 'bg-xctrack-dark text-gray-300 border-xctrack-border hover:border-gray-500 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Map Orientation / Rotation */}
            <div className="space-y-1 pt-1">
              <label className="text-[10px] text-gray-400 block font-medium">Map Orientation / Rotation</label>
              <select
                value={w.rotation ?? 'NORTH_AT_TOP'}
                onChange={(e) => updateProp('rotation', e.target.value)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
              >
                <option value="NORTH_AT_TOP">North at Top</option>
                <option value="BEARING_AT_TOP">Bearing at Top (Flight Track Direction)</option>
                <option value="HEADING_AT_TOP">Heading at Top (Compass Heading)</option>
                <option value="OPTIMIZED_BEARING_AT_TOP">Optimized Bearing</option>
              </select>
            </div>

            {/* Default Zoom Scale */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Default Zoom Scale</span>
                <span className="font-mono text-white">{w.mapWidget_scale?.value ?? 24}</span>
              </div>
              <input
                type="range"
                min="16"
                max="36"
                value={w.mapWidget_scale?.value ?? 24}
                onChange={(e) =>
                  updateProp('mapWidget_scale', {
                    ...(w.mapWidget_scale || {}),
                    value: parseInt(e.target.value),
                  })
                }
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Tracklog Color */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs text-gray-200 block font-medium">Tracklog Color</span>
                <span className="text-[10px] text-gray-500">Flight path trail color</span>
              </div>
              <input
                type="color"
                value={getHexColor(w.tracklog_color, '#ff962d')}
                onChange={(e) => handleColorChange('tracklog_color', e.target.value)}
                className="w-7 h-7 rounded border border-gray-600 bg-transparent cursor-pointer p-0.5"
              />
            </div>

            {/* Layer Checkboxes */}
            <div className="pt-2 border-t border-xctrack-border space-y-2">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                Map Layers & Overlays
              </span>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Rain Radar Storm Layer</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.mapWidget_showRainRadar ?? false)}
                  onChange={(e) => updateProp('mapWidget_showRainRadar', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Thermal Hotspots Overlay (KK7)</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.mapWidget_showKK7 ?? false)}
                  onChange={(e) => updateProp('mapWidget_showKK7', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>

              {w.mapWidget_showKK7 && (
                <div className="space-y-1 pl-3 border-l-2 border-amber-500/40">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>KK7 Thermals Opacity</span>
                    <span className="font-mono text-white">{w.mapWidget_KK7opacity ?? 40}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={w.mapWidget_KK7opacity ?? 40}
                    onChange={(e) => updateProp('mapWidget_KK7opacity', parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              )}

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Active Airspaces</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.mapWidget_showAirspaces ?? true)}
                  onChange={(e) => updateProp('mapWidget_showAirspaces', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Distance Scale Bar</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.mapWidget_drawScale ?? true)}
                  onChange={(e) => updateProp('mapWidget_drawScale', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Compass Rose Overlay</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.showCompass ?? true)}
                  onChange={(e) => updateProp('showCompass', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-300">Power Lines & Emergency Obstacles</span>
                <input
                  type="checkbox"
                  checked={Boolean(w.mapWidget_emergencyObstacles ?? true)}
                  onChange={(e) => updateProp('mapWidget_emergencyObstacles', e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
                />
              </label>
            </div>
          </div>
        )}

        {/* GEOMETRY & QUICK FIT */}
        {(activeSection === 'all' || activeSection === 'geometry') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Move className="w-3 h-3 text-sky-400" /> Size & Position (Grid)
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-400">Column (X1)</label>
                <input
                  type="number"
                  min={0}
                  max={currentGrid.cols - 1}
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
                  max={currentGrid.rows - 1}
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
                  max={currentGrid.cols - gx1}
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
                  max={currentGrid.rows - gy1}
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
                  onClick={fitFullWidth}
                  className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
                >
                  <Maximize2 className="w-3 h-3 rotate-45" /> Full Width
                </button>
                <button
                  onClick={fitFullHeight}
                  className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" /> Full Height
                </button>
                <button
                  onClick={centerHorizontally}
                  className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
                >
                  <AlignCenter className="w-3 h-3" /> Center Horiz
                </button>
                <button
                  onClick={fillScreen}
                  className="px-2 py-1 rounded bg-[#181d28] hover:bg-white/10 text-gray-300 hover:text-white border border-xctrack-border text-[11px] flex items-center justify-center gap-1"
                >
                  <Maximize2 className="w-3 h-3" /> Fill Screen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* APPEARANCE: TITLE, BORDER, BACKGROUND */}
        {(activeSection === 'all' || activeSection === 'appearance') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-purple-400" /> Border & Background
            </span>

            {/* Title Settings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-200 block font-medium">Show Title</span>
                  <span className="text-[10px] text-gray-500">Header title bar</span>
                </div>
                <input
                  type="checkbox"
                  checked={widget._title !== false}
                  onChange={(e) => updateProp('_title', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {widget._title !== false && (
                <div className="space-y-1 pl-2 border-l border-gray-700">
                  <label className="text-[10px] text-gray-400 block">Custom Title</label>
                  <input
                    type="text"
                    placeholder={def?.title || 'Default'}
                    value={widget.titletext ?? ''}
                    onChange={(e) => updateProp('titletext', e.target.value)}
                    className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-xs text-white"
                  />
                </div>
              )}
            </div>

            {/* Border */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs text-gray-200 block font-medium">Draw Border</span>
                <span className="text-[10px] text-gray-500">1px outline</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(widget._border)}
                onChange={(e) => updateProp('_border', e.target.checked)}
                className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {/* Background Transparency */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>Background Transparency</span>
                <span className="font-mono text-white">{widget._bg ?? 100}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={widget._bg ?? 100}
                onChange={(e) => updateProp('_bg', parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[9px] text-gray-500">
                <span>Solid (0%)</span>
                <span>Transparent (100%)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Map Style Gallery Modal */}
      <MapStyleGalleryModal
        isOpen={mapGalleryOpen}
        onClose={() => setMapGalleryOpen(false)}
        currentTheme={currentTheme}
        currentTerrain={currentTerrain}
        onSelectStyle={(theme, terrain) => {
          handleSetMapAppearance(theme, terrain);
        }}
      />
    </div>
  );
};
