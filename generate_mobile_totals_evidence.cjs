const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });

  await page.goto('http://localhost:5173');
  
  // Inject the exact state needed
  await page.evaluate(() => {
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: { name: 'My Business' },
      client: { name: 'Client' },
      details: { currency: 'USD', dateFormat: 'MMM DD, YYYY', documentType: 'Invoice' },
      style: { themeColor: '#0052FF' },
      items: [{ id: 'test-1', rate: 100, quantity: 1, name: 'Service' }],
      totals: { subtotal: 100, discountType: 'flat', discountValue: '', taxRate: '10.25', taxLabel: 'VAT', shipping: '10.999', amountPaid: '150' }
    }));
  });
  
  await page.reload();
  await page.waitForTimeout(1000);

  // In mobile view, the app is in the "MobileWizard" which starts at step 1.
  // We need to click "Next" until we reach the Review step (Stage 4).
  console.log('Navigating to Review step...');
  
  // Step 1 -> 2
  await page.click('button:has-text("Continue to Client")');
  await page.waitForTimeout(500);
  
  // Step 2 -> 3
  await page.click('button:has-text("Continue to Items")');
  await page.waitForTimeout(500);
  
  // Step 3 -> 4 (Review)
  await page.click('button:has-text("Review Invoice")');
  await page.waitForTimeout(1000);
  
  console.log('Asserting mobile totals...');
  const subtotal = await page.locator('div:has-text("Subtotal") + div + div + span, div:has(> span:has-text("Subtotal")) > span:last-child').last().innerText();
  if (!subtotal.includes('100.00')) throw new Error(`Expected Subtotal $100.00, got ${subtotal}`);

  const vat = await page.locator('span:has-text("VAT") ~ span, input[value="VAT"] ~ span.font-medium').last().innerText();
  if (!vat.includes('10.25')) throw new Error(`Expected VAT $10.25, got ${vat}`);

  const shipping = await page.locator('span:has-text("Shipping") ~ span.font-medium').last().innerText();
  if (!shipping.includes('11.00')) throw new Error(`Expected Shipping $11.00, got ${shipping}`);

  const total = await page.locator('span:has-text("Total") ~ span').last().innerText();
  if (!total.includes('121.25')) throw new Error(`Expected Total $121.25, got ${total}`);

  // Amount paid doesn't have a direct display span except the input, but we know it's 150 because we injected it.
  
  const balance = await page.locator('div:has(> span:has-text("Balance Due")) > span:last-child').last().innerText();
  if (!balance.includes('-$28.75')) throw new Error(`Expected Balance Due -$28.75, got ${balance}`);
  
  console.log('All assertions passed!');

  // Scroll to the bottom of the page to ensure totals are fully visible and 
  // checking that the sticky action bar doesn't cover them.
  console.log('Scrolling to totals...');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  
  // Actually, sometimes the main container has its own scroll. 
  // Let's scroll the main window, or use page.mouse.wheel just in case.
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'ev_12_mobile_review_totals.png' });

  await browser.close();
  console.log('Mobile screenshot generated successfully!');
})();
