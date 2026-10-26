// XCTrack Configuration Domain Models & Type Definitions

export type ExportType = 'pages' | 'backup';
export type Orientation = 'portrait' | 'landscape';

export interface XcfgInfo {
  versionCode: number;
  versionName: string;
  timeCreated: string;
  device: string;
  exportType: ExportType;
  proUpTo?: number;
  fingerprint?: string;
  bootstrapType?: string | null;
  [key: string]: unknown;
}

export interface XcfgWidget {
  CLASS: string;
  X1: number; // 0..10000
  Y1: number; // 0..10000
  X2: number; // 0..10000
  Y2: number; // 0..10000
  _border?: boolean;
  _bg?: number; // 0..100, where 100 is transparent, 0 is opaque
  _theme?: string; // "", "BlackTheme", "WhiteTheme", etc.
  _title?: boolean;
  titletext?: string;
  _unit?: boolean;
  _hide_labels?: boolean;
  _units?: string;
  UUID?: string; // legacy 0.9.10
  [key: string]: unknown;
}

export type PageNavigation =
  | 'all'
  | 'none'
  | string[];

export interface XcfgPage {
  CLASS: string; // 'org.xcontest.XCTrack.widget.wp.*'
  navigations: PageNavigation;
  widgets: XcfgWidget[];
  [key: string]: unknown;
}

export interface XcfgLayout {
  portrait: XcfgPage[];
  landscape: XcfgPage[];
  [key: string]: unknown;
}

export interface XcfgFile {
  info: XcfgInfo;
  layout: XcfgLayout;
  preferences?: Record<string, unknown>;
  airspaceSelectedChannels?: number[];
  flarmUserTable?: Record<string, string>;
  [key: string]: unknown;
}

// Widget Catalog & Property Schemas
export type PropertyType =
  | 'boolean'
  | 'number'
  | 'string'
  | 'enum'
  | 'color'
  | 'object'
  | 'map_scale'
  | 'map_rotation'
  | 'map_appearance'
  | 'webview_scale'
  | 'webview_scroll';

export interface PropertyOption {
  value: string | number;
  label: string;
  description?: string;
}

export interface PropertyDescriptor {
  key: string;
  label: string;
  type: PropertyType;
  defaultValue: unknown;
  description?: string;
  isPro?: boolean;
  options?: PropertyOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export interface WidgetDefinition {
  className: string;
  shortName: string;
  title: string;
  description: string;
  category: string;
  defaultGrid: { width: number; height: number };
  isPro: boolean;
  baseClass: string;
  aliases?: string[];
  properties: PropertyDescriptor[];
  interactivity?: 'none' | 'short_click' | 'long_click' | 'touchable';
}

// Device Preset Definition
export interface DevicePreset {
  id: string;
  name: string;
  brand: string;
  category: 'Dedicated Flight Instrument' | 'Rugged Tablet' | 'Rugged Phone' | 'Phone' | 'Foldable' | 'E-Ink' | 'HUD Glasses' | 'Custom';
  screenWidthPx: number;
  screenHeightPx: number;
  densityDpi: number;
  viewportWidthDp: number;
  viewportHeightDp: number;
  aspectRatio: string;
  screenSizeInches?: number;
  gridPortrait: { cols: number; rows: number };
  gridLandscape: { cols: number; rows: number };
  gridPortraitInset?: { cols: number; rows: number };
  gridLandscapeInset?: { cols: number; rows: number };
  isHUD?: boolean;
  notes?: string;
}
