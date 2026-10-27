import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { editorStore } from './store/useEditorStore';

if (typeof window !== 'undefined') {
  (window as any).editorStore = editorStore;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
