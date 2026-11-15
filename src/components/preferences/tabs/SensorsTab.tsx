import React from 'react';
import { Radio, Plane } from 'lucide-react';

export interface SensorsTabProps {
  prefs: Record<string, any>;
  airspaceSelectedChannels?: number[];
  onUpdatePref: (key: string, value: any) => void;
  onUpdateAirspaceChannels: (channels: number[]) => void;
}

export const SensorsTab: React.FC<SensorsTabProps> = ({
  prefs,
  airspaceSelectedChannels = [],
  onUpdateAirspaceChannels,
}) => {
  const sensorConfig = (prefs['Sensors.Configuration'] as any) || {};
  const sensorsList: any[] = Array.isArray(sensorConfig.sensors) ? sensorConfig.sensors : [];

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3">
        <h2 className="text-base font-semibold text-white">Sensors & Airspace Channels</h2>
        <p className="text-gray-400 text-xs">
          Manage external BLE / internal vario sensors and selected airspace download channels.
        </p>
      </div>

      {/* Sensors Configuration */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Radio className="w-4 h-4" /> Configured Sensors (`Sensors.Configuration`)
        </h3>

        {sensorsList.length === 0 ? (
          <div className="text-gray-500 text-xs p-4 bg-black/20 rounded-lg border border-dashed border-gray-700 text-center">
            Internal phone sensors (GPS / Barometer) used by default.
          </div>
        ) : (
          <div className="space-y-2.5">
            {sensorsList.map((sensor, idx) => (
              <div
                key={idx}
                className="bg-black/25 border border-white/5 rounded-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium text-xs">
                      {sensor.name || (sensor.type?.includes('Bluetooth') ? 'Bluetooth Sensor' : 'Internal Sensor')}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {sensor.btAddress || 'Device Hardware'}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {(sensor.filters || []).map((f: string) => (
                      <span
                        key={f}
                        className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Airspace Selected Channels */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Plane className="w-4 h-4" /> Selected Airspace Channels (`airspaceSelectedChannels`)
        </h3>
        <p className="text-[11px] text-gray-400">
          Official country/region airspace channel IDs subscribed for auto-updating in XCTrack.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={airspaceSelectedChannels.join(', ')}
            onChange={(e) => {
              const parsed = e.target.value
                .split(',')
                .map((s) => parseInt(s.trim()))
                .filter((n) => !isNaN(n));
              onUpdateAirspaceChannels(parsed);
            }}
            placeholder="e.g. 7, 9"
            className="bg-[#1c2230] border border-xctrack-border rounded px-3 py-1.5 text-white font-mono text-xs w-48"
          />
          <span className="text-gray-500 text-[11px]">Comma separated channel IDs</span>
        </div>
      </div>
    </div>
  );
};
