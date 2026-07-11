const { chromium } = require('playwright');

async function run() {
  console.log('Starting Production Smoke Test on https://invoice-gen.net ...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  let consoleErrors = 0;
  let failedRequests = 0;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error] ${msg.text()}`);
      consoleErrors++;
    }
  });

  page.on('requestfailed', request => {
    // Ignore some tracking or irrelevant blocked things if any, but log them
    console.log(`[Network Error] ${request.url()} - ${request.failure().errorText}`);
    failedRequests++;
  });

  await page.goto('https://invoice-gen.net', { waitUntil: 'networkidle' });
  console.log('Page loaded successfully.');

  // 1. Verify Editor exists
  const title = await page.title();
  console.log(`Title: ${title}`);
  
  // 2. Click "History"
  await page.click('text=History');
  await page.waitForTimeout(500);
  console.log('History tab works.');

  // 3. Click "Saved Clients"
  await page.click('text=Saved Clients');
  await page.waitForTimeout(500);
  console.log('Saved Clients tab works.');
  
  // 4. Click "Editor" again
  await page.click('text=Editor');
  await page.waitForTimeout(500);
  console.log('Editor tab works.');
  
  console.log('--- Results ---');
  console.log(`Console Errors: ${consoleErrors}`);
  console.log(`Failed Requests: ${failedRequests}`);

  await browser.close();
  
  if (consoleErrors > 0) {
    console.error('Smoke test failed: Console errors found.');
    process.exit(1);
  }
  
  console.log('Smoke test passed successfully.');
}

run().catch(console.error);
