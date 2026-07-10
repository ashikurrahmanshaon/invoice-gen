const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  
  const url = 'http://localhost:5174';
  await page.goto(url);

  // Clear local storage and reset to clean state
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);

  // 1. Populate some data
  await page.click('button:has-text("Add Line Item")');
  await page.waitForTimeout(200);

  const rateInputs = page.locator('.desktop-only [data-testid="items-section"] input[placeholder="0.00"]');
  const qtyInputs = page.locator('.desktop-only [data-testid="items-section"] input[placeholder="1"]');
  
  await rateInputs.first().fill('500');
  await rateInputs.nth(1).fill('150.50');
  await qtyInputs.nth(1).fill('2');
  
  await page.waitForTimeout(500);
  
  // 2. Click New Invoice
  await page.click('button:has-text("New Invoice")');
  await page.waitForTimeout(1000);

  // 3. Scroll to Items section and take screenshot
  await page.evaluate(() => {
    const itemsSection = document.querySelector('[data-testid="items-section"]');
    if (itemsSection) itemsSection.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(500);

  await page.screenshot({ 
    path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_14_new_invoice_reset_items_visible.png',
    fullPage: true 
  });

  await browser.close();
  console.log('Reset screenshot generated!');
})();
