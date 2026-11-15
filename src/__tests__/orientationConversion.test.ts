import { describe, it, expect, beforeEach } from 'vitest';
import { convertPageOrientation } from '../utils/orientationConverter';
import { editorStore } from '../store/useEditorStore';
import { getDeviceById } from '../data/devices';
import { DEMO_MODERN_BACKUP } from '../data/sample-configs';
import { XcfgPage, XcfgWidget } from '../types/xcfg';

// Mock localStorage for Vitest Node environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe('Orientation Converter', () => {
  const pixelDevice = getDeviceById('google-pixel-8-pro')!;

  const samplePortraitPage: XcfgPage = {
    CLASS: 'org.xcontest.XCTrack.widget.WPXCAssistant',
    navigations: 'all',
    widgets: [
      // Status line at top
      {
        CLASS: 'org.xcontest.XCTrack.widget.WStatusLine',
        X1: 0,
        Y1: 0,
        X2: 10000,
        Y2: 400,
      },
      // Speed gauge
      {
        CLASS: 'org.xcontest.XCTrack.widget.WSpeed',
        X1: 0,
        Y1: 400,
        X2: 5000,
        Y2: 1800,
      },
      // Altitude gauge
      {
        CLASS: 'org.xcontest.XCTrack.widget.WAltitude',
        X1: 5000,
        Y1: 400,
        X2: 10000,
        Y2: 1800,
      },
      // XC Map assistant
      {
        CLASS: 'org.xcontest.XCTrack.widget.WXCAssistant',
        X1: 0,
        Y1: 1800,
        X2: 10000,
        Y2: 8000,
      },
      // Side view at bottom
      {
        CLASS: 'org.xcontest.XCTrack.widget.WSideView',
        X1: 0,
        Y1: 8000,
        X2: 10000,
        Y2: 10000,
      },
    ],
  };

  it('converts portrait page to landscape using adaptive smart cockpit reflow', () => {
    const converted = convertPageOrientation(samplePortraitPage, 'portrait', 'landscape', {
      device: pixelDevice,
      strategy: 'adaptive',
    });

    expect(converted.CLASS).toBe(samplePortraitPage.CLASS);
    expect(converted.navigations).toEqual(samplePortraitPage.navigations);
    expect(converted.widgets).toHaveLength(5);

    // Map widget should be on the right side
    const mapWidget = converted.widgets.find((w) => w.CLASS.includes('WXCAssistant'))!;
    expect(mapWidget).toBeDefined();
    expect(mapWidget.X1).toBeGreaterThanOrEqual(2500);
    expect(mapWidget.X2).toBe(10000);

    // Status line should be at the top
    const statusWidget = converted.widgets.find((w) => w.CLASS.includes('WStatusLine'))!;
    expect(statusWidget).toBeDefined();
    expect(statusWidget.Y1).toBe(0);

    // Side view should be placed at bottom
    const sideViewWidget = converted.widgets.find((w) => w.CLASS.includes('WSideView'))!;
    expect(sideViewWidget).toBeDefined();
    expect(sideViewWidget.Y2).toBe(10000);

    // Data gauges should be placed in the left deck
    const speedWidget = converted.widgets.find((w) => w.CLASS.includes('WSpeed'))!;
    expect(speedWidget).toBeDefined();
    expect(speedWidget.X1).toBe(0);
    expect(speedWidget.X2).toBeLessThanOrEqual(3000);
  });

  it('converts landscape page back to portrait using adaptive reflow', () => {
    const landscapePage: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.WPCompetition',
      navigations: 'all',
      widgets: [
        {
          CLASS: 'org.xcontest.XCTrack.widget.WCompMap',
          X1: 3000,
          Y1: 0,
          X2: 10000,
          Y2: 10000,
        },
        {
          CLASS: 'org.xcontest.XCTrack.widget.WSpeed',
          X1: 0,
          Y1: 0,
          X2: 3000,
          Y2: 5000,
        },
      ],
    };

    const converted = convertPageOrientation(landscapePage, 'landscape', 'portrait', {
      device: pixelDevice,
      strategy: 'adaptive',
    });

    expect(converted.widgets).toHaveLength(2);
    const mapWidget = converted.widgets.find((w) => w.CLASS.includes('WCompMap'))!;
    const speedWidget = converted.widgets.find((w) => w.CLASS.includes('WSpeed'))!;

    // Map is placed in lower section in portrait
    expect(mapWidget.Y2).toBe(10000);
    expect(mapWidget.X1).toBe(0);
    expect(mapWidget.X2).toBe(10000);

    // Speed widget is placed in upper telemetry section
    expect(speedWidget.Y1).toBe(0);
  });

  it('converts using template strategy matching official XCTrack factory layout', () => {
    const converted = convertPageOrientation(samplePortraitPage, 'portrait', 'landscape', {
      device: pixelDevice,
      strategy: 'template',
    });

    // Template produces official factory widgets for landscape WPXCAssistant
    expect(converted.widgets.length).toBeGreaterThan(0);
    expect(converted.CLASS).toBe(samplePortraitPage.CLASS);
  });

  it('converts using proportional scaling strategy', () => {
    const converted = convertPageOrientation(samplePortraitPage, 'portrait', 'landscape', {
      device: pixelDevice,
      strategy: 'proportional',
    });

    expect(converted.widgets).toHaveLength(5);
    // All coordinates must be within 0..10000
    for (const w of converted.widgets) {
      expect(w.X1).toBeGreaterThanOrEqual(0);
      expect(w.Y1).toBeGreaterThanOrEqual(0);
      expect(w.X2).toBeLessThanOrEqual(10000);
      expect(w.Y2).toBeLessThanOrEqual(10000);
      expect(w.X2).toBeGreaterThan(w.X1);
      expect(w.Y2).toBeGreaterThan(w.Y1);
    }
  });

  it('converts using rotate90 strategy', () => {
    const converted = convertPageOrientation(samplePortraitPage, 'portrait', 'landscape', {
      device: pixelDevice,
      strategy: 'rotate90',
    });

    expect(converted.widgets).toHaveLength(5);
    for (const w of converted.widgets) {
      expect(w.X1).toBeGreaterThanOrEqual(0);
      expect(w.Y1).toBeGreaterThanOrEqual(0);
      expect(w.X2).toBeLessThanOrEqual(10000);
      expect(w.Y2).toBeLessThanOrEqual(10000);
      expect(w.X2).toBeGreaterThan(w.X1);
      expect(w.Y2).toBeGreaterThan(w.Y1);
    }
  });

  it('handles empty page conversion gracefully', () => {
    const emptyPage: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.WPEmpty',
      navigations: 'none',
      widgets: [],
    };

    const converted = convertPageOrientation(emptyPage, 'portrait', 'landscape', {
      device: pixelDevice,
      strategy: 'adaptive',
    });

    expect(converted.CLASS).toBe('org.xcontest.XCTrack.widget.WPEmpty');
    expect(converted.widgets).toEqual([]);
  });
});

describe('Editor Store Page Orientation Conversion Actions', () => {
  beforeEach(() => {
    editorStore.loadConfig(DEMO_MODERN_BACKUP);
  });

  it('duplicates and converts page to opposite orientation', () => {
    const initialPortraitCount = editorStore.getState().config.layout.portrait.length;
    const initialLandscapeCount = editorStore.getState().config.layout.landscape.length;

    editorStore.setOrientation('portrait');
    editorStore.setActivePage(0);

    // Duplicate & convert to landscape
    editorStore.convertPageOrientation(0, { strategy: 'adaptive' });

    const state = editorStore.getState();
    // Switched active orientation to landscape
    expect(state.activeOrientation).toBe('landscape');
    // Landscape has 1 more page
    expect(state.config.layout.landscape.length).toBe(initialLandscapeCount + 1);
    // Portrait still has its original pages
    expect(state.config.layout.portrait.length).toBe(initialPortraitCount);

    // Active page is the newly converted page
    expect(state.activePageIndex).toBe(state.config.layout.landscape.length - 1);
  });

  it('converts page to opposite orientation preserving source page (duplicate only, preventing 0 pages)', () => {
    editorStore.setOrientation('portrait');
    const portraitCountBefore = editorStore.getState().config.layout.portrait.length;
    const landscapeCountBefore = editorStore.getState().config.layout.landscape.length;

    editorStore.convertPageOrientation(0, { strategy: 'adaptive' });

    const state = editorStore.getState();
    expect(state.activeOrientation).toBe('landscape');
    expect(state.config.layout.landscape.length).toBe(landscapeCountBefore + 1);
    // Source portrait orientation never loses pages
    expect(state.config.layout.portrait.length).toBe(portraitCountBefore);
    expect(state.config.layout.portrait.length).toBeGreaterThanOrEqual(1);
  });

  it('supports undo and redo for page conversion', () => {
    editorStore.setOrientation('portrait');
    const landscapeCountBefore = editorStore.getState().config.layout.landscape.length;

    editorStore.convertPageOrientation(0, { strategy: 'adaptive' });
    expect(editorStore.getState().config.layout.landscape.length).toBe(landscapeCountBefore + 1);

    // Undo
    editorStore.undo();
    expect(editorStore.getState().config.layout.landscape.length).toBe(landscapeCountBefore);

    // Redo
    editorStore.redo();
    expect(editorStore.getState().config.layout.landscape.length).toBe(landscapeCountBefore + 1);
  });
});
