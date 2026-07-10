const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  console.log('Navigating to app...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1000);
  
  // 1. Clean default desktop state
  await page.screenshot({ path: 'step1_clean_collapsed.png', fullPage: true });

  // 2. Expanded desktop state showing every optional field (empty)
  await page.click('text="+ Add more business details" >> visible=true');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'step2_expanded_empty.png', fullPage: true });

  // Fill data
  await page.fill('input[placeholder="Phone number"] >> visible=true', '+1 (555) 123-4567');
  await page.fill('input[placeholder="e.g. www.website.com"] >> visible=true', 'https://acme-corp.com');
  await page.fill('input[placeholder="Street address"] >> visible=true', '456 Enterprise Way');
  await page.fill('input[placeholder="Apt, suite, etc. (optional)"] >> visible=true', 'Suite 900');
  await page.fill('input[placeholder="City"] >> visible=true', 'San Francisco');
  await page.fill('input[placeholder="State or Region"] >> visible=true', 'CA');
  await page.fill('input[placeholder="Postal code"] >> visible=true', '94105');
  await page.fill('input[placeholder="Country"] >> visible=true', 'United States');
  await page.fill('input[placeholder="e.g. VAT / GST ID"] >> visible=true', 'US-987654321');
  await page.waitForTimeout(500);

  // 3. Expanded desktop state with ALL fields filled
  await page.screenshot({ path: 'step3_expanded_filled.png', fullPage: true });

  // 4. Live Preview showing the entered business information correctly.
  const previewSidebar = page.locator('.workspace-sidebar');
  await previewSidebar.screenshot({ path: 'step4_live_preview.png' });

  // 5. Collapse the additional details section, then re-expand it.
  await page.click('text="− Hide additional business details" >> visible=true');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'step5a_collapsed.png' });
  await page.click('text="+ Add more business details" >> visible=true');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'step5b_reexpanded.png', fullPage: true });

  // 6. Hard browser refresh
  await page.reload();
  await page.waitForTimeout(1000);
  await page.click('text="+ Add more business details" >> visible=true');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'step6_after_refresh.png', fullPage: true });

  // 7. Mobile UI
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5173');
  await mobilePage.waitForTimeout(1000);
  await mobilePage.click('text="+ Add more business details" >> visible=true');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'step7_mobile.png', fullPage: true });
  
  // 8. Full Invoice Preview
  page.once('dialog', async dialog => {
    await dialog.accept();
  });
  await page.click('button:has-text("Preview full invoice") >> visible=true');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'step8_full_preview_alert.png', fullPage: true });
  
  // Generate PDF
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download PDF") >> visible=true');
  const download = await downloadPromise;
  const pdfPath = path.join(__dirname, 'business_invoice.pdf');
  await download.saveAs(pdfPath);
  
  // 9. Actual generated PDF opened in a real PDF viewer
  // (PDF provided directly as an artifact since headless chrome triggers download)
  
  // 10. New Invoice Reset
  await page.click('button[aria-label="Close full preview"], button[aria-label="Close"] >> visible=true');
  await page.waitForTimeout(500);

  page.on('dialog', dialog => dialog.accept());
  await page.click('button:has-text("New invoice") >> visible=true');
  await page.waitForTimeout(1000);
  
  const addBtn = page.locator('text="+ Add more business details" >> visible=true');
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(500);
  }
  
  await page.screenshot({ path: 'step10_reset.png', fullPage: true });

  await browser.close();
  console.log('Done!');
})();
