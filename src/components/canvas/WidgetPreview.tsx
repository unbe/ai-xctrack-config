import React from 'react';
import {
  Compass,
  Map as MapIcon,
  Navigation,
  Battery,
  Wifi,
  Satellite,
  Volume2,
  VolumeX,
  Camera,
  ZoomIn,
  ZoomOut,
  Sun,
  Phone,
  Globe,
  Radio,
  Clock,
  Wind,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { XcfgWidget } from '../../types/xcfg';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { parseXctrackColor, bgTransparencyToAlpha, rgbaToCss } from '../../utils/colorMath';
import { getMapTheme, getTerrainStyle } from '../../data/map-styles';
import { RealisticMapSection } from './RealisticMapSection';

interface WidgetPreviewProps {
  widget: XcfgWidget;
  isSelected?: boolean;
  globalTheme?: string;
  widthPx: number;
  heightPx: number;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  widget,
  isSelected = false,
  globalTheme = 'BlackTheme',
  widthPx,
  heightPx,
}) => {
  const def = getWidgetDefinition(widget.CLASS);
  const themeName = widget._theme || globalTheme;
  const isWhiteTheme = themeName.toLowerCase().includes('white');
  const isEInk = themeName.toLowerCase().includes('eink');

  // Background transparency calculation matching XCTrack d0.java:
  // In XCTrack, _bg is Transparency % (100 = transparent, 0 = solid)
  // alpha = ((100 - _bg) * 255) / 100
  const bgAlpha = bgTransparencyToAlpha(widget._bg);
  const bgColor = isWhiteTheme
    ? `rgba(255, 255, 255, ${bgAlpha})`
    : `rgba(0, 0, 0, ${bgAlpha})`;

  const textColor = isWhiteTheme ? '#0f172a' : '#f8fafc';
  const mutedTextColor = isWhiteTheme ? '#64748b' : '#94a3b8';
  // XCTrack d0.java line 359: border color is Color.rgb(128, 128, 128)
  const borderColor = isWhiteTheme ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.7)';

  // Title calculation matching XCTrack theme.a0 / theme.I()
  // When _title !== false, title is drawn centered horizontally at x = width / 2
  // If _title === false, titleHeight is 0 and value takes full vertical space
  const showTitle = widget._title !== false;
  const displayTitle = widget.titletext || def?.title || widget.CLASS.split('.').pop() || '';
  const titleHeight = showTitle ? Math.max(12, Math.min(18, Math.round(heightPx * 0.22))) : 0;
  const showUnit = widget._unit !== false;

  // Tracklog color
  const tracklogRgba = parseXctrackColor(widget.tracklog_color as number | string | undefined, '#FFA500');

  return (
    <div
      className="w-full h-full relative overflow-hidden select-none flex flex-col items-center justify-between"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: widget._border ? `1px solid ${borderColor}` : undefined,
      }}
    >
      {/* Widget Centered Header Title (matching XCTrack theme.a0: x = width/2, uppercase, bold, centered) */}
      {showTitle && (
        <div
          className="w-full flex items-center justify-center px-1 pointer-events-none select-none overflow-hidden shrink-0"
          style={{ height: `${titleHeight}px` }}
        >
          <span
            className="font-bold tracking-wider uppercase truncate text-center font-condensed"
            style={{
              color: '#808080',
              fontSize: `${Math.max(9, Math.min(13, Math.round(titleHeight * 0.72)))}px`,
              lineHeight: 1,
            }}
          >
            {displayTitle}
          </span>
        </div>
      )}

      {/* Widget Specialized Body Content */}
      <div
        className="w-full flex-1 flex items-center justify-center overflow-hidden"
        style={{ height: `${heightPx - titleHeight}px` }}
      >
        {renderWidgetContent(widget, def?.shortName, {
          isWhiteTheme,
          textColor,
          mutedTextColor,
          tracklogColorCss: rgbaToCss(tracklogRgba),
          widthPx,
          heightPx,
          titleHeight,
        })}
      </div>
    </div>
  );
};

interface RenderContext {
  isWhiteTheme: boolean;
  textColor: string;
  mutedTextColor: string;
  tracklogColorCss: string;
  widthPx: number;
  heightPx: number;
  titleHeight: number;
}

function renderWidgetContent(widget: XcfgWidget, shortName: string = '', ctx: RenderContext) {
  const name = shortName || widget.CLASS.split('.').pop() || '';

  // 1. Map Widgets (WXCAssistant, WCompMap)
  if (name === 'WXCAssistant' || name === 'WCompMap') {
    const appearance = (widget.mapWidget_mapAppearance || {}) as Record<string, any>;
    const themeId = appearance.theme || (widget.mapWidget_showOpenStreet === false ? 'None' : 'ClearpilotForest');
    const terrainId = appearance.terrain || (widget.mapWidget_showTerrain === false ? 'None' : 'Light');
    const themeDef = getMapTheme(themeId);
    const terrainDef = getTerrainStyle(terrainId);

    const hasRoads = themeDef.hasRoads && widget.mapWidget_showOpenStreet !== false;
    const hasTerrain = terrainDef.id !== 'None' && widget.mapWidget_showTerrain !== false;
    const hasRainRadar = Boolean(widget.mapWidget_showRainRadar);
    const hasKK7 = Boolean(widget.mapWidget_showKK7);
    const kk7Opacity = (typeof widget.mapWidget_KK7opacity === 'number' ? widget.mapWidget_KK7opacity : 40) / 100;
    const hasAirspaces = widget.mapWidget_showAirspaces !== false;
    const hasScale = widget.mapWidget_drawScale !== false;
    const hasCompass = widget.showCompass !== false;
    const hasWind = widget.nav_showWind !== false;

    return (
      <RealisticMapSection
        theme={themeDef}
        terrain={terrainDef}
        hasRoads={hasRoads}
        hasTerrain={hasTerrain}
        hasRainRadar={hasRainRadar}
        hasKK7={hasKK7}
        kk7Opacity={kk7Opacity}
        hasAirspaces={hasAirspaces}
        hasScale={hasScale}
        hasCompass={hasCompass}
        hasWind={hasWind}
        showFlightData={true}
        tracklogColor={ctx.tracklogColorCss}
      />
    );
  }

  // 2. Thermal Assistant
  if (name === 'WThermalAssistant') {
    return (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full max-w-[140px] max-h-[140px]" viewBox="0 0 100 100">
          {/* Thermal core circle */}
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="2,2" />
          {/* Drifting thermal spiral trail */}
          <path
            d="M 50 50 Q 65 35 60 25 T 35 25 T 30 55 T 65 65"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Core thermal marker */}
          <circle cx="62" cy="28" r="4" fill="#ef4444" />
          {/* Pilot glider position */}
          <circle cx="65" cy="65" r="3" fill="#3b82f6" />
        </svg>
        <div className="absolute bottom-1 text-[10px] font-mono font-bold text-green-400">+2.8 m/s</div>
      </div>
    );
  }

  // 3. Side View
  if (name === 'WSideView') {
    return (
      <div className="w-full h-full relative flex items-end overflow-hidden p-1">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 60">
          {/* Ground contour */}
          <polygon points="0,60 30,45 70,55 120,30 160,40 200,50 200,60" fill="rgba(100, 116, 139, 0.4)" />
          {/* Glide slope */}
          <line x1="0" y1="15" x2="160" y2="40" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,2" />
          {/* Airspace block */}
          <rect x="60" y="5" width="80" height="20" fill="rgba(239, 68, 68, 0.2)" stroke="rgba(239, 68, 68, 0.7)" strokeWidth="1" />
        </svg>
        <span className="absolute top-1 right-2 text-[9px] font-condensed font-bold text-sky-400">Glide 1:9.2</span>
      </div>
    );
  }

  // 4. Status Line
  if (name === 'WStatusLine') {
    return (
      <div className="w-full h-full flex items-center justify-between px-2 text-[10px] font-condensed font-bold">
        <div className="flex items-center gap-2">
          {widget.showGps !== false && (
            <div className="flex items-center gap-1 text-emerald-400" title="GPS 3D Fix">
              <Satellite className="w-3 h-3" />
              <span>3D</span>
            </div>
          )}
          {widget.showLive !== false && (
            <div className="flex items-center gap-1 text-sky-400" title="Livetracking Active">
              <Radio className="w-3 h-3 animate-pulse" />
              {widget.showLiveLabel !== false && <span>LIVE</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {widget.showBatteryPercent !== false && (
            <div className="flex items-center gap-1 text-gray-300">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>85%</span>
            </div>
          )}
          {widget.showTime !== false && (
            <div className="flex items-center gap-1 text-gray-300">
              <Clock className="w-3 h-3 text-gray-400" />
              <span>14:25</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. Compass
  if (name === 'WCompass') {
    return (
      <div className="w-full h-full relative flex items-center justify-center p-1">
        <Compass className="w-10 h-10 text-sky-400/80" />
        <div className="absolute text-[11px] font-bold font-xctrack text-white">315°</div>
      </div>
    );
  }

  // 6. Vario Column
  if (name === 'WVarioColumn') {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center py-1">
        <div className="w-3 h-full max-h-48 rounded bg-gray-800/80 relative flex flex-col justify-end overflow-hidden border border-gray-700">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/70"></div>
          {/* Lift bar */}
          <div className="w-full bg-emerald-500 rounded-t" style={{ height: '65%' }}></div>
        </div>
      </div>
    );
  }

  // 7. Buttons
  if (name.startsWith('WButton')) {
    let IconComp = Plus;
    let label = 'Button';

    if (name === 'WButtonNavig') {
      label = widget.type === 'ACTION_PREV_WAYPOINT' ? 'Prev WP' : 'Next WP';
      IconComp = Navigation;
    } else if (name === 'WButtonZoom') {
      label = widget.type === 'ACTION_ZOOM_OUT' ? 'Zoom -' : 'Zoom +';
      IconComp = widget.type === 'ACTION_ZOOM_OUT' ? ZoomOut : ZoomIn;
    } else if (name === 'WButtonVario') {
      label = 'Vario';
      IconComp = Volume2;
    } else if (name === 'WButtonBrightness') {
      label = widget.action === 'ACTION_MINUS' ? 'Dim' : 'Bright';
      IconComp = Sun;
    } else if (name === 'WButtonCamera') {
      label = 'Camera';
      IconComp = Camera;
    } else if (name === 'WButtonPhone') {
      label = 'Phone';
      IconComp = Phone;
    }

    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-1 rounded bg-white/10 hover:bg-white/15 transition-colors border border-white/20">
        <IconComp className="w-5 h-5 text-sky-400" />
        <span className="text-[10px] font-semibold tracking-wide uppercase truncate max-w-[90%]">
          {label}
        </span>
      </div>
    );
  }

  // 8. Free Text
  if (name === 'WFreeText') {
    const textColor = widget.color_text ? parseColorString(widget.color_text as string | number) : ctx.textColor;
    const textSize = typeof widget.text_size === 'number' ? widget.text_size : 25;
    return (
      <div
        className="w-full h-full flex items-center justify-center text-center p-2"
        style={{
          color: textColor,
          fontWeight: widget.text_bold ? 'bold' : 'normal',
          fontStyle: widget.text_italic ? 'italic' : 'normal',
          fontSize: `${Math.max(10, textSize * 0.6)}px`,
        }}
      >
        {String(widget.text || 'Free Text')}
      </div>
    );
  }

  // 9. Web View
  if (name === 'WWebView') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-gray-400 bg-sky-950/20">
        <Globe className="w-6 h-6 text-sky-400 mb-1" />
        <span className="text-[10px] font-mono truncate max-w-[90%] text-sky-300">
          {String(widget.url || 'https://')}
        </span>
      </div>
    );
  }

  // 10. Generic Numeric Telemetry Widgets
  return renderNumericTelemetry(name, widget, ctx);
}

function renderNumericTelemetry(name: string, widget: XcfgWidget, ctx: RenderContext) {
  let val = '0';
  let unit = '';

  switch (name) {
    case 'WSpeed':
      val = '54.2';
      unit = 'km/h';
      break;
    case 'WAirSpeed':
      val = '52.0';
      unit = 'km/h';
      break;
    case 'WAltitude':
    case 'WBaroAltitude':
    case 'WAMSL':
      val = '2,840';
      unit = 'm';
      break;
    case 'WAltitudeAboveGround':
      val = '620';
      unit = 'm';
      break;
    case 'WVerticalSpeed':
      val = '+2.8';
      unit = 'm/s';
      break;
    case 'WGlide':
      val = widget.headless ? '9.4' : '1:9.4';
      unit = '';
      break;
    case 'WTime':
      val = '14:25';
      unit = '';
      break;
    case 'WAirTime':
      // XCTrack WAirTime.java: String.format(Locale.ENGLISH, "%d:%02d", hours, mins) -> "2:15"
      val = '2:15';
      unit = '';
      break;
    case 'WWindSpeed':
      val = '16';
      unit = 'km/h';
      break;
    case 'WWindDirection':
      val = '315°';
      unit = 'NW';
      break;
    case 'WThermalAltGain':
      val = '+780';
      unit = 'm';
      break;
    case 'WOptiResult':
      val = '94.6';
      unit = 'km';
      break;
    case 'WOptiUnfinishedTriangle':
      val = '82.4';
      unit = 'km';
      break;
    case 'WNextTurnpointDistance':
      val = '6.4';
      unit = 'km';
      break;
    case 'WNextTurnpoint':
      val = 'Col de Forclaz';
      unit = '';
      break;
    case 'WNextTurnpointGlideTo':
      val = widget.headless ? '7.8' : '1:7.8';
      unit = '';
      break;
    case 'WNextTurnpointAlt':
      val = '+420';
      unit = 'm';
      break;
    case 'WCompTimeToStart':
      val = '04:12';
      unit = '';
      break;
    case 'WCompDistanceToGoal':
      val = '42.8';
      unit = 'km';
      break;
    case 'WCompGlideToGoal':
      val = widget.headless ? '8.2' : '1:8.2';
      unit = '';
      break;
    default:
      val = '--';
      unit = '';
      break;
  }

  const hasUnit = Boolean(unit && widget._unit !== false);
  const availW = Math.max(10, ctx.widthPx - 8);
  const availH = Math.max(10, ctx.heightPx - ctx.titleHeight - 6);

  // Dynamic font scaling matching XCTrack theme.U
  const charRatio = 0.58;
  const unitFactor = hasUnit ? Math.min(0.40, unit.length * 0.28 + 0.15) : 0;
  const valAvailW = availW * (1.0 - unitFactor);

  const fontByW = valAvailW / Math.max(1.0, val.length * charRatio);
  const fontByH = availH * 0.85;
  const fontSizePx = Math.max(10, Math.floor(Math.min(fontByH, fontByW)));
  const unitFontSizePx = Math.max(9, Math.floor(fontSizePx * 0.38));

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden px-1">
      <div className="flex items-baseline justify-center whitespace-nowrap leading-none select-none">
        <span
          className="font-xctrack font-bold tracking-tight text-center leading-none"
          style={{
            color: ctx.textColor,
            fontSize: `${fontSizePx}px`,
            lineHeight: 1,
          }}
        >
          {val}
        </span>
        {hasUnit && (
          <span
            className="font-condensed font-bold ml-1 tracking-tight leading-none opacity-80"
            style={{
              color: ctx.mutedTextColor,
              fontSize: `${unitFontSizePx}px`,
              lineHeight: 1,
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function parseColorString(color: string | number): string {
  const parsed = parseXctrackColor(color);
  return rgbaToCss(parsed);
}
