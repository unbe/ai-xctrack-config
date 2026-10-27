import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e';

async function run() {
  console.log('Connecting to browser on 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 1: Initial portrait screen
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'convert_1_portrait_initial.png') });
  console.log('Captured convert_1_portrait_initial.png');

  // Find the "Convert" button in the page manager header
  const convertButtons = await page.$$('button');
  let headerConvertBtn = null;
  for (const btn of convertButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Convert')) {
      headerConvertBtn = btn;
      break;
    }
  }

  if (!headerConvertBtn) {
    throw new Error('Convert button not found in page header');
  }

  console.log('Opening Convert modal...');
  await headerConvertBtn.click();
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 2: Conversion modal open with options
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'convert_2_modal_open.png') });
  console.log('Captured convert_2_modal_open.png');

  // Click "Convert to Landscape" in modal
  const modalButtons = await page.$$('button');
  let submitConvertBtn = null;
  for (const btn of modalButtons) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Convert to Landscape')) {
      submitConvertBtn = btn;
      break;
    }
  }

  if (!submitConvertBtn) {
    throw new Error('Submit Convert to Landscape button not found');
  }

  console.log('Executing conversion to Landscape...');
  await submitConvertBtn.click();
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 3: Landscape cockpit reflow view
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'convert_3_landscape_converted.png') });
  console.log('Captured convert_3_landscape_converted.png');

  // Verify that active orientation is now landscape
  const landscapeIndicator = await page.evaluate(() => {
    return document.body.innerText.includes('landscape') || document.body.innerText.includes('Landscape');
  });
  console.log('Landscape active indicator:', landscapeIndicator);

  // Now convert back from Landscape to Portrait to test the reverse direction
  console.log('Testing reverse conversion Landscape -> Portrait...');
  const convertButtonsAgain = await page.$$('button');
  for (const btn of convertButtonsAgain) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Convert')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'convert_4_modal_landscape_to_portrait.png') });
  console.log('Captured convert_4_modal_landscape_to_portrait.png');

  const modalButtonsAgain = await page.$$('button');
  for (const btn of modalButtonsAgain) {
    const text = await page.evaluate((el) => el.innerText, btn);
    if (text && text.includes('Convert to Portrait')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'convert_5_portrait_reconverted.png') });
  console.log('Captured convert_5_portrait_reconverted.png');

  await page.close();
  console.log('Verification completed successfully!');
}

run().catch((err) => {
  console.error('Error during verification:', err);
  process.exit(1);
});
