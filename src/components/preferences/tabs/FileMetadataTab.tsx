import React from 'react';

export interface FileMetadataTabProps {
  info: Record<string, any>;
  onUpdateInfo: (info: Record<string, any>) => void;
}

export const FileMetadataTab: React.FC<FileMetadataTabProps> = ({ info, onUpdateInfo }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-xctrack-border pb-3">
        <h2 className="text-base font-semibold text-white">Configuration File Metadata (`info`)</h2>
        <p className="text-gray-400 text-xs">Target device identifier, version code, and creation timestamps.</p>
      </div>

      <div className="bg-[#131722] border border-xctrack-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] text-gray-300">Device Description</label>
            <input
              type="text"
              value={info.device || ''}
              onChange={(e) => onUpdateInfo({ device: e.target.value })}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-300">Created Timestamp</label>
            <input
              type="text"
              value={info.timeCreated || ''}
              onChange={(e) => onUpdateInfo({ timeCreated: e.target.value })}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-300">Version Code</label>
            <input
              type="number"
              value={info.versionCode ?? 91210}
              onChange={(e) => onUpdateInfo({ versionCode: parseInt(e.target.value) || 91210 })}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-gray-300">Version Name</label>
            <input
              type="text"
              value={info.versionName || ''}
              onChange={(e) => onUpdateInfo({ versionName: e.target.value })}
              className="w-full bg-[#1c2230] border border-xctrack-border rounded-lg px-3 py-2 text-white font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
