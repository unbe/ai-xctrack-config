import React, { useState } from 'react';
import {
  Plane,
  Monitor,
  Volume2,
  Zap,
  Keyboard,
  Radio,
  FileCheck,
  GitCompare,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { validateXcfg } from '../../utils/configValidator';
import { PilotGliderTab } from './tabs/PilotGliderTab';
import { DisplayUnitsTab } from './tabs/DisplayUnitsTab';
import { AcousticVarioTab, VarioCurvePoint, DEFAULT_VARIO_CURVE } from './tabs/AcousticVarioTab';
import { TriggersTab } from './tabs/TriggersTab';
import { KeybindingsTab } from './tabs/KeybindingsTab';
import { SensorsTab } from './tabs/SensorsTab';
import { FileMetadataTab } from './tabs/FileMetadataTab';
import { DiffValidationTab } from './tabs/DiffValidationTab';

export { type VarioCurvePoint, DEFAULT_VARIO_CURVE };

export type PrefTab =
  | 'glider'
  | 'display'
  | 'sound'
  | 'triggers'
  | 'keys'
  | 'sensors'
  | 'metadata'
  | 'diff';

export const PreferencesEditor: React.FC = () => {
  const store = useEditorStore();
  const [activeTab, setActiveTab] = useState<PrefTab>('glider');

  const prefs = store.config.preferences || {};
  const validation = validateXcfg(store.config);

  const rawEventMapping = String(
    prefs['EventMapping'] !== undefined
      ? prefs['EventMapping']
      : '001START_THERMALING:SHOW_THERMAL_ASSISTANT|STOP_THERMALING:SHOW_LAST_PAGE'
  );

  const handleUpdatePref = (key: string, val: any) => {
    editorStore.updatePreference(key, val);
  };

  const handleUpdateInfo = (infoUpdates: Record<string, any>) => {
    editorStore.updateInfo(infoUpdates);
  };

  const handleUpdateAirspaceChannels = (channels: number[]) => {
    editorStore.updateAirspaceChannels(channels);
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
        {activeTab === 'glider' && (
          <PilotGliderTab prefs={prefs} onUpdatePref={handleUpdatePref} />
        )}
        {activeTab === 'display' && (
          <DisplayUnitsTab
            prefs={prefs}
            onUpdatePref={handleUpdatePref}
            onSetGlobalTheme={(theme) => editorStore.setGlobalTheme(theme)}
          />
        )}
        {activeTab === 'sound' && (
          <AcousticVarioTab prefs={prefs} onUpdatePref={handleUpdatePref} />
        )}
        {activeTab === 'triggers' && (
          <TriggersTab
            rawEventMapping={rawEventMapping}
            onUpdateEventMapping={(mapping) => handleUpdatePref('EventMapping', mapping)}
          />
        )}
        {activeTab === 'keys' && (
          <KeybindingsTab prefs={prefs} onUpdatePref={handleUpdatePref} />
        )}
        {activeTab === 'sensors' && (
          <SensorsTab
            prefs={prefs}
            airspaceSelectedChannels={store.config.airspaceSelectedChannels}
            onUpdatePref={handleUpdatePref}
            onUpdateAirspaceChannels={handleUpdateAirspaceChannels}
          />
        )}
        {activeTab === 'metadata' && (
          <FileMetadataTab info={store.config.info} onUpdateInfo={handleUpdateInfo} />
        )}
        {activeTab === 'diff' && (
          <DiffValidationTab
            config={store.config}
            originalConfig={store.originalConfig}
            filename={store.filename}
          />
        )}
      </div>
    </div>
  );
};
