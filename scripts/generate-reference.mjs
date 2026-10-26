import fs from 'fs';
import { execSync } from 'child_process';

const xcfgPath = '2026-03-12_backup-00.xcfg';
const xcfg = JSON.parse(fs.readFileSync(xcfgPath, 'utf8'));
const page0 = xcfg.layout.portrait[0];

const WIDGET_TITLES = {
  'org.xcontest.XCTrack.widget.w.WXCAssistant': 'XC ASSISTANT',
  'org.xcontest.XCTrack.widget.w.WSideView': 'SIDE VIEW',
  'org.xcontest.XCTrack.widget.w.WStatusLine': 'STATUS',
  'org.xcontest.XCTrack.widget.w.WVerticalSpeed': 'VARIO',
  'org.xcontest.XCTrack.widget.w.WAltitudeAboveGround': 'ALTITUDE AGL',
  'org.xcontest.XCTrack.widget.w.WGlide': 'GLIDE RATIO',
  'org.xcontest.XCTrack.widget.w.WAirTime': 'AIR TIME',
  'org.xcontest.XCTrack.widget.w.WButtonZoom': 'ZOOM',
  'org.xcontest.XCTrack.widget.w.WAltitude': 'ALTITUDE',
  'org.xcontest.XCTrack.widget.w.WOptiResult': 'XC DISTANCE',
  'org.xcontest.XCTrack.widget.w.WSpeed': 'GROUND SPEED',
  'org.xcontest.XCTrack.widget.w.WNextTurnpointGlideTo': 'GLIDE TO NEXT',
};

const WIDGET_VALUES = {
  'org.xcontest.XCTrack.widget.w.WVerticalSpeed': { val: '+2.8', unit: 'm/s' },
  'org.xcontest.XCTrack.widget.w.WAltitudeAboveGround': { val: '620', unit: 'm' },
  'org.xcontest.XCTrack.widget.w.WGlide': { val: '1:9.4', unit: '' },
  'org.xcontest.XCTrack.widget.w.WAirTime': { val: '2:15', unit: '' },
  'org.xcontest.XCTrack.widget.w.WAltitude': { val: '2,840', unit: 'm' },
  'org.xcontest.XCTrack.widget.w.WOptiResult': { val: '94.6', unit: 'km' },
  'org.xcontest.XCTrack.widget.w.WSpeed': { val: '54.2', unit: 'km/h' },
  'org.xcontest.XCTrack.widget.w.WNextTurnpointGlideTo': { val: '1:7.8', unit: '' },
};

const lines = [];
for (const w of page0.widgets) {
  const isMap = w.CLASS.includes('WXCAssistant');
  const isSideView = w.CLASS.includes('WSideView');
  const isStatus = w.CLASS.includes('WStatusLine');
  const showTitle = w._title !== false;
  const showUnit = w._unit !== false;
  const border = w._border !== false;
  const bg = typeof w._bg === 'number' ? w._bg : 100;
  const title = w.titletext || WIDGET_TITLES[w.CLASS] || '';
  const valInfo = WIDGET_VALUES[w.CLASS] || { val: '--', unit: '' };

  lines.push([
    w.X1, w.Y1, w.X2, w.Y2,
    showTitle, showUnit, border, bg,
    title, valInfo.val, valInfo.unit,
    isMap, isSideView, isStatus
  ].join('|'));
}

fs.writeFileSync('scripts/reference_widgets.txt', lines.join('\n'));
console.log(`Wrote ${lines.length} widgets to scripts/reference_widgets.txt`);

// Run ReferenceRenderer.java directly via JEP 330
execSync('java scripts/ReferenceRenderer.java 412 915 scripts/reference_widgets.txt scripts/reference_render.png', { stdio: 'inherit' });
console.log('Reference rendered successfully!');
