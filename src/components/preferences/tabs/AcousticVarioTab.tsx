import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Square, Sliders } from 'lucide-react';

export interface VarioCurvePoint {
  lift: number;
  freq: number;
  cycleMs: number;
  duty: number;
}

export const DEFAULT_VARIO_CURVE: VarioCurvePoint[] = [
  { lift: -7, freq: 239, cycleMs: 200, duty: 100 },
  { lift: -5, freq: 266, cycleMs: 200, duty: 100 },
  { lift: -4, freq: 279, cycleMs: 200, duty: 100 },
  { lift: -3, freq: 293, cycleMs: 200, duty: 100 },
  { lift: -2, freq: 369, cycleMs: 200, duty: 100 },
  { lift: -1, freq: 440, cycleMs: 200, duty: 100 },
  { lift: 0, freq: 493, cycleMs: 600, duty: 50 },
  { lift: 0.25, freq: 521, cycleMs: 575, duty: 50 },
  { lift: 0.5, freq: 550, cycleMs: 550, duty: 50 },
  { lift: 1, freq: 595, cycleMs: 500, duty: 50 },
  { lift: 1.5, freq: 635, cycleMs: 450, duty: 50 },
  { lift: 2, freq: 675, cycleMs: 400, duty: 50 },
  { lift: 3, freq: 745, cycleMs: 310, duty: 50 },
  { lift: 4, freq: 812, cycleMs: 280, duty: 50 },
  { lift: 5, freq: 880, cycleMs: 250, duty: 50 },
  { lift: 7, freq: 971, cycleMs: 230, duty: 50 },
];

export interface AcousticVarioTabProps {
  prefs: Record<string, any>;
  onUpdatePref: (key: string, value: any) => void;
}

export const AcousticVarioTab: React.FC<AcousticVarioTabProps> = ({ prefs, onUpdatePref }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [testLift, setTestLift] = useState(1.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any>(null);

  const getPref = (key: string, fallback: any = '') => {
    return prefs[key] !== undefined ? prefs[key] : fallback;
  };

  const customProfile = (prefs['Sound.AcousticVario.CustomProfile'] as any) || {};
  const varioCurve: VarioCurvePoint[] = Array.isArray(customProfile.confTable)
    ? customProfile.confTable
    : DEFAULT_VARIO_CURVE;

  const updateVarioPoint = (index: number, field: keyof VarioCurvePoint, value: number) => {
    const newCurve = [...varioCurve];
    newCurve[index] = { ...newCurve[index], [field]: value };
    onUpdatePref('Sound.AcousticVario.CustomProfile', {
      ...customProfile,
      confTable: newCurve,
    });
  };

  const getInterpolatedTone = (lift: number) => {
    const sorted = [...varioCurve].sort((a, b) => a.lift - b.lift);
    if (lift <= sorted[0].lift) return sorted[0];
    if (lift >= sorted[sorted.length - 1].lift) return sorted[sorted.length - 1];

    for (let i = 0; i < sorted.length - 1; i++) {
      const p1 = sorted[i];
      const p2 = sorted[i + 1];
      if (lift >= p1.lift && lift <= p2.lift) {
        const factor = (lift - p1.lift) / (p2.lift - p1.lift);
        return {
          lift,
          freq: Math.round(p1.freq + factor * (p2.freq - p1.freq)),
          cycleMs: Math.round(p1.cycleMs + factor * (p2.cycleMs - p1.cycleMs)),
          duty: Math.round(p1.duty + factor * (p2.duty - p1.duty)),
        };
      }
    }
    return sorted[0];
  };

  const stopAudio = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const startAudio = () => {
    stopAudio();
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;
      setIsPlayingAudio(true);

      const playTone = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const tone = getInterpolatedTone(testLift);
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(tone.freq, now);

        const onTime = (tone.cycleMs * (tone.duty / 100)) / 1000;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.setValueAtTime(0.2, now + onTime - 0.01);
        gain.gain.linearRampToValueAtTime(0.001, now + onTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + onTime);
      };

      const initialTone = getInterpolatedTone(testLift);
      playTone();
      audioIntervalRef.current = setInterval(playTone, Math.max(100, initialTone.cycleMs));
    } catch {
      // AudioContext may fail in non-browser/unsupported environments
    }
  };

  useEffect(() => {
    if (isPlayingAudio) {
      startAudio();
    }
    return () => stopAudio();
  }, [testLift]);

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Acoustic Vario & Sound Profiles</h2>
          <p className="text-gray-400 text-xs">
            Customize the 16-point paragliding vario lift/sink curve and test tone beeps with live Web Audio API.
          </p>
        </div>

        {/* Tone Synthesizer Test Box */}
        <div className="flex items-center gap-3 bg-blue-950/40 border border-blue-500/30 rounded-xl px-4 py-2">
          <div>
            <span className="text-[10px] text-blue-300 block uppercase font-bold">Vario Audio Test</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="-7"
                max="7"
                step="0.25"
                value={testLift}
                onChange={(e) => setTestLift(parseFloat(e.target.value))}
                className="w-28 h-1.5 bg-gray-700 rounded-lg cursor-pointer accent-blue-400"
              />
              <span className="font-mono text-white text-xs w-14 text-right">
                {testLift > 0 ? `+${testLift.toFixed(2)}` : testLift.toFixed(2)} m/s
              </span>
            </div>
          </div>

          <button
            onClick={isPlayingAudio ? stopAudio : startAudio}
            className={`p-2.5 rounded-lg flex items-center gap-1.5 font-semibold text-xs transition-all ${
              isPlayingAudio
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Stop
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Test Audio
              </>
            )}
          </button>
        </div>
      </div>

      {/* 16-Point Acoustic Curve Table */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> 16-Point Acoustic Vario Table (`confTable`)
            </h3>
            <span className="text-[11px] text-gray-500">
              Defines frequency (Hz), beep cycle duration (ms), and duty cycle (%) for each vertical speed threshold.
            </span>
          </div>
          <button
            onClick={() =>
              onUpdatePref('Sound.AcousticVario.CustomProfile', {
                confTable: DEFAULT_VARIO_CURVE,
              })
            }
            className="px-2.5 py-1 rounded bg-[#1c2230] hover:bg-[#252d40] border border-xctrack-border text-[11px] text-gray-300 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>

        <div className="overflow-x-auto border border-xctrack-border rounded-lg">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#181d28] text-gray-400 border-b border-xctrack-border">
              <tr>
                <th className="p-2.5">Lift (m/s)</th>
                <th className="p-2.5">Frequency (Hz)</th>
                <th className="p-2.5">Cycle (ms)</th>
                <th className="p-2.5">Duty Cycle (%)</th>
                <th className="p-2.5">Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {varioCurve.map((point, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-2 font-semibold">
                    <input
                      type="number"
                      step="0.25"
                      value={point.lift}
                      onChange={(e) => updateVarioPoint(idx, 'lift', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-[#1c2230] border border-xctrack-border rounded px-1.5 py-0.5 text-center text-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="10"
                      value={point.freq}
                      onChange={(e) => updateVarioPoint(idx, 'freq', parseInt(e.target.value) || 200)}
                      className="w-20 bg-[#1c2230] border border-xctrack-border rounded px-1.5 py-0.5 text-center text-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      step="10"
                      value={point.cycleMs}
                      onChange={(e) => updateVarioPoint(idx, 'cycleMs', parseInt(e.target.value) || 200)}
                      className="w-20 bg-[#1c2230] border border-xctrack-border rounded px-1.5 py-0.5 text-center text-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      value={point.duty}
                      onChange={(e) => updateVarioPoint(idx, 'duty', parseInt(e.target.value) || 50)}
                      className="w-16 bg-[#1c2230] border border-xctrack-border rounded px-1.5 py-0.5 text-center text-white"
                    />
                  </td>
                  <td className="p-2 text-gray-400 text-[11px]">
                    {point.duty === 100 ? (
                      <span className="text-red-400">Continuous Sink Tone</span>
                    ) : point.lift === 0 ? (
                      <span className="text-yellow-400">Zero / Thermal Sniffer</span>
                    ) : (
                      <span className="text-emerald-400">Beeping Lift ({Math.round(1000 / point.cycleMs)} beeps/s)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sound Notification Toggles */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
          <Volume2 className="w-4 h-4" /> Sound Notifications & Alerts
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'Sound.Takeoff', label: 'Takeoff Detected' },
            { key: 'Sound.Landing', label: 'Landing Detected' },
            { key: 'Sound.GpsOK', label: 'GPS Fixed' },
            { key: 'Sound.AirspaceCrossed', label: 'Airspace Violation' },
            { key: 'Sound.AirspaceRedWarn', label: 'Airspace Red Warning' },
            { key: 'Sound.AirspaceOrangeWarn', label: 'Airspace Warning' },
            { key: 'Sound.Obstacle', label: 'Obstacle Warning' },
            { key: 'Sound.CompTurnpointCrossed', label: 'Task Turnpoint' },
            { key: 'Sound.CompGoalCrossed', label: 'Goal Crossed' },
            { key: 'Sound.BatteryLevel', label: 'Battery Warning' },
            { key: 'Sound.BtOK', label: 'Bluetooth Connected' },
            { key: 'Sound.BtKO', label: 'Bluetooth Disconnected' },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-black/20 border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
            >
              <input
                type="checkbox"
                checked={getPref(key, true)}
                onChange={(e) => onUpdatePref(key, e.target.checked)}
                className="w-4 h-4 rounded bg-[#1c2230] border-gray-600 text-blue-500 focus:ring-0"
              />
              <span className="text-gray-300 text-xs">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
