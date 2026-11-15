import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { WidgetPreview } from './WidgetPreview';
import { normToGrid, snapRectToGrid } from '../../utils/gridMath';
import {
  AlignLeft,
  AlignRight,
  Copy,
  Trash2,
  Move,
} from 'lucide-react';

export const ScreenCanvas: React.FC = () => {
  const store = useEditorStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<{
    type: 'move' | 'resize';
    widgetIndex: number;
    startX: number;
    startY: number;
    initialCoords: { X1: number; Y1: number; X2: number; Y2: number };
    currentCoords: { X1: number; Y1: number; X2: number; Y2: number };
    handle?: string;
  } | null>(null);

  const currentPage = editorStore.getCurrentPage();
  const widgets = currentPage?.widgets || [];
  const currentGrid = editorStore.getCurrentGrid();
  const selectedIndices = store.selectedWidgetIndices;

  // Calculate canvas aspect ratio and base dimensions
  const isLandscape = store.activeOrientation === 'landscape';
  const nativeW = isLandscape ? store.activeDevice.screenHeightPx : store.activeDevice.screenWidthPx;
  const nativeH = isLandscape ? store.activeDevice.screenWidthPx : store.activeDevice.screenHeightPx;
  const aspectRatio = nativeW / nativeH;

  // Base canvas display height (scaled by zoom)
  const baseHeight = 640 * store.zoom;
  const baseWidth = baseHeight * aspectRatio;

  // Canvas background color by theme
  const canvasBg = store.globalTheme.toLowerCase().includes('white')
    ? store.globalTheme.toLowerCase().includes('eink')
      ? '#e2e8f0'
      : '#ffffff'
    : '#000000';

  // Selection handler
  const handleWidgetMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    const isMulti = e.shiftKey || e.metaKey || e.ctrlKey;
    if (!selectedIndices.includes(index)) {
      editorStore.selectWidget(index, isMulti);
    }

    if (e.button === 0) {
      // Start move drag
      const w = widgets[index];
      setDragState({
        type: 'move',
        widgetIndex: index,
        startX: e.clientX,
        startY: e.clientY,
        initialCoords: { X1: w.X1, Y1: w.Y1, X2: w.X2, Y2: w.Y2 },
        currentCoords: { X1: w.X1, Y1: w.Y1, X2: w.X2, Y2: w.Y2 },
      });
    }
  };

  // Resize handle mouse down
  const handleResizeMouseDown = (e: React.MouseEvent, index: number, handle: string) => {
    e.stopPropagation();
    const w = widgets[index];
    setDragState({
      type: 'resize',
      widgetIndex: index,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialCoords: { X1: w.X1, Y1: w.Y1, X2: w.X2, Y2: w.Y2 },
      currentCoords: { X1: w.X1, Y1: w.Y1, X2: w.X2, Y2: w.Y2 },
    });
  };

  // Mouse move handler
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || !canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const deltaPxX = e.clientX - dragState.startX;
      const deltaPxY = e.clientY - dragState.startY;

      const deltaNormX = (deltaPxX / rect.width) * 10000;
      const deltaNormY = (deltaPxY / rect.height) * 10000;

      const { X1, Y1, X2, Y2 } = dragState.initialCoords;
      const width = X2 - X1;
      const height = Y2 - Y1;

      let finalX1 = X1;
      let finalY1 = Y1;
      let finalX2 = X2;
      let finalY2 = Y2;

      if (dragState.type === 'move') {
        let newX1 = Math.max(0, Math.min(10000 - width, X1 + deltaNormX));
        let newY1 = Math.max(0, Math.min(10000 - height, Y1 + deltaNormY));
        let newX2 = newX1 + width;
        let newY2 = newY1 + height;

        if (store.snapToGrid) {
          const snapped = snapRectToGrid(newX1, newY1, newX2, newY2, currentGrid.cols, currentGrid.rows);
          newX1 = snapped.X1;
          newY1 = snapped.Y1;
          newX2 = snapped.X2;
          newY2 = snapped.Y2;
        }

        finalX1 = Math.round(newX1);
        finalY1 = Math.round(newY1);
        finalX2 = Math.round(newX2);
        finalY2 = Math.round(newY2);
      } else if (dragState.type === 'resize' && dragState.handle) {
        let nX1 = X1;
        let nY1 = Y1;
        let nX2 = X2;
        let nY2 = Y2;

        const h = dragState.handle;
        if (h.includes('e')) nX2 = Math.min(10000, Math.max(nX1 + 200, X2 + deltaNormX));
        if (h.includes('w')) nX1 = Math.max(0, Math.min(nX2 - 200, X1 + deltaNormX));
        if (h.includes('s')) nY2 = Math.min(10000, Math.max(nY1 + 200, Y2 + deltaNormY));
        if (h.includes('n')) nY1 = Math.max(0, Math.min(nY2 - 200, Y1 + deltaNormY));

        if (store.snapToGrid) {
          const snapped = snapRectToGrid(nX1, nY1, nX2, nY2, currentGrid.cols, currentGrid.rows);
          nX1 = snapped.X1;
          nY1 = snapped.Y1;
          nX2 = snapped.X2;
          nY2 = snapped.Y2;
        }

        finalX1 = Math.round(nX1);
        finalY1 = Math.round(nY1);
        finalX2 = Math.round(nX2);
        finalY2 = Math.round(nY2);
      }

      setDragState((prev) => {
        if (!prev) return null;
        if (
          prev.currentCoords.X1 === finalX1 &&
          prev.currentCoords.Y1 === finalY1 &&
          prev.currentCoords.X2 === finalX2 &&
          prev.currentCoords.Y2 === finalY2
        ) {
          return prev;
        }
        return {
          ...prev,
          currentCoords: { X1: finalX1, Y1: finalY1, X2: finalX2, Y2: finalY2 },
        };
      });
    },
    [dragState, store.snapToGrid, currentGrid]
  );

  const handleMouseUp = useCallback(() => {
    if (dragState) {
      const { X1, Y1, X2, Y2 } = dragState.initialCoords;
      const { X1: curX1, Y1: curY1, X2: curX2, Y2: curY2 } = dragState.currentCoords;
      const hasChanged =
        curX1 !== X1 ||
        curY1 !== Y1 ||
        curX2 !== X2 ||
        curY2 !== Y2;

      if (hasChanged) {
        editorStore.updateWidgetCoords(
          dragState.widgetIndex,
          curX1,
          curY1,
          curX2,
          curY2,
          true
        );
      }
      setDragState(null);
    }
  }, [dragState]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const isD = e.key.toLowerCase() === 'd' || e.code === 'KeyD';

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        editorStore.deleteSelectedWidgets();
      } else if (e.key === 'Escape') {
        editorStore.clearSelection();
      } else if ((e.ctrlKey || e.metaKey) && isD) {
        e.preventDefault();
        editorStore.duplicateSelectedWidgets();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        if (selectedIndices.length === 0) return;

        const stepX = e.shiftKey ? Math.round(10000 / currentGrid.cols / 4) : Math.round(10000 / currentGrid.cols);
        const stepY = e.shiftKey ? Math.round(10000 / currentGrid.rows / 4) : Math.round(10000 / currentGrid.rows);

        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowLeft') dx = -stepX;
        if (e.key === 'ArrowRight') dx = stepX;
        if (e.key === 'ArrowUp') dy = -stepY;
        if (e.key === 'ArrowDown') dy = stepY;

        editorStore.recordCustomUndo(editorStore.getState().config);
        for (const idx of selectedIndices) {
          const w = widgets[idx];
          if (!w) continue;
          const wWidth = w.X2 - w.X1;
          const wHeight = w.Y2 - w.Y1;
          const newX1 = Math.max(0, Math.min(10000 - wWidth, w.X1 + dx));
          const newY1 = Math.max(0, Math.min(10000 - wHeight, w.Y1 + dy));
          editorStore.updateWidgetCoords(idx, newX1, newY1, newX1 + wWidth, newY1 + wHeight, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndices, widgets, currentGrid]);

  // Multi-widget alignment actions
  const alignLeft = () => {
    if (selectedIndices.length < 2) return;
    editorStore.recordCustomUndo(editorStore.getState().config);
    const minX1 = Math.min(...selectedIndices.map((i) => widgets[i].X1));
    for (const i of selectedIndices) {
      const w = widgets[i];
      editorStore.updateWidgetCoords(i, minX1, w.Y1, minX1 + (w.X2 - w.X1), w.Y2, false);
    }
  };

  const alignRight = () => {
    if (selectedIndices.length < 2) return;
    editorStore.recordCustomUndo(editorStore.getState().config);
    const maxX2 = Math.max(...selectedIndices.map((i) => widgets[i].X2));
    for (const i of selectedIndices) {
      const w = widgets[i];
      const width = w.X2 - w.X1;
      editorStore.updateWidgetCoords(i, maxX2 - width, w.Y1, maxX2, w.Y2, false);
    }
  };

  const alignTop = () => {
    if (selectedIndices.length < 2) return;
    editorStore.recordCustomUndo(editorStore.getState().config);
    const minY1 = Math.min(...selectedIndices.map((i) => widgets[i].Y1));
    for (const i of selectedIndices) {
      const w = widgets[i];
      editorStore.updateWidgetCoords(i, w.X1, minY1, w.X2, minY1 + (w.Y2 - w.Y1), false);
    }
  };

  const alignBottom = () => {
    if (selectedIndices.length < 2) return;
    editorStore.recordCustomUndo(editorStore.getState().config);
    const maxY2 = Math.max(...selectedIndices.map((i) => widgets[i].Y2));
    for (const i of selectedIndices) {
      const w = widgets[i];
      const height = w.Y2 - w.Y1;
      editorStore.updateWidgetCoords(i, w.X1, maxY2 - height, w.X2, maxY2, false);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={() => editorStore.clearSelection()}
      className="flex-1 h-full overflow-auto bg-[#0d1015] flex flex-col items-center justify-start p-6 relative select-none"
    >
      {/* Floating Alignment Bar (When multiple widgets are selected) */}
      {selectedIndices.length >= 2 && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed top-28 left-1/2 transform -translate-x-1/2 bg-xctrack-card/95 backdrop-blur border border-xctrack-border rounded-lg shadow-2xl px-2 py-1 flex items-center gap-1 z-40 text-xs text-gray-300 animate-in fade-in slide-in-from-top-2"
        >
          <span className="text-[11px] font-mono px-1.5 text-sky-400 font-semibold">{selectedIndices.length} selected</span>
          <div className="w-px h-4 bg-xctrack-border mx-1"></div>
          <button onClick={alignLeft} className="p-1 hover:text-white rounded hover:bg-white/10" title="Align Left">
            <AlignLeft className="w-4 h-4" />
          </button>
          <button onClick={alignRight} className="p-1 hover:text-white rounded hover:bg-white/10" title="Align Right">
            <AlignRight className="w-4 h-4" />
          </button>
          <button onClick={alignTop} className="p-1 hover:text-white rounded hover:bg-white/10" title="Align Top">
            <AlignLeft className="w-4 h-4 rotate-90" />
          </button>
          <button onClick={alignBottom} className="p-1 hover:text-white rounded hover:bg-white/10" title="Align Bottom">
            <AlignRight className="w-4 h-4 rotate-90" />
          </button>
          <div className="w-px h-4 bg-xctrack-border mx-1"></div>
          <button onClick={() => editorStore.duplicateSelectedWidgets()} className="p-1 hover:text-white rounded hover:bg-white/10" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={() => editorStore.deleteSelectedWidgets()} className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Realistic Device Frame */}
      <div
        className="relative rounded-[28px] p-3 shadow-2xl transition-all"
        style={{
          backgroundColor: '#1f242d',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Device Earpiece / Camera Notch indicator */}
        <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-black/60 rounded-full z-30"></div>

        {/* Screen Canvas Area */}
        <div
          id="phone-screen-canvas"
          ref={canvasRef}
          onClick={(e) => {
            e.stopPropagation();
            editorStore.clearSelection();
          }}
          className="relative overflow-hidden rounded-[20px] transition-shadow"
          style={{
            width: `${baseWidth}px`,
            height: `${baseHeight}px`,
            backgroundColor: canvasBg,
          }}
        >
          {/* Physical Grid Overlay Lines */}
          {store.showGridOverlay && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-20">
              <defs>
                <pattern
                  id="canvasGrid"
                  width={`${100 / currentGrid.cols}%`}
                  height={`${100 / currentGrid.rows}%`}
                  patternUnits="userSpaceOnUse"
                >
                  <rect
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke={store.globalTheme.toLowerCase().includes('white') ? '#000000' : '#ffffff'}
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#canvasGrid)" />
            </svg>
          )}

          {/* Render All Widgets on Page */}
          {widgets.map((widget, index) => {
            const isSelected = selectedIndices.includes(index);
            const stableKey = widget._editorId || `widget-${index}`;

            const isDragging = dragState?.widgetIndex === index;
            const displayCoords = isDragging ? dragState.currentCoords : widget;

            const leftPct = (displayCoords.X1 / 10000) * 100;
            const topPct = (displayCoords.Y1 / 10000) * 100;
            const widthPct = ((displayCoords.X2 - displayCoords.X1) / 10000) * 100;
            const heightPct = ((displayCoords.Y2 - displayCoords.Y1) / 10000) * 100;

            const widgetPixelW = (baseWidth * widthPct) / 100;
            const widgetPixelH = (baseHeight * heightPct) / 100;

            const gx1 = normToGrid(displayCoords.X1, currentGrid.cols);
            const gy1 = normToGrid(displayCoords.Y1, currentGrid.rows);
            const gx2 = normToGrid(displayCoords.X2, currentGrid.cols);
            const gy2 = normToGrid(displayCoords.Y2, currentGrid.rows);

            return (
              <div
                key={stableKey}
                data-widget-index={index}
                data-widget-id={stableKey}
                onMouseDown={(e) => handleWidgetMouseDown(e, index)}
                onClick={(e) => e.stopPropagation()}
                className={`absolute transition-shadow ${
                  isSelected ? 'cursor-move ring-2 ring-sky-400 ring-offset-1 ring-offset-black/50 shadow-lg' : 'cursor-pointer hover:ring-1 hover:ring-sky-400/50'
                }`}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  width: `${widthPct}%`,
                  height: `${heightPct}%`,
                  zIndex: isSelected ? 40 : index + 1,
                }}
              >
                {/* Widget High-Fidelity Preview Content */}
                <WidgetPreview
                  widget={isDragging ? { ...widget, ...displayCoords } : widget}
                  isSelected={isSelected}
                  globalTheme={store.globalTheme}
                  widthPx={widgetPixelW}
                  heightPx={widgetPixelH}
                />

                {/* Selection Overlay & 8 Resize Handles */}
                {isSelected && (
                  <>
                    {/* Live Grid Coordinates Tooltip */}
                    <div className="absolute -top-6 left-0 bg-sky-950/90 text-sky-200 border border-sky-600/60 rounded px-1.5 py-0.5 text-[9px] font-mono pointer-events-none whitespace-nowrap z-40 shadow">
                      {gx2 - gx1}×{gy2 - gy1} cells ({Math.round((displayCoords.X2 - displayCoords.X1) / 100)}%w)
                    </div>

                    {/* Drag Handle (for repositioning widgets that contain internal interactive canvas like Map) */}
                    <div
                      onMouseDown={(e) => handleWidgetMouseDown(e, index)}
                      className="absolute -top-6 right-0 bg-slate-900/95 hover:bg-sky-900 text-gray-300 hover:text-white border border-sky-600/60 rounded px-1.5 py-0.5 text-[9px] font-mono cursor-move flex items-center gap-1 z-40 shadow transition-colors"
                      title="Drag here to move widget"
                    >
                      <Move className="w-2.5 h-2.5" />
                      <span>Move</span>
                    </div>

                    {/* Resize Handles */}
                    {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((handle) => {
                      const posClass: Record<string, string> = {
                        nw: '-top-1.5 -left-1.5 cursor-nwse-resize',
                        n: '-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize',
                        ne: '-top-1.5 -right-1.5 cursor-nesw-resize',
                        e: 'top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize',
                        se: '-bottom-1.5 -right-1.5 cursor-nwse-resize',
                        s: '-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize',
                        sw: '-bottom-1.5 -left-1.5 cursor-nesw-resize',
                        w: 'top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize',
                      };
                      return (
                        <div
                          key={handle}
                          onMouseDown={(e) => handleResizeMouseDown(e, index, handle)}
                          className={`absolute w-3 h-3 bg-white border-2 border-sky-500 rounded-sm z-50 ${posClass[handle]}`}
                        />
                      );
                    })}
                  </>
                )}
              </div>
            );
          })}

          {/* Empty state hint */}
          {widgets.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 p-6 text-center pointer-events-none">
              <div className="text-sm font-medium text-gray-400 mb-1">Empty Page Layout</div>
              <div className="text-xs">Drag widgets from the left palette or select a page template</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
