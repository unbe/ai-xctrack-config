/**
 * XCTrack Real VTM Theme & Hypsometric Relief Specifications
 * Reverse-engineered from decompiled APK VTM theme XMLs and libxctrack-native.so C++ code.
 */

export interface ElevationStop {
  elevation: number; // in meters
  color: string;     // #rrggbb
}

export interface ElevationProfileDef {
  id: string;
  name: string;
  contourColor: string;
  ambient: number;
  diffuse: number;
  specular: number;
  stops: ElevationStop[];
}

export interface VtmRoadStyle {
  color: string;
  width: number;
  casing?: string;
  casingWidth?: number;
  dash?: number[];
}

export interface VtmLabelStyle {
  color: string;
  haloColor: string;
  size: number;
}

export interface VtmThemeSpec {
  id: string;
  name: string;
  osmThemeFile: string | null;
  isDark: boolean;
  hasRoads: boolean;
  isPro?: boolean;
  description: string;
  background: string;
  water: {
    fill: string;
    stroke: string;
    width: number;
  };
  forest: {
    fill: string;
    stroke?: string | null;
    width?: number;
  };
  residential: {
    fill: string;
  };
  roads: {
    motorway: VtmRoadStyle;
    trunk: VtmRoadStyle;
    primary: VtmRoadStyle;
    secondary: VtmRoadStyle;
    tertiary: VtmRoadStyle;
    minor: VtmRoadStyle;
    track: VtmRoadStyle;
    path: VtmRoadStyle;
  };
  labels: {
    road: VtmLabelStyle;
    place: VtmLabelStyle;
    water: VtmLabelStyle;
  };
}

/**
 * Exact hypsometric color stops from libxctrack-native.so
 * Extracted from decompiled ElevProfile::getHeightRgb and ColorProfile::all
 */
export const ELEVATION_PROFILES: Record<string, ElevationProfileDef> = {
  "XContest": {
    "id": "XContest",
    "name": "XContest Topo",
    "contourColor": "#403020",
    "ambient": 0.15,
    "diffuse": 0.2,
    "specular": 0.7,
    "stops": [
      {
        "elevation": 0,
        "color": "#6aa050"
      },
      {
        "elevation": 200,
        "color": "#50b240"
      },
      {
        "elevation": 700,
        "color": "#c7c748"
      },
      {
        "elevation": 1100,
        "color": "#ab8f3a"
      },
      {
        "elevation": 1400,
        "color": "#ab7348"
      },
      {
        "elevation": 2800,
        "color": "#c7c7c7"
      },
      {
        "elevation": 4600,
        "color": "#ffffff"
      },
      {
        "elevation": 6500,
        "color": "#c7c7ff"
      }
    ]
  },
  "Light": {
    "id": "Light",
    "name": "Light Relief",
    "contourColor": "#403020",
    "ambient": 0.3,
    "diffuse": 0.15,
    "specular": 0.65,
    "stops": [
      {
        "elevation": 0,
        "color": "#ffffff"
      },
      {
        "elevation": 1100,
        "color": "#eddeb2"
      },
      {
        "elevation": 1400,
        "color": "#edc2a6"
      },
      {
        "elevation": 2800,
        "color": "#f0f0f0"
      },
      {
        "elevation": 4600,
        "color": "#ffffff"
      },
      {
        "elevation": 6500,
        "color": "#efefff"
      }
    ]
  },
  "Dark": {
    "id": "Dark",
    "name": "Dark Relief",
    "contourColor": "#c0c0c0",
    "ambient": 0.4,
    "diffuse": 0.3,
    "specular": 0.5,
    "stops": [
      {
        "elevation": 0,
        "color": "#c0c0c0"
      },
      {
        "elevation": 500,
        "color": "#a0a0a0"
      },
      {
        "elevation": 1200,
        "color": "#cfcf02"
      },
      {
        "elevation": 2800,
        "color": "#b34724"
      },
      {
        "elevation": 4600,
        "color": "#ffffff"
      },
      {
        "elevation": 6500,
        "color": "#efefff"
      }
    ]
  },
  "LightLegacy": {
    "id": "LightLegacy",
    "name": "Light Legacy",
    "contourColor": "#403020",
    "ambient": 0.25,
    "diffuse": 0.15,
    "specular": 0.7,
    "stops": [
      {
        "elevation": 0,
        "color": "#ffffff"
      },
      {
        "elevation": 1100,
        "color": "#ede4c9"
      },
      {
        "elevation": 1400,
        "color": "#ebdbcf"
      },
      {
        "elevation": 2800,
        "color": "#f0f0f0"
      },
      {
        "elevation": 4600,
        "color": "#ffffff"
      },
      {
        "elevation": 6500,
        "color": "#efefff"
      }
    ]
  }
};

/**
 * Native contour generation intervals (meters) from Generator::contoursM in libxctrack-native.so
 */
export const CONTOUR_INTERVALS = {
  minor: 10,
  intermediate: 50,
  major: 100,
};

/**
 * Exact VTM Theme specifications extracted from decompiled XCTrack XML assets
 */
export const XCTRACK_VTM_SPECS: Record<string, VtmThemeSpec> = {
  "None": {
    "id": "None",
    "name": "No Roadmap",
    "osmThemeFile": null,
    "isDark": true,
    "hasRoads": false,
    "isPro": false,
    "description": "Vector roads disabled. Only terrain elevation relief and airspace overlays are shown.",
    "background": "#0f172a",
    "water": {
      "fill": "#0284c7",
      "stroke": "#0369a1",
      "width": 1.0
    },
    "forest": {
      "fill": "transparent",
      "stroke": null,
      "width": 0
    },
    "residential": {
      "fill": "transparent"
    },
    "roads": {
      "motorway": {
        "color": "transparent",
        "width": 0
      },
      "trunk": {
        "color": "transparent",
        "width": 0
      },
      "primary": {
        "color": "transparent",
        "width": 0
      },
      "secondary": {
        "color": "transparent",
        "width": 0
      },
      "tertiary": {
        "color": "transparent",
        "width": 0
      },
      "minor": {
        "color": "transparent",
        "width": 0
      },
      "track": {
        "color": "transparent",
        "width": 0
      },
      "path": {
        "color": "transparent",
        "width": 0
      }
    },
    "labels": {
      "road": {
        "color": "#94a3b8",
        "haloColor": "#0f172a",
        "size": 12
      },
      "place": {
        "color": "#cbd5e1",
        "haloColor": "#0f172a",
        "size": 14
      },
      "water": {
        "color": "#38bdf8",
        "haloColor": "#0f172a",
        "size": 12
      }
    }
  },
  "ClearpilotForest": {
    "id": "ClearpilotForest",
    "name": "Clearpilot [forests]",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp-forest.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Semi-transparent roads with lush green forest polygons to identify landable fields and terrain.",
    "background": "#fffcfa",
    "water": {
      "fill": "#406684",
      "stroke": "#406684",
      "width": 1.0
    },
    "forest": {
      "fill": "rgba(0, 96, 32, 0.106)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#608bbf",
        "width": 2.2,
        "casing": "#ffffff"
      },
      "trunk": {
        "color": "#608bbf",
        "width": 1.8,
        "casing": "#ffffff"
      },
      "primary": {
        "color": "#9e9ede",
        "width": 1.6,
        "casing": "#ffffff"
      },
      "secondary": {
        "color": "#cbcbd6",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 14
      },
      "place": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "ClearpilotForestBig": {
    "id": "ClearpilotForestBig",
    "name": "Clearpilot [forests, big fonts]",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp-forest-big.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Clearpilot with forests and enlarged typography for high-vibration cockpit legibility.",
    "background": "#fffcfa",
    "water": {
      "fill": "#406684",
      "stroke": "#406684",
      "width": 1.0
    },
    "forest": {
      "fill": "rgba(0, 96, 32, 0.106)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#608bbf",
        "width": 2.2,
        "casing": "#ffffff"
      },
      "trunk": {
        "color": "#608bbf",
        "width": 1.8,
        "casing": "#ffffff"
      },
      "primary": {
        "color": "#9e9ede",
        "width": 1.6,
        "casing": "#ffffff"
      },
      "secondary": {
        "color": "#cbcbd6",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 20
      },
      "place": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 22
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 18
      }
    }
  },
  "ClearpilotForestDark": {
    "id": "ClearpilotForestDark",
    "name": "Clearpilot [forests dark]",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp-forest-dark.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Dark semi-transparent road network with subdued forest overlays for night and OLED screens.",
    "background": "#fffcfa",
    "water": {
      "fill": "#78c7ff",
      "stroke": "#78c7ff",
      "width": 1.0
    },
    "forest": {
      "fill": "rgba(0, 155, 186, 0.188)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#a005fa",
        "width": 2.2,
        "casing": "#1e293b"
      },
      "trunk": {
        "color": "#a005fa",
        "width": 1.8
      },
      "primary": {
        "color": "#a005fa",
        "width": 1.6
      },
      "secondary": {
        "color": "#9e9ede",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.0
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 14
      },
      "place": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 16
      },
      "water": {
        "color": "#78c7ff",
        "haloColor": "#000000",
        "size": 13
      }
    }
  },
  "ClearpilotForestDarkBig": {
    "id": "ClearpilotForestDarkBig",
    "name": "Clearpilot [forests dark, big fonts]",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp-forest-dark-big.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Dark forest style with enlarged road and settlement labels.",
    "background": "#fffcfa",
    "water": {
      "fill": "#78c7ff",
      "stroke": "#78c7ff",
      "width": 1.0
    },
    "forest": {
      "fill": "rgba(0, 155, 186, 0.188)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#a005fa",
        "width": 2.2,
        "casing": "#1e293b"
      },
      "trunk": {
        "color": "#a005fa",
        "width": 1.8
      },
      "primary": {
        "color": "#a005fa",
        "width": 1.6
      },
      "secondary": {
        "color": "#9e9ede",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.0
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 20
      },
      "place": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 22
      },
      "water": {
        "color": "#78c7ff",
        "haloColor": "#000000",
        "size": 18
      }
    }
  },
  "Clearpilot": {
    "id": "Clearpilot",
    "name": "Clearpilot",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Transparent road overlay allowing maximum terrain visibility underneath.",
    "background": "#fffcfa",
    "water": {
      "fill": "#406684",
      "stroke": "#406684",
      "width": 1.0
    },
    "forest": {
      "fill": "transparent",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#608bbf",
        "width": 2.2,
        "casing": "#ffffff"
      },
      "trunk": {
        "color": "#608bbf",
        "width": 1.8,
        "casing": "#ffffff"
      },
      "primary": {
        "color": "#9e9ede",
        "width": 1.6,
        "casing": "#ffffff"
      },
      "secondary": {
        "color": "#cbcbd6",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 14
      },
      "place": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "ClearpilotDark": {
    "id": "ClearpilotDark",
    "name": "Clearpilot Dark",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot-transp-dark.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "Dark transparent road overlay optimized for dark themes.",
    "background": "#fffcfa",
    "water": {
      "fill": "#78c7ff",
      "stroke": "#78c7ff",
      "width": 1.0
    },
    "forest": {
      "fill": "transparent",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#a005fa",
        "width": 2.2,
        "casing": "#1e293b"
      },
      "trunk": {
        "color": "#a005fa",
        "width": 1.8
      },
      "primary": {
        "color": "#a005fa",
        "width": 1.6
      },
      "secondary": {
        "color": "#9e9ede",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.0
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 14
      },
      "place": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 16
      },
      "water": {
        "color": "#78c7ff",
        "haloColor": "#000000",
        "size": 13
      }
    }
  },
  "Lightpilot": {
    "id": "Lightpilot",
    "name": "Lightpilot",
    "osmThemeFile": "vtm_themes/lightpilot/lightpilot.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "Clean, subtle gray road network on clean light land for glare-free daytime flying.",
    "background": "#fffcfa",
    "water": {
      "fill": "#d3e7ff",
      "stroke": "#a4bbcc",
      "width": 1.0
    },
    "forest": {
      "fill": "#e3ffe3",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#608bbf",
        "width": 2.2,
        "casing": "#ffffff"
      },
      "trunk": {
        "color": "#608bbf",
        "width": 1.8,
        "casing": "#ffffff"
      },
      "primary": {
        "color": "#9e9ede",
        "width": 1.6,
        "casing": "#ffffff"
      },
      "secondary": {
        "color": "#cbcbd6",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 14
      },
      "place": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "Hyperpilot": {
    "id": "Hyperpilot",
    "name": "Hyperpilot",
    "osmThemeFile": "vtm_themes/hyperpilot/hyperpilot.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "High-visibility aviation map with prominent orange highways and yellow trunk roads.",
    "background": "#ffffff",
    "water": {
      "fill": "#99badf",
      "stroke": "#5273b2",
      "width": 1.0
    },
    "forest": {
      "fill": "#c2e4c2",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#e97446",
        "width": 2.5,
        "casing": "#333333"
      },
      "trunk": {
        "color": "#e97446",
        "width": 1.8,
        "casing": "#333333"
      },
      "primary": {
        "color": "#e8af5f",
        "width": 2.0,
        "casing": "#333333"
      },
      "secondary": {
        "color": "#ebdeaa",
        "width": 2.0
      },
      "tertiary": {
        "color": "#f5f18a",
        "width": 1.5
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.2,
        "casing": "#999999"
      },
      "track": {
        "color": "#c9a573",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 14
      },
      "place": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 16
      },
      "water": {
        "color": "#5273b2",
        "haloColor": "#ffffff",
        "size": 14
      }
    }
  },
  "HyperpilotBlack": {
    "id": "HyperpilotBlack",
    "name": "Hyperpilot-black",
    "osmThemeFile": "vtm_themes/hyperpilot-black/hyperpilot-black.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": false,
    "description": "Pure OLED black background with high-contrast electric roads for maximum battery efficiency.",
    "background": "#000000",
    "water": {
      "fill": "#05356b",
      "stroke": "#03234a",
      "width": 1.0
    },
    "forest": {
      "fill": "#0f4c0f",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#222222"
    },
    "roads": {
      "motorway": {
        "color": "#7c2706",
        "width": 2.5,
        "casing": "#000000"
      },
      "trunk": {
        "color": "#7c2706",
        "width": 1.8,
        "casing": "#000000"
      },
      "primary": {
        "color": "#915808",
        "width": 2.0
      },
      "secondary": {
        "color": "#846a03",
        "width": 2.0
      },
      "tertiary": {
        "color": "#7f7a03",
        "width": 1.5
      },
      "minor": {
        "color": "#333333",
        "width": 1.2
      },
      "track": {
        "color": "#444444",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#333333",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#aaaaaa",
        "haloColor": "#000000",
        "size": 14
      },
      "place": {
        "color": "#ffffff",
        "haloColor": "#000000",
        "size": 16
      },
      "water": {
        "color": "#0088ff",
        "haloColor": "#000000",
        "size": 14
      }
    }
  },
  "Frenchkiss": {
    "id": "Frenchkiss",
    "name": "Frenchkiss",
    "osmThemeFile": "vtm_themes/frenchkiss/frenchkiss.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "French aeronautical chart styling with warm tints and distinctive aeronautical lines.",
    "background": "#ebebeb",
    "water": {
      "fill": "#b3d9fe",
      "stroke": "#6c96e6",
      "width": 1.0
    },
    "forest": {
      "fill": "#ccfcb4",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#dfdfdf"
    },
    "roads": {
      "motorway": {
        "color": "#ff0000",
        "width": 2.0,
        "casing": "#000000"
      },
      "trunk": {
        "color": "#ff0000",
        "width": 1.8,
        "casing": "#000000"
      },
      "primary": {
        "color": "#ff0000",
        "width": 1.6,
        "casing": "#000000"
      },
      "secondary": {
        "color": "#ff994c",
        "width": 1.5,
        "casing": "#000000"
      },
      "tertiary": {
        "color": "#ffffff",
        "width": 1.3,
        "casing": "#000000"
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.1,
        "casing": "#000000"
      },
      "track": {
        "color": "#777777",
        "width": 0.8,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#999999",
        "width": 0.6,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 12
      },
      "place": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 15
      },
      "water": {
        "color": "#6c96e6",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "VtmDefault": {
    "id": "VtmDefault",
    "name": "VTM Default (OSM)",
    "osmThemeFile": "vtm/default.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "Standard OpenStreetMap vector rendering with orange motorways, yellow secondary roads.",
    "background": "#fffcfa",
    "water": {
      "fill": "#99badf",
      "stroke": "#5273b2",
      "width": 1.0
    },
    "forest": {
      "fill": "#b3d095",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#fedb52",
        "width": 2.4,
        "casing": "#e97446"
      },
      "trunk": {
        "color": "#fee16e",
        "width": 2.0
      },
      "primary": {
        "color": "#f4d26e",
        "width": 1.8
      },
      "secondary": {
        "color": "#fefefa",
        "width": 1.5
      },
      "tertiary": {
        "color": "#fefefa",
        "width": 1.3
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 14
      },
      "place": {
        "color": "#101010",
        "haloColor": "#ffffff",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "Newtron": {
    "id": "Newtron",
    "name": "NEWTRON",
    "osmThemeFile": "vtm/newtron.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": false,
    "description": "Cyberpunk dark theme with glowing neon cyan road grid and electric boundaries.",
    "background": "#000000",
    "water": {
      "fill": "#001223",
      "stroke": "#0055ff",
      "width": 0.6
    },
    "forest": {
      "fill": "rgba(21, 24, 6, 0.4)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#111520"
    },
    "roads": {
      "motorway": {
        "color": "#fedb52",
        "width": 2.2,
        "casing": "#000000"
      },
      "trunk": {
        "color": "#fee16e",
        "width": 1.8
      },
      "primary": {
        "color": "#f2df6d",
        "width": 1.6
      },
      "secondary": {
        "color": "#ffffff",
        "width": 1.4
      },
      "tertiary": {
        "color": "#ffffff",
        "width": 1.2
      },
      "minor": {
        "color": "#888888",
        "width": 1.0
      },
      "track": {
        "color": "#00f4f0",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#00bcd4",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#de3935",
        "haloColor": "#000000",
        "size": 15
      },
      "place": {
        "color": "#00f4f0",
        "haloColor": "#000000",
        "size": 17
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#000000",
        "size": 14
      }
    }
  },
  "Osmagray": {
    "id": "Osmagray",
    "name": "OSMAGRAY",
    "osmThemeFile": "OSMAGRAY",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "High-contrast monochrome grayscale map optimized for E-Ink displays and direct sunlight.",
    "background": "#ffffff",
    "water": {
      "fill": "#d8d8d8",
      "stroke": "#707070",
      "width": 1.0
    },
    "forest": {
      "fill": "#ebebeb",
      "stroke": null,
      "width": 0
    },
    "residential": {
      "fill": "#f5f5f5"
    },
    "roads": {
      "motorway": {
        "color": "#000000",
        "width": 2.8,
        "casing": "#555555"
      },
      "trunk": {
        "color": "#222222",
        "width": 2.4,
        "casing": "#777777"
      },
      "primary": {
        "color": "#444444",
        "width": 2.0
      },
      "secondary": {
        "color": "#666666",
        "width": 1.8
      },
      "tertiary": {
        "color": "#888888",
        "width": 1.4
      },
      "minor": {
        "color": "#999999",
        "width": 1.0
      },
      "track": {
        "color": "#aaaaaa",
        "width": 0.8,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#bbbbbb",
        "width": 0.6,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 13
      },
      "place": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 15
      },
      "water": {
        "color": "#444444",
        "haloColor": "#ffffff",
        "size": 12
      }
    }
  },
  "Osmarender": {
    "id": "Osmarender",
    "name": "OSMARENDER",
    "osmThemeFile": "vtm/osmarender.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "Classic colorful OpenStreetMap style with green land, blue waters, and detailed road network.",
    "background": "#fffcfa",
    "water": {
      "fill": "#b5d6f1",
      "stroke": "#709ac7",
      "width": 1.0
    },
    "forest": {
      "fill": "#6fc18e",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e8e8"
    },
    "roads": {
      "motorway": {
        "color": "#809bc0",
        "width": 2.4,
        "casing": "#507090"
      },
      "trunk": {
        "color": "#7fc97f",
        "width": 2.0
      },
      "primary": {
        "color": "#e46d71",
        "width": 1.8
      },
      "secondary": {
        "color": "#fdbf6f",
        "width": 1.6
      },
      "tertiary": {
        "color": "#fefefa",
        "width": 1.3
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.1
      },
      "track": {
        "color": "#999999",
        "width": 0.7,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#bbbbbb",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#d0d0d0",
        "size": 14
      },
      "place": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  },
  "Tronrender": {
    "id": "Tronrender",
    "name": "TRONRENDER",
    "osmThemeFile": "vtm/tronrender.xml",
    "isDark": true,
    "hasRoads": true,
    "isPro": false,
    "description": "Dark futuristic wireframe style with cyan vectors and minimalist geometric markings.",
    "background": "#050508",
    "water": {
      "fill": "#001223",
      "stroke": "#0055ff",
      "width": 0.6
    },
    "forest": {
      "fill": "rgba(21, 24, 6, 0.4)",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#111520"
    },
    "roads": {
      "motorway": {
        "color": "#fedb52",
        "width": 2.2,
        "casing": "#000000"
      },
      "trunk": {
        "color": "#fee16e",
        "width": 1.8
      },
      "primary": {
        "color": "#f2df6d",
        "width": 1.6
      },
      "secondary": {
        "color": "#ffffff",
        "width": 1.4
      },
      "tertiary": {
        "color": "#ffffff",
        "width": 1.2
      },
      "minor": {
        "color": "#888888",
        "width": 1.0
      },
      "track": {
        "color": "#00f4f0",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#00bcd4",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#ffef7d",
        "haloColor": "#000000",
        "size": 15
      },
      "place": {
        "color": "#00f4f0",
        "haloColor": "#000000",
        "size": 17
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#000000",
        "size": 14
      }
    }
  },
  "Biker": {
    "id": "Biker",
    "name": "BIKER",
    "osmThemeFile": "vtm/biker.xml",
    "isDark": false,
    "hasRoads": true,
    "isPro": false,
    "description": "Biker outdoor theme with distinct topo contours, green forests, and colored route hierarchy.",
    "background": "#e8eae1",
    "water": {
      "fill": "#b3ddff",
      "stroke": "#70a0d0",
      "width": 1.0
    },
    "forest": {
      "fill": "#a6cd98",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e6e6e6"
    },
    "roads": {
      "motorway": {
        "color": "#e892a2",
        "width": 2.5,
        "casing": "#c5c6be"
      },
      "trunk": {
        "color": "#f9b29c",
        "width": 2.2,
        "casing": "#c5c6be"
      },
      "primary": {
        "color": "#ffc982",
        "width": 2.0,
        "casing": "#c5c6be"
      },
      "secondary": {
        "color": "#fffa9b",
        "width": 1.8,
        "casing": "#c5c6be"
      },
      "tertiary": {
        "color": "#ffffff",
        "width": 1.4
      },
      "minor": {
        "color": "#ffffff",
        "width": 1.0
      },
      "track": {
        "color": "#837b58",
        "width": 0.8,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#d35c48",
        "width": 0.6,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#000000",
        "haloColor": "#ffffff",
        "size": 12
      },
      "place": {
        "color": "#000000",
        "haloColor": "#e8eae1",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 14
      }
    }
  },
  "Custom": {
    "id": "Custom",
    "name": "Custom Style",
    "osmThemeFile": "__custom__",
    "isDark": true,
    "hasRoads": true,
    "isPro": true,
    "description": "User-provided custom Mapsforge vector XML stylesheet loaded from device storage.",
    "background": "#fffcfa",
    "water": {
      "fill": "#406684",
      "stroke": "#406684",
      "width": 1.0
    },
    "forest": {
      "fill": "transparent",
      "stroke": null,
      "width": 0.0
    },
    "residential": {
      "fill": "#e8e7e3"
    },
    "roads": {
      "motorway": {
        "color": "#608bbf",
        "width": 2.2,
        "casing": "#ffffff"
      },
      "trunk": {
        "color": "#608bbf",
        "width": 1.8,
        "casing": "#ffffff"
      },
      "primary": {
        "color": "#9e9ede",
        "width": 1.6,
        "casing": "#ffffff"
      },
      "secondary": {
        "color": "#cbcbd6",
        "width": 1.4
      },
      "tertiary": {
        "color": "#cbcbd6",
        "width": 1.2
      },
      "minor": {
        "color": "#9e9ede",
        "width": 1.2
      },
      "track": {
        "color": "#a39b68",
        "width": 0.6,
        "dash": [
          3,
          2
        ]
      },
      "path": {
        "color": "#baadb9",
        "width": 0.5,
        "dash": [
          2,
          2
        ]
      }
    },
    "labels": {
      "road": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 14
      },
      "place": {
        "color": "#101010",
        "haloColor": "#eeeeee",
        "size": 16
      },
      "water": {
        "color": "#2d51bc",
        "haloColor": "#ffffff",
        "size": 13
      }
    }
  }
};

/**
 * Retrieve VTM Theme Specification by theme ID
 */
export function getVtmThemeSpec(id: string): VtmThemeSpec {
  return XCTRACK_VTM_SPECS[id] || XCTRACK_VTM_SPECS['None'];
}

/**
 * Get elevation stops for MapLibre color-relief expression [elev, color, elev, color, ...]
 */
export function getElevationColorStops(terrainId: string): (number | string)[] {
  const profile = ELEVATION_PROFILES[terrainId] || ELEVATION_PROFILES["Light"];
  const stops: (number | string)[] = [];
  for (const stop of profile.stops) {
    stops.push(stop.elevation, stop.color);
  }
  return stops;
}

/**
 * Get contour line color from native ColorProfile
 */
export function getContourColor(terrainId: string): string {
  const profile = ELEVATION_PROFILES[terrainId];
  if (profile) return profile.contourColor;
  if (terrainId === "DarkShading") return "#ffffff";
  return "#403020"; // standard dark brown for light terrain
}

/**
 * Generate pixel-perfect MapLibre GL layer definitions matching OpenFreeMap vector tile schema
 */
export function buildMapLibreLayersForTheme(
  themeId: string,
  terrainId: string,
  options: { hasRoads?: boolean; hasTerrain?: boolean } = {}
): any[] {
  const theme = getVtmThemeSpec(themeId);
  const hasRoads = options.hasRoads ?? theme.hasRoads;
  const hasTerrain = options.hasTerrain ?? (terrainId !== "None");
  const hasRelief = hasTerrain && Boolean(ELEVATION_PROFILES[terrainId]);
  const hasHillshading = hasTerrain && terrainId !== "None";
  const isDark = theme.isDark;

  const layers: any[] = [
    // 1. Background land polygon
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": theme.background,
      },
    },
  ];

  // 2. Terrain Color-Relief Layer (Hypsometric DEM elevation gradient)
  if (hasRelief) {
    layers.push({
      id: "color-relief",
      type: "color-relief",
      source: "terrain-dem",
      paint: {
        "color-relief-color": [
          "interpolate",
          ["linear"],
          ["elevation"],
          ...getElevationColorStops(terrainId),
        ],
        "color-relief-opacity": isDark ? 0.8 : 0.7,
      },
    });
  }

  // 3. 3D Hillshading (Slope shadows and highlights)
  if (hasHillshading) {
    layers.push({
      id: "hillshade",
      type: "hillshade",
      source: "terrain-dem",
      paint: {
        "hillshade-exaggeration": 0.85,
        "hillshade-shadow-color": isDark ? "#000000" : "#1e293b",
        "hillshade-highlight-color": isDark ? "#64748b" : "#ffffff",
        "hillshade-accent-color": isDark ? "#0f172a" : "#334155",
      },
    });
  }

  // 4. Forest / Wood Landcover
  if (theme.forest.fill !== "transparent") {
    layers.push({
      id: "landcover-forest",
      type: "fill",
      source: "openfreemap",
      "source-layer": "landcover",
      filter: ["in", "class", "wood", "forest", "scrub", "grass"],
      paint: {
        "fill-color": theme.forest.fill,
        "fill-opacity": 0.85,
      },
    });
  }

  // 5. Built-up / Residential Area
  if (theme.residential.fill !== "transparent") {
    layers.push({
      id: "landuse-residential",
      type: "fill",
      source: "openfreemap",
      "source-layer": "landuse",
      filter: ["in", "class", "residential", "commercial", "industrial"],
      paint: {
        "fill-color": theme.residential.fill,
        "fill-opacity": isDark ? 0.35 : 0.6,
      },
    });
  }

  // 6. Water Polygons (Lakes, Oceans, Reservoirs)
  layers.push({
    id: "water-fill",
    type: "fill",
    source: "openfreemap",
    "source-layer": "water",
    paint: {
      "fill-color": theme.water.fill,
      "fill-opacity": 0.9,
    },
  });

  // 7. Waterway Lines (Rivers, Streams, Canals)
  layers.push({
    id: "waterway-line",
    type: "line",
    source: "openfreemap",
    "source-layer": "waterway",
    paint: {
      "line-color": theme.water.stroke,
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.0, 14, 2.5],
    },
  });

  // 8. Vector Roads (If enabled)
  if (hasRoads && theme.id !== "None") {
    const roads = theme.roads;

    // Path / Footway / Track
    layers.push({
      id: "highway-path",
      type: "line",
      source: "openfreemap",
      "source-layer": "transportation",
      filter: ["in", "class", "path", "track"],
      paint: {
        "line-color": roads.path.color,
        "line-width": roads.path.width,
        ...(roads.path.dash ? { "line-dasharray": roads.path.dash } : {}),
      },
    });

    // Minor / Residential roads
    layers.push({
      id: "highway-minor",
      type: "line",
      source: "openfreemap",
      "source-layer": "transportation",
      filter: ["in", "class", "minor", "service", "tertiary"],
      paint: {
        "line-color": roads.minor.color,
        "line-width": ["interpolate", ["linear"], ["zoom"], 10, roads.minor.width * 0.8, 14, roads.minor.width * 1.6],
      },
    });

    // Secondary roads
    if (roads.secondary.casing) {
      layers.push({
        id: "highway-secondary-casing",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["==", "class", "secondary"],
        paint: {
          "line-color": roads.secondary.casing,
          "line-width": ["interpolate", ["linear"], ["zoom"], 9, roads.secondary.width + 1.0, 14, roads.secondary.width * 2 + 1.5],
        },
      });
    }
    layers.push({
      id: "highway-secondary",
      type: "line",
      source: "openfreemap",
      "source-layer": "transportation",
      filter: ["==", "class", "secondary"],
      paint: {
        "line-color": roads.secondary.color,
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, roads.secondary.width, 14, roads.secondary.width * 2],
      },
    });

    // Primary / Trunk roads
    if (roads.primary.casing) {
      layers.push({
        id: "highway-primary-casing",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["in", "class", "primary", "trunk"],
        paint: {
          "line-color": roads.primary.casing,
          "line-width": ["interpolate", ["linear"], ["zoom"], 9, roads.primary.width + 1.2, 14, roads.primary.width * 2 + 2.0],
        },
      });
    }
    layers.push({
      id: "highway-primary",
      type: "line",
      source: "openfreemap",
      "source-layer": "transportation",
      filter: ["in", "class", "primary", "trunk"],
      paint: {
        "line-color": roads.primary.color,
        "line-width": ["interpolate", ["linear"], ["zoom"], 9, roads.primary.width, 14, roads.primary.width * 2],
      },
    });

    // Motorways
    if (roads.motorway.casing) {
      layers.push({
        id: "highway-motorway-casing",
        type: "line",
        source: "openfreemap",
        "source-layer": "transportation",
        filter: ["==", "class", "motorway"],
        paint: {
          "line-color": roads.motorway.casing,
          "line-width": ["interpolate", ["linear"], ["zoom"], 8, roads.motorway.width + 1.5, 14, roads.motorway.width * 2 + 2.5],
        },
      });
    }
    layers.push({
      id: "highway-motorway",
      type: "line",
      source: "openfreemap",
      "source-layer": "transportation",
      filter: ["==", "class", "motorway"],
      paint: {
        "line-color": roads.motorway.color,
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, roads.motorway.width, 14, roads.motorway.width * 2],
      },
    });
  }

  // 9. Contours (From terrain vector tile or custom source)
  const contourColor = getContourColor(terrainId);
  layers.push({
    id: "contour-lines",
    type: "line",
    source: "openfreemap",
    "source-layer": "contour",
    minzoom: 11,
    paint: {
      "line-color": contourColor,
      "line-width": ["match", ["get", "nth"], 5, 1.2, 0.6],
      "line-opacity": isDark ? 0.35 : 0.45,
    },
  });

  // 10. Settlement Labels (Cities, Towns, Villages)
  layers.push({
    id: "place-labels",
    type: "symbol",
    source: "openfreemap",
    "source-layer": "place",
    filter: ["in", "class", "city", "town", "village"],
    layout: {
      "text-field": "{name}",
      "text-size": ["interpolate", ["linear"], ["zoom"], 6, theme.labels.place.size * 0.7, 12, theme.labels.place.size],
      "text-font": ["Noto Sans Bold"],
      "text-transform": "uppercase",
    },
    paint: {
      "text-color": theme.labels.place.color,
      "text-halo-color": theme.labels.place.haloColor,
      "text-halo-width": 2,
    },
  });

  return layers;
}
