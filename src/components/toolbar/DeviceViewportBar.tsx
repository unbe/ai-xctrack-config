import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  RotateCw,
  Magnet,
  Grid as GridIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Palette,
  Layers,
  Settings2,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getAllDevices, getDeviceCategories, getDevicesByCategory } from '../../data/devices';
import { DevicePreset, Orientation } from '../../types/xcfg';

export const DeviceViewportBar: React.FC = () => {
  const store = useEditorStore();
  const [deviceMenuOpen, setDeviceMenuOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customCols, setCustomCols] = useState(23);
  const [customRows, setCustomRows] = useState(48);

  const categories = getDeviceCategories();
  const currentGrid = editorStore.getCurrentGrid();
  const pages = store.config.layout[store.activeOrientation] || [];
  const currentPage = pages[store.activePageIndex];
  const widgetCount = currentPage?.widgets.length || 0;

  const handleDeviceSelect = (device: DevicePreset) => {
    editorStore.setDevice(device);
    setDeviceMenuOpen(false);
  };

  const handleApplyCustomGrid = () => {
    editorStore.setCustomGrid({
      cols: Math.max(5, Math.min(100, customCols)),
      rows: Math.max(5, Math.min(100, customRows)),
    });
    setCustomModalOpen(false);
  };

  return (
    <div className="h-11 bg-xctrack-dark/95 border-b border-xctrack-border px-4 flex items-center justify-between text-xs select-none">
      {/* Device & Orientation Picker */}
      <div className="flex items-center gap-3">
        {/* Device selector dropdown */}
        <div className="relative">
          <button
            onClick={() => setDeviceMenuOpen(!deviceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-xctrack-card text-gray-200 hover:text-white border border-xctrack-border hover:border-gray-500 transition-colors"
          >
            {store.activeDevice.category === 'Rugged Tablet' || store.activeDevice.category === 'Dedicated Flight Instrument' ? (
              <Tablet className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span className="font-medium max-w-[170px] truncate">{store.activeDevice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {deviceMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-80 bg-xctrack-card border border-xctrack-border rounded-lg shadow-2xl p-1 z-50 max-h-[480px] overflow-y-auto animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase text-gray-400 border-b border-xctrack-border flex justify-between items-center">
                <span>Select Target Screen Preset</span>
                <button
                  onClick={() => {
                    setDeviceMenuOpen(false);
                    setCustomModalOpen(true);
                  }}
                  className="text-sky-400 hover:text-sky-300 normal-case font-normal"
                >
                  Custom Grid...
                </button>
              </div>

              {categories.map((cat) => {
                const devs = getDevicesByCategory(cat);
                if (devs.length === 0) return null;
                return (
                  <div key={cat} className="mt-1">
                    <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      {cat}
                    </div>
                    {devs.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handleDeviceSelect(d)}
                        className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          store.activeDevice.id === d.id
                            ? 'bg-sky-600/30 text-sky-200 font-medium'
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="truncate mr-2">
                          <div>{d.name}</div>
                          <div className="text-[10px] text-gray-400">
                            {d.screenWidthPx}×{d.screenHeightPx} ({d.aspectRatio}) • {d.gridPortrait.cols}×{d.gridPortrait.rows} grid
                          </div>
                        </div>
                        {store.activeDevice.id === d.id && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Orientation Toggle Button */}
        <div className="flex items-center bg-xctrack-card rounded p-0.5 border border-xctrack-border">
          <button
            onClick={() => editorStore.setOrientation('portrait')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              store.activeOrientation === 'portrait'
                ? 'bg-sky-600 text-white font-medium shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Portrait
            <span className="text-[10px] opacity-75 font-mono">({store.config.layout.portrait.length}p)</span>
          </button>
          <button
            onClick={() => editorStore.setOrientation('landscape')}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              store.activeOrientation === 'landscape'
                ? 'bg-sky-600 text-white font-medium shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Landscape
            <span className="text-[10px] opacity-75 font-mono">({store.config.layout.landscape.length}p)</span>
          </button>
        </div>

        {/* System Bar Inset Toggle */}
        <button
          onClick={() => editorStore.setUseInsets(!store.useInsets)}
          className={`px-2 py-1 rounded border transition-colors flex items-center gap-1.5 ${
            store.useInsets
              ? 'bg-xctrack-card border-xctrack-border text-gray-300 hover:text-white'
              : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
          }`}
          title="Toggle Fullscreen Edge-to-Edge vs Android Status/Nav Bar insets"
        >
          {store.useInsets ? 'Bar Insets' : 'Fullscreen'}
        </button>

        {/* Grid dimensions indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-xctrack-card/60 text-gray-300 border border-xctrack-border/60 font-mono text-[11px]">
          <span className="text-gray-400">Grid:</span>
          <span className="text-sky-300 font-semibold">{currentGrid.cols} × {currentGrid.rows}</span>
          <span className="text-[10px] text-gray-500">({widgetCount} widgets)</span>
        </div>
      </div>

      {/* Viewport & Canvas Controls */}
      <div className="flex items-center gap-2">
        {/* Snap to Grid Toggle */}
        <button
          onClick={() => editorStore.setSnapToGrid(!store.snapToGrid)}
          className={`p-1.5 rounded border transition-colors ${
            store.snapToGrid
              ? 'bg-sky-600/20 border-sky-500/50 text-sky-300'
              : 'bg-xctrack-card border-xctrack-border text-gray-500 hover:text-gray-300'
          }`}
          title={`Snap to Grid (${store.snapToGrid ? 'ON' : 'OFF'})`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>

        {/* Grid Lines Overlay Toggle */}
        <button
          onClick={() => editorStore.setShowGridOverlay(!store.showGridOverlay)}
          className={`p-1.5 rounded border transition-colors ${
            store.showGridOverlay
              ? 'bg-sky-600/20 border-sky-500/50 text-sky-300'
              : 'bg-xctrack-card border-xctrack-border text-gray-500 hover:text-gray-300'
          }`}
          title={`Show Grid Lines (${store.showGridOverlay ? 'ON' : 'OFF'})`}
        >
          <GridIcon className="w-3.5 h-3.5" />
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center bg-xctrack-card rounded p-0.5 border border-xctrack-border">
          <button
            onClick={() => editorStore.setZoom(store.zoom - 0.1)}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => editorStore.setZoom(1.0)}
            className="px-1.5 py-0.5 text-[10px] font-mono text-gray-300 hover:text-white transition-colors"
            title="Reset Zoom to 100%"
          >
            {Math.round(store.zoom * 100)}%
          </button>
          <button
            onClick={() => editorStore.setZoom(store.zoom + 0.1)}
            className="p-1 rounded text-gray-400 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Theme Preview Selector */}
        <div className="flex items-center gap-1 bg-xctrack-card rounded px-2 py-1 border border-xctrack-border text-[11px]">
          <Palette className="w-3.5 h-3.5 text-gray-400" />
          <select
            value={store.globalTheme}
            onChange={(e) => editorStore.setGlobalTheme(e.target.value)}
            className="bg-transparent text-gray-200 outline-none cursor-pointer"
            title="Canvas Preview Theme"
          >
            <option value="BlackTheme" className="bg-gray-900 text-white">Black Theme (OLED)</option>
            <option value="WhiteTheme" className="bg-gray-900 text-white">White Theme (Daylight)</option>
            <option value="WhiteEInkTheme" className="bg-gray-900 text-white">White E-Ink</option>
            <option value="BlackHCTheme" className="bg-gray-900 text-white">Black High Contrast</option>
            <option value="WhiteHCTheme" className="bg-gray-900 text-white">White High Contrast</option>
          </select>
        </div>
      </div>

      {/* Custom Grid Modal */}
      {customModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-xctrack-card border border-xctrack-border rounded-xl p-5 w-80 shadow-2xl">
            <h3 className="font-semibold text-white text-sm mb-3">Custom Grid Dimensions</h3>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Columns</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={customCols}
                  onChange={(e) => setCustomCols(parseInt(e.target.value) || 20)}
                  className="w-full bg-xctrack-dark border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Rows</label>
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={customRows}
                  onChange={(e) => setCustomRows(parseInt(e.target.value) || 40)}
                  className="w-full bg-xctrack-dark border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono text-xs"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCustomModalOpen(false)}
                className="px-3 py-1.5 rounded text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomGrid}
                className="px-3.5 py-1.5 rounded text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium"
              >
                Apply Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
