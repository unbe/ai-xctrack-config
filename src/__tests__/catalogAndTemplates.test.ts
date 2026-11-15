import { describe, it, expect } from 'vitest';
import {
  WIDGET_CATALOG,
  WIDGET_CATEGORIES,
  getWidgetDefinition,
  getWidgetsByCategory,
  searchWidgets,
  WidgetCategory,
} from '../data/widgets-catalog';
import {
  PAGE_TEMPLATES,
  NAVIGATION_TYPES,
  WPXCAssistant,
  WPThermalAssistant,
  WPCompetition,
  WPEmpty,
  getNavigationType,
  createPageFromTemplate,
} from '../data/page-templates';

describe('widgets-catalog', () => {
  it('exports exactly 85 registered widget classes', () => {
    expect(WIDGET_CATALOG).toHaveLength(85);
  });

  it('covers all 11 categories with the exact expected counts', () => {
    expect(WIDGET_CATEGORIES).toHaveLength(11);
    const byCategory = getWidgetsByCategory();

    const expectedCounts: Record<WidgetCategory, number> = {
      System: 3,
      Flying: 21,
      Air: 8,
      XContest: 5,
      Navigation: 11,
      Competition: 12,
      Livetracking: 1,
      'Action Buttons': 9,
      Others: 4,
      Testing: 3,
      Debug: 8,
    };

    let total = 0;
    for (const [cat, count] of Object.entries(expectedCounts)) {
      const categoryWidgets = byCategory[cat as WidgetCategory];
      expect(categoryWidgets, `Category ${cat} count mismatch`).toHaveLength(count);
      total += count;
    }
    expect(total).toBe(85);
  });

  it('validates required fields on every widget definition', () => {
    const classNames = new Set<string>();

    for (const w of WIDGET_CATALOG) {
      expect(w.className).toMatch(/^org\.xcontest\.XCTrack\.widget\.w\.W[A-Za-z0-9]+$/);
      expect(w.shortName).toBe(w.className.replace('org.xcontest.XCTrack.widget.w.', ''));
      expect(w.title.trim().length).toBeGreaterThan(0);
      expect(w.description.trim().length).toBeGreaterThan(0);
      expect(w.defaultGrid.width).toBeGreaterThan(0);
      expect(w.defaultGrid.height).toBeGreaterThan(0);
      expect(typeof w.isPro).toBe('boolean');
      expect(Array.isArray(w.properties)).toBe(true);
      expect(w.properties.length).toBeGreaterThanOrEqual(3); // At least _border, _bg, _theme

      // Common properties check
      const keys = w.properties.map((p) => p.key);
      expect(keys).toContain('_border');
      expect(keys).toContain('_bg');
      expect(keys).toContain('_theme');

      // Check _bg transparency semantics (default 100 or 80 for buttons, range 0..100)
      const bgProp = w.properties.find((p) => p.key === '_bg');
      expect(bgProp).toBeDefined();
      expect(bgProp?.min).toBe(0);
      expect(bgProp?.max).toBe(100);

      classNames.add(w.className);
    }

    expect(classNames.size).toBe(85);
  });

  it('identifies the 14 Pro widgets accurately', () => {
    const proWidgets = WIDGET_CATALOG.filter((w) => w.isPro).map((w) => w.shortName);
    const expectedPro = [
      'WBrightnessInfo',
      'WSunset',
      'WSunsetCivil',
      'WAltitudeMaximum',
      'WAltitudeDataGraph',
      'WCompDistanceToESS',
      'WCompAltitudeOverESS',
      'WCompGlideToESS',
      'WCompPercentage',
      'WButtonBrightness',
      'WButtonIntentLauncher',
      'WWebView',
      'WOptiUnfinishedFAIPotential',
      'WProFallback',
    ];

    expect(proWidgets.sort()).toEqual(expectedPro.sort());
  });

  it('resolves widgets by canonical name, short name, and legacy aliases', () => {
    // Canonical name
    const alt = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WAltitude');
    expect(alt).toBeDefined();
    expect(alt?.title).toBe('GPS Alt');

    // Short name
    const speed = getWidgetDefinition('WSpeed');
    expect(speed).toBeDefined();
    expect(speed?.title).toBe('Speed');

    // Aliases
    const varioButton1 = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WButtonSilenceVario');
    expect(varioButton1).toBeDefined();
    expect(varioButton1?.shortName).toBe('WButtonVario');

    const varioButton2 = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WButtonActionSilence');
    expect(varioButton2).toBeDefined();
    expect(varioButton2?.shortName).toBe('WButtonVario');

    const zoomButton = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WButtonActionZoom');
    expect(zoomButton?.shortName).toBe('WButtonZoom');

    const compPercentage = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WCompSSPercentage');
    expect(compPercentage?.shortName).toBe('WCompPercentage');

    const compGlideEss = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WCompGlideToEss');
    expect(compGlideEss?.shortName).toBe('WCompGlideToESS');

    const altMax = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WAltitudeMax');
    expect(altMax?.shortName).toBe('WAltitudeMaximum');

    const compassDigit = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WCompassDigit');
    expect(compassDigit?.shortName).toBe('WCompassDigital');

    const fl = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WFlightLevel');
    expect(fl?.shortName).toBe('WFL');

    const externalData = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WOpenData');
    expect(externalData?.shortName).toBe('WExternalData');

    const activeLook = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WActiveLook');
    expect(activeLook?.shortName).toBe('WDebugActivelook');

    const debugFps = getWidgetDefinition('org.xcontest.XCTrack.widget.w.WDebugFps');
    expect(debugFps?.shortName).toBe('WDebugFPS');
  });

  it('searches widgets by query string', () => {
    const thermalResults = searchWidgets('thermal');
    expect(thermalResults.length).toBeGreaterThan(0);
    expect(thermalResults.some((w) => w.shortName === 'WThermalAssistant')).toBe(true);

    const varioResults = searchWidgets('vario');
    expect(varioResults.length).toBeGreaterThan(0);

    const emptyResults = searchWidgets('nonexistentXYZ123');
    expect(emptyResults).toHaveLength(0);
  });
});

describe('page-templates', () => {
  it('exports all 4 page templates', () => {
    expect(PAGE_TEMPLATES).toHaveLength(4);
    expect(WPXCAssistant.shortName).toBe('WPXCAssistant');
    expect(WPThermalAssistant.shortName).toBe('WPThermalAssistant');
    expect(WPCompetition.shortName).toBe('WPCompetition');
    expect(WPEmpty.shortName).toBe('WPEmpty');
  });

  it('contains the exact raw layout widget counts for portrait and landscape', () => {
    // Competition: 11 portrait, 15 landscape
    expect(WPCompetition.defaultLayout.portrait).toHaveLength(11);
    expect(WPCompetition.defaultLayout.landscape).toHaveLength(15);

    // Thermal Assistant: 13 portrait, 12 landscape
    expect(WPThermalAssistant.defaultLayout.portrait).toHaveLength(13);
    expect(WPThermalAssistant.defaultLayout.landscape).toHaveLength(12);

    // XC Assistant: 6 portrait, 10 landscape
    expect(WPXCAssistant.defaultLayout.portrait).toHaveLength(6);
    expect(WPXCAssistant.defaultLayout.landscape).toHaveLength(10);

    // Empty: 0 portrait, 0 landscape
    expect(WPEmpty.defaultLayout.portrait).toHaveLength(0);
    expect(WPEmpty.defaultLayout.landscape).toHaveLength(0);
  });

  it('exports all 5 navigation types with English names', () => {
    expect(NAVIGATION_TYPES).toHaveLength(5);

    const navClassNames = NAVIGATION_TYPES.map((n) => n.className);
    expect(navClassNames).toContain('org.xcontest.XCTrack.navig.TaskBackToTakeoff');
    expect(navClassNames).toContain('org.xcontest.XCTrack.navig.TaskTriangleClosing');
    expect(navClassNames).toContain('org.xcontest.XCTrack.navig.TaskToWaypoint');
    expect(navClassNames).toContain('org.xcontest.XCTrack.navig.TaskCompetition');
    expect(navClassNames).toContain('org.xcontest.XCTrack.navig.TaskToLivePilot');

    const takeoff = getNavigationType('TaskBackToTakeoff');
    expect(takeoff?.name).toBe('Back to takeoff');

    const triangle = getNavigationType('TaskTriangleClosing');
    expect(triangle?.name).toBe('Triangle closing');

    const waypoint = getNavigationType('TaskToWaypoint');
    expect(waypoint?.name).toBe('Waypoints / XC Navigation');

    const comp = getNavigationType('TaskCompetition');
    expect(comp?.name).toBe('Competition task');

    const livePilot = getNavigationType('TaskToLivePilot');
    expect(livePilot?.name).toBe('Navigate to live pilot');
  });

  it('creates page clones from templates without mutating the template', () => {
    const page = createPageFromTemplate('WPXCAssistant', 'portrait');
    expect(page.CLASS).toBe('org.xcontest.XCTrack.widget.wp.WPXCAssistant');
    expect(page.widgets).toHaveLength(6);

    // Mutating the cloned widgets should not affect the template
    page.widgets.push({
      CLASS: 'test',
      X1: 0,
      Y1: 0,
      X2: 1000,
      Y2: 1000,
    });
    expect(WPXCAssistant.defaultLayout.portrait).toHaveLength(6);
  });
});
