import React from 'react';
import { User, Plane, Sliders } from 'lucide-react';

export interface PilotGliderTabProps {
  prefs: Record<string, any>;
  onUpdatePref: (key: string, value: any) => void;
}

export const PilotGliderTab: React.FC<PilotGliderTabProps> = ({ prefs, onUpdatePref }) => {
  const getPref = (key: string, fallback: any = '') => {
    return prefs[key] !== undefined ? prefs[key] : fallback;
  };

  const speedUnit = (prefs['Unit.Speed'] as string) || 'km/h';
  const getSpeedFactor = (unit: string) => {
    switch (unit) {
      case 'mph':
        return 2.236936;
      case 'kt':
      case 'knots':
        return 1.943844;
      case 'm/s':
        return 1.0;
      case 'km/h':
      default:
        return 3.6;
    }
  };

  const rawTakeoffSpeed = prefs['TakeoffSpeed'] !== undefined ? prefs['TakeoffSpeed'] : 2.777778;
  const speedFactor = getSpeedFactor(speedUnit);
  const takeoffSpeedDisplay = Math.round((Number(rawTakeoffSpeed) * speedFactor) * 10) / 10;

  const handleTakeoffSpeedChange = (displayVal: number) => {
    const factor = getSpeedFactor(speedUnit);
    const siVal = Math.round((displayVal / factor) * 1000000) / 1000000;
    onUpdatePref('TakeoffSpeed', siVal);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3">
        <h2 className="text-base font-semibold text-white">Pilot & Glider Settings</h2>
        <p className="text-gray-400 text-xs">Configure pilot name, glider polar, speeds, and glide ratio for navigation calculators.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pilot Info */}
        <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> Pilot Identity
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium">Pilot Name</label>
            <input
              type="text"
              value={getPref('Pilot.Name', '')}
              onChange={(e) => onUpdatePref('Pilot.Name', e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-gray-500">Recorded in IGC flight tracklogs.</span>
          </div>
        </div>

        {/* Glider Info */}
        <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
          <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Plane className="w-4 h-4" /> Glider Model
          </h3>

          <div className="space-y-1.5">
            <label className="text-xs text-gray-300 font-medium">Glider Name</label>
            <input
              type="text"
              value={getPref('Glider.Name', '')}
              onChange={(e) => onUpdatePref('Glider.Name', e.target.value)}
              placeholder="e.g. Ozone Enzo 3 / Niviuk Artik"
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">FAI Class</label>
              <select
                value={getPref('Glider.FAIClass', '3')}
                onChange={(e) => onUpdatePref('Glider.FAIClass', parseInt(e.target.value) || 3)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="3">Class 3 (Paraglider)</option>
                <option value="1">Class 1 (Hang Glider Flexible)</option>
                <option value="2">Class 2 (Hang Glider Rigid)</option>
                <option value="5">Class 5 (Hang Glider Sub-rigid)</option>
                <option value="4">Class 4 (Sailplane)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-gray-300">Engine Type</label>
              <select
                value={getPref('Glider.EngineType', 'T')}
                onChange={(e) => onUpdatePref('Glider.EngineType', e.target.value)}
                className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value="T">None / Thermal</option>
                <option value="E">Electric</option>
                <option value="P">Piston / Paramotor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Speeds & Glide Ratios */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-4 h-4" /> Speeds & Performance Polar
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
            <label className="text-xs text-gray-300 font-medium">Trim Speed (km/h)</label>
            <input
              type="number"
              step="0.5"
              value={getPref('Glider.TrimSpeed', 36)}
              onChange={(e) => onUpdatePref('Glider.TrimSpeed', parseFloat(e.target.value) || 36)}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono"
            />
            <span className="text-[10px] text-gray-500">Hands-off glide speed</span>
          </div>

          <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
            <label className="text-xs text-gray-300 font-medium">Goal Glide Ratio</label>
            <input
              type="number"
              step="0.1"
              value={getPref('Glider.GoalGlideRatio', 7.5)}
              onChange={(e) => onUpdatePref('Glider.GoalGlideRatio', parseFloat(e.target.value) || 7.5)}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono"
            />
            <span className="text-[10px] text-gray-500">Conservative final glide safety factor</span>
          </div>

          <div className="space-y-1 bg-black/20 p-3 rounded-lg border border-white/5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-300 font-medium">Takeoff Speed ({speedUnit})</label>
              <span className="text-[10px] text-sky-400 font-mono">
                {Number(rawTakeoffSpeed).toFixed(2)} m/s SI
              </span>
            </div>
            <input
              type="number"
              step="0.5"
              value={takeoffSpeedDisplay}
              onChange={(e) => handleTakeoffSpeedChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono"
            />
            <span className="text-[10px] text-gray-500">
              Threshold for automatic flight start (displays as {takeoffSpeedDisplay} {speedUnit})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
