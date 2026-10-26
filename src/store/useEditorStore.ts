import { useSyncExternalStore } from 'react';
import { XcfgFile, XcfgPage, XcfgWidget, Orientation, DevicePreset } from '../types/xcfg';
import { getDeviceById, findMatchingDevice, getDeviceGrid } from '../data/devices';
import { snapRectToGrid, normToGrid, gridToNorm } from '../utils/gridMath';
import { createPageFromTemplate } from '../data/page-templates';
import { createBlankXcfg } from '../utils/xcfgSerializer';

export interface EditorState {
  config: XcfgFile;
  originalConfig: XcfgFile;
  filename: string;
  activeOrientation: Orientation;
  activePageIndex: number;
  selectedWidgetIndices: number[];
  activeDevice: DevicePreset;
  useInsets: boolean;
  customGrid: { cols: number; rows: number } | null;
  snapToGrid: boolean;
  showGridOverlay: boolean;
  zoom: number; // 0.4 to 2.0
  globalTheme: string; // 'BlackTheme', 'WhiteTheme', etc.
  activeTab: 'layout' | 'preferences' | 'json';
  undoStack: XcfgFile[];
  redoStack: XcfgFile[];
  copiedWidgets: XcfgWidget[];
}

const initialConfig = createBlankXcfg('backup', 'Google Pixel 8 Pro');

let currentState: EditorState = {
  config: initialConfig,
  originalConfig: initialConfig,
  filename: 'untitled.xcfg',
  activeOrientation: 'portrait',
  activePageIndex: 0,
  selectedWidgetIndices: [],
  activeDevice: getDeviceById('pixel-8-pro'),
  useInsets: true,
  customGrid: null,
  snapToGrid: true,
  showGridOverlay: true,
  zoom: 1.0,
  globalTheme: 'BlackTheme',
  activeTab: 'layout',
  undoStack: [],
  redoStack: [],
  copiedWidgets: [],
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function pushUndo() {
  const cloned = JSON.parse(JSON.stringify(currentState.config));
  currentState = {
    ...currentState,
    undoStack: [...currentState.undoStack.slice(-49), cloned],
    redoStack: [],
  };
}

export const editorStore = {
  getState() {
    return currentState;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  loadConfig(config: XcfgFile, filename = 'config.xcfg') {
    const matchedDevice = findMatchingDevice(config.info?.device);
    const cloned = JSON.parse(JSON.stringify(config));
    currentState = {
      ...currentState,
      config: cloned,
      originalConfig: JSON.parse(JSON.stringify(config)),
      filename,
      activeDevice: matchedDevice,
      activePageIndex: 0,
      selectedWidgetIndices: [],
      undoStack: [],
      redoStack: [],
    };
    emitChange();
  },

  setOrientation(orientation: Orientation) {
    if (currentState.activeOrientation === orientation) return;
    const pages = currentState.config.layout[orientation] || [];
    currentState = {
      ...currentState,
      activeOrientation: orientation,
      activePageIndex: Math.min(currentState.activePageIndex, Math.max(0, pages.length - 1)),
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  setActivePage(pageIndex: number) {
    const pages = currentState.config.layout[currentState.activeOrientation] || [];
    if (pageIndex < 0 || pageIndex >= pages.length) return;
    currentState = {
      ...currentState,
      activePageIndex: pageIndex,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  selectWidget(index: number, multi = false) {
    if (multi) {
      const exists = currentState.selectedWidgetIndices.includes(index);
      const newIndices = exists
        ? currentState.selectedWidgetIndices.filter((i) => i !== index)
        : [...currentState.selectedWidgetIndices, index];
      currentState = { ...currentState, selectedWidgetIndices: newIndices };
    } else {
      currentState = { ...currentState, selectedWidgetIndices: [index] };
    }
    emitChange();
  },

  clearSelection() {
    if (currentState.selectedWidgetIndices.length === 0) return;
    currentState = { ...currentState, selectedWidgetIndices: [] };
    emitChange();
  },

  getCurrentGrid(): { cols: number; rows: number } {
    if (currentState.customGrid) return currentState.customGrid;
    return getDeviceGrid(currentState.activeDevice, currentState.activeOrientation, currentState.useInsets);
  },

  getCurrentPage(): XcfgPage | undefined {
    const pages = currentState.config.layout[currentState.activeOrientation] || [];
    return pages[currentState.activePageIndex];
  },

  updateWidget(index: number, partialProps: Partial<XcfgWidget>, saveUndo = true) {
    const page = editorStore.getCurrentPage();
    if (!page || !page.widgets[index]) return;

    if (saveUndo) pushUndo();

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetWidget = newConfig.layout[currentState.activeOrientation][currentState.activePageIndex].widgets[index];

    Object.assign(targetWidget, partialProps);

    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updateWidgetCoords(index: number, X1: number, Y1: number, X2: number, Y2: number, saveUndo = true) {
    const page = editorStore.getCurrentPage();
    if (!page || !page.widgets[index]) return;

    let finalCoords = { X1, Y1, X2, Y2 };
    if (currentState.snapToGrid) {
      const grid = editorStore.getCurrentGrid();
      finalCoords = snapRectToGrid(X1, Y1, X2, Y2, grid.cols, grid.rows);
    }

    editorStore.updateWidget(index, finalCoords, saveUndo);
  },

  addWidget(widget: XcfgWidget) {
    const page = editorStore.getCurrentPage();
    if (!page) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPage = newConfig.layout[currentState.activeOrientation][currentState.activePageIndex];
    targetPage.widgets.push(widget);

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [targetPage.widgets.length - 1],
    };
    emitChange();
  },

  deleteSelectedWidgets() {
    const page = editorStore.getCurrentPage();
    if (!page || currentState.selectedWidgetIndices.length === 0) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPage = newConfig.layout[currentState.activeOrientation][currentState.activePageIndex];
    const toDelete = new Set(currentState.selectedWidgetIndices);

    targetPage.widgets = targetPage.widgets.filter((_, i) => !toDelete.has(i));

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  duplicateSelectedWidgets() {
    const page = editorStore.getCurrentPage();
    if (!page || currentState.selectedWidgetIndices.length === 0) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPage = newConfig.layout[currentState.activeOrientation][currentState.activePageIndex];
    const newIndices: number[] = [];

    const grid = editorStore.getCurrentGrid();
    const shiftX = Math.round(10000 / grid.cols);
    const shiftY = Math.round(10000 / grid.rows);

    for (const idx of currentState.selectedWidgetIndices) {
      const original = targetPage.widgets[idx];
      if (!original) continue;

      const dup = JSON.parse(JSON.stringify(original)) as XcfgWidget;
      dup.X1 = Math.min(10000 - (dup.X2 - dup.X1), dup.X1 + shiftX);
      dup.Y1 = Math.min(10000 - (dup.Y2 - dup.Y1), dup.Y1 + shiftY);
      dup.X2 = Math.min(10000, dup.X2 + shiftX);
      dup.Y2 = Math.min(10000, dup.Y2 + shiftY);

      targetPage.widgets.push(dup);
      newIndices.push(targetPage.widgets.length - 1);
    }

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: newIndices,
    };
    emitChange();
  },

  reorderWidget(fromIndex: number, toIndex: number) {
    const page = editorStore.getCurrentPage();
    if (!page) return;
    if (fromIndex < 0 || fromIndex >= page.widgets.length) return;
    if (toIndex < 0 || toIndex >= page.widgets.length) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPage = newConfig.layout[currentState.activeOrientation][currentState.activePageIndex];
    const [moved] = targetPage.widgets.splice(fromIndex, 1);
    targetPage.widgets.splice(toIndex, 0, moved);

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [toIndex],
    };
    emitChange();
  },

  addPage(templateShortName = 'WPEmpty', seedWidgets = true) {
    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const pages = newConfig.layout[currentState.activeOrientation];

    const newPage = createPageFromTemplate(templateShortName, currentState.activeOrientation);
    if (!seedWidgets) {
      newPage.widgets = [];
    }
    pages.push(newPage as XcfgPage);

    currentState = {
      ...currentState,
      config: newConfig,
      activePageIndex: pages.length - 1,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  deletePage(pageIndex: number) {
    const pages = currentState.config.layout[currentState.activeOrientation] || [];
    if (pages.length <= 1) return; // Keep at least one page

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPages = newConfig.layout[currentState.activeOrientation];
    targetPages.splice(pageIndex, 1);

    currentState = {
      ...currentState,
      config: newConfig,
      activePageIndex: Math.max(0, Math.min(currentState.activePageIndex, targetPages.length - 1)),
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  duplicatePage(pageIndex: number) {
    const pages = currentState.config.layout[currentState.activeOrientation] || [];
    if (!pages[pageIndex]) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPages = newConfig.layout[currentState.activeOrientation];
    const dup = JSON.parse(JSON.stringify(targetPages[pageIndex])) as XcfgPage;
    targetPages.splice(pageIndex + 1, 0, dup);

    currentState = {
      ...currentState,
      config: newConfig,
      activePageIndex: pageIndex + 1,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  reorderPages(fromIndex: number, toIndex: number) {
    const pages = currentState.config.layout[currentState.activeOrientation] || [];
    if (fromIndex < 0 || fromIndex >= pages.length || toIndex < 0 || toIndex >= pages.length) return;

    pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const targetPages = newConfig.layout[currentState.activeOrientation];
    const [moved] = targetPages.splice(fromIndex, 1);
    targetPages.splice(toIndex, 0, moved);

    currentState = {
      ...currentState,
      config: newConfig,
      activePageIndex: toIndex,
    };
    emitChange();
  },

  copyPageToOppositeOrientation(pageIndex: number) {
    const sourcePages = currentState.config.layout[currentState.activeOrientation] || [];
    if (!sourcePages[pageIndex]) return;

    const oppOrientation = currentState.activeOrientation === 'portrait' ? 'landscape' : 'portrait';
    pushUndo();

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const clonedPage = JSON.parse(JSON.stringify(sourcePages[pageIndex])) as XcfgPage;
    newConfig.layout[oppOrientation].push(clonedPage);

    currentState = {
      ...currentState,
      config: newConfig,
      activeOrientation: oppOrientation,
      activePageIndex: newConfig.layout[oppOrientation].length - 1,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  setDevice(device: DevicePreset) {
    currentState = { ...currentState, activeDevice: device, customGrid: null };
    emitChange();
  },

  setUseInsets(useInsets: boolean) {
    currentState = { ...currentState, useInsets };
    emitChange();
  },

  setCustomGrid(customGrid: { cols: number; rows: number } | null) {
    currentState = { ...currentState, customGrid };
    emitChange();
  },

  setSnapToGrid(snapToGrid: boolean) {
    currentState = { ...currentState, snapToGrid };
    emitChange();
  },

  setShowGridOverlay(showGridOverlay: boolean) {
    currentState = { ...currentState, showGridOverlay };
    emitChange();
  },

  setZoom(zoom: number) {
    currentState = { ...currentState, zoom: Math.max(0.4, Math.min(2.0, zoom)) };
    emitChange();
  },

  setGlobalTheme(globalTheme: string) {
    currentState = { ...currentState, globalTheme };
    emitChange();
  },

  setActiveTab(activeTab: 'layout' | 'preferences' | 'json') {
    currentState = { ...currentState, activeTab };
    emitChange();
  },

  updatePageNavigations(navigations: string[] | 'all' | 'none') {
    const page = editorStore.getCurrentPage();
    if (!page) return;
    pushUndo();

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    newConfig.layout[currentState.activeOrientation][currentState.activePageIndex].navigations = navigations;

    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updatePageClass(className: string) {
    const page = editorStore.getCurrentPage();
    if (!page) return;
    pushUndo();

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    newConfig.layout[currentState.activeOrientation][currentState.activePageIndex].CLASS = className;

    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updatePreference(key: string, value: any, saveUndo = true) {
    if (saveUndo) pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    if (!newConfig.preferences) {
      newConfig.preferences = {};
    }
    if (value === undefined) {
      delete newConfig.preferences[key];
    } else {
      newConfig.preferences[key] = value;
    }
    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updatePreferences(partial: Record<string, any>, saveUndo = true) {
    if (saveUndo) pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    if (!newConfig.preferences) {
      newConfig.preferences = {};
    }
    for (const [k, v] of Object.entries(partial)) {
      if (v === undefined) {
        delete newConfig.preferences[k];
      } else {
        newConfig.preferences[k] = v;
      }
    }
    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updateInfo(partial: Partial<XcfgFile['info']>, saveUndo = true) {
    if (saveUndo) pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    Object.assign(newConfig.info, partial);
    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  setExportType(exportType: 'backup' | 'pages', saveUndo = true) {
    if (saveUndo) pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    newConfig.info.exportType = exportType;
    if (exportType === 'backup' && !newConfig.preferences) {
      newConfig.preferences = {};
    }
    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updateAirspaceChannels(channels: number[], saveUndo = true) {
    if (saveUndo) pushUndo();
    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    newConfig.airspaceSelectedChannels = channels;
    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  undo() {
    if (currentState.undoStack.length === 0) return;
    const previous = currentState.undoStack[currentState.undoStack.length - 1];
    const newUndo = currentState.undoStack.slice(0, -1);
    const currentCloned = JSON.parse(JSON.stringify(currentState.config));

    currentState = {
      ...currentState,
      config: previous,
      undoStack: newUndo,
      redoStack: [currentCloned, ...currentState.redoStack],
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  redo() {
    if (currentState.redoStack.length === 0) return;
    const next = currentState.redoStack[0];
    const newRedo = currentState.redoStack.slice(1);
    const currentCloned = JSON.parse(JSON.stringify(currentState.config));

    currentState = {
      ...currentState,
      config: next,
      undoStack: [...currentState.undoStack, currentCloned],
      redoStack: newRedo,
      selectedWidgetIndices: [],
    };
    emitChange();
  },
};

export function useEditorStore(): EditorState {
  return useSyncExternalStore(editorStore.subscribe, editorStore.getState);
}
