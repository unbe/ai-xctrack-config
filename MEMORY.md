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
