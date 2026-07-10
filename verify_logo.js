import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const dir = 'C:/Users/arsha/.gemini/antigravity-ide/brain/5194976d-cfd6-4066-85ce-61613cd81cb7';
const pngPath = path.join(dir, 'test_logo_png_1783678448635.png');
const origJpgPath = path.join(dir, 'company_logo_two_1783679756082.png');
const jpgPath = path.join(dir, 'real_logo.jpg');

// Copy the second image to a .jpg extension so Playwright sets the MIME type to image/jpeg
fs.copyFileSync(origJpgPath, jpgPath);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  
  await page.setViewportSize({ width: 1200, height: 800 });
  
  // Navigate and set test flag
  await page.goto('http://localhost:5173');
  await page.evaluate(() => { window.__TESTING_PREVIEW__ = false; });
  await page.waitForTimeout(1000);

  // 1. Start from a clean New Invoice state
  const newInvoiceBtn = await page.$('button:has-text("New Invoice")');
  if (newInvoiceBtn) await newInvoiceBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(dir, '1_clean_state.png') });
  console.log('Took screenshot 1_clean_state.png');

  // 2 & 3. Upload PNG and verify rendered
  await page.waitForSelector('input[type="file"]', { state: 'attached' });
  let fileInputs = await page.$$('input[type="file"]');
  await fileInputs[0].setInputFiles(pngPath);
  await page.waitForTimeout(1500); // wait for image to render
  await page.screenshot({ path: path.join(dir, '2_png_uploaded.png') });
  console.log('Took screenshot 2_png_uploaded.png');

  // 4. Refresh browser
  await page.reload();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(dir, '3_after_refresh.png') });
  console.log('Took screenshot 3_after_refresh.png');

  // 5. Mobile UI
  await page.setViewportSize({ width: 400, height: 800 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(dir, '4_mobile_ui.png') });
  console.log('Took screenshot 4_mobile_ui.png');
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.waitForTimeout(1000);

  // 6. Generate PDF
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download PDF")');
  const download = await downloadPromise;
  const pdfPath = path.join(dir, 'generated_invoice.pdf');
  await download.saveAs(pdfPath);
  console.log(`Saved PDF to ${pdfPath}`);
  
  // Render PDF in browser to screenshot it
  await page.evaluate(() => { window.__TESTING_PREVIEW__ = true; });
  await page.click('button:has-text("Download PDF")');
  await page.waitForTimeout(2000); // Wait for navigation to blob
  await page.screenshot({ path: path.join(dir, '5_pdf_blob.png') });
  console.log('Took screenshot 5_pdf_blob.png');
  
  // Go back to app
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(1500);

  // 7. Replace with JPG
  await page.waitForSelector('input[type="file"]', { state: 'attached' });
  fileInputs = await page.$$('input[type="file"]');
  await fileInputs[0].setInputFiles(jpgPath);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(dir, '6_jpg_uploaded.png') });
  console.log('Took screenshot 6_jpg_uploaded.png');

  // 8. Remove logo
  await page.hover('.logo-hover-overlay');
  await page.waitForTimeout(500);
  await page.click('.logo-hover-overlay button');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(dir, '7_logo_removed.png') });
  console.log('Took screenshot 7_logo_removed.png');

  // 9. Upload again and click New Invoice
  await page.waitForSelector('input[type="file"]', { state: 'attached' });
  fileInputs = await page.$$('input[type="file"]');
  await fileInputs[0].setInputFiles(pngPath);
  await page.waitForTimeout(1500);
  await page.click('button:has-text("New Invoice")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(dir, '8_cleared_by_new_invoice.png') });
  console.log('Took screenshot 8_cleared_by_new_invoice.png');

  // 10. Final clean UI
  await page.screenshot({ path: path.join(dir, '9_final_clean_ui.png') });
  console.log('Took screenshot 9_final_clean_ui.png');

  await browser.close();
})();
