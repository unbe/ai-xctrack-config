# Project: XCTrack Config Editor Production Maintenance & Quality Improvement

## Architecture
- Client-side React 18 / TypeScript SPA bundled with Vite and Tailwind CSS.
- In-memory reactive state managed by `editorStore` (`useEditorStore.ts`) with custom external store subscriptions, history undo/redo stacks, and autosave.
- Layout engine supporting Android XCTrack normalized coordinate system (0..10000) and physical ~3mm grid math.
- Component architecture: Canvas, Property Inspector, Preferences Editor, Top Toolbar, Viewport Bar, Sidebar Panels, Diff/JSON Viewer.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Single Undo/Redo Window Listeners | Remove window Ctrl/Cmd+Z/Y from ScreenCanvas.tsx | M1 | R1.1 |
| 2 | Preferences Error Display | Format validation errors as `${e.path}: ${e.message}` | M1 | R1.2 |
| 3 | Tooltip Precedence Fix | Use `Math.round((X2 - X1) / 100)` in ScreenCanvas | M1 | R1.3 |
| 4 | Multi-Widget Undo Batching | Single undo snapshot for align & nudge operations | M1 | R1.4 |
| 5 | Raw & Preserved Properties | Restore orphaned UI section in WidgetPropertyInspector | M1 | R1.5 |
| 6 | Orientation Convert Safety | Remove 'move' action in convertPageOrientation & UI | M1 | R1.6 |
| 7 | SVG Gradient Dynamic IDs | Use React `useId()` for gradient/pattern IDs in maps/modals | M1 | R1.7 |
| 8 | Tailwind Darker Token | Add `darker: '#0d1017'` to `colors.xctrack` | M1 | R1.8 |
| 9 | Widget Semantic Diff | Compare widget geometry and properties in diffEngine | M1 | R1.9 |
| 10 | Store Selector Subscriptions | Selective component subscriptions in useEditorStore | M2 | R2.1 |
| 11 | Drag Shallow Updates | Local drag state in ScreenCanvas & no deep clone on mousemove | M2 | R2.1 |
| 12 | ErrorBoundary & Autosave Check | React ErrorBoundary in main.tsx + validate layout arrays | M2 | R2.2 |
| 13 | RealXCTrackMap Code Splitting | React.lazy + manualChunks in vite.config.ts | M2 | R2.3 |
| 14 | RealXCTrackMap ResizeObserver | Attach ResizeObserver triggering map.resize() | M2 | R2.4 |
| 15 | Stable Widget Canvas Keys | In-memory editor IDs for ScreenCanvas without export leak | M2 | R2.5 |
| 16 | PreferencesEditor Decomposition | Split 1197-line file into modular tab subcomponents | M3 | R3.1 |
| 17 | WidgetPropertyInspector Modularization | Split 1017-line file into modular inspector sections | M3 | R3.1 |
| 18 | TypeScript Project References | Split tsconfig into app and node, typecheck vite.config.ts | M3 | R3.2 |
| 19 | noUnusedLocals & ESLint | Fix all 90 TS6133 errors, enable noUnusedLocals & ESLint | M3 | R3.2 |
| 20 | Component & UI Testing | Add @testing-library/react and jsdom tests | M3 | R3.3 |
| 21 | Relocate devices.json | Move /devices.json to src/data/devices.json & update imports | M4 | R4.1 |
| 22 | Dependency & Font Cleanup | Remove @types/jszip & delete activelook_symbol.ttf | M4 | R4.2 |
| 23 | Doc & Catalog Corrections | Update widget count 79 -> 85 and MEMORY.md v0.24.0 heading | M4 | R4.3 |
| 24 | Drag-and-Drop Ingestion | Add HTML5 .xcfg file drop ingestion to App.tsx | M4 | R4.4 |
| 25 | Modal / Toast Dialog Service | Replace 9 native alert() and confirm() calls with non-blocking UI | M4 | R4.4 |
| 26 | Purge .xczfg & backupwithmedia | Remove all .xczfg code, files, gitignore, and docs | M4 | R4.5 |
| 27 | E2E Testing & Verification | Comprehensive 4-tier test suite and final integrity verification | M5 | R1-R5 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: P0 Bug Fixes | Features 1-9 (R1) | none | DONE |
| 2 | M2: P1 Performance & Reliability | Features 10-15 (R2) | M1 | DONE |
| 3 | M3: P2 Architecture & Tooling | Features 16-20 (R3) | M1, M2 | DONE |
| 4 | M4: P3 Cleanup, UX & Purge | Features 21-26 (R4) | M1, M2, M3 | DONE |
| 5 | M5: E2E Verification & Audit | Feature 27 (Dual Track + Final Acceptance) | M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### ScreenCanvas ↔ editorStore
- `recordCustomUndo(snapshot: XcfgFile)`: captures pre-mutation state for multi-widget operations.
- `updateWidgetCoords(widgetIndex, x1, y1, x2, y2, saveUndo)`: `saveUndo=false` suppresses intermediate undo snapshots.
- Canvas hotkeys: `ScreenCanvas` manages canvas-scoped keys (`Delete`, `Escape`, `Ctrl+D`, Arrows). Window undo/redo is solely handled by `App.tsx`.

### PreferencesEditor ↔ configValidator
- `ValidationIssue`: `{ path: string, message: string, code: string }`.
- Error rendering: `${issue.path}: ${issue.message}`.

### diffEngine
- `computeSemanticDiff(before, after)`: returns semantic differences for info, layout, preferences, airspace, and widget geometry/properties:
  - Widget added/removed
  - Widget moved/resized (`[#idx WClass]: X1: old -> new, Y1: ...`)
  - Widget property modified (`[#idx WClass]: propKey: old -> new`)

### Code Layout
- `src/components/canvas/`: ScreenCanvas.tsx, WidgetPreview.tsx, RealXCTrackMap.tsx, RealisticMapSection.tsx
- `src/components/preferences/`: PreferencesEditor.tsx, `tabs/` (subcomponents)
- `src/components/inspector/`: WidgetPropertyInspector.tsx, `sections/` (subcomponents)
- `src/components/ui/`: Modal, Toast, ErrorBoundary
- `src/store/`: useEditorStore.ts
- `src/utils/`: diffEngine.ts, xcfgSerializer.ts, orientationConverter.ts, gridMath.ts
- `src/data/`: devices.json, devices.ts, widgets-catalog.ts, page-templates.ts, sample-configs.ts
