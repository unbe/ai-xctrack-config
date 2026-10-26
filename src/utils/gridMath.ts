/**
 * Exact XCTrack Grid & Coordinate Math
 * Reverse engineered from decompiled APK:
 *   - org.xcontest.XCTrack.ui.i0 (Grid calculation)
 *   - org.xcontest.XCTrack.widget.d0 (Coordinate serialization & deserialization)
 */

export const DP_PER_GRID_CELL = 19.123506; // 3.0mm physical grid size (3.0 / 25.1 * 160)

export interface GridDimensions {
  cols: number;
  rows: number;
}

/**
 * Calculates physical grid dimensions (columns and rows) for a given screen or viewport.
 * Uses exact XCTrack logic: cellPx = max(8.0, (3.0 / 25.1) * densityDpi)
 */
export function computeGridForDevice(
  widthPx: number,
  heightPx: number,
  densityDpi: number = 480
): GridDimensions {
  const cellPx = Math.max(8.0, (3.0 / 25.1) * densityDpi);
  return {
    cols: Math.max(1, Math.round(widthPx / cellPx)),
    rows: Math.max(1, Math.round(heightPx / cellPx)),
  };
}

/**
 * Converts XCTrack normalized coordinate (0..10000) to discrete grid index.
 * Matches org.xcontest.XCTrack.widget.d0.k()
 */
export function normToGrid(normValue: number, gridSpan: number): number {
  return Math.floor((normValue * gridSpan + 5000) / 10000);
}

/**
 * Converts discrete grid index to XCTrack normalized coordinate (0..10000).
 * Matches org.xcontest.XCTrack.widget.d0.B()
 */
export function gridToNorm(gridIndex: number, gridSpan: number): number {
  return Math.floor((gridIndex * 10000 + Math.floor(gridSpan / 2)) / gridSpan);
}

/**
 * Clamps grid bounds within [0, gridCols] and [0, gridRows] with non-zero dimensions.
 * Matches org.xcontest.XCTrack.widget.d0.E()
 */
export function clampGridBounds(
  gx1: number,
  gy1: number,
  gx2: number,
  gy2: number,
  gridCols: number,
  gridRows: number
) {
  let x1 = gx1;
  let y1 = gy1;
  let x2 = gx2;
  let y2 = gy2;

  if (x1 < 0) {
    x2 -= x1;
    x1 = 0;
  }
  if (x2 > gridCols) {
    x1 -= x2 - gridCols;
    x2 = gridCols;
  }
  if (x1 < 0) x1 = 0;
  if (x2 <= x1) {
    x1 = 0;
    x2 = gridCols;
  }

  if (y1 < 0) {
    y2 -= y1;
    y1 = 0;
  }
  if (y2 > gridRows) {
    y1 -= y2 - gridRows;
    y2 = gridRows;
  }
  if (y1 < 0) y1 = 0;
  if (y2 <= y1) {
    y1 = 0;
    y2 = gridRows;
  }

  return { gx1: x1, gy1: y1, gx2: x2, gy2: y2 };
}

/**
 * Snaps a normalized rectangle (X1, Y1, X2, Y2 in 0..10000) to the current grid.
 */
export function snapRectToGrid(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  gridCols: number,
  gridRows: number
) {
  let gx1 = normToGrid(x1, gridCols);
  let gy1 = normToGrid(y1, gridRows);
  let gx2 = normToGrid(x2, gridCols);
  let gy2 = normToGrid(y2, gridRows);

  // Ensure minimum 1 grid cell width and height
  if (gx2 <= gx1) gx2 = Math.min(gridCols, gx1 + 1);
  if (gy2 <= gy1) gy2 = Math.min(gridRows, gy1 + 1);

  const clamped = clampGridBounds(gx1, gy1, gx2, gy2, gridCols, gridRows);

  return {
    X1: gridToNorm(clamped.gx1, gridCols),
    Y1: gridToNorm(clamped.gy1, gridRows),
    X2: gridToNorm(clamped.gx2, gridCols),
    Y2: gridToNorm(clamped.gy2, gridRows),
    gridX1: clamped.gx1,
    gridY1: clamped.gy1,
    gridX2: clamped.gx2,
    gridY2: clamped.gy2,
  };
}
