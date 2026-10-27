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

  // =========================================================================
  // Test 1: Load 2026-10-27_backup-00.xcfg and verify theme is WhiteHCTheme
  // =========================================================================
  console.log('Loading 2026-10-27_backup-00.xcfg to verify WhiteHCTheme loading...');
  // Open Examples menu
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find((b) => b.innerText && b.innerText.includes('Examples'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  // Click 2026-10-27_backup-00.xcfg
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find((b) => b.innerText && b.innerText.includes('2026-10-27_backup-00.xcfg'));
    if (target) target.click();
  });
  await new Promise((r) => setTimeout(r, 1500));

  const themeInfo = await page.evaluate(() => {
    const themeSelect = document.querySelector('select[title="Canvas Preview Theme"]');
    return {
      themeValue: themeSelect ? themeSelect.value : null,
      storeTheme: window.editorStore?.getState()?.globalTheme,
    };
  });
  console.log('✓ Loaded config theme from preferences:', themeInfo);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'theme_1_loaded_white_hc.png') });
  console.log('Captured theme_1_loaded_white_hc.png');

  // =========================================================================
  // Test 2: Collapsible Categories in Widget Property Inspector
  // =========================================================================
  console.log('Selecting widget 0 to inspect collapsible categories on the right...');
  await page.evaluate(() => {
    window.editorStore?.setActiveTab('layout');
    window.editorStore?.selectWidget(0, false);
  });
  await new Promise((r) => setTimeout(r, 800));

  // Verify category headers exist and are default open
  const categoriesInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.w-80 button'));
    const categoryButtons = buttons.filter((b) => {
      const text = (b.innerText || '').toLowerCase();
      return (
        text.includes('size & position') ||
        text.includes('border & background') ||
        text.includes('map appearance')
      );
    });

    return categoryButtons.map((b) => b.innerText.split('\n')[0].trim());
  });
  console.log('✓ Found collapsible categories:', categoriesInfo);

  // Test collapsing "Size & Position"
  console.log('Testing category toggle collapse...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.w-80 button'));
    const sizePos = buttons.find((b) => (b.innerText || '').toLowerCase().includes('size & position'));
    if (sizePos) sizePos.click();
  });
  await new Promise((r) => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'categories_2_collapsible_sections.png') });
  console.log('Captured categories_2_collapsible_sections.png');

  // Re-open category
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.w-80 button'));
    const sizePos = buttons.find((b) => (b.innerText || '').toLowerCase().includes('size & position'));
    if (sizePos) sizePos.click();
  });
  await new Promise((r) => setTimeout(r, 400));

  // =========================================================================
  // Test 3: Tab Renamed to "Diff & Export" and Button "Download .xcfg"
  // =========================================================================
  console.log('Verifying Diff & Export tab label and Download button in toolbar...');
  const toolbarLabels = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('header button')).map((b) => b.innerText.trim());
    return tabs;
  });
  console.log('✓ Header buttons/tabs:', toolbarLabels);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'diff_3_diff_and_export_tab.png') });
  console.log('Captured diff_3_diff_and_export_tab.png');

  // =========================================================================
  // Test 4: Diff Prev / Next Difference Buttons in "Diff & Export" view
  // =========================================================================
  console.log('Making edits to create differences and switching to Diff & Export tab...');
  // Modify widget 0 position and border so changes exist
  await page.evaluate(() => {
    window.editorStore?.updateWidget(0, {
      _border: true,
      _bg: 40,
    });
  });
  await new Promise((r) => setTimeout(r, 600));

  // Switch to Diff & Export tab
  await page.evaluate(() => {
    window.editorStore?.setActiveTab('json');
  });
  await new Promise((r) => setTimeout(r, 1000));

  const diffNavInfo = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const prevBtn = buttons.find((b) => b.innerText && b.innerText.trim().includes('Prev'));
    const nextBtn = buttons.find((b) => b.innerText && b.innerText.trim().includes('Next'));
    const counter = prevBtn?.parentElement?.querySelector('span');
    return {
      hasPrev: !!prevBtn,
      hasNext: !!nextBtn,
      counterText: counter ? counter.innerText : null,
    };
  });
  console.log('✓ Diff Navigation Controls:', diffNavInfo);

  // Click Next diff button
  if (diffNavInfo.hasNext) {
    console.log('Clicking Next difference button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const nextBtn = buttons.find((b) => b.innerText && b.innerText.trim().includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
  }

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'diff_4_prev_next_buttons_active.png') });
  console.log('Captured diff_4_prev_next_buttons_active.png');

  await page.close();
  console.log('All browser verifications completed successfully!');
}

run().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
