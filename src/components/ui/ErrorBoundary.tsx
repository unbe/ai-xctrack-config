import { Component, ErrorInfo, ReactNode } from 'react';
import { editorStore, clearAutosave, AUTOSAVE_STORAGE_KEY } from '../../store/useEditorStore';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private isMountedComponent = false;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidMount() {
    this.isMountedComponent = true;
  }

  public componentWillUnmount() {
    this.isMountedComponent = false;
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('Unhandled React Error in ErrorBoundary:', error, errorInfo);
  }

  public resetSession = () => {
    try {
      clearAutosave();
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      }
      editorStore.clearSelection();
    } catch (e) {
      console.warn('Failed clearing autosave/localStorage during session reset:', e);
    }
    if (this.isMountedComponent) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    } else {
      this.state = { hasError: false, error: null, errorInfo: null };
    }
    if (typeof window !== 'undefined' && window.location && typeof window.location.reload === 'function') {
      try {
        window.location.reload();
      } catch {
        // Fallback in headless / vitest test environments
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0d1017] text-gray-200 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#161b22] border border-red-500/30 rounded-xl p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white mb-2">Application Error</h1>
            <p className="text-xs text-gray-400 mb-4">
              An unexpected error occurred. You can reset your session to clear autosaved data and restore the editor.
            </p>
            <div className="w-full bg-[#0d1017] p-3 rounded font-mono text-left text-xs text-red-300 mb-6 overflow-auto max-h-32 border border-white/5">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <button
              type="button"
              onClick={this.resetSession}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-red-900/30 cursor-pointer"
            >
              Reset Session
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
