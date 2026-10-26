/**
 * Color conversions for XCTrack configuration files.
 * Supports:
 * - Signed 32-bit Java integers (two's complement 0xAARRGGBB), e.g. -27091 => #FFFF962D
 * - 8-digit ARGB and 6-digit RGB hex strings (#AARRGGBB, #RRGGBB)
 * - CSS rgba strings
 * - XCTrack background transparency (_bg): 100 = transparent (alpha 0.0), 0 = opaque (alpha 1.0)
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number; // 0.0 to 1.0
}

/**
 * Converts signed 32-bit Java int or hex string to RGBA object.
 */
export function parseXctrackColor(color: number | string | undefined, defaultHex = '#000000'): RGBA {
  if (color === undefined || color === null) {
    return parseHexColor(defaultHex);
  }

  if (typeof color === 'number') {
    // Treat as signed 32-bit integer
    const unsigned = color >>> 0;
    const a = ((unsigned >>> 24) & 0xff) / 255;
    const r = (unsigned >>> 16) & 0xff;
    const g = (unsigned >>> 8) & 0xff;
    const b = unsigned & 0xff;
    return { r, g, b, a };
  }

  if (typeof color === 'string') {
    return parseHexColor(color);
  }

  return parseHexColor(defaultHex);
}

export function parseHexColor(hex: string): RGBA {
  let cleaned = hex.trim();
  if (cleaned.startsWith('#')) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.length === 6) {
    const r = parseInt(cleaned.slice(0, 2), 16) || 0;
    const g = parseInt(cleaned.slice(2, 4), 16) || 0;
    const b = parseInt(cleaned.slice(4, 6), 16) || 0;
    return { r, g, b, a: 1.0 };
  }

  if (cleaned.length === 8) {
    // In Android / XCTrack, 8-hex format is #AARRGGBB
    const a = (parseInt(cleaned.slice(0, 2), 16) || 0) / 255;
    const r = parseInt(cleaned.slice(2, 4), 16) || 0;
    const g = parseInt(cleaned.slice(4, 6), 16) || 0;
    const b = parseInt(cleaned.slice(6, 8), 16) || 0;
    return { r, g, b, a };
  }

  return { r: 0, g: 0, b: 0, a: 1.0 };
}

/**
 * Converts RGBA to CSS rgba(...) string.
 */
export function rgbaToCss(rgba: RGBA): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`;
}

/**
 * Converts RGBA to signed 32-bit integer (XCTrack format).
 */
export function rgbaToSignedInt(rgba: RGBA): number {
  const a = Math.round(rgba.a * 255) & 0xff;
  const r = rgba.r & 0xff;
  const g = rgba.g & 0xff;
  const b = rgba.b & 0xff;
  const unsigned = (a << 24) | (r << 16) | (g << 8) | b;
  return unsigned | 0; // cast to signed 32-bit int
}

/**
 * Converts RGBA to #AARRGGBB hex string.
 */
export function rgbaToHex8(rgba: RGBA): string {
  const a = Math.round(rgba.a * 255).toString(16).padStart(2, '0');
  const r = rgba.r.toString(16).padStart(2, '0');
  const g = rgba.g.toString(16).padStart(2, '0');
  const b = rgba.b.toString(16).padStart(2, '0');
  return `#${a}${r}${g}${b}`;
}

/**
 * Converts XCTrack _bg transparency value (0..100) to CSS opacity / alpha.
 * CRITICAL DOMAIN LOGIC:
 *   _bg = 100 means 100% transparent => alpha = 0.0
 *   _bg = 0 means 0% transparent (solid) => alpha = 1.0
 */
export function bgTransparencyToAlpha(bg: number | undefined): number {
  if (bg === undefined) return 0.0; // default in XCTrack is 100 (transparent)
  const clamped = Math.max(0, Math.min(100, bg));
  return (100 - clamped) / 100;
}

/**
 * Converts CSS alpha (0.0 to 1.0) back to XCTrack _bg transparency (0..100).
 */
export function alphaToBgTransparency(alpha: number): number {
  const clamped = Math.max(0, Math.min(1, alpha));
  return Math.round((1 - clamped) * 100);
}
