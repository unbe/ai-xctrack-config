import puppeteer from 'puppeteer-core';

async function testRealisticMap() {
  console.log('Connecting to browser on port 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('header', { timeout: 8000 });

  // 1. Capture realistic map preview on canvas
  const canvasMapPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/realistic_map_canvas.png';
  await page.screenshot({ path: canvasMapPath });
  console.log('✓ Saved realistic map canvas screenshot:', canvasMapPath);

  // 2. Select widget 0 (WXCAssistant)
  const widgetBox = await page.evaluate(() => {
    const el = document.querySelector('[data-widget-index="0"]');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });

  if (widgetBox) {
    await page.mouse.click(widgetBox.x, widgetBox.y);
    await new Promise((r) => setTimeout(r, 600));
  }

  // 3. Open Map Style Gallery modal
  const allButtons = await page.$$('button');
  for (const b of allButtons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text && text.includes('Browse Gallery')) {
      await b.click();
      console.log('Clicked Browse Gallery button');
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // 4. Capture screenshot of Map Style Gallery with realistic thumbnails
  const galleryPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/map_style_gallery_realistic.png';
  await page.screenshot({ path: galleryPath });
  console.log('✓ Saved realistic gallery modal screenshot:', galleryPath);

  // 5. Select HyperpilotBlack preset
  const cards = await page.$$('.fixed.inset-0 div');
  for (const c of cards) {
    const t = await page.evaluate((el) => el.textContent, c);
    if (t && t.includes('Hyperpilot-black • Dark Hillshading')) {
      await c.click();
      console.log('Selected Hyperpilot-black preset');
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 800));

  // 6. Capture canvas with Hyperpilot-black
  const hyperpilotMapPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/realistic_map_hyperpilot.png';
  await page.screenshot({ path: hyperpilotMapPath });
  console.log('✓ Saved Hyperpilot-black realistic map screenshot:', hyperpilotMapPath);

  await page.close();
  await browser.disconnect();
  console.log('Realistic map test completed successfully!');
}

testRealisticMap().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
