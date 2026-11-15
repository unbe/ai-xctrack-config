import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Smartphone,
  Tablet,
  Magnet,
  Grid as GridIcon,
  ZoomIn,
  ZoomOut,
  Palette,
  Check,
  ChevronDown,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getAllDevices, getDeviceCategories, getDevicesByCategory } from '../../data/devices';
import { DevicePreset } from '../../types/xcfg';

export const DeviceViewportBar: React.FC = () => {
  const store = useEditorStore();
  const [deviceMenuOpen, setDeviceMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [customCols, setCustomCols] = useState(23);
  const [customRows, setCustomRows] = useState(48);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = getDeviceCategories();
  const allDevices = useMemo(() => getAllDevices(), []);
  const currentGrid = editorStore.getCurrentGrid();
  const pages = store.config.layout[store.activeOrientation] || [];
  const currentPage = pages[store.activePageIndex];
  const widgetCount = currentPage?.widgets.length || 0;

  // Filter devices based on search query and category
  const filteredDevices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allDevices.filter((d) => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        (d.category && d.category.toLowerCase().includes(q)) ||
        (d.notes && d.notes.toLowerCase().includes(q)) ||
        (d.screenSizeInches && `${d.screenSizeInches}`.includes(q)) ||
        `${d.screenWidthPx}x${d.screenHeightPx}`.includes(q) ||
        `${d.screenHeightPx}x${d.screenWidthPx}`.includes(q) ||
        `${d.gridPortrait.cols}x${d.gridPortrait.rows}`.includes(q) ||
        `${d.gridLandscape.cols}x${d.gridLandscape.rows}`.includes(q)
      );
    });
  }, [allDevices, searchQuery, selectedCategory]);

  // Group filtered devices by category when not searching, or show flat when searching
  const groupedFiltered = useMemo(() => {
    if (searchQuery.trim()) {
      return null; // Flat list for search
    }
    const grouped: Record<string, DevicePreset[]> = {};
    for (const d of filteredDevices) {
      const cat = d.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(d);
    }
    return grouped;
  }, [filteredDevices, searchQuery]);

  // Focus search input when opening dropdown
  useEffect(() => {
    if (deviceMenuOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [deviceMenuOpen]);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    if (!deviceMenuOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDeviceMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDeviceMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deviceMenuOpen]);

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

  const isTablet =
    store.activeDevice.category === 'Rugged Tablet' ||
    store.activeDevice.category === 'Dedicated Flight Instrument' ||
    store.activeDevice.category === 'Dedicated Instrument' ||
    (store.activeDevice.screenSizeInches && store.activeDevice.screenSizeInches >= 7.0);

  return (
    <div className="h-11 bg-xctrack-dark/95 border-b border-xctrack-border px-4 flex items-center justify-between text-xs select-none">
      {/* Device & Orientation Picker */}
      <div className="flex items-center gap-3">
        {/* Device selector dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDeviceMenuOpen(!deviceMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-xctrack-card text-gray-200 hover:text-white border border-xctrack-border hover:border-gray-500 transition-colors"
          >
            {isTablet ? (
              <Tablet className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            )}
            <span className="font-medium max-w-[170px] truncate">{store.activeDevice.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {deviceMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-[390px] bg-xctrack-card border border-xctrack-border rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in flex flex-col max-h-[520px]">
              {/* Header with Search and Custom Grid action */}
              <div className="p-2.5 border-b border-xctrack-border bg-xctrack-dark/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-gray-400 tracking-wider">
                    Target Device Preset ({allDevices.length})
                  </span>
                  <button
                    onClick={() => {
                      setDeviceMenuOpen(false);
                      setCustomModalOpen(true);
                    }}
                    className="text-sky-400 hover:text-sky-300 text-[11px] font-medium"
                  >
                    Custom Grid...
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lumo, pixel, air3, boox, 7.8, e-ink..."
                    className="w-full bg-xctrack-card border border-xctrack-border rounded-md pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category filter pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar text-[10px]">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-sky-600 text-white font-medium shadow-sm'
                        : 'bg-xctrack-card text-gray-400 hover:text-white border border-xctrack-border'
                    }`}
                  >
                    All ({allDevices.length})
                  </button>
                  {categories.map((cat) => {
                    const count = getDevicesByCategory(cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                          selectedCategory === cat
                            ? 'bg-sky-600 text-white font-medium shadow-sm'
                            : 'bg-xctrack-card text-gray-400 hover:text-white border border-xctrack-border'
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Auto-resnap toggle */}
                <div className="pt-2 border-t border-xctrack-border/60 flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer select-none text-gray-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={store.autoResnapOnDeviceChange}
                      onChange={(e) => editorStore.setAutoResnapOnDeviceChange(e.target.checked)}
                      className="rounded border-gray-700 bg-xctrack-dark text-sky-600 focus:ring-0 w-3.5 h-3.5"
                    />
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-sky-400" />
                      <span>Resnap layout to grid on device change</span>
                    </div>
                  </label>
                  <span className="text-[10px] text-sky-400 font-mono">No gaps</span>
                </div>
              </div>

              {/* Device List Area */}
              <div className="overflow-y-auto p-1.5 flex-1 divide-y divide-xctrack-border/40">
                {filteredDevices.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <p className="text-gray-400 text-xs mb-2">
                      No devices matching &ldquo;<span className="text-white font-medium">{searchQuery}</span>&rdquo;
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-xs text-sky-400 hover:text-sky-300 underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : groupedFiltered ? (
                  /* Grouped view by category */
                  Object.entries(groupedFiltered).map(([cat, devs]) => {
                    if (devs.length === 0) return null;
                    return (
                      <div key={cat} className="pt-1.5 first:pt-0">
                        <div className="px-2 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                          <span>{cat}</span>
                          <span className="text-gray-500 font-mono text-[9px]">{devs.length}</span>
                        </div>
                        <div className="space-y-0.5">
                          {devs.map((d) => renderDeviceItem(d, store.activeDevice.id, handleDeviceSelect))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  /* Flat search results */
                  <div className="space-y-0.5">
                    <div className="px-2 py-1 text-[10px] text-gray-400">
                      Found {filteredDevices.length} matching {filteredDevices.length === 1 ? 'device' : 'devices'}
                    </div>
                    {filteredDevices.map((d) => renderDeviceItem(d, store.activeDevice.id, handleDeviceSelect))}
                  </div>
                )}
              </div>
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
          <span className="text-[10px] text-gray-500">({widgetCount} w)</span>
        </div>

        {/* Smart Resnap Button */}
        <button
          onClick={() => editorStore.resnapCurrentPageToGrid()}
          disabled={widgetCount === 0}
          className="px-2 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-medium border border-slate-700 shadow-sm transition-colors flex items-center gap-1 text-xs disabled:opacity-40"
          title={`Smart Resnap: seamlessly snap all ${widgetCount} widgets to ${currentGrid.cols}×${currentGrid.rows} grid with zero gaps`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Resnap Grid</span>
        </button>
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
      {customModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-80 shadow-2xl relative z-10">
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
          </div>,
          document.body
        )}
    </div>
  );
};

function renderDeviceItem(
  d: DevicePreset,
  activeDeviceId: string,
  onSelect: (device: DevicePreset) => void
) {
  const isSelected = activeDeviceId === d.id;

  return (
    <button
      key={d.id}
      onClick={() => onSelect(d)}
      className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition-colors ${
        isSelected
          ? 'bg-sky-600/30 text-sky-200 font-medium border border-sky-500/40 shadow-sm'
          : 'text-gray-300 hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <div className="truncate mr-2 flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-white truncate">{d.name}</span>
          {d.category === 'E-Ink' && (
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/70 text-amber-300 border border-amber-800/50 shrink-0">
              E-Ink / RLCD
            </span>
          )}
        </div>
        <div className="text-[10px] text-gray-400 flex items-center gap-2 mt-0.5 font-mono">
          <span>{d.screenWidthPx}×{d.screenHeightPx} ({d.aspectRatio})</span>
          <span>•</span>
          <span className="text-sky-300/80">{d.gridPortrait.cols}×{d.gridPortrait.rows} grid</span>
          {d.screenSizeInches && (
            <>
              <span>•</span>
              <span className="text-gray-300">{d.screenSizeInches}&quot;</span>
            </>
          )}
        </div>
      </div>
      {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
    </button>
  );
}
