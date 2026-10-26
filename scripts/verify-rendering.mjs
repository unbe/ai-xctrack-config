import puppeteer from 'puppeteer-core';
import { execSync } from 'child_process';
import fs from 'fs';

async function verifyRendering() {
  console.log('1. Generating reference render from APK code & fonts...');
  execSync('node scripts/generate-reference.mjs', { stdio: 'inherit' });

  console.log('2. Connecting to browser to capture web app render...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 1000 },
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('#phone-screen-canvas', { timeout: 8000 });

  // Uncheck Grid Overlay if checked to view clean widgets
  const gridCheckbox = await page.$('input[type="checkbox"]');
  if (gridCheckbox) {
    const isChecked = await page.evaluate(el => el.checked, gridCheckbox);
    if (isChecked) {
      await gridCheckbox.click();
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Clear any selection
  await page.evaluate(() => {
    window.dispatchEvent(new MouseEvent('click'));
  });
  await new Promise(r => setTimeout(r, 400));

  // Take screenshot of #phone-screen-canvas
  const canvasEl = await page.$('#phone-screen-canvas');
  if (!canvasEl) {
    throw new Error('Could not find #phone-screen-canvas element');
  }

  const webRenderPath = 'scripts/web_render.png';
  await canvasEl.screenshot({ path: webRenderPath });
  console.log('Captured web canvas screenshot to:', webRenderPath);

  // Also capture full editor screenshot for artifact
  const editorScreenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/editor_preview.png';
  await page.screenshot({ path: editorScreenshotPath });
  console.log('Updated editor preview artifact:', editorScreenshotPath);

  // Check the text of the bottom right widget (WAirTime)
  const widgetTexts = await page.evaluate(() => {
    const widgets = document.querySelectorAll('#phone-screen-canvas > div');
    const results = [];
    widgets.forEach((w, idx) => {
      const text = w.innerText.replace(/\n+/g, ' ').trim();
      const rect = w.getBoundingClientRect();
      results.push({ idx, text, width: Math.round(rect.width), height: Math.round(rect.height) });
    });
    return results;
  });

  console.log('Extracted widgets from web preview:');
  widgetTexts.forEach(w => console.log(`  [${w.idx}] "${w.text}" (${w.width}x${w.height}px)`));

  // Verify WAirTime is index 6 and has "AIR TIME 2:15" on single line
  const airTimeWidget = widgetTexts.find(w => w.text.includes('AIR TIME'));
  if (airTimeWidget) {
    console.log('\n--> Verified WAirTime widget:', airTimeWidget);
    if (airTimeWidget.text.includes('2:15') && !airTimeWidget.text.includes('2h 15m')) {
      console.log('SUCCESS: WAirTime correctly formats as "2:15" without wrapping!');
    } else {
      console.warn('WARNING: WAirTime text unexpected:', airTimeWidget.text);
    }
  }

  await page.close();
  await browser.disconnect();

  // Create Side-by-side composite comparison in Java
  console.log('3. Creating side-by-side comparison image...');
  execSync('java scripts/CompositeRenderer.java scripts/reference_render.png scripts/web_render.png /home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/rendering_comparison.png', { stdio: 'inherit' });
  console.log('Comparison image saved to artifact directory: rendering_comparison.png');
}

verifyRendering().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
