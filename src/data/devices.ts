import rawDevices from '../../devices.json';
import { DevicePreset, Orientation } from '../types/xcfg';

interface RawDeviceItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  screenSizeInches?: number;
  nativeResolution: { width: number; height: number };
  aspectRatio: string;
  androidDensityDpi: number;
  recommendedGrid: {
    portrait: { cols: number; rows: number };
    landscape: { cols: number; rows: number };
  };
  systemInsetsGrid?: {
    portrait?: { cols: number; rows: number };
    landscape?: { cols: number; rows: number };
  };
  notes?: string;
  isHUD?: boolean;
}

interface RawDevicesJson {
  xctrackGridFormula: unknown;
  devices: RawDeviceItem[];
}

const data = rawDevices as unknown as RawDevicesJson;

export const ALL_DEVICES: DevicePreset[] = (data.devices || []).map((d) => ({
  id: d.id,
  name: d.name,
  brand: d.brand,
  category: d.category as DevicePreset['category'],
  screenWidthPx: d.nativeResolution.width,
  screenHeightPx: d.nativeResolution.height,
  densityDpi: d.androidDensityDpi,
  viewportWidthDp: Math.round((d.nativeResolution.width * 160) / d.androidDensityDpi),
  viewportHeightDp: Math.round((d.nativeResolution.height * 160) / d.androidDensityDpi),
  aspectRatio: d.aspectRatio,
  screenSizeInches: d.screenSizeInches,
  gridPortrait: d.recommendedGrid.portrait,
  gridLandscape: d.recommendedGrid.landscape,
  gridPortraitInset: d.systemInsetsGrid?.portrait || d.recommendedGrid.portrait,
  gridLandscapeInset: d.systemInsetsGrid?.landscape || d.recommendedGrid.landscape,
  isHUD: d.isHUD || false,
  notes: d.notes,
}));

export const DEFAULT_DEVICE_ID = 'pixel-8-pro';

export function getAllDevices(): DevicePreset[] {
  return ALL_DEVICES;
}

export function getDeviceById(id: string): DevicePreset {
  const found = ALL_DEVICES.find((d) => d.id === id);
  if (found) return found;
  return ALL_DEVICES[0];
}

export function getDeviceCategories(): string[] {
  const cats = new Set<string>();
  for (const d of ALL_DEVICES) {
    if (d.category) cats.add(d.category);
  }
  return Array.from(cats);
}

export function getDevicesByCategory(category: string): DevicePreset[] {
  return ALL_DEVICES.filter((d) => d.category === category);
}

/**
 * Auto-detects device preset by matching info.device string from .xcfg
 * e.g. "Google Pixel 8 Pro 16", "Google Pixel 6 Pro 13", "AIR3 7.3"
 */
export function findMatchingDevice(deviceString?: string): DevicePreset {
  if (!deviceString) return getDeviceById(DEFAULT_DEVICE_ID);

  const lower = deviceString.toLowerCase();

  if (lower.includes('pixel 8 pro') || lower.includes('pixel 9 pro xl')) {
    return getDeviceById('pixel-8-pro');
  }
  if (lower.includes('pixel 6 pro') || lower.includes('pixel 7 pro')) {
    return getDeviceById('pixel-6-pro');
  }
  if (lower.includes('air3') || lower.includes('air 3') || lower.includes('air³')) {
    if (lower.includes('7.2')) return getDeviceById('air3-7.2');
    return getDeviceById('air3-7.3-plus');
  }
  if (lower.includes('tab active')) {
    if (lower.includes('4')) return getDeviceById('samsung-galaxy-tab-active-4-pro');
    return getDeviceById('samsung-galaxy-tab-active-3');
  }
  if (lower.includes('tripltek')) {
    if (lower.includes('7')) return getDeviceById('tripltek-7-pro');
    return getDeviceById('tripltek-8-pro');
  }
  if (lower.includes('hisense')) {
    if (lower.includes('a5')) return getDeviceById('hisense-a5');
    if (lower.includes('a7')) return getDeviceById('hisense-a7');
    return getDeviceById('hisense-a9');
  }
  if (lower.includes('palma')) {
    return getDeviceById('onyx-boox-palma');
  }

  for (const device of ALL_DEVICES) {
    if (lower.includes(device.name.toLowerCase()) || lower.includes(device.id)) {
      return device;
    }
  }

  return getDeviceById(DEFAULT_DEVICE_ID);
}

export function getDeviceGrid(
  device: DevicePreset,
  orientation: Orientation,
  useInset: boolean = false
): { cols: number; rows: number } {
  if (orientation === 'landscape') {
    if (useInset && device.gridLandscapeInset) {
      return device.gridLandscapeInset;
    }
    return device.gridLandscape;
  } else {
    if (useInset && device.gridPortraitInset) {
      return device.gridPortraitInset;
    }
    return device.gridPortrait;
  }
}
