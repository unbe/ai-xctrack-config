import { XcfgFile, ExportType } from '../types/xcfg';

/**
 * Parses an XCTrack .xcfg or .json configuration string.
 * Validates essential keys ('info', 'layout').
 */
export function parseXcfg(jsonString: string): XcfgFile {
  const parsed = JSON.parse(jsonString);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON: Root must be an object');
  }

  if (!parsed.info || typeof parsed.info !== 'object') {
    throw new Error("Invalid .xcfg: Missing 'info' section");
  }

  if (!parsed.layout || typeof parsed.layout !== 'object') {
    throw new Error("Invalid .xcfg: Missing 'layout' section");
  }

  // Ensure portrait and landscape arrays exist
  if (!Array.isArray(parsed.layout.portrait)) {
    parsed.layout.portrait = [];
  }
  if (!Array.isArray(parsed.layout.landscape)) {
    parsed.layout.landscape = [];
  }

  return parsed as XcfgFile;
}

export function cleanWidgetForExport(widget: any): any {
  if (!widget || typeof widget !== 'object') return widget;
  const cleaned = { ...widget };
  delete cleaned.gridX1;
  delete cleaned.gridY1;
  delete cleaned.gridX2;
  delete cleaned.gridY2;
  delete cleaned._editorId;
  return cleaned;
}

/**
 * Serializes an XcfgFile object to standard XCTrack .xcfg JSON string with 2-space indentation.
 * Preserves key ordering and formatting conventions.
 */
export function serializeXcfg(xcfg: XcfgFile): string {
  // Deep clone to avoid mutating input
  const copy: Record<string, unknown> = {};

  // Standard XCTrack key ordering: airspaceSelectedChannels, info, layout, preferences, flarmUserTable, ...
  if (xcfg.airspaceSelectedChannels !== undefined) {
    copy.airspaceSelectedChannels = xcfg.airspaceSelectedChannels;
  }

  copy.info = xcfg.info;

  if (xcfg.layout) {
    const cleanLayout: any = {};
    for (const [ori, pages] of Object.entries(xcfg.layout)) {
      if (Array.isArray(pages)) {
        cleanLayout[ori] = pages.map((page: any) => ({
          ...page,
          widgets: Array.isArray(page.widgets)
            ? page.widgets.map((w: any) => cleanWidgetForExport(w))
            : page.widgets,
        }));
      } else {
        cleanLayout[ori] = pages;
      }
    }
    copy.layout = cleanLayout;
  } else {
    copy.layout = xcfg.layout;
  }

  if (xcfg.preferences !== undefined) {
    copy.preferences = xcfg.preferences;
  }

  if (xcfg.flarmUserTable !== undefined) {
    copy.flarmUserTable = xcfg.flarmUserTable;
  }

  // Include any other custom/unknown top-level keys
  for (const [k, v] of Object.entries(xcfg)) {
    if (
      k !== 'airspaceSelectedChannels' &&
      k !== 'info' &&
      k !== 'layout' &&
      k !== 'preferences' &&
      k !== 'flarmUserTable'
    ) {
      copy[k] = v;
    }
  }

  return JSON.stringify(copy, null, 2);
}

/**
 * Creates a blank template .xcfg file.
 */
export function createBlankXcfg(
  exportType: 'pages' | 'backup' = 'backup',
  deviceName: string = 'Standard Android Device'
): XcfgFile {
  const now = new Date();
  const timeCreated = now.toISOString().replace('T', ' ').slice(0, 19) + '+0000';

  const base: XcfgFile = {
    info: {
      device: deviceName,
      exportType,
      proUpTo: 0,
      timeCreated,
      versionCode: 100072,
      versionName: '1.0.7-beta',
    },
    layout: {
      portrait: [],
      landscape: [],
    },
  };

  if (exportType === 'backup') {
    base.airspaceSelectedChannels = [];
    base.preferences = {
      'Display.Orientation': 'SENSOR',
      'Display.Theme': 'BlackTheme',
      'Unit.Altitude': 'm',
      'Unit.Distance': 'km',
      'Unit.Speed': 'km/h',
      'Unit.VerticalSpeed': 'm/s',
    };
  }

  return base;
}

/**
 * Generates standard export filename:
 * e.g. "Google_Pixel_8_Pro_backup_2026-03-12.xcfg"
 */
export function generateExportFilename(xcfg: XcfgFile): string {
  const dateStr = new Date().toISOString().slice(0, 10);
  const deviceClean = (xcfg.info.device || 'xctrack')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');
  const type = xcfg.info.exportType || 'config';
  return `${deviceClean}_${type}_${dateStr}.xcfg`;
}
