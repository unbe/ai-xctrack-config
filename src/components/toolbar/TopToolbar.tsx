import React, { useState, useEffect, useRef } from 'react';
import {
  FolderOpen,
  Download,
  Undo2,
  Redo2,
  Plus,
  Layout,
  Sliders,
  FileCode,
  Sparkles,
  Search,
  HardDrive,
  CheckCircle2,
  ChevronDown,
  RotateCcw,
  Smartphone,
  Layers,
  X,
  Loader2,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import {
  parseXcfg,
  serializeXcfg,
  generateExportFilename,
  createBlankXcfg,
} from '../../utils/xcfgSerializer';
import { APP_VERSION } from '../../version';
import { BUILTIN_SAMPLES, DEMO_MODERN_BACKUP } from '../../data/sample-configs';

interface LocalFileInfo {
  name: string;
  size: number;
  mtime: number;
  portraitPages: number;
  landscapePages: number;
  totalPages: number;
  deviceName: string | null;
  exportType: string | null;
}

export const TopToolbar: React.FC = () => {
  const store = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);

  const [examplesOpen, setExamplesOpen] = useState(false);
  const [localFiles, setLocalFiles] = useState<LocalFileInfo[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingFileTarget, setLoadingFileTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Close examples menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (examplesRef.current && !examplesRef.current.contains(e.target as Node)) {
        setExamplesOpen(false);
      }
    };
    if (examplesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [examplesOpen]);

  // Fetch local .xcfg examples dynamically from Vite dev server
  const fetchLocalExamples = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch('/api/local-examples');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.files)) {
          setLocalFiles(data.files);
        }
      }
    } catch {
      // In production/static mode without Vite middleware, fallback to empty
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchLocalExamples();
  }, []);

  const toggleExamples = () => {
    const next = !examplesOpen;
    setExamplesOpen(next);
    if (next) {
      fetchLocalExamples();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseXcfg(text);
        editorStore.loadConfig(parsed, file.name);
      } catch (err) {
        alert('Failed to parse .xcfg file: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExport = () => {
    try {
      const serialized = serializeXcfg(store.config);
      const filename = generateExportFilename(store.config);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export configuration: ' + (err as Error).message);
    }
  };

  const handleLoadSample = (sample: (typeof BUILTIN_SAMPLES)[0]) => {
    try {
      editorStore.loadConfig(sample.config, sample.filename);
      setExamplesOpen(false);
    } catch (err) {
      alert('Error loading sample: ' + (err as Error).message);
    }
  };

  const handleLoadLocalFile = async (file: LocalFileInfo) => {
    setLoadingFileTarget(file.name);
    try {
      const res = await fetch(`/api/local-examples/file?name=${encodeURIComponent(file.name)}`);
      if (!res.ok) {
        throw new Error(`Failed to read ${file.name} (HTTP ${res.status})`);
      }
      const json = await res.json();
      if (!json.success || !json.data) {
        throw new Error(json.error || 'Invalid file payload');
      }
      editorStore.loadConfig(json.data, file.name);
      setExamplesOpen(false);
    } catch (err) {
      alert('Failed to load local config: ' + (err as Error).message);
    } finally {
      setLoadingFileTarget(null);
    }
  };

  const handleNewConfig = () => {
    if (confirm('Create new blank configuration? Unsaved changes will be replaced.')) {
      const blank = createBlankXcfg('backup', store.activeDevice.name);
      editorStore.loadConfig(blank, 'untitled.xcfg');
    }
  };

  const handleResetToTemplate = () => {
    if (confirm('Reset editor to default 2026 modern template? Your current edits will be replaced.')) {
      editorStore.clearAutosave();
      editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
    }
  };

  const q = searchQuery.toLowerCase().trim();
  const filteredLocalFiles = localFiles.filter(
    (f) =>
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.deviceName && f.deviceName.toLowerCase().includes(q)) ||
      (f.exportType && f.exportType.toLowerCase().includes(q))
  );

  const filteredBuiltinSamples = BUILTIN_SAMPLES.filter(
    (s) =>
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.filename.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
  );

  return (
    <header className="h-14 bg-xctrack-card border-b border-xctrack-border px-4 flex items-center justify-between select-none relative z-50">
      {/* Brand & File Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg border border-sky-500/30">
            XC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm tracking-wide">XCTrack Layout Editor</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                v{APP_VERSION}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
              <span className="truncate max-w-[190px]" title={store.filename}>
                {store.filename} {store.config.info?.exportType ? `(${store.config.info.exportType})` : ''}
              </span>
              <span className="text-gray-600">•</span>
              {/* Auto-saved Live Chip */}
              <div
                className="flex items-center gap-1 text-[10px] text-emerald-400 font-sans cursor-help"
                title="Edits are automatically saved locally and restored on page reload"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="font-medium">Auto-saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center bg-xctrack-dark rounded-lg p-1 border border-xctrack-border text-xs font-medium">
        <button
          onClick={() => editorStore.setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            store.activeTab === 'layout' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Screen Layouts
        </button>
        <button
          onClick={() => editorStore.setActiveTab('preferences')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            store.activeTab === 'preferences' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Preferences & Backup
        </button>
        <button
          onClick={() => editorStore.setActiveTab('json')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
            store.activeTab === 'json' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          Diff & Export
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editorStore.undo()}
            disabled={store.undoStack.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-xctrack-dark text-gray-300 hover:text-white disabled:opacity-35 disabled:hover:text-gray-400 border border-xctrack-border text-xs font-medium hover:border-gray-600 transition-colors shadow-sm"
            title="Undo last action (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => editorStore.redo()}
            disabled={store.redoStack.length === 0}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-xctrack-dark text-gray-300 hover:text-white disabled:opacity-35 disabled:hover:text-gray-400 border border-xctrack-border text-xs font-medium hover:border-gray-600 transition-colors shadow-sm"
            title="Redo next action (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Redo</span>
          </button>
        </div>

        {/* Load Examples Dropdown (Click to toggle with search and local files) */}
        <div className="relative" ref={examplesRef}>
          <button
            onClick={toggleExamples}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              examplesOpen
                ? 'bg-sky-950/80 text-white border-sky-500 shadow-md shadow-sky-500/20'
                : 'bg-xctrack-dark text-gray-300 hover:text-white border-xctrack-border hover:border-gray-600'
            }`}
            title="Open Config Examples (Local workspace files & built-in templates)"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Examples</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${examplesOpen ? 'rotate-180' : ''}`} />
          </button>

          {examplesOpen && (
            <div className="absolute right-0 top-full mt-2 w-96 max-h-[80vh] bg-xctrack-card border border-xctrack-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
              {/* Header with Search Input */}
              <div className="p-3 border-b border-xctrack-border bg-xctrack-dark/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Load Example Configuration
                  </span>
                  <button
                    onClick={() => setExamplesOpen(false)}
                    className="text-gray-400 hover:text-white p-0.5 rounded hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search configs by name, device..."
                    className="w-full bg-xctrack-darker border border-xctrack-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-3 max-h-[55vh]">
                {/* SECTION 1: Local Workspace Configs (*.xcfg) */}
                <div>
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      Local Workspace Files ({filteredLocalFiles.length})
                    </span>
                    {loadingFiles && (
                      <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />
                    )}
                  </div>

                  {filteredLocalFiles.length === 0 ? (
                    <div className="px-3 py-2 text-[11px] text-gray-500 italic bg-xctrack-darker/50 rounded-lg">
                      {searchQuery
                        ? 'No matching local .xcfg files found.'
                        : 'No local .xcfg files found in workspace.'}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filteredLocalFiles.map((file) => {
                        const isCurrent = store.filename === file.name;
                        const isLoading = loadingFileTarget === file.name;

                        return (
                          <button
                            key={file.name}
                            onClick={() => handleLoadLocalFile(file)}
                            disabled={isLoading}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col gap-1 ${
                              isCurrent
                                ? 'bg-sky-950/40 border-sky-500/60 shadow-sm'
                                : 'bg-xctrack-darker hover:bg-white/5 border-transparent hover:border-xctrack-border text-gray-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-mono font-medium truncate text-white">
                                {file.name}
                              </span>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                                  Local
                                </span>
                                {isLoading && <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-400 flex-wrap">
                              {file.deviceName && (
                                <span className="flex items-center gap-1 text-gray-300">
                                  <Smartphone className="w-2.5 h-2.5 text-gray-500" />
                                  {file.deviceName}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-sky-300">
                                <Layers className="w-2.5 h-2.5 text-sky-400" />
                                {file.portraitPages}P · {file.landscapePages}L
                              </span>
                              <span className="text-gray-500">
                                {(file.size / 1024).toFixed(0)} KB
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* SECTION 2: Built-in Templates */}
                <div>
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Built-in Templates ({filteredBuiltinSamples.length})
                    </span>
                  </div>

                  <div className="space-y-1">
                    {filteredBuiltinSamples.map((sample) => (
                      <button
                        key={sample.filename}
                        onClick={() => handleLoadSample(sample)}
                        className="w-full text-left p-2.5 rounded-lg border bg-xctrack-darker hover:bg-white/5 border-transparent hover:border-xctrack-border text-gray-300 hover:text-white text-xs transition-all flex flex-col gap-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white truncate">{sample.name}</span>
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
                            Template
                          </span>
                        </div>
                        {sample.description && (
                          <span className="text-[10px] text-gray-400 line-clamp-1">
                            {sample.description}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-2 border-t border-xctrack-border bg-xctrack-dark flex items-center justify-between text-[11px] text-gray-400">
                <button
                  onClick={handleResetToTemplate}
                  className="flex items-center gap-1 text-gray-400 hover:text-amber-300 transition-colors px-1.5 py-1 rounded hover:bg-white/5"
                  title="Reset editor to default 2026 modern backup template"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to default template</span>
                </button>
                <button
                  onClick={fetchLocalExamples}
                  className="text-sky-400 hover:text-sky-300 px-1.5 py-1 rounded hover:bg-white/5"
                >
                  Refresh files
                </button>
              </div>
            </div>
          )}
        </div>

        {/* File actions */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xcfg,.json,.xccfg"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={handleNewConfig}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-xctrack-dark text-gray-300 hover:text-white border border-xctrack-border text-xs font-medium hover:border-gray-600 transition-colors"
          title="Create New Blank Config"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-xctrack-dark text-gray-300 hover:text-white border border-xctrack-border text-xs font-medium hover:border-gray-600 transition-colors"
          title="Open .xcfg or .json file"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          Open
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium shadow-sm transition-colors"
          title="Download XCTrack .xcfg configuration"
        >
          <Download className="w-3.5 h-3.5" />
          Download .xcfg
        </button>
      </div>
    </header>
  );
};
