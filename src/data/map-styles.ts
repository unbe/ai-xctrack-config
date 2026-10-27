/**
 * XCTrack Map Appearance, Themes, and Terrain Profiles
 * Reverse-engineered from org.xcontest.XCTrack.widget.helper.r, e0, and c0.
 */

export interface MapThemeDef {
  id: string; // e0 enum value
  name: string;
  osmThemeFile: string | null;
  isPro?: boolean;
  hasRoads: boolean;
  description: string;
  preview: {
    bg: string;
    roadPrimary: string;
    roadSecondary: string;
    roadWidth: number;
    forestFill?: string;
    isDark: boolean;
    waterColor: string;
    labelColor: string;
  };
}

export interface TerrainDef {
  id: string; // c0 enum value
  name: string;
  isPro?: boolean;
  hasHillshading: boolean;
  hasElevationGradient: boolean;
  description: string;
  preview: {
    reliefGradient: string;
    shadowOpacity: number;
    textColor: string;
  };
}

export interface MapAppearancePreset {
  id: string;
  name: string;
  category: 'featured' | 'extra' | 'classic' | 'relief' | 'empty';
  theme: string;
  terrain: string;
  isPro?: boolean;
  description: string;
}

export const MAP_THEMES: MapThemeDef[] = [
  {
    id: 'None',
    name: 'No Roadmap',
    osmThemeFile: null,
    hasRoads: false,
    description: 'Vector roads disabled. Only terrain elevation relief and airspace overlays are shown.',
    preview: {
      bg: '#1e293b',
      roadPrimary: 'transparent',
      roadSecondary: 'transparent',
      roadWidth: 0,
      isDark: true,
      waterColor: '#0284c7',
      labelColor: '#94a3b8',
    },
  },
  {
    id: 'ClearpilotForest',
    name: 'Clearpilot [forests]',
    osmThemeFile: 'lightpilot/lightpilot-transp-forest.xml',
    isPro: true,
    hasRoads: true,
    description: 'Semi-transparent roads with lush green forest polygons to identify landable fields and terrain.',
    preview: {
      bg: '#14231b',
      roadPrimary: '#cbd5e1',
      roadSecondary: '#94a3b8',
      roadWidth: 2,
      forestFill: 'rgba(34, 197, 94, 0.28)',
      isDark: true,
      waterColor: '#38bdf8',
      labelColor: '#f1f5f9',
    },
  },
  {
    id: 'ClearpilotForestBig',
    name: 'Clearpilot [forests, big fonts]',
    osmThemeFile: 'lightpilot/lightpilot-transp-forest-big.xml',
    isPro: true,
    hasRoads: true,
    description: 'Clearpilot with forests and enlarged typography for high-vibration cockpit legibility.',
    preview: {
      bg: '#14231b',
      roadPrimary: '#cbd5e1',
      roadSecondary: '#94a3b8',
      roadWidth: 2.5,
      forestFill: 'rgba(34, 197, 94, 0.28)',
      isDark: true,
      waterColor: '#38bdf8',
      labelColor: '#ffffff',
    },
  },
  {
    id: 'ClearpilotForestDark',
    name: 'Clearpilot [forests dark]',
    osmThemeFile: 'lightpilot/lightpilot-transp-forest-dark.xml',
    isPro: true,
    hasRoads: true,
    description: 'Dark semi-transparent road network with subdued forest overlays for night and OLED screens.',
    preview: {
      bg: '#0c1510',
      roadPrimary: '#64748b',
      roadSecondary: '#475569',
      roadWidth: 2,
      forestFill: 'rgba(21, 128, 61, 0.22)',
      isDark: true,
      waterColor: '#0284c7',
      labelColor: '#cbd5e1',
    },
  },
  {
    id: 'ClearpilotForestDarkBig',
    name: 'Clearpilot [forests dark, big fonts]',
    osmThemeFile: 'lightpilot/lightpilot-transp-forest-dark-big.xml',
    isPro: true,
    hasRoads: true,
    description: 'Dark forest style with enlarged road and settlement labels.',
    preview: {
      bg: '#0c1510',
      roadPrimary: '#64748b',
      roadSecondary: '#475569',
      roadWidth: 2.5,
      forestFill: 'rgba(21, 128, 61, 0.22)',
      isDark: true,
      waterColor: '#0284c7',
      labelColor: '#ffffff',
    },
  },
  {
    id: 'Clearpilot',
    name: 'Clearpilot',
    osmThemeFile: 'lightpilot/lightpilot-transp.xml',
    isPro: true,
    hasRoads: true,
    description: 'Transparent road overlay allowing maximum terrain visibility underneath.',
    preview: {
      bg: '#1e293b',
      roadPrimary: '#cbd5e1',
      roadSecondary: '#94a3b8',
      roadWidth: 1.8,
      isDark: true,
      waterColor: '#38bdf8',
      labelColor: '#f8fafc',
    },
  },
  {
    id: 'ClearpilotDark',
    name: 'Clearpilot Dark',
    osmThemeFile: 'lightpilot/lightpilot-transp-dark.xml',
    isPro: true,
    hasRoads: true,
    description: 'Dark transparent road overlay optimized for dark themes.',
    preview: {
      bg: '#0f172a',
      roadPrimary: '#64748b',
      roadSecondary: '#475569',
      roadWidth: 1.8,
      isDark: true,
      waterColor: '#0284c7',
      labelColor: '#94a3b8',
    },
  },
  {
    id: 'Hyperpilot',
    name: 'Hyperpilot',
    osmThemeFile: 'hyperpilot/hyperpilot.xml',
    hasRoads: true,
    description: 'High-visibility aviation map with prominent orange highways and yellow trunk roads.',
    preview: {
      bg: '#f8fafc',
      roadPrimary: '#ea580c',
      roadSecondary: '#eab308',
      roadWidth: 2.5,
      isDark: false,
      waterColor: '#0284c7',
      labelColor: '#0f172a',
    },
  },
  {
    id: 'HyperpilotBlack',
    name: 'Hyperpilot-black',
    osmThemeFile: 'hyperpilot-black/hyperpilot-black.xml',
    hasRoads: true,
    description: 'Pure OLED black background with high-contrast electric roads for maximum battery efficiency.',
    preview: {
      bg: '#000000',
      roadPrimary: '#00f4f0',
      roadSecondary: '#ffd600',
      roadWidth: 2,
      isDark: true,
      waterColor: '#0088ff',
      labelColor: '#ffffff',
    },
  },
  {
    id: 'Lightpilot',
    name: 'Lightpilot',
    osmThemeFile: 'lightpilot/lightpilot.xml',
    hasRoads: true,
    description: 'Clean, subtle gray road network on clean light land for glare-free daytime flying.',
    preview: {
      bg: '#f1f5f9',
      roadPrimary: '#475569',
      roadSecondary: '#94a3b8',
      roadWidth: 2,
      isDark: false,
      waterColor: '#38bdf8',
      labelColor: '#1e293b',
    },
  },
  {
    id: 'Frenchkiss',
    name: 'Frenchkiss',
    osmThemeFile: 'frenchkiss/frenchkiss.xml',
    hasRoads: true,
    description: 'French aeronautical chart styling with warm tints and distinctive aeronautical airspace lines.',
    preview: {
      bg: '#fdf4ff',
      roadPrimary: '#c026d3',
      roadSecondary: '#e879f9',
      roadWidth: 2,
      isDark: false,
      waterColor: '#2563eb',
      labelColor: '#4a044e',
    },
  },
  {
    id: 'VtmDefault',
    name: 'VTM Default (OSM)',
    osmThemeFile: 'DEFAULT',
    hasRoads: true,
    description: 'Standard OpenStreetMap vector rendering with orange motorways, yellow secondary roads.',
    preview: {
      bg: '#f8fafc',
      roadPrimary: '#f97316',
      roadSecondary: '#facc15',
      roadWidth: 2,
      isDark: false,
      waterColor: '#38bdf8',
      labelColor: '#1e293b',
    },
  },
  {
    id: 'Newtron',
    name: 'NEWTRON',
    osmThemeFile: 'NEWTRON',
    hasRoads: true,
    description: 'Cyberpunk dark theme with glowing neon cyan road grid and electric boundaries.',
    preview: {
      bg: '#0a0e1a',
      roadPrimary: '#00f4f0',
      roadSecondary: '#ff007f',
      roadWidth: 2.2,
      isDark: true,
      waterColor: '#0055ff',
      labelColor: '#00f4f0',
    },
  },
  {
    id: 'Osmagray',
    name: 'OSMAGRAY',
    osmThemeFile: 'OSMAGRAY',
    hasRoads: true,
    description: 'High-contrast monochrome grayscale map optimized for E-Ink displays and direct sunlight.',
    preview: {
      bg: '#ffffff',
      roadPrimary: '#1e293b',
      roadSecondary: '#64748b',
      roadWidth: 2,
      isDark: false,
      waterColor: '#94a3b8',
      labelColor: '#000000',
    },
  },
  {
    id: 'Osmarender',
    name: 'OSMARENDER',
    osmThemeFile: 'OSMARENDER',
    hasRoads: true,
    description: 'Classic colorful OpenStreetMap style with green land, blue waters, and detailed road network.',
    preview: {
      bg: '#ecfdf5',
      roadPrimary: '#dc2626',
      roadSecondary: '#f59e0b',
      roadWidth: 2,
      isDark: false,
      waterColor: '#0ea5e9',
      labelColor: '#1e293b',
    },
  },
  {
    id: 'Tronrender',
    name: 'TRONRENDER',
    osmThemeFile: 'TRONRENDER',
    hasRoads: true,
    description: 'Dark futuristic wireframe style with cyan vectors and minimalist geometric markings.',
    preview: {
      bg: '#050810',
      roadPrimary: '#38bdf8',
      roadSecondary: '#0284c7',
      roadWidth: 1.8,
      isDark: true,
      waterColor: '#0369a1',
      labelColor: '#7dd3fc',
    },
  },
  {
    id: 'Custom',
    name: 'Custom Style',
    osmThemeFile: '__custom__',
    hasRoads: true,
    description: 'User-provided custom Mapsforge vector XML stylesheet loaded from device storage.',
    preview: {
      bg: '#1e293b',
      roadPrimary: '#38bdf8',
      roadSecondary: '#a855f7',
      roadWidth: 2,
      isDark: true,
      waterColor: '#0284c7',
      labelColor: '#ffffff',
    },
  },
];

export const TERRAIN_STYLES: TerrainDef[] = [
  {
    id: 'None',
    name: 'None (Flat)',
    hasHillshading: false,
    hasElevationGradient: false,
    description: 'No terrain relief or hillshading. Minimal CPU/battery usage.',
    preview: {
      reliefGradient: 'linear-gradient(to bottom, #1e293b, #1e293b)',
      shadowOpacity: 0,
      textColor: '#94a3b8',
    },
  },
  {
    id: 'Light',
    name: 'Light Relief',
    hasHillshading: true,
    hasElevationGradient: true,
    description: 'Warm light elevation gradient (lowlands light cream, summits soft gray) with 3D slope shadows.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #fef3c7 0%, #dcfce7 40%, #e2e8f0 80%, #ffffff 100%)',
      shadowOpacity: 0.35,
      textColor: '#0f172a',
    },
  },
  {
    id: 'Dark',
    name: 'Dark Relief',
    hasHillshading: true,
    hasElevationGradient: true,
    description: 'Dark elevation gradient (lowlands deep slate #0f172a, summits slate #334155) for dark themes.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #090d16 0%, #0f172a 40%, #1e293b 80%, #334155 100%)',
      shadowOpacity: 0.5,
      textColor: '#f8fafc',
    },
  },
  {
    id: 'XContest',
    name: 'XContest Topo',
    isPro: true,
    hasHillshading: true,
    hasElevationGradient: true,
    description: 'Signature rainbow topographic relief: emerald valleys -> golden foothills -> copper ridge -> white peaks.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #15803d 0%, #84cc16 30%, #eab308 60%, #ea580c 85%, #ffffff 100%)',
      shadowOpacity: 0.5,
      textColor: '#ffffff',
    },
  },
  {
    id: 'LightShading',
    name: 'Light Hillshading',
    hasHillshading: true,
    hasElevationGradient: false,
    description: 'Directional slope hillshading only on a clean light background without elevation color tinting.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #f8fafc 100%)',
      shadowOpacity: 0.4,
      textColor: '#1e293b',
    },
  },
  {
    id: 'DarkShading',
    name: 'Dark Hillshading',
    hasHillshading: true,
    hasElevationGradient: false,
    description: 'Directional slope hillshading only on a dark background without colored elevation tinting.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      shadowOpacity: 0.6,
      textColor: '#e2e8f0',
    },
  },
  {
    id: 'LightLegacy',
    name: 'Light Legacy',
    hasHillshading: true,
    hasElevationGradient: true,
    description: 'Classic legacy XCTrack relief shading algorithm.',
    preview: {
      reliefGradient: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #f0fdf4 100%)',
      shadowOpacity: 0.3,
      textColor: '#0f172a',
    },
  },
];

/**
 * Exact presets grouped matching XCTrack r.java:
 * - Featured styles with relief
 * - Extra styles with relief
 * - Classic styles (hillshading)
 * - Relief only
 * - Empty map
 */
export const MAP_APPEARANCE_PRESETS: MapAppearancePreset[] = [
  // 1. Featured styles with relief
  {
    id: 'featured_clearpilot_forest_light',
    name: 'Clearpilot [forests] • Light Relief',
    category: 'featured',
    theme: 'ClearpilotForest',
    terrain: 'Light',
    isPro: true,
    description: 'Recommended for day cross-country flights. Transparent roads, green forests, gentle relief.',
  },
  {
    id: 'featured_clearpilot_forest_dark',
    name: 'Clearpilot [forests] • Dark Relief',
    category: 'featured',
    theme: 'ClearpilotForestDark',
    terrain: 'Dark',
    isPro: true,
    description: 'Dark transparent roads with forest overlays and deep slate relief.',
  },
  {
    id: 'featured_clearpilot_forest_xcontest',
    name: 'Clearpilot [forests] • XContest Topo',
    category: 'featured',
    theme: 'ClearpilotForest',
    terrain: 'XContest',
    isPro: true,
    description: 'Full topographic rainbow elevation profile with transparent roads and forests.',
  },
  {
    id: 'featured_relief_xcontest_only',
    name: 'XContest Relief Only (No Roadmap)',
    category: 'featured',
    theme: 'None',
    terrain: 'XContest',
    isPro: true,
    description: 'High-contrast topographic elevation relief with zero road clutter.',
  },

  // 2. Extra styles with relief
  {
    id: 'extra_clearpilot_light',
    name: 'Clearpilot • Light Relief',
    category: 'extra',
    theme: 'Clearpilot',
    terrain: 'Light',
    isPro: true,
    description: 'Clean transparent roads without forest polygons on light relief.',
  },
  {
    id: 'extra_clearpilot_dark',
    name: 'Clearpilot • Dark Relief',
    category: 'extra',
    theme: 'ClearpilotDark',
    terrain: 'Dark',
    isPro: true,
    description: 'Clean transparent dark roads without forest polygons on dark relief.',
  },
  {
    id: 'extra_clearpilot_xcontest',
    name: 'Clearpilot • XContest Topo',
    category: 'extra',
    theme: 'Clearpilot',
    terrain: 'XContest',
    isPro: true,
    description: 'Clean transparent roads over vibrant XContest topography.',
  },
  {
    id: 'extra_clearpilot_big_light',
    name: 'Clearpilot [forests, big fonts] • Light Relief',
    category: 'extra',
    theme: 'ClearpilotForestBig',
    terrain: 'Light',
    isPro: true,
    description: 'Enlarged labels with green forests on light relief.',
  },
  {
    id: 'extra_clearpilot_big_dark',
    name: 'Clearpilot [forests dark, big fonts] • Dark Relief',
    category: 'extra',
    theme: 'ClearpilotForestDarkBig',
    terrain: 'Dark',
    isPro: true,
    description: 'Enlarged labels with green forests on dark relief.',
  },

  // 3. Classic styles (hillshading)
  {
    id: 'classic_lightpilot_shading',
    name: 'Lightpilot • Hillshading',
    category: 'classic',
    theme: 'Lightpilot',
    terrain: 'LightShading',
    description: 'Subtle gray roads with gentle monochrome hillshading.',
  },
  {
    id: 'classic_lightpilot_flat',
    name: 'Lightpilot (Flat Roads)',
    category: 'classic',
    theme: 'Lightpilot',
    terrain: 'None',
    description: 'Clean flat light vector road map without terrain shadows.',
  },
  {
    id: 'classic_hyperpilot_shading',
    name: 'Hyperpilot • Hillshading',
    category: 'classic',
    theme: 'Hyperpilot',
    terrain: 'LightShading',
    description: 'High-visibility orange/yellow aviation roads with hillshading.',
  },
  {
    id: 'classic_hyperpilot_flat',
    name: 'Hyperpilot (Flat Roads)',
    category: 'classic',
    theme: 'Hyperpilot',
    terrain: 'None',
    description: 'High-visibility orange/yellow aviation roads without terrain shadows.',
  },
  {
    id: 'classic_hyperpilot_black',
    name: 'Hyperpilot-black • Dark Hillshading',
    category: 'classic',
    theme: 'HyperpilotBlack',
    terrain: 'DarkShading',
    description: 'OLED black background with neon road vectors and dark hillshading.',
  },
  {
    id: 'classic_hyperpilot_black_flat',
    name: 'Hyperpilot-black (Flat Roads)',
    category: 'classic',
    theme: 'HyperpilotBlack',
    terrain: 'None',
    description: 'OLED pure black background with neon road vectors and zero shadows.',
  },
  {
    id: 'classic_frenchkiss_shading',
    name: 'Frenchkiss • Hillshading',
    category: 'classic',
    theme: 'Frenchkiss',
    terrain: 'LightShading',
    description: 'French aeronautical chart styling with soft hillshading.',
  },
  {
    id: 'classic_vtm_shading',
    name: 'VTM Default • Hillshading',
    category: 'classic',
    theme: 'VtmDefault',
    terrain: 'LightShading',
    description: 'Standard OpenStreetMap vector rendering with hillshading.',
  },
  {
    id: 'classic_newtron_shading',
    name: 'NEWTRON • Dark Hillshading',
    category: 'classic',
    theme: 'Newtron',
    terrain: 'DarkShading',
    description: 'Glowing cyan/magenta cyberpunk road grid with dark hillshading.',
  },
  {
    id: 'classic_osmagray_shading',
    name: 'OSMAGRAY • Hillshading',
    category: 'classic',
    theme: 'Osmagray',
    terrain: 'LightShading',
    description: 'Monochrome grayscale map optimized for E-Ink and direct sunlight.',
  },
  {
    id: 'classic_osmarender_flat',
    name: 'OSMARENDER (Classic)',
    category: 'classic',
    theme: 'Osmarender',
    terrain: 'None',
    description: 'Classic colorful OpenStreetMap vector style.',
  },
  {
    id: 'classic_tronrender_flat',
    name: 'TRONRENDER',
    category: 'classic',
    theme: 'Tronrender',
    terrain: 'None',
    description: 'Electric cyan wireframe vectors on deep dark background.',
  },

  // 4. Relief only
  {
    id: 'relief_light_only',
    name: 'Light Relief Only',
    category: 'relief',
    theme: 'None',
    terrain: 'Light',
    description: 'Light elevation gradient relief with no roads.',
  },
  {
    id: 'relief_dark_only',
    name: 'Dark Relief Only',
    category: 'relief',
    theme: 'None',
    terrain: 'Dark',
    description: 'Dark elevation gradient relief with no roads.',
  },
  {
    id: 'relief_legacy_only',
    name: 'Light Legacy Relief Only',
    category: 'relief',
    theme: 'None',
    terrain: 'LightLegacy',
    description: 'Legacy XCTrack relief shading with no roads.',
  },

  // 5. Empty map
  {
    id: 'empty_map',
    name: 'Empty Map (No Roads, No Terrain)',
    category: 'empty',
    theme: 'None',
    terrain: 'None',
    description: 'Blank map background. Useful for pure task/airspace navigation with zero distractions.',
  },
];

export function getMapTheme(id: string): MapThemeDef {
  return MAP_THEMES.find((t) => t.id === id) || MAP_THEMES[0];
}

export function getTerrainStyle(id: string): TerrainDef {
  return TERRAIN_STYLES.find((t) => t.id === id) || TERRAIN_STYLES[0];
}
