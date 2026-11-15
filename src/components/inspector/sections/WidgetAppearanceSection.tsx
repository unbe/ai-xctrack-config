import React from 'react';
import { Palette, ChevronDown, ChevronRight } from 'lucide-react';
import { XcfgWidget, WidgetDefinition } from '../../../types/xcfg';

export interface WidgetAppearanceSectionProps {
  widget: XcfgWidget;
  widgetDef?: WidgetDefinition;
  onUpdateProp: (key: string, value: any) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const WidgetAppearanceSection: React.FC<WidgetAppearanceSectionProps> = ({
  widget,
  widgetDef,
  onUpdateProp,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="border-b border-xctrack-border/60">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 bg-xctrack-card/60 hover:bg-white/[0.04] transition-colors border-b border-xctrack-border/40 select-none text-left"
      >
        <div className="flex items-center gap-2">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-semibold text-gray-200 uppercase tracking-wider">
            Border & Background
          </span>
          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <span className="text-[10px] font-mono text-purple-400/90 font-medium">
          {widget._bg ?? 100}% Transp
        </span>
      </button>

      {isOpen && (
        <div className="p-3 space-y-3 bg-slate-950/20">
          {/* Title Settings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-200 block font-medium">Show Title</span>
                <span className="text-[10px] text-gray-500">Header title bar</span>
              </div>
              <input
                type="checkbox"
                checked={widget._title !== false}
                onChange={(e) => onUpdateProp('_title', e.target.checked)}
                className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            {widget._title !== false && (
              <div className="space-y-1 pl-2 border-l border-gray-700">
                <label className="text-[10px] text-gray-400 block">Custom Title</label>
                <input
                  type="text"
                  placeholder={widgetDef?.title || 'Default'}
                  value={widget.titletext ?? ''}
                  onChange={(e) => onUpdateProp('titletext', e.target.value)}
                  className="w-full bg-[#181d28] border border-xctrack-border rounded px-2 py-1 text-xs text-white"
                />
              </div>
            )}
          </div>

          {/* Border */}
          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs text-gray-200 block font-medium">Draw Border</span>
              <span className="text-[10px] text-gray-500">1px outline</span>
            </div>
            <input
              type="checkbox"
              checked={Boolean(widget._border)}
              onChange={(e) => onUpdateProp('_border', e.target.checked)}
              className="w-4 h-4 rounded bg-[#181d28] border-gray-600 text-blue-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Background Transparency */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Background Transparency</span>
              <span className="font-mono text-white">{widget._bg ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={widget._bg ?? 100}
              onChange={(e) => onUpdateProp('_bg', parseInt(e.target.value))}
              className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[9px] text-gray-500">
              <span>Solid (0%)</span>
              <span>Transparent (100%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
