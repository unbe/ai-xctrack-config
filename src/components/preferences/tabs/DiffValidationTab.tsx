import React, { useState } from 'react';
import { FileCheck, AlertCircle, GitCompare, Copy, Check } from 'lucide-react';
import { XcfgFile } from '../../../types/xcfg';
import { validateXcfg } from '../../../utils/configValidator';

export interface DiffValidationTabProps {
  config: XcfgFile;
  originalConfig: XcfgFile;
  filename: string;
}

export const DiffValidationTab: React.FC<DiffValidationTabProps> = ({
  config,
  originalConfig,
  filename,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const validation = validateXcfg(config);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const origPortPages = originalConfig.layout?.portrait?.length || 0;
  const currPortPages = config.layout?.portrait?.length || 0;
  const origLandPages = originalConfig.layout?.landscape?.length || 0;
  const currLandPages = config.layout?.landscape?.length || 0;

  const diffs: string[] = [];
  if (origPortPages !== currPortPages) {
    diffs.push(`Portrait pages: ${origPortPages} → ${currPortPages}`);
  }
  if (origLandPages !== currLandPages) {
    diffs.push(`Landscape pages: ${origLandPages} → ${currLandPages}`);
  }
  if (originalConfig.info?.exportType !== config.info?.exportType) {
    diffs.push(`Export type: ${originalConfig.info?.exportType} → ${config.info?.exportType}`);
  }
  if (originalConfig.info?.device !== config.info?.device) {
    diffs.push(`Device: "${originalConfig.info?.device}" → "${config.info?.device}"`);
  }

  // Check modified preferences
  const origPrefs = originalConfig.preferences || {};
  const currPrefs = config.preferences || {};
  const allKeys = Array.from(new Set([...Object.keys(origPrefs), ...Object.keys(currPrefs)]));
  let modifiedPrefs = 0;
  for (const k of allKeys) {
    if (JSON.stringify(origPrefs[k]) !== JSON.stringify(currPrefs[k])) {
      modifiedPrefs++;
    }
  }
  if (modifiedPrefs > 0) {
    diffs.push(`${modifiedPrefs} preference setting(s) changed`);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Visual Diff & Schema Validation</h2>
          <p className="text-gray-400 text-xs">
            Review modifications against original file and verify compatibility with XCTrack parser.
          </p>
        </div>

        <button
          onClick={handleCopyJson}
          className="px-3 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#252d40] border border-xctrack-border text-white text-xs flex items-center gap-1.5 transition-colors"
        >
          {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copiedJson ? 'Copied JSON!' : 'Copy Formatted JSON'}
        </button>
      </div>

      {/* Validation Alert Box */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 ${
          validation.valid
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-red-950/20 border-red-500/30 text-red-300'
        }`}
      >
        {validation.valid ? (
          <FileCheck className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
        )}
        <div>
          <span className="font-semibold block text-xs">
            {validation.valid ? 'Configuration Valid & Ready for XCTrack' : 'Validation Issues Found'}
          </span>
          <span className="text-[11px] opacity-80 block">
            {validation.valid
              ? 'All required keys, coordinates, and schemas strictly comply with XCTrack Android requirements.'
              : validation.errors.map((e) => `${e.path}: ${e.message}`).join('; ')}
          </span>
        </div>
      </div>

      {/* Diff Summary */}
      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-3 font-mono text-xs">
        <h3 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-sky-400" /> Changes Summary
        </h3>

        {diffs.length === 0 ? (
          <div className="text-gray-500 py-2">
            No changes from original loaded file &ldquo;{filename}&rdquo;.
          </div>
        ) : (
          <ul className="space-y-1.5 list-disc pl-5 text-gray-300">
            {diffs.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
