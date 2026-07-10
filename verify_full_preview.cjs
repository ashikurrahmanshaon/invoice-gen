const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Track console errors
  const errors = [];
  
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  page.on('console', msg => {
    // Ignore react-pdf worker warnings if any
    if (msg.type() === 'error' && !msg.text().includes('pdf.worker.min.mjs')) {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);

  // Fill in some business details so we can see them in preview
  await page.click('text="+ Add more business details" >> visible=true');
  await page.fill('input[placeholder="Phone number"] >> visible=true', '+1 (555) 123-4567');
  await page.fill('input[placeholder="Street address"] >> visible=true', '456 Enterprise Way');
  await page.fill('input[placeholder="e.g. VAT / GST ID"] >> visible=true', 'US-987654321');
  await page.waitForTimeout(500);

  // Helper to verify canvas
  const verifyCanvas = async (pageObj) => {
    await pageObj.waitForTimeout(2000); // Wait for render
    const canvas = pageObj.locator('.react-pdf__Page__canvas');
    if (await canvas.count() === 0) throw new Error("React-PDF canvas missing. Preview not rendered.");
    
    const isVisible = await canvas.isVisible();
    if (!isVisible) throw new Error("React-PDF canvas is not visible.");

    const box = await canvas.boundingBox();
    if (!box || box.width === 0 || box.height === 0) {
      throw new Error("React-PDF canvas has zero width or height.");
    }
    
    const fallbackText = pageObj.locator('text="Preview not supported"');
    if (await fallbackText.isVisible()) {
      throw new Error("Fallback UI is visible when it should not be.");
    }
  };

  // 1. Desktop "Expand" opens modal
  console.log('Testing Desktop Expand...');
  await page.click('button:has-text("Expand") >> visible=true');
  await page.waitForTimeout(1000);
  let modalTitle = page.locator('h2#preview-title');
  if (await modalTitle.count() === 0) throw new Error("Expand did not open modal");
  
  await verifyCanvas(page);
  await page.screenshot({ path: 'full_preview_desktop_expand_canvas.png', fullPage: true });

  // Close by Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // 2. Desktop "Preview full invoice" opens modal
  console.log('Testing Desktop Preview full invoice...');
  await page.click('button:has-text("Preview full invoice") >> visible=true');
  await page.waitForTimeout(1000);
  
  await verifyCanvas(page);
  await page.screenshot({ path: 'full_preview_desktop_button_canvas.png', fullPage: true });

  // Close by Backdrop click
  await page.mouse.click(10, 10);
  await page.waitForTimeout(500);

  // 3. New Invoice reset is reflected
  console.log('Testing Reset...');
  page.once('dialog', dialog => dialog.accept());
  await page.click('button:has-text("New Invoice") >> visible=true');
  await page.waitForTimeout(1000);
  
  await page.click('button:has-text("Expand") >> visible=true');
  await page.waitForTimeout(1000);
  await verifyCanvas(page);
  await page.screenshot({ path: 'full_preview_reset_canvas.png', fullPage: true });
  
  await page.click('button[aria-label="Close"] >> visible=true');
  await page.waitForTimeout(500);

  // 4. Mobile Preview Step with Zoom Testing
  console.log('Testing Mobile Zoom...');
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5173');
  await mobilePage.waitForTimeout(1000);

  await mobilePage.click('button:has-text("Continue to Client") >> visible=true');
  await mobilePage.waitForTimeout(300);
  await mobilePage.click('button:has-text("Continue to Items") >> visible=true');
  await mobilePage.waitForTimeout(300);
  await mobilePage.click('button:has-text("Review Invoice") >> visible=true');
  await mobilePage.waitForTimeout(300);

  // Open Preview
  await mobilePage.click('button:has-text("Preview") >> visible=true');
  await mobilePage.waitForTimeout(1500);
  
  await verifyCanvas(mobilePage);
  
  // Verify modal covers viewport
  const box = await mobilePage.locator('[data-testid="full-preview-overlay"]').boundingBox();
  if (!box || box.x !== 0 || box.y !== 0 || box.width !== 375 || box.height !== 812) {
    throw new Error(`Overlay geometry is incorrect: ${JSON.stringify(box)}`);
  }

  // Screenshot 1: Default fit-page state
  await mobilePage.screenshot({ path: 'full-preview-mobile-fit.png', fullPage: false });

  // Test Zoom In
  console.log('Zooming in...');
  const zoomInBtn = mobilePage.locator('button[aria-label="Zoom in"]');
  // Click zoom in 4 times to reach 200%
  for (let i = 0; i < 4; i++) {
    await zoomInBtn.click();
    await mobilePage.waitForTimeout(200);
  }
  
  // Wait for react-pdf to re-render at new scale
  await mobilePage.waitForTimeout(1500);

  // Pan scroll to center/bottom to show it can scroll
  const scrollContainer = mobilePage.locator('.react-pdf__Page__canvas').locator('..').locator('..').locator('..');
  // Scroll right and down to prove it's scrollable
  await scrollContainer.evaluate(node => {
    node.scrollTop = 200;
    node.scrollLeft = 100;
  });
  await mobilePage.waitForTimeout(500);

  // Screenshot 2: Zoomed readable state
  await mobilePage.screenshot({ path: 'full-preview-mobile-zoomed.png', fullPage: false });

  // Test Fit / Reset
  const fitBtn = mobilePage.locator('button:has-text("Fit")');
  await fitBtn.click();
  await mobilePage.waitForTimeout(1000);
  const zoomText = await mobilePage.locator('span').filter({ hasText: /^Fit$/ }).isVisible();
  if (!zoomText) throw new Error("Fit button did not reset scale text to Fit");

  // Close and Reopen to check reset
  await mobilePage.click('button[aria-label="Close"] >> visible=true');
  await mobilePage.waitForTimeout(500);
  await mobilePage.click('button:has-text("Preview") >> visible=true');
  await mobilePage.waitForTimeout(1500);
  const zoomTextAfterReopen = await mobilePage.locator('span').filter({ hasText: /^Fit$/ }).isVisible();
  if (!zoomTextAfterReopen) throw new Error("Reopening modal did not reset scale text to Fit");

  await mobilePage.close();

  // 5. Forced Fallback Test
  console.log('Testing Forced Fallback...');
  const fallbackContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  // Intercept the worker script to simulate a failure
  await fallbackContext.route('**/*pdf.worker.min.mjs*', route => route.abort());
  const fallbackPage = await fallbackContext.newPage();
  
  await fallbackPage.goto('http://localhost:5173');
  await fallbackPage.waitForTimeout(1000);
  
  await fallbackPage.click('button:has-text("Expand") >> visible=true');
  await fallbackPage.waitForTimeout(2000);
  
  const fallbackText = fallbackPage.locator('text="Preview not supported"');
  if (!(await fallbackText.isVisible())) {
    throw new Error("Forced fallback UI is not visible when worker is blocked.");
  }
  await fallbackPage.screenshot({ path: 'full_preview_forced_fallback.png', fullPage: true });

  if (errors.length > 0) {
    console.error("Errors found:", errors);
    throw new Error("Console errors detected");
  }

  await browser.close();
  console.log('Done!');
})();
