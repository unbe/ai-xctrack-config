import { describe, it, expect } from 'vitest';
import { editorStore } from '../store/useEditorStore';
import { parseXcfg, serializeXcfg } from '../utils/xcfgSerializer';
import { validateXcfg } from '../utils/configValidator';
import sample2026Backup from '../../2026-03-12_backup-00.xcfg?raw';

describe('Preferences & Store Integration', () => {
  it('loads sample backup with full preferences intact', () => {
    const config = parseXcfg(sample2026Backup);
    editorStore.loadConfig(config, '2026-sample.xcfg');

    const state = editorStore.getState();
    expect(state.config.info.exportType).toBe('backup');
    expect(state.config.preferences).toBeDefined();
    expect(state.config.preferences?.['Glider.Name']).toBe('OZONE Lyght');
    expect(state.config.preferences?.['Display.Theme']).toBe('WhiteHCTheme');
    expect(state.config.airspaceSelectedChannels).toEqual([9, 7]);
  });

  it('updates preferences cleanly with undo support', () => {
    editorStore.updatePreference('Pilot.Name', 'Captain Nemo');
    let state = editorStore.getState();
    expect(state.config.preferences?.['Pilot.Name']).toBe('Captain Nemo');

    // Undo restores previous state
    editorStore.undo();
    state = editorStore.getState();
    expect(state.config.preferences?.['Pilot.Name']).not.toBe('Captain Nemo');

    // Redo re-applies
    editorStore.redo();
    state = editorStore.getState();
    expect(state.config.preferences?.['Pilot.Name']).toBe('Captain Nemo');
  });

  it('updates exportType between backup and pages', () => {
    editorStore.setExportType('pages');
    let state = editorStore.getState();
    expect(state.config.info.exportType).toBe('pages');

    editorStore.setExportType('backup');
    state = editorStore.getState();
    expect(state.config.info.exportType).toBe('backup');
    expect(state.config.preferences).toBeDefined();
  });

  it('updates airspace channels and info metadata', () => {
    editorStore.updateAirspaceChannels([1, 2, 3]);
    editorStore.updateInfo({ device: 'Custom Phone 16' });

    const state = editorStore.getState();
    expect(state.config.airspaceSelectedChannels).toEqual([1, 2, 3]);
    expect(state.config.info.device).toBe('Custom Phone 16');

    // Serializes and validates with 0 errors
    const serialized = serializeXcfg(state.config);
    const parsed = parseXcfg(serialized);
    const validation = validateXcfg(parsed);
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('handles 16-point vario curve updates', () => {
    const customCurve = [
      { lift: -5, freq: 250, cycleMs: 200, duty: 100 },
      { lift: 0, freq: 500, cycleMs: 600, duty: 50 },
      { lift: 2, freq: 700, cycleMs: 400, duty: 50 },
    ];

    editorStore.updatePreference('Sound.AcousticVario.CustomProfile', {
      confTable: customCurve,
    });

    const state = editorStore.getState();
    const profile = state.config.preferences?.['Sound.AcousticVario.CustomProfile'] as any;
    expect(profile.confTable).toEqual(customCurve);
  });
});
