import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Plane,
  Monitor,
  Volume2,
  VolumeX,
  Play,
  Square,
  Zap,
  Keyboard,
  Radio,
  FileCheck,
  GitCompare,
  Plus,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { validateXcfg } from '../../utils/configValidator';

type PrefTab =
  | 'glider'
  | 'display'
  | 'sound'
  | 'triggers'
  | 'keys'
  | 'sensors'
  | 'metadata'
  | 'diff';

interface VarioCurvePoint {
  lift: number;
  freq: number;
  cycleMs: number;
  duty: number;
}

const DEFAULT_VARIO_CURVE: VarioCurvePoint[] = [
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

export const PreferencesEditor: React.FC = () => {
  const store = useEditorStore();
  const [activeTab, setActiveTab] = useState<PrefTab>('glider');
  const [copiedJson, setCopiedJson] = useState(false);

  // Audio vario preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [testLift, setTestLift] = useState(1.5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioIntervalRef = useRef<any>(null);

  const prefs = store.config.preferences || {};
  const validation = validateXcfg(store.config);

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
  // TakeoffSpeed is stored in m/s (2.777778 m/s = 10 km/h)
  const takeoffSpeedDisplay = Math.round((Number(rawTakeoffSpeed) * speedFactor) * 10) / 10;

  const handleTakeoffSpeedChange = (displayVal: number) => {
    const factor = getSpeedFactor(speedUnit);
    const siVal = Math.round((displayVal / factor) * 1000000) / 1000000;
    editorStore.updatePreference('TakeoffSpeed', siVal);
  };

  const getPref = (key: string, fallback: any = '') => {
    return prefs[key] !== undefined ? prefs[key] : fallback;
  };

  const setPref = (key: string, val: any) => {
    editorStore.updatePreference(key, val);
  };

  // Vario Curve parsing
  const customProfile = (prefs['Sound.AcousticVario.CustomProfile'] as any) || {};
  const varioCurve: VarioCurvePoint[] = Array.isArray(customProfile.confTable)
    ? customProfile.confTable
    : DEFAULT_VARIO_CURVE;

  const updateVarioPoint = (index: number, field: keyof VarioCurvePoint, value: number) => {
    const newCurve = [...varioCurve];
    newCurve[index] = { ...newCurve[index], [field]: value };
    editorStore.updatePreference('Sound.AcousticVario.CustomProfile', {
      ...customProfile,
      confTable: newCurve,
    });
  };

  // Interpolate freq & cycle for current testLift
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

  // Web Audio vario sound engine
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
  };

  useEffect(() => {
    if (isPlayingAudio) {
      startAudio();
    }
    return () => stopAudio();
  }, [testLift]);

  // EventMapping triggers parsing: format e.g. "001EV1:ACT1|EV2:ACT2"
  const rawEventMapping = String(getPref('EventMapping', '001START_THERMALING:SHOW_THERMAL_ASSISTANT|STOP_THERMALING:SHOW_LAST_PAGE'));
  const parseEventMapping = (raw: string) => {
    let clean = raw;
    if (clean.startsWith('001')) clean = clean.slice(3);
    if (!clean) return [];
    return clean.split('|').filter(Boolean).map((rule) => {
      const [event, action] = rule.split(':');
      return { event: event || '', action: action || '' };
    });
  };

  const serializeEventMapping = (rules: { event: string; action: string }[]) => {
    const body = rules.map((r) => `${r.event}:${r.action}`).join('|');
    return body ? `001${body}` : '001';
  };

  const triggerRules = parseEventMapping(rawEventMapping);

  const updateTriggerRule = (idx: number, event: string, action: string) => {
    const updated = [...triggerRules];
    updated[idx] = { event, action };
    setPref('EventMapping', serializeEventMapping(updated));
  };

  const addTriggerRule = () => {
    const updated = [...triggerRules, { event: 'BATTERY_LOW', action: 'BEEP' }];
    setPref('EventMapping', serializeEventMapping(updated));
  };

  const removeTriggerRule = (idx: number) => {
    const updated = triggerRules.filter((_, i) => i !== idx);
    setPref('EventMapping', serializeEventMapping(updated));
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0e14] overflow-hidden select-none text-xs">
      {/* Sub-Header Tabs */}
      <div className="bg-[#12161f] border-b border-xctrack-border px-6 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('glider')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'glider'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plane className="w-3.5 h-3.5" /> Pilot & Glider
          </button>

          <button
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'display'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Display & Units
          </button>

          <button
            onClick={() => setActiveTab('sound')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'sound'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" /> Acoustic Vario & Sounds
          </button>

          <button
            onClick={() => setActiveTab('triggers')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'triggers'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Triggers & Events
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'keys'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" /> Keybindings
          </button>

          <button
            onClick={() => setActiveTab('sensors')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'sensors'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> Sensors & Airspace
          </button>

          <button
            onClick={() => setActiveTab('metadata')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'metadata'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> File Metadata
          </button>

          <button
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'diff'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            Diff & Validation
            {!validation.valid && (
              <span className="w-2 h-2 rounded-full bg-red-500 ml-0.5 animate-pulse" />
            )}
          </button>
        </div>

        {/* Export type badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">Export Type:</span>
          <select
            value={store.config.info.exportType}
            onChange={(e) => editorStore.setExportType(e.target.value as 'backup' | 'pages')}
            className="bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-xs text-white cursor-pointer font-medium"
          >
            <option value="backup">Full Backup (Pages + Preferences)</option>
            <option value="pages">Pages Only (Layouts)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
        {/* TAB 1: PILOT & GLIDER */}
        {activeTab === 'glider' && (
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
                    onChange={(e) => setPref('Pilot.Name', e.target.value)}
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
                    onChange={(e) => setPref('Glider.Name', e.target.value)}
                    placeholder="e.g. Ozone Enzo 3 / Niviuk Artik"
                    className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-300">FAI Class</label>
                    <select
                      value={getPref('Glider.FAIClass', '3')}
                      onChange={(e) => setPref('Glider.FAIClass', parseInt(e.target.value) || 3)}
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
                      onChange={(e) => setPref('Glider.EngineType', e.target.value)}
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
                    onChange={(e) => setPref('Glider.TrimSpeed', parseFloat(e.target.value) || 36)}
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
                    onChange={(e) => setPref('Glider.GoalGlideRatio', parseFloat(e.target.value) || 7.5)}
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
        )}

        {/* TAB 2: DISPLAY & UNITS */}
        {activeTab === 'display' && (
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
                      setPref('Display.Theme', e.target.value);
                      editorStore.setGlobalTheme(e.target.value);
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
                    onChange={(e) => setPref('Display.Orientation', e.target.value)}
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
                    onChange={(e) => setPref('Display.Fullscreen', e.target.checked)}
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
                    onChange={(e) => setPref('Display.RepaintInterval', parseInt(e.target.value) || 250)}
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
                      onChange={(e) => setPref('Unit.Altitude', e.target.value)}
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
                      onChange={(e) => setPref('Unit.Speed', e.target.value)}
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
                      onChange={(e) => setPref('Unit.VerticalSpeed', e.target.value)}
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
                      onChange={(e) => setPref('Unit.Distance', e.target.value)}
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
        )}

        {/* TAB 3: ACOUSTIC VARIO & SOUNDS */}
        {activeTab === 'sound' && (
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
                    editorStore.updatePreference('Sound.AcousticVario.CustomProfile', {
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
                      onChange={(e) => setPref(key, e.target.checked)}
                      className="w-4 h-4 rounded bg-[#1c2230] border-gray-600 text-blue-500 focus:ring-0"
                    />
                    <span className="text-gray-300 text-xs">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRIGGERS & ACTIONS */}
        {activeTab === 'triggers' && (
          <div className="space-y-6">
            <div className="border-b border-xctrack-border pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Triggers & Automatic Actions (`EventMapping`)</h2>
                <p className="text-gray-400 text-xs">
                  Automatically switch pages, activate backlights, or toggle zoom on flight events.
                </p>
              </div>
              <button
                onClick={addTriggerRule}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {triggerRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-[#131722] border border-xctrack-border rounded-xl p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-[11px] text-gray-500 font-mono">WHEN</span>
                    <select
                      value={rule.event}
                      onChange={(e) => updateTriggerRule(idx, e.target.value, rule.action)}
                      className="bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-1.5 text-white font-medium"
                    >
                      <option value="START_THERMALING">Start Thermaling (Thermal Assistant)</option>
                      <option value="STOP_THERMALING">Exit Thermal (Back to XC Map)</option>
                      <option value="TAKEOFF">Flight Takeoff</option>
                      <option value="LANDING">Flight Landing</option>
                      <option value="AIRSPACE_PROXIMITY">Airspace Proximity Alert</option>
                      <option value="BATTERY_CHARGING">External Power Connected</option>
                      <option value="BATTERY_LOW">Battery Low</option>
                      <option value="TURNPOINT_REACHED">Turnpoint Reached</option>
                    </select>

                    <span className="text-[11px] text-gray-500 font-mono">THEN</span>
                    <select
                      value={rule.action}
                      onChange={(e) => updateTriggerRule(idx, rule.event, e.target.value)}
                      className="bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-1.5 text-white font-medium"
                    >
                      <option value="SHOW_THERMAL_ASSISTANT">Switch to Thermal Assistant Page</option>
                      <option value="SHOW_LAST_PAGE">Switch to Previous Page</option>
                      <option value="SHOW_NEXT_PAGE">Switch to Next Page</option>
                      <option value="DISPLAY_FULLBACKLIGHT">Turn On Full Backlight</option>
                      <option value="AIRSPACE_PAGE">Switch to Airspace Page</option>
                      <option value="ZOOM_IN">Zoom In Map</option>
                      <option value="ZOOM_OUT">Zoom Out Map</option>
                      <option value="BEEP">Play Alert Beep</option>
                    </select>
                  </div>

                  <button
                    onClick={() => removeTriggerRule(idx)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {triggerRules.length === 0 && (
                <div className="bg-[#131722] border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
                  No automated triggers configured. Click &ldquo;Add Rule&rdquo; to set up automatic page transitions.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: KEYBINDINGS */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="border-b border-xctrack-border pb-3">
              <h2 className="text-base font-semibold text-white">Hardware Keybindings (`Keys.*`)</h2>
              <p className="text-gray-400 text-xs">
                Map phone hardware buttons (Volume keys, Camera, Bluetooth remotes) to flight actions.
              </p>
            </div>

            <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'Keys.NextPage', label: 'Next Page', defaultCode: 87 },
                  { key: 'Keys.PreviousPage', label: 'Previous Page', defaultCode: 88 },
                  { key: 'Keys.ZoomIn', label: 'Map Zoom In', defaultCode: 24 },
                  { key: 'Keys.ZoomOut', label: 'Map Zoom Out', defaultCode: 25 },
                  { key: 'Keys.EnterPan', label: 'Enter Map Pan Mode', defaultCode: -1 },
                  { key: 'Keys.Menu', label: 'Open Menu', defaultCode: -1 },
                  { key: 'Keys.NextWaypoint', label: 'Next Waypoint', defaultCode: -1 },
                  { key: 'Keys.PrevWaypoint', label: 'Previous Waypoint', defaultCode: -1 },
                ].map(({ key, label }) => {
                  const currentCode = getPref(key, -1);
                  return (
                    <div key={key} className="bg-black/20 p-3 rounded-lg border border-white/5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-200 font-medium">{label}</span>
                        <span className="text-[10px] text-gray-500 font-mono">Code: {currentCode}</span>
                      </div>
                      <select
                        value={currentCode}
                        onChange={(e) => setPref(key, parseInt(e.target.value))}
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
        )}

        {/* TAB 6: SENSORS & AIRSPACE */}
        {activeTab === 'sensors' && (
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

              {(() => {
                const sensorConfig = (prefs['Sensors.Configuration'] as any) || {};
                const sensorsList: any[] = Array.isArray(sensorConfig.sensors) ? sensorConfig.sensors : [];

                if (sensorsList.length === 0) {
                  return (
                    <div className="text-gray-500 text-xs p-4 bg-black/20 rounded-lg border border-dashed border-gray-700 text-center">
                      Internal phone sensors (GPS / Barometer) used by default.
                    </div>
                  );
                }

                return (
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
                );
              })()}
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
                  value={(store.config.airspaceSelectedChannels || []).join(', ')}
                  onChange={(e) => {
                    const parsed = e.target.value
                      .split(',')
                      .map((s) => parseInt(s.trim()))
                      .filter((n) => !isNaN(n));
                    editorStore.updateAirspaceChannels(parsed);
                  }}
                  placeholder="e.g. 7, 9"
                  className="bg-[#1c2230] border border-xctrack-border rounded px-3 py-1.5 text-white font-mono text-xs w-48"
                />
                <span className="text-gray-500 text-[11px]">Comma separated channel IDs</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: FILE METADATA */}
        {activeTab === 'metadata' && (
          <div className="space-y-6">
            <div className="border-b border-xctrack-border pb-3">
              <h2 className="text-base font-semibold text-white">Configuration File Metadata (`info`)</h2>
              <p className="text-gray-400 text-xs">Target device identifier, version code, and creation timestamps.</p>
            </div>

            <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-300">Device Description</label>
                  <input
                    type="text"
                    value={store.config.info.device}
                    onChange={(e) => editorStore.updateInfo({ device: e.target.value })}
                    className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-gray-300">Created Timestamp</label>
                  <input
                    type="text"
                    value={store.config.info.timeCreated}
                    onChange={(e) => editorStore.updateInfo({ timeCreated: e.target.value })}
                    className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-gray-300">Version Code</label>
                  <input
                    type="number"
                    value={store.config.info.versionCode}
                    onChange={(e) => editorStore.updateInfo({ versionCode: parseInt(e.target.value) || 91210 })}
                    className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-gray-300">Version Name</label>
                  <input
                    type="text"
                    value={store.config.info.versionName}
                    onChange={(e) => editorStore.updateInfo({ versionName: e.target.value })}
                    className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: DIFF & VALIDATION */}
        {activeTab === 'diff' && (
          <div className="space-y-6">
            <div className="border-b border-xctrack-border pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Visual Diff & Schema Validation</h2>
                <p className="text-gray-400 text-xs">
                  Review modifications against original file and verify compatibility with XCTrack parser.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(store.config, null, 2));
                  setCopiedJson(true);
                  setTimeout(() => setCopiedJson(false), 2000);
                }}
                className="px-3 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#252d40] border border-xctrack-border text-white text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedJson ? 'Copied JSON!' : 'Copy Formatted JSON'}
              </button>
            </div>

            {/* Validation Alert Box */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                validation.valid
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/20 border-red-500/30 text-red-300'
              }`}
            >
              {validation.valid ? (
                <FileCheck className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              )}
              <div>
                <span className="font-semibold block text-xs">
                  {validation.valid ? 'Configuration Valid & Ready for XCTrack' : 'Validation Issues Found'}
                </span>
                <span className="text-[11px] opacity-80 block">
                  {validation.valid
                    ? 'All required keys, coordinates, and schemas strictly comply with XCTrack Android requirements.'
                    : validation.errors.map((e) => `${e.path}: ${e.message}`).join('; ')}
                </span>
              </div>
            </div>

            {/* Diff Summary */}
            <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-3 font-mono text-xs">
              <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-sky-400" /> Changes Summary
              </h3>

              {(() => {
                const orig = store.originalConfig;
                const curr = store.config;

                const origPortPages = orig.layout?.portrait?.length || 0;
                const currPortPages = curr.layout?.portrait?.length || 0;
                const origLandPages = orig.layout?.landscape?.length || 0;
                const currLandPages = curr.layout?.landscape?.length || 0;

                const diffs: string[] = [];
                if (origPortPages !== currPortPages) {
                  diffs.push(`Portrait pages: ${origPortPages} → ${currPortPages}`);
                }
                if (origLandPages !== currLandPages) {
                  diffs.push(`Landscape pages: ${origLandPages} → ${currLandPages}`);
                }
                if (orig.info?.exportType !== curr.info?.exportType) {
                  diffs.push(`Export type: ${orig.info?.exportType} → ${curr.info?.exportType}`);
                }
                if (orig.info?.device !== curr.info?.device) {
                  diffs.push(`Device: "${orig.info?.device}" → "${curr.info?.device}"`);
                }

                // Check modified preferences
                const origPrefs = orig.preferences || {};
                const currPrefs = curr.preferences || {};
                const allKeys = Array.from(new Set([...Object.keys(origPrefs), ...Object.keys(currPrefs)]));
                let modifiedPrefs = 0;
                for (const k of allKeys) {
                  if (JSON.stringify(origPrefs[k]) !== JSON.stringify(currPrefs[k])) {
                    modifiedPrefs++;
                  }
                }
                if (modifiedPrefs > 0) {
                  diffs.push(`${modifiedPrefs} preference setting(s) changed`);
                }

                if (diffs.length === 0) {
                  return (
                    <div className="text-gray-500 py-2">
                      No changes from original loaded file &ldquo;{store.filename}&rdquo;.
                    </div>
                  );
                }

                return (
                  <ul className="space-y-1.5 list-disc pl-5 text-gray-300">
                    {diffs.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
