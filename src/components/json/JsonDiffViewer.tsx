import React, { useState, useMemo } from 'react';
import {
  GitCommit,
  Split,
  FileCode,
  ListFilter,
  Copy,
  Check,
  RotateCcw,
  Download,
  Search,
  X,
  Sliders,
  Layout,
  Info,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { serializeXcfg, generateExportFilename } from '../../utils/xcfgSerializer';
import { computeLineDiff, computeSemanticDiff, DiffLine, SideBySideLine } from '../../utils/diffEngine';

type DiffViewMode = 'split' | 'unified' | 'summary' | 'raw';

export const JsonDiffViewer: React.FC = () => {
  const store = useEditorStore();
  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);

  // Serialized texts
  const originalJson = useMemo(() => serializeXcfg(store.originalConfig), [store.originalConfig]);
  const currentJson = useMemo(() => serializeXcfg(store.config), [store.config]);

  // Diff results
  const lineDiff = useMemo(() => computeLineDiff(originalJson, currentJson), [originalJson, currentJson]);
  const semanticDiff = useMemo(
    () => computeSemanticDiff(store.originalConfig, store.config),
    [store.originalConfig, store.config]
  );

  const { stats, unified, sideBySide } = lineDiff;

  // Filtered diff lines for search
  const filteredUnified = useMemo(() => {
    if (!searchFilter.trim()) return unified;
    const q = searchFilter.toLowerCase();
    return unified.filter((line) => line.text.toLowerCase().includes(q));
  }, [unified, searchFilter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = generateExportFilename(store.config);
    const blob = new Blob([currentJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetToOriginal = () => {
    if (confirm('Discard all unsaved edits and restore the original loaded configuration?')) {
      editorStore.loadConfig(store.originalConfig, store.filename);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b0e14] text-gray-200 overflow-hidden font-sans select-text">
      {/* Diff Toolbar */}
      <div className="h-12 bg-xctrack-card border-b border-xctrack-border px-4 flex items-center justify-between gap-3 flex-shrink-0">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-xctrack-dark rounded-lg p-0.5 border border-xctrack-border text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'split' ? 'bg-sky-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Side-by-side split diff view"
            >
              <Split className="w-3.5 h-3.5" />
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'unified' ? 'bg-sky-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Classic unified git diff"
            >
              <GitCommit className="w-3.5 h-3.5" />
              Unified Diff
            </button>
            <button
              onClick={() => setViewMode('summary')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'summary' ? 'bg-sky-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="High-level changes summary"
            >
              <ListFilter className="w-3.5 h-3.5" />
              Summary ({semanticDiff.length})
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'raw' ? 'bg-sky-600 text-white font-medium shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
              title="Raw JSON file view"
            >
              <FileCode className="w-3.5 h-3.5" />
              Current JSON
            </button>
          </div>

          {/* Change Stats Badge */}
          {stats.isIdentical ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Identical to loaded config</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-xctrack-dark border border-xctrack-border text-[11px] font-mono">
              <span className="text-emerald-400 font-semibold">+{stats.additions}</span>
              <span className="text-rose-400 font-semibold">-{stats.deletions}</span>
              <span className="text-gray-400 text-[10px]">
                ({semanticDiff.length} {semanticDiff.length === 1 ? 'change' : 'changes'})
              </span>
            </div>
          )}
        </div>

        {/* Center: Search Filter */}
        {(viewMode === 'split' || viewMode === 'unified' || viewMode === 'raw') && (
          <div className="relative w-64 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search diff lines..."
              className="w-full bg-xctrack-dark border border-xctrack-border rounded-md pl-8 pr-7 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 transition-colors font-mono"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {!stats.isIdentical && (
            <button
              onClick={handleResetToOriginal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs transition-colors"
              title="Discard all changes and revert to loaded file"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Changes
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-xctrack-dark hover:bg-white/5 text-gray-300 hover:text-white border border-xctrack-border text-xs transition-colors"
            title="Copy current JSON to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors shadow-sm"
            title="Download .xcfg file"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Main Diff Content Container */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'split' && (
          <SideBySideDiffView sideBySide={sideBySide} searchFilter={searchFilter} filename={store.filename} />
        )}

        {viewMode === 'unified' && (
          <UnifiedDiffView lines={filteredUnified} searchFilter={searchFilter} />
        )}

        {viewMode === 'summary' && (
          <SemanticSummaryView
            semanticDiff={semanticDiff}
            stats={stats}
            onSwitchToSplit={() => setViewMode('split')}
          />
        )}

        {viewMode === 'raw' && (
          <RawJsonView jsonText={currentJson} searchFilter={searchFilter} />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Side-by-Side Diff Component
// ============================================================================
const SideBySideDiffView: React.FC<{
  sideBySide: SideBySideLine[];
  searchFilter: string;
  filename: string;
}> = ({ sideBySide, searchFilter, filename }) => {
  return (
    <div className="rounded-lg border border-xctrack-border bg-xctrack-dark font-mono text-[11px] overflow-x-auto shadow-xl">
      {/* Header labels */}
      <div className="grid grid-cols-2 bg-[#12161f] border-b border-xctrack-border text-xs font-sans text-gray-400 select-none">
        <div className="px-4 py-2 border-r border-xctrack-border flex items-center justify-between">
          <span className="font-semibold text-rose-400/90">Original ({filename})</span>
          <span className="text-[10px] text-gray-500">Loaded baseline</span>
        </div>
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="font-semibold text-emerald-400/90">Current (Modified State)</span>
          <span className="text-[10px] text-gray-500">Active layout</span>
        </div>
      </div>

      {/* Code diff lines */}
      <div className="divide-y divide-white/5">
        {sideBySide.map((pair, idx) => {
          const left = pair.left;
          const right = pair.right;

          // Search match
          const matchesSearch =
            !searchFilter ||
            (left && left.text.toLowerCase().includes(searchFilter.toLowerCase())) ||
            (right && right.text.toLowerCase().includes(searchFilter.toLowerCase()));

          if (!matchesSearch) return null;

          const isLeftRemoved = left?.type === 'removed';
          const isRightAdded = right?.type === 'added';

          return (
            <div key={idx} className="grid grid-cols-2 hover:bg-white/[0.02] transition-colors leading-relaxed">
              {/* Left Pane (Original) */}
              <div
                className={`flex border-r border-xctrack-border/60 ${
                  isLeftRemoved ? 'bg-rose-950/40 text-rose-200' : 'text-gray-400'
                }`}
              >
                <span className="w-12 px-2 py-0.5 text-right text-gray-600 select-none border-r border-xctrack-border/40 font-mono text-[10px] flex-shrink-0">
                  {left && left.lineNumber > 0 ? left.lineNumber : ''}
                </span>
                <span className="px-3 py-0.5 whitespace-pre flex-1 overflow-x-auto">
                  {isLeftRemoved && <span className="text-rose-400 mr-1 select-none font-bold">-</span>}
                  {left?.text || ''}
                </span>
              </div>

              {/* Right Pane (Current) */}
              <div
                className={`flex ${
                  isRightAdded ? 'bg-emerald-950/40 text-emerald-200' : 'text-gray-300'
                }`}
              >
                <span className="w-12 px-2 py-0.5 text-right text-gray-600 select-none border-r border-xctrack-border/40 font-mono text-[10px] flex-shrink-0">
                  {right && right.lineNumber > 0 ? right.lineNumber : ''}
                </span>
                <span className="px-3 py-0.5 whitespace-pre flex-1 overflow-x-auto">
                  {isRightAdded && <span className="text-emerald-400 mr-1 select-none font-bold">+</span>}
                  {right?.text || ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Unified Diff Component
// ============================================================================
const UnifiedDiffView: React.FC<{
  lines: DiffLine[];
  searchFilter: string;
}> = ({ lines }) => {
  return (
    <div className="rounded-lg border border-xctrack-border bg-xctrack-dark font-mono text-[11px] overflow-x-auto shadow-xl">
      <div className="divide-y divide-white/5">
        {lines.map((line, idx) => {
          let lineBg = 'text-gray-300';
          let marker = ' ';

          if (line.type === 'added') {
            lineBg = 'bg-emerald-950/40 text-emerald-200';
            marker = '+';
          } else if (line.type === 'removed') {
            lineBg = 'bg-rose-950/40 text-rose-200';
            marker = '-';
          }

          return (
            <div key={idx} className={`flex items-center hover:bg-white/[0.02] ${lineBg} leading-relaxed`}>
              <span className="w-12 px-2 py-0.5 text-right text-gray-600 select-none font-mono text-[10px] border-r border-xctrack-border/40">
                {line.oldLineNumber || ''}
              </span>
              <span className="w-12 px-2 py-0.5 text-right text-gray-600 select-none font-mono text-[10px] border-r border-xctrack-border/40">
                {line.newLineNumber || ''}
              </span>
              <span className="w-6 text-center select-none font-bold opacity-75">{marker}</span>
              <span className="px-2 py-0.5 whitespace-pre flex-1 overflow-x-auto">{line.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Semantic Summary Component
// ============================================================================
const SemanticSummaryView: React.FC<{
  semanticDiff: ReturnType<typeof computeSemanticDiff>;
  stats: { additions: number; deletions: number; isIdentical: boolean };
  onSwitchToSplit: () => void;
}> = ({ semanticDiff, stats, onSwitchToSplit }) => {
  if (stats.isIdentical) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h3 className="text-white font-semibold text-base mb-1">Configuration Clean & In Sync</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          No modifications have been made since opening this configuration file. Visual edits, layout adjustments, and preference tweaks will show up here as a formatted diff.
        </p>
      </div>
    );
  }

  const byCat = {
    info: semanticDiff.filter((c) => c.category === 'info'),
    layout: semanticDiff.filter((c) => c.category === 'layout'),
    preferences: semanticDiff.filter((c) => c.category === 'preferences'),
    airspace: semanticDiff.filter((c) => c.category === 'airspace'),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview Banner */}
      <div className="bg-xctrack-card border border-xctrack-border rounded-xl p-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-white text-sm">Summary of Configuration Changes</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {semanticDiff.length} distinct items modified compared to the original loaded file.
          </p>
        </div>
        <button
          onClick={onSwitchToSplit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors"
        >
          <Split className="w-3.5 h-3.5" />
          View Full JSON Diff
        </button>
      </div>

      {/* Layout Changes */}
      {byCat.layout.length > 0 && (
        <div className="bg-xctrack-card border border-xctrack-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-sky-400 uppercase tracking-wide">
            <Layout className="w-4 h-4" />
            <span>Screen Layout Changes ({byCat.layout.length})</span>
          </div>
          <div className="space-y-2">
            {byCat.layout.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between bg-xctrack-dark p-2.5 rounded-lg text-xs">
                <div>
                  <div className="text-white font-medium">{item.description}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{item.path}</div>
                </div>
                {item.oldValue && item.newValue && (
                  <div className="text-[11px] font-mono flex items-center gap-2">
                    <span className="text-rose-400 line-through">{item.oldValue}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-emerald-400 font-semibold">{item.newValue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Changes */}
      {byCat.preferences.length > 0 && (
        <div className="bg-xctrack-card border border-xctrack-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <Sliders className="w-4 h-4" />
            <span>Preferences & Pilot Settings ({byCat.preferences.length})</span>
          </div>
          <div className="space-y-2">
            {byCat.preferences.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between bg-xctrack-dark p-2.5 rounded-lg text-xs">
                <div>
                  <div className="text-white font-medium">{item.description}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{item.path}</div>
                </div>
                {item.oldValue && item.newValue ? (
                  <div className="text-[11px] font-mono flex items-center gap-2">
                    <span className="text-rose-400 line-through">{item.oldValue}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-emerald-400 font-semibold">{item.newValue}</span>
                  </div>
                ) : item.newValue ? (
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                    {item.newValue}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Changes */}
      {byCat.info.length > 0 && (
        <div className="bg-xctrack-card border border-xctrack-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-purple-400 uppercase tracking-wide">
            <Info className="w-4 h-4" />
            <span>File & Device Info ({byCat.info.length})</span>
          </div>
          <div className="space-y-2">
            {byCat.info.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between bg-xctrack-dark p-2.5 rounded-lg text-xs">
                <div>
                  <div className="text-white font-medium">{item.description}</div>
                  <div className="text-[11px] text-gray-500 font-mono mt-0.5">{item.path}</div>
                </div>
                {item.oldValue && item.newValue && (
                  <div className="text-[11px] font-mono flex items-center gap-2">
                    <span className="text-rose-400 line-through">{item.oldValue}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-emerald-400 font-semibold">{item.newValue}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Raw JSON Component
// ============================================================================
const RawJsonView: React.FC<{
  jsonText: string;
  searchFilter: string;
}> = ({ jsonText, searchFilter }) => {
  const lines = useMemo(() => jsonText.split('\n'), [jsonText]);

  return (
    <div className="rounded-lg border border-xctrack-border bg-xctrack-dark font-mono text-[11px] overflow-x-auto shadow-xl">
      <div className="divide-y divide-white/5">
        {lines.map((line, idx) => {
          if (searchFilter && !line.toLowerCase().includes(searchFilter.toLowerCase())) {
            return null;
          }

          return (
            <div key={idx} className="flex items-center hover:bg-white/[0.02] text-gray-300 leading-relaxed">
              <span className="w-12 px-2 py-0.5 text-right text-gray-600 select-none font-mono text-[10px] border-r border-xctrack-border/40">
                {idx + 1}
              </span>
              <span className="px-3 py-0.5 whitespace-pre flex-1 overflow-x-auto">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
