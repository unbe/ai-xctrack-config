import puppeteer from 'puppeteer-core';

async function testEditor() {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  page.on('console', (msg) => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', (err) => console.error('PAGE ERROR:', err));

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });

  await page.waitForSelector('header', { timeout: 8000 });

  // Click on Widget Palette tab
  console.log('Clicking Widget Palette tab...');
  const paletteBtn = await page.$('button[title="Widget Palette"]');
  if (paletteBtn) {
    await paletteBtn.click();
    await new Promise((r) => setTimeout(r, 400));
  }

  // Click on speed widget on canvas (index 1)
  console.log('Clicking widget 1 (Speed)...');
  await page.click('[data-widget-index="1"]');
  await new Promise((r) => setTimeout(r, 400));

  const screenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/editor_preview.png';
  await page.screenshot({ path: screenshotPath });
  console.log('Saved screenshot to:', screenshotPath);

  await page.close();
  await browser.disconnect();
}

testEditor().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
