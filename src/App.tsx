import React, { useEffect, useState } from 'react';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { DeviceViewportBar } from './components/toolbar/DeviceViewportBar';
import { ScreenCanvas } from './components/canvas/ScreenCanvas';
import { PageManagerPanel } from './components/sidebar/PageManagerPanel';
import { WidgetPalettePanel } from './components/sidebar/WidgetPalettePanel';
import { LayerOrderPanel } from './components/sidebar/LayerOrderPanel';
import { WidgetPropertyInspector } from './components/inspector/WidgetPropertyInspector';
import { PreferencesEditor } from './components/preferences/PreferencesEditor';
import { useEditorStore, editorStore } from './store/useEditorStore';
import { parseXcfg } from './utils/xcfgSerializer';
import sample2026Backup from '../2026-03-12_backup-00.xcfg?raw';
import { FileText, PlusCircle, Layers, Sliders } from 'lucide-react';

type SidebarTab = 'pages' | 'widgets' | 'layers';

export const App: React.FC = () => {
  const store = useEditorStore();
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('pages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
            {/* Left Sidebar Icon / Tab Switcher + Panel */}
            <div className="flex h-full flex-shrink-0 z-10 border-r border-xctrack-border bg-xctrack-darker">
              {/* Vertical icon rail */}
              <div className="w-12 bg-xctrack-dark border-r border-xctrack-border flex flex-col items-center py-3 gap-3">
                <button
                  onClick={() => {
                    if (activeSidebarTab === 'pages' && !sidebarCollapsed) {
                      setSidebarCollapsed(true);
                    } else {
                      setActiveSidebarTab('pages');
                      setSidebarCollapsed(false);
                    }
                  }}
                  title="Pages Manager"
                  className={`p-2.5 rounded-xl transition-all ${
                    activeSidebarTab === 'pages' && !sidebarCollapsed
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (activeSidebarTab === 'widgets' && !sidebarCollapsed) {
                      setSidebarCollapsed(true);
                    } else {
                      setActiveSidebarTab('widgets');
                      setSidebarCollapsed(false);
                    }
                  }}
                  title="Widget Palette"
                  className={`p-2.5 rounded-xl transition-all ${
                    activeSidebarTab === 'widgets' && !sidebarCollapsed
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (activeSidebarTab === 'layers' && !sidebarCollapsed) {
                      setSidebarCollapsed(true);
                    } else {
                      setActiveSidebarTab('layers');
                      setSidebarCollapsed(false);
                    }
                  }}
                  title="Widgets on Page & Layers"
                  className={`p-2.5 rounded-xl transition-all relative ${
                    activeSidebarTab === 'layers' && !sidebarCollapsed
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Content (collapsible) */}
              {!sidebarCollapsed && (
                <div className="flex h-full">
                  {activeSidebarTab === 'pages' && <PageManagerPanel />}
                  {activeSidebarTab === 'widgets' && <WidgetPalettePanel />}
                  {activeSidebarTab === 'layers' && <LayerOrderPanel />}
                </div>
              )}
            </div>

            {/* Central Canvas */}
            <div className="flex-1 flex overflow-hidden">
              <ScreenCanvas />
            </div>

            {/* Right Sidebar: Widget Inspector */}
            <div className="flex-shrink-0 z-10">
              <WidgetPropertyInspector />
            </div>
          </div>
        )}

        {store.activeTab === 'preferences' && (
          <PreferencesEditor />
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
