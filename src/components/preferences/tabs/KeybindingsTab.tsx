import React from 'react';

export interface KeybindingsTabProps {
  prefs: Record<string, any>;
  onUpdatePref: (key: string, value: any) => void;
}

export const KeybindingsTab: React.FC<KeybindingsTabProps> = ({ prefs, onUpdatePref }) => {
  const getPref = (key: string, fallback: any = -1) => {
    return prefs[key] !== undefined ? prefs[key] : fallback;
  };

  const keybindingOptions = [
    { key: 'Keys.NextPage', label: 'Next Page', defaultCode: 87 },
    { key: 'Keys.PreviousPage', label: 'Previous Page', defaultCode: 88 },
    { key: 'Keys.ZoomIn', label: 'Map Zoom In', defaultCode: 24 },
    { key: 'Keys.ZoomOut', label: 'Map Zoom Out', defaultCode: 25 },
    { key: 'Keys.EnterPan', label: 'Enter Map Pan Mode', defaultCode: -1 },
    { key: 'Keys.Menu', label: 'Open Menu', defaultCode: -1 },
    { key: 'Keys.NextWaypoint', label: 'Next Waypoint', defaultCode: -1 },
    { key: 'Keys.PrevWaypoint', label: 'Previous Waypoint', defaultCode: -1 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3">
        <h2 className="text-base font-semibold text-white">Hardware Keybindings (`Keys.*`)</h2>
        <p className="text-gray-400 text-xs">
          Map phone hardware buttons (Volume keys, Camera, Bluetooth remotes) to flight actions.
        </p>
      </div>

      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {keybindingOptions.map(({ key, label }) => {
            const currentCode = getPref(key, -1);
            return (
              <div key={key} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-200 font-medium">{label}</span>
                  <span className="text-[10px] text-gray-500 font-mono">Code: {currentCode}</span>
                </div>
                <select
                  value={currentCode}
                  onChange={(e) => onUpdatePref(key, parseInt(e.target.value))}
                  className="w-full bg-[#1c2230] border border-xctrack-border rounded px-2.5 py-1.5 text-white font-mono text-xs"
                >
                  <option value="-1">Disabled (-1)</option>
                  <option value="24">Volume Up (24)</option>
                  <option value="25">Volume Down (25)</option>
                  <option value="87">Media Next (87)</option>
                  <option value="88">Media Prev (88)</option>
                  <option value="85">Media Play/Pause (85)</option>
                  <option value="19">D-Pad Up (19)</option>
                  <option value="20">D-Pad Down (20)</option>
                  <option value="21">D-Pad Left (21)</option>
                  <option value="22">D-Pad Right (22)</option>
                  <option value="27">Camera Shutter (27)</option>
                </select>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
