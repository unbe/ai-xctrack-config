# XCTrack Web Configuration Editor — Walkthrough & User Guide

A modern web editor for [XCTrack](https://play.google.com/store/apps/details?id=org.xcontest.XCTrack) Android configuration files (`.xcfg` / `.json`).

Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite**, this application provides a visual design environment for paragliding and hang gliding flight instruments, supporting multi-page layouts, physical grid math across 60+ devices, all 79 official widgets, and complete backup editing (including an interactive 16-point acoustic vario synthesizer with Web Audio API sound preview).

---

## 1. Visual Overview & Layout Editor

### Key Editor Features
1. **Interactive Screen Canvas & Device Bezel**:
   - Accurate physical aspect ratio, system bar insets, and device frames (e.g. AIR³ 7.2, Pixel 8 Pro, Oudie N).
   - High-contrast visual grid overlay matching XCTrack's physical ~3 mm step size.
   - Live drag-and-drop movement, snapping, 8 resize handles, and multi-selection alignment bar.
2. **Left Panel Navigation**:
   - **Screen Pages**: Switch pages, view auto-activation task triggers (`WPXCAssistant`, `WPThermalAssistant`, `WPCompetition`, `WPEmpty`), duplicate, delete, reorder, or copy to the opposite orientation.
   - **Widget Library**: Searchable catalog of all 79 registered widget classes across 11 categories (System, Flying, Air, XContest, Navigation, Competition, Livetracking, Action Buttons, Others, Testing, Debug).
   - **Layers & Z-Order**: Complete visual layer stack with move forward/backward controls, ensuring maps remain at the bottom while speed/vario/nav overlays render on top.
3. **Right Property Inspector**:
   - **Geometry & Grid**: Discrete column/row cell adjustments (`gx1, gy1, gx2, gy2`), cell dimensions, quick-fit buttons (*Full Width*, *Full Height*, *Fill Screen*, *Center*).
   - **Appearance**: Border toggle, background transparency slider (`_bg: 100%` transparent to `0%` opaque) with live checkered preview, and theme overrides.
   - **Labels**: Show title toggle, custom title override, show unit, and hide labels.
   - **Type-Specific Controls**: Map rotation, zoom scale slider, color pickers (supporting signed 32-bit ARGB ints), action button triggers, and free text settings.
   - **Raw & Preserved Properties**: Key-value viewer for arbitrary custom keys ensuring lossless round-trip serialization.

---

## 2. Preferences & Acoustic Vario Editor

### Specialized Preferences Sections
1. **Pilot & Glider Settings**:
   - Pilot name, glider model, FAI Class (1 to 5), engine type, trim speed, goal glide ratio safety factor, and takeoff speed threshold.
2. **Display & Units**:
   - Global theme (`BlackTheme`, `WhiteTheme`, `WhiteEInkTheme`, etc.), orientation lock, fullscreen mode, repaint interval (ms), and metric/imperial unit selectors.
3. **16-Point Acoustic Vario Table (`confTable`) & Web Audio Synthesizer**:
   - Full editor for vertical speed (`lift`), frequency (`freq` in Hz), cycle duration (`cycleMs`), and duty cycle (`duty` in %).
   - **Interactive Live Tone Synthesizer**: Move the vertical speed slider (e.g. from -7.0 m/s sink to +7.0 m/s lift) and click **Test Audio** to hear real-time audio beeps or continuous sink alarms synthesized in the browser via Web Audio API.
4. **Triggers & Events (`EventMapping`)**:
   - Visual rule builder for XCTrack's `001` pipe-delimited format (e.g. `START_THERMALING:SHOW_THERMAL_ASSISTANT`, `STOP_THERMALING:SHOW_LAST_PAGE`, `BATTERY_CHARGING:DISPLAY_FULLBACKLIGHT`).
5. **Hardware Keybindings (`Keys.*`)**:
   - Preset selector and custom Android keycodes for Volume Up/Down, Media Next/Prev, and Camera buttons.
6. **Sensors & Airspace Channels**:
   - Inspection of configured Bluetooth LE / Internal sensors (`BARO`, `GPS`, `FLARM`) and subscribed airspace channels.
7. **Visual Diff & Schema Validation**:
   - Real-time compatibility verification via `validateXcfg`, detailed change summary against originally loaded file, and 1-click clipboard export.

---

## 3. Reverse Engineering & Domain Findings

Extracted directly from decompiling the official APK (`xctrack-latest.apk` v0.9.12.10) and analyzing sample `.xcfg` files:

- **Physical Grid Cell Calculation (`org.xcontest.XCTrack.ui.i0`)**:
  - Each grid cell is physically fixed at **~3 mm × 3 mm**:
    $$\text{cellPx} = \max(8.0, 0.11952191 \times \text{densityDpi})$$
  - In device-independent pixels (dp), 1 cell $\approx 19.1235\text{ dp}$.
  - Grid columns: `gridCols = Math.round(widthDp / 19.1235)`.
  - Integer coordinate formulas:
    - **Grid $\to$ `.xcfg` (0..10000)**: `X = Math.floor((gridX * 10000 + Math.floor(gridCols / 2)) / gridCols)`
    - **`.xcfg` $\to$ Grid**: `gridX = Math.floor((X * gridCols + 5000) / 10000)`

- **Background Transparency Semantics (`_bg`)**:
  In XCTrack, `_bg` represents **transparency percentage**, not opacity:
  - `_bg: 100` = 100% transparent (`alpha = 0.0`, no fill)
  - `_bg: 0` = 0% transparent (`alpha = 1.0`, solid opaque fill)
  - Formula: `alpha = (100 - _bg) / 100`.

- **Signed 32-bit ARGB Color Serialization**:
  Colors such as `tracklog_color: -27091` are signed 32-bit two's complement integers (`0xFFFF962D` = Orange). The editor provides bidirectional conversion between hex color pickers and Java signed integers (`(argb >>> 0) | 0`).

---

## 5. Map Appearance, Vector Themes, Hillshading & Gallery (v0.7.0)

### Map Style System
- **17 OpenStreetMap Vector Themes (`MAP_THEMES`)**: Full support for all themes including `ClearpilotForest` [Pro], `ClearpilotForestBig` [Pro], `ClearpilotForestDark` [Pro], `Clearpilot`, `Hyperpilot`, `HyperpilotBlack`, `Lightpilot`, `Frenchkiss`, `VtmDefault`, `Newtron`, `Osmagray` (E-Ink), `Osmarender`, `Tronrender`, and `Custom` [Pro].
- **7 Terrain Elevation & Hillshading Profiles (`TERRAIN_STYLES`)**:
  - **Hillshading only** (`LightShading`, `DarkShading`): Directional 3D hillshading shadows without color tinting.
  - **Full Elevation Relief** (`Light`, `Dark`, `XContest`, `LightLegacy`): 3D hillshading blended with elevation altitude gradients.
- **25 Appearance Presets (`MAP_APPEARANCE_PRESETS`)**: Curated styles grouped into *Featured Relief*, *Extra Relief*, *Classic Hillshading*, *Relief Only*, and *Empty*.
- **Interactive Style Gallery Modal (`MapStyleGalleryModal`)**:
  - Live preview thumbnails simulating realistic roads, elevation gradients, 3D hillshading shadows, forest polygons, waterways, and airspaces.
  - 1-click preset application directly updating both config and canvas.
- **Top Toolbar Undo / Redo**:
  - Labeled `Undo` (`Ctrl+Z`) and `Redo` (`Ctrl+Y`) buttons with active/disabled state handling.
- **Page Widgets List & Switcher**:
  - When no widget is selected, the inspector presents a full searchable list of all page widgets with position badges and "Select ➔" actions.
  - A persistent top `<select>` dropdown with `<` and `>` buttons enables switching widgets with zero canvas clicks.

---

## 6. Testing & Verification

1. **Automated Unit & Round-Trip Tests (Vitest)**:
   - 44 comprehensive unit tests across 8 test suites:
     - `mapStyles.test.ts`: Themes, terrain hillshading profiles, presets, and fallbacks.
     - `gridMath.test.ts`: Coordinate conversion and grid clamping.
     - `colorMath.test.ts`: Signed 32-bit ARGB, hex, and transparency conversion.
     - `xcfgRoundTrip.test.ts`: Lossless parsing and re-serialization of all repository sample configs.
     - `catalogAndTemplates.test.ts`: Catalog integrity and page template validation.
     - `widgetCatalog.test.ts`: Categorization and search algorithms.
     - `configValidator.test.ts`: Schema conformance testing.
     - `preferencesAndEditor.test.ts`: Store actions, undo/redo, vario curve, and diffing.
   - Run via: `npm test`
2. **Headless Browser Integration Testing**:
   - `scripts/test-map-and-widgets.mjs`: Tests undo/redo toolbar buttons, widget list selection, widget switcher dropdown, map style gallery modal, preset selection, and canvas updates.
   - `scripts/test-editor-browser.mjs`: Tests page navigation, acoustic vario synthesizer, and preferences editing.

---

## 7. APK Ground-Truth Rendering Verification (v0.5.0)

To guarantee that widget typography and layout matches the real Android application pixel-for-pixel:
1. **Official Fonts Extracted**: Extracted `droidsans_bold_xctrack_custom.ttf` (numbers) and `roboto_condensed_bold.ttf` (titles & units) from the decompiled APK.
2. **Decompiled APK Layout Math**:
   - Title rendering: Centered horizontally at `width / 2` in uppercase `#808080`, with vertical allocation `Math.max(12, Math.min(18, Math.round(height * 0.22)))`.
   - Dynamic font scaling: Calculated from bounding box dimensions with aspect ratios preventing text wrapping.
   - `WAirTime` formatted as `"%d:%02d"` (`"2:15"`), without wrap.
   - Borders and transparency: Exact 1px `#808080` border and `((100 - _bg) * 255) / 100` background opacity.
3. **Verification Command**:
   ```bash
   node scripts/verify-rendering.mjs
   ```
   Renders the reference layout via Java AWT using the real APK fonts, captures the web canvas with Puppeteer, asserts widget values, and outputs a side-by-side comparison image `rendering_comparison.png`.
