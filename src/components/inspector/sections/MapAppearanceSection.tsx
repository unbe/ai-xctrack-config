import React from 'react';
import {
  Map as MapIcon,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { XcfgWidget } from '../../../types/xcfg';
import {
  MAP_THEMES,
  TERRAIN_STYLES,
  getMapTheme,
  getTerrainStyle,
} from '../../../data/map-styles';
import { parseXctrackColor, parseHexColor, rgbaToSignedInt } from '../../../utils/colorMath';

export interface MapAppearanceSectionProps {
  widget: XcfgWidget;
  onUpdateProp: (key: string, value: any) => void;
  onOpenGallery: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MapAppearanceSection: React.FC<MapAppearanceSectionProps> = ({
  widget,
  onUpdateProp,
  onOpenGallery,
  isOpen,
  onToggle,
}) => {
  const w = widget as Record<string, any>;
  const appearance = w.mapWidget_mapAppearance || {};
  const currentTheme = appearance.theme || (w.mapWidget_showOpenStreet === false ? 'None' : 'ClearpilotForest');
  const currentTerrain = appearance.terrain || (w.mapWidget_showTerrain === false ? 'None' : 'Light');
  const isRoadmapEnabled = currentTheme !== 'None' && w.mapWidget_showOpenStreet !== false;

  const handleSetMapAppearance = (newTheme: string, newTerrain: string) => {
    onUpdateProp('mapWidget_mapAppearance', {
      theme: newTheme,
      terrain: newTerrain,
    });
    onUpdateProp('mapWidget_showOpenStreet', newTheme !== 'None');
    onUpdateProp('mapWidget_showTerrain', newTerrain !== 'None');
  };

  const handleToggleRoadmap = (enabled: boolean) => {
    const nextTheme = enabled
      ? currentTheme === 'None'
        ? 'ClearpilotForest'
        : currentTheme
      : 'None';
    handleSetMapAppearance(nextTheme, currentTerrain);
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
    onUpdateProp(key, signedInt);
  };

  return (
    <div>
      <div className="flex items-center justify-between p-3 bg-xctrack-card/60 hover:bg-white/[0.04] transition-colors border-b border-xctrack-border/40 select-none">
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-2 flex-1 text-left"
        >
          <MapIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-semibold text-white uppercase tracking-wider">
            Map Appearance & Style
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
        <button
          type="button"
          onClick={onOpenGallery}
          className="flex items-center gap-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700/60 transition-colors shadow-sm ml-2"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Browse Gallery</span>
        </button>
      </div>

      {isOpen && (
        <div className="p-3 space-y-3.5 bg-slate-950/20">
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
                  type="button"
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
              onChange={(e) => onUpdateProp('rotation', e.target.value)}
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
                onUpdateProp('mapWidget_scale', {
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
                onChange={(e) => onUpdateProp('mapWidget_showRainRadar', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Thermal Hotspots Overlay (KK7)</span>
              <input
                type="checkbox"
                checked={Boolean(w.mapWidget_showKK7 ?? false)}
                onChange={(e) => onUpdateProp('mapWidget_showKK7', e.target.checked)}
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
                  onChange={(e) => onUpdateProp('mapWidget_KK7opacity', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300">Time-Adjusted KK7 Thermals</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-mono uppercase">Pro</span>
              </div>
              <input
                type="checkbox"
                checked={Boolean(w.mapWidget_KK7timed ?? false)}
                onChange={(e) => onUpdateProp('mapWidget_KK7timed', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>

            {w.mapWidget_KK7timed && (
              <div className="space-y-1 pl-3 border-l-2 border-amber-500/40">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Time-Adjusted Opacity</span>
                  <span className="font-mono text-white">{w.mapWidget_KK7timedOpacity ?? 80}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={w.mapWidget_KK7timedOpacity ?? 80}
                  onChange={(e) => onUpdateProp('mapWidget_KK7timedOpacity', parseInt(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            )}

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Active Airspaces</span>
              <input
                type="checkbox"
                checked={Boolean(w.mapWidget_showAirspaces ?? true)}
                onChange={(e) => onUpdateProp('mapWidget_showAirspaces', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Distance Scale Bar</span>
              <input
                type="checkbox"
                checked={Boolean(w.mapWidget_drawScale ?? true)}
                onChange={(e) => onUpdateProp('mapWidget_drawScale', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Compass Rose Overlay</span>
              <input
                type="checkbox"
                checked={Boolean(w.showCompass ?? true)}
                onChange={(e) => onUpdateProp('showCompass', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300">Power Lines & Emergency Obstacles</span>
              <input
                type="checkbox"
                checked={Boolean(w.mapWidget_emergencyObstacles ?? true)}
                onChange={(e) => onUpdateProp('mapWidget_emergencyObstacles', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-gray-600 text-sky-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
