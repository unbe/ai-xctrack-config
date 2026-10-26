import { describe, it, expect } from 'vitest';
import {
  parseXctrackColor,
  parseHexColor,
  rgbaToSignedInt,
  rgbaToHex8,
  bgTransparencyToAlpha,
  alphaToBgTransparency,
} from '../utils/colorMath';

describe('colorMath', () => {
  it('converts signed 32-bit integer (-27091) from example .xcfg to ARGB', () => {
    // -27091 is 0xFFFF962D in two's complement (Orange tracklog color)
    const color = parseXctrackColor(-27091);
    expect(color.a).toBe(1.0);
    expect(color.r).toBe(255);
    expect(color.g).toBe(150);
    expect(color.b).toBe(45);

    // Round-trip back to signed 32-bit int
    const signedInt = rgbaToSignedInt(color);
    expect(signedInt).toBe(-27091);
  });

  it('converts 8-hex ARGB strings (#b4800000)', () => {
    const color = parseHexColor('#b4800000');
    expect(color.r).toBe(128);
    expect(color.g).toBe(0);
    expect(color.b).toBe(0);
    expect(Math.round(color.a * 255)).toBe(0xb4);

    const hex8 = rgbaToHex8(color);
    expect(hex8.toLowerCase()).toBe('#b4800000');
  });

  it('handles background transparency correctly according to XCTrack semantics', () => {
    // _bg: 100 is 100% transparent => alpha = 0.0
    expect(bgTransparencyToAlpha(100)).toBe(0.0);
    // _bg: 0 is 0% transparent (solid) => alpha = 1.0
    expect(bgTransparencyToAlpha(0)).toBe(1.0);
    // _bg: 40 is 40% transparent => alpha = 0.6
    expect(bgTransparencyToAlpha(40)).toBeCloseTo(0.6);

    // Reverse conversion
    expect(alphaToBgTransparency(0.0)).toBe(100);
    expect(alphaToBgTransparency(1.0)).toBe(0);
    expect(alphaToBgTransparency(0.6)).toBe(40);
  });
});
