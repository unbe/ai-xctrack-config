import React, { useState } from 'react';
import { Code, ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import { XcfgWidget } from '../../../types/xcfg';

export const STANDARD_MANAGED_KEYS = new Set([
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

export interface RawPropertiesSectionProps {
  widget: XcfgWidget;
  onUpdateProp: (key: string, value: any) => void;
  onRemoveProp: (key: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const RawPropertiesSection: React.FC<RawPropertiesSectionProps> = ({
  widget,
  onUpdateProp,
  onRemoveProp,
  isOpen,
  onToggle,
}) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');

  const rawKeys = Object.keys(widget).filter((k) => !STANDARD_MANAGED_KEYS.has(k));
  const w = widget as Record<string, any>;

  const handleAddProperty = () => {
    if (!newPropKey.trim()) return;
    let parsed: any = newPropVal;
    try {
      parsed = JSON.parse(newPropVal);
    } catch {
      // Keep as string
    }
    onUpdateProp(newPropKey.trim(), parsed);
    setNewPropKey('');
    setNewPropVal('');
  };

  return (
    <div className="border-b border-xctrack-border">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-2.5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Code className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">
            Raw & Preserved Properties
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <span className="text-[10px] font-mono text-emerald-400/90 font-medium">
          {rawKeys.length} {rawKeys.length === 1 ? 'key' : 'keys'}
        </span>
      </button>

      {isOpen && (
        <div className="p-3 space-y-3 bg-slate-950/20">
          <div className="flex items-center justify-between pb-1 border-b border-white/5">
            <span className="text-[10px] text-gray-400">View Full JSON</span>
            <button
              type="button"
              onClick={() => setShowRawJson(!showRawJson)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                showRawJson
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-gray-400 hover:text-gray-200 border border-slate-700'
              }`}
            >
              {showRawJson ? 'Hide JSON' : 'Show JSON'}
            </button>
          </div>

          {showRawJson && (
            <pre className="text-[10px] font-mono bg-black/40 border border-white/5 p-2 rounded max-h-48 overflow-auto text-emerald-300/90 whitespace-pre-wrap break-all">
              {JSON.stringify(widget, null, 2)}
            </pre>
          )}

          {rawKeys.length === 0 ? (
            <p className="text-[11px] text-gray-500 italic">No extra unmanaged properties.</p>
          ) : (
            rawKeys.map((key) => (
              <div key={key} className="flex items-center justify-between gap-2 p-2 rounded bg-black/25 border border-white/5">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-sky-400 block truncate">{key}</span>
                  <input
                    type="text"
                    value={typeof w[key] === 'object' ? JSON.stringify(w[key]) : String(w[key])}
                    onChange={(e) => {
                      let parsed: any = e.target.value;
                      try {
                        parsed = JSON.parse(e.target.value);
                      } catch {
                        // Keep as string
                      }
                      onUpdateProp(key, parsed);
                    }}
                    className="w-full bg-[#181d28] border border-xctrack-border rounded px-1.5 py-0.5 text-[11px] text-gray-200 font-mono mt-0.5"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveProp(key)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remove Property"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}

          {/* Add Custom Property Form */}
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
              type="button"
              disabled={!newPropKey.trim()}
              onClick={handleAddProperty}
              className="w-full py-1 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-[10px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
