import React, { useRef } from 'react';
import {
  FolderOpen,
  Download,
  RotateCcw,
  RotateCw,
  Plus,
  Layout,
  Sliders,
  FileCode,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { parseXcfg, serializeXcfg, generateExportFilename, createBlankXcfg } from '../../utils/xcfgSerializer';
import { APP_VERSION } from '../../version';

// Import raw sample config files available in repository
import sample2026Backup from '../../../2026-03-12_backup-00.xcfg?raw';
import sample2024Pages from '../../../2024-06-12_pages-00.xcfg?raw';
import sample2023AugBackup from '../../../2023-08-23_backup-00.xcfg?raw';
import sample2023JunBackup from '../../../2023-06-28_backup-00.xcfg?raw';

const SAMPLES = [
  {
    name: '2026-03-12 (Pixel 8 Pro, 0.9.12.6 Backup)',
    filename: '2026-03-12_backup-00.xcfg',
    raw: sample2026Backup,
  },
  {
    name: '2024-06-12 (Pixel 8 Pro, 0.9.11.10 Pages)',
    filename: '2024-06-12_pages-00.xcfg',
    raw: sample2024Pages,
  },
  {
    name: '2023-08-23 (Pixel 6 Pro, 0.9.10.3 Backup)',
    filename: '2023-08-23_backup-00.xcfg',
    raw: sample2023AugBackup,
  },
  {
    name: '2023-06-28 (Pixel 6 Pro, 0.9.10.2 Backup)',
    filename: '2023-06-28_backup-00.xcfg',
    raw: sample2023JunBackup,
  },
];

export const TopToolbar: React.FC = () => {
  const store = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLoadSample = (sample: typeof SAMPLES[0]) => {
    try {
      const parsed = parseXcfg(sample.raw);
      editorStore.loadConfig(parsed, sample.filename);
    } catch (err) {
      alert('Error loading sample: ' + (err as Error).message);
    }
  };

  const handleNewConfig = () => {
    if (confirm('Create new blank configuration? Unsaved changes will be lost.')) {
      const blank = createBlankXcfg('backup', store.activeDevice.name);
      editorStore.loadConfig(blank, 'untitled.xcfg');
    }
  };

  return (
    <header className="h-14 bg-xctrack-card border-b border-xctrack-border px-4 flex items-center justify-between select-none">
      {/* Brand & Version */}
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
            <div className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]" title={store.filename}>
              {store.filename} {store.config.info?.exportType ? `(${store.config.info.exportType})` : ''}
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
          JSON & Diff
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-xctrack-dark rounded-lg p-0.5 border border-xctrack-border">
          <button
            onClick={() => editorStore.undo()}
            disabled={store.undoStack.length === 0}
            className="p-1.5 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => editorStore.redo()}
            disabled={store.redoStack.length === 0}
            className="p-1.5 rounded text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Load Examples Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-xctrack-dark text-gray-300 hover:text-white border border-xctrack-border text-xs font-medium hover:border-gray-600 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Examples
          </button>
          <div className="absolute right-0 top-full mt-1.5 w-64 bg-xctrack-card border border-xctrack-border rounded-lg shadow-xl p-1 z-50 hidden group-hover:block animate-in fade-in slide-in-from-top-1">
            <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-xctrack-border mb-1">
              Workspace Config Examples
            </div>
            {SAMPLES.map((sample) => (
              <button
                key={sample.filename}
                onClick={() => handleLoadSample(sample)}
                className="w-full text-left px-2.5 py-1.5 rounded text-xs text-gray-300 hover:text-white hover:bg-sky-600/20 transition-colors flex items-center justify-between"
              >
                <span className="truncate">{sample.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* File actions */}
        <input ref={fileInputRef} type="file" accept=".xcfg,.json,.xccfg" onChange={handleFileUpload} className="hidden" />

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
          title="Export XCTrack .xcfg"
        >
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </header>
  );
};
