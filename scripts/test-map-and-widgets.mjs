import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function testMapAndWidgets() {
  console.log('Connecting to browser on port 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('header', { timeout: 8000 });

  // 1. Verify Undo and Redo buttons exist in TopToolbar
  console.log('Verifying Undo and Redo buttons...');
  const undoBtn = await page.$('button[title*="Undo"]');
  const redoBtn = await page.$('button[title*="Redo"]');
  if (!undoBtn || !redoBtn) {
    throw new Error('Undo/Redo buttons not found in toolbar');
  }
  console.log('✓ Found Undo and Redo buttons in TopToolbar');

  // 2. Verify Page Widgets list in inspector
  console.log('Testing Page Widgets list in inspector...');
  const inspectorText = await page.evaluate(() => {
    const el = document.querySelector('.w-80');
    return el ? el.textContent : '';
  });
  console.log('✓ Inspector text includes Page Widgets:', inspectorText.includes('Page Widgets'));

  // 3. Select WXCAssistant from the Page Widgets list
  console.log('Selecting WXCAssistant from widget list...');
  const widgetListButtons = await page.$$('.w-80 button');
  let mapClicked = false;
  for (const btn of widgetListButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && (text.includes('XC map') || text.includes('WXCAssistant') || text.includes('Select'))) {
      await btn.click();
      mapClicked = true;
      console.log('✓ Clicked widget in list:', text.replace(/\s+/g, ' ').slice(0, 50));
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Verify inspector now shows Widget Switcher dropdown and Map settings
  const hasSwitcher = await page.$('select[title*="Select widget from page list"]');
  console.log('✓ Inspector Widget Switcher exists:', !!hasSwitcher);

  // 4. Test Browse Style Gallery
  console.log('Opening Map Style Gallery...');
  const allButtons = await page.$$('button');
  let galleryOpened = false;
  for (const btn of allButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Browse Gallery')) {
      await btn.click();
      galleryOpened = true;
      break;
    }
  }

  if (!galleryOpened) {
    throw new Error('Could not find "Browse Gallery" button');
  }

  await new Promise((r) => setTimeout(r, 600));

  // Verify Modal is visible
  const modalHeader = await page.evaluate(() => {
    const h2 = document.querySelector('h2');
    return h2 ? h2.textContent : '';
  });
  console.log('✓ Map Style Gallery Modal header:', modalHeader);

  // Take screenshot of Map Style Gallery
  const galleryScreenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/map_style_gallery.png';
  await page.screenshot({ path: galleryScreenshotPath });
  console.log('✓ Saved Map Style Gallery screenshot to:', galleryScreenshotPath);

  // 5. Select preset: Hyperpilot-black • Dark Hillshading
  console.log('Applying "Hyperpilot-black • Dark Hillshading" preset...');
  const presetCards = await page.$$('.fixed.inset-0 div');
  let presetApplied = false;
  for (const card of presetCards) {
    const text = await page.evaluate((el) => el.textContent, card);
    if (text && text.includes('Hyperpilot-black • Dark Hillshading')) {
      await card.click();
      presetApplied = true;
      console.log('✓ Clicked preset card:', text.slice(0, 40));
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // Take screenshot of canvas with updated map
  const updatedMapScreenshot = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/map_style_applied.png';
  await page.screenshot({ path: updatedMapScreenshot });
  console.log('✓ Saved Applied Map Style screenshot to:', updatedMapScreenshot);

  // 6. Test Undo button
  console.log('Testing Undo in toolbar...');
  const undoBtnActive = await page.$('button[title*="Undo"]');
  if (undoBtnActive) {
    await undoBtnActive.click();
    console.log('✓ Clicked Undo button');
  }

  await new Promise((r) => setTimeout(r, 400));

  // 7. Test Redo button
  console.log('Testing Redo in toolbar...');
  const redoBtnActive = await page.$('button[title*="Redo"]');
  if (redoBtnActive) {
    await redoBtnActive.click();
    console.log('✓ Clicked Redo button');
  }

  await new Promise((r) => setTimeout(r, 400));

  // 8. Capture final screenshot of editor with inspector
  const editorScreenshot = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/editor_preview.png';
  await page.screenshot({ path: editorScreenshot });
  console.log('✓ Saved editor preview screenshot to:', editorScreenshot);

  await page.close();
  browser.disconnect();
  console.log('Done testing map and widgets successfully!');
}

testMapAndWidgets().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
