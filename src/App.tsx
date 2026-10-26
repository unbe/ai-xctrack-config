import React, { useEffect } from 'react';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { DeviceViewportBar } from './components/toolbar/DeviceViewportBar';
import { ScreenCanvas } from './components/canvas/ScreenCanvas';
import { useEditorStore, editorStore } from './store/useEditorStore';
import { parseXcfg } from './utils/xcfgSerializer';
import sample2026Backup from '../2026-03-12_backup-00.xcfg?raw';

export const App: React.FC = () => {
  const store = useEditorStore();

  // Load the newest 2026 backup config by default on initial start so user immediately sees their widgets
  useEffect(() => {
    try {
      const initial = parseXcfg(sample2026Backup);
      editorStore.loadConfig(initial, '2026-03-12_backup-00.xcfg');
    } catch (e) {
      console.error('Failed to auto-load sample:', e);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0e14] text-gray-100 font-sans">
      <TopToolbar />
      <DeviceViewportBar />

      <main className="flex-1 flex overflow-hidden relative">
        {store.activeTab === 'layout' && (
          <div className="flex-1 flex overflow-hidden">
            <ScreenCanvas />
          </div>
        )}

        {store.activeTab === 'preferences' && (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-8">
            <div className="max-w-md text-center">
              <h2 className="text-lg font-semibold text-white mb-2">Preferences & Full Backup Editor</h2>
              <p className="text-xs text-gray-400">
                Full visual editor for Glider/Pilot settings, 16-point custom acoustic vario curve, triggers, and sensor configuration (Task 4).
              </p>
            </div>
          </div>
        )}

        {store.activeTab === 'json' && (
          <div className="flex-1 p-6 overflow-auto font-mono text-xs text-gray-300">
            <pre className="bg-xctrack-dark p-4 rounded-xl border border-xctrack-border overflow-x-auto">
              {JSON.stringify(store.config, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
