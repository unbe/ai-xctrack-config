import { describe, it, expect } from 'vitest';
import {
  MAP_THEMES,
  TERRAIN_STYLES,
  MAP_APPEARANCE_PRESETS,
  getMapTheme,
  getTerrainStyle,
} from '../data/map-styles';

describe('Map Appearance & Styles System', () => {
  it('defines all 17 OSM Vector Map themes matching XCTrack e0', () => {
    expect(MAP_THEMES.length).toBe(17);
    const themeIds = MAP_THEMES.map((t) => t.id);
    expect(themeIds).toContain('None');
    expect(themeIds).toContain('ClearpilotForest');
    expect(themeIds).toContain('ClearpilotForestBig');
    expect(themeIds).toContain('ClearpilotForestDark');
    expect(themeIds).toContain('ClearpilotForestDarkBig');
    expect(themeIds).toContain('Clearpilot');
    expect(themeIds).toContain('ClearpilotDark');
    expect(themeIds).toContain('Hyperpilot');
    expect(themeIds).toContain('HyperpilotBlack');
    expect(themeIds).toContain('Lightpilot');
    expect(themeIds).toContain('Frenchkiss');
    expect(themeIds).toContain('VtmDefault');
    expect(themeIds).toContain('Newtron');
    expect(themeIds).toContain('Osmagray');
    expect(themeIds).toContain('Osmarender');
    expect(themeIds).toContain('Tronrender');
    expect(themeIds).toContain('Custom');
  });

  it('defines all 7 terrain & hillshading profiles matching XCTrack c0', () => {
    expect(TERRAIN_STYLES.length).toBe(7);
    const terrainIds = TERRAIN_STYLES.map((t) => t.id);
    expect(terrainIds).toEqual([
      'None',
      'Light',
      'Dark',
      'XContest',
      'LightShading',
      'DarkShading',
      'LightLegacy',
    ]);
  });

  it('correctly categorizes hillshading-only vs full elevation relief gradients', () => {
    const lightShading = getTerrainStyle('LightShading');
    expect(lightShading.hasHillshading).toBe(true);
    expect(lightShading.hasElevationGradient).toBe(false);

    const darkShading = getTerrainStyle('DarkShading');
    expect(darkShading.hasHillshading).toBe(true);
    expect(darkShading.hasElevationGradient).toBe(false);

    const xcontest = getTerrainStyle('XContest');
    expect(xcontest.hasHillshading).toBe(true);
    expect(xcontest.hasElevationGradient).toBe(true);

    const none = getTerrainStyle('None');
    expect(none.hasHillshading).toBe(false);
    expect(none.hasElevationGradient).toBe(false);
  });

  it('defines 25 curated appearance presets matching XCTrack r.java', () => {
    expect(MAP_APPEARANCE_PRESETS.length).toBe(25);
    const categories = new Set(MAP_APPEARANCE_PRESETS.map((p) => p.category));
    expect(categories).toEqual(new Set(['featured', 'extra', 'classic', 'relief', 'empty']));

    // Every preset must reference a valid theme and terrain
    for (const preset of MAP_APPEARANCE_PRESETS) {
      const theme = getMapTheme(preset.theme);
      expect(theme.id).toBe(preset.theme);
      const terrain = getTerrainStyle(preset.terrain);
      expect(terrain.id).toBe(preset.terrain);
    }
  });

  it('safely handles unknown theme or terrain IDs with fallback', () => {
    const fallbackTheme = getMapTheme('UnknownTheme123');
    expect(fallbackTheme.id).toBe('None');

    const fallbackTerrain = getTerrainStyle('NonExistentTerrain');
    expect(fallbackTerrain.id).toBe('None');
  });
});
