import { describe, it, expect } from 'vitest';
import { computeSemanticDiff } from '../utils/diffEngine';
import { XcfgFile } from '../types/xcfg';

describe('computeSemanticDiff Widget Comparisons', () => {
  const baseConfig: XcfgFile = {
    info: {
      device: 'Google Pixel 8 Pro',
      exportType: 'pages',
      versionCode: 91260,
      versionName: '0.9.12.6',
      timeCreated: '2026-03-12 19:44:33+0100',
      proUpTo: 0,
    },
    layout: {
      portrait: [
        {
          CLASS: 'org.xcontest.XCTrack.widget.wp.WPXCAssistant',
          navigations: 'all',
          widgets: [
            {
              CLASS: 'org.xcontest.XCTrack.widget.w.WAltitudeSea',
              X1: 0,
              Y1: 0,
              X2: 5000,
              Y2: 2000,
              _title: true,
              titletext: 'Alt Sea',
              _bg: 100,
            },
          ],
        },
      ],
      landscape: [],
    },
  };

  it('detects widget geometry changes (position and size)', () => {
    const modified: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    modified.layout.portrait[0].widgets[0].X1 = 1000;
    modified.layout.portrait[0].widgets[0].X2 = 6000;

    const changes = computeSemanticDiff(baseConfig, modified);
    const geomChange = changes.find((c) => c.path === 'layout.portrait[0].widgets[0].geometry');

    expect(geomChange).toBeDefined();
    expect(geomChange?.type).toBe('modified');
    expect(geomChange?.category).toBe('layout');
    expect(geomChange?.oldValue).toBe('(0, 0) - (5000, 2000)');
    expect(geomChange?.newValue).toBe('(1000, 0) - (6000, 2000)');
    expect(geomChange?.description).toContain('Alt Sea');
  });

  it('detects widget property modifications', () => {
    const modified: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    modified.layout.portrait[0].widgets[0].titletext = 'Custom Altitude';
    modified.layout.portrait[0].widgets[0]._bg = 50;

    const changes = computeSemanticDiff(baseConfig, modified);

    const titleChange = changes.find((c) => c.path === 'layout.portrait[0].widgets[0].titletext');
    expect(titleChange).toBeDefined();
    expect(titleChange?.type).toBe('modified');
    expect(titleChange?.oldValue).toBe('Alt Sea');
    expect(titleChange?.newValue).toBe('Custom Altitude');

    const bgChange = changes.find((c) => c.path === 'layout.portrait[0].widgets[0]._bg');
    expect(bgChange).toBeDefined();
    expect(bgChange?.type).toBe('modified');
    expect(bgChange?.oldValue).toBe('100');
    expect(bgChange?.newValue).toBe('50');
  });

  it('detects widget property additions', () => {
    const modified: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    (modified.layout.portrait[0].widgets[0] as any)._border = true;
    (modified.layout.portrait[0].widgets[0] as any).customProp = 'myValue';

    const changes = computeSemanticDiff(baseConfig, modified);

    const borderChange = changes.find((c) => c.path === 'layout.portrait[0].widgets[0]._border');
    expect(borderChange).toBeDefined();
    expect(borderChange?.type).toBe('added');
    expect(borderChange?.newValue).toBe('true');

    const customChange = changes.find((c) => c.path === 'layout.portrait[0].widgets[0].customProp');
    expect(customChange).toBeDefined();
    expect(customChange?.type).toBe('added');
    expect(customChange?.newValue).toBe('myValue');
  });

  it('detects widget property removals', () => {
    const modified: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    delete (modified.layout.portrait[0].widgets[0] as any).titletext;

    const changes = computeSemanticDiff(baseConfig, modified);

    const titleRemoved = changes.find((c) => c.path === 'layout.portrait[0].widgets[0].titletext');
    expect(titleRemoved).toBeDefined();
    expect(titleRemoved?.type).toBe('removed');
    expect(titleRemoved?.oldValue).toBe('Alt Sea');
  });

  it('ignores grid coordinates (gridX1, gridY1, etc.) in property comparison', () => {
    const origWithGrid: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    (origWithGrid.layout.portrait[0].widgets[0] as any).gridX1 = 0;
    (origWithGrid.layout.portrait[0].widgets[0] as any).gridX2 = 10;

    const currWithGrid: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    (currWithGrid.layout.portrait[0].widgets[0] as any).gridX1 = 2;
    (currWithGrid.layout.portrait[0].widgets[0] as any).gridX2 = 12;

    const changes = computeSemanticDiff(origWithGrid, currWithGrid);
    const gridChanges = changes.filter((c) => c.path.includes('grid'));
    expect(gridChanges.length).toBe(0);
  });

  it('detects widget additions on a page', () => {
    const modified: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    modified.layout.portrait[0].widgets.push({
      CLASS: 'org.xcontest.XCTrack.widget.w.WSpeedGround',
      X1: 5000,
      Y1: 0,
      X2: 10000,
      Y2: 2000,
      titletext: 'Ground Speed',
    });

    const changes = computeSemanticDiff(baseConfig, modified);

    const addedWidget = changes.find((c) => c.path === 'layout.portrait[0].widgets[1]');
    expect(addedWidget).toBeDefined();
    expect(addedWidget?.type).toBe('added');
    expect(addedWidget?.description).toContain('Ground Speed');
    expect(addedWidget?.newValue).toBe('WSpeedGround');
  });

  it('detects widget removals from a page', () => {
    const withTwoWidgets: XcfgFile = JSON.parse(JSON.stringify(baseConfig));
    withTwoWidgets.layout.portrait[0].widgets.push({
      CLASS: 'org.xcontest.XCTrack.widget.w.WSpeedGround',
      X1: 5000,
      Y1: 0,
      X2: 10000,
      Y2: 2000,
      titletext: 'Ground Speed',
    });

    const changes = computeSemanticDiff(withTwoWidgets, baseConfig);

    const removedWidget = changes.find((c) => c.path === 'layout.portrait[0].widgets[1]');
    expect(removedWidget).toBeDefined();
    expect(removedWidget?.type).toBe('removed');
    expect(removedWidget?.description).toContain('Ground Speed');
    expect(removedWidget?.oldValue).toBe('WSpeedGround');
  });
});
