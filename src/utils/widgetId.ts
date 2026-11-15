import { XcfgFile, Orientation } from '../types/xcfg';

let editorIdCounter = 0;

export function generateEditorId(): string {
  editorIdCounter += 1;
  return `wid_${Date.now()}_${editorIdCounter}_${Math.random().toString(36).slice(2, 7)}`;
}

export function assignEditorId<T extends { _editorId?: string }>(item: T): T {
  if (!item._editorId) {
    item._editorId = generateEditorId();
  }
  return item;
}

export function populateEditorIds(config: XcfgFile): XcfgFile {
  if (!config || typeof config !== 'object' || !config.layout) return config;
  const orientations: Orientation[] = ['portrait', 'landscape'];
  for (const ori of orientations) {
    const pages = config.layout[ori];
    if (Array.isArray(pages)) {
      for (const page of pages) {
        if (page && Array.isArray(page.widgets)) {
          for (const w of page.widgets) {
            if (w) {
              assignEditorId(w);
            }
          }
        }
      }
    }
  }
  return config;
}
