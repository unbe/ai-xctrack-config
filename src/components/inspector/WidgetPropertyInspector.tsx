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
  Plus,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { normToGrid, gridToNorm } from '../../utils/gridMath';
import { parseXctrackColor, rgbaToHex8, rgbaToSignedInt, parseHexColor } from '../../utils/colorMath';
import { XcfgWidget } from '../../types/xcfg';

export const WidgetPropertyInspector: React.FC = () => {
  const store = useEditorStore();
  const [activeSection, setActiveSection] = useState<'all' | 'geometry' | 'appearance' | 'specific' | 'raw'>('all');
  const [showRawJson, setShowRawJson] = useState(false);
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');

  const page = editorStore.getCurrentPage();
  const selectedIdx = store.selectedWidgetIndices[0];
  const widget = page && selectedIdx !== undefined ? page.widgets[selectedIdx] : undefined;

  if (!widget) {
    return (
      <div className="w-80 bg-xctrack-card border-l border-xctrack-border flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-semibold text-gray-300 mb-1">No Widget Selected</h3>
        <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">
          Click on any widget on the screen canvas or layers panel to inspect and customize its settings.
        </p>
      </div>
    );
  }

  const w = widget as Record<string, any>;
  const def = getWidgetDefinition(widget.CLASS);
  const currentGrid = editorStore.getCurrentGrid();

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

  const removeProp = (key: string) => {
    const updated = { ...widget };
    delete updated[key];
    editorStore.updateWidget(selectedIdx, updated);
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

  // Quick fit actions
  const fitFullWidth = () => {
    handleGridChange(0, gy1, currentGrid.cols, gy2);
  };

  const fitFullHeight = () => {
    handleGridChange(gx1, 0, gx2, currentGrid.rows);
  };

  const centerHorizontally = () => {
    const startX = Math.max(0, Math.floor((currentGrid.cols - gw) / 2));
    handleGridChange(startX, gy1, startX + gw, gy2);
  };

  const centerVertically = () => {
    const startY = Math.max(0, Math.floor((currentGrid.rows - gh) / 2));
    handleGridChange(gx1, startY, gx2, startY + gh);
  };

  const fillScreen = () => {
    handleGridChange(0, 0, currentGrid.cols, currentGrid.rows);
  };

  // Color conversion for tracklog or color_text
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

  // Identify known properties already managed in specific UI sections
  const standardManagedKeys = new Set([
    'CLASS', 'X1', 'Y1', 'X2', 'Y2',
    '_border', '_bg', '_theme',
    '_title', 'titletext', '_unit', '_hide_labels', '_units',
    'rotation', 'showCompass', 'mapWidget_scale', 'tracklog_color', 'mapWidget_mapAppearance',
    'action', 'longClick', 'phone_number',
    'text', 'text_size', 'color_text', 'bold', 'italic', 'align',
    'url', 'refresh_interval', 'allowGsp',
  ]);

  const rawKeys = Object.keys(widget).filter((k) => !standardManagedKeys.has(k));

  return (
    <div className="w-80 bg-xctrack-card border-l border-xctrack-border flex flex-col h-full overflow-hidden select-none text-xs">
      {/* Widget Header */}
      <div className="p-3 border-b border-xctrack-border bg-black/20">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-white truncate text-xs">
              {def ? def.title : widget.CLASS.split('.').pop()}
            </span>
            {def?.isPro && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
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
            <button
              onClick={() => editorStore.clearSelection()}
              title="Close Inspector"
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span className="truncate max-w-[200px]" title={widget.CLASS}>
            {def ? def.shortName : widget.CLASS.split('.').pop()}
          </span>
          <span className="text-gray-500">#{selectedIdx + 1} of {page?.widgets.length}</span>
        </div>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-xctrack-border/50">
        {/* SECTION 1: GEOMETRY & GRID POSITION */}
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Move className="w-3 h-3 text-sky-400" /> Geometry & Grid
            </span>
            <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
              {gw} × {gh} cells
            </span>
          </div>

          {/* Grid bounds */}
          <div className="grid grid-cols-2 gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Column (X1 - X2)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max={currentGrid.cols - 1}
                  value={gx1}
                  onChange={(e) => handleGridChange(parseInt(e.target.value) || 0, gy1, gx2, gy2)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-center font-mono text-white text-xs"
                />
                <span className="text-gray-500 text-xs">→</span>
                <input
                  type="number"
                  min={gx1 + 1}
                  max={currentGrid.cols}
                  value={gx2}
                  onChange={(e) => handleGridChange(gx1, gy1, parseInt(e.target.value) || gx1 + 1, gy2)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-center font-mono text-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 block mb-1">Row (Y1 - Y2)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max={currentGrid.rows - 1}
                  value={gy1}
                  onChange={(e) => handleGridChange(gx1, parseInt(e.target.value) || 0, gx2, gy2)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-center font-mono text-white text-xs"
                />
                <span className="text-gray-500 text-xs">→</span>
                <input
                  type="number"
                  min={gy1 + 1}
                  max={currentGrid.rows}
                  value={gy2}
                  onChange={(e) => handleGridChange(gx1, gy1, gx2, parseInt(e.target.value) || gy1 + 1)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-center font-mono text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Quick Fit buttons */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              onClick={fitFullWidth}
              className="py-1 px-1.5 rounded bg-[#181d28] hover:bg-[#222838] border border-xctrack-border text-[10px] text-gray-300 hover:text-white transition-colors"
            >
              Full Width
            </button>
            <button
              onClick={fitFullHeight}
              className="py-1 px-1.5 rounded bg-[#181d28] hover:bg-[#222838] border border-xctrack-border text-[10px] text-gray-300 hover:text-white transition-colors"
            >
              Full Height
            </button>
            <button
              onClick={fillScreen}
              className="py-1 px-1.5 rounded bg-[#181d28] hover:bg-[#222838] border border-xctrack-border text-[10px] text-gray-300 hover:text-white transition-colors"
            >
              Fill Screen
            </button>
            <button
              onClick={centerHorizontally}
              className="py-1 px-1.5 rounded bg-[#181d28] hover:bg-[#222838] border border-xctrack-border text-[10px] text-gray-300 hover:text-white transition-colors"
            >
              Center Horiz
            </button>
            <button
              onClick={centerVertically}
              className="py-1 px-1.5 rounded bg-[#181d28] hover:bg-[#222838] border border-xctrack-border text-[10px] text-gray-300 hover:text-white transition-colors"
            >
              Center Vert
            </button>
            <button
              onClick={() => {
                editorStore.setSnapToGrid(!store.snapToGrid);
              }}
              className={`py-1 px-1.5 rounded border text-[10px] transition-colors ${
                store.snapToGrid
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                  : 'bg-[#181d28] border-xctrack-border text-gray-400'
              }`}
            >
              Snap {store.snapToGrid ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Raw Normalized Coordinates */}
          <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between pt-1">
            <span>X: {widget.X1}..{widget.X2}</span>
            <span>Y: {widget.Y1}..{widget.Y2}</span>
          </div>
        </div>

        {/* SECTION 2: APPEARANCE & STYLING */}
        <div className="p-3 space-y-3">
          <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-purple-400" /> Appearance & Style
          </span>

          {/* Border */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs text-gray-200 block font-medium">Border</span>
              <span className="text-[10px] text-gray-500">Draw border around widget</span>
            </div>
            <input
              type="checkbox"
              checked={widget._border ?? false}
              onChange={(e) => updateProp('_border', e.target.checked)}
              className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Background Transparency */}
          <div className="space-y-1.5 bg-black/20 p-2.5 rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-200 block font-medium">Background Transparency</span>
                <span className="text-[10px] text-gray-500">
                  {widget._bg === 100
                    ? '100% (Transparent)'
                    : widget._bg === 0
                    ? '0% (Solid opaque)'
                    : `${widget._bg ?? 100}% transparent`}
                </span>
              </div>
              <div
                className="w-6 h-6 rounded border border-white/20 shadow-inner flex items-center justify-center overflow-hidden"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, #111 25%, #111 75%, #333 75%, #333)',
                  backgroundPosition: '0 0, 4px 4px',
                  backgroundSize: '8px 8px',
                }}
              >
                <div
                  className="w-full h-full bg-black transition-opacity"
                  style={{ opacity: Math.max(0, 1 - (widget._bg ?? 100) / 100) }}
                />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={widget._bg ?? 100}
              onChange={(e) => updateProp('_bg', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            <div className="flex justify-between text-[9px] text-gray-500 pt-0.5">
              <button onClick={() => updateProp('_bg', 0)} className="hover:text-white">Opaque (0%)</button>
              <button onClick={() => updateProp('_bg', 50)} className="hover:text-white">50%</button>
              <button onClick={() => updateProp('_bg', 80)} className="hover:text-white">80%</button>
              <button onClick={() => updateProp('_bg', 100)} className="hover:text-white">Transparent (100%)</button>
            </div>
          </div>

          {/* Theme Override */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 block">Theme Override</label>
            <select
              value={widget._theme ?? ''}
              onChange={(e) => updateProp('_theme', e.target.value)}
              className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
            >
              <option value="">Default (Inherit Page Theme)</option>
              <option value="BlackTheme">Black Theme (OLED / High Contrast)</option>
              <option value="WhiteTheme">White Theme (Daylight e-ink)</option>
              <option value="TransparentTheme">Transparent Theme</option>
              <option value="AmberTheme">Amber Theme (Night)</option>
              <option value="GreenTheme">Green Theme (Matrix)</option>
            </select>
          </div>
        </div>

        {/* SECTION 3: TITLE & LABELS (FOR VALUE/TEXT WIDGETS) */}
        <div className="p-3 space-y-3">
          <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3 h-3 text-emerald-400" /> Title & Unit Labels
          </span>

          {/* Show Title */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs text-gray-200 block font-medium">Show Title</span>
              <span className="text-[10px] text-gray-500">Display widget header title</span>
            </div>
            <input
              type="checkbox"
              checked={widget._title ?? true}
              onChange={(e) => updateProp('_title', e.target.checked)}
              className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Custom Title Override */}
          <div className="space-y-1">
            <label className="text-[10px] text-gray-400 block">Custom Title Override</label>
            <input
              type="text"
              placeholder={def?.title || 'Default Title'}
              value={widget.titletext ?? ''}
              onChange={(e) => updateProp('titletext', e.target.value)}
              className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Show Unit & Hide Labels */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <label className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={widget._unit ?? true}
                onChange={(e) => updateProp('_unit', e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0"
              />
              <span className="text-[11px] text-gray-300">Show Unit</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={widget._hide_labels ?? false}
                onChange={(e) => updateProp('_hide_labels', e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0"
              />
              <span className="text-[11px] text-gray-300">Hide Labels</span>
            </label>
          </div>
        </div>

        {/* SECTION 4: TYPE-SPECIFIC PROPERTIES */}
        {/* Map Widgets */}
        {widget.CLASS.includes('Map') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-amber-400" /> Map Settings
            </span>

            {/* Rotation */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Map Orientation / Rotation</label>
              <select
                value={w.rotation ?? 'NORTH_AT_TOP'}
                onChange={(e) => updateProp('rotation', e.target.value)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
              >
                <option value="NORTH_AT_TOP">North at Top</option>
                <option value="BEARING_AT_TOP">Bearing at Top (Flight Direction)</option>
                <option value="HEADING_AT_TOP">Heading at Top (Compass Heading)</option>
                <option value="OPTIMIZED_BEARING_AT_TOP">Optimized Bearing</option>
              </select>
            </div>

            {/* Scale */}
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
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={getHexColor(w.tracklog_color, '#ff962d')}
                  onChange={(e) => handleColorChange('tracklog_color', e.target.value)}
                  className="w-7 h-7 rounded border border-gray-600 bg-transparent cursor-pointer p-0.5"
                />
              </div>
            </div>

            {/* Compass rose on map */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-xs text-gray-200 block font-medium">Compass Rose</span>
                <span className="text-[10px] text-gray-500">Overlay 360° compass on map</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(w.showCompass ?? true)}
                onChange={(e) => updateProp('showCompass', e.target.checked)}
                className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Action Button Widgets */}
        {widget.CLASS.includes('Button') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-orange-400" /> Action Button Settings
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Click Action</label>
              <select
                value={w.action ?? 'NEXT_PAGE'}
                onChange={(e) => updateProp('action', e.target.value)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
              >
                <option value="NEXT_PAGE">Next Page</option>
                <option value="PREV_PAGE">Previous Page</option>
                <option value="THERMAL_ASSISTANT">Thermal Assistant</option>
                <option value="WAYPOINTS">Waypoints</option>
                <option value="TASK">Competition Task</option>
                <option value="AIRSPACE">Airspace</option>
                <option value="AUDIO_TOGGLE">Mute / Unmute Sound</option>
                <option value="TAKEOFF">Takeoff / Reset Flight</option>
                <option value="START_ALTIMETER_CALIBRATION">Calibrate Altimeter</option>
                <option value="MENU">Open Menu</option>
                <option value="STATUS">GPS & Status</option>
                <option value="CALL">Phone Call</option>
                <option value="SMS">Send SMS</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Long Click Action</label>
              <select
                value={w.longClick ?? ''}
                onChange={(e) => updateProp('longClick', e.target.value)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white cursor-pointer focus:outline-none"
              >
                <option value="">None</option>
                <option value="MENU">Open Menu</option>
                <option value="WAYPOINTS">Waypoints Navigation</option>
                <option value="TASK">Competition Task</option>
                <option value="AUDIO_TOGGLE">Mute / Unmute Sound</option>
              </select>
            </div>
          </div>
        )}

        {/* Free Text Widget */}
        {widget.CLASS.includes('WText') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3 h-3 text-cyan-400" /> Free Text Settings
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Display Text</label>
              <textarea
                rows={2}
                value={w.text ?? ''}
                onChange={(e) => updateProp('text', e.target.value)}
                placeholder="Enter text..."
                className="w-full bg-[#181d28] border border-xctrack-border rounded p-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Text Size</label>
                <input
                  type="number"
                  min="8"
                  max="72"
                  value={w.text_size ?? 16}
                  onChange={(e) => updateProp('text_size', parseInt(e.target.value) || 16)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Text Color</label>
                <input
                  type="color"
                  value={getHexColor(w.color_text, '#ffffff')}
                  onChange={(e) => handleColorChange('color_text', e.target.value)}
                  className="w-full h-8 rounded border border-gray-600 bg-transparent cursor-pointer p-0.5"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <label className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={Boolean(w.bold ?? false)}
                  onChange={(e) => updateProp('bold', e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0"
                />
                <span className="text-xs font-bold text-gray-300">Bold</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={Boolean(w.italic ?? false)}
                  onChange={(e) => updateProp('italic', e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0"
                />
                <span className="text-xs italic text-gray-300">Italic</span>
              </label>
            </div>
          </div>
        )}

        {/* Web View Widget */}
        {widget.CLASS.includes('WWeb') && (
          <div className="p-3 space-y-3">
            <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-indigo-400" /> Web View Settings
            </span>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Web Page URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={w.url ?? ''}
                onChange={(e) => updateProp('url', e.target.value)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 block">Auto Refresh Interval (seconds)</label>
              <input
                type="number"
                min="0"
                max="3600"
                step="30"
                value={w.refresh_interval ?? 0}
                onChange={(e) => updateProp('refresh_interval', parseInt(e.target.value) || 0)}
                className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-xs text-white"
              />
            </div>

            <label className="flex items-center gap-2 p-2 rounded bg-black/20 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(w.allowGsp ?? true)}
                onChange={(e) => updateProp('allowGsp', e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0"
              />
              <span className="text-[11px] text-gray-300">Allow GPS Location Access</span>
            </label>
          </div>
        )}

        {/* SECTION 5: EXTRA / RAW PRESERVED PROPERTIES */}
        <div className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowRawJson(!showRawJson)}
              className="text-[11px] font-semibold text-gray-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Code className="w-3 h-3 text-gray-400" /> Raw Properties ({rawKeys.length})
              {showRawJson ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          </div>

          {showRawJson && (
            <div className="space-y-2 pt-1">
              {rawKeys.map((key) => (
                <div key={key} className="flex items-center justify-between gap-2 p-2 rounded bg-black/25 border border-white/5">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-blue-400 block truncate">{key}</span>
                    <input
                      type="text"
                      value={typeof widget[key] === 'object' ? JSON.stringify(widget[key]) : String(widget[key])}
                      onChange={(e) => {
                        let parsed: any = e.target.value;
                        try {
                          parsed = JSON.parse(e.target.value);
                        } catch {}
                        updateProp(key, parsed);
                      }}
                      className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-0.5 text-[11px] text-gray-200 font-mono mt-0.5"
                    />
                  </div>
                  <button
                    onClick={() => removeProp(key)}
                    className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove Property"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add custom property form */}
              <div className="p-2 rounded bg-black/30 border border-dashed border-gray-700 space-y-1.5">
                <span className="text-[10px] text-gray-400 block font-medium">Add Custom Property</span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="key"
                    value={newPropKey}
                    onChange={(e) => setNewPropKey(e.target.value)}
                    className="w-1/2 bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-[11px] text-white font-mono"
                  />
                  <input
                    type="text"
                    placeholder="value"
                    value={newPropVal}
                    onChange={(e) => setNewPropVal(e.target.value)}
                    className="w-1/2 bg-[#181d28] border border-xctrack-border rounded px-1.5 py-1 text-[11px] text-white font-mono"
                  />
                </div>
                <button
                  disabled={!newPropKey.trim()}
                  onClick={() => {
                    let parsed: any = newPropVal;
                    try {
                      parsed = JSON.parse(newPropVal);
                    } catch {}
                    updateProp(newPropKey.trim(), parsed);
                    setNewPropKey('');
                    setNewPropVal('');
                  }}
                  className="w-full py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-[10px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Property
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
