# XCTrack Web Config Editor — Project Memory & Domain Reference (`MEMORY.md`)

> **Purpose**: Single source of truth for XCTrack `.xcfg` domain models, widget schemas, version differences, coordinate systems, device presets, and architectural decisions. Read before making design decisions or writing complex code; update whenever new domain context, architectural choices, or edge cases are discovered.

---

## 1. `.xcfg` File Format & Top-Level Structure

XCTrack configuration files (`.xcfg` / `.xccfg` / `.json`) are UTF-8 JSON documents with 2-space indentation (`org.xcontest.XCTrack.config.ExportConfig`). There are two export types controlled by `info.exportType`:

| Export Type | Top-Level Keys | Description |
| :--- | :--- | :--- |
| `"pages"` | `info`, `layout` | Screen layouts only (`portrait` & `landscape` pages + widgets). |
| `"backup"` | `info`, `layout`, `preferences`, `airspaceSelectedChannels`, `flarmUserTable` (optional) | Complete application backup including all pages, preferences, sensors, triggers, sounds, glider settings, and HUD layouts. |

### 1.1 `info` Object Schema
```json
{
  "device": "Google Pixel 8 Pro 16",
  "exportType": "backup",
  "proUpTo": 0,
  "timeCreated": "2026-03-12 19:44:33+0100",
  "versionCode": 91260,
  "versionName": "0.9.12.6"
}
```
- **Observed Versions in Workspace & APK**:
  - `2023-06-28_backup-00.xcfg`: `versionCode: 91020`, `versionName: "0.9.10.2"`, `exportType: "backup"`, `device: "Google Pixel 6 Pro 13"`
  - `2023-08-23_backup-00.xcfg`: `versionCode: 91031`, `versionName: "0.9.10.3"`, `exportType: "backup"`, `device: "Google Pixel 6 Pro 13"`
  - `2024-06-12_pages-00.xcfg`: `versionCode: 91191`, `versionName: "0.9.11.10"`, `exportType: "pages"`, `device: "Google Pixel 8 Pro 14"`
  - `2026-03-12_backup-00.xcfg`: `versionCode: 91260`, `versionName: "0.9.12.6"`, `exportType: "backup"`, `device: "Google Pixel 8 Pro 16"`
  - Decompiled APK (`xctrack-latest.apk`): `versionCode: 91210`, `versionName: "0.9.12.10"`

---

## 2. Screen Layout, Grid Math & Coordinate System (`layout`)

- `layout` always contains two orientation arrays:
  - `landscape`: `Page[]`
  - `portrait`: `Page[]`
- **Page Schema (`org.xcontest.XCTrack.widget.wp.*` / `org.xcontest.XCTrack.widget.i0`)**:
  - `CLASS`: One of 4 registered page classes (`vm.b`):
    1. `org.xcontest.XCTrack.widget.wp.WPThermalAssistant` — Default `navigations`: `"all"` (all 4 task types). Default templates: `res/raw/layout_thermalassistant_portrait.json` (10 widgets), `res/raw/layout_thermalassistant_landscape.json` (11 widgets).
    2. `org.xcontest.XCTrack.widget.wp.WPXCAssistant` — Default `navigations`: `["org.xcontest.XCTrack.navig.TaskBackToTakeoff", "org.xcontest.XCTrack.navig.TaskTriangleClosing", "org.xcontest.XCTrack.navig.TaskToWaypoint"]`. Default templates: `res/raw/layout_xcassistant_portrait.json` (6 widgets), `res/raw/layout_xcassistant_landscape.json` (10 widgets).
    3. `org.xcontest.XCTrack.widget.wp.WPCompetition` — Default `navigations`: `["org.xcontest.XCTrack.navig.TaskCompetition"]`. Default templates: `res/raw/layout_competition_portrait.json` (11 widgets), `res/raw/layout_competition_landscape.json` (15 widgets).
    4. `org.xcontest.XCTrack.widget.wp.WPEmpty` — Default `navigations`: `"all"`. Default template: `[]` (0 widgets).
  - `navigations`: Controls automatic page activation per task type (`i0.k()` & `i0.f()`):
    - `"all"` (when all 4 navigation modes are enabled)
    - `"none"` (when 0 navigation modes are enabled — page is hidden from automatic task switching)
    - `string[]` of 1–3 `org.xcontest.XCTrack.navig.*` classes:
      - `org.xcontest.XCTrack.navig.TaskBackToTakeoff` ("Back to takeoff")
      - `org.xcontest.XCTrack.navig.TaskTriangleClosing` ("Triangle closing")
      - `org.xcontest.XCTrack.navig.TaskToWaypoint` ("Waypoints / XC Navigation")
      - `org.xcontest.XCTrack.navig.TaskCompetition` ("Competition task")
  - `widgets`: `Widget[]` (ordered array; **Z-order is determined by array index** — later widgets render on top of earlier widgets when overlapping, e.g. data overlays on top of `WXCAssistant` or `WCompMap`).
- **Widget Coordinate System & Exact APK Grid Math** (`org.xcontest.XCTrack.ui.i0` & `org.xcontest.XCTrack.widget.d0`):
  - `X1`, `Y1`, `X2`, `Y2` are integers in the range `0..10000` (representing `0.00%` to `100.00%` of the page canvas width and height).
  - XCTrack dynamically computes `gridCols` and `gridRows` from `DisplayMetrics.densityDpi` so that each grid cell is physically **~3 mm × 3 mm**:
    - `cellSizePx = Math.max(8.0f, (3.0f / 25.1f) * densityDpi)` (`0.11952191f * densityDpi`)
    - Because `viewportDp = viewportPx * 160 / densityDpi`, the `densityDpi` factor cancels out: **1 grid cell = `19.1235 dp`**, and `gridCols = Math.round(viewportWidthDp / 19.1235)`.
  - **Exact Integer Serialization Math**:
    - **Grid → `.xcfg` (`d0.B`)**: `X = Math.floor((gridX * 10000 + Math.floor(gridCols / 2)) / gridCols)`
    - **`.xcfg` → Grid (`d0.k`)**: `gridX = Math.floor((X * gridCols + 5000) / 10000)`
  - **Verified Device Grids in Example `.xcfg` Files**:
    - `Google Pixel 6 Pro 13` (`411×891 dp`): Portrait **`22 × 43`** (with Android system bar insets) / **`22 × 47`** (fullscreen).
    - `Google Pixel 8 Pro 14` (`448×997 dp`): Portrait **`23 × 48`** (with Android 14 system bar insets).
    - `Google Pixel 8 Pro 16` (`448×997 dp`): Portrait **`23 × 52`** (fullscreen edge-to-edge on Android 16).
    - Built-in Landscape Templates (`res/raw/layout_*_landscape.json`, `360×640 dp` 16:9): **`33 × 19`** landscape / **`19 × 31`** portrait.
  - Full preset database of 32 device families (60+ models + ActiveLook & Maverick HUD glasses) is stored in `devices.json` in the project root.

---

## 3. Complete Widget Catalog & Property Schemas (79 Registered Classes in `org.xcontest.XCTrack.widget.o`)

### 3.1 Universal Base Properties (`org.xcontest.XCTrack.widget.d0`)
Every widget in `org.xcontest.XCTrack.widget.w.*` has:
- `CLASS` (`string`): Full class name (`org.xcontest.XCTrack.widget.w.W*`).
- `X1`, `Y1`, `X2`, `Y2` (`number`, `0..10000`): Bounding box coordinates.
- `_border` (`boolean`): Draw widget border (default `false` for most widgets; `true` for `WButton*`).
- `_bg` (`number`, `0..100`, step `20`): **Background Transparency %** (`R.string.widgetSettingsBackgroundTransparency2`).
  - **CRITICAL SEMANTICS**: `_bg: 100` = **100% transparent** (no background fill; `alpha = 0`), `_bg: 0` = **0% transparent / 100% opaque** (`alpha = 255`). Formula in `d0.getBackgroundAlpha()`: `((100 - _bg) * 255) / 100`.
  - Default is `100` (transparent) for most widgets, `50` or `80` for `WButton*` widgets.
- `_theme` (`string`): Display theme override:
  - `""` (System/global theme — default on non-map widgets)
  - `"auto"` (Map widgets only — automatic according to map)
  - `"BlackTheme"` ("Black")
  - `"BlackHCTheme"` ("Black High Contrast")
  - `"WhiteTheme"` ("White")
  - `"WhiteHCTheme"` ("White High Contrast")
  - `"WhiteEInkTheme"` ("White E-ink")

### 3.2 Base Widget Subclasses
- **`TextWidget` (`gw=5, gh=3`)**: adds `_title` (`boolean`, default `true`), `titletext` (`string`, default `""`).
- **`ValueWidget` (`gw=8, gh=3`)**: adds `_title` (`true`), `titletext` (`""`), `_unit` (`true`), `_hide_labels` (`false`).
- **`WeightedTextWidget` (`gw=5, gh=3`)**: adds `_title` (`true`), `titletext` (`""`), `_hide_labels` (`false`).
- **`WNextTurnpointSomething` (`gw=8, gh=3`)**: extends `ValueWidget`, adds `navigation_target` (`"POINT" | "OPTIMIZED" | "CYLINDER"`, default `"OPTIMIZED"`), `use_brackets` (`boolean`, default `true`).
- **`WNextTurnpointSpeedSomething` (`gw=8, gh=3`)**: extends `WNextTurnpointSomething`, adds `speed_type` (`"GROUND" | "AIRSPEED" | "GLIDE" | "XC"`, default `"GROUND"`), `speed_avg` (`int` ms, default `0`).
- **`MapWidget` (`gw=10, gh=10`)**: base for `WXCAssistant` and `WCompMap` with 30+ map settings (`mapWidget_mapAppearance`, `mapWidget_osmLanguage`, `rotation`, `mapWidget_scale`, `mapWidget_pilotPosCenter`, `mapWidget_pilotEdgeDistance`, `mapWidget_drawScale`, `mapWidget_drawBearing`, `fontSize`, `mapWidget_heading_arrow_sizecoef`, `line_thickness`, `tracklog_color`, `mapWidget_showRainRadar`, `mapWidget_showKK7`, `mapWidget_KK7opacity`, `mapWidget_KK7timed`, `mapWidget_KK7timedOpacity`, `mapWidget_showAirspaces`, `postponedFloorLimit`, `postponedDisplayDistance`, `mapWidget_emergencyObstacles`, `mapWidget_emergencyZoom`, `live_ShowNearby`, `live_ShowTracklogs`, `wpt_showWaypoints`, `wpt_showCities`, `wpt_showTakeoffs`, `nav_target`, `nav_use_brackets`, `nav_line`, `thermals`, `nav_showWind`, `nav_showSun`, `live_ShowFinalGlide`, `live_ShowFinalGlideAvg`, `mapWidget_showRelativePositionWhilePanning`, etc.).

### 3.3 All 79 Registered Widget Classes by Category (`o.java`)
1. **System (3 in `o.java` under `wgSystem`, plus time/airtime/sunset under `wgFlying`)**:
   - `WStatusLine` (`gw=100, gh=1`): `showGps`, `showSensors`, `showLive`, `showLiveLabel`, `showBatteryIcon`, `showBatteryPercent`, `showTime`
   - `WBrightnessInfo` (`ValueWidget`, `gw=8, gh=3`)
   - `WLastEvent` (`TextWidget`, `gw=5, gh=3`)
2. **Flying (20 widgets)**:
   - `WTime` (`TextWidget`, `gw=8, gh=3`): `showSec` (`bool`)
   - `WSpeed` (`ValueWidget`, `gw=8, gh=3`): `_units` (`"SYS_UNIT"|"KM_H"|"M_S"|"MP_H"|"KT"`), `backwardDetection` (`bool`)
   - `WAirSpeed` (`ValueWidget`, `gw=8, gh=3`): `_units`, `_type` (`"TAS"|"IAS"`)
   - `WBearing` (`ValueWidget`, `gw=5, gh=3`): `degrees` (`bool`)
   - `WAltitude` (`ValueWidget`, `gw=8, gh=3`): `_units` (`"SYS_UNIT"|"METER"|"FOOT"`)
   - `WBaroAltitude` (`ValueWidget`, `gw=8, gh=3`): `_altType` (`"QNH"|"STD"`), `_units`
   - `WAMSL` (`ValueWidget`, `gw=8, gh=3`): `_units`
   - `WFL` (`ValueWidget`, `gw=8, gh=3`): `_decimals` (`"DEC_0"|"DEC_1"|"DEC_2"`)
   - `WAltitudeAboveGround` (`ValueWidget`, `gw=8, gh=3`)
   - `WTakeoffHeightAbove` (`ValueWidget`, `gw=8, gh=3`)
   - `WVerticalSpeed` (`ValueWidget`, `gw=8, gh=3`): `avg` (`int` ms)
   - `WVarioColumn` (`d0`, `gw=3, gh=100`): `avg` (`int` ms)
   - `WGlide` (`ValueWidget`, `gw=8, gh=3`): `avg` (`int` ms), `showVario` (`bool`), `varioAvg` (`int` ms), `headless` (`bool`)
   - `WLocation` (`TextWidget`, `gw=5, gh=4`): `_format` (`"DEG"|"DEG_MIN"|"DEG_MIN_SEC"|"UTM"`)
   - `WAirTime` (`TextWidget`, `gw=5, gh=3`): `time_format` (`"WITH_UNITS"|"COMPACT"|"HMS"|"HM"`)
   - `WSunset` (`ValueWidget`, Pro, `gw=8, gh=3`): `relative` (`"ABSOLUTE_TIME"|"RELATIVE_TIME"`), `showBefore` (`int` ms)
   - `WSunsetCivil` (`WSunset`, Pro, `gw=8, gh=3`): `relative`, `showBefore`
   - `WVerticalGraph` (`d0`, `gw=10, gh=5`): `interval` (`int` ms), `vertical_step` (`int` m), `dot_size` (`int`), `dot_color` (`int` ARGB)
   - `WAltitudeMaximum` (`ValueWidget`, `gw=8, gh=3`): `_units`
   - `WNettoVario` (`ValueWidget`, `gw=8, gh=3`): `netto_avg` (`int` ms)
3. **Air (8 widgets)**:
   - `WWindSpeed` (`ValueWidget`, `gw=8, gh=3`)
   - `WWindDirection` (`TextWidget`, `gw=5, gh=3`): `degrees` (`bool`)
   - `WThermalAssistant` (`d0`, `gw=10, gh=10`): `rotation`, `mapScale`, `drawScale`, `fontSize`, `mapWidget_heading_arrow_sizecoef`, `mapWidget_showAirspaces`, `postponedFloorLimit`, `postponedDisplayDistance`, `interval`, `drawCircle`, `includeWindAlgorithm`, `nav_target`, `nav_use_brackets`, `nav_line`, `thermals`, `nav_showWind`, `nav_showSun`, `line_thickness`, `mapWidget_drawBearing`
   - `WThermalAltGain` (`ValueWidget`, `gw=8, gh=3`)
   - `WAltitudeDataGraph` (`d0`, Pro, `gw=10, gh=20`): `type` (`"GRAPH_THERMAL"|"GRAPH_WIND"|"GRAPH_SPEED"`), `interval`, `color_thermal`, `color_wind`, `color_speed`, `line_thickness`, `text_size`
   - `WQNH` (`ValueWidget`, `gw=8, gh=3`)
   - `WAirTemperature` (`ValueWidget`, `gw=8, gh=3`): `_units` (`"SYS_UNIT"|"CELSIUS"|"FAHRENHEIT"`)
   - `WAirHumidity` (`ValueWidget`, `gw=8, gh=3`)
4. **XContest (4 widgets)**:
   - `WXCAssistant` (`MapWidget`, `gw=10, gh=10`): All `MapWidget` properties + `routes`, `faiAreas`, `faiAreasMinMax`, `legDistance`, `legPercentage`, `closingCircle`
   - `WOptiResult` (`ValueWidget`, `gw=8, gh=3`)
   - `WOptiUnfinishedTriangle` (`ValueWidget`, `gw=8, gh=3`)
   - `WXCSpeed` (`ValueWidget`, `gw=8, gh=3`)
5. **Navigation (11 widgets)**:
   - `WCompass` (`d0`, `gw=5, gh=5`): `rotation` (`"NORTH"|"HEADING"|"BEARING"|"TRAVEL_DIRECTION"`), `showBackground`, `showBearing`, `showHeading`, `showWind`, `newWindArrow`, `navigation_target`
   - `WCompassDigital` (`TextWidget`, `gw=5, gh=3`): `target`, `relative`, `degrees`
   - `WSideView` (`d0`, `gw=100, gh=6`): `type` (`"SIDE_BEARING"|"SIDE_NAVIG"`), `distance` (`int` m), `finalGlideAvg` (`int` ms)
   - `WNextTurnpoint` (`WeightedTextWidget`, `gw=5, gh=3`)
   - `WNextTurnpointDistance` (`WNextTurnpointSomething`, `gw=8, gh=3`)
   - `WNextTurnpointTimeOfArrival` (`WNextTurnpointSpeedSomething`, `gw=8, gh=3`): `time_format`
   - `WNextTurnpointAlt` (`WNextTurnpointSomething`, `gw=8, gh=3`): `speed_avg`, `altitude` (`"AGL"|"AMSL"|"DROP"`), `glide` (`"ACTUAL"|"COMPUTED"`)
   - `WNextTurnpointGlideTo` (`WNextTurnpointSomething`, `gw=8, gh=3`): `alt_above` (`int` m), `headless` (`bool`)
   - `WAirspaceProximity` (`d0`, `gw=5, gh=3`): `maxDistance`, `_shownearinside`, `_showoriginalheightline`, `_showrecomputedheightline`, `_splitdirection` (`"AUTO"|"HORIZONTAL"|"VERTICAL"`), `postponedFloorLimit`, `postponedDisplayDistance`
   - `WTakeoffDistance` (`ValueWidget`, `gw=8, gh=3`)
   - `WTakeoffCourse` (`ValueWidget`, `gw=8, gh=3`): `degrees` (`bool`)
6. **Competition (12 widgets)**:
   - `WCompMap` (`MapWidget`, `gw=10, gh=10`): All `MapWidget` properties (with `mapWidget_scale.auto_comp` support)
   - `WCompDistanceToGoal` (`ValueWidget`, `gw=8, gh=3`)
   - `WCompDistanceToESS` (`ValueWidget`, `gw=8, gh=3`)
   - `WCompAltitudeOverGoal` (`ValueWidget`, `gw=8, gh=3`)
   - `WCompAltitudeOverESS` (`ValueWidget`, `gw=8, gh=3`)
   - `WCompGlideToGoal` (`ValueWidget`, `gw=8, gh=3`): `headless` (`bool`)
   - `WCompGlideToESS` (`ValueWidget`, `gw=8, gh=3`): `headless` (`bool`)
   - `WCompTimeToStart` (`ValueWidget`, `gw=8, gh=3`): `time_format`
   - `WCompTimeAtStart` (`WNextTurnpointSpeedSomething`, `gw=8, gh=3`): `time_format`
   - `WCompSpeedToStart` (`WNextTurnpointSomething`, `gw=8, gh=3`)
   - `WCompPercentage` (`ValueWidget`, `gw=8, gh=3`)
   - `WCompTaskSummary` (`d0`, `gw=6, gh=6`)
7. **Livetracking (1 widget)**:
   - `WLiveMessage` (`d0`, `gw=20, gh=5`): `line_count` (`1..5`), `show_time` (`int` sec)
8. **Action Buttons (7 widgets, `gw=4, gh=4`, `_border=true`)**:
   - `WButtonNavig`: `type` (`"ACTION_NEXT_WAYPOINT"|"ACTION_PREV_WAYPOINT"`), `longClick` (`bool`)
   - `WButtonPhone`: `_title`, `showContact`, `longClick`, `callBackground`, `phoneNumber`, `callType` (`"C_DIAL"|"C_CALL"|"C_CALL_LOUD"`)
   - `WButtonCamera`: `_title`, `longClick`
   - `WButtonZoom`: `type` (`"ACTION_ZOOM_IN"|"ACTION_ZOOM_OUT"`)
   - `WButtonVario`: `_title`, `longClick` (also legacy alias `WButtonSilenceVario`)
   - `WButtonBrightness`: `_title`, `type` / `action` (`"ACTION_PLUS"|"ACTION_MINUS"`)
   - `WButtonIntentLauncher` (Pro): `_title`, `longClick`, `name`, `intent_action`
9. **Others (3 widgets)**:
   - `WFreeText` (`d0`, `gw=5, gh=3`): `text`, `color_text`, `color_bg`, `text_size`, `text_bold`, `text_italic`, `text_padding`
   - `WWebView` (`d0`, Pro, `gw=10, gh=10`): `url` (supports `${lat}`, `${lng}`, `${hdg}`, `${spd}`, `${alt}`), `initialScale`, `scrollSettings`, `refreshInterval`, `allowGsp`, `allowXCTrackJS`, `allowClickPassing`, `allowInteraction`, `saveButtonPos` (`"BOT_LEFT"|"BOT_CENTER"|"BOT_RIGHT"`)
   - `WExternalData` (`ValueWidget`, `gw=8, gh=3`): `position` (`1..30`), `suffix` (`string`)
10. **Testing (2 widgets)**:
    - `WLastKey` (`TextWidget`, `gw=5, gh=4`)
    - `WLogPeek` (`d0`, `gw=10, gh=20`): `lines_count`, `reverse`, `filter`, `color_text`, `color_bg`, `text_size`
11. **Debug (7 widgets)**:
    - `WDebugDetectedActivity`, `WDebugActivelook`, `WDebug`, `WDebugFPS`, `WDebugSystemInfo`, `WDebugFont` (`show`), `WVTM` (`rotation`, `theme`)
*(Plus legacy/community widget class names seen in `XCTrackLayoutEditor` so any older `.xcfg` still renders and edits cleanly.)*

---

## 4. Schema Evolution & Tricky Edge Cases (`0.9.10` -> `0.9.11` -> `0.9.12.10`)

1. **`_bg` Is Background Transparency %, NOT Opacity %**:
   - `_bg: 100` means **100% transparent** (0% background fill alpha).
   - `_bg: 0` means **0% transparent** (100% opaque background fill alpha).
   - Formula: `alpha = (100 - _bg) / 100`.
2. **Map Appearance (`0.9.12+`)**:
   - Pre-`0.9.12`: Used boolean `mapWidget_showOpenStreet` and `mapWidget_showTerrain`.
   - `0.9.12+`: Replaced with `mapWidget_mapAppearance: { "theme": "None" | "ClearpilotForest" | ..., "terrain": "Light" | ... }` and `mapWidget_osmLanguage: ""`.
   - **Editor rule**: Support both formats in the property inspector and preserve whichever keys exist in the imported `.xcfg`.
3. **Signed 32-bit ARGB Color Integers vs Hex Strings**:
   - In `.xcfg` files exported from `0.9.10`–`0.9.12.6`, colors (`tracklog_color: -27091`, `color_thermal`, `dot_color`) are serialized as **signed 32-bit Java `int` values** (`0xAARRGGBB` in two's complement, where `-1` is `0xFFFFFFFF` white, `-27091` is `0xFFFF962D`).
   - Conversion in JS/TS: `colorInt = (argb >>> 0) | 0` (signed 32-bit int), and to hex `#RRGGBB`: `'#' + (colorInt & 0xFFFFFF).toString(16).padStart(6, '0')` with alpha `((colorInt >>> 24) & 0xFF)`. Always serialize back in the same type (number vs string) present in the widget or expected by XCTrack.
4. **Preserve Unknown / Unedited Keys**:
   - Round-trip fidelity is critical: importing an `.xcfg` and exporting it without changes must preserve all unedited keys, nested objects, and ordering conventions.
5. **Spelling Quirk in `WWebView`**:
   - XCTrack spells the GPS permission property `allowGsp` (not `allowGps`). Must be preserved as `allowGsp`.
6. **Preferences Evolution (`0.9.12+`)**:
   - Legacy 17 flat `Sensors.*` keys were consolidated into `Sensors.Configuration` (`{ sensors: [...] }`).
   - `EventMapping` is a pipe-delimited string prefixed with `"001"`, e.g. `"001START_THERMALING:SHOW_THERMAL_ASSISTANT|STOP_THERMALING:SHOW_LAST_PAGE"`.
   - `Sound.AcousticVario.CustomProfile` contains `{"confTable": [{"lift": float, "freq": int, "cycleMs": int, "duty": int}, ...]}`.
   - `ActiveLook.Layout` and `Maverick.Layout` store smart-glasses HUD widget layouts inside `preferences`.


---

## 7. Editor Architecture & Component Hierarchy

### 7.1 Sidebar Panels (Task 3 - v0.3.0)
- **Vertical Icon Rail**: Leftmost 48px rail switching between Pages, Widgets, and Layers with collapse capability.
- **`PageManagerPanel`**:
  - Displays list of pages for active orientation (`portrait` or `landscape`).
  - Page cards show page title, class name, widget count, and auto-activation task badge (`navigations`).
  - Actions: Add Page (modal selecting template with optional widget seeding), Duplicate Page, Delete Page (maintains at least 1 page), Reorder Pages (up/down), Copy to Opposite Orientation, and Task Navigation filter modal.
- **`WidgetPalettePanel`**:
  - Full catalog of all 79 registered XCTrack widget classes.
  - Search filter (matches title, description, class, category) + Category filter chips (System, Flying, Air, XContest, Navigation, Competition, Livetracking, Action Buttons, Others, Testing, Debug).
  - Clicking a widget adds it centered on the canvas according to its default grid dimensions (`gw` × `gh`) with default properties.
- **`LayerOrderPanel`**:
  - Displays all widgets on the active page in exact Z-order (array index 0 = bottom/background map, highest index = top overlay).
  - Drag-like or arrow-button reordering (Bring Forward, Send Backward, Bring to Front, Send to Back).
  - Eye visibility toggling, title/unit preview, and selection syncing.
- **`WidgetPropertyInspector`**:
  - Right sidebar (320px) displaying properties of the currently selected widget.
  - **Geometry & Grid**: Discrete grid coordinate inputs (`gx1, gy1, gx2, gy2`), cell dimensions (`gw × gh`), quick fit buttons (Full Width, Full Height, Fill Screen, Center Horizontally, Center Vertically), snap toggle, and normalized coordinate view (`0..10000`).
  - **Appearance & Style**: Border toggle (`_border`), Background Transparency slider (`_bg`, `0..100%`) with visual transparency preview and preset chips (0%, 50%, 80%, 100%), theme override dropdown (`_theme`).
  - **Title & Unit Labels**: Show Title (`_title`), custom title override (`titletext`), show unit (`_unit`), hide labels (`_hide_labels`).
  - **Specialized Type Panels**:
    - Map Widgets: Map rotation (`NORTH_AT_TOP`, `BEARING_AT_TOP`, etc.), default zoom scale slider (`mapWidget_scale`), tracklog color picker with signed 32-bit int serialization, compass rose toggle (`showCompass`).
    - Action Buttons: Click action dropdown, long click action dropdown.
    - Free Text: Textarea, text size, color picker, bold, italic.
    - Web View: URL, auto-refresh interval, `allowGsp`.
  - **Raw & Preserved Properties**: Collapsible viewer/editor for all unmanaged keys, plus custom key-value property adder, preserving 100% round-trip fidelity.


### 7.2 Preferences & Backup Editor (Task 4 - v0.4.0)
- **`PreferencesEditor`**:
  - **Export Type Selector**: Switch between `"backup"` (complete application state) and `"pages"` (layouts only).
  - **Pilot & Glider**: Configures `Pilot.Name`, `Glider.Name`, `Glider.FAIClass` (1 to 5), `Glider.EngineType`, `Glider.TrimSpeed`, `Glider.GoalGlideRatio`, and `TakeoffSpeed`.
  - **Display & Units**: Configures `Display.Theme` (Black, BlackHC, White, WhiteHC, WhiteEInk), `Display.Orientation`, `Display.Fullscreen`, `Display.RepaintInterval`, and `Unit.*` (`Altitude`, `Speed`, `VerticalSpeed`, `Distance`).
  - **Acoustic Vario & Sounds**:
    - Interactive 16-point vario curve editor (`Sound.AcousticVario.CustomProfile.confTable`) specifying `lift` (m/s), `freq` (Hz), `cycleMs` (period duration), and `duty` (% on vs off).
    - **Live Web Audio Synthesizer**: Interactive slider (-7 to +7 m/s) with real-time tone generation reproducing continuous sink tones and chopped lift beeps using Web Audio API `OscillatorNode` and `GainNode`.
    - Notification sound alert checkboxes for takeoff, landing, GPS fix, airspace violations, turnpoint crossings, obstacles, and Bluetooth connections.
  - **Triggers & Events**:
    - Visual rule manager parsing and generating XCTrack's `EventMapping` string (prefixed with `001` and pipe-delimited `EVENT:ACTION`).
  - **Hardware Keybindings**:
    - Android keycode configuration for `Keys.NextPage`, `Keys.PreviousPage`, `Keys.ZoomIn`, `Keys.ZoomOut`, `Keys.EnterPan`, `Keys.Menu`, `Keys.NextWaypoint`, `Keys.PrevWaypoint`.
  - **Sensors & Airspace**:
    - Sensor manager displaying BLE and internal sensor filters (`BARO`, `GPS`, `FLARM`), plus `airspaceSelectedChannels` list.
  - **Diff & Validation**:
    - Live validation report via `validateXcfg` verifying all top-level keys, page structure, coordinates (`0..10000`), and widget schemas.
    - Change summary tracking modifications between current editing session and originally loaded file.
    - 1-click clipboard export of formatted JSON.

---

## 8. Typography, Dynamic Font Scaling & Ground-Truth Verification (Task 5 - v0.5.0)

### 8.1 Exact Fonts from APK
- **Values / Telemetry Numbers**: `droidsans_bold_xctrack_custom.ttf` (`t0.f25747g0` / `R.font.droidsans_bold_xctrack_custom`). Digit aspect ratio is ~0.58.
- **Titles & Units**: `roboto_condensed_bold.ttf` (`t0.f25753h0` / `Typeface.DEFAULT_BOLD`).

### 8.2 Layout & Rendering Rules (Decompiled `theme/a.java` & `ValueWidget.java`)
1. **Title Rendering (`theme.a0`)**:
   - Drawn horizontally centered at `x = width / 2` (`Paint.Align.CENTER`), uppercase, bold, color `#808080` (`Color.rgb(128, 128, 128)`).
   - Vertical allocation: `titleHeight = Math.max(12, Math.min(18, Math.round(heightPx * 0.22)))` if `_title !== false`.
   - If `_title: false`, `titleHeight = 0` (e.g. `WVerticalSpeed` on page 0 fills the entire box).
2. **Value Scaling & No Wrapping (`theme.U`)**:
   - Available box: `availW = Math.max(10, widthPx - 8)`, `availH = Math.max(10, heightPx - titleHeight - 6)`.
   - Single line guarantee (`white-space: nowrap`, `overflow: hidden`).
   - `fontSizePx = Math.max(10, Math.floor(Math.min(availH * 0.85, valAvailW / Math.max(1.0, val.length * 0.58))))`.
3. **Unit Placement**:
   - If `_unit !== false` and unit exists, unit takes baseline position with `fontSize ~ 38%` of value size.
   - If `_unit: false` (or unit empty/null like `WAirTime`), value expands across 100% of available width.
4. **`WAirTime` Formatting (`WAirTime.java` line 61)**:
   - Format is `String.format(Locale.ENGLISH, "%d:%02d", hours, mins)` (e.g. `"2:15"`), **NOT `"2h 15m"`**.
5. **Border & Background Alpha (`d0.java`)**:
   - `_border: true`: 1px outline with `#808080` (`Color.rgb(128, 128, 128)`).
   - `_bg`: Transparency % where `alpha = ((100 - _bg) * 255) / 100`.

### 8.3 Ground-Truth Verification Pipeline
- `scripts/ReferenceRenderer.java`: Headless Java program loading `droidsans_bold_xctrack_custom.ttf` to render pixel-accurate layout ground truth directly from decompiled equations.
- `scripts/verify-rendering.mjs`: Connects to Chromium via CDP/Puppeteer, snapshots `#phone-screen-canvas`, verifies widget text metrics and formatting, and stitches a side-by-side comparison (`rendering_comparison.png`).
- `scripts/CompositeRenderer.java`: Builds a side-by-side visual comparison image between the APK reference and Web App canvas.

---

## 9. Stacking Contexts, Z-Index Management & Portals (Task 6 - v0.6.0)

### 9.1 CSS Stacking Context Isolation
- **Widget Layer Order**:
  - Each widget in `ScreenCanvas` now explicitly defines `zIndex: isSelected ? 40 : index + 1`. This isolates widget interiors into their own stacking contexts according to their array index (Z-order).
  - Unnecessary `z-index` classes (`z-10`) were removed from internal elements inside `WidgetPreview` (titles, compass arrows, and vario markers) so child elements cannot escape to higher stacking contexts or bleed across overlapping widgets.
- **Root-Level Portals for Overlays & Dialogs**:
  - All modals (`PageTaskActivationRules`, `AddPageModal`, `CustomResolutionModal`) are rendered via React `createPortal(..., document.body)` with `z-[100]`, backdrop blur, and opaque slate styling.
  - This eliminates stacking context trapping where modals nested inside the sidebar (`z-10`) were pierced by canvas elements and widget titles.

---

## 10. Map Appearance, Vector Themes, Hillshading & Relief (Task 7 - v0.7.0)

### 10.1 XCTrack Map Settings & Serialization
- **Legacy vs Modern Serialization**:
  - Legacy (`v0.9.10 - v0.9.11`): `mapWidget_showOpenStreet: boolean` (Road Map toggle), `mapWidget_showTerrain: boolean` (Terrain toggle).
  - Modern (`v0.9.12+`): `mapWidget_mapAppearance: { theme: string, terrain: string }` (`org.xcontest.XCTrack.widget.helper.r`).
  - Road Map Disabled: Either `theme === 'None'` or `mapWidget_showOpenStreet === false`.
  - Terrain Relief Disabled: Either `terrain === 'None'` or `mapWidget_showTerrain === false`.

### 10.2 OSM Vector Map Themes (`e0.java` - 17 Themes)
1. `None` — Vector roads disabled (only terrain relief, airspaces, and task).
2. `ClearpilotForest` [Pro] — Semi-transparent roads with lush green forest polygons.
3. `ClearpilotForestBig` [Pro] — Clearpilot with forest polygons and enlarged high-vibration cockpit typography.
4. `ClearpilotForestDark` [Pro] — High contrast dark/night theme with forest polygons.
5. `ClearpilotForestDarkBig` [Pro] — Dark theme with forests and enlarged cockpit typography.
6. `Clearpilot` — Clean semi-transparent roads designed for paragliding cockpit readability.
7. `ClearpilotDark` — Dark paragliding cockpit map with semi-transparent roads.
8. `Hyperpilot` — High-contrast neon vectors on dark background.
9. `HyperpilotBlack` — OLED pure black background with neon road vectors.
10. `Lightpilot` — Clean white background with crisp gray/black road lines.
11. `Frenchkiss` — French aeronautical chart styling with soft pastels.
12. `VtmDefault` — Standard OpenStreetMap VTM vector theme.
13. `Newtron` — Cyberpunk high-tech neon cyan/magenta styling.
14. `Osmagray` — Grayscale monochrome map optimized for E-Ink and direct sun glare.
15. `Osmarender` — Classic OpenStreetMap vector map style.
16. `Tronrender` — Electric cyan wireframe grid on black.
17. `Custom` [Pro] — User-provided custom VTM XML style sheet file.

### 10.3 Terrain & Hillshading Profiles (`c0.java` - 7 Profiles)
- **Hillshading-Only vs Full Relief Gradients**:
  - `LightShading` & `DarkShading`: **Hillshading only** (`hasHillshading: true`, `hasElevationGradient: false`). Applies directional 3D slope shadows with transparent elevation tint so underlying vector maps remain clear.
  - `Light`, `Dark`, `XContest`, `LightLegacy`: **Full Elevation Relief** (`hasHillshading: true`, `hasElevationGradient: true`). Applies elevation color gradients (green valleys -> beige plateaus -> brown peaks -> white snow) combined with directional 3D hillshading.
  - `None`: Completely flat background (`hasHillshading: false`, `hasElevationGradient: false`).

### 10.4 Curated Appearance Presets (`r.java` - 25 Presets across 5 Categories)
- **Featured Relief**: Clearpilot [forests] • Light Relief, Clearpilot • Light Relief, Clearpilot [dark] • Dark Relief, Hyperpilot-black • Dark Relief, XContest Topo.
- **Extra Relief**: Clearpilot [forests] • Extra Light Relief, Clearpilot [forests, big fonts] • Extra Light Relief, Clearpilot [forests, dark] • Extra Dark Relief, Lightpilot • Extra Light Relief.
- **Classic Hillshading**: Clearpilot [forests] • Hillshading, Clearpilot • Hillshading, Hyperpilot-black • Dark Hillshading, Hyperpilot-black (Flat Roads), Frenchkiss • Hillshading, VTM Default • Hillshading, NEWTRON • Dark Hillshading, OSMAGRAY • Hillshading, OSMARENDER (Classic), TRONRENDER.
- **Relief Only**: Light Relief Only, Dark Relief Only, Light Legacy Relief Only.
- **Empty**: Empty Map (No Roads, No Terrain).

### 10.5 Interactive Gallery Modal & Canvas Visualization
- **`MapStyleGalleryModal.tsx`**: Full-screen modal via portal displaying interactive mini-map preview cards with realistic roads, terrain gradients, hillshading shadows, forest polygons, and 1-click preset application.
- **Canvas Map Visualization (`WidgetPreview.tsx`)**: Dynamically renders the selected road theme, forest polygons, terrain elevation relief, hillshading shadows, KK7 thermals, rain radar clouds, and airspaces on `WXCAssistant` and `WCompMap`.

### 10.6 Widget Selection List & Navigation Controls
- **Page Widgets List in Inspector**: When no widget is selected on the canvas, the right inspector panel displays a searchable list of all page widgets with position/size badges and "Select ➔" buttons, eliminating the need to click canvas visuals.
- **Widget Switcher Header**: When a widget is inspected, a `<select>` dropdown and Previous (`<`) / Next (`>`) buttons remain permanently visible at the top of the inspector for zero-click switching.
- **Top Toolbar Undo / Redo**: Added prominent, labeled Undo (`Ctrl+Z`) and Redo (`Ctrl+Y`) buttons to the top toolbar with disabled state management.

### 10.7 Canvas Drag & Resize Undo Snapshot Semantics (v0.8.0)
- **Problem**: During canvas mouse dragging/resizing, coordinates were updated with `saveUndo = false` to avoid pushing 60 undo snapshots per second. However, `handleMouseUp` previously did not commit an undo entry, leaving `undoStack` untouched and the Undo button disabled after canvas operations.
- **Solution**:
  - `dragState` now captures `initialConfig` before the drag begins.
  - On `handleMouseUp`, if the widget's final coordinates differ from `initialCoords`, `editorStore.recordCustomUndo(dragState.initialConfig)` pushes the pre-drag configuration snapshot onto the undo stack and clears redo stack.
  - Undo restores the pre-drag position, and Redo restores the moved/resized position.
- **Layout-Agnostic Keyboard Shortcuts (`e.code === 'KeyZ'` / `'KeyY'`)**:
  - Handlers in `App.tsx` and `ScreenCanvas.tsx` now check both `e.key` and physical `e.code` (`KeyZ`, `KeyY`, `KeyD`), ensuring that macOS Cmd-Z / Cmd-Shift-Z and Windows/Linux Ctrl-Z / Ctrl-Y work properly across all keyboard layouts (including Russian, Cyrillic, and international QWERTZ/AZERTY layouts).

### 10.8 High-Fidelity Realistic Map Section Engine (`RealisticMapSection.tsx` - v0.10.0)
- **Problem**: Earlier map representations used abstract wavy mock lines that did not represent an actual section of a map, making it difficult for pilots to evaluate how vector themes and hillshading profiles affect real-world paragliding terrain.
- **Solution (`RealisticMapSection.tsx`)**: Built a reusable, resolution-independent SVG map engine (`viewBox="0 0 1000 1000"`) modeling an authentic alpine paragliding sector (Lake Annecy / Doussard / Col de la Forclaz / Tournette massif):
  - **Topography & Elevation**: High massif gradient, west ridge gradient, subtle contour isolines (500m, 1000m, 1500m, 2000m), and directional 3D slope hillshading (illuminated NW slopes, deep SE shadow gullies).
  - **Hydrology**: Mountain lake with natural bays, islands, and river network feeding into the basin.
  - **OSM Landuse & Vegetation**: Organic alpine forest polygons (colored via `theme.preview.forestFill` in `ClearpilotForest*` themes) and urban village settlement footprints (`DOUSSARD`, `Talloires`, `Montmin`).
  - **OSM Vector Road Network**: Cased primary highway/corridor, secondary valley routes, town grid lanes, railway with cross-ties, and the iconic alpine pass road with **6 hairpin switchbacks** climbing to takeoff.
  - **Flight & Aeronautical Overlays**: Takeoff site (`⚑ Takeoff 1150m`), landing field (`⚑ LZ Doussard`), summit spot heights (`▲ La Tournette 2351m`), controlled airspace sector (`TMA CHAMBERY 1 / FL115`), thermal trigger circles with climb rates, competition turnpoint cylinder (`TP1 (R:1km)`), and pilot glider with tracklog snail trail.
  - **Unified Rendering**: Shared between `WidgetPreview.tsx` (canvas widgets) and `MapStyleGalleryModal.tsx` (gallery thumbnails).

### 10.9 Exact Decompiled VTM Themes & Hypsometric Relief Specifications (`xctrack-vtm-specs.ts` - v0.11.0)
- **Source**: Reverse-engineered directly from APK decompiled assets (`vtm_themes/`, `vtm/`) and native ARM64/x86_64 library disassembly (`libxctrack-native.so`):
  - `ElevProfile::getHeightRgb(double)`: Binary struct with 8-byte stops `(int32 elevation_meters, uint8 r, uint8 g, uint8 b, uint8 pad)`.
  - `ColorProfile::ColorProfile(bool isDark, double amb, double diff, double spec, Rgb contourColor, bool isBackground, ElevProfileType type)`: Native lighting, contour color, and elevation profile assignment.
  - `Generator::contoursM`: Native contour generation intervals: `10m` (minor), `50m` (intermediate), `100m` (index/major).
- **Exact Native Hypsometric Profiles**:
  1. **`XContest`** (8 stops):
     - `0m`: `#6aa050` (lush valley green)
     - `200m`: `#50b240` (grassland green)
     - `700m`: `#c7c748` (pasture yellow-green)
     - `1100m`: `#ab8f3a` (foothills golden-brown)
     - `1400m`: `#ab7348` (timberline warm brown)
     - `2800m`: `#c7c7c7` (high alpine rock gray)
     - `4600m`: `#ffffff` (glacier snow summit)
     - `6500m`: `#c7c7ff` (stratospheric icy tint)
     - Contour line color: `#403020` (warm dark brown).
  2. **`Light` (`xctrackProfile`)** (6 stops):
     - `0m`: `#ffffff` -> `1100m`: `#eddeb2` -> `1400m`: `#edc2a6` -> `2800m`: `#f0f0f0` -> `4600m`: `#ffffff` -> `6500m`: `#efefff`.
     - Contour line color: `#403020`.
  3. **`Dark` (`darkProfile`)** (6 stops):
     - `0m`: `#c0c0c0` -> `500m`: `#a0a0a0` -> `1200m`: `#cfcf02` -> `2800m`: `#b34724` -> `4600m`: `#ffffff` -> `6500m`: `#efefff`.
     - Contour line color: `#c0c0c0` (silver gray).
  4. **`LightLegacy` (`xctrackLegacyProfile`)** (6 stops):
     - `0m`: `#ffffff` -> `1100m`: `#ede4c9` -> `1400m`: `#ebdbcf` -> `2800m`: `#f0f0f0` -> `4600m`: `#ffffff` -> `6500m`: `#efefff`.
     - Contour line color: `#403020`.
- **Exact VTM XML Vector Themes**:
  - `Hyperpilot`: Background `#ffffff`, water `#99badf`, forests `#c2e4c2`, motorways `#e97446` (width 2.5), primaries `#e8af5f` (width 2.0), secondaries `#ebdeaa` (width 2.0).
  - `HyperpilotBlack`: Background `#000000`, water `#05356b`, forests `#0f4c0f`, motorways `#7c2706` (width 2.5), primaries `#915808` (width 2.0), secondaries `#846a03` (width 2.0).
  - `Frenchkiss`: Background `#ebebeb`, water `#b3d9fe`, forests `#ccfcb4`, motorways `#ff0000` (casing `#000000`), secondaries `#ff994c`.
  - `ClearpilotForest`: Forests `rgba(0, 96, 32, 0.106)` (`#1b006020`), water `#406684`, motorways `#608bbf`.
  - `ClearpilotForestDark`: Forests `rgba(0, 155, 186, 0.188)` (`#30009bba`), water `#78c7ff`, motorways `#a005fa`.
  - `Newtron` & `Tronrender`: Background `#000000` / `#050508`, water `#001223`, motorways `#fedb52` with glowing casings.
  - `Osmarender` & `VtmDefault`: Classic OSM red/orange/yellow road hierarchy.
  - `Biker`: Topo bike touring styling with red motorway `#e892a2`, orange trunk `#f9b29c`, amber primary `#ffc982`, yellow secondary `#fffa9b`.

### 10.10 Live MapLibre GL Vector & 3D Terrain Engine (`RealXCTrackMap.tsx` - v0.11.0)
- **Zero Synthetic Fakes**: Map widgets (`WXCAssistant`, `WCompMap`) render actual OpenStreetMap vector tiles and global 3D DEM elevation tiles matching real XCTrack behavior.
- **Vite Web Worker Bundling**:
  - In MapLibre GL v6, the worker loader resolves relative to `import.meta.url`, which in Vite dev mode resolves to `.vite/deps/` and results in a 404 Not Found error.
  - Resolved using Vite's native worker URL import: `import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'; setWorkerUrl(maplibreWorkerUrl);`.
  - Vite emits a dedicated chunk in `npm run build` (`dist/assets/maplibre-gl-worker-*.js`), ensuring zero worker loading errors in development and production.
- **Global Elevation DEM & Hillshading Source**:
  - Source: AWS Open Data Terrarium DEM (`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png`) with `encoding: "terrarium"`.
  - Elevation hypsometric tinting: Applied via MapLibre `color-relief` layer with exact C++ stops extracted from `libxctrack-native.so`.
  - Slope shadows: Real-time 3D hillshading with ambient, highlight, and shadow illumination factors derived from XCTrack's native sun vector calculation.
- **OpenStreetMap Vector Tiles**:
  - Source: OpenFreeMap Planet vector tiles (`https://tiles.openfreemap.org/planet/latest/{z}/{x}/{y}.pbf`) with zero tokens, API keys, or rate limits.
  - Layers: Cased motorways, primary highways, secondary roads, minor streets, footpaths/tracks, forests, residential areas, water bodies, and waterways.
  - Typography & Glyphs: Free glyph PBFs loaded from `https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf` for cities, towns, and mountain peaks.
- **Overlays & Flight HUD**:
  - Live KK7 Thermal Hotspots raster layer (`https://thermal.kk7.ch/tiles/thermals_all_all/{z}/{x}/{y}.png?src=xctrack.org`) with configurable opacity.
  - True flight coordinate centering (defaults to Interlaken / Jungfrau Alps `46.6862°N, 7.8591°E` from user `.xcfg`), paraglider delta icon with heading line, vario/altitude-colored snail tracklog, scale bar, wind arrow, and compass rose.

### 10.11 Rain Radar Simulation & Warm Alpine XContest Shading (v0.12.0)
- **Problem 1 ("Zoom Level Not Supported")**:
  - The RainViewer free API hard-caps raster tiles strictly at `zoom <= 7`. For requests with `z > 7`, it serves a canned PNG tile displaying the text `"Zoom Level Not Supported"`.
  - Furthermore, live weather radar in a layout editor is empty/blank when it's sunny, defeating the purpose of previewing cockpit widget layouts.
  - **Solution**: Removed live RainViewer network dependencies. Replaced with an authentic paragliding Doppler precipitation cell simulation (`generateRadarGeoJSON`) that renders multi-tier reflectivity contours (20 dBZ cyan drizzle, 35 dBZ green rain, 45 dBZ yellow heavy rain, 55 dBZ red convective core) drifting near the flight path when `"Show Rain Radar"` is toggled ON. Works at any zoom level, offline, with zero 404s or zoom errors.
- **Problem 2 (Black XContest Shading)**:
  - `ClearpilotForest`, `ClearpilotForestBig`, and `Clearpilot` were erroneously flagged `isDark: true` in `XCTRACK_VTM_SPECS`, triggering dark mode fallback with black shadows.
  - `hillshade-shadow-color` was set to `#000000`, `hillshade-accent-color` was dark opaque slate `#0f172a`, and `hillshade-exaggeration` was `0.85`. In MapLibre's fragment shader, the accent color darkens all steep slopes regardless of sun angle, masking 85% of the hypsometric relief in black paint.
  - **Solution**:
    - Corrected `isDark: false` on all light transparent pilot themes.
    - Set `"hillshade-accent-color": "rgba(0, 0, 0, 0)"` (transparent so slope accent does not darken sunlit faces).
    - Tuned `"hillshade-shadow-color"` to warm dark alpine olive-brown (`rgba(42, 52, 34, 0.40)`) for `XContest`, warm umber slate (`rgba(65, 55, 45, 0.38)`) for `Light`, and soft deep charcoal (`rgba(15, 23, 42, 0.55)`) for `Dark`.
    - Reduced exaggeration to `0.35` and increased `"color-relief-opacity"` to `1.0`.
    - Result: Lush green valleys, amber foothills, and crisp alpine rock ridges with authentic, natural slope lighting — never black!

### 10.12 Map Panning vs Widget Dragging Interaction Separation (v0.13.0)
- **Problem**: When a user attempted to navigate/pan the map on the canvas, MapLibre's canvas events bubbled up to `handleWidgetMouseDown` on the widget wrapper in `ScreenCanvas.tsx`, causing the map widget itself to be dragged/moved across the grid layout while navigating.
- **Solution**:
  - **Unselected State**: When the map widget is not selected (`isSelected === false`), the MapLibre canvas container has `pointer-events-none` and all map gestures (`dragPan`, `scrollZoom`, `doubleClickZoom`, `touchZoomRotate`) are disabled. Clicking anywhere selects the widget, or dragging immediately moves the widget box across the grid just like any standard data widget.
  - **Selected State**: Once selected (`isSelected === true`), `RealXCTrackMap.tsx` enables `pointer-events-auto`, re-enables map navigation (`map.dragPan.enable()`, `map.scrollZoom.enable()`), and attaches `onMouseDown={(e) => e.stopPropagation()}` on the map container. Clicking and dragging inside the map pans the map across the real terrain smoothly and never moves the widget container.
  - **Repositioning Selected Maps**: Added a dedicated "Move" grip pill (`<Move className="w-2.5 h-2.5" /> Move`) to the selection overlay header in `ScreenCanvas.tsx`. The user can drag this grip to move the widget across the canvas even while the map is active and selected.

---

## 11. XCTrack 1.0 Support, Hannspree Lumo 7.8 & Enhanced Device Search (v0.14.0)

### 11.1 XCTrack 1.0 Modern Architecture & `.xcfg` Standardization
- **Standardized on `.xcfg`**: All imports, exports, and templates use standard UTF-8 `.xcfg` JSON.
- **Modern Example Added**: `2026-10-27_backup-00.xcfg` (`info.versionName: "1.0.7-beta"`, `versionCode: 100072`, `device: "Google Pixel 8 Pro 17"`). Contains 6 portrait pages and 3 landscape pages with up-to-date XCTrack 1.0 widget layouts and preferences.
- **New XCTrack 1.0 Widgets Cataloged (85 Total Widgets)**:
  1. `WButtonVolume` ("Media volume"): Controls device audio volume up/down with optional long-click confirmation (`type`, `longClick`).
  2. `WButtonVolumeReminder` ("Volume reminder"): Appears only when media volume is below target to ensure pilots hear vario audio.
  3. `WOptiUnfinishedFAIPotential` ("FAI potential"): Real, max, and min achievable FAI triangle lengths from longest leg.
  4. `WDebugHwAccTestMap` ("Debug HW acceleration test map"): Map overlay verifying hardware acceleration status.
  5. `WEmitTestEvent` ("Emit a test event"): Triggers test events on tap.
  6. `WProFallback` ("Pro"): Fallback placeholder for Pro features.
- **New Navigation Mode**: Added `org.xcontest.XCTrack.navig.TaskToLivePilot` ("Navigate to live pilot") to `NAVIGATION_TYPES` and `WPXCAssistant.defaultNavigations`.

### 11.2 Hannspree Lumo 7.8" Display & Grid Specification
- **Hardware Profile**:
  - Model: SN08HD1B (`Android 14`, MediaTek MT8781).
  - Screen Size: 7.8 inches (19.8 cm), 4:3 aspect ratio.
  - Native Resolution: `768 × 1024` pixels portrait (`1024 × 768` landscape).
  - Display Technology: Reflective LCD (RLCD) ecoVISION™ Paper Display (full sunlight-readable color, 60 Hz high refresh rate, 5 ms response, zero ghosting, integrated adjustable front light).
  - PPI / Density: `164 PPI` (~160 mdpi baseline).
  - Physical Dimensions: 134.1 × 185.1 × 6.6 mm, 250 g.
- **XCTrack Grid Dimensions**:
  - Cell size: `19.12 px` (`19.12 dp`).
  - Recommended Grid: Portrait **`40 × 54`** / Landscape **`54 × 40`**.
  - Inset Grid (with status/nav bars): Portrait **`40 × 50`** / Landscape **`54 × 37`**.
  - Auto-detection: Matches `"Hannspree"`, `"Lumo"`, and `"SN08HD1B"`.

### 11.3 Searchable & Filterable Device Picker
- **Problem**: Finding a target device among 43+ presets in a raw scrolling menu was cumbersome.
- **Solution**:
  - Instant live search input with autofocus and clear button (`Search lumo, pixel, air3, boox, 7.8, e-ink...`).
  - Horizontal category filter pills: `All (43)`, `E-Ink (6)`, `Dedicated (4)`, `Rugged Tablet (6)`, `Rugged Phone (6)`, `Phone (20)`, `Foldable (2)`.
  - Detailed spec cards per device: Name, category badge (e.g. `E-Ink / RLCD`), native resolution, aspect ratio, grid cols × rows, and screen size in inches.
  - Keyboard accessible (Escape closes) with click-outside dismissal.

---

## 12. Privacy Architecture: Expunging Personal Flight Configs & Git Isolation (v0.15.0)

### 12.1 Absolute Privacy Rule on `.xcfg` / `.xczfg` Files
- **Rule**: User personal flight configs (`*.xcfg`, `*.xczfg`) must **NEVER** be committed into git under any circumstances.
- **`.gitignore` Enforcement**: Added `*.xcfg` and `*.xczfg` to `.gitignore`. All personal flight backup files on disk remain untouched for local editing, but git completely ignores them.
- **Complete History Expunge**:
  - Filtered all git branches and commits using `git filter-branch --index-filter 'git rm --cached --ignore-unmatch *.xcfg *.xczfg' --prune-empty`.
  - Purged original refs and ran `git reflog expire --expire=now --all` and `git gc --prune=now`.
  - Verified with `git log --all --full-history -- "**.xcfg" "**.xczfg"`: returned 0 entries. Zero personal config files or pilot identifiers exist anywhere in git history.
- **Built-in Anonymized Sample Configs (`src/data/sample-configs.ts`)**:
  - The application and test suite no longer rely on personal user backup files.
  - Built-in clean templates (`DEMO_MODERN_BACKUP`, `DEMO_XC_ASSISTANT`, `DEMO_COMPETITION`, `DEMO_PAGES_ONLY`) are generated from official factory APK page layouts (`PAGE_TEMPLATES`) with generic identifiers.
  - Test suites (`xcfgRoundTrip.test.ts`, `configValidator.test.ts`, `widgetCatalog.test.ts`, `preferencesAndEditor.test.ts`) test against these clean built-in templates, while conditionally validating any local files if present on disk.

---

## 13. Device Persistence & Comprehensive JSON Diff System (v0.16.0)

### 13.1 Device Persistence via LocalStorage
- **Problem**: Selecting a custom target device (e.g. Hannspree Lumo 7.8") did not persist across page reloads or tab switches; restarting the app reset the active canvas back to the default Pixel 8 Pro.
- **Solution**:
  - Key `'xctrack_last_device_id'` stored in `localStorage`.
  - When user selects any device via `editorStore.setDevice(device)`, its ID is immediately persisted.
  - On application startup or browser reload, `editorStore.loadConfig(..., respectSavedDevice = true)` prioritizes the remembered device ID.
  - `DEFAULT_DEVICE_ID` normalized to `'google-pixel-8-pro'` with fallback tolerance in `getDeviceById`.

### 13.2 Context-Aware Visual Editing Controls Isolation
- **Problem**: The `DeviceViewportBar` (screen orientation, device selector, grid snap, grid lines, zoom buttons, preview theme dropdown) remained visible on the `JSON & Diff` and `Preferences & Backup` tabs where visual canvas editing does not apply.
- **Solution**:
  - Scoped `<DeviceViewportBar />` strictly to `{store.activeTab === 'layout' && <DeviceViewportBar />}`.
  - The `JSON & Diff` and `Preferences & Backup` tabs now have full vertical space and clean dedicated toolbars.

### 13.3 Real JSON Diff Engine (`JsonDiffViewer.tsx` & `diffEngine.ts`)
- **Features**:
  1. **Side-by-Side Split View**: Parallel columns comparing loaded baseline (`originalConfig`) vs live modifications (`config`) with aligned line numbers, red highlights for removed lines, and green highlights for added lines.
  2. **Unified Diff View**: Git-style diff format with `+`/`-` line markers and line numbers for both versions.
  3. **High-Level Semantic Change Summary**: Categorized cards summarizing changes to Layout (pages added/removed, widget count shifts), Preferences (individual setting modifications with before/after values), and File Metadata.
  4. **Raw JSON View**: Formatted, readable current `.xcfg` document.
  5. **Actions**: Instant "Copy JSON" to clipboard with checkmark confirmation, direct ".xcfg Download", and "Reset Changes" to restore the baseline configuration.

---

## 14. Page Orientation Conversion Architecture (v0.17.0)

### 14.1 The Orientation Mismatch Problem in Paragliding Layouts
- Paragliding cockpit displays drastically differ between **Portrait** (tall, narrow aspect ratios e.g. 9:16 or 9:20; 23 cols × 52 rows) and **Landscape** (wide, short aspect ratios e.g. 16:9 or 20:9; 52 cols × 23 rows).
- Direct proportional scaling or coordinate copying between orientations distorts map viewports, compresses side views into unusable slivers, and truncates telemetry gauge numbers.
- Converting pages between orientations requires intelligent reflow that adheres to paragliding flight ergonomics.

### 14.2 Conversion Strategies (`src/utils/orientationConverter.ts`)
1. **Smart Cockpit Reflow (`adaptive` - Recommended)**:
   - **Portrait $\to$ Landscape**:
     - Map widgets (`WXCAssistant`, `WCompMap`, `WVTM`) are positioned on the right panel taking ~72% of the width (`[2800, 0, 10000, 10000]` or above sideview).
     - Cross-section altitude view (`WSideView`) docks at the bottom right under the map (`[2800, 7800, 10000, 10000]`).
     - Status line (`WStatusLine`) takes the top of the left deck (`[0, 0, 2800, 350]`).
     - Data telemetry gauges are cleanly packed into 1 or 2 vertical columns in the left instrument deck (`[0, 350, 2800, 10000]`).
     - If no map is present, data widgets are arranged in a multi-column/row grid across the entire canvas.
   - **Landscape $\to$ Portrait**:
     - Status line takes the top header `[0, 0, 10000, 200]`.
     - Data telemetry gauges are arranged across the upper deck in 2–3 columns per row.
     - Flight map takes the lower section (~52% to 68% height).
     - Side view cross-section docks along the very bottom `[0, 8400, 10000, 10000]`.
   - **Grid Snapping**: Every widget boundary is snapped to the active target device grid via `snapRectToGrid(..., targetGrid.cols, targetGrid.rows)`.
2. **Official Factory Template (`template`)**:
   - Matches known page classes (`WPXCAssistant`, `WPCompetition`, `WPThermalAssistant`) to official XCTrack factory default layouts (`PAGE_TEMPLATES.defaultLayout[toOrientation]`).
3. **Proportional Grid Scaling (`proportional`)**:
   - Maintains normalized relative coordinate proportions while snapping directly to target device grid cells.
4. **Rotate 90° (`rotate90`)**:
   - Rotates widget geometry 90 degrees with bounds clamping and grid snapping.

### 14.3 User Interaction & Store Integration
- **Store Actions** (`editorStore.convertPageOrientation`):
  - Supports `action: 'duplicate'` (keeps original page in source orientation, appends converted page to target orientation) and `action: 'move'` (transfers page and removes original).
  - Automatically switches `activeOrientation` and sets `activePageIndex` to the new page for immediate visual review.
  - Fully integrated into undo/redo history.
- **UI**:
  - Screen Pages sidebar header features a quick `Convert` button for the active page.
  - Each page card item features a `RotateCw` button on hover.
  - Interactive conversion modal allows pilots to select their preferred strategy and action mode with live target orientation indicators.

---

## 15. Smart Seam-Preserving Grid Resnap Architecture (v0.18.0)

### 15.1 The Seam Breakage Problem on Device Changes
- Switching target devices with different physical screen dimensions, DPIs, or aspect ratios alters the discrete grid matrix (e.g. Google Pixel 8 Pro: 23×52 vs Hannspree Lumo 7.8": 40×54 vs Air3 7.2": 31×50).
- If widgets are rounded independently to the new grid lines:
  1. Floating-point rounding can round adjacent edges in opposite directions (e.g. left widget right edge rounds to column 19, right widget left edge rounds to column 20), creating an unsightly 1-cell gap or overlap.
  2. In stacked vertical decks (e.g. 4 gauges on the left of a map), gauges can round to alternating columns, resulting in a jagged, staggered border against the map.
  3. Outer borders ($0$ and $10000$) can round to internal grid cells, leaving unwanted margins along screen edges.

### 15.2 Topological Seam Clustering (`src/utils/smartGridResnap.ts`)
- **1D Disjoint Set Clustering**:
  - Coordinates on each axis (X and Y) are modeled as nodes in a Disjoint Set: `w_{i}_start`, `w_{i}_end`, `__BOUNDARY_MIN__` (0), and `__BOUNDARY_MAX__` (10000).
  - Touching edges between adjacent widgets with cross-axis overlap (distance $\le \text{tolerance}$) are unified into the same equivalence class.
  - Colinear edges (widgets starting or ending at the same column/row divider) are unified into the same equivalence class.
  - Edges within tolerance of the canvas edge are anchored to `__BOUNDARY_MIN__` or `__BOUNDARY_MAX__`.
- **Discrete Apportionment**:
  - Each cluster computes the mean of its constituent coordinates and maps to an integer grid line: $g = \text{normToGrid}(\text{idealCoord}, \text{gridSpan})$.
  - Monotonicity and minimum dimension constraints are enforced forward and backward: $g_{k} \ge g_{k-1} + \text{minCells}$, with $g_0 = 0$ and $g_M = \text{gridSpan}$.
  - Every edge in a seam cluster receives the exact same discrete normalized coordinate: $\text{gridToNorm}(g, \text{gridSpan})$.
- **Guarantees**:
  - **Zero Gaps / Zero Overlaps**: Adjacent edges share identical values: $W_A.X_2 \equiv W_B.X_1$.
  - **Zero Border Margins**: Canvas boundaries are strictly flush with $0$ and $10000$.
  - **No Collapsed Widgets**: Minimum 1 grid cell width and height guaranteed.
  - **Intentional Spacing Preserved**: Spaced or floating widgets separated by more than tolerance remain separated.

### 15.3 Store & UI Integration
- **State & Persistence**:
  - `autoResnapOnDeviceChange: boolean` (persisted in `localStorage` under `'xctrack_auto_resnap'`, defaults to `true`).
  - `editorStore.setAutoResnapOnDeviceChange(enabled)`
  - `editorStore.resnapCurrentPageToGrid()` (manual one-click trigger).
  - `editorStore.resnapAllPagesToGrid()`
- **UI Elements**:
  - `DeviceViewportBar`: Dropdown contains `[✓] Resnap layout to grid on device change` with subtitle "Seamless • No gaps".
  - Dedicated `Resnap Grid` button in the toolbar header for manual single-click resnapping.
  - Full Undo/Redo history support.

---

## 16. Preference SI Units Conversion & Unified Widgets/Layers Architecture (v0.19.0)

### 16.1 SI Unit Storage vs In-App Display for Preferences (`TakeoffSpeed`)
- **Domain Nuance**: Unlike `Glider.TrimSpeed` (which XCTrack stores in km/h, e.g. `36.0`), `TakeoffSpeed` is internally stored in `.xcfg` preferences as SI meters per second: `2.777778` m/s.
- **Conversion Formulation**:
  - In the Android app, `TakeoffSpeed` is formatted using the user's selected `Unit.Speed` (`km/h`, `mph`, `kt`, `m/s`).
  - $2.777778 \text{ m/s} \times 3.6 = 10.0 \text{ km/h}$.
  - The editor now converts SI `m/s` to the user's unit for display (showing `10 km/h` alongside `2.78 m/s SI`), and on edit converts user inputs back to 6-decimal-place SI floats (`val / 3.6`) for `.xcfg` serialization.

### 16.2 Unified Widgets & Layers Right Sidebar
- **Problem**: Previously, the left sidebar rail included a "Widgets and Layers" button (`LayerOrderPanel.tsx`) which duplicated the "Page Widgets" list in `WidgetPropertyInspector.tsx` on the right.
- **Solution**:
  - Removed the duplicate `Layers` button from the left navigation rail. The left rail now strictly houses **Screen Pages** (`FileText`) and **Widget Palette** (`PlusCircle`).
  - Unified all widget selection, layer Z-ordering, reordering (`Bring to Front`, `Bring Forward`, `Send Backward`, `Send to Back`), duplication, deletion, and property inspection into [`WidgetPropertyInspector.tsx`](file:///Users/artem/src/ai-xctrack-config/src/components/inspector/WidgetPropertyInspector.tsx) on the right.
  - Added a Z-Order vs Page Index view mode toggle, a quick `← Widgets` return button when inspecting, and header layer reordering buttons for the selected widget.

---

## 17. Dynamic Local Examples Discovery, Session Auto-Save & Convective Thunderstorm Radar (v0.20.0)

### 17.1 Dynamic Local Examples via Vite Dev Server Middleware
- **Context & Security**:
  - User `.xcfg` flight configurations and backups must never be committed to git (`.gitignore` rule).
  - To make local `.xcfg` files immediately discoverable and testable in the web editor without manual registration, Vite dev server middleware was implemented in `vite.config.ts`.
- **Endpoints**:
  - `GET /api/local-examples`:
    - Scans `process.cwd()` for `*.xcfg` files dynamically on every request using `fs.promises.readdir`.
    - Parses file metadata (`size`, `mtime`, `portraitPages`, `landscapePages`, `totalPages`, `deviceName`, `exportType`).
    - Sorts files by most recently modified.
  - `GET /api/local-examples/file?name=...`:
    - Enforces path sanitization (rejects directory traversal characters `/` and `\`, verifies `.xcfg` extension).
    - Reads and returns JSON file payload directly to `editorStore.loadConfig(data, filename)`.

### 17.2 Click-to-Toggle Popover with Search & Badging
- **Problem**: Hover-based dropdowns (`group-hover:block`) with margin offsets close immediately when the cursor transitions across the gap, frustrating users.
- **Architecture**:
  - Converted the Examples menu in `TopToolbar.tsx` to a controlled click-to-toggle popover with a document click-outside listener.
  - Real-time search filter input querying both local workspace files and built-in templates by name, device, or export type.
  - Visual metadata chips: `Local` (emerald) vs `Template` (amber), device label, page counts (`6P · 3L`), and file sizes.
  - Includes a "Reset to default template" fallback button.

### 17.3 Full-Session Auto-Save & Reload Persistence
- **Problem**: Previously, refreshing the browser invoked `editorStore.loadConfig(DEMO_MODERN_BACKUP)` unconditionally, wiping active layout edits.
- **Implementation**:
  - `AUTOSAVE_STORAGE_KEY = 'xctrack_autosave_state'` in `localStorage`.
  - State tracked: `config`, `originalConfig` (for JSON diff viewer), `filename`, `activeOrientation`, `activePageIndex`, `activeDeviceId`, `activeTab`, `zoom`, and `updatedAt`.
  - Debounced at 350ms inside `emitChange()` on all state mutations, plus synchronous flush on `window.beforeunload`.
  - Restored on initial `App.tsx` mount via `editorStore.restoreAutosavedSession()`.
  - "Auto-saved" live indicator chip in `TopToolbar` provides continuous visual feedback.

### 17.4 Authentic Alpine Convective Thunderstorm Radar Generator (`src/utils/thunderstormRadar.ts`)
- **Atmospheric Physics & Morphology**:
  - Replaced crude concentric circles with an authentic convective supercell storm model located ~6–8 km northeast of default Interlaken center (`[7.859, 46.686]`) along the mountain ridge.
  - Models windward/leeward elongation along prevailing SW-to-NE storm propagation axis.
  - Multi-frequency harmonic fractal perturbations (`n = 2, 3, 5, 7`) produce realistic turbulent cloud boundaries and anvil rain shields.
  - Secondary flanking feeder cell modeled 4 km south-southeast of main core.
  - 6-tier Doppler reflectivity scale:
    - 20 dBZ (Light rain / anvil shield, `#38bdf8`)
    - 32 dBZ (Moderate rain boundary, `#22c55e`)
    - 42 dBZ (Heavy rain core, `#eab308`)
    - 52 dBZ (Torrential downdraft, `#f97316`)
    - 58 dBZ (Severe storm core, `#ef4444`)
    - 65 dBZ (Severe hail core shaft, `#d946ef`)
  - Integrated into both `RealXCTrackMap.tsx` (MapLibre GL WebGL GeoJSON layers) and `RealisticMapSection.tsx` (static SVG paths with max dBZ alert badge).

---

## 18. Config Theme Synchronization, Collapsible Categories & Diff Navigation (v0.21.0)

### 18.1 Display.Theme Automatic Extraction & Bidirectional Sync
- **Domain Observation**: In modern XCTrack backups (e.g. `2026-10-27_backup-00.xcfg`), users often fly with high-contrast themes such as `WhiteHCTheme` or `WhiteTheme` instead of default OLED `BlackTheme`.
- **Implementation**:
  - `editorStore.loadConfig(config, ...)` extracts `config.preferences?.['Display.Theme']` (falling back to `'BlackTheme'`) and updates `currentState.globalTheme`.
  - `editorStore.setGlobalTheme(theme)` updates both preview canvas state and `config.preferences['Display.Theme']` when preferences are present in backup files.
  - `AutosaveData` persists `globalTheme` so theme selection survives page reload.

### 18.2 Collapsible Property Inspector Categories (Replacing Filter Tabs)
- **Problem**: Previous tabs (`All`, `Size & Pos`, `Border & BG`) operated merely as filters that hid other properties, creating unnecessary switching steps.
- **Solution**:
  - Removed top filter tabs entirely.
  - Replaced with vertical collapsible accordion sections:
    1. **Map Appearance & Style** (for map widgets) with quick gallery trigger.
    2. **Size & Position (Grid)** with dimensions indicator (`gw × gh cells`) and Quick Fit buttons.
    3. **Border & Background** with transparency chip (`% Transp`) and title configuration.
  - State `collapsedSections: Record<string, boolean>` defaults all categories to **OPEN**. Users can scroll naturally or collapse sections to minimize scrolling.

### 18.3 Unified "Download" & Renamed "Diff & Export" Tab
- **Unification**: Renamed `JSON & Diff` tab to `Diff & Export` in `TopToolbar.tsx`.
- Standardized terminology across the toolbar and diff viewer to use **Download** (`Download .xcfg`).

### 18.4 Prev / Next Difference Navigation
- **Architecture**:
  - `JsonDiffViewer.tsx` calculates contiguous diff hunks across `sideBySide`, `unified`, and `semanticDiff` views.
  - Toolbar controls: `[↑ Prev]` and `[↓ Next]` with live counter indicator `(idx + 1) / total`.
  - Keyboard navigation: `Alt+Up` and `Alt+Down`.
  - Smoothly scrolls the active difference into view and highlights it with an active ring border (`ring-2 ring-sky-500 bg-sky-950/30`).















