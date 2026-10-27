import React, { useEffect, useState } from 'react';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { DeviceViewportBar } from './components/toolbar/DeviceViewportBar';
import { ScreenCanvas } from './components/canvas/ScreenCanvas';
import { PageManagerPanel } from './components/sidebar/PageManagerPanel';
import { WidgetPalettePanel } from './components/sidebar/WidgetPalettePanel';
import { WidgetPropertyInspector } from './components/inspector/WidgetPropertyInspector';
import { PreferencesEditor } from './components/preferences/PreferencesEditor';
import { JsonDiffViewer } from './components/json/JsonDiffViewer';
import { useEditorStore, editorStore } from './store/useEditorStore';
import { DEMO_MODERN_BACKUP } from './data/sample-configs';
import { FileText, PlusCircle } from 'lucide-react';

type SidebarTab = 'pages' | 'widgets';

export const App: React.FC = () => {
  const store = useEditorStore();
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('pages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Initialize: restore previous session work via auto-save if present, otherwise load standard modern backup
  useEffect(() => {
    try {
      const restored = editorStore.restoreAutosavedSession();
      if (!restored) {
        editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
      }
    } catch (e) {
      console.error('Failed to restore autosaved session:', e);
      editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
    }
  }, []);

  // Global keyboard shortcuts (Undo / Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is actively editing text inputs
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const isZ = e.key.toLowerCase() === 'z' || e.code === 'KeyZ';
      const isY = e.key.toLowerCase() === 'y' || e.code === 'KeyY';

      if ((e.ctrlKey || e.metaKey) && isZ) {
        e.preventDefault();
        if (e.shiftKey) {
          editorStore.redo();
        } else {
          editorStore.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && isY) {
        e.preventDefault();
        editorStore.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0e14] text-gray-100 font-sans">
      <TopToolbar />
      {store.activeTab === 'layout' && <DeviceViewportBar />}

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
              </div>

              {/* Panel Content (collapsible) */}
              {!sidebarCollapsed && (
                <div className="flex h-full">
                  {activeSidebarTab === 'pages' && <PageManagerPanel />}
                  {activeSidebarTab === 'widgets' && <WidgetPalettePanel />}
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

        {store.activeTab === 'preferences' && <PreferencesEditor />}

        {store.activeTab === 'json' && <JsonDiffViewer />}
      </main>
    </div>
  );
};

export default App;
