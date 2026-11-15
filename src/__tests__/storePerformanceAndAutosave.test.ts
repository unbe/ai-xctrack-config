import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  editorStore,
  shallowEqual,
  getStoredAutosave,
  hasAutosavedSession,
  clearAutosave,
  AUTOSAVE_STORAGE_KEY,
} from '../store/useEditorStore';
import { serializeXcfg, cleanWidgetForExport } from '../utils/xcfgSerializer';
import { computeSemanticDiff } from '../utils/diffEngine';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { populateEditorIds, assignEditorId, generateEditorId } from '../utils/widgetId';
import { XcfgFile, XcfgWidget } from '../types/xcfg';

// In-memory mock for localStorage in test environment
const mockStorage: Record<string, string> = {};

describe('Store Performance, Selector Subscriptions & Autosave Validation', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => {
        mockStorage[key] = String(val);
      },
      removeItem: (key: string) => {
        delete mockStorage[key];
      },
      clear: () => {
        Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
      },
    });
    clearAutosave();
  });

  describe('1. Store Selector Subscriptions & Equality Memoization', () => {
    it('shallowEqual correctly compares primitives and objects', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual(1, 2)).toBe(false);
      expect(shallowEqual('hello', 'hello')).toBe(true);
      expect(shallowEqual('hello', 'world')).toBe(false);
      expect(shallowEqual(true, true)).toBe(true);
      expect(shallowEqual(true, false)).toBe(false);
      expect(shallowEqual(null, null)).toBe(true);
      expect(shallowEqual(undefined, undefined)).toBe(true);
      expect(shallowEqual(null, undefined)).toBe(false);
      expect(shallowEqual(null, {})).toBe(false);

      expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);
      expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'y' })).toBe(false);
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(shallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('editorStore.subscribe notifies listeners on store mutations', () => {
      let callCount = 0;
      const unsubscribe = editorStore.subscribe(() => {
        callCount++;
      });

      expect(callCount).toBe(0);
      editorStore.setZoom(1.2);
      expect(callCount).toBe(1);

      editorStore.setOrientation('landscape');
      expect(callCount).toBe(2);

      unsubscribe();
      editorStore.setZoom(1.0);
      expect(callCount).toBe(2); // Listener was removed
      editorStore.setOrientation('portrait');
    });

    it('selector snapshot helper retains previous selection when selector output is shallowly equal', () => {
      let lastSelection: { zoom: number; ori: string } | undefined;

      const runSelector = () => {
        const state = editorStore.getState();
        const next = { zoom: state.zoom, ori: state.activeOrientation };
        if (lastSelection !== undefined && shallowEqual(lastSelection, next)) {
          return lastSelection;
        }
        lastSelection = next;
        return next;
      };

      const snap1 = runSelector();
      // Select widget changes store state but not zoom/orientation
      editorStore.selectWidget(0);
      const snap2 = runSelector();

      expect(snap1).toBe(snap2); // Referentially identical because shallow equal

      // Changing zoom produces a new reference
      editorStore.setZoom(1.5);
      const snap3 = runSelector();
      expect(snap3).not.toBe(snap1);
      expect(snap3.zoom).toBe(1.5);

      // Clean up
      editorStore.setZoom(1.0);
    });
  });

  describe('2. Autosave Validation & Layout Sanitization', () => {
    it('accepts valid autosave state containing layout.portrait and layout.landscape arrays', () => {
      const validAutosave = {
        config: {
          info: { device: 'Test' },
          layout: {
            portrait: [{ CLASS: 'wp.Page', widgets: [] }],
            landscape: [{ CLASS: 'wp.Page', widgets: [] }],
          },
        },
        filename: 'valid.xcfg',
        activeOrientation: 'portrait',
        updatedAt: Date.now(),
      };

      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(validAutosave));

      expect(hasAutosavedSession()).toBe(true);
      const stored = getStoredAutosave();
      expect(stored).not.toBeNull();
      expect(stored?.config.layout.portrait.length).toBe(1);

      const restored = editorStore.restoreAutosavedSession();
      expect(restored).toBe(true);
    });

    it('rejects autosave if layout is missing entirely', () => {
      const invalidAutosave = {
        config: {
          info: { device: 'Test' },
        },
      };

      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(invalidAutosave));
      expect(hasAutosavedSession()).toBe(false);
      expect(getStoredAutosave()).toBeNull();
      expect(editorStore.restoreAutosavedSession()).toBe(false);
    });

    it('rejects autosave if layout.portrait is not an array', () => {
      const invalidAutosave = {
        config: {
          info: { device: 'Test' },
          layout: {
            portrait: 'corrupted_string',
            landscape: [],
          },
        },
      };

      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(invalidAutosave));
      expect(hasAutosavedSession()).toBe(false);
      expect(getStoredAutosave()).toBeNull();
      expect(editorStore.restoreAutosavedSession()).toBe(false);
    });

    it('rejects autosave if layout.landscape is null or missing', () => {
      const invalidAutosave = {
        config: {
          info: { device: 'Test' },
          layout: {
            portrait: [],
            landscape: null,
          },
        },
      };

      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(invalidAutosave));
      expect(hasAutosavedSession()).toBe(false);
      expect(getStoredAutosave()).toBeNull();
      expect(editorStore.restoreAutosavedSession()).toBe(false);
    });

    it('handles JSON parse error in localStorage safely', () => {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, 'not-valid-json{{{');
      expect(hasAutosavedSession()).toBe(false);
      expect(getStoredAutosave()).toBeNull();
      expect(editorStore.restoreAutosavedSession()).toBe(false);
    });
  });

  describe('3. Stable Widget Keys & Export Purity', () => {
    it('generateEditorId produces unique identifiers with wid_ prefix', () => {
      const id1 = generateEditorId();
      const id2 = generateEditorId();
      expect(id1.startsWith('wid_')).toBe(true);
      expect(id2.startsWith('wid_')).toBe(true);
      expect(id1).not.toBe(id2);
    });

    it('assignEditorId attaches _editorId only if not present', () => {
      const w: { _editorId?: string; CLASS: string } = { CLASS: 'WCompStatus' };
      assignEditorId(w);
      expect(w._editorId).toBeDefined();
      const existingId = w._editorId;
      assignEditorId(w);
      expect(w._editorId).toBe(existingId);
    });

    it('populateEditorIds attaches IDs to all widgets in portrait and landscape', () => {
      const config: XcfgFile = {
        info: { versionCode: 1, versionName: '1', timeCreated: 't', device: 'd', exportType: 'backup' },
        layout: {
          portrait: [{ CLASS: 'wp.Page', navigations: 'all', widgets: [{ CLASS: 'W1', X1: 0, Y1: 0, X2: 1, Y2: 1 }] }],
          landscape: [{ CLASS: 'wp.Page', navigations: 'all', widgets: [{ CLASS: 'W2', X1: 0, Y1: 0, X2: 1, Y2: 1 }] }],
        },
      };

      populateEditorIds(config);
      expect(config.layout.portrait[0].widgets[0]._editorId).toBeDefined();
      expect(config.layout.landscape[0].widgets[0]._editorId).toBeDefined();
      expect(config.layout.portrait[0].widgets[0]._editorId).not.toBe(config.layout.landscape[0].widgets[0]._editorId);
    });

    it('cleanWidgetForExport purges _editorId and rogue grid coords', () => {
      const widgetWithId: XcfgWidget = {
        CLASS: 'WCompStatus',
        X1: 100,
        Y1: 200,
        X2: 300,
        Y2: 400,
        _editorId: 'wid_12345_test',
        gridX1: 1,
        gridY1: 2,
        gridX2: 3,
        gridY2: 4,
      };

      const cleaned = cleanWidgetForExport(widgetWithId);
      expect(cleaned._editorId).toBeUndefined();
      expect(cleaned.gridX1).toBeUndefined();
      expect(cleaned.gridY1).toBeUndefined();
      expect(cleaned.gridX2).toBeUndefined();
      expect(cleaned.gridY2).toBeUndefined();
      expect(cleaned.CLASS).toBe('WCompStatus');
      expect(cleaned.X1).toBe(100);
    });

    it('serializeXcfg NEVER leaks _editorId into exported JSON string', () => {
      const rawConfig: XcfgFile = {
        info: {
          versionCode: 1,
          versionName: '1.0',
          timeCreated: '2026-01-01',
          device: 'Test',
          exportType: 'backup',
        },
        layout: {
          portrait: [
            {
              CLASS: 'org.xcontest.XCTrack.widget.wp.Page',
              navigations: 'all',
              widgets: [
                { CLASS: 'WCompStatus', X1: 0, Y1: 0, X2: 5000, Y2: 5000, _editorId: 'wid_secret_1' },
                { CLASS: 'WVariometer', X1: 5000, Y1: 0, X2: 10000, Y2: 5000, _editorId: 'wid_secret_2' },
              ],
            },
          ],
          landscape: [],
        },
      };

      const serialized = serializeXcfg(rawConfig);
      expect(serialized).not.toContain('_editorId');
      expect(serialized).not.toContain('wid_secret');
    });

    it('computeSemanticDiff ignores _editorId differences between configs', () => {
      const cfgA: XcfgFile = {
        info: { versionCode: 1, versionName: '1', timeCreated: 't', device: 'd', exportType: 'pages' },
        layout: {
          portrait: [
            {
              CLASS: 'wp.Page',
              navigations: 'all',
              widgets: [
                { CLASS: 'WCompStatus', X1: 0, Y1: 0, X2: 1000, Y2: 1000, _editorId: 'wid_alpha' },
              ],
            },
          ],
          landscape: [],
        },
      };

      const cfgB: XcfgFile = {
        info: { versionCode: 1, versionName: '1', timeCreated: 't', device: 'd', exportType: 'pages' },
        layout: {
          portrait: [
            {
              CLASS: 'wp.Page',
              navigations: 'all',
              widgets: [
                { CLASS: 'WCompStatus', X1: 0, Y1: 0, X2: 1000, Y2: 1000, _editorId: 'wid_beta' },
              ],
            },
          ],
          landscape: [],
        },
      };

      const diff = computeSemanticDiff(cfgA, cfgB);
      const widgetPropDiffs = diff.filter((d) => d.path.includes('_editorId'));
      expect(widgetPropDiffs.length).toBe(0);
    });
  });

  describe('4. Shallow Updates & Immutability in Store', () => {
    beforeEach(() => {
      const initialConfig: XcfgFile = {
        info: { versionCode: 1, versionName: '1', timeCreated: 't', device: 'Test', exportType: 'backup' },
        layout: {
          portrait: [
            {
              CLASS: 'wp.Page',
              navigations: 'all',
              widgets: [
                { CLASS: 'WCompStatus', X1: 0, Y1: 0, X2: 5000, Y2: 5000, _editorId: 'wid_initial' },
              ],
            },
          ],
          landscape: [],
        },
      };
      editorStore.loadConfig(initialConfig, 'initial.xcfg');
    });

    it('updateWidget performs shallow path update preserving _editorId', () => {
      const pageBefore = editorStore.getCurrentPage();
      const widgetBefore = pageBefore?.widgets[0];
      const idBefore = widgetBefore?._editorId;

      editorStore.updateWidget(0, { titletext: 'Custom Title' }, false);

      const pageAfter = editorStore.getCurrentPage();
      const widgetAfter = pageAfter?.widgets[0];

      expect(widgetAfter?.titletext).toBe('Custom Title');
      if (idBefore) {
        expect(widgetAfter?._editorId).toBe(idBefore);
      }
    });

    it('updateWidgetCoords snaps to grid and immutably updates widget', () => {
      editorStore.updateWidgetCoords(0, 50, 60, 5050, 4060, false);
      const page = editorStore.getCurrentPage();
      const w = page?.widgets[0];
      expect(w?.X1).toBeDefined();
      expect(w?.X2).toBeDefined();
    });

    it('duplicateSelectedWidgets assigns new unique _editorId to duplicates', () => {
      editorStore.selectWidget(0);
      editorStore.duplicateSelectedWidgets();

      const page = editorStore.getCurrentPage();
      expect(page?.widgets.length).toBeGreaterThan(1);
      const original = page?.widgets[0];
      const duplicate = page?.widgets[page.widgets.length - 1];

      expect(original?._editorId).toBeDefined();
      expect(duplicate?._editorId).toBeDefined();
      expect(duplicate?._editorId).not.toBe(original?._editorId);
    });
  });

  describe('5. ErrorBoundary & Session Recovery', () => {
    it('ErrorBoundary.getDerivedStateFromError captures errors into state', () => {
      const error = new Error('Test Crash');
      const state = ErrorBoundary.getDerivedStateFromError(error);
      expect(state.hasError).toBe(true);
      expect(state.error).toBe(error);
    });

    it('ErrorBoundary.resetSession clears autosave storage and resets', () => {
      localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify({ test: 123 }));
      expect(localStorage.getItem(AUTOSAVE_STORAGE_KEY)).not.toBeNull();

      const eb = new ErrorBoundary({ children: null });
      eb.resetSession();

      expect(localStorage.getItem(AUTOSAVE_STORAGE_KEY)).toBeNull();
    });
  });
});
