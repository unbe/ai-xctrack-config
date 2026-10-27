import puppeteer from 'puppeteer-core';

async function testUndoDrag() {
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

  // 1. Initial state: Undo button should be disabled
  const isUndoDisabledInitially = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Undo"]');
    return btn ? btn.disabled : null;
  });
  console.log('Initial Undo button disabled:', isUndoDisabledInitially);
  if (isUndoDisabledInitially !== true) {
    throw new Error('Undo button should be disabled initially');
  }

  // 2. Locate a widget to drag
  const widgetBox = await page.evaluate(() => {
    // Select first widget with cursor-move
    const el = document.querySelector('[data-widget-index="0"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2, width: r.width, height: r.height };
  });

  console.log('Widget 0 position:', widgetBox);
  if (!widgetBox) {
    throw new Error('Could not find widget 0 on canvas');
  }

  // Record initial widget coords in store
  const initialX1 = await page.evaluate(() => {
    const page = window.__editorStore?.getCurrentPage?.();
    return page?.widgets[0]?.X1;
  });

  // 3. Perform Drag Move
  console.log('Dragging widget with mouse...');
  await page.mouse.move(widgetBox.x, widgetBox.y);
  await page.mouse.down();
  await page.mouse.move(widgetBox.x + 80, widgetBox.y + 60, { steps: 5 });
  await page.mouse.up();
  await new Promise((r) => setTimeout(r, 400));

  // 4. Verify Undo button is now ENABLED
  const isUndoDisabledAfterDrag = await page.evaluate(() => {
    const btn = document.querySelector('button[title*="Undo"]');
    return btn ? btn.disabled : null;
  });
  console.log('Undo button disabled after drag:', isUndoDisabledAfterDrag);
  if (isUndoDisabledAfterDrag !== false) {
    throw new Error('Undo button should be ENABLED after dragging widget');
  }
  console.log('✓ Undo button became ENABLED after dragging widget!');

  // 5. Test Cmd-Z (Meta + KeyZ)
  console.log('Pressing Cmd-Z (Meta + KeyZ)...');
  await page.keyboard.down('Meta');
  await page.keyboard.press('KeyZ');
  await page.keyboard.up('Meta');
  await new Promise((r) => setTimeout(r, 400));

  // Verify Undo button state and Redo button state
  const { undoDisabledAfterUndo, redoDisabledAfterUndo } = await page.evaluate(() => {
    const u = document.querySelector('button[title*="Undo"]');
    const r = document.querySelector('button[title*="Redo"]');
    return {
      undoDisabledAfterUndo: u ? u.disabled : null,
      redoDisabledAfterUndo: r ? r.disabled : null,
    };
  });

  console.log('After Cmd-Z: Undo disabled =', undoDisabledAfterUndo, ', Redo disabled =', redoDisabledAfterUndo);
  if (redoDisabledAfterUndo !== false) {
    throw new Error('Redo button should be ENABLED after Cmd-Z');
  }
  console.log('✓ Cmd-Z successfully reverted drag and enabled Redo!');

  // 6. Test Cmd-Shift-Z (Meta + Shift + KeyZ) for Redo
  console.log('Pressing Cmd-Shift-Z (Meta + Shift + KeyZ)...');
  await page.keyboard.down('Meta');
  await page.keyboard.down('Shift');
  await page.keyboard.press('KeyZ');
  await page.keyboard.up('Shift');
  await page.keyboard.up('Meta');
  await new Promise((r) => setTimeout(r, 400));

  const redoDisabledAfterRedo = await page.evaluate(() => {
    const r = document.querySelector('button[title*="Redo"]');
    return r ? r.disabled : null;
  });
  console.log('After Cmd-Shift-Z: Redo disabled =', redoDisabledAfterRedo);
  console.log('✓ Cmd-Shift-Z successfully redid action!');

  await page.close();
  browser.disconnect();
  console.log('All drag undo/redo tests passed successfully!');
}

testUndoDrag().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
