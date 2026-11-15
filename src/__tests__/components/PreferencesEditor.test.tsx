import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreferencesEditor } from '../../components/preferences/PreferencesEditor';
import { editorStore } from '../../store/useEditorStore';
import { DEMO_MODERN_BACKUP } from '../../data/sample-configs';

describe('PreferencesEditor Component Tests', () => {
  beforeEach(() => {
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
  });

  it('renders all 8 sub-header tab buttons', () => {
    render(<PreferencesEditor />);

    expect(screen.getByRole('button', { name: /Pilot & Glider/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Display & Units/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Acoustic Vario & Sounds/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Triggers & Events/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Keybindings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sensors & Airspace/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /File Metadata/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Diff & Validation/i })).toBeInTheDocument();
  });

  it('allows editing Pilot Name and updates store state', () => {
    render(<PreferencesEditor />);

    const pilotInput = screen.getByPlaceholderText('e.g. John Doe');
    fireEvent.change(pilotInput, { target: { value: 'Chrigel Maurer' } });

    expect(editorStore.getState().config.preferences?.['Pilot.Name']).toBe('Chrigel Maurer');
  });

  it('switches to Display & Units tab and updates theme', () => {
    render(<PreferencesEditor />);

    const displayTabBtn = screen.getByRole('button', { name: /Display & Units/i });
    fireEvent.click(displayTabBtn);

    expect(screen.getByText('Display & Measurement Units')).toBeInTheDocument();

    const themeSelect = screen.getByDisplayValue(/Black Theme/i);
    fireEvent.change(themeSelect, { target: { value: 'WhiteTheme' } });

    expect(editorStore.getState().config.preferences?.['Display.Theme']).toBe('WhiteTheme');
  });

  it('switches to Acoustic Vario tab and toggles sound notifications', () => {
    render(<PreferencesEditor />);

    const varioTabBtn = screen.getByRole('button', { name: /Acoustic Vario & Sounds/i });
    fireEvent.click(varioTabBtn);

    expect(screen.getByText(/16-Point Acoustic Vario Table/i)).toBeInTheDocument();

    // Toggle audio test button
    const testAudioBtn = screen.getByRole('button', { name: /Test Audio/i });
    fireEvent.click(testAudioBtn);

    // Should change to stop button
    expect(screen.getByRole('button', { name: /Stop/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Stop/i }));
    expect(screen.getByRole('button', { name: /Test Audio/i })).toBeInTheDocument();
  });

  it('switches to Triggers tab and can add a new trigger rule', () => {
    render(<PreferencesEditor />);

    const triggersTabBtn = screen.getByRole('button', { name: /Triggers & Events/i });
    fireEvent.click(triggersTabBtn);

    expect(screen.getByText(/Triggers & Automatic Actions/i)).toBeInTheDocument();

    const addRuleBtn = screen.getByRole('button', { name: /Add Rule/i });
    fireEvent.click(addRuleBtn);

    const mapping = editorStore.getState().config.preferences?.['EventMapping'] as string;
    expect(mapping).toContain('BATTERY_LOW:BEEP');
  });

  it('switches to File Metadata tab and updates device name', () => {
    render(<PreferencesEditor />);

    const metadataTabBtn = screen.getByRole('button', { name: /File Metadata/i });
    fireEvent.click(metadataTabBtn);

    expect(screen.getByText(/Configuration File Metadata/i)).toBeInTheDocument();

    const deviceInput = screen.getByDisplayValue(/Pixel 8 Pro|AIR3/i);
    fireEvent.change(deviceInput, { target: { value: 'Oudie N' } });

    expect(editorStore.getState().config.info.device).toBe('Oudie N');
  });

  it('switches to Diff & Validation tab and renders validation status', () => {
    render(<PreferencesEditor />);

    const diffTabBtn = screen.getByRole('button', { name: /Diff & Validation/i });
    fireEvent.click(diffTabBtn);

    expect(screen.getByText(/Visual Diff & Schema Validation/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Copy Formatted JSON/i })).toBeInTheDocument();
  });
});
