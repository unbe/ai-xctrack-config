import React, { useEffect, useRef } from 'react';
import {
  useDialogStore,
  dialogStore,
  ConfirmModalState,
  ToastItem,
} from '../../store/useDialogStore';
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Info,
  X,
} from 'lucide-react';

export const ConfirmModal: React.FC<{
  dialog: ConfirmModalState;
  onResolve: (confirmed: boolean) => void;
}> = ({ dialog, onResolve }) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus confirm button when dialog opens
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onResolve(false);
      } else if (e.key === 'Enter') {
        // Prevent default form submit/newline if any
        e.preventDefault();
        onResolve(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResolve]);

  const variant = dialog.variant || 'primary';

  let icon = <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />;
  let confirmBtnClass =
    'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25';

  if (variant === 'danger') {
    icon = <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />;
    confirmBtnClass =
      'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/25';
  } else if (variant === 'warning') {
    icon = <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />;
    confirmBtnClass =
      'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-500/25';
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => onResolve(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
    >
      <div
        className="bg-xctrack-card border border-xctrack-border rounded-2xl p-6 shadow-2xl max-w-md w-full text-white space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="dialog-title" className="text-lg font-semibold text-white">
              {dialog.title || 'Confirmation'}
            </h3>
            <p id="dialog-desc" className="text-sm text-gray-300 mt-1.5 leading-relaxed">
              {dialog.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onResolve(false)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 border border-xctrack-border transition-colors"
          >
            {dialog.cancelText || 'Cancel'}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={() => onResolve(true)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${confirmBtnClass}`}
          >
            {dialog.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastNotification: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  let icon = <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />;
  let styleClass = 'bg-blue-950/90 border-blue-500/40 text-blue-100';

  if (toast.type === 'success') {
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
    styleClass = 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100';
  } else if (toast.type === 'error') {
    icon = <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />;
    styleClass = 'bg-red-950/90 border-red-500/40 text-red-100';
  } else if (toast.type === 'warning') {
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
    styleClass = 'bg-amber-950/90 border-amber-500/40 text-amber-100';
  }

  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-2 ${styleClass}`}
    >
      <div className="mt-0.5">{icon}</div>
      <p className="text-sm font-medium leading-snug flex-1 break-words">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors -mr-1 -mt-0.5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const DialogContainer: React.FC = () => {
  const { toasts, confirmDialog } = useDialogStore();

  return (
    <>
      {confirmDialog && (
        <ConfirmModal
          dialog={confirmDialog}
          onResolve={dialogStore.resolveConfirm}
        />
      )}

      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onDismiss={dialogStore.dismissToast}
          />
        ))}
      </div>
    </>
  );
};
