import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Navigation,
  Compass,
  Flame,
  Trophy,
  FileText,
  Share2,
  Settings,
  Check,
} from 'lucide-react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { PAGE_TEMPLATES, NAVIGATION_TYPES } from '../../data/page-templates';

export const PageManagerPanel: React.FC = () => {
  const store = useEditorStore();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('WPXCAssistant');
  const [seedWidgets, setSeedWidgets] = useState(true);
  const [navModalOpen, setNavModalOpen] = useState(false);

  const pages = store.config.layout[store.activeOrientation] || [];
  const currentPage = pages[store.activePageIndex];

  const handleAddPage = () => {
    editorStore.addPage(selectedTemplate, seedWidgets);
    setAddModalOpen(false);
  };

  const getPageIcon = (className: string) => {
    if (className.includes('Thermal')) return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    if (className.includes('Competition')) return <Trophy className="w-3.5 h-3.5 text-yellow-400" />;
    if (className.includes('XC')) return <Compass className="w-3.5 h-3.5 text-sky-400" />;
    return <FileText className="w-3.5 h-3.5 text-gray-400" />;
  };

  const getPageTitle = (className: string) => {
    const template = PAGE_TEMPLATES.find((t) => t.className === className);
    return template ? template.title : className.split('.').pop() || 'Page';
  };

  const getNavLabel = (navs: string[] | 'all' | 'none') => {
    if (navs === 'all') return 'All Tasks';
    if (navs === 'none' || !navs || navs.length === 0) return 'Manual Only';
    return `${navs.length} task${navs.length > 1 ? 's' : ''}`;
  };

  return (
    <div className="w-60 bg-xctrack-card border-r border-xctrack-border flex flex-col h-full select-none text-xs">
      {/* Panel Header */}
      <div className="p-3 border-b border-xctrack-border flex items-center justify-between">
        <div>
          <span className="font-semibold text-white tracking-wide text-xs">Screen Pages</span>
          <span className="text-[10px] text-gray-400 block font-mono capitalize">
            {store.activeOrientation} ({pages.length})
          </span>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium shadow-sm transition-colors"
          title="Add New Screen Page"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {pages.map((page, index) => {
          const isActive = index === store.activePageIndex;
          const navLabel = getNavLabel(page.navigations);

          return (
            <div
              key={index}
              onClick={() => editorStore.setActivePage(index)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                isActive
                  ? 'bg-sky-950/40 border-sky-500/60 shadow-md ring-1 ring-sky-500/30'
                  : 'bg-xctrack-dark/70 border-xctrack-border hover:border-gray-600 hover:bg-xctrack-dark'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 font-medium text-gray-200">
                  {getPageIcon(page.CLASS)}
                  <span className="text-xs truncate max-w-[120px]">{getPageTitle(page.CLASS)}</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-gray-400">
                  P{index + 1}
                </span>
              </div>

              {/* Subtitle / Task & Widget Count */}
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.setActivePage(index);
                    setNavModalOpen(true);
                  }}
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium truncate max-w-[110px]"
                  title="Configure Page Task Trigger Rules"
                >
                  <Navigation className="w-2.5 h-2.5" />
                  <span className="truncate">{navLabel}</span>
                </button>
                <span className="font-mono text-gray-400">{page.widgets?.length || 0} w</span>
              </div>

              {/* Hover Actions Bar */}
              <div className="absolute right-1.5 top-1.5 hidden group-hover:flex items-center gap-0.5 bg-xctrack-card/95 border border-xctrack-border rounded p-0.5 shadow-lg z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderPages(index, index - 1);
                  }}
                  disabled={index === 0}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Move Up"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.reorderPages(index, index + 1);
                  }}
                  disabled={index === pages.length - 1}
                  className="p-1 hover:text-white text-gray-400 disabled:opacity-20"
                  title="Move Down"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.duplicatePage(index);
                  }}
                  className="p-1 hover:text-white text-gray-400"
                  title="Duplicate Page"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    editorStore.copyPageToOppositeOrientation(index);
                  }}
                  className="p-1 hover:text-sky-400 text-gray-400"
                  title="Copy to other orientation"
                >
                  <Share2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (pages.length <= 1) {
                      alert('Cannot delete the last remaining page.');
                      return;
                    }
                    if (confirm(`Delete Page ${index + 1} (${getPageTitle(page.CLASS)})?`)) {
                      editorStore.deletePage(index);
                    }
                  }}
                  disabled={pages.length <= 1}
                  className="p-1 hover:text-red-400 text-gray-400 disabled:opacity-20"
                  title="Delete Page"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Page Modal */}
      {addModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-96 shadow-2xl relative z-10">
              <h3 className="font-semibold text-white text-sm mb-3">Add Screen Page</h3>

              <div className="space-y-2 mb-4">
                {PAGE_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.shortName}
                    onClick={() => setSelectedTemplate(tmpl.shortName)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                      selectedTemplate === tmpl.shortName
                        ? 'bg-sky-600/20 border-sky-500 text-white font-medium'
                        : 'bg-xctrack-dark border-xctrack-border text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getPageIcon(tmpl.className)}
                      <div>
                        <div className="text-xs">{tmpl.title}</div>
                        <div className="text-[10px] text-gray-400">{tmpl.description}</div>
                      </div>
                    </div>
                    {selectedTemplate === tmpl.shortName && <Check className="w-4 h-4 text-sky-400" />}
                  </div>
                ))}
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-300 mb-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seedWidgets}
                  onChange={(e) => setSeedWidgets(e.target.checked)}
                  className="rounded border-gray-700 bg-xctrack-dark text-sky-600 focus:ring-0"
                />
                <span>Seed with official XCTrack default layout</span>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="px-3 py-1.5 rounded text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPage}
                  className="px-4 py-1.5 rounded text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium shadow"
                >
                  Create Page
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Page Navigation Task Rules Modal */}
      {navModalOpen &&
        currentPage &&
        createPortal(
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-96 shadow-2xl relative z-10">
              <h3 className="font-semibold text-white text-sm mb-1">Page Task Activation Rules</h3>
              <p className="text-[11px] text-gray-400 mb-4">
                Configure which flight navigation modes automatically switch to this page during flight.
              </p>

              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => editorStore.updatePageNavigations('all')}
                  className={`flex-1 py-1 rounded text-xs border transition-colors ${
                    currentPage.navigations === 'all'
                      ? 'bg-sky-600 text-white border-sky-500 font-medium'
                      : 'bg-xctrack-dark text-gray-400 border-xctrack-border hover:text-white'
                  }`}
                >
                  All Navigation Modes
                </button>
                <button
                  onClick={() => editorStore.updatePageNavigations('none')}
                  className={`flex-1 py-1 rounded text-xs border transition-colors ${
                    currentPage.navigations === 'none'
                      ? 'bg-sky-600 text-white border-sky-500 font-medium'
                      : 'bg-xctrack-dark text-gray-400 border-xctrack-border hover:text-white'
                  }`}
                >
                  Manual Only (None)
                </button>
              </div>

              <div className="space-y-1.5 border-t border-xctrack-border pt-3 mb-5">
                {NAVIGATION_TYPES.map((nav) => {
                  const isSelected =
                    currentPage.navigations === 'all' ||
                    (Array.isArray(currentPage.navigations) && currentPage.navigations.includes(nav.className));

                  const toggleNav = () => {
                    let currentList: string[] = [];
                    if (currentPage.navigations === 'all') {
                      currentList = NAVIGATION_TYPES.map((n) => n.className);
                    } else if (Array.isArray(currentPage.navigations)) {
                      currentList = [...currentPage.navigations];
                    }

                    if (isSelected) {
                      currentList = currentList.filter((c) => c !== nav.className);
                    } else {
                      currentList.push(nav.className);
                    }

                    if (currentList.length === NAVIGATION_TYPES.length) {
                      editorStore.updatePageNavigations('all');
                    } else if (currentList.length === 0) {
                      editorStore.updatePageNavigations('none');
                    } else {
                      editorStore.updatePageNavigations(currentList);
                    }
                  };

                  return (
                    <label
                      key={nav.className}
                      className="flex items-start gap-2.5 p-2 rounded bg-xctrack-dark border border-xctrack-border/60 hover:border-gray-600 cursor-pointer text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={toggleNav}
                        className="mt-0.5 rounded border-gray-700 bg-gray-900 text-sky-600 focus:ring-0"
                      />
                      <div>
                        <div className="text-gray-200 font-medium">{nav.name}</div>
                        <div className="text-[10px] text-gray-500">{nav.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setNavModalOpen(false)}
                  className="px-4 py-1.5 rounded text-xs bg-sky-600 hover:bg-sky-500 text-white font-medium"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
