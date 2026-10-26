import rawDevices from '../../devices.json';
import { DevicePreset, Orientation } from '../types/xcfg';

export interface DeviceDatabase {
  version: string;
  gridFormula: {
    cellPhysicalMm: number;
    densityDpiStandard: number;
    cellDpExact: number;
    formula: string;
  };
  deviceFamilies: Array<{
    category: string;
    description: string;
    devices: DevicePreset[];
  }>;
}

const data = rawDevices as unknown as DeviceDatabase;

export const ALL_DEVICES: DevicePreset[] = data.deviceFamilies.flatMap(f => f.devices);

export const DEFAULT_DEVICE_ID = 'pixel-8-pro';

export function getAllDevices(): DevicePreset[] {
  return ALL_DEVICES;
}

export function getDeviceById(id: string): DevicePreset {
  const found = ALL_DEVICES.find(d => d.id === id);
  if (found) return found;
  return ALL_DEVICES[0]; // fallback to first device
}

export function getDeviceCategories(): string[] {
  return data.deviceFamilies.map(f => f.category);
}

export function getDevicesByCategory(category: string): DevicePreset[] {
  const family = data.deviceFamilies.find(f => f.category === category);
  return family ? family.devices : [];
}

/**
 * Auto-detects device preset by matching info.device string from .xcfg
 * e.g. "Google Pixel 8 Pro 16", "Google Pixel 6 Pro 13", "AIR3 7.3"
 */
export function findMatchingDevice(deviceString?: string): DevicePreset {
  if (!deviceString) return getDeviceById(DEFAULT_DEVICE_ID);

  const lower = deviceString.toLowerCase();

  // Try exact and substring matches
  if (lower.includes('pixel 8 pro') || lower.includes('pixel 9 pro xl')) {
    return getDeviceById('pixel-8-pro') || getDeviceById(DEFAULT_DEVICE_ID);
  }
  if (lower.includes('pixel 6 pro') || lower.includes('pixel 7 pro')) {
    return getDeviceById('pixel-6-pro') || getDeviceById(DEFAULT_DEVICE_ID);
  }
  if (lower.includes('air3') || lower.includes('air 3') || lower.includes('air³')) {
    if (lower.includes('7.2')) return getDeviceById('air3-7-2');
    return getDeviceById('air3-7-35');
  }
  if (lower.includes('tab active')) {
    if (lower.includes('4')) return getDeviceById('samsung-tab-active-4-pro');
    return getDeviceById('samsung-tab-active-3-5');
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
    return getDeviceById('boox-palma');
  }
  if (lower.includes('s24') || lower.includes('s25') || lower.includes('s23') || lower.includes('s22')) {
    if (lower.includes('ultra')) return getDeviceById('samsung-s24-ultra');
    return getDeviceById('samsung-s24-plus');
  }

  // Generic fallback: check if any device id or name matches
  for (const device of ALL_DEVICES) {
    if (lower.includes(device.name.toLowerCase()) || lower.includes(device.id)) {
      return device;
    }
  }

  return getDeviceById(DEFAULT_DEVICE_ID);
}

/**
 * Returns grid cols and rows for a device given orientation and inset flag.
 */
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
