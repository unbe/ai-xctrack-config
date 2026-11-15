import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { editorStore } from './store/useEditorStore';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

if (typeof window !== 'undefined') {
  (window as any).editorStore = editorStore;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
