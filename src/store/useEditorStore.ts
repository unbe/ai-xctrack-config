import { useSyncExternalStore, useRef, useCallback } from 'react';
import { XcfgFile, XcfgPage, XcfgWidget, Orientation, DevicePreset } from '../types/xcfg';
import { getDeviceById, findMatchingDevice, getDeviceGrid, DEFAULT_DEVICE_ID } from '../data/devices';
import { snapRectToGrid, normToGrid, gridToNorm } from '../utils/gridMath';
import { createPageFromTemplate } from '../data/page-templates';
import { createBlankXcfg } from '../utils/xcfgSerializer';
import { convertPageOrientation, ConversionStrategy } from '../utils/orientationConverter';
import { resnapPageToGrid, resnapConfigToDevice } from '../utils/smartGridResnap';
import { populateEditorIds, assignEditorId, generateEditorId } from '../utils/widgetId';

export interface EditorState {
  config: XcfgFile;
  originalConfig: XcfgFile;
  filename: string;
  activeOrientation: Orientation;
  activePageIndex: number;
  selectedWidgetIndices: number[];
  activeDevice: DevicePreset;
  autoResnapOnDeviceChange: boolean;
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

const LAST_DEVICE_KEY = 'xctrack_last_device_id';
const AUTO_RESNAP_KEY = 'xctrack_auto_resnap';
export const AUTOSAVE_STORAGE_KEY = 'xctrack_autosave_state';

export interface AutosaveData {
  config: XcfgFile;
  originalConfig: XcfgFile;
  filename: string;
  activeOrientation: Orientation;
  activePageIndex: number;
  activeDeviceId: string;
  activeTab: 'layout' | 'preferences' | 'json';
  zoom: number;
  globalTheme?: string;
  updatedAt: number;
}

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
let lastAutosavedAt: number | null = null;

export function getLastAutosaveTime(): number | null {
  return lastAutosavedAt;
}

export function saveAutosaveNow(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const data: AutosaveData = {
      config: currentState.config,
      originalConfig: currentState.originalConfig,
      filename: currentState.filename,
      activeOrientation: currentState.activeOrientation,
      activePageIndex: currentState.activePageIndex,
      activeDeviceId: currentState.activeDevice.id,
      activeTab: currentState.activeTab,
      zoom: currentState.zoom,
      globalTheme: currentState.globalTheme,
      updatedAt: Date.now(),
    };
    localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(data));
    lastAutosavedAt = data.updatedAt;
  } catch (e) {
    console.warn('Autosave failed:', e);
  }
}

export function scheduleAutosave(): void {
  if (typeof window === 'undefined') return;
  if (autosaveTimer) clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    saveAutosaveNow();
  }, 350);
}

export function getStoredAutosave(): AutosaveData | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.config &&
      typeof parsed.config === 'object' &&
      parsed.config.layout &&
      typeof parsed.config.layout === 'object' &&
      Array.isArray(parsed.config.layout.portrait) &&
      Array.isArray(parsed.config.layout.landscape)
    ) {
      return parsed as AutosaveData;
    }
    if (parsed) {
      console.warn('Rejected invalid autosave state: layout.portrait or layout.landscape missing/not array');
    }
  } catch (e) {
    console.warn('Failed to parse autosave data:', e);
  }
  return null;
}

export function hasAutosavedSession(): boolean {
  return getStoredAutosave() !== null;
}

export function clearAutosave(): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      lastAutosavedAt = null;
    } catch (e) {
      // ignore
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    saveAutosaveNow();
  });
}

export function getStoredAutoResnap(): boolean {
  if (typeof localStorage !== 'undefined') {
    try {
      const val = localStorage.getItem(AUTO_RESNAP_KEY);
      if (val !== null) return val === 'true';
    } catch (e) {
      // ignore
    }
  }
  return true; // Default to true: smart resnap enabled
}

export function persistAutoResnap(enabled: boolean): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(AUTO_RESNAP_KEY, String(enabled));
    } catch (e) {
      // ignore
    }
  }
}

export function getStoredDeviceId(): string | null {
  if (typeof localStorage !== 'undefined') {
    try {
      return localStorage.getItem(LAST_DEVICE_KEY);
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export function getStoredDevice(): DevicePreset {
  const savedId = getStoredDeviceId();
  if (savedId) {
    return getDeviceById(savedId);
  }
  return getDeviceById(DEFAULT_DEVICE_ID);
}

export function persistDeviceId(id: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LAST_DEVICE_KEY, id);
    } catch (e) {
      // ignore
    }
  }
}

const initialConfig = createBlankXcfg('backup', getStoredDevice().name);
populateEditorIds(initialConfig);

let currentState: EditorState = {
  config: initialConfig,
  originalConfig: initialConfig,
  filename: 'untitled.xcfg',
  activeOrientation: 'portrait',
  activePageIndex: 0,
  selectedWidgetIndices: [],
  activeDevice: getStoredDevice(),
  autoResnapOnDeviceChange: getStoredAutoResnap(),
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
  scheduleAutosave();
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

  restoreAutosavedSession(): boolean {
    const saved = getStoredAutosave();
    if (!saved) return false;
    if (
      !saved.config ||
      typeof saved.config !== 'object' ||
      !saved.config.layout ||
      typeof saved.config.layout !== 'object' ||
      !Array.isArray(saved.config.layout.portrait) ||
      !Array.isArray(saved.config.layout.landscape)
    ) {
      return false;
    }
    populateEditorIds(saved.config);
    if (saved.originalConfig) {
      populateEditorIds(saved.originalConfig);
    }
    const device = getDeviceById(saved.activeDeviceId || DEFAULT_DEVICE_ID);
    const themeFromConfig = typeof saved.config?.preferences?.['Display.Theme'] === 'string'
      ? saved.config.preferences['Display.Theme']
      : undefined;
    const activeTheme: string = saved.globalTheme || themeFromConfig || 'BlackTheme';
    currentState = {
      ...currentState,
      config: saved.config,
      originalConfig: saved.originalConfig || saved.config,
      filename: saved.filename || 'autosaved.xcfg',
      globalTheme: activeTheme,
      activeOrientation: saved.activeOrientation || 'portrait',
      activePageIndex: typeof saved.activePageIndex === 'number' ? saved.activePageIndex : 0,
      activeDevice: device,
      activeTab: saved.activeTab || 'layout',
      zoom: saved.zoom || 1.0,
      undoStack: [],
      redoStack: [],
    };
    lastAutosavedAt = saved.updatedAt || Date.now();
    for (const listener of listeners) {
      listener();
    }
    return true;
  },

  clearAutosave() {
    clearAutosave();
    emitChange();
  },

  saveAutosaveNow() {
    saveAutosaveNow();
  },

  loadConfig(config: XcfgFile, filename = 'config.xcfg', respectSavedDevice = false) {
    let matchedDevice: DevicePreset;
    const savedId = getStoredDeviceId();
    if (respectSavedDevice && savedId) {
      matchedDevice = getDeviceById(savedId);
    } else {
      matchedDevice = findMatchingDevice(config.info?.device);
      persistDeviceId(matchedDevice.id);
    }
    const cloned = JSON.parse(JSON.stringify(config));
    populateEditorIds(cloned);
    const themeFromConfig = cloned.preferences?.['Display.Theme'] || 'BlackTheme';
    currentState = {
      ...currentState,
      config: cloned,
      originalConfig: JSON.parse(JSON.stringify(config)),
      filename,
      globalTheme: themeFromConfig,
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
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex]) return;
    const currentPage = currentPages[pageIndex];
    if (!currentPage.widgets || !currentPage.widgets[index]) return;

    if (saveUndo) pushUndo();

    const currentWidget = currentPage.widgets[index];
    const cleanProps = { ...partialProps } as any;
    delete cleanProps.gridX1;
    delete cleanProps.gridY1;
    delete cleanProps.gridX2;
    delete cleanProps.gridY2;

    const updatedWidget = { ...currentWidget };
    delete updatedWidget.gridX1;
    delete updatedWidget.gridY1;
    delete updatedWidget.gridX2;
    delete updatedWidget.gridY2;

    for (const [k, v] of Object.entries(cleanProps)) {
      if (v === undefined) {
        delete updatedWidget[k];
      } else {
        updatedWidget[k] = v;
      }
    }

    const updatedWidgets = [...currentPage.widgets];
    updatedWidgets[index] = updatedWidget;

    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: updatedWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  updateWidgetCoords(index: number, X1: number, Y1: number, X2: number, Y2: number, saveUndo = true) {
    const page = editorStore.getCurrentPage();
    if (!page || !page.widgets[index]) return;

    let finalCoords: { X1: number; Y1: number; X2: number; Y2: number } = { X1, Y1, X2, Y2 };
    if (currentState.snapToGrid) {
      const grid = editorStore.getCurrentGrid();
      const snapped = snapRectToGrid(X1, Y1, X2, Y2, grid.cols, grid.rows);
      finalCoords = { X1: snapped.X1, Y1: snapped.Y1, X2: snapped.X2, Y2: snapped.Y2 };
    }

    editorStore.updateWidget(index, finalCoords, saveUndo);
  },

  addWidget(widget: XcfgWidget) {
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex]) return;
    const currentPage = currentPages[pageIndex];

    pushUndo();

    const clonedWidget = { ...widget };
    assignEditorId(clonedWidget);

    const updatedWidgets = [...currentPage.widgets, clonedWidget];
    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: updatedWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [updatedWidgets.length - 1],
    };
    emitChange();
  },

  deleteSelectedWidgets() {
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex] || currentState.selectedWidgetIndices.length === 0) return;
    const currentPage = currentPages[pageIndex];

    pushUndo();

    const toDelete = new Set(currentState.selectedWidgetIndices);
    const updatedWidgets = currentPage.widgets.filter((_, i) => !toDelete.has(i));

    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: updatedWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  duplicateSelectedWidgets() {
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex] || currentState.selectedWidgetIndices.length === 0) return;
    const currentPage = currentPages[pageIndex];

    pushUndo();

    const newWidgets = [...currentPage.widgets];
    const newIndices: number[] = [];

    const grid = editorStore.getCurrentGrid();
    const shiftX = Math.round(10000 / grid.cols);
    const shiftY = Math.round(10000 / grid.rows);

    for (const idx of currentState.selectedWidgetIndices) {
      const original = currentPage.widgets[idx];
      if (!original) continue;

      const dup: XcfgWidget = {
        ...original,
        _editorId: generateEditorId(),
        X1: Math.min(10000 - (original.X2 - original.X1), original.X1 + shiftX),
        Y1: Math.min(10000 - (original.Y2 - original.Y1), original.Y1 + shiftY),
        X2: Math.min(10000, original.X2 + shiftX),
        Y2: Math.min(10000, original.Y2 + shiftY),
      };

      newWidgets.push(dup);
      newIndices.push(newWidgets.length - 1);
    }

    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: newWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: newIndices,
    };
    emitChange();
  },

  deleteWidget(index: number) {
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex] || !currentPages[pageIndex].widgets[index]) return;
    const currentPage = currentPages[pageIndex];

    pushUndo();

    const updatedWidgets = currentPage.widgets.filter((_, i) => i !== index);
    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: updatedWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  duplicateWidget(index: number) {
    const orientation = currentState.activeOrientation;
    const pageIndex = currentState.activePageIndex;
    const currentPages = currentState.config.layout?.[orientation];
    if (!currentPages || !currentPages[pageIndex] || !currentPages[pageIndex].widgets[index]) return;
    const currentPage = currentPages[pageIndex];
    const original = currentPage.widgets[index];

    pushUndo();

    const grid = editorStore.getCurrentGrid();
    const shiftX = Math.round(10000 / grid.cols);
    const shiftY = Math.round(10000 / grid.rows);

    const dup: XcfgWidget = {
      ...original,
      _editorId: generateEditorId(),
      X1: Math.min(10000 - (original.X2 - original.X1), original.X1 + shiftX),
      Y1: Math.min(10000 - (original.Y2 - original.Y1), original.Y1 + shiftY),
      X2: Math.min(10000, original.X2 + shiftX),
      Y2: Math.min(10000, original.Y2 + shiftY),
    };

    const updatedWidgets = [...currentPage.widgets, dup];
    const updatedPages = [...currentPages];
    updatedPages[pageIndex] = { ...currentPage, widgets: updatedWidgets };

    const newConfig: XcfgFile = {
      ...currentState.config,
      layout: {
        ...currentState.config.layout,
        [orientation]: updatedPages,
      },
    };

    currentState = {
      ...currentState,
      config: newConfig,
      selectedWidgetIndices: [updatedWidgets.length - 1],
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

  convertPageOrientation(
    pageIndex: number,
    options?: {
      strategy?: ConversionStrategy;
    }
  ) {
    const { strategy = 'adaptive' } = options || {};
    const fromOrientation = currentState.activeOrientation;
    const toOrientation: Orientation = fromOrientation === 'portrait' ? 'landscape' : 'portrait';
    const sourcePages = currentState.config.layout[fromOrientation] || [];
    const sourcePage = sourcePages[pageIndex];
    if (!sourcePage) return;

    pushUndo();

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    const convertedPage = convertPageOrientation(
      sourcePage,
      fromOrientation,
      toOrientation,
      {
        strategy,
        device: currentState.activeDevice,
        useInsets: currentState.useInsets,
      }
    );

    newConfig.layout[toOrientation].push(convertedPage);

    currentState = {
      ...currentState,
      config: newConfig,
      activeOrientation: toOrientation,
      activePageIndex: newConfig.layout[toOrientation].length - 1,
      selectedWidgetIndices: [],
    };
    emitChange();
  },

  copyPageToOppositeOrientation(pageIndex: number) {
    this.convertPageOrientation(pageIndex, { strategy: 'adaptive' });
  },

  setDevice(device: DevicePreset, options?: { autoResnap?: boolean }) {
    persistDeviceId(device.id);
    const shouldResnap = options?.autoResnap ?? currentState.autoResnapOnDeviceChange;

    if (shouldResnap) {
      pushUndo();
      const resnappedConfig = resnapConfigToDevice(currentState.config, device, {
        useInsets: currentState.useInsets,
        pagesToResnap: 'all',
      });
      currentState = {
        ...currentState,
        config: resnappedConfig,
        activeDevice: device,
        customGrid: null,
      };
    } else {
      currentState = {
        ...currentState,
        activeDevice: device,
        customGrid: null,
      };
    }
    emitChange();
  },

  setAutoResnapOnDeviceChange(enabled: boolean) {
    persistAutoResnap(enabled);
    currentState = { ...currentState, autoResnapOnDeviceChange: enabled };
    emitChange();
  },

  resnapCurrentPageToGrid() {
    const page = editorStore.getCurrentPage();
    if (!page) return;
    pushUndo();

    const targetGrid = editorStore.getCurrentGrid();
    const resnappedPage = resnapPageToGrid(page, targetGrid);

    const newConfig = JSON.parse(JSON.stringify(currentState.config)) as XcfgFile;
    newConfig.layout[currentState.activeOrientation][currentState.activePageIndex] = resnappedPage;

    currentState = { ...currentState, config: newConfig };
    emitChange();
  },

  resnapAllPagesToGrid() {
    pushUndo();
    const resnappedConfig = resnapConfigToDevice(currentState.config, currentState.activeDevice, {
      useInsets: currentState.useInsets,
      pagesToResnap: 'all',
    });
    currentState = { ...currentState, config: resnappedConfig };
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
    let newConfig = currentState.config;
    if (newConfig.preferences) {
      newConfig = {
        ...newConfig,
        preferences: {
          ...newConfig.preferences,
          'Display.Theme': globalTheme,
        },
      };
    }
    currentState = { ...currentState, globalTheme, config: newConfig };
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

  recordCustomUndo(configSnapshot: XcfgFile) {
    currentState = {
      ...currentState,
      undoStack: [...currentState.undoStack.slice(-49), configSnapshot],
      redoStack: [],
    };
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

export function shallowEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  const keysA = Object.keys(a) as (keyof T)[];
  const keysB = Object.keys(b) as (keyof T)[];
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k])) {
      return false;
    }
  }
  return true;
}

export function useEditorStore<T = EditorState>(
  selector?: (state: EditorState) => T,
  equalityFn?: (a: T, b: T) => boolean
): T {
  const selRef = useRef(selector);
  selRef.current = selector;
  const eqRef = useRef(equalityFn);
  eqRef.current = equalityFn;

  const lastSnapshotRef = useRef<EditorState | null>(null);
  const lastSelectionRef = useRef<T | undefined>(undefined);
  const lastSelectorRef = useRef(selector);

  const getSnapshot = useCallback(() => {
    const state = editorStore.getState();
    const sel = selRef.current;
    const eq = eqRef.current ?? Object.is;

    if (sel === undefined) {
      return state as unknown as T;
    }

    if (
      lastSnapshotRef.current === state &&
      lastSelectorRef.current === sel &&
      lastSelectionRef.current !== undefined
    ) {
      return lastSelectionRef.current;
    }

    const nextSelection = sel(state);
    if (
      lastSelectionRef.current !== undefined &&
      lastSelectorRef.current === sel &&
      eq(lastSelectionRef.current, nextSelection)
    ) {
      return lastSelectionRef.current;
    }

    lastSnapshotRef.current = state;
    lastSelectorRef.current = sel;
    lastSelectionRef.current = nextSelection;
    return nextSelection;
  }, []);

  return useSyncExternalStore(editorStore.subscribe, getSnapshot);
}
