import { XcfgFile, XcfgPage, XcfgWidget } from '../types/xcfg';
import { getWidgetDefinition } from '../data/widgets-catalog';
import { PAGE_TEMPLATES, NAVIGATION_TYPES } from '../data/page-templates';

export interface ValidationIssue {
  path: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  widgetCount: number;
  pageCount: { portrait: number; landscape: number };
}

/**
 * Validates an XCTrack .xcfg configuration object against ground-truth domain rules.
 * Checks structure, page classes, navigation tasks, widget classes, coordinates, and properties.
 */
export function validateXcfg(config: unknown): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  let widgetCount = 0;
  const pageCount = { portrait: 0, landscape: 0 };

  if (!config || typeof config !== 'object') {
    return {
      valid: false,
      errors: [{ path: 'root', message: 'Root must be a valid JSON object', code: 'INVALID_ROOT' }],
      warnings: [],
      widgetCount: 0,
      pageCount,
    };
  }

  const xcfg = config as Partial<XcfgFile>;

  // 1. Info validation
  if (!xcfg.info || typeof xcfg.info !== 'object') {
    errors.push({ path: 'info', message: "Missing required 'info' object", code: 'MISSING_INFO' });
  } else {
    if (!xcfg.info.device) {
      warnings.push({ path: 'info.device', message: 'Device name is empty or missing', code: 'EMPTY_DEVICE' });
    }
    if (xcfg.info.exportType !== 'pages' && xcfg.info.exportType !== 'backup') {
      errors.push({
        path: 'info.exportType',
        message: "exportType must be 'pages' or 'backup'",
        code: 'INVALID_EXPORT_TYPE',
      });
    }
  }

  // 2. Layout validation
  if (!xcfg.layout || typeof xcfg.layout !== 'object') {
    errors.push({ path: 'layout', message: "Missing required 'layout' object", code: 'MISSING_LAYOUT' });
  } else {
    for (const orientation of ['portrait', 'landscape'] as const) {
      const pages = xcfg.layout[orientation];
      if (!Array.isArray(pages)) {
        errors.push({
          path: `layout.${orientation}`,
          message: `${orientation} pages must be an array`,
          code: 'INVALID_PAGES_ARRAY',
        });
        continue;
      }

      pageCount[orientation] = pages.length;

      pages.forEach((page: XcfgPage, pIdx: number) => {
        const pagePath = `layout.${orientation}[${pIdx}]`;

        // Check page CLASS
        const knownPageClasses = PAGE_TEMPLATES.map((t) => t.className);
        if (!page.CLASS) {
          errors.push({ path: `${pagePath}.CLASS`, message: 'Page is missing CLASS', code: 'MISSING_PAGE_CLASS' });
        } else if (!knownPageClasses.includes(page.CLASS)) {
          warnings.push({
            path: `${pagePath}.CLASS`,
            message: `Unrecognized page CLASS: ${page.CLASS}`,
            code: 'UNKNOWN_PAGE_CLASS',
          });
        }

        // Check navigations
        if (page.navigations !== 'all' && page.navigations !== 'none') {
          if (!Array.isArray(page.navigations)) {
            errors.push({
              path: `${pagePath}.navigations`,
              message: "navigations must be 'all', 'none', or an array of task classes",
              code: 'INVALID_NAVIGATIONS',
            });
          } else {
            const knownNavs = NAVIGATION_TYPES.map((n) => n.className);
            page.navigations.forEach((navClass, nIdx) => {
              if (!knownNavs.includes(navClass)) {
                warnings.push({
                  path: `${pagePath}.navigations[${nIdx}]`,
                  message: `Unknown navigation task: ${navClass}`,
                  code: 'UNKNOWN_NAVIGATION_TASK',
                });
              }
            });
          }
        }

        // Check widgets
        if (!Array.isArray(page.widgets)) {
          errors.push({
            path: `${pagePath}.widgets`,
            message: 'widgets must be an array',
            code: 'INVALID_WIDGETS_ARRAY',
          });
          return;
        }

        page.widgets.forEach((widget: XcfgWidget, wIdx: number) => {
          widgetCount++;
          const wPath = `${pagePath}.widgets[${wIdx}]`;

          // Widget CLASS
          if (!widget.CLASS) {
            errors.push({ path: `${wPath}.CLASS`, message: 'Widget missing CLASS', code: 'MISSING_WIDGET_CLASS' });
            return;
          }

          const def = getWidgetDefinition(widget.CLASS);
          if (!def) {
            warnings.push({
              path: `${wPath}.CLASS`,
              message: `Unknown or unregistered widget CLASS: ${widget.CLASS}`,
              code: 'UNKNOWN_WIDGET_CLASS',
            });
          }

          // Coordinate bounds (0..10000)
          const { X1, Y1, X2, Y2 } = widget;
          if (typeof X1 !== 'number' || typeof Y1 !== 'number' || typeof X2 !== 'number' || typeof Y2 !== 'number') {
            errors.push({
              path: `${wPath}.coordinates`,
              message: 'X1, Y1, X2, Y2 must all be numbers',
              code: 'INVALID_COORDINATES',
            });
          } else {
            if (X1 < 0 || X1 > 10000) {
              errors.push({ path: `${wPath}.X1`, message: `X1 (${X1}) out of range 0..10000`, code: 'OUT_OF_BOUNDS' });
            }
            if (Y1 < 0 || Y1 > 10000) {
              errors.push({ path: `${wPath}.Y1`, message: `Y1 (${Y1}) out of range 0..10000`, code: 'OUT_OF_BOUNDS' });
            }
            if (X2 < 0 || X2 > 10000) {
              errors.push({ path: `${wPath}.X2`, message: `X2 (${X2}) out of range 0..10000`, code: 'OUT_OF_BOUNDS' });
            }
            if (Y2 < 0 || Y2 > 10000) {
              errors.push({ path: `${wPath}.Y2`, message: `Y2 (${Y2}) out of range 0..10000`, code: 'OUT_OF_BOUNDS' });
            }
            if (X2 <= X1) {
              errors.push({ path: `${wPath}.X2`, message: `X2 (${X2}) must be > X1 (${X1})`, code: 'ZERO_WIDTH' });
            }
            if (Y2 <= Y1) {
              errors.push({ path: `${wPath}.Y2`, message: `Y2 (${Y2}) must be > Y1 (${Y1})`, code: 'ZERO_HEIGHT' });
            }
          }

          // Background transparency
          if (widget._bg !== undefined) {
            if (typeof widget._bg !== 'number' || widget._bg < 0 || widget._bg > 100) {
              errors.push({
                path: `${wPath}._bg`,
                message: `_bg must be a number between 0 and 100 (got ${widget._bg})`,
                code: 'INVALID_BG_TRANSPARENCY',
              });
            }
          }

          // Border
          if (widget._border !== undefined && typeof widget._border !== 'boolean') {
            errors.push({
              path: `${wPath}._border`,
              message: '_border must be a boolean',
              code: 'INVALID_BORDER',
            });
          }
        });
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    widgetCount,
    pageCount,
  };
}
