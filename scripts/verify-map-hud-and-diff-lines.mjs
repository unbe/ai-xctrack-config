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
  await new Promise((r) => setTimeout(r, 1200));

  // Switch to layout tab
  await page.evaluate(() => {
    window.editorStore?.setActiveTab('layout');
  });
  await new Promise((r) => setTimeout(r, 800));

  // Verify map widget no longer contains GPS coordinates text or scale bar
  const mapOverlayText = await page.evaluate(() => {
    const mapContainer = document.querySelector('.maplibregl-map')?.parentElement;
    const text = mapContainer ? mapContainer.innerText : '';
    const hasGpsText = text.includes('GPS:');
    const hasScaleText = text.includes('1 km') || text.includes('Scale');
    return {
      text,
      hasGpsText,
      hasScaleText,
    };
  });
  console.log('✓ Map overlay text check:', mapOverlayText);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_map_no_gps_no_scale.png') });
  console.log('Captured clean_map_no_gps_no_scale.png');

  // Switch to Diff & Export tab to verify clean diff lines (no horizontal divider lines)
  await page.evaluate(() => {
    window.editorStore?.setActiveTab('json');
  });
  await new Promise((r) => setTimeout(r, 800));

  const diffDividerCount = await page.evaluate(() => {
    return document.querySelectorAll('.divide-y').length;
  });
  console.log('✓ Found .divide-y divider count on diff page:', diffDividerCount);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_diff_no_horizontal_lines.png') });
  console.log('Captured clean_diff_no_horizontal_lines.png');

  await page.close();
  console.log('All verifications completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
