import React from 'react';
import { Navigation, Compass, Wind, Flag } from 'lucide-react';
import { MapThemeDef, TerrainDef } from '../../data/map-styles';

export interface RealisticMapSectionProps {
  theme: MapThemeDef;
  terrain: TerrainDef;
  hasRoads?: boolean;
  hasTerrain?: boolean;
  hasRainRadar?: boolean;
  hasKK7?: boolean;
  kk7Opacity?: number;
  hasAirspaces?: boolean;
  hasScale?: boolean;
  hasCompass?: boolean;
  hasWind?: boolean;
  showFlightData?: boolean;
  tracklogColor?: string;
  className?: string;
  isThumbnail?: boolean;
}

export const RealisticMapSection: React.FC<RealisticMapSectionProps> = ({
  theme,
  terrain,
  hasRoads = true,
  hasTerrain = true,
  hasRainRadar = false,
  hasKK7 = false,
  kk7Opacity = 0.4,
  hasAirspaces = true,
  hasScale = true,
  hasCompass = true,
  hasWind = true,
  showFlightData = true,
  tracklogColor = '#ff962d',
  className = '',
  isThumbnail = false,
}) => {
  const isDark = theme.preview.isDark;
  const isBigFont = theme.id.includes('Big');
  const roadsVisible = hasRoads && theme.hasRoads;
  const terrainVisible = hasTerrain && terrain.id !== 'None';
  const showReliefGradient = terrainVisible && terrain.hasElevationGradient;
  const showHillshading = terrainVisible && terrain.hasHillshading;

  // Primary and secondary road colors & widths
  const roadPrimaryColor = theme.preview.roadPrimary;
  const roadSecondaryColor = theme.preview.roadSecondary;
  const roadWidthMultiplier = theme.preview.roadWidth || 2;
  const waterColor = theme.preview.waterColor || '#38bdf8';
  const labelColor = theme.preview.labelColor || (isDark ? '#f1f5f9' : '#0f172a');
  const shadowOpacity = terrain.preview.shadowOpacity || 0.4;

  // Determine forest fill
  const forestFill = theme.preview.forestFill || (
    isDark
      ? 'rgba(34, 197, 94, 0.16)'
      : 'rgba(34, 197, 94, 0.22)'
  );

  // Urban footprint fill
  const urbanFill = isDark ? 'rgba(148, 163, 184, 0.18)' : 'rgba(203, 213, 225, 0.55)';
  const urbanBorder = isDark ? 'rgba(148, 163, 184, 0.35)' : 'rgba(148, 163, 184, 0.7)';

  return (
    <div
      className={`w-full h-full relative overflow-hidden select-none ${className}`}
      style={{
        backgroundColor: theme.preview.bg,
      }}
    >
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Elevation Relief Topographic Gradient for Mountain Massif (Top Right) */}
          <radialGradient id="massifGrad" cx="78%" cy="28%" r="65%">
            <stop offset="0%" stopColor={isDark ? '#e2e8f0' : '#ffffff'} stopOpacity="0.95" /> {/* Snow summit */}
            <stop offset="18%" stopColor={isDark ? '#78350f' : '#b45309'} stopOpacity="0.85" /> {/* High rock ridge */}
            <stop offset="42%" stopColor={isDark ? '#854d0e' : '#eab308'} stopOpacity="0.75" /> {/* Upper mountain pasture */}
            <stop offset="68%" stopColor={isDark ? '#14532d' : '#84cc16'} stopOpacity="0.65" /> {/* Mid-slope forest belt */}
            <stop offset="100%" stopColor={isDark ? '#052e16' : '#22c55e'} stopOpacity="0.5" /> {/* Valley floor */}
          </radialGradient>

          {/* Elevation Relief Gradient for West Ridge (Left) */}
          <radialGradient id="westRidgeGrad" cx="15%" cy="50%" r="55%">
            <stop offset="0%" stopColor={isDark ? '#854d0e' : '#eab308'} stopOpacity="0.8" />
            <stop offset="40%" stopColor={isDark ? '#166534' : '#84cc16'} stopOpacity="0.7" />
            <stop offset="100%" stopColor={isDark ? '#052e16' : '#22c55e'} stopOpacity="0.45" />
          </radialGradient>

          {/* Airspace Hatch Pattern */}
          <pattern id="airspaceHatch" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="20" stroke="rgba(239, 68, 68, 0.35)" strokeWidth="2" />
          </pattern>

          {/* Railway Cross-Tie Pattern */}
          <pattern id="railTie" width="12" height="12" patternUnits="userSpaceOnUse">
            <line x1="6" y1="0" x2="6" y2="12" stroke={isDark ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
          </pattern>
        </defs>

        {/* ========================================================
            LAYER 1: TERRAIN ELEVATION RELIEF (When Enabled)
            ======================================================== */}
        {showReliefGradient && (
          <g className="terrain-relief">
            {/* Flat Valley Background */}
            <rect width="1000" height="1000" fill={isDark ? '#052e16' : '#bbf7d0'} opacity="0.35" />

            {/* West Mountain Flank */}
            <path
              d="M 0 0 L 320 0 Q 380 320 280 600 T 320 1000 L 0 1000 Z"
              fill="url(#westRidgeGrad)"
            />

            {/* East High Massif (Mont Tournette massif) */}
            <path
              d="M 450 0 L 1000 0 L 1000 850 Q 820 800 680 550 T 480 200 Z"
              fill="url(#massifGrad)"
            />
          </g>
        )}

        {/* ========================================================
            LAYER 2: 3D DIRECTIONAL HILLSHADING (NW Sun Illumination)
            ======================================================== */}
        {showHillshading && (
          <g className="terrain-hillshading">
            {/* Northwest Sun Highlights (Illuminated Slopes) */}
            <path
              d="M 520 80 Q 640 180 720 120 T 880 180 L 820 280 Q 700 240 600 320 Z"
              fill="white"
              fillOpacity={Math.min(0.35, shadowOpacity * 0.6)}
            />
            <path
              d="M 80 150 Q 180 260 140 450 T 180 750 L 110 780 Q 60 500 40 280 Z"
              fill="white"
              fillOpacity={Math.min(0.3, shadowOpacity * 0.5)}
            />

            {/* Southeast Mountain Face Deep Shadows (3D Ridge Shadows) */}
            {/* East Massif Main Shadow */}
            <path
              d="M 760 140 Q 890 280 840 450 T 980 780 L 1000 820 L 1000 320 Q 920 220 760 140 Z"
              fill="black"
              fillOpacity={shadowOpacity}
            />
            {/* Mid Col Gully Shadow */}
            <path
              d="M 580 340 Q 680 480 630 620 T 780 880 L 720 900 Q 560 720 520 480 Z"
              fill="black"
              fillOpacity={shadowOpacity * 0.85}
            />
            {/* West Ridge Leeward Shadow */}
            <path
              d="M 180 220 Q 280 380 240 560 T 290 840 L 250 860 Q 180 640 140 420 Z"
              fill="black"
              fillOpacity={shadowOpacity * 0.8}
            />
          </g>
        )}

        {/* Topographic Contour Lines (Subtle Elevation Curves) */}
        {terrainVisible && (
          <g className="contour-lines" stroke={isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)'} strokeWidth="1" fill="none">
            {/* 500m contour */}
            <path d="M 360 0 Q 420 300 370 650 T 420 1000" />
            {/* 1000m contour */}
            <path d="M 480 0 Q 560 250 510 500 T 560 850 L 640 1000" />
            {/* 1500m contour */}
            <path d="M 640 0 Q 720 220 680 420 T 750 750" strokeDasharray="6,4" />
            {/* 2000m contour */}
            <circle cx="820" cy="220" r="90" strokeDasharray="8,4" />
            <circle cx="820" cy="220" r="50" />
          </g>
        )}

        {/* ========================================================
            LAYER 3: OSM LANDUSE (Forests & Towns)
            ======================================================== */}
        {/* Alpine Forest Polygons (ClearpilotForest highlight) */}
        <g className="osm-forests">
          {/* East Mountain Flank Forest (Between lake and high ridge) */}
          <path
            d="M 460 120 C 520 90, 580 140, 620 210 C 660 280, 610 360, 650 440 C 690 520, 620 620, 580 680 C 530 740, 480 680, 450 580 C 420 480, 470 380, 440 280 Z"
            fill={forestFill}
            stroke={theme.preview.forestFill ? 'rgba(34, 197, 94, 0.45)' : 'none'}
            strokeWidth="1.5"
          />
          {/* South Basin Valley Forest */}
          <path
            d="M 220 740 C 280 710, 360 760, 420 820 C 460 880, 410 960, 360 990 C 290 1000, 240 940, 200 860 Z"
            fill={forestFill}
            stroke={theme.preview.forestFill ? 'rgba(34, 197, 94, 0.45)' : 'none'}
            strokeWidth="1.5"
          />
          {/* West Ridge Forest */}
          <path
            d="M 40 320 C 90 280, 160 310, 190 380 C 220 450, 180 540, 210 620 C 240 700, 170 760, 120 740 C 70 720, 50 620, 30 510 Z"
            fill={forestFill}
            stroke={theme.preview.forestFill ? 'rgba(34, 197, 94, 0.45)' : 'none'}
            strokeWidth="1.5"
          />
        </g>

        {/* Urban Settlement Footprints (Towns: Doussard & Talloires) */}
        <g className="osm-urban">
          {/* Doussard town (South lakeshore) */}
          <polygon
            points="280,680 340,660 380,700 390,750 330,780 270,750 260,700"
            fill={urbanFill}
            stroke={urbanBorder}
            strokeWidth="1.5"
          />
          {/* Talloires village (East lakeshore) */}
          <polygon
            points="420,380 460,360 480,410 450,440 410,420"
            fill={urbanFill}
            stroke={urbanBorder}
            strokeWidth="1.5"
          />
          {/* Montmin mountain hamlet (Col) */}
          <polygon
            points="620,540 660,530 670,560 630,580"
            fill={urbanFill}
            stroke={urbanBorder}
            strokeWidth="1"
          />
        </g>

        {/* ========================================================
            LAYER 4: HYDROLOGY (Lake & Rivers)
            ======================================================== */}
        <g className="osm-water">
          {/* Mountain Lake (Natural shoreline with bays and peninsula) */}
          <path
            d="M 280 0 
               C 320 80, 390 140, 370 240 
               C 350 320, 420 380, 390 480 
               C 370 550, 390 600, 360 660 
               C 320 690, 280 670, 250 620 
               C 220 560, 240 480, 210 400 
               C 180 320, 220 220, 200 120 
               C 190 60, 240 20, 280 0 Z"
            fill={waterColor}
            stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}
            strokeWidth="1.5"
          />

          {/* Lake Peninsula / Island */}
          <path
            d="M 330 360 C 360 370, 370 410, 340 420 C 310 420, 310 370, 330 360 Z"
            fill={theme.preview.bg}
            stroke={waterColor}
            strokeWidth="1"
          />

          {/* Main River entering lake from south valley */}
          <path
            d="M 220 1000 Q 250 920 290 880 T 320 780 Q 300 730 320 675"
            fill="none"
            stroke={waterColor}
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Mountain Stream (Tributary flowing from col into lake) */}
          <path
            d="M 720 540 Q 620 560 520 480 T 390 460"
            fill="none"
            stroke={waterColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="6,2"
          />
        </g>

        {/* ========================================================
            LAYER 5: OPENSTREETMAP VECTOR ROAD NETWORK
            ======================================================== */}
        {roadsVisible && (
          <g className="osm-roads">
            {/* Railway Line (Track with cross-ties) */}
            <path
              d="M 120 1000 Q 140 700 170 400 T 150 0"
              fill="none"
              stroke={isDark ? '#475569' : '#94a3b8'}
              strokeWidth="3.5"
            />
            <path
              d="M 120 1000 Q 140 700 170 400 T 150 0"
              fill="none"
              stroke={isDark ? '#cbd5e1' : '#1e293b'}
              strokeWidth="2"
              strokeDasharray="8,6"
            />

            {/* Secondary / Connecting Roads */}
            {/* West shore route */}
            <path
              d="M 170 0 Q 190 280 210 550 T 260 760 Q 280 880 200 1000"
              fill="none"
              stroke={roadSecondaryColor}
              strokeWidth={Math.max(1.8, roadWidthMultiplier * 0.9)}
              strokeLinecap="round"
            />
            {/* Valley East Road */}
            <path
              d="M 330 770 Q 420 780 520 840 T 720 1000"
              fill="none"
              stroke={roadSecondaryColor}
              strokeWidth={Math.max(1.8, roadWidthMultiplier * 0.9)}
              strokeLinecap="round"
            />

            {/* MOUNTAIN PASS ROAD (D42 to Col de la Forclaz) WITH 6 REALISTIC SWITCHBACKS */}
            <path
              d="M 330 730 
                 L 410 700 
                 L 480 640 
                 L 540 610 
                 /* Hairpin 1 */
                 Q 570 605 550 580 
                 L 460 570 
                 /* Hairpin 2 */
                 Q 440 555 460 540 
                 L 570 530 
                 /* Hairpin 3 */
                 Q 590 515 570 500 
                 L 480 490 
                 /* Hairpin 4 */
                 Q 460 475 480 460 
                 L 590 450 
                 /* Hairpin 5 */
                 Q 615 435 595 420 
                 L 520 410 
                 /* Hairpin 6 -> To Col de la Forclaz takeoff */
                 Q 505 395 530 380 
                 L 640 360 
                 L 720 320"
              fill="none"
              stroke={roadSecondaryColor}
              strokeWidth={Math.max(2.2, roadWidthMultiplier * 1.1)}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* PRIMARY HIGHWAY / MOTORWAY (Major valley corridor D909) */}
            {/* Casing / Border for high contrast */}
            <path
              d="M 340 0 Q 450 200 420 420 T 360 720 Q 340 850 440 1000"
              fill="none"
              stroke={isDark ? '#000000' : '#ffffff'}
              strokeWidth={roadWidthMultiplier * 2.2 + 2}
              strokeLinecap="round"
            />
            {/* Primary Highway Core Fill */}
            <path
              d="M 340 0 Q 450 200 420 420 T 360 720 Q 340 850 440 1000"
              fill="none"
              stroke={roadPrimaryColor}
              strokeWidth={roadWidthMultiplier * 2.2}
              strokeLinecap="round"
            />

            {/* Town Internal Street Grid Lines */}
            {/* Doussard town streets */}
            <path
              d="M 290 700 L 370 700 M 310 670 L 310 760 M 350 680 L 350 760"
              stroke={roadSecondaryColor}
              strokeWidth="1.2"
              opacity="0.75"
            />
            {/* Talloires streets */}
            <path
              d="M 430 380 L 460 410 M 420 410 L 460 380"
              stroke={roadSecondaryColor}
              strokeWidth="1.2"
              opacity="0.75"
            />
          </g>
        )}

        {/* ========================================================
            LAYER 6: LABELS (Towns, Summits & Altitudes)
            ======================================================== */}
        <g className="map-labels" style={{ fontFamily: 'sans-serif' }}>
          {/* Alpine Summit 1: La Tournette */}
          <g transform="translate(830, 220)">
            <polygon points="0,-12 8,2 -8,2" fill={labelColor} />
            <text
              x="12"
              y="0"
              fill={labelColor}
              fontSize={isBigFont ? '28' : '22'}
              fontWeight="bold"
              paintOrder="stroke"
              stroke={isDark ? '#000000' : '#ffffff'}
              strokeWidth={isDark ? '4' : '3'}
              strokeLinejoin="round"
            >
              La Tournette
            </text>
            <text
              x="12"
              y={isBigFont ? '24' : '18'}
              fill={labelColor}
              fontSize={isBigFont ? '22' : '17'}
              opacity="0.85"
              fontFamily="monospace"
              fontWeight="bold"
              paintOrder="stroke"
              stroke={isDark ? '#000000' : '#ffffff'}
              strokeWidth="3"
            >
              2351 m
            </text>
          </g>

          {/* Alpine Summit 2: Dents de Lanfon */}
          <g transform="translate(680, 80)">
            <polygon points="0,-10 6,2 -6,2" fill={labelColor} />
            <text
              x="10"
              y="0"
              fill={labelColor}
              fontSize={isBigFont ? '24' : '18'}
              fontWeight="bold"
              paintOrder="stroke"
              stroke={isDark ? '#000000' : '#ffffff'}
              strokeWidth="3"
            >
              Dents de Lanfon 1824m
            </text>
          </g>

          {/* Town 1: Doussard */}
          <text
            x="330"
            y="760"
            textAnchor="middle"
            fill={labelColor}
            fontSize={isBigFont ? '32' : '24'}
            fontWeight="bold"
            letterSpacing="1"
            paintOrder="stroke"
            stroke={isDark ? '#000000' : '#ffffff'}
            strokeWidth="4"
            strokeLinejoin="round"
          >
            DOUSSARD
          </text>

          {/* Town 2: Talloires */}
          <text
            x="480"
            y="410"
            fill={labelColor}
            fontSize={isBigFont ? '26' : '20'}
            fontWeight="bold"
            paintOrder="stroke"
            stroke={isDark ? '#000000' : '#ffffff'}
            strokeWidth="3.5"
            strokeLinejoin="round"
          >
            Talloires
          </text>

          {/* Mountain Pass Col: Col de la Forclaz */}
          <text
            x="640"
            y="350"
            fill={labelColor}
            fontSize={isBigFont ? '22' : '17'}
            fontWeight="600"
            fontStyle="italic"
            paintOrder="stroke"
            stroke={isDark ? '#000000' : '#ffffff'}
            strokeWidth="3"
          >
            Col de la Forclaz 1150m
          </text>

          {/* Water body label */}
          <text
            x="280"
            y="310"
            transform="rotate(-55 280 310)"
            textAnchor="middle"
            fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,42,0.7)'}
            fontSize={isBigFont ? '30' : '24'}
            fontWeight="bold"
            letterSpacing="4"
            fontStyle="italic"
          >
            LAC D'ANNECY
          </text>
        </g>

        {/* ========================================================
            LAYER 7: PARAGLIDING SITES (Takeoff & Landing Field)
            ======================================================== */}
        <g className="paragliding-sites">
          {/* TAKEOFF: Col de la Forclaz (640, 370) */}
          <g transform="translate(630, 370)">
            <circle cx="0" cy="0" r="16" fill="#16a34a" stroke="#ffffff" strokeWidth="3" />
            <path d="M -4 -8 L 8 -4 L -4 0 Z" fill="#ffffff" />
            <line x1="-4" y1="-8" x2="-4" y2="8" stroke="#ffffff" strokeWidth="2" />
            <text
              x="22"
              y="6"
              fill="#22c55e"
              fontSize={isBigFont ? '22' : '17'}
              fontWeight="bold"
              paintOrder="stroke"
              stroke="#000000"
              strokeWidth="3.5"
            >
              ⚑ Takeoff 1150m
            </text>
          </g>

          {/* LANDING FIELD (LZ): Doussard Landing (310, 810) */}
          <g transform="translate(310, 810)">
            {/* Windsock circle */}
            <circle cx="0" cy="0" r="15" fill="#e11d48" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="6" fill="#ffffff" />
            <text
              x="20"
              y="5"
              fill="#fb7185"
              fontSize={isBigFont ? '20' : '16'}
              fontWeight="bold"
              paintOrder="stroke"
              stroke="#000000"
              strokeWidth="3"
            >
              ⚑ LZ Doussard
            </text>
          </g>
        </g>

        {/* ========================================================
            LAYER 8: AIRSPACE (Controlled TMA Sector)
            ======================================================== */}
        {hasAirspaces && (
          <g className="airspace-overlay">
            {/* TMA Sector Boundary with warning hatch */}
            <polygon
              points="480,0 1000,0 1000,380 720,440 540,280"
              fill="rgba(239, 68, 68, 0.08)"
              stroke="rgba(239, 68, 68, 0.85)"
              strokeWidth="3"
              strokeDasharray="10,6"
            />
            {/* Airspace Label Box */}
            <g transform="translate(740, 70)">
              <rect
                x="-10"
                y="-20"
                width="210"
                height="44"
                rx="6"
                fill="rgba(0, 0, 0, 0.75)"
                stroke="rgba(239, 68, 68, 0.9)"
                strokeWidth="2"
              />
              <text x="5" y="-2" fill="#ef4444" fontSize="16" fontWeight="bold" fontFamily="sans-serif">
                TMA CHAMBERY 1
              </text>
              <text x="5" y="16" fill="#fca5a5" fontSize="13" fontFamily="monospace">
                FL115 (3500m) / 1000m AGL
              </text>
            </g>
          </g>
        )}

        {/* ========================================================
            LAYER 9: THERMAL HOTSPOTS & KK7 (When Active)
            ======================================================== */}
        {hasKK7 && (
          <g className="thermal-kk7" opacity={kk7Opacity * 1.5}>
            {/* Strong thermal trigger over rocky spur */}
            <circle cx="560" cy="460" r="45" fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="3.5" />
            <circle cx="560" cy="460" r="28" fill="rgba(239, 68, 68, 0.4)" />
            <circle cx="560" cy="460" r="12" fill="rgba(249, 115, 22, 0.8)" />
            <text x="560" y="465" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">
              +3.6
            </text>

            {/* Second thermal trigger over south ridge */}
            <circle cx="260" cy="790" r="35" fill="none" stroke="rgba(239, 68, 68, 0.7)" strokeWidth="3" />
            <circle cx="260" cy="790" r="18" fill="rgba(249, 115, 22, 0.5)" />
            <text x="260" y="794" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
              +2.4
            </text>
          </g>
        )}

        {/* ========================================================
            LAYER 10: RAIN RADAR (Doppler Storm Cells)
            ======================================================== */}
        {hasRainRadar && (
          <g className="rain-radar" opacity="0.8">
            <ellipse cx="880" cy="800" rx="140" ry="110" fill="rgba(34, 197, 94, 0.4)" filter="blur(8px)" />
            <ellipse cx="890" cy="810" rx="80" ry="60" fill="rgba(234, 179, 8, 0.6)" filter="blur(6px)" />
            <ellipse cx="900" cy="815" rx="40" ry="30" fill="rgba(239, 68, 68, 0.75)" filter="blur(4px)" />
          </g>
        )}

        {/* ========================================================
            LAYER 11: FAI FLIGHT TASK, TURNPOINTS & TRACKLOG
            ======================================================== */}
        {showFlightData && (
          <g className="flight-data">
            {/* FAI Triangle Area */}
            <polygon
              points="630,370 850,220 310,810"
              fill="rgba(56, 189, 248, 0.12)"
              stroke="rgba(56, 189, 248, 0.65)"
              strokeWidth="2.5"
              strokeDasharray="8,6"
            />

            {/* Turnpoint 1 Cylinder (Radius 1000m) */}
            <circle
              cx="850"
              cy="220"
              r="60"
              fill="rgba(14, 165, 233, 0.2)"
              stroke="#0284c7"
              strokeWidth="3"
            />
            <text x="850" y="145" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="bold" fontFamily="monospace">
              TP1_TOURNETTE (R:1km)
            </text>

            {/* Snail Trail Tracklog (Flight Path from Takeoff to Thermal) */}
            <path
              d="M 630 370 
                 Q 600 390 580 430 
                 /* Circling in thermal */
                 C 590 440, 600 470, 580 480 
                 C 550 490, 540 450, 560 440 
                 C 580 435, 590 470, 570 475 
                 /* Glide along ridge */
                 Q 520 480 480 520 
                 T 420 590"
              fill="none"
              stroke={tracklogColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Heading vector forward from pilot */}
            <line
              x1="420"
              y1="590"
              x2="370"
              y2="660"
              stroke="#ef4444"
              strokeWidth="2.5"
              strokeDasharray="6,4"
            />

            {/* Pilot Glider Delta Icon */}
            <g transform="translate(420, 590) rotate(145)">
              <polygon
                points="0,-18 14,14 0,8 -14,14"
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
              />
            </g>
          </g>
        )}
      </svg>

      {/* ========================================================
          COCKPIT HUD OVERLAYS (When not in minimal thumbnail mode)
          ======================================================== */}
      {!isThumbnail && (
        <>
          {/* Compass Rose (Top Right) */}
          {hasCompass && (
            <div className="absolute top-2.5 right-2.5 flex flex-col items-center bg-black/50 backdrop-blur-sm px-1.5 py-1 rounded border border-white/10 pointer-events-none">
              <Compass className="w-4 h-4 text-sky-400 animate-pulse" />
              <span className="text-[9px] font-bold text-sky-300 font-mono">N</span>
            </div>
          )}

          {/* Wind Indicator (Top Left) */}
          {hasWind && (
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10 pointer-events-none text-white text-[11px] font-mono">
              <Wind className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">14</span>
              <span className="text-[9px] text-gray-300">km/h SW</span>
            </div>
          )}

          {/* Scale Bar (Bottom Left) */}
          {hasScale && (
            <div className="absolute bottom-2.5 left-2.5 flex flex-col bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10 pointer-events-none text-[9px] font-mono text-gray-200">
              <div className="flex justify-between w-16 mb-0.5">
                <span>0</span>
                <span>1 km</span>
              </div>
              <div className="w-16 h-1.5 bg-gray-600 rounded-sm overflow-hidden flex border border-black/40">
                <div className="w-1/2 h-full bg-white"></div>
                <div className="w-1/2 h-full bg-black"></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
