import puppeteer from 'puppeteer-core';
import path from 'path';

const ARTIFACT_DIR = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e';

async function run() {
  console.log('Connecting to browser on port 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  // =========================================================================
  // Test 1: Click Examples Menu & Inspect Dynamic Discovery & Search
  // =========================================================================
  console.log('Testing Examples menu click-to-toggle...');
  const examplesBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((b) => b.innerText && b.innerText.includes('Examples'));
  });

  if (examplesBtn) {
    await examplesBtn.click();
  }
  await new Promise((r) => setTimeout(r, 800));

  // Take screenshot of opened Examples dropdown with local files
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'examples_1_dropdown_open.png') });
  console.log('Captured examples_1_dropdown_open.png');

  // Verify local files are present
  const localFileNames = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons
      .map((b) => b.innerText)
      .filter((txt) => txt && txt.includes('.xcfg'));
  });
  console.log('✓ Discovered local files:', localFileNames);

  // Search filter test
  console.log('Testing search filter with "2026-10-27"...');
  await page.type('input[placeholder*="Search configs"]', '2026-10-27');
  await new Promise((r) => setTimeout(r, 400));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'examples_2_filtered_search.png') });
  console.log('Captured examples_2_filtered_search.png');

  // Click on 2026-10-27_backup-00.xcfg
  console.log('Loading 2026-10-27_backup-00.xcfg...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find((b) => b.innerText && b.innerText.includes('2026-10-27_backup-00.xcfg'));
    if (target) target.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const currentFilename = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.innerText : '';
  });
  console.log('Current filename in header:', currentFilename.split('\n').find((l) => l.includes('.xcfg')));

  // =========================================================================
  // Test 2: Auto-save & Page Reload Preservation
  // =========================================================================
  console.log('Switching active page to Page 2 to modify state...');
  await page.evaluate(() => {
    const pageButtons = Array.from(document.querySelectorAll('button[class*="rounded"]'));
    const p2 = pageButtons.find((b) => b.innerText && b.innerText.trim() === '2');
    if (p2) p2.click();
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log('Reloading browser page to test auto-save restore...');
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  const afterReloadInfo = await page.evaluate(() => {
    const header = document.querySelector('header');
    const headerText = header ? header.innerText : '';
    const activePageChip = document.querySelector('span[class*="text-sky-300"], div[class*="bg-sky-600"]');
    return {
      headerText,
      activePageChip: activePageChip ? activePageChip.innerText : null,
      savedState: localStorage.getItem('xctrack_autosave_state') ? true : false,
    };
  });
  console.log('✓ After reload: autosave present:', afterReloadInfo.savedState);
  console.log('✓ Restored filename in header:', afterReloadInfo.headerText.includes('2026-10-27_backup-00.xcfg'));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'examples_3_restored_after_reload.png') });
  console.log('Captured examples_3_restored_after_reload.png');

  // =========================================================================
  // Test 3: Realistic Thunderstorm Radar Cell Verification
  // =========================================================================
  console.log('Verifying thunderstorm radar layer on map canvas...');
  // Switch back to Page 1 (which has the primary navigation map with rain radar enabled)
  await page.evaluate(() => {
    const pageButtons = Array.from(document.querySelectorAll('button[class*="rounded"]'));
    const p1 = pageButtons.find((b) => b.innerText && b.innerText.trim() === '1');
    if (p1) p1.click();
  });
  await new Promise((r) => setTimeout(r, 1200));

  const radarLayerInfo = await page.evaluate(() => {
    const mapEl = document.querySelector('.maplibregl-map');
    const map = mapEl ? mapEl._map : null;
    if (!map) return { hasMap: false };
    const style = map.getStyle();
    const radarSource = style?.sources?.['rain-radar'];
    const fillLayer = style?.layers?.find((l) => l.id === 'rain-radar-fill');
    const strokeLayer = style?.layers?.find((l) => l.id === 'rain-radar-stroke');
    const features = radarSource?.data?.features || [];
    return {
      hasMap: true,
      hasRadarSource: !!radarSource,
      hasFillLayer: !!fillLayer,
      hasStrokeLayer: !!strokeLayer,
      featureCount: features.length,
      dbzLevels: features.map((f) => f.properties?.dbz),
      colors: features.map((f) => f.properties?.color),
    };
  });
  console.log('✓ MapLibre Rain Radar Verification:', radarLayerInfo);

  // Zoom into the map widget to capture the thunderstorm cell in detail
  await page.evaluate(() => {
    const mapEl = document.querySelector('.maplibregl-map');
    const map = mapEl ? mapEl._map : null;
    if (map) {
      // Pan toward the storm cell (~6km NE of flight center)
      map.easeTo({
        center: [7.915, 46.724],
        zoom: 12.0,
        duration: 0,
      });
    }
  });
  await new Promise((r) => setTimeout(r, 1000));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'examples_4_thunderstorm_radar_cell.png') });
  console.log('Captured examples_4_thunderstorm_radar_cell.png');

  await page.close();
  console.log('Verification completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
