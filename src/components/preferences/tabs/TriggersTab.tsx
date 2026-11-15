import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface TriggersTabProps {
  rawEventMapping: string;
  onUpdateEventMapping: (mapping: string) => void;
}

export const TriggersTab: React.FC<TriggersTabProps> = ({
  rawEventMapping,
  onUpdateEventMapping,
}) => {
  const parseEventMapping = (raw: string) => {
    let clean = raw;
    if (clean.startsWith('001')) clean = clean.slice(3);
    if (!clean) return [];
    return clean.split('|').filter(Boolean).map((rule) => {
      const [event, action] = rule.split(':');
      return { event: event || '', action: action || '' };
    });
  };

  const serializeEventMapping = (rules: { event: string; action: string }[]) => {
    const body = rules.map((r) => `${r.event}:${r.action}`).join('|');
    return body ? `001${body}` : '001';
  };

  const triggerRules = parseEventMapping(rawEventMapping);

  const updateTriggerRule = (idx: number, event: string, action: string) => {
    const updated = [...triggerRules];
    updated[idx] = { event, action };
    onUpdateEventMapping(serializeEventMapping(updated));
  };

  const addTriggerRule = () => {
    const updated = [...triggerRules, { event: 'BATTERY_LOW', action: 'BEEP' }];
    onUpdateEventMapping(serializeEventMapping(updated));
  };

  const removeTriggerRule = (idx: number) => {
    const updated = triggerRules.filter((_, i) => i !== idx);
    onUpdateEventMapping(serializeEventMapping(updated));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Triggers & Automatic Actions (`EventMapping`)</h2>
          <p className="text-gray-400 text-xs">
            Automatically switch pages, activate backlights, or toggle zoom on flight events.
          </p>
        </div>
        <button
          onClick={addTriggerRule}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Rule
        </button>
      </div>

      <div className="space-y-3">
        {triggerRules.map((rule, idx) => (
          <div
            key={idx}
            className="bg-[#131722] border border-xctrack-border rounded-xl p-4 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="text-[11px] text-gray-500 font-mono">WHEN</span>
              <select
                value={rule.event}
                onChange={(e) => updateTriggerRule(idx, e.target.value, rule.action)}
                className="bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-1.5 text-white font-medium"
              >
                <option value="START_THERMALING">Start Thermaling (Thermal Assistant)</option>
                <option value="STOP_THERMALING">Exit Thermal (Back to XC Map)</option>
                <option value="TAKEOFF">Flight Takeoff</option>
                <option value="LANDING">Flight Landing</option>
                <option value="AIRSPACE_PROXIMITY">Airspace Proximity Alert</option>
                <option value="BATTERY_CHARGING">External Power Connected</option>
                <option value="BATTERY_LOW">Battery Low</option>
                <option value="TURNPOINT_REACHED">Turnpoint Reached</option>
              </select>

              <span className="text-[11px] text-gray-500 font-mono">THEN</span>
              <select
                value={rule.action}
                onChange={(e) => updateTriggerRule(idx, rule.event, e.target.value)}
                className="bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-1.5 text-white font-medium"
              >
                <option value="SHOW_THERMAL_ASSISTANT">Switch to Thermal Assistant Page</option>
                <option value="SHOW_LAST_PAGE">Switch to Previous Page</option>
                <option value="SHOW_NEXT_PAGE">Switch to Next Page</option>
                <option value="DISPLAY_FULLBACKLIGHT">Turn On Full Backlight</option>
                <option value="AIRSPACE_PAGE">Switch to Airspace Page</option>
                <option value="ZOOM_IN">Zoom In Map</option>
                <option value="ZOOM_OUT">Zoom Out Map</option>
                <option value="BEEP">Play Alert Beep</option>
              </select>
            </div>

            <button
              onClick={() => removeTriggerRule(idx)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete rule"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {triggerRules.length === 0 && (
          <div className="bg-[#131722] border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
            No automated triggers configured. Click &ldquo;Add Rule&rdquo; to set up automatic page transitions.
          </div>
        )}
      </div>
    </div>
  );
};
