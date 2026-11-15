/**
 * Comprehensive XCTrack Widget Catalog (v0.9.10 - 0.9.12.10)
 *
 * Complete definitions for all 85 registered widget classes in `org.xcontest.XCTrack.widget.o`
 * across 11 categories (System, Flying, Air, XContest, Navigation, Competition, Livetracking,
 * Action Buttons, Others, Testing, Debug), plus legacy aliases.
 */

import { WidgetDefinition } from '../types/xcfg';

export type WidgetCategory =
  | 'System'
  | 'Flying'
  | 'Air'
  | 'XContest'
  | 'Navigation'
  | 'Competition'
  | 'Livetracking'
  | 'Action Buttons'
  | 'Others'
  | 'Testing'
  | 'Debug';

export const WIDGET_CATEGORIES: WidgetCategory[] = [
  'System',
  'Flying',
  'Air',
  'XContest',
  'Navigation',
  'Competition',
  'Livetracking',
  'Action Buttons',
  'Others',
  'Testing',
  'Debug',
];

/**
 * All 85 Registered XCTrack Widget Definitions
 */
export const WIDGET_CATALOG: WidgetDefinition[] = [
  {
    "className": "org.xcontest.XCTrack.widget.w.WStatusLine",
    "shortName": "WStatusLine",
    "title": "Status Line",
    "description": "GPS and battery status",
    "category": "System",
    "defaultGrid": {
      "width": 100,
      "height": 1
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "showGps",
        "label": "Show GPS Status",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display GPS fix and satellite status"
      },
      {
        "key": "showSensors",
        "label": "Show Sensors",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display external sensor connection status"
      },
      {
        "key": "showLive",
        "label": "Show Livetracking",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display Livetracking connection icon"
      },
      {
        "key": "showLiveLabel",
        "label": "Show LIVE Label",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display 'LIVE' text next to icon"
      },
      {
        "key": "showBatteryIcon",
        "label": "Show Battery Icon",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display battery icon level"
      },
      {
        "key": "showBatteryPercent",
        "label": "Show Battery Percentage",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display numeric battery percentage"
      },
      {
        "key": "showTime",
        "label": "Show Clock",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display current time in status line"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WBrightnessInfo",
    "shortName": "WBrightnessInfo",
    "title": "Brightness of the display",
    "description": "Shows current brightness of the display. If the brightness is set by XCTrack, the ! suffix is added.",
    "category": "System",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WLastEvent",
    "shortName": "WLastEvent",
    "title": "Last event",
    "description": "Text of last event shown",
    "category": "System",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WTime",
    "shortName": "WTime",
    "title": "Time",
    "description": "Current local time",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "showSec",
        "label": "Show Seconds",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display seconds in time"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WSpeed",
    "shortName": "WSpeed",
    "title": "Speed",
    "description": "Current speed",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "KM_H",
            "label": "km/h"
          },
          {
            "value": "M_S",
            "label": "m/s"
          },
          {
            "value": "MP_H",
            "label": "mph"
          },
          {
            "value": "KT",
            "label": "knots"
          }
        ],
        "description": "Speed measurement unit"
      },
      {
        "key": "backwardDetection",
        "label": "Detect Flying Backwards",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display negative speed when blown backwards by wind"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAirSpeed",
    "shortName": "WAirSpeed",
    "title": "Airspeed",
    "description": "Current airspeed (external or estimated from the current groundspeed and the wind). Choose between true or indicated airspeed. IAS is external only.",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "KM_H",
            "label": "km/h"
          },
          {
            "value": "M_S",
            "label": "m/s"
          },
          {
            "value": "MP_H",
            "label": "mph"
          },
          {
            "value": "KT",
            "label": "knots"
          }
        ],
        "description": "Airspeed measurement unit"
      },
      {
        "key": "_type",
        "label": "Airspeed Type",
        "type": "enum",
        "defaultValue": "TAS",
        "options": [
          {
            "value": "TAS",
            "label": "True Airspeed (TAS)"
          },
          {
            "value": "IAS",
            "label": "Indicated Airspeed (IAS - sensor only)"
          }
        ],
        "description": "Airspeed calculation type"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WBearing",
    "shortName": "WBearing",
    "title": "Bearing",
    "description": "Current bearing",
    "category": "Flying",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "degrees",
        "label": "Show Degrees",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show numerical degrees instead of cardinal letters (N, NE, ...)"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAltitude",
    "shortName": "WAltitude",
    "title": "GPS Alt",
    "description": "Real altitude above sea level as reported by the GPS",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "METER",
            "label": "Meters (m)"
          },
          {
            "value": "FOOT",
            "label": "Feet (ft)"
          }
        ],
        "description": "Altitude measurement unit"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WBaroAltitude",
    "shortName": "WBaroAltitude",
    "title": "Baro Alt",
    "description": "Pressure altitude by QNH (AMSL) or standard pressure",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_altType",
        "label": "Altitude Type",
        "type": "enum",
        "defaultValue": "STD",
        "options": [
          {
            "value": "STD",
            "label": "Standard pressure (1013.25 hPa)"
          },
          {
            "value": "QNH",
            "label": "QNH adjusted"
          }
        ],
        "description": "Barometric pressure reference"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "METER",
            "label": "Meters (m)"
          },
          {
            "value": "FOOT",
            "label": "Feet (ft)"
          }
        ],
        "description": "Altitude measurement unit"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAMSL",
    "shortName": "WAMSL",
    "title": "AMSL",
    "description": "Above mean sea level: barometric altitude according to the current QNH",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "METER",
            "label": "Meters (m)"
          },
          {
            "value": "FOOT",
            "label": "Feet (ft)"
          }
        ],
        "description": "Altitude measurement unit"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WFL",
    "shortName": "WFL",
    "title": "Flight Level",
    "description": "Shows flight level, if pressure sensor is available",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WFlightLevel"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_decimals",
        "label": "Decimals",
        "type": "enum",
        "defaultValue": "DEC_0",
        "options": [
          {
            "value": "DEC_0",
            "label": "FL 100"
          },
          {
            "value": "DEC_1",
            "label": "FL 100.0"
          },
          {
            "value": "DEC_2",
            "label": "FL 100.00"
          }
        ],
        "description": "Number of decimal places"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAltitudeAboveGround",
    "shortName": "WAltitudeAboveGround",
    "title": "AGL",
    "description": "Current GPS altitude above ground",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WTakeoffHeightAbove",
    "shortName": "WTakeoffHeightAbove",
    "title": "Altitude above takeoff",
    "description": "Shows altitude above takeoff",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WVerticalSpeed",
    "shortName": "WVerticalSpeed",
    "title": "Vertical speed",
    "description": "Text version of vario",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "avg",
        "label": "Averaging Interval",
        "type": "number",
        "defaultValue": 2000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Vario integration time"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WVarioColumn",
    "shortName": "WVarioColumn",
    "title": "Vario bar",
    "description": "Current lift/sink indication as colored column",
    "category": "Flying",
    "defaultGrid": {
      "width": 3,
      "height": 100
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "avg",
        "label": "Averaging Interval",
        "type": "number",
        "defaultValue": 2000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Vario bar smoothing time"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WGlide",
    "shortName": "WGlide",
    "title": "Glide Ratio",
    "description": "Current glide ratio",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "avg",
        "label": "Glide Averaging",
        "type": "number",
        "defaultValue": 4000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Glide smoothing time"
      },
      {
        "key": "showVario",
        "label": "Show Vario in Lift",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show vertical climb rate instead of infinite glide in lift"
      },
      {
        "key": "varioAvg",
        "label": "Vario Averaging in Lift",
        "type": "number",
        "defaultValue": 20000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Lift vario smoothing time"
      },
      {
        "key": "headless",
        "label": "Omit '1:' prefix",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show glide number without leading 1:"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WLocation",
    "shortName": "WLocation",
    "title": "Location",
    "description": "WGS-84/UTM coordinates of the current location",
    "category": "Flying",
    "defaultGrid": {
      "width": 5,
      "height": 4
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_format",
        "label": "Coordinate Format",
        "type": "enum",
        "defaultValue": "DEG",
        "options": [
          {
            "value": "DEG",
            "label": "Decimal degrees (50.12345\u00b0)"
          },
          {
            "value": "DEG_MIN",
            "label": "Degrees and minutes (50\u00b007.407')"
          },
          {
            "value": "DEG_MIN_SEC",
            "label": "Degrees, minutes, seconds (50\u00b007'24.4\")"
          },
          {
            "value": "UTM",
            "label": "UTM coordinates"
          }
        ],
        "description": "Coordinate presentation format"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAirTime",
    "shortName": "WAirTime",
    "title": "Air time",
    "description": "Flying time since takeoff",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "time_format",
        "label": "Time Format",
        "type": "enum",
        "defaultValue": "HM",
        "options": [
          {
            "value": "WITH_UNITS",
            "label": "With units (1h23m)"
          },
          {
            "value": "COMPACT",
            "label": "Compact (1:23)"
          },
          {
            "value": "HMS",
            "label": "Hours, minutes, seconds (1:23:45)"
          },
          {
            "value": "HM",
            "label": "Hours and minutes (1:23)"
          }
        ],
        "description": "Flight time display format"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WSunset",
    "shortName": "WSunset",
    "title": "Sunset",
    "description": "Time of sunset",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "relative",
        "label": "Display Mode",
        "type": "enum",
        "defaultValue": "ABSOLUTE_TIME",
        "options": [
          {
            "value": "ABSOLUTE_TIME",
            "label": "Absolute time (sunset clock)"
          },
          {
            "value": "RELATIVE_TIME",
            "label": "Relative time (remaining until sunset)"
          }
        ],
        "description": "Sunset time format"
      },
      {
        "key": "showBefore",
        "label": "Show Widget Before Sunset",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Always"
          },
          {
            "value": 900000,
            "label": "15 min"
          },
          {
            "value": 1800000,
            "label": "30 min"
          },
          {
            "value": 3600000,
            "label": "1 hour"
          },
          {
            "value": 7200000,
            "label": "2 hours"
          }
        ],
        "unit": "ms",
        "description": "Only reveal widget within this duration before sunset"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WSunsetCivil",
    "shortName": "WSunsetCivil",
    "title": "Civil twilight",
    "description": "Time of civil twilight",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "relative",
        "label": "Display Mode",
        "type": "enum",
        "defaultValue": "ABSOLUTE_TIME",
        "options": [
          {
            "value": "ABSOLUTE_TIME",
            "label": "Absolute time"
          },
          {
            "value": "RELATIVE_TIME",
            "label": "Remaining time"
          }
        ],
        "description": "Civil twilight time format"
      },
      {
        "key": "showBefore",
        "label": "Show Widget Before Twilight",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Always"
          },
          {
            "value": 900000,
            "label": "15 min"
          },
          {
            "value": 1800000,
            "label": "30 min"
          },
          {
            "value": 3600000,
            "label": "1 hour"
          },
          {
            "value": 7200000,
            "label": "2 hours"
          }
        ],
        "unit": "ms",
        "description": "Only reveal widget within this duration before twilight"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WVerticalGraph",
    "shortName": "WVerticalGraph",
    "title": "Vertical graph",
    "description": "Shows course of altitude during specified time period",
    "category": "Flying",
    "defaultGrid": {
      "width": 10,
      "height": 5
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "interval",
        "label": "Time Window",
        "type": "number",
        "defaultValue": 60000,
        "options": [
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 300000,
            "label": "5m"
          },
          {
            "value": 600000,
            "label": "10m"
          },
          {
            "value": 900000,
            "label": "15m"
          },
          {
            "value": 1200000,
            "label": "20m"
          },
          {
            "value": 1800000,
            "label": "30m"
          }
        ],
        "unit": "ms",
        "description": "History duration displayed on graph"
      },
      {
        "key": "vertical_step",
        "label": "Vertical Grid Step",
        "type": "number",
        "defaultValue": 50,
        "options": [
          {
            "value": 5,
            "label": "5 m"
          },
          {
            "value": 10,
            "label": "10 m"
          },
          {
            "value": 20,
            "label": "20 m"
          },
          {
            "value": 50,
            "label": "50 m"
          },
          {
            "value": 100,
            "label": "100 m"
          },
          {
            "value": 200,
            "label": "200 m"
          },
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 1000,
            "label": "1000 m"
          }
        ],
        "unit": "m",
        "description": "Height grid line step"
      },
      {
        "key": "dot_size",
        "label": "Dot Size",
        "type": "number",
        "defaultValue": 15,
        "description": "Size of data dots (15 = 1.5mm)"
      },
      {
        "key": "dot_color",
        "label": "Dot Color",
        "type": "color",
        "defaultValue": "#ff8080ff",
        "description": "Color of graph plot dots"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAltitudeMaximum",
    "shortName": "WAltitudeMaximum",
    "title": "Max altitude",
    "description": "Highest GPS altitude reached during the flight",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WAltitudeMax"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "METER",
            "label": "Meters (m)"
          },
          {
            "value": "FOOT",
            "label": "Feet (ft)"
          }
        ],
        "description": "Altitude measurement unit"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNettoVario",
    "shortName": "WNettoVario",
    "title": "Netto vario",
    "description": "Netto vario from an external sensor.",
    "category": "Flying",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "netto_avg",
        "label": "Netto Averaging Interval",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Averaging interval for netto vario"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WHeading",
    "shortName": "WHeading",
    "title": "Heading",
    "description": "Current heading",
    "category": "Flying",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "degrees",
        "label": "Show Degrees",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show numerical degrees instead of cardinal letters"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WWindSpeed",
    "shortName": "WWindSpeed",
    "title": "Wind Speed",
    "description": "Computed wind speed strength",
    "category": "Air",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WWindDirection",
    "shortName": "WWindDirection",
    "title": "Wind Direction",
    "description": "Computed wind direction",
    "category": "Air",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "degrees",
        "label": "Show Degrees",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show numerical degrees instead of cardinal letters"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WThermalAssistant",
    "shortName": "WThermalAssistant",
    "title": "Thermal Assistant",
    "description": "Thermal assistant map showing lift centers and wind drift",
    "category": "Air",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "rotation",
        "label": "Rotation",
        "type": "object",
        "defaultValue": {
          "value": "NORTH_AT_TOP",
          "showCompass": false
        },
        "description": "Map orientation and compass display"
      },
      {
        "key": "mapScale",
        "label": "Map Zoom",
        "type": "object",
        "defaultValue": {
          "value": 31,
          "auto": false
        },
        "description": "Map zoom scale"
      },
      {
        "key": "drawScale",
        "label": "Show Scale Bar",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display map scale ruler"
      },
      {
        "key": "interval",
        "label": "Track History Duration",
        "type": "number",
        "defaultValue": 300,
        "options": [
          {
            "value": 60,
            "label": "1 min"
          },
          {
            "value": 120,
            "label": "2 min"
          },
          {
            "value": 180,
            "label": "3 min"
          },
          {
            "value": 300,
            "label": "5 min"
          },
          {
            "value": 600,
            "label": "10 min"
          },
          {
            "value": 900,
            "label": "15 min"
          },
          {
            "value": 1200,
            "label": "20 min"
          },
          {
            "value": 1800,
            "label": "30 min"
          },
          {
            "value": 2700,
            "label": "45 min"
          },
          {
            "value": 3600,
            "label": "60 min"
          }
        ],
        "unit": "s",
        "description": "Duration of thermal history shown"
      },
      {
        "key": "drawCircle",
        "label": "Draw Thermal Circle",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw estimated circular thermal core outline"
      },
      {
        "key": "includeWindAlgorithm",
        "label": "Wind Drift Algorithm",
        "type": "enum",
        "defaultValue": "ALGO_CLASSIC",
        "options": [
          {
            "value": "ALGO_CLASSIC",
            "label": "Classic"
          },
          {
            "value": "ALGO_INTEGRATED",
            "label": "Integrated"
          }
        ],
        "description": "Algorithm used to compensate lift positions for wind drift"
      },
      {
        "key": "nav_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "NONE",
        "options": [
          {
            "value": "NONE",
            "label": "None"
          },
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Draw navigation point arrow in assistant"
      },
      {
        "key": "nav_use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets"
      },
      {
        "key": "thermals",
        "label": "Past Thermals",
        "type": "number",
        "defaultValue": 0,
        "min": 0,
        "max": 8,
        "description": "Number of previous thermals to display"
      },
      {
        "key": "nav_showWind",
        "label": "Show Wind Arrow",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display wind indicator"
      },
      {
        "key": "nav_showSun",
        "label": "Show Sun Azimuth",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display sun position"
      },
      {
        "key": "line_thickness",
        "label": "Line Thickness",
        "type": "number",
        "defaultValue": 20,
        "description": "Line thickness multiplier"
      },
      {
        "key": "mapWidget_drawBearing",
        "label": "Show Bearing Line",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display flight course line"
      },
      {
        "key": "mapWidget_showAirspaces",
        "label": "Show Airspaces",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display controlled airspaces in thermal view"
      },
      {
        "key": "postponedFloorLimit",
        "label": "Postpone Airspaces Above",
        "type": "number",
        "defaultValue": 5000,
        "unit": "m",
        "description": "Postpone showing airspaces with floor higher than this"
      },
      {
        "key": "postponedDisplayDistance",
        "label": "Show Postponed Closer Than",
        "type": "number",
        "defaultValue": 300,
        "unit": "m",
        "description": "Show postponed airspace if within this vertical distance"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WThermalAltGain",
    "shortName": "WThermalAltGain",
    "title": "Thermal gain",
    "description": "Altitude gain in current thermal",
    "category": "Air",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAltitudeDataGraph",
    "shortName": "WAltitudeDataGraph",
    "title": "Altitude statistics",
    "description": "Draw thermal strength, wind speed and direction, ground speed and ground direction in different altitude",
    "category": "Air",
    "defaultGrid": {
      "width": 5,
      "height": 10
    },
    "isPro": true,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "graph_type",
        "label": "Graph Type",
        "type": "enum",
        "defaultValue": "GRAPH_THERMAL",
        "options": [
          {
            "value": "GRAPH_THERMAL",
            "label": "Thermal lift strength"
          },
          {
            "value": "GRAPH_WIND",
            "label": "Wind speed & direction"
          },
          {
            "value": "GRAPH_SPEED",
            "label": "Ground speed & heading"
          }
        ],
        "description": "Data type plotted across altitude bands"
      },
      {
        "key": "interval",
        "label": "Statistics Interval",
        "type": "number",
        "defaultValue": 1800000,
        "options": [
          {
            "value": 600000,
            "label": "10 min"
          },
          {
            "value": 900000,
            "label": "15 min"
          },
          {
            "value": 1200000,
            "label": "20 min"
          },
          {
            "value": 1800000,
            "label": "30 min"
          },
          {
            "value": 2700000,
            "label": "45 min"
          },
          {
            "value": 3600000,
            "label": "1 hour"
          },
          {
            "value": 5400000,
            "label": "1.5 hours"
          },
          {
            "value": 7200000,
            "label": "2 hours"
          }
        ],
        "unit": "ms",
        "description": "Duration over which statistics are aggregated"
      },
      {
        "key": "color_thermal",
        "label": "Thermal Graph Color",
        "type": "color",
        "defaultValue": "#64ff0000",
        "description": "Bar color for thermal climb rate"
      },
      {
        "key": "color_wind",
        "label": "Wind Graph Color",
        "type": "color",
        "defaultValue": "#640000ff",
        "description": "Bar color for wind speed"
      },
      {
        "key": "color_speed",
        "label": "Ground Speed Graph Color",
        "type": "color",
        "defaultValue": "#6400ff00",
        "description": "Bar color for ground speed"
      },
      {
        "key": "text_size",
        "label": "Font Size",
        "type": "number",
        "defaultValue": 20,
        "description": "Font size (20 = 2.0mm)"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WQNH",
    "shortName": "WQNH",
    "title": "QNH",
    "description": "Air pressure at the sea level",
    "category": "Air",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAirTemperature",
    "shortName": "WAirTemperature",
    "title": "Air Temperature",
    "description": "Temperature of surrounding air.",
    "category": "Air",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "_units",
        "label": "Unit",
        "type": "enum",
        "defaultValue": "SYS_UNIT",
        "options": [
          {
            "value": "SYS_UNIT",
            "label": "System Default"
          },
          {
            "value": "CELSIUS",
            "label": "Celsius (\u00b0C)"
          },
          {
            "value": "FAHRENHEIT",
            "label": "Fahrenheit (\u00b0F)"
          }
        ],
        "description": "Temperature measurement unit"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAirHumidity",
    "shortName": "WAirHumidity",
    "title": "Air Humidity",
    "description": "Humidity of surrounding air.",
    "category": "Air",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WXCAssistant",
    "shortName": "WXCAssistant",
    "title": "XC map",
    "description": "Map with FAI Assistant and navigation",
    "category": "XContest",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": false,
    "baseClass": "MapWidget",
    "interactivity": "touchable",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "auto",
        "options": [
          {
            "value": "auto",
            "label": "Automatic according to map"
          },
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Theme override for map overlays ('auto' uses map style brightness)"
      },
      {
        "key": "mapWidget_mapAppearance",
        "label": "Map Appearance & Terrain",
        "type": "object",
        "defaultValue": {
          "theme": "Lightpilot",
          "terrain": "LightShading"
        },
        "description": "Road style theme and terrain hillshading / relief"
      },
      {
        "key": "mapWidget_osmLanguage",
        "label": "Map Language",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "Default (Local)"
          },
          {
            "value": "en",
            "label": "English"
          },
          {
            "value": "de",
            "label": "German"
          },
          {
            "value": "fr",
            "label": "French"
          },
          {
            "value": "es",
            "label": "Spanish"
          },
          {
            "value": "it",
            "label": "Italian"
          },
          {
            "value": "cs",
            "label": "Czech"
          },
          {
            "value": "pl",
            "label": "Polish"
          },
          {
            "value": "ru",
            "label": "Russian"
          },
          {
            "value": "ja",
            "label": "Japanese"
          },
          {
            "value": "zh",
            "label": "Chinese"
          }
        ],
        "description": "Preferred OpenStreetMap label language"
      },
      {
        "key": "mapWidget_showRainRadar",
        "label": "Rain Radar",
        "type": "boolean",
        "defaultValue": false,
        "isPro": true,
        "description": "Display real-time rain radar precipitation overlay (Pro feature)"
      },
      {
        "key": "mapWidget_showKK7",
        "label": "Thermal Hotspots (KK7)",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display basic thermal overlay (thermal.kk7.ch)"
      },
      {
        "key": "mapWidget_KK7opacity",
        "label": "KK7 Thermal Opacity",
        "type": "number",
        "defaultValue": 40,
        "min": 10,
        "max": 100,
        "step": 10,
        "unit": "%",
        "description": "Opacity percentage of KK7 thermal layer"
      },
      {
        "key": "mapWidget_KK7timed",
        "label": "Time-Adjusted KK7 Thermals",
        "type": "boolean",
        "defaultValue": false,
        "isPro": true,
        "description": "Display time-adjusted thermal overlay according to hour of day (Pro feature)"
      },
      {
        "key": "mapWidget_KK7timedOpacity",
        "label": "Time-Adjusted Opacity",
        "type": "number",
        "defaultValue": 80,
        "min": 10,
        "max": 100,
        "step": 10,
        "unit": "%",
        "description": "Opacity percentage of time-adjusted thermal layer"
      },
      {
        "key": "rotation",
        "label": "Map Rotation & Compass",
        "type": "object",
        "defaultValue": {
          "value": "NORTH_AT_TOP",
          "showCompass": false
        },
        "description": "Map orientation mode and North indicator"
      },
      {
        "key": "mapWidget_scale",
        "label": "Map Zoom & Scale",
        "type": "object",
        "defaultValue": {
          "value": 26,
          "auto": false
        },
        "description": "Map zoom level (16..36) and auto-zoom flags"
      },
      {
        "key": "mapWidget_pilotPosCenter",
        "label": "Center Pilot",
        "type": "boolean",
        "defaultValue": true,
        "description": "Keep pilot in the center of the screen"
      },
      {
        "key": "mapWidget_pilotEdgeDistance",
        "label": "Pilot Edge Margin",
        "type": "number",
        "defaultValue": 20,
        "min": 10,
        "max": 40,
        "unit": "%",
        "description": "Distance from edge when pilot is not centered"
      },
      {
        "key": "mapWidget_drawScale",
        "label": "Show Scale Bar",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display map scale ruler bar"
      },
      {
        "key": "mapWidget_drawBearing",
        "label": "Show Bearing Line",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show current flight course bearing line"
      },
      {
        "key": "fontSize",
        "label": "Map Font Size",
        "type": "enum",
        "defaultValue": "SMALL",
        "options": [
          {
            "value": "SMALL",
            "label": "Small"
          },
          {
            "value": "MEDIUM",
            "label": "Medium"
          },
          {
            "value": "LARGE",
            "label": "Large"
          }
        ],
        "description": "Font size for map labels"
      },
      {
        "key": "mapWidget_heading_arrow_sizecoef",
        "label": "Pilot Arrow Size",
        "type": "number",
        "defaultValue": 100,
        "min": 50,
        "max": 200,
        "unit": "%",
        "description": "Glider arrow size coefficient on map"
      },
      {
        "key": "line_thickness",
        "label": "Line Thickness",
        "type": "number",
        "defaultValue": 10,
        "options": [
          {
            "value": 5,
            "label": "0.5x"
          },
          {
            "value": 7,
            "label": "0.7x"
          },
          {
            "value": 10,
            "label": "1.0x (Default)"
          },
          {
            "value": 12,
            "label": "1.2x"
          },
          {
            "value": 15,
            "label": "1.5x"
          },
          {
            "value": 17,
            "label": "1.7x"
          },
          {
            "value": 20,
            "label": "2.0x"
          },
          {
            "value": 25,
            "label": "2.5x"
          },
          {
            "value": 30,
            "label": "3.0x"
          },
          {
            "value": 40,
            "label": "4.0x"
          }
        ],
        "description": "Thickness multiplier for navigation and airspace lines"
      },
      {
        "key": "tracklog_color",
        "label": "Tracklog Color",
        "type": "color",
        "defaultValue": "#b4800000",
        "description": "Color of the active flight tracklog breadcrumbs"
      },
      {
        "key": "mapWidget_showAirspaces",
        "label": "Show Airspaces",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display controlled airspaces and obstacles"
      },
      {
        "key": "postponedFloorLimit",
        "label": "Postpone Airspaces Above",
        "type": "number",
        "defaultValue": 5000,
        "options": [
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 1000,
            "label": "1000 m"
          },
          {
            "value": 1500,
            "label": "1500 m"
          },
          {
            "value": 2000,
            "label": "2000 m"
          },
          {
            "value": 2500,
            "label": "2500 m"
          },
          {
            "value": 3000,
            "label": "3000 m"
          },
          {
            "value": 3500,
            "label": "3500 m"
          },
          {
            "value": 4000,
            "label": "4000 m"
          },
          {
            "value": 5000,
            "label": "5000 m"
          },
          {
            "value": 6000,
            "label": "6000 m"
          },
          {
            "value": 8000,
            "label": "8000 m"
          },
          {
            "value": 10000,
            "label": "10000 m"
          }
        ],
        "unit": "m",
        "description": "Hide airspaces with floor higher than this limit until nearby"
      },
      {
        "key": "postponedDisplayDistance",
        "label": "Show Postponed Airspaces Closer Than",
        "type": "number",
        "defaultValue": 300,
        "options": [
          {
            "value": 0,
            "label": "Never"
          },
          {
            "value": 50,
            "label": "50 m"
          },
          {
            "value": 100,
            "label": "100 m"
          },
          {
            "value": 200,
            "label": "200 m"
          },
          {
            "value": 300,
            "label": "300 m"
          },
          {
            "value": 400,
            "label": "400 m"
          },
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 700,
            "label": "700 m"
          },
          {
            "value": 1000,
            "label": "1000 m"
          },
          {
            "value": 1500,
            "label": "1500 m"
          },
          {
            "value": 2000,
            "label": "2000 m"
          }
        ],
        "unit": "m",
        "description": "Show postponed vertical airspace if closer than this distance"
      },
      {
        "key": "mapWidget_showEmergencyObstacles",
        "label": "Emergency Obstacle Warning",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display obstacle alert screen when approaching power lines/cables"
      },
      {
        "key": "mapWidget_emergencyObstaclesAutoZoom",
        "label": "Auto Zoom on Obstacles",
        "type": "boolean",
        "defaultValue": true,
        "description": "Automatic zoom in emergency obstacles warning mode"
      },
      {
        "key": "live_showNearby",
        "label": "Show Nearby Pilots",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display other pilots received via Livetracking, FANET or OGN"
      },
      {
        "key": "live_showSelectedTracklogs",
        "label": "Selected Pilots Tracklogs",
        "type": "boolean",
        "defaultValue": true,
        "isPro": true,
        "description": "Display tracklogs of selected pilots (Pro feature)"
      },
      {
        "key": "wpt_showWaypoints",
        "label": "Show Waypoints",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display waypoint icons and labels from active waypoint file"
      },
      {
        "key": "wpt_showCities",
        "label": "Show Cities",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display city names on map"
      },
      {
        "key": "wpt_showTakeoffs",
        "label": "Show Takeoffs",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display paragliding/hanggliding takeoffs and landing fields"
      },
      {
        "key": "nav_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          },
          {
            "value": "NONE",
            "label": "None"
          }
        ],
        "description": "Target point on active navigation cylinder"
      },
      {
        "key": "nav_use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "nav_line",
        "label": "Show Navigation Line",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw line from pilot to current target waypoint"
      },
      {
        "key": "thermals",
        "label": "Show Detected Thermals",
        "type": "number",
        "defaultValue": 0,
        "min": 0,
        "max": 8,
        "description": "Number of recent detected thermal centers to display (0 = none)"
      },
      {
        "key": "nav_showWind",
        "label": "Show Wind Arrow",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display wind direction arrow on map"
      },
      {
        "key": "nav_showSun",
        "label": "Show Sun Position",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display sun azimuth on map"
      },
      {
        "key": "showFinalGlide",
        "label": "Show Final Glide Reach",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw glide reach circle based on current altitude and glide ratio"
      },
      {
        "key": "finalGlideAvg",
        "label": "Final Glide Averaging",
        "type": "number",
        "defaultValue": 10000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Averaging interval for glide reach calculation"
      },
      {
        "key": "routes",
        "label": "Show Flight Routes",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display optimized FAI triangle / out-and-return course routes"
      },
      {
        "key": "faiAreas",
        "label": "Show FAI Triangle Sectors",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display shaded FAI triangle closing sector zones on map"
      },
      {
        "key": "faiAreasMinMax",
        "label": "Show FAI Min/Max Distance",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show min and max triangle distances inside FAI sectors"
      },
      {
        "key": "legDistance",
        "label": "Show Leg Distances",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display numeric leg distance labels along triangle legs"
      },
      {
        "key": "legPercentage",
        "label": "Show Leg Percentages",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display leg percentage labels (must be 28%..100% for FAI)"
      },
      {
        "key": "closingCircle",
        "label": "Show Triangle Closing Circle",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display 800m / 20% closing boundary circle near takeoff"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WOptiResult",
    "shortName": "WOptiResult",
    "title": "XC Distance",
    "description": "XC Distance and discipline found in current tracklog",
    "category": "XContest",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WOptiUnfinishedTriangle",
    "shortName": "WOptiUnfinishedTriangle",
    "title": "UNFINISHED Triangle",
    "description": "Distance of the flat/fai triangle flown IF you make it back to the takeoff",
    "category": "XContest",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WXCSpeed",
    "shortName": "WXCSpeed",
    "title": "Average XC speed",
    "description": "Speed on XC course over 3 turnpoints",
    "category": "XContest",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompass",
    "shortName": "WCompass",
    "title": "Compass and wind",
    "description": "Graphical display of current heading direction, wind and navigation",
    "category": "Navigation",
    "defaultGrid": {
      "width": 6,
      "height": 6
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "rotation",
        "label": "Compass Orientation",
        "type": "enum",
        "defaultValue": "NORTH",
        "options": [
          {
            "value": "NORTH",
            "label": "North at top"
          },
          {
            "value": "HEADING",
            "label": "Glider Heading at top"
          },
          {
            "value": "BEARING",
            "label": "Flight Course at top"
          },
          {
            "value": "TRAVEL_DIRECTION",
            "label": "Ground Track at top"
          }
        ],
        "description": "Reference direction rotated to top of compass"
      },
      {
        "key": "showBackground",
        "label": "Show Dial Ring",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display circular compass background dial with degree marks"
      },
      {
        "key": "showBearing",
        "label": "Show Course / Bearing Arrow",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display ground course arrow pointer"
      },
      {
        "key": "showHeading",
        "label": "Show Heading Arrow",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display magnetic heading arrow pointer"
      },
      {
        "key": "showWind",
        "label": "Show Wind Arrow",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display computed wind vector arrow"
      },
      {
        "key": "newWindArrow",
        "label": "Modern Wind Arrow Style",
        "type": "boolean",
        "defaultValue": false,
        "description": "Use arc-style modern wind indicator"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target Pointer",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          },
          {
            "value": "NONE",
            "label": "Do not show"
          }
        ],
        "description": "Draw navigation pointer arrow to active waypoint"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompassDigital",
    "shortName": "WCompassDigital",
    "title": "Digital compass",
    "description": "Display bearing, wind or navigation as a number",
    "category": "Navigation",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WCompassDigit"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "target",
        "label": "Direction Value",
        "type": "enum",
        "defaultValue": "N_NAVIGATION",
        "options": [
          {
            "value": "N_BEARING",
            "label": "Current course (bearing)"
          },
          {
            "value": "N_HEADING",
            "label": "Glider heading"
          },
          {
            "value": "N_NAVIGATION_POINT",
            "label": "Turnpoint center"
          },
          {
            "value": "N_NAVIGATION",
            "label": "Turnpoint optimized point"
          },
          {
            "value": "N_NAVIGATION_CYLINDER",
            "label": "Turnpoint cylinder edge"
          },
          {
            "value": "N_WIND",
            "label": "Wind direction"
          }
        ],
        "description": "Direction value displayed numerically"
      },
      {
        "key": "relative",
        "label": "Relative to Course",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display angle offset relative to current flight path"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WSideView",
    "shortName": "WSideView",
    "title": "Side view",
    "description": "Show glide path with terrain and airspaces",
    "category": "Navigation",
    "defaultGrid": {
      "width": 100,
      "height": 6
    },
    "isPro": false,
    "baseClass": "d0",
    "interactivity": "long_click",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "type",
        "label": "Look-Ahead Direction",
        "type": "enum",
        "defaultValue": "SIDE_BEARING",
        "options": [
          {
            "value": "SIDE_BEARING",
            "label": "Course (flight direction)"
          },
          {
            "value": "SIDE_NAVIG",
            "label": "Navigation (waypoint direction)"
          }
        ],
        "description": "Horizontal cut direction ahead of the glider"
      },
      {
        "key": "distance",
        "label": "Profile Look-Ahead Distance",
        "type": "number",
        "defaultValue": 15000,
        "options": [
          {
            "value": 5000,
            "label": "5 km"
          },
          {
            "value": 10000,
            "label": "10 km"
          },
          {
            "value": 15000,
            "label": "15 km"
          },
          {
            "value": 20000,
            "label": "20 km"
          },
          {
            "value": 30000,
            "label": "30 km"
          },
          {
            "value": 40000,
            "label": "40 km"
          },
          {
            "value": 50000,
            "label": "50 km"
          }
        ],
        "unit": "m",
        "description": "Forward terrain distance cut length"
      },
      {
        "key": "finalGlideAvg",
        "label": "Glide Slope Averaging",
        "type": "number",
        "defaultValue": 10000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Averaging time for projected glide slope line"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNextTurnpoint",
    "shortName": "WNextTurnpoint",
    "title": "Next Turnpoint",
    "description": "Name of the next turnpoint",
    "category": "Navigation",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WeightedTextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNextTurnpointDistance",
    "shortName": "WNextTurnpointDistance",
    "title": "Distance Next",
    "description": "Distance to the next turnpoint",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNextTurnpointTimeOfArrival",
    "shortName": "WNextTurnpointTimeOfArrival",
    "title": "Next TP TOA",
    "description": "Time of arrival to the next turnpoint",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSpeedSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "speed_type",
        "label": "Speed Reference",
        "type": "enum",
        "defaultValue": "GROUND",
        "options": [
          {
            "value": "GROUND",
            "label": "Ground speed"
          },
          {
            "value": "AIRSPEED",
            "label": "Air speed"
          },
          {
            "value": "GLIDE",
            "label": "Glide speed"
          },
          {
            "value": "XC",
            "label": "XC speed"
          }
        ],
        "description": "Speed reference used for arrival time computations"
      },
      {
        "key": "speed_avg",
        "label": "Speed Averaging",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Instant"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          },
          {
            "value": 600000,
            "label": "10m"
          },
          {
            "value": 900000,
            "label": "15m"
          },
          {
            "value": 1200000,
            "label": "20m"
          },
          {
            "value": 1800000,
            "label": "30m"
          }
        ],
        "unit": "ms",
        "description": "Averaging interval for speed computation"
      },
      {
        "key": "time_format",
        "label": "Time Format",
        "type": "enum",
        "defaultValue": "COMPACT",
        "options": [
          {
            "value": "WITH_UNITS",
            "label": "With units (1h23m)"
          },
          {
            "value": "COMPACT",
            "label": "Compact (1:23)"
          },
          {
            "value": "HMS",
            "label": "Hours, minutes, seconds (1:23:45)"
          },
          {
            "value": "HM",
            "label": "Hours and minutes (1:23)"
          }
        ],
        "description": "Arrival time clock format"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNextTurnpointAlt",
    "shortName": "WNextTurnpointAlt",
    "title": "Next TP Height",
    "description": "Height or altitude of arrival to the next turnpoint",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "speed_avg",
        "label": "Speed Averaging",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Instant"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          },
          {
            "value": 600000,
            "label": "10m"
          },
          {
            "value": 900000,
            "label": "15m"
          },
          {
            "value": 1200000,
            "label": "20m"
          },
          {
            "value": 1800000,
            "label": "30m"
          }
        ],
        "unit": "ms",
        "description": "Speed averaging interval for arrival glide calculation"
      },
      {
        "key": "altitude",
        "label": "Altitude Mode",
        "type": "enum",
        "defaultValue": "AGL",
        "options": [
          {
            "value": "AGL",
            "label": "Arrival height above ground (AGL)"
          },
          {
            "value": "AMSL",
            "label": "Arrival altitude above sea level (AMSL)"
          },
          {
            "value": "DROP",
            "label": "Altitude difference to turnpoint altitude"
          }
        ],
        "description": "Altitude reference frame"
      },
      {
        "key": "glide",
        "label": "Glide Reference",
        "type": "enum",
        "defaultValue": "COMPUTED",
        "options": [
          {
            "value": "ACTUAL",
            "label": "Actual current glide ratio"
          },
          {
            "value": "COMPUTED",
            "label": "MacCready / speed-to-fly computed glide"
          }
        ],
        "description": "Glide polar computation mode"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WNextTurnpointGlideTo",
    "shortName": "WNextTurnpointGlideTo",
    "title": "Glide Ratio to TP",
    "description": "Necessary glide ratio to reach next TP with configurable altitude reserve",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "alt_above",
        "label": "Safety Altitude Reserve Above TP",
        "type": "number",
        "defaultValue": 500,
        "min": 0,
        "max": 3000,
        "step": 50,
        "unit": "m",
        "description": "Target safety clearance over turnpoint elevation"
      },
      {
        "key": "headless",
        "label": "Omit '1:' prefix",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show glide number without leading 1:"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WAirspaceProximity",
    "shortName": "WAirspaceProximity",
    "title": "Airspace proximity",
    "description": "Shows airspace description and distance to the airspace",
    "category": "Navigation",
    "defaultGrid": {
      "width": 20,
      "height": 12
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "maxDistance",
        "label": "Warning Distance Limit",
        "type": "number",
        "defaultValue": 5000,
        "options": [
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 1000,
            "label": "1 km"
          },
          {
            "value": 1500,
            "label": "1.5 km"
          },
          {
            "value": 2000,
            "label": "2 km"
          },
          {
            "value": 3000,
            "label": "3 km"
          },
          {
            "value": 5000,
            "label": "5 km"
          },
          {
            "value": 7500,
            "label": "7.5 km"
          },
          {
            "value": 10000,
            "label": "10 km"
          },
          {
            "value": 15000,
            "label": "15 km"
          },
          {
            "value": 20000,
            "label": "20 km"
          },
          {
            "value": 30000,
            "label": "30 km"
          }
        ],
        "unit": "m",
        "description": "Maximum horizontal registration distance"
      },
      {
        "key": "_shownearinside",
        "label": "Show Adjacent Inside Airspace",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show warning for adjacent airspace even when already inside another"
      },
      {
        "key": "_showoriginalheightline",
        "label": "Show Original Heights",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display nominal published vertical boundaries"
      },
      {
        "key": "_showrecomputedheightline",
        "label": "Show GPS-Recomputed Heights",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display vertical boundaries recomputed to current GPS altitude"
      },
      {
        "key": "_splitdirection",
        "label": "Split Direction",
        "type": "enum",
        "defaultValue": "AUTO",
        "options": [
          {
            "value": "AUTO",
            "label": "Automatic"
          },
          {
            "value": "HORIZONTAL",
            "label": "Horizontal (side-by-side)"
          },
          {
            "value": "VERTICAL",
            "label": "Vertical (stacked)"
          }
        ],
        "description": "Layout split when warning for two airspaces simultaneously"
      },
      {
        "key": "postponedFloorLimit",
        "label": "Postpone Airspaces Above",
        "type": "number",
        "defaultValue": 2500,
        "unit": "m",
        "description": "Hide warnings for high-altitude airspaces until nearby"
      },
      {
        "key": "postponedDisplayDistance",
        "label": "Show Postponed Closer Than",
        "type": "number",
        "defaultValue": 300,
        "unit": "m",
        "description": "Reveal postponed airspace if vertical buffer is within this distance"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WTakeoffDistance",
    "shortName": "WTakeoffDistance",
    "title": "Distance from takeoff",
    "description": "Shows distance from detected takeoff",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WTakeoffCourse",
    "shortName": "WTakeoffCourse",
    "title": "Course to takeoff",
    "description": "Shows course to the takeoff",
    "category": "Navigation",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "degrees",
        "label": "Show Degrees",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show degrees instead of cardinal directions"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompMap",
    "shortName": "WCompMap",
    "title": "Task map",
    "description": "Competition map view - shows task, optimal route and tracklog",
    "category": "Competition",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": false,
    "baseClass": "MapWidget",
    "interactivity": "touchable",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "auto",
        "options": [
          {
            "value": "auto",
            "label": "Automatic according to map"
          },
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Theme override for map overlays ('auto' uses map style brightness)"
      },
      {
        "key": "mapWidget_mapAppearance",
        "label": "Map Appearance & Terrain",
        "type": "object",
        "defaultValue": {
          "theme": "Lightpilot",
          "terrain": "LightShading"
        },
        "description": "Road style theme and terrain hillshading / relief"
      },
      {
        "key": "mapWidget_osmLanguage",
        "label": "Map Language",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "Default (Local)"
          },
          {
            "value": "en",
            "label": "English"
          },
          {
            "value": "de",
            "label": "German"
          },
          {
            "value": "fr",
            "label": "French"
          },
          {
            "value": "es",
            "label": "Spanish"
          },
          {
            "value": "it",
            "label": "Italian"
          },
          {
            "value": "cs",
            "label": "Czech"
          },
          {
            "value": "pl",
            "label": "Polish"
          },
          {
            "value": "ru",
            "label": "Russian"
          },
          {
            "value": "ja",
            "label": "Japanese"
          },
          {
            "value": "zh",
            "label": "Chinese"
          }
        ],
        "description": "Preferred OpenStreetMap label language"
      },
      {
        "key": "mapWidget_showRainRadar",
        "label": "Rain Radar",
        "type": "boolean",
        "defaultValue": false,
        "isPro": true,
        "description": "Display real-time rain radar precipitation overlay (Pro feature)"
      },
      {
        "key": "mapWidget_showKK7",
        "label": "Thermal Hotspots (KK7)",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display basic thermal overlay (thermal.kk7.ch)"
      },
      {
        "key": "mapWidget_KK7opacity",
        "label": "KK7 Thermal Opacity",
        "type": "number",
        "defaultValue": 40,
        "min": 10,
        "max": 100,
        "step": 10,
        "unit": "%",
        "description": "Opacity percentage of KK7 thermal layer"
      },
      {
        "key": "mapWidget_KK7timed",
        "label": "Time-Adjusted KK7 Thermals",
        "type": "boolean",
        "defaultValue": false,
        "isPro": true,
        "description": "Display time-adjusted thermal overlay according to hour of day (Pro feature)"
      },
      {
        "key": "mapWidget_KK7timedOpacity",
        "label": "Time-Adjusted Opacity",
        "type": "number",
        "defaultValue": 80,
        "min": 10,
        "max": 100,
        "step": 10,
        "unit": "%",
        "description": "Opacity percentage of time-adjusted thermal layer"
      },
      {
        "key": "rotation",
        "label": "Map Rotation & Compass",
        "type": "object",
        "defaultValue": {
          "value": "NORTH_AT_TOP",
          "showCompass": false
        },
        "description": "Map orientation mode and North indicator"
      },
      {
        "key": "mapWidget_scale",
        "label": "Map Zoom & Scale",
        "type": "object",
        "defaultValue": {
          "value": 26,
          "auto": false
        },
        "description": "Map zoom level (16..36) and auto-zoom flags"
      },
      {
        "key": "mapWidget_pilotPosCenter",
        "label": "Center Pilot",
        "type": "boolean",
        "defaultValue": true,
        "description": "Keep pilot in the center of the screen"
      },
      {
        "key": "mapWidget_pilotEdgeDistance",
        "label": "Pilot Edge Margin",
        "type": "number",
        "defaultValue": 20,
        "min": 10,
        "max": 40,
        "unit": "%",
        "description": "Distance from edge when pilot is not centered"
      },
      {
        "key": "mapWidget_drawScale",
        "label": "Show Scale Bar",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display map scale ruler bar"
      },
      {
        "key": "mapWidget_drawBearing",
        "label": "Show Bearing Line",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show current flight course bearing line"
      },
      {
        "key": "fontSize",
        "label": "Map Font Size",
        "type": "enum",
        "defaultValue": "SMALL",
        "options": [
          {
            "value": "SMALL",
            "label": "Small"
          },
          {
            "value": "MEDIUM",
            "label": "Medium"
          },
          {
            "value": "LARGE",
            "label": "Large"
          }
        ],
        "description": "Font size for map labels"
      },
      {
        "key": "mapWidget_heading_arrow_sizecoef",
        "label": "Pilot Arrow Size",
        "type": "number",
        "defaultValue": 100,
        "min": 50,
        "max": 200,
        "unit": "%",
        "description": "Glider arrow size coefficient on map"
      },
      {
        "key": "line_thickness",
        "label": "Line Thickness",
        "type": "number",
        "defaultValue": 10,
        "options": [
          {
            "value": 5,
            "label": "0.5x"
          },
          {
            "value": 7,
            "label": "0.7x"
          },
          {
            "value": 10,
            "label": "1.0x (Default)"
          },
          {
            "value": 12,
            "label": "1.2x"
          },
          {
            "value": 15,
            "label": "1.5x"
          },
          {
            "value": 17,
            "label": "1.7x"
          },
          {
            "value": 20,
            "label": "2.0x"
          },
          {
            "value": 25,
            "label": "2.5x"
          },
          {
            "value": 30,
            "label": "3.0x"
          },
          {
            "value": 40,
            "label": "4.0x"
          }
        ],
        "description": "Thickness multiplier for navigation and airspace lines"
      },
      {
        "key": "tracklog_color",
        "label": "Tracklog Color",
        "type": "color",
        "defaultValue": "#b4800000",
        "description": "Color of the active flight tracklog breadcrumbs"
      },
      {
        "key": "mapWidget_showAirspaces",
        "label": "Show Airspaces",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display controlled airspaces and obstacles"
      },
      {
        "key": "postponedFloorLimit",
        "label": "Postpone Airspaces Above",
        "type": "number",
        "defaultValue": 5000,
        "options": [
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 1000,
            "label": "1000 m"
          },
          {
            "value": 1500,
            "label": "1500 m"
          },
          {
            "value": 2000,
            "label": "2000 m"
          },
          {
            "value": 2500,
            "label": "2500 m"
          },
          {
            "value": 3000,
            "label": "3000 m"
          },
          {
            "value": 3500,
            "label": "3500 m"
          },
          {
            "value": 4000,
            "label": "4000 m"
          },
          {
            "value": 5000,
            "label": "5000 m"
          },
          {
            "value": 6000,
            "label": "6000 m"
          },
          {
            "value": 8000,
            "label": "8000 m"
          },
          {
            "value": 10000,
            "label": "10000 m"
          }
        ],
        "unit": "m",
        "description": "Hide airspaces with floor higher than this limit until nearby"
      },
      {
        "key": "postponedDisplayDistance",
        "label": "Show Postponed Airspaces Closer Than",
        "type": "number",
        "defaultValue": 300,
        "options": [
          {
            "value": 0,
            "label": "Never"
          },
          {
            "value": 50,
            "label": "50 m"
          },
          {
            "value": 100,
            "label": "100 m"
          },
          {
            "value": 200,
            "label": "200 m"
          },
          {
            "value": 300,
            "label": "300 m"
          },
          {
            "value": 400,
            "label": "400 m"
          },
          {
            "value": 500,
            "label": "500 m"
          },
          {
            "value": 700,
            "label": "700 m"
          },
          {
            "value": 1000,
            "label": "1000 m"
          },
          {
            "value": 1500,
            "label": "1500 m"
          },
          {
            "value": 2000,
            "label": "2000 m"
          }
        ],
        "unit": "m",
        "description": "Show postponed vertical airspace if closer than this distance"
      },
      {
        "key": "mapWidget_showEmergencyObstacles",
        "label": "Emergency Obstacle Warning",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display obstacle alert screen when approaching power lines/cables"
      },
      {
        "key": "mapWidget_emergencyObstaclesAutoZoom",
        "label": "Auto Zoom on Obstacles",
        "type": "boolean",
        "defaultValue": true,
        "description": "Automatic zoom in emergency obstacles warning mode"
      },
      {
        "key": "live_showNearby",
        "label": "Show Nearby Pilots",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display other pilots received via Livetracking, FANET or OGN"
      },
      {
        "key": "live_showSelectedTracklogs",
        "label": "Selected Pilots Tracklogs",
        "type": "boolean",
        "defaultValue": true,
        "isPro": true,
        "description": "Display tracklogs of selected pilots (Pro feature)"
      },
      {
        "key": "wpt_showWaypoints",
        "label": "Show Waypoints",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display waypoint icons and labels from active waypoint file"
      },
      {
        "key": "wpt_showCities",
        "label": "Show Cities",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display city names on map"
      },
      {
        "key": "wpt_showTakeoffs",
        "label": "Show Takeoffs",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display paragliding/hanggliding takeoffs and landing fields"
      },
      {
        "key": "nav_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          },
          {
            "value": "NONE",
            "label": "None"
          }
        ],
        "description": "Target point on active navigation cylinder"
      },
      {
        "key": "nav_use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "nav_line",
        "label": "Show Navigation Line",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw line from pilot to current target waypoint"
      },
      {
        "key": "thermals",
        "label": "Show Detected Thermals",
        "type": "number",
        "defaultValue": 0,
        "min": 0,
        "max": 8,
        "description": "Number of recent detected thermal centers to display (0 = none)"
      },
      {
        "key": "nav_showWind",
        "label": "Show Wind Arrow",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display wind direction arrow on map"
      },
      {
        "key": "nav_showSun",
        "label": "Show Sun Position",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display sun azimuth on map"
      },
      {
        "key": "showFinalGlide",
        "label": "Show Final Glide Reach",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw glide reach circle based on current altitude and glide ratio"
      },
      {
        "key": "finalGlideAvg",
        "label": "Final Glide Averaging",
        "type": "number",
        "defaultValue": 10000,
        "options": [
          {
            "value": 500,
            "label": "0.5s"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 4000,
            "label": "4s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 7000,
            "label": "7s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 25000,
            "label": "25s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 40000,
            "label": "40s"
          },
          {
            "value": 50000,
            "label": "50s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 90000,
            "label": "1.5m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          }
        ],
        "unit": "ms",
        "description": "Averaging interval for glide reach calculation"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompDistanceToGoal",
    "shortName": "WCompDistanceToGoal",
    "title": "Distance to goal",
    "description": "Optimized distance through the remaining turnpoints to goal",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompDistanceToESS",
    "shortName": "WCompDistanceToESS",
    "title": "Distance to ESS",
    "description": "Optimized distance through the remaining turnpoints to end of the speed section",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompAltitudeOverGoal",
    "shortName": "WCompAltitudeOverGoal",
    "title": "Altitude over goal",
    "description": "Arriving altitude over goal line/cylinder",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompAltitudeOverESS",
    "shortName": "WCompAltitudeOverESS",
    "title": "Altitude over ESS",
    "description": "Arriving altitude over ESS",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompGlideToGoal",
    "shortName": "WCompGlideToGoal",
    "title": "Glide to goal",
    "description": "Glide ratio necessary to reach goal",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "headless",
        "label": "Omit '1:' prefix",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show glide number without leading 1:"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompGlideToESS",
    "shortName": "WCompGlideToESS",
    "title": "Glide to ESS",
    "description": "Glide ratio necessary to reach end of speed section",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WCompGlideToEss"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "headless",
        "label": "Omit '1:' prefix",
        "type": "boolean",
        "defaultValue": false,
        "description": "Show glide number without leading 1:"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompTimeToStart",
    "shortName": "WCompTimeToStart",
    "title": "Time to start",
    "description": "Time to next start gate",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "time_format",
        "label": "Time Format",
        "type": "enum",
        "defaultValue": "COMPACT",
        "options": [
          {
            "value": "WITH_UNITS",
            "label": "With units (1h23m)"
          },
          {
            "value": "COMPACT",
            "label": "Compact (1:23)"
          },
          {
            "value": "HMS",
            "label": "Hours, minutes, seconds (1:23:45)"
          },
          {
            "value": "HM",
            "label": "Hours and minutes (1:23)"
          }
        ],
        "description": "Countdown timer format"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompTimeAtStart",
    "shortName": "WCompTimeAtStart",
    "title": "Time at start",
    "description": "Time you cross the SSS",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSpeedSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      },
      {
        "key": "speed_type",
        "label": "Speed Reference",
        "type": "enum",
        "defaultValue": "GROUND",
        "options": [
          {
            "value": "GROUND",
            "label": "Ground speed"
          },
          {
            "value": "AIRSPEED",
            "label": "Air speed"
          },
          {
            "value": "GLIDE",
            "label": "Glide speed"
          },
          {
            "value": "XC",
            "label": "XC speed"
          }
        ],
        "description": "Speed reference used for arrival time computations"
      },
      {
        "key": "speed_avg",
        "label": "Speed Averaging",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Instant"
          },
          {
            "value": 1000,
            "label": "1s"
          },
          {
            "value": 2000,
            "label": "2s"
          },
          {
            "value": 3000,
            "label": "3s"
          },
          {
            "value": 5000,
            "label": "5s"
          },
          {
            "value": 10000,
            "label": "10s"
          },
          {
            "value": 15000,
            "label": "15s"
          },
          {
            "value": 20000,
            "label": "20s"
          },
          {
            "value": 30000,
            "label": "30s"
          },
          {
            "value": 60000,
            "label": "1m"
          },
          {
            "value": 120000,
            "label": "2m"
          },
          {
            "value": 180000,
            "label": "3m"
          },
          {
            "value": 300000,
            "label": "5m"
          },
          {
            "value": 600000,
            "label": "10m"
          },
          {
            "value": 900000,
            "label": "15m"
          },
          {
            "value": 1200000,
            "label": "20m"
          },
          {
            "value": 1800000,
            "label": "30m"
          }
        ],
        "unit": "ms",
        "description": "Averaging interval for speed computation"
      },
      {
        "key": "time_format",
        "label": "Time Format",
        "type": "enum",
        "defaultValue": "COMPACT",
        "options": [
          {
            "value": "WITH_UNITS",
            "label": "With units (1h23m)"
          },
          {
            "value": "COMPACT",
            "label": "Compact (1:23)"
          },
          {
            "value": "HMS",
            "label": "Hours, minutes, seconds (1:23:45)"
          },
          {
            "value": "HM",
            "label": "Hours and minutes (1:23)"
          }
        ],
        "description": "Start arrival time format"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompSpeedToStart",
    "shortName": "WCompSpeedToStart",
    "title": "Speed to start",
    "description": "Speed to go to reach the start cylinder at the right time",
    "category": "Competition",
    "defaultGrid": {
      "width": 6,
      "height": 3
    },
    "isPro": false,
    "baseClass": "WNextTurnpointSomething",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "navigation_target",
        "label": "Navigation Target",
        "type": "enum",
        "defaultValue": "OPTIMIZED",
        "options": [
          {
            "value": "POINT",
            "label": "Center Point"
          },
          {
            "value": "OPTIMIZED",
            "label": "Optimized Point"
          },
          {
            "value": "CYLINDER",
            "label": "Cylinder Edge"
          }
        ],
        "description": "Navigation target reference point on turnpoint cylinder"
      },
      {
        "key": "use_brackets",
        "label": "Use Brackets",
        "type": "boolean",
        "defaultValue": true,
        "description": "Use distinguishing brackets (cylinder), [optimized]"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompPercentage",
    "shortName": "WCompPercentage",
    "title": "% of speed section",
    "description": "Show percentage of flown speed section (to help with leading points)",
    "category": "Competition",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "ValueWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WCompSSPercentage"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WCompTaskSummary",
    "shortName": "WCompTaskSummary",
    "title": "Task summary",
    "description": "Task information reminder",
    "category": "Competition",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WLiveMessage",
    "shortName": "WLiveMessage",
    "title": "Incoming messages",
    "description": "Display incoming livetracking messages from team or retrieve driver",
    "category": "Livetracking",
    "defaultGrid": {
      "width": 20,
      "height": 5
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "line_count",
        "label": "Max Lines",
        "type": "number",
        "defaultValue": 3,
        "min": 1,
        "max": 5,
        "step": 1,
        "description": "Maximum number of message lines shown"
      },
      {
        "key": "show_time",
        "label": "Display Duration",
        "type": "number",
        "defaultValue": 10,
        "unit": "s",
        "description": "Time to keep new message visible before hiding"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonNavig",
    "shortName": "WButtonNavig",
    "title": "Next/previous waypoint button",
    "description": "Change to next/previous waypoint by clicking a button",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "interactivity": "short_click",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WButtonActionNavig"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "type",
        "label": "Button Action",
        "type": "enum",
        "defaultValue": "ACTION_NEXT_WAYPOINT",
        "options": [
          {
            "value": "ACTION_NEXT_WAYPOINT",
            "label": "Next Waypoint"
          },
          {
            "value": "ACTION_PREV_WAYPOINT",
            "label": "Previous Waypoint"
          }
        ],
        "description": "Waypoint navigation action"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press instead of short click"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonPhone",
    "shortName": "WButtonPhone",
    "title": "Phone call",
    "description": "Make a phone call by pressing the button",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "showContact",
        "label": "Show Contact Name",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show resolved contact name from phonebook"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press to trigger phone call"
      },
      {
        "key": "callBackground",
        "label": "Background Call",
        "type": "boolean",
        "defaultValue": false,
        "description": "Keep XCTrack in foreground during call"
      },
      {
        "key": "phoneNumber",
        "label": "Phone Number",
        "type": "string",
        "defaultValue": "",
        "description": "Phone number to dial"
      },
      {
        "key": "callType",
        "label": "Call Action",
        "type": "enum",
        "defaultValue": "C_DIAL",
        "options": [
          {
            "value": "C_DIAL",
            "label": "Open dialer keypad"
          },
          {
            "value": "C_CALL",
            "label": "Direct call (earpiece)"
          },
          {
            "value": "C_CALL_LOUD",
            "label": "Direct call on speakerphone"
          }
        ],
        "description": "Calling mode"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonCamera",
    "shortName": "WButtonCamera",
    "title": "Camera button",
    "description": "Launch camera application",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WButtonActionCamera"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press to open camera"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonZoom",
    "shortName": "WButtonZoom",
    "title": "Map zoom button",
    "description": "Zoom-in/out of map by pressing a button",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WButtonActionZoom"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "type",
        "label": "Zoom Direction",
        "type": "enum",
        "defaultValue": "ACTION_ZOOM_IN",
        "options": [
          {
            "value": "ACTION_ZOOM_IN",
            "label": "Zoom In (+)"
          },
          {
            "value": "ACTION_ZOOM_OUT",
            "label": "Zoom Out (-)"
          }
        ],
        "description": "Map zoom direction"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonVario",
    "shortName": "WButtonVario",
    "title": "Vario button",
    "description": "Mute/unmute vario and weak lift",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WButtonActionSilence",
      "org.xcontest.XCTrack.widget.w.WButtonSilenceVario"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display title text on button"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press to toggle mute state"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonBrightness",
    "shortName": "WButtonBrightness",
    "title": "Display brightness button",
    "description": "Increase or decrease brightness of display backlight",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": true,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "type",
        "label": "Brightness Step",
        "type": "enum",
        "defaultValue": "ACTION_PLUS",
        "options": [
          {
            "value": "ACTION_PLUS",
            "label": "Increase brightness (+)"
          },
          {
            "value": "ACTION_MINUS",
            "label": "Decrease brightness (-)"
          }
        ],
        "description": "Backlight adjustment direction"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonIntentLauncher",
    "shortName": "WButtonIntentLauncher",
    "title": "Intent launcher",
    "description": "Broadcast an intent into the system - can be processed by other applications.",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": true,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display title text on button"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long press to fire intent"
      },
      {
        "key": "name",
        "label": "Button Label",
        "type": "string",
        "defaultValue": "",
        "description": "Custom text displayed inside button"
      },
      {
        "key": "intent_action",
        "label": "Intent Action",
        "type": "string",
        "defaultValue": "",
        "description": "Android Broadcast Intent Action string"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WFreeText",
    "shortName": "WFreeText",
    "title": "Free text",
    "description": "Note yourself what you want",
    "category": "Others",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "text",
        "label": "Text Content",
        "type": "string",
        "defaultValue": "Change me in widget settings",
        "description": "Custom notes, checklists or reminders"
      },
      {
        "key": "color_text",
        "label": "Text Color",
        "type": "color",
        "defaultValue": "#ff000000",
        "description": "Color of the text font"
      },
      {
        "key": "color_bg",
        "label": "Background Color",
        "type": "color",
        "defaultValue": "#00ffffff",
        "description": "Background fill color"
      },
      {
        "key": "text_size",
        "label": "Font Size",
        "type": "number",
        "defaultValue": 25,
        "options": [
          {
            "value": 10,
            "label": "1.0 mm"
          },
          {
            "value": 15,
            "label": "1.5 mm"
          },
          {
            "value": 20,
            "label": "2.0 mm"
          },
          {
            "value": 25,
            "label": "2.5 mm"
          },
          {
            "value": 30,
            "label": "3.0 mm"
          },
          {
            "value": 40,
            "label": "4.0 mm"
          },
          {
            "value": 50,
            "label": "5.0 mm"
          },
          {
            "value": 70,
            "label": "7.0 mm"
          },
          {
            "value": 100,
            "label": "10.0 mm"
          }
        ],
        "description": "Text font size (25 = 2.5mm)"
      },
      {
        "key": "text_bold",
        "label": "Bold Text",
        "type": "boolean",
        "defaultValue": false,
        "description": "Render text in bold"
      },
      {
        "key": "text_italic",
        "label": "Italic Text",
        "type": "boolean",
        "defaultValue": false,
        "description": "Render text in italic"
      },
      {
        "key": "text_padding",
        "label": "Padding",
        "type": "number",
        "defaultValue": 10,
        "description": "Internal margin padding"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WWebView",
    "shortName": "WWebView",
    "title": "Web page",
    "description": "Show a web page as a widget",
    "category": "Others",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": true,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "url",
        "label": "Web Page URL",
        "type": "string",
        "defaultValue": "",
        "description": "URL with optional ${lat}, ${lng}, ${alt}, ${spd}, ${hdg} parameter substitution"
      },
      {
        "key": "initialScale",
        "label": "Initial Zoom Scale",
        "type": "object",
        "defaultValue": {
          "scale": 0
        },
        "description": "Initial webview scale level (0 = auto-fit)"
      },
      {
        "key": "scrollSettings",
        "label": "Scroll Position",
        "type": "object",
        "defaultValue": {
          "scrollX": 0,
          "scrollY": 0
        },
        "description": "Saved scroll coordinates"
      },
      {
        "key": "refreshInterval",
        "label": "Auto Refresh Interval",
        "type": "number",
        "defaultValue": 0,
        "options": [
          {
            "value": 0,
            "label": "Never"
          },
          {
            "value": 300000,
            "label": "5 min"
          },
          {
            "value": 600000,
            "label": "10 min"
          },
          {
            "value": 900000,
            "label": "15 min"
          },
          {
            "value": 1200000,
            "label": "20 min"
          },
          {
            "value": 1800000,
            "label": "30 min"
          }
        ],
        "unit": "ms",
        "description": "Periodic page reload timer"
      },
      {
        "key": "allowGsp",
        "label": "Allow GPS Geolocation",
        "type": "boolean",
        "defaultValue": false,
        "description": "Allow web page to read browser GPS coordinates"
      },
      {
        "key": "allowXCTrackJS",
        "label": "Allow XCTrack JavaScript API",
        "type": "boolean",
        "defaultValue": false,
        "description": "Inject window.XCTrack sensor and flight status data API"
      },
      {
        "key": "allowClickPassing",
        "label": "Pass Clicks Through",
        "type": "boolean",
        "defaultValue": false,
        "description": "Allow clicks through to webview while in flight"
      },
      {
        "key": "allowInteraction",
        "label": "Allow Full Interaction",
        "type": "boolean",
        "defaultValue": false,
        "description": "Enable full touch gestures and scrolling"
      },
      {
        "key": "saveButtonPos",
        "label": "Save Button Position",
        "type": "enum",
        "defaultValue": "BOT_RIGHT",
        "options": [
          {
            "value": "BOT_LEFT",
            "label": "Bottom Left"
          },
          {
            "value": "BOT_CENTER",
            "label": "Bottom Center"
          },
          {
            "value": "BOT_RIGHT",
            "label": "Bottom Right"
          }
        ],
        "description": "Position of overlay save button in browser edit mode"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WExternalData",
    "shortName": "WExternalData",
    "title": "External data display",
    "description": "Show values from $XCTOD sentences. Useful for custom external sensors (engine sensors etc).",
    "category": "Others",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "ValueWidget",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WOpenData"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display measurement unit label"
      },
      {
        "key": "_hide_labels",
        "label": "Hide Labels When Empty",
        "type": "boolean",
        "defaultValue": false,
        "description": "Hide title and unit labels when nothing is displayed"
      },
      {
        "key": "position",
        "label": "Data Index Position",
        "type": "number",
        "defaultValue": 1,
        "min": 1,
        "max": 30,
        "step": 1,
        "description": "1-based field index in incoming $XCTOD sentence"
      },
      {
        "key": "suffix",
        "label": "Value Suffix / Unit",
        "type": "string",
        "defaultValue": "",
        "description": "Measurement label text printed after numeric value"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WLastKey",
    "shortName": "WLastKey",
    "title": "Last key pressed",
    "description": "Show the key pressed in the last second.",
    "category": "Testing",
    "defaultGrid": {
      "width": 5,
      "height": 4
    },
    "isPro": false,
    "baseClass": "TextWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WLogPeek",
    "shortName": "WLogPeek",
    "title": "Tail of the log",
    "description": "Show last N lines from the log file.",
    "category": "Testing",
    "defaultGrid": {
      "width": 10,
      "height": 20
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "lines_count",
        "label": "Number of Log Lines",
        "type": "number",
        "defaultValue": 25,
        "options": [
          {
            "value": 3,
            "label": "3 lines"
          },
          {
            "value": 5,
            "label": "5 lines"
          },
          {
            "value": 10,
            "label": "10 lines"
          },
          {
            "value": 15,
            "label": "15 lines"
          },
          {
            "value": 20,
            "label": "20 lines"
          },
          {
            "value": 25,
            "label": "25 lines"
          },
          {
            "value": 30,
            "label": "30 lines"
          },
          {
            "value": 40,
            "label": "40 lines"
          },
          {
            "value": 50,
            "label": "50 lines"
          }
        ],
        "description": "How many trailing log lines to render"
      },
      {
        "key": "reverse",
        "label": "Reverse Order",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display newest log lines at top"
      },
      {
        "key": "filter",
        "label": "Filter Substring",
        "type": "string",
        "defaultValue": "",
        "description": "Only show log lines matching this string"
      },
      {
        "key": "color_text",
        "label": "Log Text Color",
        "type": "color",
        "defaultValue": "#ff000000",
        "description": "Log text foreground color"
      },
      {
        "key": "color_bg",
        "label": "Log Background Color",
        "type": "color",
        "defaultValue": "#00ffffff",
        "description": "Log background box color"
      },
      {
        "key": "text_size",
        "label": "Font Size",
        "type": "number",
        "defaultValue": 15,
        "description": "Log text font size"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugDetectedActivity",
    "shortName": "WDebugDetectedActivity",
    "title": "DetectedActivity",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 5,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugActivelook",
    "shortName": "WDebugActivelook",
    "title": "ActiveLook widget",
    "description": "Simulation of ActiveLook glasses",
    "category": "Debug",
    "defaultGrid": {
      "width": 5,
      "height": 5
    },
    "isPro": false,
    "baseClass": "d0",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WActiveLook"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebug",
    "shortName": "WDebug",
    "title": "Debug",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 8,
      "height": 1
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugFPS",
    "shortName": "WDebugFPS",
    "title": "FPS",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "d0",
    "aliases": [
      "org.xcontest.XCTrack.widget.w.WDebugFps"
    ],
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugSystemInfo",
    "shortName": "WDebugSystemInfo",
    "title": "System Info",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugFont",
    "shortName": "WDebugFont",
    "title": "DebugFont",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 20,
      "height": 12
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "show",
        "label": "Font Bounding Mode",
        "type": "enum",
        "defaultValue": "GREEN",
        "options": [
          {
            "value": "GREEN",
            "label": "Green bounding box"
          },
          {
            "value": "INSIDE",
            "label": "Inner box"
          },
          {
            "value": "VERTICAL",
            "label": "Vertical line"
          },
          {
            "value": "HORIZONTAL",
            "label": "Horizontal line"
          }
        ],
        "description": "Font alignment debugging visualization"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WVTM",
    "shortName": "WVTM",
    "title": "VTM",
    "description": "For debugging purposes only",
    "category": "Debug",
    "defaultGrid": {
      "width": 10,
      "height": 10
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          {
            "value": "",
            "label": "System Default"
          },
          {
            "value": "BlackTheme",
            "label": "Black"
          },
          {
            "value": "BlackHCTheme",
            "label": "Black High Contrast"
          },
          {
            "value": "WhiteTheme",
            "label": "White"
          },
          {
            "value": "WhiteHCTheme",
            "label": "White High Contrast"
          },
          {
            "value": "WhiteEInkTheme",
            "label": "White E-Ink"
          }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "rotation",
        "label": "Map Rotation",
        "type": "object",
        "defaultValue": {
          "value": "NORTH_AT_TOP",
          "showCompass": true
        },
        "description": "VTM vector map rotation mode"
      },
      {
        "key": "theme",
        "label": "Render Theme",
        "type": "enum",
        "defaultValue": "DEFAULT",
        "options": [
          {
            "value": "DEFAULT",
            "label": "Default theme"
          }
        ],
        "description": "VTM styling theme"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonVolume",
    "shortName": "WButtonVolume",
    "title": "Media volume",
    "description": "Increase or decrease media volume",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "type",
        "label": "Action",
        "type": "enum",
        "defaultValue": 1,
        "options": [
          { "value": 1, "label": "Volume Up (+)" },
          { "value": 0, "label": "Volume Down (-)" }
        ],
        "description": "Media volume direction"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": true,
        "description": "Require long click to change volume"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WButtonVolumeReminder",
    "shortName": "WButtonVolumeReminder",
    "title": "Volume reminder",
    "description": "Shown only when the media volume is below the configured target volume. Tap to raise the volume to the target.",
    "category": "Action Buttons",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": false,
        "description": "Display title text on button"
      },
      {
        "key": "longClick",
        "label": "Require Long Click",
        "type": "boolean",
        "defaultValue": false,
        "description": "Require long click to raise volume"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WOptiUnfinishedFAIPotential",
    "shortName": "WOptiUnfinishedFAIPotential",
    "title": "FAI potential",
    "description": "Min and max FAI triangle length still achievable from the longest leg of the unfinished triangle",
    "category": "XContest",
    "defaultGrid": {
      "width": 8,
      "height": 3
    },
    "isPro": true,
    "baseClass": "MultiValueWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": false,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency (100% = transparent, 0% = opaque)"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "_title",
        "label": "Show Title",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display widget title"
      },
      {
        "key": "titletext",
        "label": "Custom Title",
        "type": "string",
        "defaultValue": "",
        "description": "Custom title override (Pro feature)"
      },
      {
        "key": "_unit",
        "label": "Show Unit",
        "type": "boolean",
        "defaultValue": true,
        "description": "Display unit label"
      },
      {
        "key": "real",
        "label": "Real Potential (▲)",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show the largest FAI triangle justified by flight so far"
      },
      {
        "key": "max",
        "label": "Maximum Achievable (↑)",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show maximum achievable FAI triangle length"
      },
      {
        "key": "min",
        "label": "Minimum Achievable (↓)",
        "type": "boolean",
        "defaultValue": true,
        "description": "Show minimum achievable FAI triangle length"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WDebugHwAccTestMap",
    "shortName": "WDebugHwAccTestMap",
    "title": "Debug HW acceleration test map",
    "description": "Empty map widget that prints the results of Canvas.isHardwareAccelerated() and View.isHardwareAccelerated()",
    "category": "Debug",
    "defaultGrid": {
      "width": 100,
      "height": 50
    },
    "isPro": false,
    "baseClass": "MapWidget",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 100,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WEmitTestEvent",
    "shortName": "WEmitTestEvent",
    "title": "Emit a test event",
    "description": "Triggers the selected event on click",
    "category": "Testing",
    "defaultGrid": {
      "width": 4,
      "height": 4
    },
    "isPro": false,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      },
      {
        "key": "event",
        "label": "Test Event",
        "type": "string",
        "defaultValue": "TAKEOFF",
        "description": "Event name to trigger"
      }
    ]
  },
  {
    "className": "org.xcontest.XCTrack.widget.w.WProFallback",
    "shortName": "WProFallback",
    "title": "Pro",
    "description": "Pro fallback placeholder widget",
    "category": "Others",
    "defaultGrid": {
      "width": 5,
      "height": 3
    },
    "isPro": true,
    "baseClass": "d0",
    "properties": [
      {
        "key": "_border",
        "label": "Border",
        "type": "boolean",
        "defaultValue": true,
        "description": "Draw widget border"
      },
      {
        "key": "_bg",
        "label": "Background Transparency",
        "type": "number",
        "defaultValue": 80,
        "min": 0,
        "max": 100,
        "step": 20,
        "unit": "%",
        "description": "Background transparency"
      },
      {
        "key": "_theme",
        "label": "Theme Override",
        "type": "enum",
        "defaultValue": "",
        "options": [
          { "value": "", "label": "System Default" },
          { "value": "BlackTheme", "label": "Black" },
          { "value": "BlackHCTheme", "label": "Black High Contrast" },
          { "value": "WhiteTheme", "label": "White" },
          { "value": "WhiteHCTheme", "label": "White High Contrast" },
          { "value": "WhiteEInkTheme", "label": "White E-Ink" }
        ],
        "description": "Force display theme for this widget"
      }
    ]
  }
];

/**
 * Known Legacy and Community Class Name Aliases -> Canonical Class Name
 */
export const WIDGET_ALIASES: Record<string, string> = {
  'org.xcontest.XCTrack.widget.w.WButtonSilenceVario': 'org.xcontest.XCTrack.widget.w.WButtonVario',
  'org.xcontest.XCTrack.widget.w.WButtonActionSilence': 'org.xcontest.XCTrack.widget.w.WButtonVario',
  'org.xcontest.XCTrack.widget.w.WButtonActionNavig': 'org.xcontest.XCTrack.widget.w.WButtonNavig',
  'org.xcontest.XCTrack.widget.w.WButtonActionZoom': 'org.xcontest.XCTrack.widget.w.WButtonZoom',
  'org.xcontest.XCTrack.widget.w.WButtonActionCamera': 'org.xcontest.XCTrack.widget.w.WButtonCamera',
  'org.xcontest.XCTrack.widget.w.WCompGlideToEss': 'org.xcontest.XCTrack.widget.w.WCompGlideToESS',
  'org.xcontest.XCTrack.widget.w.WCompSSPercentage': 'org.xcontest.XCTrack.widget.w.WCompPercentage',
  'org.xcontest.XCTrack.widget.w.WAltitudeMax': 'org.xcontest.XCTrack.widget.w.WAltitudeMaximum',
  'org.xcontest.XCTrack.widget.w.WCompassDigit': 'org.xcontest.XCTrack.widget.w.WCompassDigital',
  'org.xcontest.XCTrack.widget.w.WFlightLevel': 'org.xcontest.XCTrack.widget.w.WFL',
  'org.xcontest.XCTrack.widget.w.WOpenData': 'org.xcontest.XCTrack.widget.w.WExternalData',
  'org.xcontest.XCTrack.widget.w.WActiveLook': 'org.xcontest.XCTrack.widget.w.WDebugActivelook',
  'org.xcontest.XCTrack.widget.w.WDebugFps': 'org.xcontest.XCTrack.widget.w.WDebugFPS',
};

/**
 * Look up a widget definition by full class name, alias, or short name (e.g. 'WAltitude')
 */
export function getWidgetDefinition(classNameOrShortName: string): WidgetDefinition | undefined {
  const resolvedClass = WIDGET_ALIASES[classNameOrShortName] ?? classNameOrShortName;
  return WIDGET_CATALOG.find(
    (w) =>
      w.className === resolvedClass ||
      w.shortName === resolvedClass ||
      w.className === classNameOrShortName ||
      w.shortName === classNameOrShortName ||
      (w.aliases && w.aliases.includes(classNameOrShortName))
  );
}

/**
 * Get all widget definitions grouped by their UI category
 */
export function getWidgetsByCategory(): Record<WidgetCategory, WidgetDefinition[]> {
  const grouped = {} as Record<WidgetCategory, WidgetDefinition[]>;
  for (const cat of WIDGET_CATEGORIES) {
    grouped[cat] = [];
  }
  for (const widget of WIDGET_CATALOG) {
    const cat = widget.category as WidgetCategory;
    if (grouped[cat]) {
      grouped[cat].push(widget);
    } else {
      grouped[cat] = [widget];
    }
  }
  return grouped;
}

/**
 * Search widgets by text query (matches title, description, shortName, category, and class name)
 */
export function searchWidgets(query: string): WidgetDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return WIDGET_CATALOG;
  return WIDGET_CATALOG.filter(
    (w) =>
      w.title.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q) ||
      w.shortName.toLowerCase().includes(q) ||
      w.category.toLowerCase().includes(q) ||
      w.className.toLowerCase().includes(q)
  );
}

export function getAllCategories(): WidgetCategory[] {
  return [...WIDGET_CATEGORIES];
}

export default WIDGET_CATALOG;