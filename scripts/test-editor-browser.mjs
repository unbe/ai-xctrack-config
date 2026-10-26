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

  // 1. Switch to Preferences & Backup tab
  console.log('Clicking "Preferences & Backup" tab...');
  const buttons = await page.$$('header button');
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Preferences')) {
      await btn.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  // 2. Click "Acoustic Vario & Sounds" subtab
  console.log('Clicking "Acoustic Vario & Sounds" tab...');
  const subtabButtons = await page.$$('button');
  for (const btn of subtabButtons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Acoustic Vario')) {
      await btn.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 600));

  const varioScreenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/preferences_preview.png';
  await page.screenshot({ path: varioScreenshotPath });
  console.log('Saved vario preferences screenshot to:', varioScreenshotPath);

  // 3. Switch back to "Screen Layouts" and select a widget to keep the main editor preview up to date
  for (const btn of buttons) {
    const text = await page.evaluate((el) => el.textContent, btn);
    if (text && text.includes('Screen Layouts')) {
      await btn.click();
      break;
    }
  }
  await new Promise((r) => setTimeout(r, 600));

  await page.click('[data-widget-index="0"]');
  await new Promise((r) => setTimeout(r, 400));

  const editorScreenshotPath = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/editor_preview.png';
  await page.screenshot({ path: editorScreenshotPath });
  console.log('Saved editor preview screenshot to:', editorScreenshotPath);

  await page.close();
  await browser.disconnect();
}

testEditor().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
