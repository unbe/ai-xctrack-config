import { useSyncExternalStore } from 'react';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning';
}

export interface ConfirmModalState extends ConfirmOptions {
  id: string;
  resolve: (confirmed: boolean) => void;
}

export interface DialogState {
  toasts: ToastItem[];
  confirmDialog: ConfirmModalState | null;
}

class DialogStoreManager {
  private state: DialogState = {
    toasts: [],
    confirmDialog: null,
  };

  private listeners = new Set<() => void>();
  private toastTimers = new Map<string, ReturnType<typeof setTimeout>>();

  public getState = (): DialogState => {
    return this.state;
  };

  public subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // Toast API
  public showToast = (message: string, type: ToastType = 'info', duration: number = 4000): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: ToastItem = { id, message, type, duration };

    this.state = {
      ...this.state,
      toasts: [...this.state.toasts, newToast],
    };
    this.notify();

    if (duration > 0) {
      const timer = setTimeout(() => {
        this.dismissToast(id);
      }, duration);
      this.toastTimers.set(id, timer);
    }

    return id;
  };

  public dismissToast = (id: string): void => {
    const timer = this.toastTimers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.toastTimers.delete(id);
    }

    this.state = {
      ...this.state,
      toasts: this.state.toasts.filter((t) => t.id !== id),
    };
    this.notify();
  };

  public info = (message: string, duration?: number): string => {
    return this.showToast(message, 'info', duration);
  };

  public success = (message: string, duration?: number): string => {
    return this.showToast(message, 'success', duration);
  };

  public warning = (message: string, duration?: number): string => {
    return this.showToast(message, 'warning', duration);
  };

  public error = (message: string, duration?: number): string => {
    return this.showToast(message, 'error', duration);
  };

  public alert = (message: string, type: ToastType = 'error', duration?: number): string => {
    return this.showToast(message, type, duration);
  };

  // Confirm API
  public confirm = (options: string | ConfirmOptions): Promise<boolean> => {
    const opts: ConfirmOptions =
      typeof options === 'string' ? { message: options } : options;

    // If an existing confirm is currently active, resolve it with false
    if (this.state.confirmDialog) {
      this.state.confirmDialog.resolve(false);
    }

    return new Promise<boolean>((resolve) => {
      const confirmState: ConfirmModalState = {
        ...opts,
        id: `confirm-${Date.now()}`,
        resolve,
      };

      this.state = {
        ...this.state,
        confirmDialog: confirmState,
      };
      this.notify();
    });
  };

  public resolveConfirm = (confirmed: boolean): void => {
    if (!this.state.confirmDialog) return;

    const resolver = this.state.confirmDialog.resolve;
    this.state = {
      ...this.state,
      confirmDialog: null,
    };
    this.notify();

    resolver(confirmed);
  };
}

export const dialogStore = new DialogStoreManager();

export function useDialogStore(): DialogState {
  return useSyncExternalStore(dialogStore.subscribe, dialogStore.getState);
}
