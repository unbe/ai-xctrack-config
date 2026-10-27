import { describe, it, expect } from 'vitest';
import {
  ELEVATION_PROFILES,
  CONTOUR_INTERVALS,
  XCTRACK_VTM_SPECS,
  getVtmThemeSpec,
  getElevationColorStops,
  getContourColor,
  buildMapLibreLayersForTheme,
} from '../data/xctrack-vtm-specs';

describe('XCTrack VTM Theme & Hypsometric Relief Specifications', () => {
  describe('Decompiled Elevation Profiles (libxctrack-native.so)', () => {
    it('defines the 4 exact elevation profiles', () => {
      expect(Object.keys(ELEVATION_PROFILES)).toEqual([
        'XContest',
        'Light',
        'Dark',
        'LightLegacy',
      ]);
    });

    it('has exact 8 stops and contour color for XContest topographic profile', () => {
      const xc = ELEVATION_PROFILES['XContest'];
      expect(xc.stops.length).toBe(8);
      expect(xc.contourColor).toBe('#403020');
      expect(xc.stops[0]).toEqual({ elevation: 0, color: '#6aa050' });
      expect(xc.stops[1]).toEqual({ elevation: 200, color: '#50b240' });
      expect(xc.stops[2]).toEqual({ elevation: 700, color: '#c7c748' });
      expect(xc.stops[3]).toEqual({ elevation: 1100, color: '#ab8f3a' });
      expect(xc.stops[4]).toEqual({ elevation: 1400, color: '#ab7348' });
      expect(xc.stops[5]).toEqual({ elevation: 2800, color: '#c7c7c7' });
      expect(xc.stops[6]).toEqual({ elevation: 4600, color: '#ffffff' });
      expect(xc.stops[7]).toEqual({ elevation: 6500, color: '#c7c7ff' });
    });

    it('has exact 6 stops for Light (xctrackProfile)', () => {
      const light = ELEVATION_PROFILES['Light'];
      expect(light.stops.length).toBe(6);
      expect(light.contourColor).toBe('#403020');
      expect(light.stops[0]).toEqual({ elevation: 0, color: '#ffffff' });
      expect(light.stops[1]).toEqual({ elevation: 1100, color: '#eddeb2' });
      expect(light.stops[2]).toEqual({ elevation: 1400, color: '#edc2a6' });
      expect(light.stops[3]).toEqual({ elevation: 2800, color: '#f0f0f0' });
      expect(light.stops[4]).toEqual({ elevation: 4600, color: '#ffffff' });
      expect(light.stops[5]).toEqual({ elevation: 6500, color: '#efefff' });
    });

    it('has exact 6 stops for Dark (darkProfile)', () => {
      const dark = ELEVATION_PROFILES['Dark'];
      expect(dark.stops.length).toBe(6);
      expect(dark.contourColor).toBe('#c0c0c0');
      expect(dark.stops[0]).toEqual({ elevation: 0, color: '#c0c0c0' });
      expect(dark.stops[1]).toEqual({ elevation: 500, color: '#a0a0a0' });
      expect(dark.stops[2]).toEqual({ elevation: 1200, color: '#cfcf02' });
      expect(dark.stops[3]).toEqual({ elevation: 2800, color: '#b34724' });
      expect(dark.stops[4]).toEqual({ elevation: 4600, color: '#ffffff' });
      expect(dark.stops[5]).toEqual({ elevation: 6500, color: '#efefff' });
    });

    it('has exact 6 stops for LightLegacy (xctrackLegacyProfile)', () => {
      const legacy = ELEVATION_PROFILES['LightLegacy'];
      expect(legacy.stops.length).toBe(6);
      expect(legacy.contourColor).toBe('#403020');
      expect(legacy.stops[0]).toEqual({ elevation: 0, color: '#ffffff' });
      expect(legacy.stops[1]).toEqual({ elevation: 1100, color: '#ede4c9' });
      expect(legacy.stops[2]).toEqual({ elevation: 1400, color: '#ebdbcf' });
      expect(legacy.stops[3]).toEqual({ elevation: 2800, color: '#f0f0f0' });
      expect(legacy.stops[4]).toEqual({ elevation: 4600, color: '#ffffff' });
      expect(legacy.stops[5]).toEqual({ elevation: 6500, color: '#efefff' });
    });

    it('specifies 10m, 50m, 100m native contour intervals', () => {
      expect(CONTOUR_INTERVALS).toEqual({
        minor: 10,
        intermediate: 50,
        major: 100,
      });
    });

    it('formats elevation stops for MapLibre color-relief expression', () => {
      const xcStops = getElevationColorStops('XContest');
      expect(xcStops[0]).toBe(0);
      expect(xcStops[1]).toBe('#6aa050');
      expect(xcStops[xcStops.length - 2]).toBe(6500);
      expect(xcStops[xcStops.length - 1]).toBe('#c7c7ff');
    });

    it('returns appropriate contour color by terrain profile', () => {
      expect(getContourColor('Dark')).toBe('#c0c0c0');
      expect(getContourColor('DarkShading')).toBe('#ffffff');
      expect(getContourColor('Light')).toBe('#403020');
      expect(getContourColor('XContest')).toBe('#403020');
    });
  });

  describe('Decompiled VTM XML Theme Specifications', () => {
    it('defines all 17 XCTrack theme specifications', () => {
      const expectedThemes = [
        'None',
        'ClearpilotForest',
        'ClearpilotForestBig',
        'ClearpilotForestDark',
        'ClearpilotForestDarkBig',
        'Clearpilot',
        'ClearpilotDark',
        'Lightpilot',
        'Hyperpilot',
        'HyperpilotBlack',
        'Frenchkiss',
        'VtmDefault',
        'Newtron',
        'Osmagray',
        'Osmarender',
        'Tronrender',
        'Custom',
      ];
      for (const id of expectedThemes) {
        expect(XCTRACK_VTM_SPECS[id]).toBeDefined();
        expect(getVtmThemeSpec(id).id).toBe(id);
      }
    });

    it('extracts real colors for Hyperpilot and HyperpilotBlack', () => {
      const hyper = getVtmThemeSpec('Hyperpilot');
      expect(hyper.background).toBe('#ffffff');
      expect(hyper.water.fill).toBe('#99badf');
      expect(hyper.roads.motorway.color).toBe('#e97446');
      expect(hyper.roads.primary.color).toBe('#e8af5f');
      expect(hyper.roads.secondary.color).toBe('#ebdeaa');

      const black = getVtmThemeSpec('HyperpilotBlack');
      expect(black.background).toBe('#000000');
      expect(black.water.fill).toBe('#05356b');
      expect(black.roads.motorway.color).toBe('#7c2706');
      expect(black.roads.primary.color).toBe('#915808');
      expect(black.roads.secondary.color).toBe('#846a03');
    });

    it('extracts real colors for Frenchkiss', () => {
      const fk = getVtmThemeSpec('Frenchkiss');
      expect(fk.background).toBe('#ebebeb');
      expect(fk.water.fill).toBe('#b3d9fe');
      expect(fk.forest.fill).toBe('#ccfcb4');
      expect(fk.roads.motorway.color).toBe('#ff0000');
      expect(fk.roads.primary.color).toBe('#ff0000');
      expect(fk.roads.secondary.color).toBe('#ff994c');
    });

    it('extracts real colors for ClearpilotForest vs ClearpilotForestDark', () => {
      const forest = getVtmThemeSpec('ClearpilotForest');
      expect(forest.forest.fill).toBe('rgba(0, 96, 32, 0.106)');
      expect(forest.water.fill).toBe('#406684');

      const dark = getVtmThemeSpec('ClearpilotForestDark');
      expect(dark.forest.fill).toBe('rgba(0, 155, 186, 0.188)');
      expect(dark.water.fill).toBe('#78c7ff');
      expect(dark.roads.motorway.color).toBe('#a005fa');
    });

    it('handles Clearpilot transparent forest variation', () => {
      const clear = getVtmThemeSpec('Clearpilot');
      expect(clear.forest.fill).toBe('transparent');
    });
  });

  describe('MapLibre GL Layer Generation', () => {
    it('generates base background, water, and contour layers', () => {
      const layers = buildMapLibreLayersForTheme('Hyperpilot', 'None', { hasRoads: true });
      const layerIds = layers.map((l: any) => l.id);
      expect(layerIds).toContain('background');
      expect(layerIds).toContain('water-fill');
      expect(layerIds).toContain('waterway-line');
      expect(layerIds).toContain('contour-lines');
      expect(layerIds).toContain('place-labels');
      expect(layerIds).toContain('highway-motorway');
    });

    it('includes color-relief and hillshade layers when terrain relief is enabled', () => {
      const layers = buildMapLibreLayersForTheme('ClearpilotForest', 'XContest', { hasRoads: true });
      const layerIds = layers.map((l: any) => l.id);
      expect(layerIds).toContain('color-relief');
      expect(layerIds).toContain('hillshade');
      expect(layerIds).toContain('landcover-forest');
    });

    it('omits road layers when hasRoads is false or theme is None', () => {
      const noneLayers = buildMapLibreLayersForTheme('None', 'XContest', { hasRoads: false });
      const noneIds = noneLayers.map((l: any) => l.id);
      expect(noneIds).not.toContain('highway-motorway');
      expect(noneIds).not.toContain('highway-primary');
      expect(noneIds).not.toContain('highway-secondary');
      expect(noneIds).toContain('color-relief');
    });
  });
});
