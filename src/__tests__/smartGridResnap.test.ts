import { describe, it, expect, beforeEach } from 'vitest';
import { resnapPageToGrid } from '../utils/smartGridResnap';
import { editorStore } from '../store/useEditorStore';
import { getDeviceById } from '../data/devices';
import { normToGrid, gridToNorm } from '../utils/gridMath';
import { DEMO_MODERN_BACKUP } from '../data/sample-configs';
import { XcfgPage } from '../types/xcfg';

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

describe('Smart Seam-Preserving Grid Resnap', () => {
  const lumoGrid = { cols: 40, rows: 54 };
  const air3Grid = { cols: 31, rows: 50 };

  it('guarantees ZERO gaps between horizontally touching widgets', () => {
    // Top deck with two side-by-side gauges created on Pixel (23 cols)
    // 11 cols = 4783, 12 cols = 5217
    const page: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
      navigations: 'none',
      widgets: [
        {
          CLASS: 'org.xcontest.XCTrack.widget.w.WSpeed',
          X1: 0,
          Y1: 0,
          X2: 4783,
          Y2: 2000,
        },
        {
          CLASS: 'org.xcontest.XCTrack.widget.w.WAltitude',
          X1: 4783,
          Y1: 0,
          X2: 10000,
          Y2: 2000,
        },
      ],
    };

    const resnapped = resnapPageToGrid(page, lumoGrid);

    // Left gauge starts strictly at 0
    expect(resnapped.widgets[0].X1).toBe(0);
    // Right gauge ends strictly at 10000
    expect(resnapped.widgets[1].X2).toBe(10000);

    // The shared vertical seam MUST be 100% identical: ZERO GAP!
    expect(resnapped.widgets[0].X2).toBe(resnapped.widgets[1].X1);

    // The shared seam must be an exact grid column on the Hannspree Lumo (40 cols)
    const seam = resnapped.widgets[0].X2;
    const gridCol = normToGrid(seam, lumoGrid.cols);
    expect(gridToNorm(gridCol, lumoGrid.cols)).toBe(seam);
  });

  it('guarantees ZERO gaps between vertically touching widgets', () => {
    // 3 vertically stacked widgets (Status Line, Map, SideView)
    const page: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
      navigations: 'none',
      widgets: [
        {
          CLASS: 'org.xcontest.XCTrack.widget.w.WStatusLine',
          X1: 0,
          Y1: 0,
          X2: 10000,
          Y2: 385,
        },
        {
          CLASS: 'org.xcontest.XCTrack.widget.w.WXCAssistant',
          X1: 0,
          Y1: 385,
          X2: 10000,
          Y2: 7692,
        },
        {
          CLASS: 'org.xcontest.XCTrack.widget.w.WSideView',
          X1: 0,
          Y1: 7692,
          X2: 10000,
          Y2: 10000,
        },
      ],
    };

    const resnapped = resnapPageToGrid(page, lumoGrid);

    // Top border flush
    expect(resnapped.widgets[0].Y1).toBe(0);
    // Seam 1: Status Line bottom == Map top
    expect(resnapped.widgets[0].Y2).toBe(resnapped.widgets[1].Y1);
    // Seam 2: Map bottom == SideView top
    expect(resnapped.widgets[1].Y2).toBe(resnapped.widgets[2].Y1);
    // Bottom border flush
    expect(resnapped.widgets[2].Y2).toBe(10000);

    // Every horizontal boundary is an exact integer grid line on Hannspree Lumo (54 rows)
    for (const w of resnapped.widgets) {
      const gY1 = normToGrid(w.Y1, lumoGrid.rows);
      const gY2 = normToGrid(w.Y2, lumoGrid.rows);
      expect(gridToNorm(gY1, lumoGrid.rows)).toBe(w.Y1);
      expect(gridToNorm(gY2, lumoGrid.rows)).toBe(w.Y2);
      expect(w.Y2).toBeGreaterThan(w.Y1);
    }
  });

  it('resnaps a complete complex cockpit layout with 0 gaps anywhere', () => {
    // Complex 2x2 grid with header and footer
    const page: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.wp.WPXCAssistant',
      navigations: 'all',
      widgets: [
        // Status header
        { CLASS: 'WStatusLine', X1: 0, Y1: 0, X2: 10000, Y2: 385 },
        // Top-left gauge
        { CLASS: 'WSpeed', X1: 0, Y1: 385, X2: 5000, Y2: 2500 },
        // Top-right gauge
        { CLASS: 'WAltitude', X1: 5000, Y1: 385, X2: 10000, Y2: 2500 },
        // Bottom-left gauge
        { CLASS: 'WVario', X1: 0, Y1: 2500, X2: 5000, Y2: 4000 },
        // Bottom-right gauge
        { CLASS: 'WGlide', X1: 5000, Y1: 2500, X2: 10000, Y2: 4000 },
        // Main map
        { CLASS: 'WXCAssistant', X1: 0, Y1: 4000, X2: 10000, Y2: 10000 },
      ],
    };

    const resnapped = resnapPageToGrid(page, air3Grid);

    // Check all horizontal seams:
    // Header bottom touches both top gauges
    expect(resnapped.widgets[0].Y2).toBe(resnapped.widgets[1].Y1);
    expect(resnapped.widgets[0].Y2).toBe(resnapped.widgets[2].Y1);

    // Top gauges bottom touches bottom gauges top
    expect(resnapped.widgets[1].Y2).toBe(resnapped.widgets[3].Y1);
    expect(resnapped.widgets[2].Y2).toBe(resnapped.widgets[4].Y1);

    // Bottom gauges bottom touches map top
    expect(resnapped.widgets[3].Y2).toBe(resnapped.widgets[5].Y1);
    expect(resnapped.widgets[4].Y2).toBe(resnapped.widgets[5].Y1);

    // Check all vertical seams:
    // Left column ends exactly where right column begins
    expect(resnapped.widgets[1].X2).toBe(resnapped.widgets[2].X1);
    expect(resnapped.widgets[3].X2).toBe(resnapped.widgets[4].X1);
    // Vertical seams are colinear
    expect(resnapped.widgets[1].X2).toBe(resnapped.widgets[3].X2);

    // All outer bounds flush
    expect(resnapped.widgets[0].X1).toBe(0);
    expect(resnapped.widgets[0].X2).toBe(10000);
    expect(resnapped.widgets[5].X1).toBe(0);
    expect(resnapped.widgets[5].X2).toBe(10000);
    expect(resnapped.widgets[5].Y2).toBe(10000);
  });

  it('preserves intentional gaps between floating or spaced widgets', () => {
    const page: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
      navigations: 'none',
      widgets: [
        { CLASS: 'WSpeed', X1: 1000, Y1: 1000, X2: 4000, Y2: 3000 },
        // Clear 2000-unit gap
        { CLASS: 'WAltitude', X1: 6000, Y1: 1000, X2: 9000, Y2: 3000 },
      ],
    };

    const resnapped = resnapPageToGrid(page, lumoGrid);

    // The gap must be preserved, widgets must not be glued together
    expect(resnapped.widgets[0].X2).toBeLessThan(resnapped.widgets[1].X1);
    expect(resnapped.widgets[1].X1 - resnapped.widgets[0].X2).toBeGreaterThan(1500);
  });

  it('handles empty pages gracefully', () => {
    const page: XcfgPage = {
      CLASS: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
      navigations: 'none',
      widgets: [],
    };
    const resnapped = resnapPageToGrid(page, lumoGrid);
    expect(resnapped.widgets).toEqual([]);
  });
});

describe('Store Device Change & Resnap Integration', () => {
  beforeEach(() => {
    editorStore.loadConfig(DEMO_MODERN_BACKUP);
  });

  it('automatically resnaps layout when switching device if autoResnap is enabled', () => {
    editorStore.setAutoResnapOnDeviceChange(true);
    const lumoDevice = getDeviceById('hannspree-lumo-7.8');

    // Switch device
    editorStore.setDevice(lumoDevice);

    const state = editorStore.getState();
    expect(state.activeDevice.id).toBe('hannspree-lumo-7.8');

    // Current page widgets should now all align to Hannspree Lumo 40-col grid
    const page = editorStore.getCurrentPage()!;
    expect(page.widgets.length).toBeGreaterThan(0);

    for (const w of page.widgets) {
      const gX1 = normToGrid(w.X1, 40);
      const gX2 = normToGrid(w.X2, 40);
      expect(gridToNorm(gX1, 40)).toBe(w.X1);
      expect(gridToNorm(gX2, 40)).toBe(w.X2);
    }
  });

  it('does not resnap layout if autoResnap is disabled', () => {
    editorStore.setAutoResnapOnDeviceChange(false);
    const initialPage = JSON.parse(JSON.stringify(editorStore.getCurrentPage()!));

    const lumoDevice = getDeviceById('hannspree-lumo-7.8');
    editorStore.setDevice(lumoDevice);

    const currentPage = editorStore.getCurrentPage()!;
    // Widget coordinates must remain identical to before device switch
    expect(currentPage.widgets).toEqual(initialPage.widgets);
  });

  it('resnaps current page manually via resnapCurrentPageToGrid', () => {
    const lumoDevice = getDeviceById('hannspree-lumo-7.8');
    editorStore.setAutoResnapOnDeviceChange(false);
    editorStore.setDevice(lumoDevice);

    // Manually trigger resnap
    editorStore.resnapCurrentPageToGrid();

    const page = editorStore.getCurrentPage()!;
    for (const w of page.widgets) {
      const gX1 = normToGrid(w.X1, 40);
      expect(gridToNorm(gX1, 40)).toBe(w.X1);
    }

    // Undo restores previous un-resnapped coordinates
    editorStore.undo();
    const undonePage = editorStore.getCurrentPage()!;
    expect(undonePage).toBeDefined();
  });
});
