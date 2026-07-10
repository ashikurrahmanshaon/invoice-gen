const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to app...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    console.log('Checking for Inject Test Logo button...');
    const hasInjectBtn = await page.evaluate(() => document.body.innerHTML.includes('Inject Test Logo'));
    if (hasInjectBtn) {
      throw new Error('Found "Inject Test Logo" button!');
    }
    
    console.log('Uploading valid-logo1.png...');
    // The file input is hidden but Playwright handles it via locator
    const fileChooserPromise = page.waitForEvent('filechooser');
    // Clicking the label
    await page.locator('.logo-hover-overlay label, label:has-text("Add logo")').first().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles('valid-logo1.png');

    console.log('Waiting for logo to render in desktop form...');
    await page.waitForTimeout(1500); // wait for image process and 1000ms auto-save debounce
    const desktopLogoSrc = await page.evaluate(() => {
      const img = document.querySelector('img[alt="Logo"]');
      return img ? img.src : null;
    });
    
    if (!desktopLogoSrc || desktopLogoSrc.length < 100 || !desktopLogoSrc.startsWith('data:image/png;base64,')) {
      throw new Error('Desktop logo is missing or invalid base64');
    }
    console.log('Desktop logo successfully processed and rendered!');

    console.log('Refreshing page to check persistence...');
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const persistedLogoSrc = await page.evaluate(() => {
      const img = document.querySelector('img[alt="Logo"]');
      return img ? img.src : null;
    });
    if (!persistedLogoSrc || persistedLogoSrc.length < 100) {
      throw new Error('Logo did not persist after refresh!');
    }
    console.log('Logo persisted successfully!');

    console.log('Replacing logo with valid-logo2.png...');
    const fileChooserPromise2 = page.waitForEvent('filechooser');
    await page.locator('label').filter({ hasText: '' }).locator('input[type="file"]').first().evaluate(node => node.click());
    const fileChooser2 = await fileChooserPromise2;
    await fileChooser2.setFiles('valid-logo2.png');
    
    await page.waitForTimeout(500);
    const replacedLogoSrc = await page.evaluate(() => document.querySelector('img[alt="Logo"]').src);
    if (replacedLogoSrc === persistedLogoSrc) {
      throw new Error('Logo was not replaced!');
    }
    console.log('Logo replaced successfully!');

    console.log('Removing logo...');
    await page.locator('button').filter({ has: page.locator('svg') }).first().click(); // Trash icon in overlay
    await page.waitForTimeout(200);
    const hasAddLogo = await page.evaluate(() => document.body.innerHTML.includes('Add logo'));
    if (!hasAddLogo) {
      throw new Error('Add logo state not restored!');
    }
    console.log('Add logo state restored successfully!');

    console.log('Uploading again to test New Invoice...');
    const fileChooserPromise3 = page.waitForEvent('filechooser');
    await page.locator('label:has-text("Add logo")').first().click();
    const fileChooser3 = await fileChooserPromise3;
    await fileChooser3.setFiles('valid-logo1.png');
    await page.waitForTimeout(500);
    
    console.log('Clicking New Invoice...');
    await page.locator('button:has-text("New Invoice")').click();
    await page.waitForTimeout(200);
    const isCleared = await page.evaluate(() => !document.querySelector('img[alt="Logo"]'));
    if (!isCleared) {
      throw new Error('New Invoice did not clear the logo!');
    }
    console.log('New Invoice cleared logo successfully!');
    
    console.log('Uploading again to test PDF...');
    const fileChooserPromise4 = page.waitForEvent('filechooser');
    await page.locator('label:has-text("Add logo")').first().click();
    const fileChooser4 = await fileChooserPromise4;
    await fileChooser4.setFiles('valid-logo1.png');
    await page.waitForTimeout(500);

    console.log('Generating PDF...');
    await page.evaluate(() => window.__TESTING_PREVIEW__ = true);
    await page.locator('button:has-text("Download PDF")').click();
    
    await page.waitForTimeout(2000);
    const blobUrl = await page.evaluate(() => window.__PDF_BLOB_URL__);
    if (!blobUrl || !blobUrl.startsWith('blob:')) {
      throw new Error('PDF blob URL not found or invalid: ' + blobUrl);
    }
    console.log('PDF generated successfully with Blob URL:', blobUrl);

    console.log('ALL VERIFICATIONS PASSED!');
  } catch (err) {
    console.error('VERIFICATION FAILED:', err.message);
  } finally {
    await browser.close();
  }
})();
