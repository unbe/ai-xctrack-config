import { describe, it, expect } from 'vitest';
import { editorStore } from '../store/useEditorStore';
import { parseXcfg, serializeXcfg } from '../utils/xcfgSerializer';
import { validateXcfg } from '../utils/configValidator';
import { DEMO_MODERN_BACKUP } from '../data/sample-configs';

describe('Preferences & Store Integration', () => {
  it('loads sample backup with full preferences intact', () => {
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern-sample.xcfg');

    const state = editorStore.getState();
    expect(state.config.info.exportType).toBe('backup');
    expect(state.config.preferences).toBeDefined();
    expect(state.config.preferences?.['Glider.Name']).toBe('Standard Paraglider');
    expect(state.config.preferences?.['Display.Theme']).toBe('BlackTheme');
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

  it('handles custom undo snapshots for canvas drag and resize actions', () => {
    const page = editorStore.getCurrentPage();
    expect(page).toBeDefined();
    const originalWidget = { ...page!.widgets[0] };
    const snapshotBeforeMove = JSON.parse(JSON.stringify(editorStore.getState().config));

    // Simulate moving widget without per-pixel undo spam
    editorStore.updateWidgetCoords(0, 500, 500, 1500, 1500, false);
    let movedWidget = editorStore.getCurrentPage()!.widgets[0];
    expect(movedWidget.X1).toBeDefined();

    // Commit snapshot at end of drag (as handleMouseUp does)
    editorStore.recordCustomUndo(snapshotBeforeMove);
    expect(editorStore.getState().undoStack.length).toBeGreaterThan(0);

    // Undo reverts back to original
    editorStore.undo();
    const revertedWidget = editorStore.getCurrentPage()!.widgets[0];
    expect(revertedWidget.X1).toBe(originalWidget.X1);
    expect(revertedWidget.Y1).toBe(originalWidget.Y1);

    // Redo reapplies the move
    editorStore.redo();
    movedWidget = editorStore.getCurrentPage()!.widgets[0];
    expect(movedWidget.X1).not.toBe(originalWidget.X1);
  });

  it('correctly maps TakeoffSpeed between SI m/s and in-app km/h', () => {
    // 2.777778 m/s is 10 km/h (10 / 3.6 = 2.777778)
    editorStore.updatePreference('TakeoffSpeed', 2.777778);
    let state = editorStore.getState();
    const stored = Number(state.config.preferences?.['TakeoffSpeed']);
    expect(stored).toBe(2.777778);

    const kmhValue = Math.round(stored * 3.6 * 10) / 10;
    expect(kmhValue).toBe(10);

    // When pilot inputs 12 km/h, stores 3.333333 m/s
    const targetKmh = 12;
    const siValue = Math.round((targetKmh / 3.6) * 1000000) / 1000000;
    editorStore.updatePreference('TakeoffSpeed', siValue);

    state = editorStore.getState();
    expect(state.config.preferences?.['TakeoffSpeed']).toBe(3.333333);
  });

  it('supports unified widget layer reordering, duplication, and deletion', () => {
    const initialCount = editorStore.getCurrentPage()!.widgets.length;

    // Duplicate widget at index 0
    editorStore.duplicateWidget(0);
    expect(editorStore.getCurrentPage()!.widgets.length).toBe(initialCount + 1);

    // Reorder: move newly duplicated widget from top to bottom
    const newIdx = editorStore.getCurrentPage()!.widgets.length - 1;
    const widgetClass = editorStore.getCurrentPage()!.widgets[newIdx].CLASS;
    editorStore.reorderWidget(newIdx, 0);
    expect(editorStore.getCurrentPage()!.widgets[0].CLASS).toBe(widgetClass);

    // Delete widget at index 0
    editorStore.deleteWidget(0);
    expect(editorStore.getCurrentPage()!.widgets.length).toBe(initialCount);
  });
});
