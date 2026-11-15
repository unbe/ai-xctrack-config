import { XcfgPage, XcfgFile, Orientation, DevicePreset } from '../types/xcfg';
import { getDeviceGrid } from '../data/devices';
import { normToGrid, gridToNorm } from './gridMath';

export interface ResnapOptions {
  /**
   * Distance in normalized units (0..10000) below which two edges are considered touching.
   * If omitted, dynamically computed as ~65% of the target grid cell size.
   */
  tolerance?: number;
  /**
   * Minimum width/height in grid cells. Defaults to 1x1.
   */
  minCells?: number;
}

class DisjointSet {
  private parent: Map<string, string> = new Map();

  find(id: string): string {
    if (!this.parent.has(id)) {
      this.parent.set(id, id);
      return id;
    }
    const p = this.parent.get(id)!;
    if (p === id) return id;
    const root = this.find(p);
    this.parent.set(id, root);
    return root;
  }

  union(a: string, b: string): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent.set(rootA, rootB);
    }
  }
}

interface AxisInterval {
  widgetIndex: number;
  min: number;
  max: number;
  crossMin: number;
  crossMax: number;
}

/**
 * Smart 1D Seam-Preserving Snapping Algorithm:
 * - Discovers all touching edges, outer screen borders, and aligned seams.
 * - Clusters them into equivalence classes.
 * - Maps clusters to integer grid lines strictly preserving adjacency (zero gaps / zero overlaps).
 * - Enforces minimum interval size and boundary adherence.
 */
function resnap1DAxis(
  intervals: AxisInterval[],
  gridSpan: number,
  tolerance: number,
  minCells: number = 1
): { newMin: number; newMax: number }[] {
  if (intervals.length === 0) return [];

  const BOUNDARY_MIN = '__BOUNDARY_MIN__';
  const BOUNDARY_MAX = '__BOUNDARY_MAX__';

  const ds = new DisjointSet();
  const rawCoords: Map<string, number[]> = new Map();

  const addCoord = (nodeId: string, val: number) => {
    if (!rawCoords.has(nodeId)) rawCoords.set(nodeId, []);
    rawCoords.get(nodeId)!.push(val);
  };

  for (let i = 0; i < intervals.length; i++) {
    const item = intervals[i];
    const startNode = `w_${i}_start`;
    const endNode = `w_${i}_end`;

    addCoord(startNode, item.min);
    addCoord(endNode, item.max);

    // Anchor to canvas boundaries if within tolerance
    if (item.min <= tolerance) {
      ds.union(startNode, BOUNDARY_MIN);
    }
    if (item.max >= 10000 - tolerance) {
      ds.union(endNode, BOUNDARY_MAX);
    }
  }

  // Find touching edges between widgets along this axis
  for (let i = 0; i < intervals.length; i++) {
    for (let j = 0; j < intervals.length; j++) {
      if (i === j) continue;
      const a = intervals[i];
      const b = intervals[j];

      // Cross-axis overlap check: do they share span along the other dimension?
      const crossOverlap = Math.min(a.crossMax, b.crossMax) - Math.max(a.crossMin, b.crossMin);
      const isCrossAdjacent = crossOverlap > 5; // At least small overlap

      if (isCrossAdjacent) {
        // Touching: A's end meets B's start
        if (Math.abs(a.max - b.min) <= tolerance) {
          ds.union(`w_${i}_end`, `w_${j}_start`);
        }
      }

      // Colinear edge alignment check (e.g. widgets starting at the same column/row divider)
      if (Math.abs(a.min - b.min) <= tolerance) {
        ds.union(`w_${i}_start`, `w_${j}_start`);
      }
      if (Math.abs(a.max - b.max) <= tolerance) {
        ds.union(`w_${i}_end`, `w_${j}_end`);
      }
    }
  }

  // Group all nodes by root cluster
  const clusters: Map<string, { nodes: string[]; coords: number[]; isMin: boolean; isMax: boolean }> = new Map();

  const allNodes: string[] = [];
  for (let i = 0; i < intervals.length; i++) {
    allNodes.push(`w_${i}_start`, `w_${i}_end`);
  }

  const rootMin = ds.find(BOUNDARY_MIN);
  const rootMax = ds.find(BOUNDARY_MAX);

  for (const node of allNodes) {
    const root = ds.find(node);
    if (!clusters.has(root)) {
      clusters.set(root, {
        nodes: [],
        coords: [],
        isMin: root === rootMin,
        isMax: root === rootMax,
      });
    }
    const c = clusters.get(root)!;
    c.nodes.push(node);
    const coords = rawCoords.get(node) || [];
    c.coords.push(...coords);
  }

  // Calculate ideal average coordinate for each cluster
  const clusterList: {
    id: string;
    idealCoord: number;
    assignedGrid: number;
    isMin: boolean;
    isMax: boolean;
  }[] = [];

  for (const [id, data] of clusters.entries()) {
    let idealCoord = 0;
    if (data.isMin) {
      idealCoord = 0;
    } else if (data.isMax) {
      idealCoord = 10000;
    } else if (data.coords.length > 0) {
      idealCoord = data.coords.reduce((sum, v) => sum + v, 0) / data.coords.length;
    }

    clusterList.push({
      id,
      idealCoord,
      assignedGrid: normToGrid(idealCoord, gridSpan),
      isMin: data.isMin,
      isMax: data.isMax,
    });
  }

  // Sort clusters monotonically by ideal coordinate
  clusterList.sort((a, b) => a.idealCoord - b.idealCoord);

  // Fix boundaries
  for (const c of clusterList) {
    if (c.isMin) c.assignedGrid = 0;
    if (c.isMax) c.assignedGrid = gridSpan;
  }

  // Forward pass: ensure monotonicity and minimum size between connected seams
  for (let k = 1; k < clusterList.length; k++) {
    const prev = clusterList[k - 1];
    const curr = clusterList[k];
    if (curr.idealCoord > prev.idealCoord + tolerance * 0.5) {
      curr.assignedGrid = Math.max(curr.assignedGrid, prev.assignedGrid + minCells);
    } else {
      curr.assignedGrid = Math.max(curr.assignedGrid, prev.assignedGrid);
    }
  }

  // Backward pass: clamp within gridSpan and preserve upper bound
  if (clusterList.length > 0) {
    const last = clusterList[clusterList.length - 1];
    if (last.isMax) last.assignedGrid = gridSpan;

    for (let k = clusterList.length - 2; k >= 0; k--) {
      const next = clusterList[k + 1];
      const curr = clusterList[k];
      if (curr.idealCoord < next.idealCoord - tolerance * 0.5) {
        curr.assignedGrid = Math.min(curr.assignedGrid, next.assignedGrid - minCells);
      } else {
        curr.assignedGrid = Math.min(curr.assignedGrid, next.assignedGrid);
      }
    }

    // Safety forward pass from 0
    const first = clusterList[0];
    if (first.isMin) first.assignedGrid = 0;
    for (let k = 1; k < clusterList.length; k++) {
      if (clusterList[k].assignedGrid < clusterList[k - 1].assignedGrid + (clusterList[k].idealCoord > clusterList[k - 1].idealCoord ? 1 : 0)) {
        clusterList[k].assignedGrid = Math.min(gridSpan, clusterList[k - 1].assignedGrid + 1);
      }
    }
  }

  // Map each cluster to discrete normalized coordinate
  const clusterNormValues = new Map<string, number>();
  for (const c of clusterList) {
    if (c.isMin) {
      clusterNormValues.set(c.id, 0);
    } else if (c.isMax) {
      clusterNormValues.set(c.id, 10000);
    } else {
      clusterNormValues.set(c.id, gridToNorm(Math.max(0, Math.min(gridSpan, c.assignedGrid)), gridSpan));
    }
  }

  // Assign results to each interval
  const result: { newMin: number; newMax: number }[] = [];
  for (let i = 0; i < intervals.length; i++) {
    const rootStart = ds.find(`w_${i}_start`);
    const rootEnd = ds.find(`w_${i}_end`);

    let newMin = clusterNormValues.get(rootStart) ?? 0;
    let newMax = clusterNormValues.get(rootEnd) ?? 10000;

    // Guarantee min < max
    if (newMax <= newMin) {
      newMax = Math.min(10000, gridToNorm(normToGrid(newMin, gridSpan) + minCells, gridSpan));
      if (newMax <= newMin) {
        newMin = Math.max(0, gridToNorm(normToGrid(newMax, gridSpan) - minCells, gridSpan));
      }
    }

    result.push({ newMin, newMax });
  }

  return result;
}

/**
 * Resnaps all widgets on an XcfgPage seamlessly to the target grid dimensions.
 * Guarantees zero gaps between adjacent widgets and zero outer border gaps.
 */
export function resnapPageToGrid(
  page: XcfgPage,
  targetGrid: { cols: number; rows: number },
  options: ResnapOptions = {}
): XcfgPage {
  const cloned: XcfgPage = JSON.parse(JSON.stringify(page));
  if (!cloned.widgets || cloned.widgets.length === 0) {
    return cloned;
  }

  const defaultTolerance = Math.max(
    100,
    Math.min(10000 / targetGrid.cols, 10000 / targetGrid.rows) * 0.75
  );
  const tolerance = options.tolerance ?? defaultTolerance;
  const minCells = options.minCells ?? 1;

  // 1. Prepare X intervals
  const xIntervals: AxisInterval[] = cloned.widgets.map((w, idx) => ({
    widgetIndex: idx,
    min: Math.max(0, Math.min(10000, w.X1)),
    max: Math.max(0, Math.min(10000, w.X2)),
    crossMin: Math.max(0, Math.min(10000, w.Y1)),
    crossMax: Math.max(0, Math.min(10000, w.Y2)),
  }));

  // 2. Prepare Y intervals
  const yIntervals: AxisInterval[] = cloned.widgets.map((w, idx) => ({
    widgetIndex: idx,
    min: Math.max(0, Math.min(10000, w.Y1)),
    max: Math.max(0, Math.min(10000, w.Y2)),
    crossMin: Math.max(0, Math.min(10000, w.X1)),
    crossMax: Math.max(0, Math.min(10000, w.X2)),
  }));

  // 3. Resnap both axes independently
  const snappedX = resnap1DAxis(xIntervals, targetGrid.cols, tolerance, minCells);
  const snappedY = resnap1DAxis(yIntervals, targetGrid.rows, tolerance, minCells);

  // 4. Update widget coordinates
  for (let i = 0; i < cloned.widgets.length; i++) {
    cloned.widgets[i].X1 = snappedX[i].newMin;
    cloned.widgets[i].X2 = snappedX[i].newMax;
    cloned.widgets[i].Y1 = snappedY[i].newMin;
    cloned.widgets[i].Y2 = snappedY[i].newMax;
  }

  return cloned;
}

/**
 * Resnaps an entire XcfgFile (all pages in portrait and landscape) to the target device's grid.
 */
export function resnapConfigToDevice(
  config: XcfgFile,
  device: DevicePreset,
  options: {
    useInsets?: boolean;
    pagesToResnap?: 'current' | 'all';
    activeOrientation?: Orientation;
    activePageIndex?: number;
    tolerance?: number;
  } = {}
): XcfgFile {
  const {
    useInsets = false,
    pagesToResnap = 'all',
    activeOrientation = 'portrait',
    activePageIndex = 0,
    tolerance,
  } = options;

  const newConfig: XcfgFile = JSON.parse(JSON.stringify(config));
  const portraitGrid = getDeviceGrid(device, 'portrait', useInsets);
  const landscapeGrid = getDeviceGrid(device, 'landscape', useInsets);

  if (pagesToResnap === 'current') {
    const grid = activeOrientation === 'portrait' ? portraitGrid : landscapeGrid;
    const pages = newConfig.layout[activeOrientation] || [];
    if (pages[activePageIndex]) {
      pages[activePageIndex] = resnapPageToGrid(pages[activePageIndex], grid, { tolerance });
    }
  } else {
    // Resnap all pages in portrait
    if (newConfig.layout.portrait) {
      newConfig.layout.portrait = newConfig.layout.portrait.map((page) =>
        resnapPageToGrid(page, portraitGrid, { tolerance })
      );
    }
    // Resnap all pages in landscape
    if (newConfig.layout.landscape) {
      newConfig.layout.landscape = newConfig.layout.landscape.map((page) =>
        resnapPageToGrid(page, landscapeGrid, { tolerance })
      );
    }
  }

  return newConfig;
}
