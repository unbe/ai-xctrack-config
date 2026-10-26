/**
 * XCTrack Page Templates and Navigation Types
 *
 * Source:
 * - org.xcontest.XCTrack.widget.wp.* (registered in vm.b)
 * - res/raw/layout_*.json (bundled raw default layouts)
 * - org.xcontest.XCTrack.navig.* (navigation task types)
 */

export interface WidgetLayoutItem {
  CLASS: string;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  _border?: boolean;
  _bg?: number;
  _theme?: string;
  [key: string]: unknown;
}

export interface NavigationType {
  className: string;
  shortName: string;
  name: string;
  description: string;
}

export interface PageTemplate {
  className: string;
  shortName: string;
  title: string;
  description: string;
  defaultNavigations: string[] | 'all' | 'none';
  defaultLayout: {
    portrait: WidgetLayoutItem[];
    landscape: WidgetLayoutItem[];
  };
}

/**
 * All 4 XCTrack Navigation / Task Types
 */
export const NAVIGATION_TYPES: NavigationType[] = [
  {
    className: 'org.xcontest.XCTrack.navig.TaskBackToTakeoff',
    shortName: 'TaskBackToTakeoff',
    name: 'Back to takeoff',
    description: 'Simple navigation back to the detected takeoff point',
  },
  {
    className: 'org.xcontest.XCTrack.navig.TaskTriangleClosing',
    shortName: 'TaskTriangleClosing',
    name: 'Triangle closing',
    description: 'Navigation to close an FAI or Flat triangle on XC flights',
  },
  {
    className: 'org.xcontest.XCTrack.navig.TaskToWaypoint',
    shortName: 'TaskToWaypoint',
    name: 'Waypoints / XC Navigation',
    description: 'Route/waypoint navigation (ordered list of waypoints)',
  },
  {
    className: 'org.xcontest.XCTrack.navig.TaskCompetition',
    shortName: 'TaskCompetition',
    name: 'Competition task',
    description: 'Competition task navigation (SSS, turnpoints, ESS, Goal, start gates)',
  },
];

export const TASK_BACK_TO_TAKEOFF = NAVIGATION_TYPES[0];
export const TASK_TRIANGLE_CLOSING = NAVIGATION_TYPES[1];
export const TASK_TO_WAYPOINT = NAVIGATION_TYPES[2];
export const TASK_COMPETITION = NAVIGATION_TYPES[3];

/**
 * 1. XC Assistant Page Template
 */
export const WPXCAssistant: PageTemplate = {
  className: 'org.xcontest.XCTrack.widget.wp.WPXCAssistant',
  shortName: 'WPXCAssistant',
  title: 'XC Assistant',
  description: 'FAI Assistant & XC routes',
  defaultNavigations: [
    'org.xcontest.XCTrack.navig.TaskBackToTakeoff',
    'org.xcontest.XCTrack.navig.TaskTriangleClosing',
    'org.xcontest.XCTrack.navig.TaskToWaypoint',
  ],
  defaultLayout: {
    portrait: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WXCAssistant",
        "X1": 0,
        "Y1": 3226,
        "X2": 10000,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapWidget_scale": {
            "value": 26,
            "auto": false
        },
        "mapWidget_drawScale": true,
        "mapWidget_mapAppearance": {
            "theme": "Lightpilot",
            "terrain": "LightShading"
        },
        "mapWidget_showAirspaces": true,
        "wpt_showWaypoints": false,
        "wpt_showCities": false,
        "wpt_showTakeoffs": false,
        "nav_target": "OPTIMIZED",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": true,
        "nav_showSun": true,
        "line_thickness": 10,
        "routes": true,
        "faiAreas": true,
        "faiAreasMinMax": true,
        "legDistance": false,
        "legPercentage": false,
        "closingCircle": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WOptiResult",
        "X1": 0,
        "Y1": 1290,
        "X2": 3684,
        "Y2": 2258,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 0,
        "Y1": 323,
        "X2": 3684,
        "Y2": 1290,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 10000,
        "Y2": 323,
        "_border": false,
        "_bg": 100,
        "showTime": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAirspaceProximity",
        "X1": 3684,
        "Y1": 323,
        "X2": 10000,
        "Y2": 3226,
        "_border": true,
        "_bg": 60,
        "maxDistance": 5000,
        "_shownearinside": true,
        "_showoriginalheightline": true,
        "_showrecomputedheightline": false,
        "_splitdirection": "HORIZONTAL",
        "postponedFloorLimit": 2500,
        "postponedDisplayDistance": 300
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WOptiUnfinishedTriangle",
        "X1": 0,
        "Y1": 2258,
        "X2": 3684,
        "Y2": 3226,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    }
],
    landscape: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WXCAssistant",
        "X1": 2727,
        "Y1": 0,
        "X2": 10000,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapWidget_scale": {
            "value": 26,
            "auto": false
        },
        "mapWidget_drawScale": true,
        "mapWidget_mapAppearance": {
            "theme": "Lightpilot",
            "terrain": "LightShading"
        },
        "mapWidget_showAirspaces": true,
        "wpt_showWaypoints": false,
        "wpt_showCities": false,
        "wpt_showTakeoffs": false,
        "nav_target": "OPTIMIZED",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": true,
        "nav_showSun": true,
        "line_thickness": 10,
        "routes": true,
        "faiAreas": true,
        "faiAreasMinMax": true,
        "legDistance": false,
        "legPercentage": false,
        "closingCircle": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
        "X1": 0,
        "Y1": 526,
        "X2": 2727,
        "Y2": 4737,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapScale": {
            "value": 34,
            "auto": false
        },
        "drawScale": false,
        "interval": 300,
        "drawCircle": false,
        "includeWindAlgorithm": "ALGO_CLASSIC",
        "nav_target": "NONE",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": false,
        "nav_showSun": false,
        "line_thickness": 10
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WXCAssistant",
        "X1": 0,
        "Y1": 5789,
        "X2": 2727,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapWidget_scale": {
            "value": 29,
            "auto": false
        },
        "mapWidget_drawScale": true,
        "mapWidget_mapAppearance": {
            "theme": "None",
            "terrain": "Light"
        },
        "mapWidget_showAirspaces": true,
        "wpt_showWaypoints": false,
        "wpt_showCities": false,
        "wpt_showTakeoffs": false,
        "nav_target": "NONE",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": false,
        "nav_showSun": false,
        "line_thickness": 10,
        "routes": true,
        "faiAreas": true,
        "faiAreasMinMax": false,
        "legDistance": false,
        "legPercentage": false,
        "closingCircle": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 2727,
        "Y2": 526,
        "_border": false,
        "_bg": 100,
        "showTime": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WOptiResult",
        "X1": 0,
        "Y1": 4211,
        "X2": 1212,
        "Y2": 4737,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WSpeed",
        "X1": 0,
        "Y1": 4737,
        "X2": 909,
        "Y2": 5789,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 1818,
        "Y1": 4737,
        "X2": 2727,
        "Y2": 5789,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WGlide",
        "X1": 909,
        "Y1": 4737,
        "X2": 1818,
        "Y2": 5789,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "showVario": true,
        "avg": 4000,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WTime",
        "X1": 0,
        "Y1": 526,
        "X2": 1212,
        "Y2": 1053,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "showSec": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAltGain",
        "X1": 2121,
        "Y1": 4211,
        "X2": 2727,
        "Y2": 4737,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "_unit": true
    }
],
  },
};

/**
 * 2. Thermal Assistant Page Template
 */
export const WPThermalAssistant: PageTemplate = {
  className: 'org.xcontest.XCTrack.widget.wp.WPThermalAssistant',
  shortName: 'WPThermalAssistant',
  title: 'Thermal Assistant',
  description: 'Thermal Assistant',
  defaultNavigations: 'all',
  defaultLayout: {
    portrait: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
        "X1": 526,
        "Y1": 3226,
        "X2": 10000,
        "Y2": 9032,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapScale": {
            "value": 35,
            "auto": false
        },
        "drawScale": true,
        "interval": 300,
        "drawCircle": true,
        "includeWindAlgorithm": "ALGO_CLASSIC",
        "nav_target": "OPTIMIZED",
        "nav_use_brackets": true,
        "thermals": 2,
        "nav_showWind": true,
        "nav_showSun": false,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 0,
        "Y1": 1935,
        "X2": 3158,
        "Y2": 3226,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 10000,
        "Y2": 323,
        "_border": false,
        "_bg": 100,
        "showTime": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAltGain",
        "X1": 3158,
        "Y1": 9032,
        "X2": 6842,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WSpeed",
        "X1": 0,
        "Y1": 323,
        "X2": 3158,
        "Y2": 1935,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitudeAboveGround",
        "X1": 6842,
        "Y1": 1935,
        "X2": 10000,
        "Y2": 3226,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompass",
        "X1": 3158,
        "Y1": 323,
        "X2": 6842,
        "Y2": 2581,
        "_border": false,
        "_bg": 100,
        "rotation": "HEADING",
        "navigation_target": "NONE",
        "showWind": true,
        "showHeading": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAirTime",
        "X1": 3158,
        "Y1": 2581,
        "X2": 6842,
        "Y2": 3226,
        "_border": true,
        "_bg": 100,
        "_title": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WVarioColumn",
        "X1": 0,
        "Y1": 3226,
        "X2": 526,
        "Y2": 9032,
        "_border": true,
        "_bg": 100,
        "avg": 2000
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WVerticalSpeed",
        "X1": 0,
        "Y1": 9032,
        "X2": 3158,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "avg": 2000
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WGlide",
        "X1": 6842,
        "Y1": 9032,
        "X2": 10000,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "showVario": false,
        "avg": 8000,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAirspaceProximity",
        "X1": 6842,
        "Y1": 7742,
        "X2": 10000,
        "Y2": 9032,
        "_border": false,
        "_bg": 100,
        "maxDistance": 5000,
        "_shownearinside": false,
        "_showoriginalheightline": false,
        "_showrecomputedheightline": false,
        "_splitdirection": "AUTO",
        "postponedFloorLimit": 2500,
        "postponedDisplayDistance": 300
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WWindSpeed",
        "X1": 6842,
        "Y1": 323,
        "X2": 10000,
        "Y2": 1935,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true
    }
],
    landscape: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
        "X1": 3333,
        "Y1": 0,
        "X2": 10000,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": true
        },
        "mapScale": {
            "value": 34,
            "auto": false
        },
        "drawScale": true,
        "interval": 480,
        "drawCircle": false,
        "includeWindAlgorithm": "ALGO_CLASSIC",
        "nav_target": "NONE",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": true,
        "nav_showSun": true,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 3333,
        "Y2": 526,
        "_border": false,
        "_bg": 100,
        "showTime": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WTime",
        "X1": 0,
        "Y1": 526,
        "X2": 1212,
        "Y2": 1053,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "showSec": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
        "X1": 0,
        "Y1": 2105,
        "X2": 3333,
        "Y2": 8947,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapScale": {
            "value": 26,
            "auto": false
        },
        "drawScale": true,
        "interval": 1200,
        "drawCircle": false,
        "includeWindAlgorithm": "ALGO_CLASSIC",
        "nav_target": "NONE",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": false,
        "nav_showSun": false,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WSpeed",
        "X1": 1212,
        "Y1": 526,
        "X2": 2121,
        "Y2": 1053,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WGlide",
        "X1": 2121,
        "Y1": 526,
        "X2": 3333,
        "Y2": 1053,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "showVario": false,
        "avg": 2000,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 0,
        "Y1": 1053,
        "X2": 1212,
        "Y2": 2105,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAltGain",
        "X1": 2121,
        "Y1": 1053,
        "X2": 3333,
        "Y2": 2105,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WVerticalSpeed",
        "X1": 1212,
        "Y1": 1053,
        "X2": 2121,
        "Y2": 2105,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "avg": 2000
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WOptiResult",
        "X1": 0,
        "Y1": 8947,
        "X2": 1212,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "_title": false,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompGlideToGoal",
        "X1": 2424,
        "Y1": 8947,
        "X2": 3333,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompDistanceToGoal",
        "X1": 1212,
        "Y1": 8947,
        "X2": 2424,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    }
],
  },
};

/**
 * 3. Competition Page Template
 */
export const WPCompetition: PageTemplate = {
  className: 'org.xcontest.XCTrack.widget.wp.WPCompetition',
  shortName: 'WPCompetition',
  title: 'Competition',
  description: 'Competition navigation',
  defaultNavigations: [
    'org.xcontest.XCTrack.navig.TaskCompetition',
  ],
  defaultLayout: {
    portrait: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompMap",
        "X1": 0,
        "Y1": 1290,
        "X2": 10000,
        "Y2": 9032,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapWidget_scale": {
            "value": 26,
            "auto": true
        },
        "mapWidget_drawScale": true,
        "mapWidget_mapAppearance": {
            "theme": "Lightpilot",
            "terrain": "LightShading"
        },
        "mapWidget_showAirspaces": true,
        "wpt_showWaypoints": true,
        "wpt_showCities": false,
        "wpt_showTakeoffs": false,
        "nav_target": "OPTIMIZED",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": true,
        "nav_showSun": true,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 10000,
        "Y2": 323,
        "_border": false,
        "_bg": 100,
        "showTime": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompTimeToStart",
        "X1": 7895,
        "Y1": 1290,
        "X2": 10000,
        "Y2": 2258,
        "_border": false,
        "_bg": 100,
        "_title": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompTimeAtStart",
        "X1": 7895,
        "Y1": 2258,
        "X2": 10000,
        "Y2": 3548,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": true,
        "speed_type": "GROUND",
        "speed_avg": 10000,
        "time_format": "COMPACT"
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompDistanceToGoal",
        "X1": 0,
        "Y1": 9032,
        "X2": 3684,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompAltitudeOverGoal",
        "X1": 6316,
        "Y1": 9032,
        "X2": 10000,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompGlideToGoal",
        "X1": 3684,
        "Y1": 9032,
        "X2": 6316,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 0,
        "Y1": 323,
        "X2": 2632,
        "Y2": 1290,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WNextTurnpointAlt",
        "X1": 2632,
        "Y1": 323,
        "X2": 5263,
        "Y2": 1290,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": false,
        "speed_type": "GROUND",
        "speed_avg": 8000,
        "altitude": "AMSL"
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WNextTurnpointTimeOfArrival",
        "X1": 7895,
        "Y1": 323,
        "X2": 10000,
        "Y2": 1290,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": false,
        "speed_type": "GROUND",
        "speed_avg": 8000,
        "time_format": "COMPACT"
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WNextTurnpointGlideTo",
        "X1": 5263,
        "Y1": 323,
        "X2": 7895,
        "Y2": 1290,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": false,
        "alt_above": 600,
        "headless": false
    }
],
    landscape: [
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompMap",
        "X1": 2727,
        "Y1": 0,
        "X2": 10000,
        "Y2": 10000,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapWidget_scale": {
            "value": 26,
            "auto": true
        },
        "mapWidget_drawScale": true,
        "mapWidget_mapAppearance": {
            "theme": "Lightpilot",
            "terrain": "LightShading"
        },
        "mapWidget_showAirspaces": true,
        "wpt_showWaypoints": false,
        "wpt_showCities": false,
        "wpt_showTakeoffs": false,
        "nav_target": "OPTIMIZED",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": true,
        "nav_showSun": true,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompTaskSummary",
        "X1": 0,
        "Y1": 6316,
        "X2": 1818,
        "Y2": 10000,
        "_border": false,
        "_bg": 0
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
        "X1": 0,
        "Y1": 526,
        "X2": 2727,
        "Y2": 5263,
        "_border": true,
        "_bg": 100,
        "rotation": {
            "value": "NORTH_AT_TOP",
            "showCompass": false
        },
        "mapScale": {
            "value": 31,
            "auto": false
        },
        "drawScale": false,
        "interval": 300,
        "drawCircle": false,
        "includeWindAlgorithm": "ALGO_CLASSIC",
        "nav_target": "NONE",
        "nav_use_brackets": true,
        "thermals": 0,
        "nav_showWind": false,
        "nav_showSun": false,
        "line_thickness": 20
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WStatusLine",
        "X1": 0,
        "Y1": 0,
        "X2": 2727,
        "Y2": 526,
        "_border": false,
        "_bg": 100,
        "showTime": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WTime",
        "X1": 0,
        "Y1": 526,
        "X2": 1212,
        "Y2": 1053,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "showSec": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompTimeToStart",
        "X1": 8788,
        "Y1": 0,
        "X2": 10000,
        "Y2": 526,
        "_border": false,
        "_bg": 100,
        "_title": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompTimeAtStart",
        "X1": 8788,
        "Y1": 526,
        "X2": 10000,
        "Y2": 2632,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": true,
        "speed_type": "GROUND",
        "speed_avg": 0,
        "time_format": "COMPACT"
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompDistanceToGoal",
        "X1": 1818,
        "Y1": 6842,
        "X2": 2727,
        "Y2": 7895,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompAltitudeOverGoal",
        "X1": 1818,
        "Y1": 8947,
        "X2": 2727,
        "Y2": 10000,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompGlideToGoal",
        "X1": 1818,
        "Y1": 7895,
        "X2": 2727,
        "Y2": 8947,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WGlide",
        "X1": 909,
        "Y1": 5263,
        "X2": 1818,
        "Y2": 6316,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "showVario": true,
        "avg": 2000,
        "headless": false
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WSpeed",
        "X1": 0,
        "Y1": 5263,
        "X2": 909,
        "Y2": 6316,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WAltitude",
        "X1": 1818,
        "Y1": 5263,
        "X2": 2727,
        "Y2": 6316,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WThermalAltGain",
        "X1": 1818,
        "Y1": 4737,
        "X2": 2727,
        "Y2": 5263,
        "_border": false,
        "_bg": 100,
        "_title": false,
        "_unit": true
    },
    {
        "CLASS": "org.xcontest.XCTrack.widget.w.WCompSpeedToStart",
        "X1": 7273,
        "Y1": 526,
        "X2": 8788,
        "Y2": 2632,
        "_border": false,
        "_bg": 100,
        "_title": true,
        "_unit": true,
        "navigation_target": "OPTIMIZED",
        "use_brackets": true
    }
],
  },
};

/**
 * 4. Empty Page Template
 */
export const WPEmpty: PageTemplate = {
  className: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
  shortName: 'WPEmpty',
  title: 'Empty',
  description: 'Empty page for your custom widget set',
  defaultNavigations: 'all',
  defaultLayout: {
    portrait: [],
    landscape: [],
  },
};

/**
 * All Page Templates
 */
export const PAGE_TEMPLATES: PageTemplate[] = [
  WPXCAssistant,
  WPThermalAssistant,
  WPCompetition,
  WPEmpty,
];

/**
 * Get Page Template by full class name or short name
 */
export function getPageTemplate(classNameOrShortName: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find(
    (t) => t.className === classNameOrShortName || t.shortName === classNameOrShortName
  );
}

/**
 * Get Navigation Type definition by class name or short name
 */
export function getNavigationType(classNameOrShortName: string): NavigationType | undefined {
  return NAVIGATION_TYPES.find(
    (n) => n.className === classNameOrShortName || n.shortName === classNameOrShortName
  );
}

/**
 * Creates a new Page object clone from a template for the specified orientation
 */
export function createPageFromTemplate(
  templateClassName: string,
  orientation: 'portrait' | 'landscape' = 'portrait'
): {
  CLASS: string;
  navigations: string[] | 'all' | 'none';
  widgets: WidgetLayoutItem[];
} {
  const template = getPageTemplate(templateClassName) ?? WPEmpty;
  return {
    CLASS: template.className,
    navigations: Array.isArray(template.defaultNavigations)
      ? [...template.defaultNavigations]
      : template.defaultNavigations,
    widgets: JSON.parse(JSON.stringify(template.defaultLayout[orientation])),
  };
}
