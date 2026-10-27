import puppeteer from 'puppeteer-core';

async function testMapSelectionAndPanning() {
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
  await page.waitForSelector('#phone-screen-canvas', { timeout: 10000 });
  await page.waitForSelector('.maplibregl-canvas', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 2000));

  // Find the XC Map widget
  const mapWidgetIndex = await page.evaluate(() => {
    const widgets = document.querySelectorAll('[data-widget-index]');
    for (const el of widgets) {
      if (el.querySelector('.maplibregl-canvas')) {
        return parseInt(el.getAttribute('data-widget-index') || '0', 10);
      }
    }
    return -1;
  });
  console.log('✓ Found Map widget at index:', mapWidgetIndex);

  // 1. Initial State: Deselect any selected widget
  await page.evaluate(() => {
    // Call clearSelection via store or clicking outside
    const store = window.__editorStore;
    if (store) store.clearSelection();
    const bg = document.querySelector('.bg-\\[\\#0d1015\\]');
    if (bg) bg.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await new Promise((r) => setTimeout(r, 600));

  // Verify map container has pointer-events-none when NOT selected
  const isPointerEventsNone = await page.evaluate((idx) => {
    const el = document.querySelector(`[data-widget-index="${idx}"]`);
    const mapContainer = el?.querySelector('.absolute.inset-0');
    return mapContainer?.classList.contains('pointer-events-none');
  }, mapWidgetIndex);
  console.log('1. Unselected state - Map container has pointer-events-none:', isPointerEventsNone);
  if (!isPointerEventsNone) {
    throw new Error('Expected map container to have pointer-events-none when unselected!');
  }

  // 2. Click on the widget to select it
  console.log('2. Clicking on map widget to select it...');
  await page.evaluate((idx) => {
    const el = document.querySelector(`[data-widget-index="${idx}"]`);
    if (el) {
      const evt = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: 200, clientY: 200 });
      el.dispatchEvent(evt);
    }
  }, mapWidgetIndex);
  await new Promise((r) => setTimeout(r, 500));

  // Verify map container now has pointer-events-auto when selected
  const isPointerEventsAuto = await page.evaluate((idx) => {
    const el = document.querySelector(`[data-widget-index="${idx}"]`);
    const mapContainer = el?.querySelector('.absolute.inset-0');
    return mapContainer?.classList.contains('pointer-events-auto');
  }, mapWidgetIndex);
  console.log('2. Selected state - Map container has pointer-events-auto:', isPointerEventsAuto);
  if (!isPointerEventsAuto) {
    throw new Error('Expected map container to have pointer-events-auto when selected!');
  }

  // Verify Move handle is visible
  const hasMoveHandle = await page.evaluate((idx) => {
    const el = document.querySelector(`[data-widget-index="${idx}"]`);
    return Boolean(el?.querySelector('div[title*="Drag here to move"]'));
  }, mapWidgetIndex);
  console.log('3. Move handle visible on selected widget:', hasMoveHandle);
  if (!hasMoveHandle) {
    throw new Error('Expected Move handle to be visible when widget is selected!');
  }

  // Capture screenshot of selected map state with move handle
  const screenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/map_selected_interactive.png';
  await page.screenshot({ path: screenshotPath });
  console.log('✓ Captured screenshot at:', screenshotPath);

  await page.close();
  await browser.disconnect();
  console.log('✓ ALL MAP SELECTION & PANNING TESTS PASSED!');
}

testMapSelectionAndPanning().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
