import React, { useState } from 'react';
import { useEditorStore, editorStore } from '../../store/useEditorStore';
import { getWidgetDefinition } from '../../data/widgets-catalog';
import { MapStyleGalleryModal } from './MapStyleGalleryModal';
import { PageWidgetsLayerList } from './PageWidgetsLayerList';
import { InspectorHeader } from './InspectorHeader';
import { MapAppearanceSection } from './sections/MapAppearanceSection';
import { WidgetGeometrySection } from './sections/WidgetGeometrySection';
import { WidgetAppearanceSection } from './sections/WidgetAppearanceSection';
import { RawPropertiesSection } from './sections/RawPropertiesSection';

export const WidgetPropertyInspector: React.FC = () => {
  const store = useEditorStore();
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [mapGalleryOpen, setMapGalleryOpen] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isSectionOpen = (id: string) => !collapsedSections[id]; // Default to open

  const page = editorStore.getCurrentPage();
  const widgets = page?.widgets || [];
  const selectedIdx = store.selectedWidgetIndices[0];
  const widget = page && selectedIdx !== undefined ? page.widgets[selectedIdx] : undefined;

  // If no widget is selected: display the full Page Widgets & Layers List
  if (!widget || selectedIdx === undefined) {
    return (
      <PageWidgetsLayerList
        widgets={widgets}
        currentGrid={editorStore.getCurrentGrid()}
        onSelectWidget={(idx) => editorStore.selectWidget(idx, false)}
        onReorderWidget={(from, to) => editorStore.reorderWidget(from, to)}
        onDuplicateWidget={(idx) => editorStore.duplicateWidget(idx)}
        onDeleteWidget={(idx) => editorStore.deleteWidget(idx)}
      />
    );
  }

  const def = getWidgetDefinition(widget.CLASS);
  const currentGrid = editorStore.getCurrentGrid();
  const isMapWidget = widget.CLASS.includes('WXCAssistant') || widget.CLASS.includes('WCompMap');

  const updateProp = (key: string, value: any) => {
    editorStore.updateWidget(selectedIdx, { [key]: value });
  };

  const updateCoords = (X1: number, Y1: number, X2: number, Y2: number) => {
    editorStore.updateWidget(selectedIdx, { X1, Y1, X2, Y2 });
  };

  const removeProp = (key: string) => {
    editorStore.updateWidget(selectedIdx, { [key]: undefined });
  };

  const w = widget as Record<string, any>;
  const appearance = w.mapWidget_mapAppearance || {};
  const currentTheme = appearance.theme || (w.mapWidget_showOpenStreet === false ? 'None' : 'ClearpilotForest');
  const currentTerrain = appearance.terrain || (w.mapWidget_showTerrain === false ? 'None' : 'Light');

  return (
    <div className="w-80 bg-xctrack-card border-l border-xctrack-border flex flex-col h-full overflow-hidden select-none text-xs">
      <InspectorHeader
        selectedIdx={selectedIdx}
        widgets={widgets}
        widget={widget}
        onSelectWidget={(idx) => editorStore.selectWidget(idx, false)}
        onClearSelection={() => editorStore.clearSelection()}
        onReorderWidget={(from, to) => editorStore.reorderWidget(from, to)}
        onDuplicateWidget={() => editorStore.duplicateSelectedWidgets()}
        onDeleteWidget={() => editorStore.deleteSelectedWidgets()}
      />

      <div className="flex-1 overflow-y-auto divide-y divide-xctrack-border/60">
        {isMapWidget && (
          <MapAppearanceSection
            widget={widget}
            onUpdateProp={updateProp}
            onOpenGallery={() => setMapGalleryOpen(true)}
            isOpen={isSectionOpen('map')}
            onToggle={() => toggleSection('map')}
          />
        )}

        <WidgetGeometrySection
          widget={widget}
          grid={currentGrid}
          onUpdateCoords={updateCoords}
          isOpen={isSectionOpen('geometry')}
          onToggle={() => toggleSection('geometry')}
        />

        <WidgetAppearanceSection
          widget={widget}
          widgetDef={def}
          onUpdateProp={updateProp}
          isOpen={isSectionOpen('appearance')}
          onToggle={() => toggleSection('appearance')}
        />

        <RawPropertiesSection
          widget={widget}
          onUpdateProp={updateProp}
          onRemoveProp={removeProp}
          isOpen={isSectionOpen('raw')}
          onToggle={() => toggleSection('raw')}
        />
      </div>

      <MapStyleGalleryModal
        isOpen={mapGalleryOpen}
        onClose={() => setMapGalleryOpen(false)}
        currentTheme={currentTheme}
        currentTerrain={currentTerrain}
        onSelectStyle={(theme, terrain) => {
          updateProp('mapWidget_mapAppearance', { theme, terrain });
          updateProp('mapWidget_showOpenStreet', theme !== 'None');
          updateProp('mapWidget_showTerrain', terrain !== 'None');
        }}
      />
    </div>
  );
};
