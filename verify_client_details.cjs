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

  const clientSection = page.locator('div').filter({ has: page.locator('h3:has-text("Client details")') }).first();
  
  // 1. Clean default desktop state
  await page.screenshot({ path: 'client_step1_clean_collapsed.png', fullPage: true });

  // 2. Expanded desktop state showing every optional field (empty)
  await clientSection.locator('text="+ Add client details"').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'client_step2_expanded_empty.png', fullPage: true });

  // Fill data in client section
  await clientSection.locator('input[placeholder="Client phone number"]').fill('+1 (555) 987-6543');
  await clientSection.locator('input[placeholder="Street address"]').fill('123 Client St');
  await clientSection.locator('input[placeholder="Apt, suite, etc. (optional)"]').fill('Apt 4B');
  await clientSection.locator('input[placeholder="City"]').fill('New York');
  await clientSection.locator('input[placeholder="State or Region"]').fill('NY');
  await clientSection.locator('input[placeholder="Postal code"]').fill('10001');
  await clientSection.locator('input[placeholder="Country"]').fill('United States');
  await clientSection.locator('input[placeholder="e.g. VAT / GST ID"]').fill('US-123456789');
  await page.waitForTimeout(500);

  // 3. Expanded desktop state with ALL fields filled
  await page.screenshot({ path: 'client_step3_expanded_filled.png', fullPage: true });

  // 4. Live Preview showing the entered client information correctly.
  const previewSidebar = page.locator('.workspace-sidebar');
  await previewSidebar.screenshot({ path: 'client_step4_live_preview.png' });

  // 5. Full Invoice Preview (desktop)
  await page.click('button:has-text("Preview full invoice") >> visible=true');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'client_step5_full_preview.png', fullPage: true });
  await page.click('button[aria-label="Close"] >> visible=true');
  await page.waitForTimeout(500);

  // 6. Hard browser refresh
  await page.reload();
  await page.waitForTimeout(1000);
  const refreshedClientSection = page.locator('div').filter({ has: page.locator('h3:has-text("Client details")') }).first();
  await refreshedClientSection.locator('text="+ Add client details"').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'client_step6_after_refresh.png', fullPage: true });

  // 7. Mobile UI
  const mobilePage = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await mobilePage.goto('http://localhost:5173');
  await mobilePage.waitForTimeout(1000);
  // Navigate to Client Step
  await mobilePage.click('button:has-text("Continue to Client")');
  await mobilePage.waitForTimeout(500);
  await mobilePage.click('text="+ Add client details" >> visible=true');
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'client_step7_mobile.png', fullPage: false });
  
  // Generate PDF
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("PDF") >> visible=true');
  const download = await downloadPromise;
  const pdfPath = path.join(__dirname, 'client_invoice.pdf');
  await download.saveAs(pdfPath);
  
  // Close full preview if it opened
  const closeBtn = page.locator('button[aria-label="Close full preview"], button[aria-label="Close"] >> visible=true');
  if (await closeBtn.count() > 0) {
    await closeBtn.first().click();
    await page.waitForTimeout(500);
  }

  // 10. New Invoice Reset
  page.on('dialog', dialog => dialog.accept());
  await page.click('button:has-text("New invoice") >> visible=true');
  await page.waitForTimeout(1000);
  
  const addBtn = page.locator('div').filter({ has: page.locator('h3:has-text("Client details")') }).first().locator('text="+ Add client details"');
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await page.waitForTimeout(500);
  }
  
  await page.screenshot({ path: 'client_step10_reset.png', fullPage: true });

  await browser.close();
  console.log('Done!');
})();
