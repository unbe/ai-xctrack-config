import React, { useEffect, useRef, useState } from 'react';
import { Map, StyleSpecification, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { MapThemeDef, TerrainDef } from '../../data/map-styles';
import { buildMapLibreLayersForTheme } from '../../data/xctrack-vtm-specs';
import { Navigation, Compass, Wind } from 'lucide-react';

// Configure MapLibre Web Worker URL for Vite bundler
setWorkerUrl(maplibreWorkerUrl);

export interface RealXCTrackMapProps {
  theme: MapThemeDef;
  terrain: TerrainDef;
  center?: [number, number]; // [lon, lat]
  zoom?: number;
  bearing?: number;
  hasRoads?: boolean;
  hasTerrain?: boolean;
  hasRainRadar?: boolean;
  hasKK7?: boolean;
  kk7Opacity?: number;
  hasAirspaces?: boolean;
  hasScale?: boolean;
  hasCompass?: boolean;
  hasWind?: boolean;
  tracklogColor?: string;
  className?: string;
  isThumbnail?: boolean;
}

// Generate MapLibre GL style specification dynamically matching XCTrack themes & terrain profiles
function generateXCTrackMapStyle(
  theme: MapThemeDef,
  terrain: TerrainDef,
  hasRoads: boolean,
  hasTerrain: boolean,
  hasKK7?: boolean,
  kk7Opacity: number = 0.4,
  hasRainRadar?: boolean
): StyleSpecification {
  const layers = buildMapLibreLayersForTheme(theme.id, terrain.id, { hasRoads, hasTerrain });

  const sources: any = {
    openfreemap: {
      type: 'vector',
      tiles: ['https://tiles.openfreemap.org/planet/{z}/{x}/{y}.pbf'],
      minzoom: 0,
      maxzoom: 14,
    },
    'terrain-dem': {
      type: 'raster-dem',
      tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize: 256,
      encoding: 'terrarium',
      maxzoom: 15,
    },
  };

  if (hasKK7) {
    sources['kk7-thermals'] = {
      type: 'raster',
      tiles: ['https://thermal.kk7.ch/tiles/thermals_all_all/{z}/{x}/{y}.png?src=xctrack.org'],
      tileSize: 256,
      maxzoom: 13,
    };
    layers.push({
      id: 'kk7-thermals-layer',
      type: 'raster',
      source: 'kk7-thermals',
      paint: {
        'raster-opacity': Math.max(0.1, Math.min(1.0, kk7Opacity)),
      },
    });
  }

  if (hasRainRadar) {
    sources['rain-radar'] = {
      type: 'raster',
      tiles: ['https://tilecache.rainviewer.com/v2/radar/nowcast_5/256/{z}/{x}/{y}/2/1_1.png'],
      tileSize: 256,
      maxzoom: 12,
    };
    layers.push({
      id: 'rain-radar-layer',
      type: 'raster',
      source: 'rain-radar',
      paint: {
        'raster-opacity': 0.6,
      },
    });
  }

  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources,
    layers,
  };
}

export const RealXCTrackMap: React.FC<RealXCTrackMapProps> = ({
  theme,
  terrain,
  center = [7.859122, 46.68618], // Default to Interlaken / Jungfrau Alps (from user backup config)
  zoom = 12.5,
  bearing = 0,
  hasRoads = true,
  hasTerrain = true,
  hasRainRadar = false,
  hasKK7 = false,
  kk7Opacity = 0.4,
  hasAirspaces = true,
  hasScale = true,
  hasCompass = true,
  hasWind = true,
  tracklogColor = '#ff962d',
  className = '',
  isThumbnail = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize MapLibre instance
  useEffect(() => {
    if (!containerRef.current) return;

    const styleSpec = generateXCTrackMapStyle(
      theme,
      terrain,
      hasRoads,
      hasTerrain,
      hasKK7,
      kk7Opacity,
      hasRainRadar
    );

    const map = new Map({
      container: containerRef.current,
      style: styleSpec,
      center,
      zoom,
      bearing,
      pitch: 0,
      attributionControl: false,
      interactive: !isThumbnail, // Interactive canvas map, static thumbnail
    });

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update style dynamically when theme, terrain, roads, kk7, or rainradar change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const newStyle = generateXCTrackMapStyle(
      theme,
      terrain,
      hasRoads,
      hasTerrain,
      hasKK7,
      kk7Opacity,
      hasRainRadar
    );
    mapRef.current.setStyle(newStyle);
  }, [theme.id, terrain.id, hasRoads, hasTerrain, hasKK7, kk7Opacity, hasRainRadar, mapLoaded]);

  // Update camera view when center, zoom, or bearing change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.easeTo({
      center,
      zoom,
      bearing,
      duration: 300,
    });
  }, [center[0], center[1], zoom, bearing, mapLoaded]);

  return (
    <div className={`w-full h-full relative overflow-hidden select-none ${className}`}>
      {/* MapLibre WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* Paragliding Aeronautical Flight HUD Overlays (Rendered on top of real map) */}
      {!isThumbnail && (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-2.5">
          {/* Top Bar: Wind & Compass */}
          <div className="flex items-center justify-between">
            {hasWind && (
              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10 text-white text-[11px] font-mono">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold">14</span>
                <span className="text-[9px] text-gray-300">km/h SW</span>
              </div>
            )}

            {hasCompass && (
              <div className="flex flex-col items-center bg-black/60 backdrop-blur-sm px-1.5 py-1 rounded border border-white/10 text-sky-400 font-mono">
                <Compass className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] font-bold">N</span>
              </div>
            )}
          </div>

          {/* Center: Real Paraglider Delta Icon with Heading Vector & Flight Trail */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Real flight tracklog snail trail */}
            <svg className="absolute w-48 h-48 pointer-events-none" viewBox="0 0 200 200">
              <path
                d="M 60 160 Q 90 130 100 100"
                fill="none"
                stroke={tracklogColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Heading line */}
              <line x1="100" y1="100" x2="100" y2="50" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5,3" />
            </svg>
            <div className="relative transform -rotate-45 drop-shadow-lg">
              <Navigation className="w-6 h-6 text-red-500 fill-red-500 stroke-white stroke-2" />
            </div>
          </div>

          {/* Bottom Bar: Scale Bar & Real Coordinates Badge */}
          <div className="flex items-end justify-between">
            {hasScale && (
              <div className="flex flex-col bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-gray-200">
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

            {/* Real coordinates indicator */}
            <div className="bg-black/65 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10 text-[9px] font-mono text-emerald-400">
              GPS: {center[1].toFixed(4)}°N, {center[0].toFixed(4)}°E
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
