# E2E Test Infra: XCTrack Config Editor

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation internals.
- Methodology: Category-Partition + Boundary Value Analysis (BVA) + Pairwise Combinatorial + Real-World Workload Testing.
- Validates all 21 review findings and features across R1, R2, R3, R4, and R5.

## Feature Inventory
| # | Feature | Source | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Workload) |
|---|---------|--------|:-----------------:|:-----------------:|:-----------------:|:-----------------:|
| 1 | Undo/Redo Window Listeners | R1.1 | 5 | 5 | ✓ | ✓ |
| 2 | Preferences Error Display | R1.2 | 5 | 5 | ✓ | ✓ |
| 3 | Tooltip Precedence | R1.3 | 5 | 5 | ✓ | ✓ |
| 4 | Multi-Widget Align & Nudge Undo | R1.4 | 5 | 5 | ✓ | ✓ |
| 5 | Raw & Preserved Properties | R1.5 | 5 | 5 | ✓ | ✓ |
| 6 | Page Orientation Convert Safety | R1.6 | 5 | 5 | ✓ | ✓ |
| 7 | SVG Gradient Unique IDs | R1.7 | 5 | 5 | ✓ | ✓ |
| 8 | Tailwind Darker Token | R1.8 | 5 | 5 | ✓ | ✓ |
| 9 | Widget Semantic Diff | R1.9 | 5 | 5 | ✓ | ✓ |
| 10 | Store Selector Subscriptions | R2.1 | 5 | 5 | ✓ | ✓ |
| 11 | Drag Shallow Updates | R2.1 | 5 | 5 | ✓ | ✓ |
| 12 | ErrorBoundary & Autosave | R2.2 | 5 | 5 | ✓ | ✓ |
| 13 | RealXCTrackMap Code Splitting | R2.3 | 5 | 5 | ✓ | ✓ |
| 14 | RealXCTrackMap ResizeObserver | R2.4 | 5 | 5 | ✓ | ✓ |
| 15 | Stable Widget Canvas Keys | R2.5 | 5 | 5 | ✓ | ✓ |
| 16 | Preferences Modularization | R3.1 | 5 | 5 | ✓ | ✓ |
| 17 | Property Inspector Modularization | R3.1 | 5 | 5 | ✓ | ✓ |
| 18 | TypeScript Project References | R3.2 | 5 | 5 | ✓ | ✓ |
| 19 | noUnusedLocals & ESLint | R3.2 | 5 | 5 | ✓ | ✓ |
| 20 | Component & UI Testing | R3.3 | 5 | 5 | ✓ | ✓ |
| 21 | Relocate devices.json | R4.1 | 5 | 5 | ✓ | ✓ |
| 22 | Dependency & Font Cleanup | R4.2 | 5 | 5 | ✓ | ✓ |
| 23 | Doc & Catalog 85 Widgets / v0.24.0 | R4.3 | 5 | 5 | ✓ | ✓ |
| 24 | Drag-and-Drop Ingestion | R4.4 | 5 | 5 | ✓ | ✓ |
| 25 | Non-blocking Modal / Toast UI | R4.4 | 5 | 5 | ✓ | ✓ |
| 26 | Purge .xczfg & backupwithmedia | R4.5 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: Vitest with jsdom environment (`npm test`).
- Target test suites:
  - Unit & domain math tests in `src/__tests__/`
  - Integration & component tests in `src/__tests__/components/`
  - Verification scripts for bundle analysis, typechecking, and linting
- Pass/Fail semantics: Exit code 0, 100% test pass, 0 typecheck errors (`tsc -b`), 0 lint errors (`eslint .`), build output chunk verification.

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Full Config Lifecycle (Load, Drag, Align, Nudge, Undo, Diff, Export) | F1, F3, F4, F9, F11, F15 | High |
| 2 | Preferences Configuration, Validation & Diff Review | F2, F9, F16, F25 | High |
| 3 | Page Orientation Conversion & Safe Page Layout | F6, F9, F10 | Medium |
| 4 | Map Style Preset Gallery & Render Isolation | F7, F8, F13, F14 | Medium |
| 5 | Drag-and-Drop Ingestion with Malformed / Corrupt Recovery | F12, F24, F25 | High |
| 6 | Raw & Preserved Properties Inspection & Export Sanitization | F5, F15, F17, F26 | Medium |

## Coverage Thresholds
- Tier 1: >= 5 tests per feature
- Tier 2: >= 5 boundary tests per feature
- Tier 3: Pairwise combinations across state/canvas/preferences/export
- Tier 4: >= 6 realistic end-to-end user workflows
