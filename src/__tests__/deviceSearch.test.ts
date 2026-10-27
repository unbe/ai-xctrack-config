import { describe, it, expect } from 'vitest';
import { getAllDevices, getDeviceById, findMatchingDevice, getDeviceCategories } from '../data/devices';

describe('Hannspree Lumo 7.8 and Device Search System', () => {
  it('includes Hannspree Lumo 7.8 with exact display and grid specifications', () => {
    const lumo = getDeviceById('hannspree-lumo-7.8');
    expect(lumo).toBeDefined();
    expect(lumo.id).toBe('hannspree-lumo-7.8');
    expect(lumo.name).toBe('Hannspree Lumo 7.8"');
    expect(lumo.brand).toBe('Hannspree');
    expect(lumo.category).toBe('E-Ink');
    expect(lumo.screenSizeInches).toBe(7.8);
    expect(lumo.screenWidthPx).toBe(768);
    expect(lumo.screenHeightPx).toBe(1024);
    expect(lumo.aspectRatio).toBe('4:3');
    expect(lumo.densityDpi).toBe(160);

    // Recommended grid: cols=40, rows=54 portrait, cols=54, rows=40 landscape
    expect(lumo.gridPortrait.cols).toBe(40);
    expect(lumo.gridPortrait.rows).toBe(54);
    expect(lumo.gridLandscape.cols).toBe(54);
    expect(lumo.gridLandscape.rows).toBe(40);

    // Inset grid: cols=40, rows=50 portrait
    expect(lumo.gridPortraitInset?.cols).toBe(40);
    expect(lumo.gridPortraitInset?.rows).toBe(50);
  });

  it('auto-detects Hannspree Lumo from device strings', () => {
    expect(findMatchingDevice('Hannspree Lumo 7.8').id).toBe('hannspree-lumo-7.8');
    expect(findMatchingDevice('Hannspree SN08HD1B').id).toBe('hannspree-lumo-7.8');
    expect(findMatchingDevice('Lumo Paper Tablet').id).toBe('hannspree-lumo-7.8');
  });

  it('includes E-Ink in device categories and groups devices accurately', () => {
    const cats = getDeviceCategories();
    expect(cats).toContain('E-Ink');

    const all = getAllDevices();
    expect(all.length).toBeGreaterThanOrEqual(43);

    const einkDevices = all.filter(d => d.category === 'E-Ink');
    expect(einkDevices.some(d => d.id === 'hannspree-lumo-7.8')).toBe(true);
    expect(einkDevices.some(d => d.id === 'inkbook-focus-7.8')).toBe(true);
  });
});
