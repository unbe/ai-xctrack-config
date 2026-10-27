import { describe, it, expect, beforeEach } from 'vitest';
import { computeLineDiff, computeSemanticDiff } from '../utils/diffEngine';
import { getStoredDevice, getStoredDeviceId, persistDeviceId, editorStore } from '../store/useEditorStore';
import { getDeviceById } from '../data/devices';
import { DEMO_MODERN_BACKUP, DEMO_XC_ASSISTANT } from '../data/sample-configs';

// Lightweight localStorage mock for Node test environment
const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
  configurable: true,
});

describe('Device Persistence in LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to google-pixel-8-pro when localStorage is empty', () => {
    expect(getStoredDeviceId()).toBeNull();
    const dev = getStoredDevice();
    expect(dev.id).toBe('google-pixel-8-pro');
  });

  it('persists device ID and restores it', () => {
    persistDeviceId('hannspree-lumo-7.8');
    expect(getStoredDeviceId()).toBe('hannspree-lumo-7.8');
    const dev = getStoredDevice();
    expect(dev.id).toBe('hannspree-lumo-7.8');
    expect(dev.name).toBe('Hannspree Lumo 7.8"');
  });

  it('persists device when setDevice is called on editorStore', () => {
    const air3 = getDeviceById('air3-7.3-plus');
    editorStore.setDevice(air3);
    expect(getStoredDeviceId()).toBe('air3-7.3-plus');
    expect(editorStore.getState().activeDevice.id).toBe('air3-7.3-plus');
  });

  it('respects saved device on loadConfig when respectSavedDevice flag is true', () => {
    persistDeviceId('hannspree-lumo-7.8');
    // DEMO_MODERN_BACKUP has device: 'Google Pixel 8 Pro'
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'test.xcfg', true);
    expect(editorStore.getState().activeDevice.id).toBe('hannspree-lumo-7.8');
  });
});

describe('JSON Diff Engine', () => {
  it('detects identical JSON with zero additions/deletions', () => {
    const text = '{\n  "version": 1\n}';
    const result = computeLineDiff(text, text);
    expect(result.stats.isIdentical).toBe(true);
    expect(result.stats.additions).toBe(0);
    expect(result.stats.deletions).toBe(0);
    expect(result.unified).toHaveLength(3);
    expect(result.sideBySide).toHaveLength(3);
  });

  it('computes line additions and deletions accurately in unified and split formats', () => {
    const original = '{\n  "name": "Original",\n  "count": 10\n}';
    const modified = '{\n  "name": "Modified",\n  "count": 10,\n  "extra": true\n}';

    const result = computeLineDiff(original, modified);
    expect(result.stats.isIdentical).toBe(false);
    expect(result.stats.additions).toBeGreaterThan(0);
    expect(result.stats.deletions).toBeGreaterThan(0);

    // Verify side by side alignment
    expect(result.sideBySide.length).toBeGreaterThanOrEqual(4);
    const addedLine = result.unified.find((l) => l.type === 'added');
    expect(addedLine).toBeDefined();

    const removedLine = result.unified.find((l) => l.type === 'removed');
    expect(removedLine).toBeDefined();
  });

  it('computes high-level semantic diffs across info, layout, and preferences', () => {
    const changes = computeSemanticDiff(DEMO_MODERN_BACKUP, DEMO_XC_ASSISTANT);
    expect(changes.length).toBeGreaterThan(0);

    // Device changed
    const deviceChange = changes.find((c) => c.path === 'info.device');
    expect(deviceChange).toBeDefined();
    expect(deviceChange?.oldValue).toBe('Google Pixel 8 Pro');
    expect(deviceChange?.newValue).toBe('Hannspree Lumo 7.8"');

    // Theme preference changed
    const themeChange = changes.find((c) => c.path === 'preferences.Display.Theme');
    expect(themeChange).toBeDefined();
    expect(themeChange?.oldValue).toBe('BlackTheme');
    expect(themeChange?.newValue).toBe('WhiteEInkTheme');
  });
});
