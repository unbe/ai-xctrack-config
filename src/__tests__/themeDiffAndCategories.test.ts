import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  editorStore,
  saveAutosaveNow,
  getStoredAutosave,
  clearAutosave,
} from '../store/useEditorStore';
import { XcfgFile } from '../types/xcfg';
import { computeLineDiff } from '../utils/diffEngine';

const mockStorage: Record<string, string> = {};

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
});

describe('Theme Synchronization from Config', () => {
  it('loads WhiteHCTheme from config.preferences into globalTheme automatically', () => {
    const configWithWhiteHC = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        timeCreated: '2026-10-27',
        versionCode: 100072,
        versionName: '1.0.7',
      },
      preferences: {
        'Display.Theme': 'WhiteHCTheme',
      },
      layout: { portrait: [], landscape: [] },
    } as unknown as XcfgFile;

    editorStore.loadConfig(configWithWhiteHC, 'test_white_hc.xcfg');
    expect(editorStore.getState().globalTheme).toBe('WhiteHCTheme');
  });

  it('loads WhiteTheme from config.preferences into globalTheme', () => {
    const configWithWhite = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        timeCreated: '2026-10-27',
        versionCode: 100072,
        versionName: '1.0.7',
      },
      preferences: {
        'Display.Theme': 'WhiteTheme',
      },
      layout: { portrait: [], landscape: [] },
    } as unknown as XcfgFile;

    editorStore.loadConfig(configWithWhite, 'test_white.xcfg');
    expect(editorStore.getState().globalTheme).toBe('WhiteTheme');
  });

  it('falls back to BlackTheme if preferences are missing or theme is undefined', () => {
    const configWithoutTheme = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'pages',
        timeCreated: '2026-10-27',
        versionCode: 100072,
        versionName: '1.0.7',
      },
      layout: { portrait: [], landscape: [] },
    } as unknown as XcfgFile;

    editorStore.loadConfig(configWithoutTheme, 'test_no_theme.xcfg');
    expect(editorStore.getState().globalTheme).toBe('BlackTheme');
  });

  it('updates preferences["Display.Theme"] when setGlobalTheme is called on backup config', () => {
    const config = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        versionCode: 100072,
        versionName: '1.0.7',
        timeCreated: '2026-10-27',
      },
      preferences: { 'Display.Theme': 'BlackTheme' },
      layout: { portrait: [], landscape: [] },
    } as unknown as XcfgFile;

    editorStore.loadConfig(config, 'test.xcfg');
    editorStore.setGlobalTheme('WhiteEInkTheme');

    expect(editorStore.getState().globalTheme).toBe('WhiteEInkTheme');
    expect(editorStore.getState().config.preferences?.['Display.Theme']).toBe('WhiteEInkTheme');
  });

  it('preserves and restores globalTheme across autosave sessions', () => {
    clearAutosave();
    const config = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        versionCode: 100072,
        versionName: '1.0.7',
        timeCreated: '2026-10-27',
      },
      preferences: { 'Display.Theme': 'WhiteHCTheme' },
      layout: { portrait: [], landscape: [] },
    } as unknown as XcfgFile;

    editorStore.loadConfig(config, 'theme_autosave.xcfg');
    saveAutosaveNow();

    const stored = getStoredAutosave();
    expect(stored?.globalTheme).toBe('WhiteHCTheme');

    // Reset state to simulate reload
    editorStore.setGlobalTheme('BlackTheme');
    expect(editorStore.getState().globalTheme).toBe('BlackTheme');

    // Restore autosaved session
    editorStore.restoreAutosavedSession();
    expect(editorStore.getState().globalTheme).toBe('WhiteHCTheme');
  });
});

describe('Diff Hunk Computation for Prev/Next Navigation', () => {
  it('computes contiguous diff hunks for side-by-side and unified diffs', () => {
    const original = `line 1
line 2 (old)
line 3
line 4 (old)
line 5`;

    const modified = `line 1
line 2 (new)
line 3
line 4 (new)
line 5`;

    const { unified, stats } = computeLineDiff(original, modified);
    expect(stats.isIdentical).toBe(false);

    // Compute contiguous hunks
    const hunks: { start: number; end: number }[] = [];
    let inHunk = false;
    let start = 0;

    unified.forEach((line, idx) => {
      if (line.type !== 'unchanged') {
        if (!inHunk) {
          inHunk = true;
          start = idx;
        }
      } else {
        if (inHunk) {
          hunks.push({ start, end: idx - 1 });
          inHunk = false;
        }
      }
    });
    if (inHunk) {
      hunks.push({ start, end: unified.length - 1 });
    }

    // Should find exactly 2 distinct changed hunks (line 2 and line 4)
    expect(hunks.length).toBe(2);
  });
});

describe('KK7 Timed Thermals Properties', () => {
  it('updates mapWidget_KK7timed and mapWidget_KK7timedOpacity in widget state', () => {
    const configWithMap = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        versionCode: 100072,
        versionName: '1.0.7',
        timeCreated: '2026-10-27',
      },
      layout: {
        portrait: [
          {
            title: 'XC Map',
            widgets: [
              {
                CLASS: 'org.xcontest.XCTrack.widget.WXCAssistant',
                X1: 0,
                Y1: 0,
                X2: 20,
                Y2: 20,
                mapWidget_showKK7: false,
                mapWidget_KK7opacity: 40,
                mapWidget_KK7timed: false,
                mapWidget_KK7timedOpacity: 80,
              },
            ],
          },
        ],
        landscape: [],
      },
    } as unknown as XcfgFile;

    editorStore.loadConfig(configWithMap, 'test_kk7.xcfg');
    const initialWidget = editorStore.getState().config?.layout.portrait[0].widgets[0];
    expect(initialWidget?.mapWidget_KK7timed).toBe(false);
    expect(initialWidget?.mapWidget_KK7timedOpacity).toBe(80);

    // Update to enabled and 30% opacity
    editorStore.updateWidget(0, {
      mapWidget_KK7timed: true,
      mapWidget_KK7timedOpacity: 30,
    });

    const updatedWidget = editorStore.getState().config?.layout.portrait[0].widgets[0];
    expect(updatedWidget?.mapWidget_KK7timed).toBe(true);
    expect(updatedWidget?.mapWidget_KK7timedOpacity).toBe(30);
  });
});

describe('No Rogue Grid Properties on Widget Move', () => {
  it('does not add gridX1/gridY1/gridX2/gridY2 to widget state or serialized JSON when moving widgets', () => {
    const config = {
      info: {
        device: 'Google Pixel 8 Pro',
        exportType: 'backup',
        versionCode: 100072,
        versionName: '1.0.7',
        timeCreated: '2026-10-27',
      },
      layout: {
        portrait: [
          {
            title: 'XC Map',
            widgets: [
              {
                CLASS: 'org.xcontest.XCTrack.widget.w.WSpeed',
                X1: 0,
                Y1: 0,
                X2: 2000,
                Y2: 2000,
              },
            ],
          },
        ],
        landscape: [],
      },
    } as unknown as XcfgFile;

    editorStore.loadConfig(config, 'test_coords.xcfg');
    editorStore.setSnapToGrid(true);

    // Move widget
    editorStore.updateWidgetCoords(0, 1000, 1500, 3000, 3500);

    const movedWidget = editorStore.getState().config?.layout.portrait[0].widgets[0] as any;
    expect(movedWidget.X1).toBeDefined();
    expect(movedWidget.Y1).toBeDefined();
    expect(movedWidget.X2).toBeDefined();
    expect(movedWidget.Y2).toBeDefined();
    expect(movedWidget.gridX1).toBeUndefined();
    expect(movedWidget.gridY1).toBeUndefined();
    expect(movedWidget.gridX2).toBeUndefined();
    expect(movedWidget.gridY2).toBeUndefined();

    // Verify serialization
    const serialized = JSON.parse(JSON.stringify(editorStore.getState().config));
    const serializedWidget = serialized.layout.portrait[0].widgets[0];
    expect(serializedWidget.gridX1).toBeUndefined();
    expect(serializedWidget.gridY1).toBeUndefined();
    expect(serializedWidget.gridX2).toBeUndefined();
    expect(serializedWidget.gridY2).toBeUndefined();
  });
});
