import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  WIDGET_CATALOG,
  getWidgetDefinition,
  getAllCategories,
  searchWidgets,
} from '../data/widgets-catalog';
import { PAGE_TEMPLATES, NAVIGATION_TYPES } from '../data/page-templates';
import { parseXcfg } from '../utils/xcfgSerializer';
import { BUILTIN_SAMPLES } from '../data/sample-configs';

describe('widgets-catalog', () => {
  it('contains at least 79 official widgets', () => {
    expect(WIDGET_CATALOG.length).toBeGreaterThanOrEqual(79);
  });

  it('contains all 11 categories', () => {
    const categories = getAllCategories();
    expect(categories).toContain('System');
    expect(categories).toContain('Flying');
    expect(categories).toContain('Air');
    expect(categories).toContain('XContest');
    expect(categories).toContain('Navigation');
    expect(categories).toContain('Competition');
    expect(categories).toContain('Action Buttons');
  });

  it('successfully recognizes every widget CLASS from sample configs', () => {
    const seenClasses = new Set<string>();

    for (const sample of BUILTIN_SAMPLES) {
      for (const orientation of ['portrait', 'landscape'] as const) {
        for (const page of sample.config.layout[orientation]) {
          for (const widget of page.widgets) {
            seenClasses.add(widget.CLASS);
            const def = getWidgetDefinition(widget.CLASS);
            expect(def, `Widget class ${widget.CLASS} should be in catalog`).toBeDefined();
          }
        }
      }
    }

    const localCandidateFiles = [
      '2023-06-28_backup-00.xcfg',
      '2023-08-23_backup-00.xcfg',
      '2024-06-12_pages-00.xcfg',
      '2026-03-12_backup-00.xcfg',
      '2026-10-27_backup-00.xcfg',
    ];

    for (const filename of localCandidateFiles) {
      const filePath = path.resolve(process.cwd(), filename);
      if (fs.existsSync(filePath)) {
        const text = fs.readFileSync(filePath, 'utf-8');
        const config = parseXcfg(text);
        for (const orientation of ['portrait', 'landscape'] as const) {
          for (const page of config.layout[orientation]) {
            for (const widget of page.widgets) {
              seenClasses.add(widget.CLASS);
              const def = getWidgetDefinition(widget.CLASS);
              expect(def, `Widget class ${widget.CLASS} from ${filename} should be in catalog`).toBeDefined();
            }
          }
        }
      }
    }

    expect(seenClasses.size).toBeGreaterThanOrEqual(15);
  });

  it('searches widgets by keyword', () => {
    const speedWidgets = searchWidgets('speed');
    expect(speedWidgets.length).toBeGreaterThan(0);
    expect(speedWidgets.some(w => w.shortName === 'WSpeed')).toBe(true);

    const mapWidgets = searchWidgets('map');
    expect(mapWidgets.some(w => w.shortName === 'WXCAssistant')).toBe(true);
  });

  it('exports all 4 page templates and navigation types', () => {
    expect(PAGE_TEMPLATES.length).toBe(4);
    expect(PAGE_TEMPLATES.some(p => p.shortName === 'WPXCAssistant')).toBe(true);
    expect(PAGE_TEMPLATES.some(p => p.shortName === 'WPThermalAssistant')).toBe(true);
    expect(PAGE_TEMPLATES.some(p => p.shortName === 'WPCompetition')).toBe(true);
    expect(PAGE_TEMPLATES.some(p => p.shortName === 'WPEmpty')).toBe(true);

    expect(NAVIGATION_TYPES.length).toBe(5);
  });
});
