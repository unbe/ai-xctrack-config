import puppeteer from 'puppeteer-core';
import fs from 'fs';
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

  // 1. Verify left sidebar rail has only Pages and Widgets (no duplicate Layers)
  const leftRailButtons = await page.evaluate(() => {
    const rail = document.querySelector('.w-12');
    if (!rail) return [];
    return Array.from(rail.querySelectorAll('button')).map((b) => b.getAttribute('title') || b.innerText);
  });
  console.log('Left rail buttons:', leftRailButtons);

  // 2. Clear any widget selection so the unified Widgets & Layers list shows on the right
  await page.evaluate(() => {
    const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(escEvent);
  });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 1: Unified Widgets & Layers on the right
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'unified_1_layers_on_right.png') });
  console.log('Captured unified_1_layers_on_right.png');

  // Verify unified panel text on right
  const rightPanelTitle = await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('span, h3, div'));
    const h = headers.find((el) => el.innerText && el.innerText.includes('Widgets & Layers'));
    return h ? h.innerText : null;
  });
  console.log('✓ Right panel title:', rightPanelTitle);

  // 3. Click first widget in the list on the right to open inspector
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[class*="cursor-pointer"]'));
    const firstWidget = cards.find((c) => c.innerText && c.innerText.includes('#1'));
    if (firstWidget) firstWidget.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 2: Inspector with layer controls and "Widgets" back button
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'unified_2_inspector_layer_controls.png') });
  console.log('Captured unified_2_inspector_layer_controls.png');

  // 4. Switch to Preferences & Backup tab
  console.log('Switching to Preferences & Backup tab...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const prefTab = buttons.find((b) => b.innerText && b.innerText.includes('Preferences & Backup'));
    if (prefTab) prefTab.click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Screenshot 3: Preferences page showing Takeoff Speed in km/h
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'unified_3_takeoff_speed_kmh.png') });
  console.log('Captured unified_3_takeoff_speed_kmh.png');

  // Check Takeoff Speed input value
  const takeoffSpeedInfo = await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('label'));
    const takeoffLabel = labels.find((l) => l.innerText && l.innerText.includes('Takeoff Speed'));
    if (!takeoffLabel) return null;
    const container = takeoffLabel.closest('div');
    const input = container?.parentElement?.querySelector('input[type="number"]') || container?.querySelector('input');
    return {
      label: takeoffLabel.innerText,
      val: input ? input.value : null,
      parentText: container?.parentElement?.innerText,
    };
  });
  console.log('✓ Takeoff speed field info:', takeoffSpeedInfo);

  await page.close();
  console.log('Verification script completed successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
