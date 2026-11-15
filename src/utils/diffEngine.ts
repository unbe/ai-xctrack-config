import { XcfgFile } from '../types/xcfg';

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  oldLineNumber?: number;
  newLineNumber?: number;
  text: string;
}

export interface SideBySideLine {
  left?: { lineNumber: number; text: string; type: 'removed' | 'unchanged' | 'empty' };
  right?: { lineNumber: number; text: string; type: 'added' | 'unchanged' | 'empty' };
}

export interface SemanticChangeItem {
  type: 'added' | 'removed' | 'modified';
  category: 'info' | 'layout' | 'preferences' | 'airspace';
  path: string;
  description: string;
  oldValue?: string;
  newValue?: string;
}

export interface DiffStats {
  additions: number;
  deletions: number;
  isIdentical: boolean;
}

/**
 * Computes an efficient line-by-line diff using Longest Common Subsequence (LCS)
 * with optimizations for JSON documents.
 */
export function computeLineDiff(originalText: string, modifiedText: string): {
  unified: DiffLine[];
  sideBySide: SideBySideLine[];
  stats: DiffStats;
} {
  const origLines = originalText.split('\n');
  const modLines = modifiedText.split('\n');

  // Fast path: identical strings
  if (originalText === modifiedText) {
    const unified: DiffLine[] = origLines.map((text, idx) => ({
      type: 'unchanged',
      oldLineNumber: idx + 1,
      newLineNumber: idx + 1,
      text,
    }));

    const sideBySide: SideBySideLine[] = origLines.map((text, idx) => ({
      left: { lineNumber: idx + 1, text, type: 'unchanged' },
      right: { lineNumber: idx + 1, text, type: 'unchanged' },
    }));

    return {
      unified,
      sideBySide,
      stats: { additions: 0, deletions: 0, isIdentical: true },
    };
  }

  // Trim common prefix
  let prefixCount = 0;
  while (
    prefixCount < origLines.length &&
    prefixCount < modLines.length &&
    origLines[prefixCount] === modLines[prefixCount]
  ) {
    prefixCount++;
  }

  // Trim common suffix
  let suffixCount = 0;
  while (
    suffixCount < origLines.length - prefixCount &&
    suffixCount < modLines.length - prefixCount &&
    origLines[origLines.length - 1 - suffixCount] === modLines[modLines.length - 1 - suffixCount]
  ) {
    suffixCount++;
  }

  const midOrig = origLines.slice(prefixCount, origLines.length - suffixCount);
  const midMod = modLines.slice(prefixCount, modLines.length - suffixCount);

  // Compute LCS table on the middle portion
  const n = midOrig.length;
  const m = midMod.length;

  // For very large mid blocks (> 2500 lines), use block-based fallback to guarantee instantaneous rendering
  let lcsMid: { type: 'added' | 'removed' | 'unchanged'; oldIdx?: number; newIdx?: number }[] = [];

  if (n * m > 12_000_000) {
    // Large file heuristic: treat midOrig as deletions, midMod as additions
    for (let i = 0; i < n; i++) lcsMid.push({ type: 'removed', oldIdx: i });
    for (let j = 0; j < m; j++) lcsMid.push({ type: 'added', newIdx: j });
  } else {
    // Standard Dynamic Programming LCS
    // Flat 1D Uint16Array for performance and low memory allocation
    const dp = new Uint32Array((n + 1) * (m + 1));
    const stride = m + 1;

    for (let i = 1; i <= n; i++) {
      const origItem = midOrig[i - 1];
      const iStride = i * stride;
      const prevStride = (i - 1) * stride;
      for (let j = 1; j <= m; j++) {
        if (origItem === midMod[j - 1]) {
          dp[iStride + j] = dp[prevStride + (j - 1)] + 1;
        } else {
          const up = dp[prevStride + j];
          const left = dp[iStride + (j - 1)];
          dp[iStride + j] = up >= left ? up : left;
        }
      }
    }

    // Backtrack from (n, m)
    let i = n;
    let j = m;
    const revLcs: typeof lcsMid = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && midOrig[i - 1] === midMod[j - 1]) {
        revLcs.push({ type: 'unchanged', oldIdx: i - 1, newIdx: j - 1 });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i * stride + (j - 1)] >= dp[(i - 1) * stride + j])) {
        revLcs.push({ type: 'added', newIdx: j - 1 });
        j--;
      } else if (i > 0) {
        revLcs.push({ type: 'removed', oldIdx: i - 1 });
        i--;
      }
    }

    lcsMid = revLcs.reverse();
  }

  // Assemble full unified diff
  const unified: DiffLine[] = [];
  let oldLineNum = 1;
  let newLineNum = 1;
  let additions = 0;
  let deletions = 0;

  // Prefix
  for (let k = 0; k < prefixCount; k++) {
    unified.push({
      type: 'unchanged',
      oldLineNumber: oldLineNum++,
      newLineNumber: newLineNum++,
      text: origLines[k],
    });
  }

  // Middle
  for (const item of lcsMid) {
    if (item.type === 'unchanged') {
      unified.push({
        type: 'unchanged',
        oldLineNumber: oldLineNum++,
        newLineNumber: newLineNum++,
        text: midOrig[item.oldIdx!],
      });
    } else if (item.type === 'removed') {
      deletions++;
      unified.push({
        type: 'removed',
        oldLineNumber: oldLineNum++,
        text: midOrig[item.oldIdx!],
      });
    } else if (item.type === 'added') {
      additions++;
      unified.push({
        type: 'added',
        newLineNumber: newLineNum++,
        text: midMod[item.newIdx!],
      });
    }
  }

  // Suffix
  for (let k = origLines.length - suffixCount; k < origLines.length; k++) {
    unified.push({
      type: 'unchanged',
      oldLineNumber: oldLineNum++,
      newLineNumber: newLineNum++,
      text: origLines[k],
    });
  }

  // Assemble side-by-side aligned diff
  const sideBySide: SideBySideLine[] = [];
  let uIdx = 0;

  while (uIdx < unified.length) {
    const curr = unified[uIdx];

    if (curr.type === 'unchanged') {
      sideBySide.push({
        left: { lineNumber: curr.oldLineNumber!, text: curr.text, type: 'unchanged' },
        right: { lineNumber: curr.newLineNumber!, text: curr.text, type: 'unchanged' },
      });
      uIdx++;
    } else {
      // Gather contiguous block of removed & added lines
      const removedBlock: DiffLine[] = [];
      const addedBlock: DiffLine[] = [];

      while (uIdx < unified.length && unified[uIdx].type !== 'unchanged') {
        if (unified[uIdx].type === 'removed') {
          removedBlock.push(unified[uIdx]);
        } else if (unified[uIdx].type === 'added') {
          addedBlock.push(unified[uIdx]);
        }
        uIdx++;
      }

      const maxLen = Math.max(removedBlock.length, addedBlock.length);
      for (let b = 0; b < maxLen; b++) {
        const rem = removedBlock[b];
        const add = addedBlock[b];

        sideBySide.push({
          left: rem
            ? { lineNumber: rem.oldLineNumber!, text: rem.text, type: 'removed' }
            : { lineNumber: 0, text: '', type: 'empty' },
          right: add
            ? { lineNumber: add.newLineNumber!, text: add.text, type: 'added' }
            : { lineNumber: 0, text: '', type: 'empty' },
        });
      }
    }
  }

  return {
    unified,
    sideBySide,
    stats: {
      additions,
      deletions,
      isIdentical: additions === 0 && deletions === 0,
    },
  };
}

/**
 * Computes high-level semantic changes between original and modified XcfgFile
 */
export function computeSemanticDiff(orig: XcfgFile, curr: XcfgFile): SemanticChangeItem[] {
  const changes: SemanticChangeItem[] = [];

  // 1. Info section
  if (orig.info?.device !== curr.info?.device) {
    changes.push({
      type: 'modified',
      category: 'info',
      path: 'info.device',
      description: 'Target Device modified',
      oldValue: orig.info?.device,
      newValue: curr.info?.device,
    });
  }

  if (orig.info?.exportType !== curr.info?.exportType) {
    changes.push({
      type: 'modified',
      category: 'info',
      path: 'info.exportType',
      description: 'Export Type changed',
      oldValue: orig.info?.exportType,
      newValue: curr.info?.exportType,
    });
  }

  // 2. Layout changes
  for (const orientation of ['portrait', 'landscape'] as const) {
    const origPages = orig.layout?.[orientation] || [];
    const currPages = curr.layout?.[orientation] || [];

    if (origPages.length !== currPages.length) {
      changes.push({
        type: currPages.length > origPages.length ? 'added' : 'removed',
        category: 'layout',
        path: `layout.${orientation}`,
        description: `${orientation.charAt(0).toUpperCase() + orientation.slice(1)} page count changed (${origPages.length} → ${currPages.length})`,
        oldValue: `${origPages.length} pages`,
        newValue: `${currPages.length} pages`,
      });
    }

    const minPages = Math.min(origPages.length, currPages.length);
    for (let p = 0; p < minPages; p++) {
      const origP = origPages[p];
      const currP = currPages[p];

      if (origP.CLASS !== currP.CLASS) {
        changes.push({
          type: 'modified',
          category: 'layout',
          path: `layout.${orientation}[${p}].CLASS`,
          description: `Page ${p + 1} (${orientation}) type changed`,
          oldValue: origP.CLASS?.replace('org.xcontest.XCTrack.widget.wp.', ''),
          newValue: currP.CLASS?.replace('org.xcontest.XCTrack.widget.wp.', ''),
        });
      }

      if (origP.widgets.length !== currP.widgets.length) {
        changes.push({
          type: 'modified',
          category: 'layout',
          path: `layout.${orientation}[${p}].widgets`,
          description: `Page ${p + 1} (${orientation}) widget count changed (${origP.widgets.length} → ${currP.widgets.length})`,
          oldValue: `${origP.widgets.length} widgets`,
          newValue: `${currP.widgets.length} widgets`,
        });
      }

      const origWidgets = origP.widgets || [];
      const currWidgets = currP.widgets || [];
      const minWidgets = Math.min(origWidgets.length, currWidgets.length);

      for (let w = 0; w < minWidgets; w++) {
        const origW = origWidgets[w];
        const currW = currWidgets[w];
        const widgetName = currW.titletext || currW.CLASS?.split('.').pop() || origW.titletext || origW.CLASS?.split('.').pop() || `Widget ${w + 1}`;

        // Geometry comparison
        if (
          origW.X1 !== currW.X1 ||
          origW.Y1 !== currW.Y1 ||
          origW.X2 !== currW.X2 ||
          origW.Y2 !== currW.Y2
        ) {
          changes.push({
            type: 'modified',
            category: 'layout',
            path: `layout.${orientation}[${p}].widgets[${w}].geometry`,
            description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) position/size changed`,
            oldValue: `(${origW.X1}, ${origW.Y1}) - (${origW.X2}, ${origW.Y2})`,
            newValue: `(${currW.X1}, ${currW.Y1}) - (${currW.X2}, ${currW.Y2})`,
          });
        }

        // Property comparisons
        const propKeys = new Set([...Object.keys(origW), ...Object.keys(currW)]);
        const ignoredKeys = new Set(['X1', 'Y1', 'X2', 'Y2', 'gridX1', 'gridY1', 'gridX2', 'gridY2', '_editorId']);

        for (const key of propKeys) {
          if (ignoredKeys.has(key)) continue;

          const hasOld = key in origW;
          const hasNew = key in currW;

          if (!hasOld && hasNew) {
            changes.push({
              type: 'added',
              category: 'layout',
              path: `layout.${orientation}[${p}].widgets[${w}].${key}`,
              description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) property "${key}" added`,
              newValue: typeof currW[key] === 'object' ? JSON.stringify(currW[key]) : String(currW[key]),
            });
          } else if (hasOld && !hasNew) {
            changes.push({
              type: 'removed',
              category: 'layout',
              path: `layout.${orientation}[${p}].widgets[${w}].${key}`,
              description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) property "${key}" removed`,
              oldValue: typeof origW[key] === 'object' ? JSON.stringify(origW[key]) : String(origW[key]),
            });
          } else if (JSON.stringify(origW[key]) !== JSON.stringify(currW[key])) {
            changes.push({
              type: 'modified',
              category: 'layout',
              path: `layout.${orientation}[${p}].widgets[${w}].${key}`,
              description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) property "${key}" modified`,
              oldValue: typeof origW[key] === 'object' ? JSON.stringify(origW[key]) : String(origW[key]),
              newValue: typeof currW[key] === 'object' ? JSON.stringify(currW[key]) : String(currW[key]),
            });
          }
        }
      }

      // Added widgets on page
      for (let w = minWidgets; w < currWidgets.length; w++) {
        const currW = currWidgets[w];
        const widgetName = currW.titletext || currW.CLASS?.split('.').pop() || `Widget ${w + 1}`;
        changes.push({
          type: 'added',
          category: 'layout',
          path: `layout.${orientation}[${p}].widgets[${w}]`,
          description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) added`,
          newValue: currW.CLASS?.split('.').pop(),
        });
      }

      // Removed widgets on page
      for (let w = minWidgets; w < origWidgets.length; w++) {
        const origW = origWidgets[w];
        const widgetName = origW.titletext || origW.CLASS?.split('.').pop() || `Widget ${w + 1}`;
        changes.push({
          type: 'removed',
          category: 'layout',
          path: `layout.${orientation}[${p}].widgets[${w}]`,
          description: `Page ${p + 1} (${orientation}) widget #${w + 1} (${widgetName}) removed`,
          oldValue: origW.CLASS?.split('.').pop(),
        });
      }
    }
  }

  // 3. Preferences changes
  const origPrefs = orig.preferences || {};
  const currPrefs = curr.preferences || {};
  const allKeys = new Set([...Object.keys(origPrefs), ...Object.keys(currPrefs)]);

  for (const key of allKeys) {
    const hasOld = key in origPrefs;
    const hasNew = key in currPrefs;

    if (!hasOld && hasNew) {
      changes.push({
        type: 'added',
        category: 'preferences',
        path: `preferences.${key}`,
        description: `Added setting "${key}"`,
        newValue: String(currPrefs[key]),
      });
    } else if (hasOld && !hasNew) {
      changes.push({
        type: 'removed',
        category: 'preferences',
        path: `preferences.${key}`,
        description: `Removed setting "${key}"`,
        oldValue: String(origPrefs[key]),
      });
    } else if (JSON.stringify(origPrefs[key]) !== JSON.stringify(currPrefs[key])) {
      changes.push({
        type: 'modified',
        category: 'preferences',
        path: `preferences.${key}`,
        description: `Setting "${key}" modified`,
        oldValue: String(origPrefs[key]),
        newValue: String(currPrefs[key]),
      });
    }
  }

  // 4. Airspace channels
  const oldAir = JSON.stringify(orig.airspaceSelectedChannels || []);
  const newAir = JSON.stringify(curr.airspaceSelectedChannels || []);
  if (oldAir !== newAir) {
    changes.push({
      type: 'modified',
      category: 'airspace',
      path: 'airspaceSelectedChannels',
      description: 'Airspace Selected Channels modified',
      oldValue: oldAir,
      newValue: newAir,
    });
  }

  return changes;
}
