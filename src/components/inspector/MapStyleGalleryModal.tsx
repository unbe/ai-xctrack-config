import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Map as MapIcon } from 'lucide-react';
import {
  MAP_APPEARANCE_PRESETS,
  MAP_THEMES,
  TERRAIN_STYLES,
  getMapTheme,
  getTerrainStyle,
} from '../../data/map-styles';
import { RealisticMapSection } from '../canvas/RealisticMapSection';

interface MapStyleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  currentTerrain: string;
  onSelectStyle: (theme: string, terrain: string) => void;
}

export const MapStyleGalleryModal: React.FC<MapStyleGalleryModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentTerrain,
  onSelectStyle,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'themes' | 'terrains'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filteredPresets = MAP_APPEARANCE_PRESETS.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  return createPortal(
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] animate-in fade-in p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative z-10 text-xs">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <MapIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">XCTrack Map Style Gallery</h3>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                  Interactive Preview
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Choose vector road map themes and 3D terrain elevation relief profiles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Filters */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'presets'
                  ? 'bg-sky-600 text-white font-medium shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Curated Style Presets ({MAP_APPEARANCE_PRESETS.length})
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'themes'
                  ? 'bg-sky-600 text-white font-medium shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Road Map Themes ({MAP_THEMES.length})
            </button>
            <button
              onClick={() => setActiveTab('terrains')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'terrains'
                  ? 'bg-sky-600 text-white font-medium shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Terrain Styles ({TERRAIN_STYLES.length})
            </button>
          </div>

          {activeTab === 'presets' && (
            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {[
                { id: 'all', label: 'All' },
                { id: 'featured', label: 'Featured Relief' },
                { id: 'extra', label: 'Extra Relief' },
                { id: 'classic', label: 'Classic Hillshading' },
                { id: 'relief', label: 'Relief Only' },
                { id: 'empty', label: 'Empty' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded border transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-sky-950/60 text-sky-300 border-sky-600 font-medium'
                      : 'bg-slate-900 text-gray-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredPresets.map((preset) => {
                const isSelected = currentTheme === preset.theme && currentTerrain === preset.terrain;
                const themeDef = getMapTheme(preset.theme);
                const terrainDef = getTerrainStyle(preset.terrain);

                return (
                  <div
                    key={preset.id}
                    onClick={() => onSelectStyle(preset.theme, preset.terrain)}
                    className={`rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                      isSelected
                        ? 'bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      {/* Realistic Visual Map Preview Thumbnail */}
                      <div className="w-full h-28 rounded-lg overflow-hidden relative border border-slate-700/80 mb-2.5 shadow-inner">
                        <MapStyleVisualPreview theme={themeDef} terrain={terrainDef} />

                        {/* Top Badges */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none z-10">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-white font-medium border border-white/10">
                            {preset.category.toUpperCase()}
                          </span>
                          {preset.isPro && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-black">
                              PRO
                            </span>
                          )}
                        </div>

                        {/* Checkmark when selected */}
                        {isSelected && (
                          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg z-10">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Title & Info */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-semibold text-white text-xs truncate group-hover:text-sky-300 transition-colors">
                          {preset.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed mb-2">
                        {preset.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-gray-400 font-mono">
                      <span>OSM: {themeDef.name}</span>
                      <span>Relief: {terrainDef.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: ALL THEMES */}
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {MAP_THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id;
                const currentTerrainDef = getTerrainStyle(currentTerrain);

                return (
                  <div
                    key={theme.id}
                    onClick={() => onSelectStyle(theme.id, currentTerrain)}
                    className={`rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="w-full h-24 rounded-lg overflow-hidden relative border border-slate-700/80 mb-2.5 shadow-inner">
                        <MapStyleVisualPreview theme={theme} terrain={currentTerrainDef} />
                        {theme.isPro && (
                          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-black z-10">
                            PRO
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-semibold text-white text-xs truncate group-hover:text-sky-300 transition-colors">
                          {theme.name}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-gray-300">
                          {theme.hasRoads ? 'Vector Roads' : 'No Roads'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-700/60 text-[10px] text-gray-500 font-mono truncate">
                      File: {theme.osmThemeFile || 'Built-in / None'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: ALL TERRAINS */}
          {activeTab === 'terrains' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {TERRAIN_STYLES.map((terrain) => {
                const isSelected = currentTerrain === terrain.id;
                const currentThemeDef = getMapTheme(currentTheme);

                return (
                  <div
                    key={terrain.id}
                    onClick={() => onSelectStyle(currentTheme, terrain.id)}
                    className={`rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-sky-950/30 border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800/80'
                    }`}
                  >
                    <div>
                      <div className="w-full h-24 rounded-lg overflow-hidden relative border border-slate-700/80 mb-2.5 shadow-inner">
                        <MapStyleVisualPreview theme={currentThemeDef} terrain={terrain} />
                        {terrain.isPro && (
                          <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/90 text-black z-10">
                            PRO
                          </span>
                        )}
                        {isSelected && (
                          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg z-10">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="font-semibold text-white text-xs truncate group-hover:text-sky-300 transition-colors">
                          {terrain.name}
                        </h4>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-gray-300">
                          {terrain.hasHillshading ? 'Hillshaded' : 'Flat'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">
                        {terrain.description}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-700/60 text-[10px] text-gray-500 font-mono">
                      Elevation Gradient: {terrain.hasElevationGradient ? 'Active' : 'Off'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-[11px] font-mono">
            <span>Selected:</span>
            <span className="text-sky-400 font-semibold">{getMapTheme(currentTheme).name}</span>
            <span>+</span>
            <span className="text-emerald-400 font-semibold">{getTerrainStyle(currentTerrain).name}</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

interface MapStyleVisualPreviewProps {
  theme: any;
  terrain: any;
}

export const MapStyleVisualPreview: React.FC<MapStyleVisualPreviewProps> = ({ theme, terrain }) => {
  return (
    <RealisticMapSection
      theme={theme}
      terrain={terrain}
      hasRoads={theme.hasRoads}
      hasTerrain={terrain.id !== 'None'}
      hasAirspaces={true}
      hasScale={false}
      hasCompass={false}
      hasWind={false}
      showFlightData={false}
      isThumbnail={true}
    />
  );
};
