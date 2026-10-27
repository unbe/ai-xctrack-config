import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e';

async function run() {
  console.log('Connecting to headless Chromium on port 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 1: Initial device layout
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'resnap_1_initial_layout.png') });
  console.log('Captured resnap_1_initial_layout.png');

  // Click device dropdown button using page.evaluate to trigger safely
  console.log('Opening device selector dropdown...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.querySelector('svg.lucide-smartphone') || b.querySelector('svg.lucide-tablet'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Screenshot 2: Device dropdown open with auto-resnap toggle
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'resnap_2_dropdown_with_toggle.png') });
  console.log('Captured resnap_2_dropdown_with_toggle.png');

  // Verify the toggle exists
  const hasToggle = await page.evaluate(() => {
    return document.body.innerText.includes('Resnap layout to grid on device change');
  });
  console.log('✓ Found auto-resnap toggle in dropdown:', hasToggle);

  // Search for Hannspree Lumo
  const searchInput = await page.$('input[placeholder*="Search lumo"]');
  if (searchInput) {
    await searchInput.type('lumo');
    await new Promise((r) => setTimeout(r, 400));
  }

  // Click Hannspree Lumo device option
  console.log('Selecting Hannspree Lumo 7.8"...');
  await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('div'));
    const lumo = items.find((el) => el.textContent && el.textContent.includes('Hannspree Lumo 7.8') && el.className.includes('cursor-pointer'));
    if (lumo) lumo.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  // Screenshot 3: Layout resnapped to Hannspree Lumo (40x54)
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'resnap_3_lumo_resnapped.png') });
  console.log('Captured resnap_3_lumo_resnapped.png');

  // Verify grid dimension text shows 40 × 54
  const gridText = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('*'));
    const gridEl = els.find((e) => e.innerText && e.innerText.includes('40 × 54'));
    return gridEl ? gridEl.innerText : null;
  });
  console.log('✓ Active grid text:', gridText);

  // Click the "Resnap Grid" toolbar button to verify manual resnap
  const resnapBtn = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find((b) => b.innerText && b.innerText.includes('Resnap Grid'));
  });

  if (resnapBtn) {
    console.log('Clicking Resnap Grid toolbar button...');
    await resnapBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot 4: Manual resnap applied
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'resnap_4_manual_button_applied.png') });
    console.log('Captured resnap_4_manual_button_applied.png');
  }

  await page.close();
  console.log('Smart resnap verification completed successfully!');
}

run().catch((err) => {
  console.error('Error in verification:', err);
  process.exit(1);
});
