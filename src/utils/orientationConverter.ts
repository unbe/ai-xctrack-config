import { XcfgPage, XcfgWidget, Orientation, DevicePreset } from '../types/xcfg';
import { getDeviceGrid } from '../data/devices';
import { snapRectToGrid, normToGrid, gridToNorm } from './gridMath';
import { PAGE_TEMPLATES, WidgetLayoutItem } from '../data/page-templates';

export type ConversionStrategy = 'adaptive' | 'proportional' | 'rotate90' | 'template';

export interface ConvertPageOptions {
  strategy?: ConversionStrategy;
  device: DevicePreset;
  useInsets?: boolean;
}

/**
 * Converts an XcfgPage from one orientation to the opposite orientation.
 */
export function convertPageOrientation(
  page: XcfgPage,
  fromOrientation: Orientation,
  toOrientation: Orientation,
  options: ConvertPageOptions
): XcfgPage {
  if (fromOrientation === toOrientation) {
    return JSON.parse(JSON.stringify(page));
  }

  const { strategy = 'adaptive', device, useInsets = false } = options;
  const targetGrid = getDeviceGrid(device, toOrientation, useInsets);

  const cloned: XcfgPage = {
    CLASS: page.CLASS,
    navigations: JSON.parse(JSON.stringify(page.navigations)),
    widgets: [],
  };

  // Preserve any other custom top-level page fields
  for (const [k, v] of Object.entries(page)) {
    if (k !== 'CLASS' && k !== 'navigations' && k !== 'widgets') {
      cloned[k] = JSON.parse(JSON.stringify(v));
    }
  }

  if (page.widgets.length === 0) {
    return cloned;
  }

  // 1. Template Strategy (match official XCTrack factory layout for known page classes)
  if (strategy === 'template') {
    const template = PAGE_TEMPLATES.find(
      (p) => p.className === page.CLASS || p.shortName === page.CLASS || page.CLASS.endsWith(p.shortName)
    );
    if (template) {
      const templateLayout = template.defaultLayout[toOrientation];
      if (templateLayout && templateLayout.length > 0) {
        cloned.widgets = templateLayout.map((w) => JSON.parse(JSON.stringify(w)));
        return cloned;
      }
    }
    // Fall back to adaptive if no template exists
  }

  // 2. Rotate 90° Strategy
  if (strategy === 'rotate90') {
    cloned.widgets = page.widgets.map((w) => {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(w));
      let rawX1: number;
      let rawY1: number;
      let rawX2: number;
      let rawY2: number;

      if (fromOrientation === 'portrait') {
        // Portrait -> Landscape (rotate 90° CW)
        rawX1 = 10000 - w.Y2;
        rawY1 = w.X1;
        rawX2 = 10000 - w.Y1;
        rawY2 = w.X2;
      } else {
        // Landscape -> Portrait (rotate 90° CCW)
        rawX1 = w.Y1;
        rawY1 = 10000 - w.X2;
        rawX2 = w.Y2;
        rawY2 = 10000 - w.X1;
      }

      // Snap to target device grid
      const snapped = snapRectToGrid(
        Math.max(0, Math.min(10000, rawX1)),
        Math.max(0, Math.min(10000, rawY1)),
        Math.max(0, Math.min(10000, rawX2)),
        Math.max(0, Math.min(10000, rawY2)),
        targetGrid.cols,
        targetGrid.rows
      );

      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      return copy;
    });
    return cloned;
  }

  // 3. Proportional Scaling Strategy
  if (strategy === 'proportional') {
    cloned.widgets = page.widgets.map((w) => {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(w));
      const snapped = snapRectToGrid(w.X1, w.Y1, w.X2, w.Y2, targetGrid.cols, targetGrid.rows);
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      return copy;
    });
    return cloned;
  }

  // 4. Adaptive Strategy (Smart paragliding cockpit reflow)
  return convertAdaptive(page, fromOrientation, toOrientation, targetGrid);
}

function isMapWidget(className: string): boolean {
  return (
    className.includes('WXCAssistant') ||
    className.includes('WCompMap') ||
    className.includes('WVTM') ||
    className.includes('Map')
  );
}

function isSideViewWidget(className: string): boolean {
  return className.includes('WSideView');
}

function isStatusLineWidget(className: string): boolean {
  return className.includes('WStatusLine');
}

/**
 * Smart cockpit adaptive converter:
 * - Adapts map/sideview to primary viewport split (vertical vs horizontal split).
 * - Reflows data telemetry gauges into clean columns/rows snapped to target grid.
 */
function convertAdaptive(
  page: XcfgPage,
  fromOrientation: Orientation,
  toOrientation: Orientation,
  targetGrid: { cols: number; rows: number }
): XcfgPage {
  const cloned: XcfgPage = {
    CLASS: page.CLASS,
    navigations: JSON.parse(JSON.stringify(page.navigations)),
    widgets: [],
  };

  const mapWidgets = page.widgets.filter((w) => isMapWidget(w.CLASS));
  const sideViewWidgets = page.widgets.filter((w) => isSideViewWidget(w.CLASS));
  const statusLineWidgets = page.widgets.filter((w) => isStatusLineWidget(w.CLASS));
  const dataWidgets = page.widgets.filter(
    (w) => !isMapWidget(w.CLASS) && !isSideViewWidget(w.CLASS) && !isStatusLineWidget(w.CLASS)
  );

  const hasMap = mapWidgets.length > 0;
  const hasSideView = sideViewWidgets.length > 0;
  const hasStatusLine = statusLineWidgets.length > 0;
  const hasData = dataWidgets.length > 0;
  const hasLeftDeck = hasData || hasStatusLine;

  if (toOrientation === 'landscape') {
    // ========================================================================
    // CONVERTING TO LANDSCAPE (Wide & Short: e.g. 52 cols × 23 rows)
    // ========================================================================
    const dataPanelWidth = hasMap ? (hasLeftDeck ? 2800 : 0) : 10000;
    const sideViewHeight = hasSideView ? 2200 : 0;
    const statusLineHeight = hasStatusLine ? 350 : 0;

    // 1. Map Widget: Takes right side of screen (or full screen if no left deck)
    for (const mapW of mapWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(mapW));
      const snapped = snapRectToGrid(
        dataPanelWidth,
        0,
        10000,
        hasSideView ? 10000 - sideViewHeight : 10000,
        targetGrid.cols,
        targetGrid.rows
      );
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }

    // 2. Side View Widget: Spans bottom right under map (or bottom full width if no map)
    for (const sideW of sideViewWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(sideW));
      const snapped = snapRectToGrid(
        hasMap && hasLeftDeck ? dataPanelWidth : 0,
        10000 - sideViewHeight,
        10000,
        10000,
        targetGrid.cols,
        targetGrid.rows
      );
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }

    // 3. Status Line: Top of left panel (or top of screen)
    for (const statusW of statusLineWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(statusW));
      const snapped = snapRectToGrid(
        0,
        0,
        dataPanelWidth > 0 ? dataPanelWidth : 10000,
        statusLineHeight,
        targetGrid.cols,
        targetGrid.rows
      );
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }

    // 4. Data Widgets: Stack in left column (or grid if no map)
    const availableY1 = hasStatusLine ? statusLineHeight : 0;
    const availableY2 = 10000;
    const availableHeight = availableY2 - availableY1;

    if (dataWidgets.length > 0) {
      if (hasMap) {
        // Stack in 1 or 2 sub-columns in left panel
        const numCols = dataWidgets.length > 6 ? 2 : 1;
        const subColWidth = Math.floor(dataPanelWidth / numCols);
        const rowsPerCol = Math.ceil(dataWidgets.length / numCols);
        const rowHeight = Math.floor(availableHeight / Math.max(1, rowsPerCol));

        dataWidgets.forEach((w, idx) => {
          const colIdx = Math.floor(idx / rowsPerCol);
          const rowIdx = idx % rowsPerCol;
          const copy: XcfgWidget = JSON.parse(JSON.stringify(w));

          const rawX1 = colIdx * subColWidth;
          const rawX2 = (colIdx + 1) * subColWidth;
          const rawY1 = availableY1 + rowIdx * rowHeight;
          const rawY2 = availableY1 + (rowIdx + 1) * rowHeight;

          const snapped = snapRectToGrid(rawX1, rawY1, rawX2, rawY2, targetGrid.cols, targetGrid.rows);
          copy.X1 = snapped.X1;
          copy.Y1 = snapped.Y1;
          copy.X2 = snapped.X2;
          copy.Y2 = snapped.Y2;
          cloned.widgets.push(copy);
        });
      } else {
        // Grid of data gauges (no map)
        const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(dataWidgets.length * 1.5))));
        const rows = Math.ceil(dataWidgets.length / cols);
        const cellW = Math.floor(10000 / cols);
        const cellH = Math.floor(availableHeight / Math.max(1, rows));

        dataWidgets.forEach((w, idx) => {
          const colIdx = idx % cols;
          const rowIdx = Math.floor(idx / cols);
          const copy: XcfgWidget = JSON.parse(JSON.stringify(w));

          const rawX1 = colIdx * cellW;
          const rawX2 = (colIdx + 1) * cellW;
          const rawY1 = availableY1 + rowIdx * cellH;
          const rawY2 = availableY1 + (rowIdx + 1) * cellH;

          const snapped = snapRectToGrid(rawX1, rawY1, rawX2, rawY2, targetGrid.cols, targetGrid.rows);
          copy.X1 = snapped.X1;
          copy.Y1 = snapped.Y1;
          copy.X2 = snapped.X2;
          copy.Y2 = snapped.Y2;
          cloned.widgets.push(copy);
        });
      }
    }
  } else {
    // ========================================================================
    // CONVERTING TO PORTRAIT (Narrow & Tall: e.g. 23 cols × 52 rows)
    // ========================================================================
    const statusLineHeight = hasStatusLine ? 200 : 0;
    const sideViewHeight = hasSideView ? 1600 : 0;
    const mapHeight = hasMap
      ? hasData
        ? hasSideView
          ? 5200
          : 6800
        : 10000 - statusLineHeight - sideViewHeight
      : 0;
    const dataHeight = hasMap ? (hasData ? 10000 - mapHeight - sideViewHeight - statusLineHeight : 0) : 10000 - statusLineHeight;

    // 1. Status Line at top
    for (const statusW of statusLineWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(statusW));
      const snapped = snapRectToGrid(0, 0, 10000, statusLineHeight, targetGrid.cols, targetGrid.rows);
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }

    // 2. Data Widgets: placed above map in rows (2-3 columns per row)
    if (dataWidgets.length > 0) {
      const dataStartY = statusLineHeight;
      const cols = dataWidgets.length > 4 ? 3 : 2;
      const rows = Math.ceil(dataWidgets.length / cols);
      const cellW = Math.floor(10000 / cols);
      const cellH = Math.floor(dataHeight / Math.max(1, rows));

      dataWidgets.forEach((w, idx) => {
        const colIdx = idx % cols;
        const rowIdx = Math.floor(idx / cols);
        const copy: XcfgWidget = JSON.parse(JSON.stringify(w));

        const rawX1 = colIdx * cellW;
        const rawX2 = (colIdx + 1) * cellW;
        const rawY1 = dataStartY + rowIdx * cellH;
        const rawY2 = dataStartY + (rowIdx + 1) * cellH;

        const snapped = snapRectToGrid(rawX1, rawY1, rawX2, rawY2, targetGrid.cols, targetGrid.rows);
        copy.X1 = snapped.X1;
        copy.Y1 = snapped.Y1;
        copy.X2 = snapped.X2;
        copy.Y2 = snapped.Y2;
        cloned.widgets.push(copy);
      });
    }

    // 3. Map Widget: takes middle/bottom portion
    const mapStartY = 10000 - mapHeight - sideViewHeight;
    for (const mapW of mapWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(mapW));
      const snapped = snapRectToGrid(
        0,
        mapStartY,
        10000,
        mapStartY + mapHeight,
        targetGrid.cols,
        targetGrid.rows
      );
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }

    // 4. Side View Widget: spans bottom
    for (const sideW of sideViewWidgets) {
      const copy: XcfgWidget = JSON.parse(JSON.stringify(sideW));
      const snapped = snapRectToGrid(
        0,
        10000 - sideViewHeight,
        10000,
        10000,
        targetGrid.cols,
        targetGrid.rows
      );
      copy.X1 = snapped.X1;
      copy.Y1 = snapped.Y1;
      copy.X2 = snapped.X2;
      copy.Y2 = snapped.Y2;
      cloned.widgets.push(copy);
    }
  }

  return cloned;
}
