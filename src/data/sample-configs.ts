import { XcfgFile } from '../types/xcfg';
import { WPXCAssistant, WPThermalAssistant, WPCompetition, WPEmpty, createPageFromTemplate } from './page-templates';

/**
 * Standard, clean demo configurations (no personal user data).
 * Used as built-in examples and default editor state.
 */

export const DEMO_MODERN_BACKUP: XcfgFile = {
  info: {
    device: 'Google Pixel 8 Pro',
    exportType: 'backup',
    proUpTo: 0,
    timeCreated: '2026-10-27 12:00:00+0000',
    versionCode: 100072,
    versionName: '1.0.7-beta',
  },
  airspaceSelectedChannels: [],
  preferences: {
    'Display.Orientation': 'PORTRAIT',
    'Display.Theme': 'BlackTheme',
    'Pilot.Name': 'Paraglider Pilot',
    'Glider.Name': 'Standard Paraglider',
    'Glider.TrimSpeed': 38.0,
    'Glider.GoalGlideRatio': 8.0,
    'Unit.Altitude': 'm',
    'Unit.Distance': 'km',
    'Unit.Speed': 'km/h',
    'Unit.VerticalSpeed': 'm/s',
  },
  layout: {
    portrait: [
      createPageFromTemplate('WPXCAssistant', 'portrait'),
      createPageFromTemplate('WPThermalAssistant', 'portrait'),
      createPageFromTemplate('WPCompetition', 'portrait'),
    ],
    landscape: [
      createPageFromTemplate('WPXCAssistant', 'landscape'),
      createPageFromTemplate('WPThermalAssistant', 'landscape'),
      createPageFromTemplate('WPCompetition', 'landscape'),
    ],
  },
};

export const DEMO_XC_ASSISTANT: XcfgFile = {
  info: {
    device: 'Hannspree Lumo 7.8"',
    exportType: 'backup',
    proUpTo: 0,
    timeCreated: '2026-10-27 12:00:00+0000',
    versionCode: 100072,
    versionName: '1.0.7-beta',
  },
  airspaceSelectedChannels: [],
  preferences: {
    'Display.Orientation': 'PORTRAIT',
    'Display.Theme': 'WhiteEInkTheme',
    'Pilot.Name': 'XC Pilot',
    'Glider.Name': 'EN-B Glider',
    'Unit.Altitude': 'm',
    'Unit.Distance': 'km',
    'Unit.Speed': 'km/h',
    'Unit.VerticalSpeed': 'm/s',
  },
  layout: {
    portrait: [
      createPageFromTemplate('WPXCAssistant', 'portrait'),
      createPageFromTemplate('WPThermalAssistant', 'portrait'),
    ],
    landscape: [
      createPageFromTemplate('WPXCAssistant', 'landscape'),
    ],
  },
};

export const DEMO_COMPETITION: XcfgFile = {
  info: {
    device: 'AIR³ 7.3 / 7.3+',
    exportType: 'backup',
    proUpTo: 0,
    timeCreated: '2026-10-27 12:00:00+0000',
    versionCode: 100072,
    versionName: '1.0.7-beta',
  },
  airspaceSelectedChannels: [],
  preferences: {
    'Display.Orientation': 'LANDSCAPE',
    'Display.Theme': 'BlackTheme',
    'Pilot.Name': 'Competition Pilot',
    'Glider.Name': 'Competition Wing',
    'Unit.Altitude': 'm',
    'Unit.Distance': 'km',
    'Unit.Speed': 'km/h',
    'Unit.VerticalSpeed': 'm/s',
  },
  layout: {
    portrait: [
      createPageFromTemplate('WPCompetition', 'portrait'),
    ],
    landscape: [
      createPageFromTemplate('WPCompetition', 'landscape'),
      createPageFromTemplate('WPThermalAssistant', 'landscape'),
    ],
  },
};

export const DEMO_PAGES_ONLY: XcfgFile = {
  info: {
    device: 'Google Pixel 8 Pro',
    exportType: 'pages',
    timeCreated: '2026-10-27 12:00:00+0000',
    versionCode: 100072,
    versionName: '1.0.7-beta',
  },
  layout: {
    portrait: [
      createPageFromTemplate('WPXCAssistant', 'portrait'),
    ],
    landscape: [
      createPageFromTemplate('WPXCAssistant', 'landscape'),
    ],
  },
};

export interface BuiltinSample {
  name: string;
  filename: string;
  description?: string;
  config: XcfgFile;
}

export const BUILTIN_SAMPLES: BuiltinSample[] = [
  {
    name: 'XCTrack 1.0 Modern Full Setup (Pixel 8 Pro)',
    filename: 'xctrack_1.0_modern_backup.xcfg',
    description: '3 pages portrait & landscape with widgets, maps and modern preferences',
    config: DEMO_MODERN_BACKUP,
  },
  {
    name: 'XC Assistant + Thermal (Hannspree Lumo 7.8" E-Ink)',
    filename: 'xctrack_lumo_xc.xcfg',
    description: 'Optimized high-contrast layout for 7.8" sunlight readable color E-Ink',
    config: DEMO_XC_ASSISTANT,
  },
  {
    name: 'Competition Task Cockpit (AIR³ 7.3 Landscape)',
    filename: 'xctrack_competition_landscape.xcfg',
    description: 'Competition task navigation, turnpoint cylinders & glide angle cockpit',
    config: DEMO_COMPETITION,
  },
  {
    name: 'Pages Only Layout Template',
    filename: 'xctrack_pages_template.xcfg',
    description: 'Standard layout pages export without user preferences or pilots',
    config: DEMO_PAGES_ONLY,
  },
];
