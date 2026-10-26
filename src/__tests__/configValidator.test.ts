import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { validateXcfg } from '../utils/configValidator';
import { parseXcfg, createBlankXcfg } from '../utils/xcfgSerializer';

describe('configValidator', () => {
  const exampleFiles = [
    '2023-06-28_backup-00.xcfg',
    '2023-08-23_backup-00.xcfg',
    '2024-06-12_pages-00.xcfg',
    '2026-03-12_backup-00.xcfg',
  ];

  for (const filename of exampleFiles) {
    it(`validates ${filename} with zero errors`, () => {
      const text = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8');
      const parsed = parseXcfg(text);
      const result = validateXcfg(parsed);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.widgetCount).toBeGreaterThan(0);
      expect(result.pageCount.portrait).toBeGreaterThan(0);
      expect(result.pageCount.landscape).toBeGreaterThan(0);
    });
  }

  it('validates blank template with zero errors', () => {
    const blank = createBlankXcfg('backup');
    const result = validateXcfg(blank);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('catches invalid coordinate bounds and inverted rectangles', () => {
    const badConfig = {
      info: { device: 'Test', exportType: 'pages' },
      layout: {
        portrait: [
          {
            CLASS: 'org.xcontest.XCTrack.widget.wp.WPEmpty',
            navigations: 'all',
            widgets: [
              {
                CLASS: 'org.xcontest.XCTrack.widget.w.WAltitude',
                X1: 5000,
                Y1: 5000,
                X2: 3000, // X2 < X1
                Y2: 12000, // Y2 > 10000
                _bg: 150, // _bg > 100
              },
            ],
          },
        ],
        landscape: [],
      },
    };

    const result = validateXcfg(badConfig);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'ZERO_WIDTH')).toBe(true);
    expect(result.errors.some((e) => e.code === 'OUT_OF_BOUNDS')).toBe(true);
    expect(result.errors.some((e) => e.code === 'INVALID_BG_TRANSPARENCY')).toBe(true);
  });
});
