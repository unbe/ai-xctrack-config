import puppeteer from 'puppeteer-core';

async function testRealMapLibre() {
  console.log('Connecting to browser on port 9222...');
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();
  const errors = [];
  const status400s = [];
  const tilesLoaded = { vector: 0, dem: 0, worker: 0 };

  page.on('console', (msg) => {
    const text = msg.text();
    console.log('PAGE LOG:', text);
    if (text.includes('Worker failed to load')) {
      errors.push(text);
    }
  });
  page.on('pageerror', (err) => {
    console.error('PAGE ERROR:', err);
    errors.push(err.message);
  });
  page.on('requestfailed', (req) => {
    console.error('REQUEST FAILED:', req.url(), req.failure()?.errorText);
    errors.push(`${req.url()} failed: ${req.failure()?.errorText}`);
  });
  page.on('response', (res) => {
    const url = res.url();
    if (res.status() >= 400) {
      console.error('RESPONSE >= 400:', res.status(), url);
      status400s.push({ status: res.status(), url });
    }
    if (url.includes('.pbf')) tilesLoaded.vector++;
    if (url.includes('elevation-tiles-prod')) tilesLoaded.dem++;
    if (url.includes('maplibre-gl-worker')) tilesLoaded.worker++;
  });

  console.log('Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await page.waitForSelector('header', { timeout: 8000 });

  // Wait for MapLibre canvas to mount and render
  console.log('Waiting for MapLibre canvas...');
  await page.waitForSelector('.maplibregl-canvas', { timeout: 10000 });
  console.log('✓ Found .maplibregl-canvas element in DOM!');

  // Wait 4 seconds for tiles to load and render onto WebGL surface
  await new Promise((r) => setTimeout(r, 4000));

  console.log('Tiles loaded stats:', tilesLoaded);
  if (errors.length > 0 || status400s.length > 0) {
    throw new Error(`Encountered errors: ${errors.length} errors, ${status400s.length} 404s/failed requests`);
  }

  // Capture screenshot of real map rendered in canvas
  const realMapScreenshot = '/home/artem.guest/.gemini/antigravity-cli/brain/33708484-59c7-457a-b870-40bb8416630e/real_maplibre_canvas.png';
  await page.screenshot({ path: realMapScreenshot });
  console.log('✓ Saved real MapLibre screenshot to:', realMapScreenshot);

  await page.close();
  await browser.disconnect();
  console.log('✓ Done testing Real MapLibre successfully with 0 errors and 0 404s!');
}

testRealMapLibre().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
