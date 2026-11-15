import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { App } from '../../App';
import { DialogContainer } from '../../components/ui/DialogContainer';
import { dialogStore } from '../../store/useDialogStore';
import { editorStore } from '../../store/useEditorStore';
import { ALL_DEVICES } from '../../data/devices';
import { WIDGET_CATALOG } from '../../data/widgets-catalog';
import { DEMO_MODERN_BACKUP } from '../../data/sample-configs';
import { serializeXcfg } from '../../utils/xcfgSerializer';

describe('Milestone 4 (R4) Component & Feature Tests', () => {
  beforeEach(() => {
    // Reset stores
    editorStore.loadConfig(DEMO_MODERN_BACKUP, 'modern_xctrack_config.xcfg', true);
    // Dismiss any active toasts and resolve any active confirms
    const state = dialogStore.getState();
    state.toasts.forEach((t) => dialogStore.dismissToast(t.id));
    if (state.confirmDialog) {
      dialogStore.resolveConfirm(false);
    }
  });

  describe('Feature 21 & 23: Relocated devices.json and Widget Catalog count', () => {
    it('successfully loads devices from src/data/devices.json', () => {
      expect(ALL_DEVICES.length).toBeGreaterThan(30);
      const pixel = ALL_DEVICES.find((d) => d.id === 'google-pixel-8-pro');
      expect(pixel).toBeDefined();
      expect(pixel?.name).toContain('Pixel 8 Pro');
    });

    it('widget catalog contains exactly 85 registered widgets', () => {
      expect(WIDGET_CATALOG.length).toBe(85);
    });
  });

  describe('Feature 25: Modal Dialog & Toast Service', () => {
    it('renders toasts with correct styling and handles manual dismissal', () => {
      render(<DialogContainer />);

      act(() => {
        dialogStore.success('Config saved successfully');
        dialogStore.error('Invalid configuration payload');
      });

      expect(screen.getByText('Config saved successfully')).toBeInTheDocument();
      expect(screen.getByText('Invalid configuration payload')).toBeInTheDocument();

      const dismissButtons = screen.getAllByRole('button', { name: /Dismiss notification/i });
      expect(dismissButtons.length).toBe(2);

      // Dismiss first toast
      act(() => {
        fireEvent.click(dismissButtons[0]);
      });
      expect(screen.queryByText('Config saved successfully')).not.toBeInTheDocument();
      expect(screen.getByText('Invalid configuration payload')).toBeInTheDocument();
    });

    it('renders confirm modal and resolves true when confirmed', async () => {
      render(<DialogContainer />);

      let resolvedValue: boolean | null = null;
      act(() => {
        dialogStore
          .confirm({
            title: 'Delete Item',
            message: 'Are you sure you want to delete this page?',
            confirmText: 'Delete',
            variant: 'danger',
          })
          .then((val) => {
            resolvedValue = val;
          });
      });

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this page?')).toBeInTheDocument();

      const confirmBtn = screen.getByRole('button', { name: 'Delete' });
      act(() => {
        fireEvent.click(confirmBtn);
      });

      await waitFor(() => {
        expect(resolvedValue).toBe(true);
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resolves false when cancelled or dismissed with Escape', async () => {
      render(<DialogContainer />);

      let resolvedValue: boolean | null = null;
      act(() => {
        dialogStore
          .confirm({
            title: 'Discard Changes',
            message: 'Do you want to discard changes?',
            cancelText: 'Keep Editing',
          })
          .then((val) => {
            resolvedValue = val;
          });
      });

      expect(screen.getByText('Discard Changes')).toBeInTheDocument();

      // Press Escape
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' });
      });

      await waitFor(() => {
        expect(resolvedValue).toBe(false);
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('resolves true when Enter key is pressed', async () => {
      render(<DialogContainer />);

      let resolvedValue: boolean | null = null;
      act(() => {
        dialogStore
          .confirm({
            title: 'Quick Confirm',
            message: 'Press enter to proceed',
          })
          .then((val) => {
            resolvedValue = val;
          });
      });

      expect(screen.getByText('Quick Confirm')).toBeInTheDocument();

      // Press Enter
      act(() => {
        fireEvent.keyDown(window, { key: 'Enter' });
      });

      await waitFor(() => {
        expect(resolvedValue).toBe(true);
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Feature 24: HTML5 Drag-and-Drop Ingestion in App.tsx', () => {
    it('shows visual dropzone overlay when dragging files over window', () => {
      render(<App />);

      expect(screen.queryByTestId('dropzone-overlay')).not.toBeInTheDocument();

      // Trigger dragenter with Files
      fireEvent.dragEnter(window, {
        dataTransfer: {
          types: ['Files'],
        },
      });

      expect(screen.getByTestId('dropzone-overlay')).toBeInTheDocument();
      expect(screen.getByText('Drop .xcfg Configuration')).toBeInTheDocument();

      // Trigger dragleave
      fireEvent.dragLeave(window);
      expect(screen.queryByTestId('dropzone-overlay')).not.toBeInTheDocument();
    });

    it('loads valid .xcfg file on drop and triggers success toast', async () => {
      render(<App />);

      const validConfig = {
        ...DEMO_MODERN_BACKUP,
        info: {
          ...DEMO_MODERN_BACKUP.info,
          device: 'Custom Dropped Device',
        },
      };
      const jsonStr = serializeXcfg(validConfig);
      const file = new File([jsonStr], 'custom_flight.xcfg', { type: 'application/json' });

      // Trigger drop
      fireEvent.drop(window, {
        dataTransfer: {
          files: [file],
        },
      });

      await waitFor(() => {
        expect(editorStore.getState().filename).toBe('custom_flight.xcfg');
      });

      await waitFor(() => {
        expect(
          screen.getByText('Successfully loaded configuration from custom_flight.xcfg')
        ).toBeInTheDocument();
      });
    });

    it('displays error toast when corrupt or invalid JSON is dropped', async () => {
      render(<App />);

      const corruptFile = new File(['{ invalid json content !!!'], 'corrupt.xcfg', {
        type: 'application/json',
      });

      // Trigger drop
      fireEvent.drop(window, {
        dataTransfer: {
          files: [corruptFile],
        },
      });

      await waitFor(() => {
        expect(
          screen.getByText(/Failed to parse file "corrupt.xcfg"/i)
        ).toBeInTheDocument();
      });
    });
  });
});
