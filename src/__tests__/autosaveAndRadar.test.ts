import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateThunderstormGeoJSON,
  generateThunderstormSvgContours,
} from '../utils/thunderstormRadar';
import {
  editorStore,
  saveAutosaveNow,
  getStoredAutosave,
  hasAutosavedSession,
  clearAutosave,
  AUTOSAVE_STORAGE_KEY,
} from '../store/useEditorStore';
import { DEMO_MODERN_BACKUP } from '../data/sample-configs';

// In-memory mock for localStorage in test environment
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

describe('Realistic Thunderstorm Convective Radar', () => {
  it('generates a multi-tier Doppler GeoJSON structure covering 20 dBZ to 65 dBZ hail core', () => {
    const geo = generateThunderstormGeoJSON([7.859, 46.686]);

    expect(geo.type).toBe('FeatureCollection');
    expect(geo.features.length).toBeGreaterThanOrEqual(7);

    const dbzValues = geo.features.map((f) => f.properties.dbz);
    expect(dbzValues).toContain(20);
    expect(dbzValues).toContain(32);
    expect(dbzValues).toContain(42);
    expect(dbzValues).toContain(52);
    expect(dbzValues).toContain(58);
    expect(dbzValues).toContain(65);

    // Verify all polygon rings are closed
    geo.features.forEach((feature) => {
      expect(feature.geometry.type).toBe('Polygon');
      const ring = feature.geometry.coordinates[0];
      expect(ring.length).toBeGreaterThan(10);
      const first = ring[0];
      const last = ring[ring.length - 1];
      expect(first[0]).toBeCloseTo(last[0], 6);
      expect(first[1]).toBeCloseTo(last[1], 6);
    });
  });

  it('generates high-fidelity SVG paths for static map preview with closed contours', () => {
    const svgContours = generateThunderstormSvgContours(820, 320, 1.0);
    expect(svgContours.length).toBeGreaterThanOrEqual(6);

    svgContours.forEach((contour) => {
      expect(contour.d).toMatch(/^M\s+[\d.-]+\s+[\d.-]+/);
      expect(contour.d.trim().endsWith('Z')).toBe(true);
      expect(contour.color).toBeDefined();
      expect(contour.opacity).toBeGreaterThan(0);
      expect(contour.opacity).toBeLessThanOrEqual(1.0);
    });

    const maxDbz = Math.max(...svgContours.map((c) => c.dbz));
    expect(maxDbz).toBe(65); // Hail shaft tier
  });
});

describe('Editor Auto-Save & Reload State Recovery', () => {
  it('stores and restores full editor configuration and active device seamlessly', () => {
    clearAutosave();
    expect(hasAutosavedSession()).toBe(false);

    // Load initial config
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'test_pilot_flight.xcfg');
    editorStore.setActivePage(1);
    editorStore.setActiveTab('preferences');

    // Force immediate persist
    saveAutosaveNow();

    expect(hasAutosavedSession()).toBe(true);
    const stored = getStoredAutosave();
    expect(stored).not.toBeNull();
    expect(stored?.filename).toBe('test_pilot_flight.xcfg');
    expect(stored?.activePageIndex).toBe(1);
    expect(stored?.activeTab).toBe('preferences');
    expect(stored?.config.info?.exportType).toBe('backup');

    // Reset store to a different blank state to simulate browser reload
    editorStore.loadConfig({ info: { device: 'Other' }, layout: { portrait: [], landscape: [] } } as any, 'blank.xcfg');
    expect(editorStore.getState().filename).toBe('blank.xcfg');

    // Restore autosaved session
    const restored = editorStore.restoreAutosavedSession();
    expect(restored).toBe(true);

    const state = editorStore.getState();
    expect(state.filename).toBe('test_pilot_flight.xcfg');
    expect(state.activePageIndex).toBe(1);
    expect(state.activeTab).toBe('preferences');
    expect(state.config.layout.portrait.length).toBe(DEMO_MODERN_BACKUP.layout.portrait.length);
  });

  it('allows clearing autosave when resetting state', () => {
    saveAutosaveNow();
    expect(hasAutosavedSession()).toBe(true);

    editorStore.clearAutosave();
    expect(hasAutosavedSession()).toBe(false);
    expect(getStoredAutosave()).toBeNull();
  });
});
