import React from 'react';
import { Monitor, Sliders } from 'lucide-react';

export interface DisplayUnitsTabProps {
  prefs: Record<string, any>;
  onUpdatePref: (key: string, value: any) => void;
  onSetGlobalTheme?: (theme: string) => void;
}

export const DisplayUnitsTab: React.FC<DisplayUnitsTabProps> = ({
  prefs,
  onUpdatePref,
  onSetGlobalTheme,
}) => {
  const getPref = (key: string, fallback: any = '') => {
    return prefs[key] !== undefined ? prefs[key] : fallback;
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3">
        <h2 className="text-base font-semibold text-white">Display & Measurement Units</h2>
        <p className="text-gray-400 text-xs">Configure theme, screen refresh rate, orientation, and metric/imperial units.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Display Settings */}
        <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4" /> Screen & Theme
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium">Default App Theme</label>
            <select
              value={getPref('Display.Theme', 'BlackTheme')}
              onChange={(e) => {
                onUpdatePref('Display.Theme', e.target.value);
                if (onSetGlobalTheme) {
                  onSetGlobalTheme(e.target.value);
                }
              }}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white"
            >
              <option value="BlackTheme">Black Theme (OLED / Battery Saver)</option>
              <option value="BlackHCTheme">Black High Contrast</option>
              <option value="WhiteTheme">White Theme (Daylight)</option>
              <option value="WhiteHCTheme">White High Contrast</option>
              <option value="WhiteEInkTheme">White E-Ink (AIR³ / Hisense / Boox)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium">Screen Orientation Lock</label>
            <select
              value={getPref('Display.Orientation', 'PORTRAIT')}
              onChange={(e) => onUpdatePref('Display.Orientation', e.target.value)}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white"
            >
              <option value="PORTRAIT">Portrait</option>
              <option value="LANDSCAPE">Landscape</option>
              <option value="REVERSE_PORTRAIT">Reverse Portrait</option>
              <option value="REVERSE_LANDSCAPE">Reverse Landscape</option>
              <option value="AUTO">Sensor / Auto Rotate</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <span className="text-xs text-gray-200 block font-medium">Fullscreen Mode</span>
              <span className="text-[10px] text-gray-500">Hide Android status and navigation bars</span>
            </div>
            <input
              type="checkbox"
              checked={getPref('Display.Fullscreen', true)}
              onChange={(e) => onUpdatePref('Display.Fullscreen', e.target.checked)}
              className="w-4 h-4 rounded bg-[#1c2230] border-gray-600 text-blue-500 focus:ring-0"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium">Display Repaint Interval (ms)</label>
            <input
              type="number"
              step="50"
              min="100"
              max="1000"
              value={getPref('Display.RepaintInterval', 250)}
              onChange={(e) => onUpdatePref('Display.RepaintInterval', parseInt(e.target.value) || 250)}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono"
            />
            <span className="text-[10px] text-gray-500">250ms = 4 Hz (optimal battery vs smoothness)</span>
          </div>
        </div>

        {/* Units Configuration */}
        <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" /> Measurement Units
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">Altitude & Elevation</label>
              <select
                value={getPref('Unit.Altitude', 'm')}
                onChange={(e) => onUpdatePref('Unit.Altitude', e.target.value)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white"
              >
                <option value="m">Meters (m)</option>
                <option value="ft">Feet (ft)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">Ground & Air Speed</label>
              <select
                value={getPref('Unit.Speed', 'km/h')}
                onChange={(e) => onUpdatePref('Unit.Speed', e.target.value)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white"
              >
                <option value="km/h">Kilometers per hour (km/h)</option>
                <option value="mph">Miles per hour (mph)</option>
                <option value="kn">Knots (kn)</option>
                <option value="m/s">Meters per second (m/s)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">Vertical Speed (Vario)</label>
              <select
                value={getPref('Unit.VerticalSpeed', 'm/s')}
                onChange={(e) => onUpdatePref('Unit.VerticalSpeed', e.target.value)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white"
              >
                <option value="m/s">Meters per second (m/s)</option>
                <option value="fpm">Feet per minute (fpm)</option>
                <option value="kn">Knots (kn)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">Distance</label>
              <select
                value={getPref('Unit.Distance', 'm,km')}
                onChange={(e) => onUpdatePref('Unit.Distance', e.target.value)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white"
              >
                <option value="m,km">Meters / Kilometers (m, km)</option>
                <option value="ft,mi">Feet / Miles (ft, mi)</option>
                <option value="ft,nm">Feet / Nautical Miles (ft, nm)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
