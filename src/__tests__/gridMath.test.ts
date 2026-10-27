import { describe, it, expect } from 'vitest';
import {
  computeGridForDevice,
  normToGrid,
  gridToNorm,
  snapRectToGrid,
  clampGridBounds,
} from '../utils/gridMath';

describe('gridMath', () => {
  it('computes expected grid for standard landscape screens', () => {
    // 360 x 640 dp, 16:9 at density 480 dpi: 33 x 19
    const landscapeGrid = computeGridForDevice(1920, 1080, 480);
    expect(landscapeGrid.cols).toBe(33);
    expect(landscapeGrid.rows).toBe(19);
  });

  it('computes expected grid for Google Pixel 8 Pro full resolution', () => {
    // 1344 x 2992 @ 480 dpi
    const portraitGrid = computeGridForDevice(1344, 2992, 480);
    expect(portraitGrid.cols).toBe(23);
    expect(portraitGrid.rows).toBe(52);
  });

  it('computes expected grid for AIR3 7.35+ tablet', () => {
    // 1200 x 1920 @ 320 dpi (600 x 960 dp)
    const tabletGrid = computeGridForDevice(1200, 1920, 320);
    expect(tabletGrid.cols).toBe(31);
    expect(tabletGrid.rows).toBe(50);
  });

  it('accurately converts normalized 0..10000 coordinates to grid units and back', () => {
    const gridCols = 33;
    const gridRows = 19;

    // In 33 cols, X1=2727 corresponds to 9/33 = 0.2727...
    const gx = normToGrid(2727, gridCols);
    expect(gx).toBe(9);
    const restoredNormX = gridToNorm(gx, gridCols);
    expect(restoredNormX).toBe(2727);

    // In 19 rows, Y1=526 corresponds to 1/19 = 0.0526...
    const gy = normToGrid(526, gridRows);
    expect(gy).toBe(1);
    const restoredNormY = gridToNorm(gy, gridRows);
    expect(restoredNormY).toBe(526);
  });

  it('clamps out-of-bound grid coordinates', () => {
    const clamped = clampGridBounds(-5, -3, 40, 25, 33, 19);
    expect(clamped.gx1).toBeGreaterThanOrEqual(0);
    expect(clamped.gy1).toBeGreaterThanOrEqual(0);
    expect(clamped.gx2).toBeLessThanOrEqual(33);
    expect(clamped.gy2).toBeLessThanOrEqual(19);
  });

  it('snaps rectangles to grid and preserves minimum size without leaking gridX/Y properties', () => {
    const snapped = snapRectToGrid(100, 200, 200, 300, 20, 40);
    expect(snapped.X2).toBeGreaterThan(snapped.X1);
    expect(snapped.Y2).toBeGreaterThan(snapped.Y1);
    expect((snapped as any).gridX1).toBeUndefined();
    expect((snapped as any).gridY1).toBeUndefined();
    expect((snapped as any).gridX2).toBeUndefined();
    expect((snapped as any).gridY2).toBeUndefined();
  });
});
