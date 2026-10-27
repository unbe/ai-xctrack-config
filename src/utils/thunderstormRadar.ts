/**
 * Realistic Convective Thunderstorm Weather Radar Generator
 *
 * Models an authentic multi-cell alpine thunderstorm (cumulonimbus)
 * featuring:
 * - Multi-tier Doppler reflectivity scale (20 dBZ to 68 dBZ: blue, green, yellow, orange, red, magenta)
 * - Convective leading edge with steep reflectivity gradient
 * - Trailing stratiform anvil rain shield
 * - Organic multi-harmonic fractal contours (no artificial smooth ellipses)
 * - Primary severe storm cell + secondary flanking feeder cell
 */

export interface RadarFeature {
  type: 'Feature';
  properties: {
    dbz: number;
    color: string;
    strokeColor: string;
    opacity: number;
    label: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export interface RadarGeoJSON {
  type: 'FeatureCollection';
  features: RadarFeature[];
}

/**
 * Generates an organic closed polygon contour with multi-frequency harmonic perturbations.
 */
function generateOrganicContour(
  cLon: number,
  cLat: number,
  radiusLon: number,
  radiusLat: number,
  windAngleRad: number = 0.8, // ~45 deg (SW to NE propagation)
  harmonics: { n: number; amp: number; phase: number }[] = [],
  points: number = 64
): [number, number][] {
  const coords: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;

    // Base windward/leeward elongation along storm propagation axis
    let factor = 1.0 + 0.32 * Math.cos(angle - windAngleRad);

    // Add multi-frequency harmonic disturbances for turbulent cloud boundaries
    for (const h of harmonics) {
      factor += h.amp * Math.sin(h.n * angle + h.phase);
    }

    const dLon = Math.cos(angle) * radiusLon * factor;
    const dLat = Math.sin(angle) * radiusLat * factor;

    coords.push([cLon + dLon, cLat + dLat]);
  }

  return coords;
}

/**
 * Generates an authentic Doppler radar GeoJSON overlay of a severe thunderstorm cell
 * located near the flight area (~6-8 km northeast of default Interlaken center).
 */
export function generateThunderstormGeoJSON(center: [number, number]): RadarGeoJSON {
  const [lon, lat] = center;

  // Primary supercell core location (~7 km northeast of pilot position)
  const mainLon = lon + 0.055;
  const mainLat = lat + 0.038;

  // Secondary developing feeder cell (~4 km south-southeast of main cell)
  const feederLon = lon + 0.075;
  const feederLat = lat + 0.012;

  const features: RadarFeature[] = [
    // ========================================================================
    // 1. Level 1: Outer Stratiform Rain Shield & Anvil (20 dBZ - Light Rain / Blue)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 20,
        color: '#38bdf8',
        strokeColor: '#0284c7',
        opacity: 0.40,
        label: '20 dBZ (Light Rain)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon + 0.01, mainLat + 0.005, 0.065, 0.045, 0.85, [
            { n: 2, amp: 0.18, phase: 0.4 },
            { n: 3, amp: 0.12, phase: 1.2 },
            { n: 5, amp: 0.07, phase: 2.1 },
            { n: 7, amp: 0.04, phase: 0.8 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 2. Secondary Feeder Cell Outer Shield (20 dBZ)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 20,
        color: '#38bdf8',
        strokeColor: '#0284c7',
        opacity: 0.35,
        label: '20 dBZ (Feeder Cell)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(feederLon, feederLat, 0.035, 0.025, 0.75, [
            { n: 2, amp: 0.15, phase: 0.8 },
            { n: 3, amp: 0.10, phase: 1.5 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 3. Level 2: Moderate Rain Convective Boundary (32 dBZ - Green)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 32,
        color: '#22c55e',
        strokeColor: '#16a34a',
        opacity: 0.55,
        label: '32 dBZ (Moderate Rain)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon + 0.005, mainLat + 0.002, 0.045, 0.032, 0.82, [
            { n: 2, amp: 0.16, phase: 0.5 },
            { n: 3, amp: 0.11, phase: 1.1 },
            { n: 5, amp: 0.06, phase: 2.3 },
          ]),
        ],
      },
    },

    // Secondary Feeder Cell Moderate Core (32 dBZ)
    {
      type: 'Feature',
      properties: {
        dbz: 32,
        color: '#22c55e',
        strokeColor: '#16a34a',
        opacity: 0.50,
        label: '32 dBZ (Feeder Core)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(feederLon, feederLat, 0.022, 0.016, 0.70, [
            { n: 2, amp: 0.12, phase: 0.9 },
            { n: 4, amp: 0.08, phase: 1.8 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 4. Level 3: Heavy Rain (42 dBZ - Yellow / Amber)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 42,
        color: '#eab308',
        strokeColor: '#ca8a04',
        opacity: 0.70,
        label: '42 dBZ (Heavy Rain)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon, mainLat, 0.030, 0.022, 0.80, [
            { n: 2, amp: 0.14, phase: 0.6 },
            { n: 3, amp: 0.09, phase: 1.0 },
            { n: 5, amp: 0.05, phase: 2.5 },
          ]),
        ],
      },
    },

    // Feeder Cell Heavy Core (42 dBZ)
    {
      type: 'Feature',
      properties: {
        dbz: 42,
        color: '#eab308',
        strokeColor: '#ca8a04',
        opacity: 0.65,
        label: '42 dBZ (Feeder Core)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(feederLon, feederLat, 0.012, 0.009, 0.70, [
            { n: 2, amp: 0.10, phase: 0.5 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 5. Level 4: Torrential Convective Downdraft (52 dBZ - Orange / Crimson)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 52,
        color: '#f97316',
        strokeColor: '#ea580c',
        opacity: 0.82,
        label: '52 dBZ (Torrential Rain)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon - 0.002, mainLat - 0.001, 0.019, 0.014, 0.78, [
            { n: 2, amp: 0.12, phase: 0.7 },
            { n: 4, amp: 0.08, phase: 1.4 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 6. Level 5: Severe Thunderstorm Core (58 dBZ - Deep Red)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 58,
        color: '#ef4444',
        strokeColor: '#dc2626',
        opacity: 0.90,
        label: '58 dBZ (Severe Storm Core)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon - 0.003, mainLat - 0.002, 0.011, 0.008, 0.75, [
            { n: 2, amp: 0.10, phase: 0.8 },
            { n: 3, amp: 0.06, phase: 1.2 },
          ]),
        ],
      },
    },

    // ========================================================================
    // 7. Level 6: Hail Shaft / Overshooting Top (65+ dBZ - Magenta / Purple)
    // ========================================================================
    {
      type: 'Feature',
      properties: {
        dbz: 65,
        color: '#d946ef',
        strokeColor: '#c026d3',
        opacity: 0.96,
        label: '65 dBZ (Hail Core)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          generateOrganicContour(mainLon - 0.0035, mainLat - 0.0025, 0.005, 0.0038, 0.72, [
            { n: 2, amp: 0.08, phase: 0.5 },
          ]),
        ],
      },
    },
  ];

  return {
    type: 'FeatureCollection',
    features,
  };
}

export interface SvgRadarContour {
  d: string;
  dbz: number;
  color: string;
  strokeColor: string;
  opacity: number;
  label: string;
}

function coordsToSvgPath(coords: [number, number][]): string {
  if (coords.length === 0) return '';
  const [first, ...rest] = coords;
  return `M ${first[0].toFixed(1)} ${first[1].toFixed(1)} ` +
    rest.map(pt => `L ${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`).join(' ') +
    ' Z';
}

/**
 * Generates high-fidelity SVG paths for the realistic thunderstorm cell
 * for static SVG map canvas rendering (viewBox 0 0 1000 1000).
 */
export function generateThunderstormSvgContours(
  cx = 820,
  cy = 320,
  scale = 1.0
): SvgRadarContour[] {
  // Main convective supercell
  const feederX = cx + 80 * scale;
  const feederY = cy + 160 * scale;

  return [
    // 1. Stratiform outer rain shield (20 dBZ)
    {
      dbz: 20,
      color: '#38bdf8',
      strokeColor: '#0284c7',
      opacity: 0.38,
      label: '20 dBZ (Light Rain)',
      d: coordsToSvgPath(
        generateOrganicContour(cx, cy, 140 * scale, 100 * scale, 0.85, [
          { n: 2, amp: 0.18, phase: 0.4 },
          { n: 3, amp: 0.12, phase: 1.2 },
          { n: 5, amp: 0.07, phase: 2.1 },
        ], 48)
      ),
    },
    // Feeder cell outer shield
    {
      dbz: 20,
      color: '#38bdf8',
      strokeColor: '#0284c7',
      opacity: 0.32,
      label: '20 dBZ (Feeder)',
      d: coordsToSvgPath(
        generateOrganicContour(feederX, feederY, 80 * scale, 60 * scale, 0.75, [
          { n: 2, amp: 0.15, phase: 0.8 },
          { n: 3, amp: 0.10, phase: 1.5 },
        ], 36)
      ),
    },
    // 2. Moderate rain boundary (32 dBZ)
    {
      dbz: 32,
      color: '#22c55e',
      strokeColor: '#16a34a',
      opacity: 0.55,
      label: '32 dBZ (Moderate Rain)',
      d: coordsToSvgPath(
        generateOrganicContour(cx - 5 * scale, cy - 5 * scale, 100 * scale, 72 * scale, 0.82, [
          { n: 2, amp: 0.16, phase: 0.5 },
          { n: 3, amp: 0.11, phase: 1.1 },
          { n: 5, amp: 0.06, phase: 2.3 },
        ], 48)
      ),
    },
    // Feeder cell moderate core
    {
      dbz: 32,
      color: '#22c55e',
      strokeColor: '#16a34a',
      opacity: 0.50,
      label: '32 dBZ (Feeder Core)',
      d: coordsToSvgPath(
        generateOrganicContour(feederX, feederY, 50 * scale, 38 * scale, 0.70, [
          { n: 2, amp: 0.12, phase: 0.9 },
        ], 36)
      ),
    },
    // 3. Heavy rain (42 dBZ)
    {
      dbz: 42,
      color: '#eab308',
      strokeColor: '#ca8a04',
      opacity: 0.72,
      label: '42 dBZ (Heavy Rain)',
      d: coordsToSvgPath(
        generateOrganicContour(cx - 10 * scale, cy - 8 * scale, 68 * scale, 50 * scale, 0.80, [
          { n: 2, amp: 0.14, phase: 0.6 },
          { n: 3, amp: 0.09, phase: 1.0 },
        ], 48)
      ),
    },
    // 4. Convective downdraft (52 dBZ)
    {
      dbz: 52,
      color: '#f97316',
      strokeColor: '#ea580c',
      opacity: 0.84,
      label: '52 dBZ (Torrential Downpour)',
      d: coordsToSvgPath(
        generateOrganicContour(cx - 14 * scale, cy - 12 * scale, 44 * scale, 32 * scale, 0.78, [
          { n: 2, amp: 0.12, phase: 0.7 },
          { n: 4, amp: 0.08, phase: 1.4 },
        ], 40)
      ),
    },
    // 5. Severe storm core (58 dBZ)
    {
      dbz: 58,
      color: '#ef4444',
      strokeColor: '#dc2626',
      opacity: 0.92,
      label: '58 dBZ (Severe Core)',
      d: coordsToSvgPath(
        generateOrganicContour(cx - 16 * scale, cy - 14 * scale, 26 * scale, 20 * scale, 0.75, [
          { n: 2, amp: 0.10, phase: 0.8 },
        ], 32)
      ),
    },
    // 6. Hail Core (65 dBZ)
    {
      dbz: 65,
      color: '#d946ef',
      strokeColor: '#c026d3',
      opacity: 0.96,
      label: '65 dBZ (Hail Shaft)',
      d: coordsToSvgPath(
        generateOrganicContour(cx - 17 * scale, cy - 15 * scale, 13 * scale, 10 * scale, 0.72, [
          { n: 2, amp: 0.08, phase: 0.5 },
        ], 24)
      ),
    },
  ];
}
