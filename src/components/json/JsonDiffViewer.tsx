import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { serializeXcfg, generateExportFilename } from '../../utils/xcfgSerializer';
import { computeLineDiff, computeSemanticDiff, DiffLine, SideBySideLine, SemanticChangeItem } from '../../utils/diffEngine';

type DiffViewMode = 'split' | 'unified' | 'summary' | 'raw';

export interface DiffHunkBlock {
  id: string;
  index: number;
  startIndex: number;
  endIndex: number;
  label?: string;
}

export const JsonDiffViewer: React.FC = () => {
  const store = useEditorStore();
  const [viewMode, setViewMode] = useState<DiffViewMode>('split');
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeDiffIndex, setActiveDiffIndex] = useState<number>(0);

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

  // Compute diff blocks for Side-by-Side view (contiguous changed rows)
  const sideBySideDiffBlocks = useMemo<DiffHunkBlock[]>(() => {
    const blocks: DiffHunkBlock[] = [];
    let inBlock = false;
    let start = 0;

    sideBySide.forEach((pair, idx) => {
      const isDiff = pair.left?.type === 'removed' || pair.right?.type === 'added';
      if (isDiff) {
        if (!inBlock) {
          inBlock = true;
          start = idx;
        }
      } else {
        if (inBlock) {
          blocks.push({
            id: `sbs-hunk-${blocks.length}`,
            index: blocks.length,
            startIndex: start,
            endIndex: idx - 1,
          });
          inBlock = false;
        }
      }
    });
    if (inBlock) {
      blocks.push({
        id: `sbs-hunk-${blocks.length}`,
        index: blocks.length,
        startIndex: start,
        endIndex: sideBySide.length - 1,
      });
    }
    return blocks;
  }, [sideBySide]);

  // Compute diff blocks for Unified view (contiguous changed lines)
  const unifiedDiffBlocks = useMemo<DiffHunkBlock[]>(() => {
    const blocks: DiffHunkBlock[] = [];
    let inBlock = false;
    let start = 0;

    unified.forEach((line, idx) => {
      const isDiff = line.type === 'added' || line.type === 'removed';
      if (isDiff) {
        if (!inBlock) {
          inBlock = true;
          start = idx;
        }
      } else {
        if (inBlock) {
          blocks.push({
            id: `unified-hunk-${blocks.length}`,
            index: blocks.length,
            startIndex: start,
            endIndex: idx - 1,
          });
          inBlock = false;
        }
      }
    });
    if (inBlock) {
      blocks.push({
        id: `unified-hunk-${blocks.length}`,
        index: blocks.length,
        startIndex: start,
        endIndex: unified.length - 1,
      });
    }
    return blocks;
  }, [unified]);

  // Compute diff blocks for Summary view
  const summaryDiffBlocks = useMemo<DiffHunkBlock[]>(() => {
    return semanticDiff.map((item, idx) => ({
      id: `summary-card-${idx}`,
      index: idx,
      startIndex: idx,
      endIndex: idx,
      label: item.description,
    }));
  }, [semanticDiff]);

  // Active diff blocks depending on the active viewMode
  const activeDiffBlocks = useMemo(() => {
    if (viewMode === 'split') return sideBySideDiffBlocks;
    if (viewMode === 'unified') return unifiedDiffBlocks;
    if (viewMode === 'summary') return summaryDiffBlocks;
    return [];
  }, [viewMode, sideBySideDiffBlocks, unifiedDiffBlocks, summaryDiffBlocks]);

  // Keep active index within valid bounds when view mode or diff blocks change
  useEffect(() => {
    if (activeDiffIndex >= activeDiffBlocks.length) {
      setActiveDiffIndex(0);
    }
  }, [activeDiffBlocks.length, activeDiffIndex]);

  const scrollToDiff = (index: number) => {
    if (activeDiffBlocks.length === 0) return;
    const target = activeDiffBlocks[index];
    if (!target) return;
    const el = document.getElementById(target.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleNextDiff = () => {
    if (activeDiffBlocks.length === 0) return;
    const nextIdx = (activeDiffIndex + 1) % activeDiffBlocks.length;
    setActiveDiffIndex(nextIdx);
    scrollToDiff(nextIdx);
  };

  const handlePrevDiff = () => {
    if (activeDiffBlocks.length === 0) return;
    const prevIdx = (activeDiffIndex - 1 + activeDiffBlocks.length) % activeDiffBlocks.length;
    setActiveDiffIndex(prevIdx);
    scrollToDiff(prevIdx);
  };

  // Global keyboard shortcuts (Alt+Up / Alt+Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextDiff();
      } else if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevDiff();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDiffIndex, activeDiffBlocks]);

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
        {/* Left: View Mode Switcher + Stats Badge + Prev/Next Diff Controls */}
        <div className="flex items-center gap-2.5">
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
              <span>Identical</span>
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

          {/* Prev / Next Difference Buttons */}
          {activeDiffBlocks.length > 0 && (
            <div className="flex items-center gap-1 bg-xctrack-dark rounded-lg p-0.5 border border-xctrack-border text-xs">
              <button
                onClick={handlePrevDiff}
                className="flex items-center gap-1 px-2 py-1 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Jump to previous difference (Alt+Up)"
              >
                <ChevronUp className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <span className="text-[11px] font-mono px-2 text-sky-300 font-semibold select-none border-x border-xctrack-border/60">
                {activeDiffIndex + 1} / {activeDiffBlocks.length}
              </span>
              <button
                onClick={handleNextDiff}
                className="flex items-center gap-1 px-2 py-1 rounded text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Jump to next difference (Alt+Down)"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Search Filter */}
        {(viewMode === 'split' || viewMode === 'unified' || viewMode === 'raw') && (
          <div className="relative w-60 max-w-xs">
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
              title="Discard all changes and revert to loaded baseline"
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
          <SideBySideDiffView
            sideBySide={sideBySide}
            diffBlocks={sideBySideDiffBlocks}
            activeDiffIndex={activeDiffIndex}
            searchFilter={searchFilter}
            filename={store.filename}
          />
        )}

        {viewMode === 'unified' && (
          <UnifiedDiffView
            lines={filteredUnified}
            diffBlocks={unifiedDiffBlocks}
            activeDiffIndex={activeDiffIndex}
            searchFilter={searchFilter}
          />
        )}

        {viewMode === 'summary' && (
          <SemanticSummaryView
            semanticDiff={semanticDiff}
            activeDiffIndex={activeDiffIndex}
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
  diffBlocks: DiffHunkBlock[];
  activeDiffIndex: number;
  searchFilter: string;
  filename: string;
}> = ({ sideBySide, diffBlocks, activeDiffIndex, searchFilter, filename }) => {
  const activeBlock = diffBlocks[activeDiffIndex];

  // Map each line index to its hunk ID if it is the start of a hunk
  const hunkStartMap = useMemo(() => {
    const map = new Map<number, string>();
    diffBlocks.forEach((b) => map.set(b.startIndex, b.id));
    return map;
  }, [diffBlocks]);

  return (
    <div className="rounded-lg border border-xctrack-border bg-xctrack-dark font-mono text-[11px] overflow-x-auto shadow-xl">
      {/* Header labels */}
      <div className="grid grid-cols-2 bg-[#12161f] border-b border-xctrack-border text-xs font-sans text-gray-400 select-none">
        <div className="px-4 py-2 border-r border-xctrack-border flex items-center justify-between">
          <span className="font-semibold text-rose-400/90">Original Baseline ({filename})</span>
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
          const hunkId = hunkStartMap.get(idx);
          const isActiveHunk = activeBlock && idx >= activeBlock.startIndex && idx <= activeBlock.endIndex;

          return (
            <div
              key={idx}
              id={hunkId}
              className={`grid grid-cols-2 transition-all leading-relaxed ${
                isActiveHunk
                  ? 'ring-2 ring-sky-500 bg-sky-950/25 relative z-10 shadow-sm'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
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
  diffBlocks: DiffHunkBlock[];
  activeDiffIndex: number;
  searchFilter: string;
}> = ({ lines, diffBlocks, activeDiffIndex }) => {
  const activeBlock = diffBlocks[activeDiffIndex];

  const hunkStartMap = useMemo(() => {
    const map = new Map<number, string>();
    diffBlocks.forEach((b) => map.set(b.startIndex, b.id));
    return map;
  }, [diffBlocks]);

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

          const hunkId = hunkStartMap.get(idx);
          const isActiveHunk = activeBlock && idx >= activeBlock.startIndex && idx <= activeBlock.endIndex;

          return (
            <div
              key={idx}
              id={hunkId}
              className={`flex items-center leading-relaxed transition-all ${lineBg} ${
                isActiveHunk
                  ? 'ring-2 ring-sky-500 bg-sky-950/30 relative z-10 shadow-sm'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
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
  semanticDiff: SemanticChangeItem[];
  activeDiffIndex: number;
  stats: { additions: number; deletions: number; isIdentical: boolean };
  onSwitchToSplit: () => void;
}> = ({ semanticDiff, activeDiffIndex, stats, onSwitchToSplit }) => {
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

      {/* Change Items List */}
      <div className="space-y-2">
        {semanticDiff.map((item, idx) => {
          const isActive = idx === activeDiffIndex;

          return (
            <div
              key={idx}
              id={`summary-card-${idx}`}
              className={`p-3 rounded-xl border transition-all ${
                isActive
                  ? 'bg-sky-950/40 border-sky-500 ring-2 ring-sky-500 shadow-lg shadow-sky-500/20'
                  : 'bg-xctrack-card border-xctrack-border hover:border-gray-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold bg-sky-950 text-sky-300 border border-sky-800/60">
                      {item.category}
                    </span>
                    <span className="text-white font-medium text-xs">{item.description}</span>
                  </div>
                  <div className="text-[11px] text-gray-500 font-mono">{item.path}</div>
                </div>

                {item.oldValue !== undefined && item.newValue !== undefined && (
                  <div className="text-xs font-mono flex items-center gap-2 flex-shrink-0 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                    <span className="text-rose-400 line-through">{item.oldValue}</span>
                    <span className="text-gray-500">→</span>
                    <span className="text-emerald-400 font-semibold">{item.newValue}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// Raw JSON View Component
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
          const matches = !searchFilter || line.toLowerCase().includes(searchFilter.toLowerCase());
          if (!matches) return null;

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
