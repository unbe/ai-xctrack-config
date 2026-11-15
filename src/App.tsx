import React, { useEffect, useState, useRef } from 'react';
import { TopToolbar } from './components/toolbar/TopToolbar';
import { DeviceViewportBar } from './components/toolbar/DeviceViewportBar';
import { ScreenCanvas } from './components/canvas/ScreenCanvas';
import { PageManagerPanel } from './components/sidebar/PageManagerPanel';
import { WidgetPalettePanel } from './components/sidebar/WidgetPalettePanel';
import { WidgetPropertyInspector } from './components/inspector/WidgetPropertyInspector';
import { PreferencesEditor } from './components/preferences/PreferencesEditor';
import { JsonDiffViewer } from './components/json/JsonDiffViewer';
import { DialogContainer } from './components/ui/DialogContainer';
import { useEditorStore, editorStore } from './store/useEditorStore';
import { dialogStore } from './store/useDialogStore';
import { parseXcfg } from './utils/xcfgSerializer';
import { DEMO_MODERN_BACKUP } from './data/sample-configs';
import { FileText, PlusCircle, UploadCloud } from 'lucide-react';

type SidebarTab = 'pages' | 'widgets';

export const App: React.FC = () => {
  const store = useEditorStore();
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('pages');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const dragCounter = useRef(0);

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

  // HTML5 Drag-and-Drop file ingestion
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        dragCounter.current++;
        setIsDraggingFile(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setIsDraggingFile(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingFile(false);

      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          const parsed = parseXcfg(text);
          editorStore.loadConfig(parsed, file.name);
          dialogStore.success(`Successfully loaded configuration from ${file.name}`);
        } catch (err) {
          dialogStore.error(`Failed to parse file "${file.name}": ${(err as Error).message}`);
        }
      };

      reader.onerror = () => {
        dialogStore.error(`Failed to read file "${file.name}"`);
      };

      reader.readAsText(file);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
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

      {/* Drag & Drop Visual Dropzone Overlay */}
      {isDraggingFile && (
        <div
          data-testid="dropzone-overlay"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none p-8 animate-in fade-in duration-150"
        >
          <div className="border-2 border-dashed border-blue-500 rounded-3xl p-10 bg-blue-950/40 flex flex-col items-center gap-4 text-white shadow-2xl max-w-lg text-center animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">Drop .xcfg Configuration</h3>
            <p className="text-gray-300 text-sm">
              Release the file to load and edit it in the workspace. Supports standard <span className="font-mono text-blue-400">.xcfg</span> and JSON configuration files.
            </p>
          </div>
        </div>
      )}

      {/* Global Toast & Modal Dialog System */}
      <DialogContainer />
    </div>
  );
};

export default App;
