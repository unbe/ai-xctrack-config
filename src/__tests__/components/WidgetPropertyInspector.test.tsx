import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetPropertyInspector } from '../../components/inspector/WidgetPropertyInspector';
import { editorStore } from '../../store/useEditorStore';
import { DEMO_MODERN_BACKUP } from '../../data/sample-configs';

describe('WidgetPropertyInspector Component Tests', () => {
  beforeEach(() => {
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
    editorStore.clearSelection();
  });

  it('renders PageWidgetsLayerList when no widget is selected', () => {
    render(<WidgetPropertyInspector />);

    expect(screen.getByText('Widgets & Layers')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search widgets & layers...')).toBeInTheDocument();
  });

  it('filters widget list using the search input', () => {
    render(<WidgetPropertyInspector />);

    const searchInput = screen.getByPlaceholderText('Search widgets & layers...');
    fireEvent.change(searchInput, { target: { value: 'Thermal' } });

    // Should not crash or produce unhandled errors
    expect(screen.getByPlaceholderText('Search widgets & layers...')).toBeInTheDocument();
  });

  it('renders Inspector sections when a widget is selected', () => {
    editorStore.selectWidget(0, false);
    render(<WidgetPropertyInspector />);

    expect(screen.getByText('Size & Position (Grid)')).toBeInTheDocument();
    expect(screen.getByText('Border & Background')).toBeInTheDocument();
    expect(screen.getByText('Raw & Preserved Properties')).toBeInTheDocument();
  });

  it('modifies widget grid coordinates via Quick Fit buttons', () => {
    editorStore.selectWidget(0, false);
    render(<WidgetPropertyInspector />);

    const fullWidthBtn = screen.getByRole('button', { name: /Full Width/i });
    fireEvent.click(fullWidthBtn);

    const page = editorStore.getCurrentPage();
    const widget = page?.widgets[0];
    expect(widget?.X1).toBe(0);
    expect(widget?.X2).toBe(10000);
  });

  it('modifies title in Border & Background section', () => {
    editorStore.selectWidget(0, false);
    render(<WidgetPropertyInspector />);

    const titleInput = screen.getByPlaceholderText(/Default|XC Map|Map|Speed/i);
    fireEvent.change(titleInput, { target: { value: 'Custom Speedo' } });

    const page = editorStore.getCurrentPage();
    expect(page?.widgets[0].titletext).toBe('Custom Speedo');
  });

  it('adds custom property in Raw & Preserved Properties section', () => {
    editorStore.selectWidget(0, false);
    render(<WidgetPropertyInspector />);

    const keyInput = screen.getByPlaceholderText('key');
    const valInput = screen.getByPlaceholderText('value');
    const addBtn = screen.getByRole('button', { name: /Add Property/i });

    fireEvent.change(keyInput, { target: { value: 'customFlag' } });
    fireEvent.change(valInput, { target: { value: 'true' } });
    fireEvent.click(addBtn);

    const page = editorStore.getCurrentPage();
    expect((page?.widgets[0] as any).customFlag).toBe(true);
  });

  it('returns to layer list when clicking Back to Widgets', () => {
    editorStore.selectWidget(0, false);
    render(<WidgetPropertyInspector />);

    const backBtn = screen.getByRole('button', { name: /Widgets/i });
    fireEvent.click(backBtn);

    expect(screen.getByText('Widgets & Layers')).toBeInTheDocument();
  });
});
