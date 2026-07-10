const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
  });

  // 1. Malformed legacy LocalStorage recovery
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: {},
      client: {},
      details: { currency: 'USD', dateFormat: 'MMM DD, YYYY', documentType: 'Invoice' },
      style: { themeColor: '#0052FF' },
      items: [{ id: 'test-1', rate: 100, quantity: 1, name: 'Service' }],
      totals: {
        subtotal: 100,
        discountType: 'invalid_type',
        discountValue: 'NaN',
        taxRate: null,
        shipping: 'Infinity'
      }
    }));
  });
  await page.reload();
  await page.waitForTimeout(1000);
  
  // Verify it recovered cleanly without crashing
  await page.screenshot({ path: 'ev_01_legacy_recovery.png', fullPage: true });

  // 4. Decimal intermediate state "10." and 5. invalid input rejection
  // Let's add a discount
  await page.click('button:has-text("+ Add discount")');
  await page.waitForTimeout(300);
  await page.locator('span:has-text("Discount") + div select').selectOption('percent');
  
  // Type "10."
  await page.locator('span:has-text("Discount") + div input').fill('10.');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ev_02_decimal_intermediate.png' });

  // Try invalid input (e.g. letters)
  await page.locator('span:has-text("Discount") + div input').fill('abc');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ev_03_invalid_input_rejection.png' });

  // 2. 100% and above-100% percentage discount
  await page.locator('span:has-text("Discount") + div input').fill('150'); // 150%
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ev_04_above_100_percent_discount.png' });

  // 3. $150 flat discount on $100 subtotal
  await page.locator('span:has-text("Discount") + div select').selectOption('flat');
  await page.locator('span:has-text("Discount") + div input').fill('150');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'ev_05_flat_150_discount.png' });

  // Reset to 0 discount and setup Tax for later steps
  await page.click('div:has-text("Discount") button.hover-text-error');
  await page.click('button:has-text("+ Add tax")');
  await page.locator('input[placeholder="Tax"]').fill('VAT');
  await page.locator('input[placeholder="Tax"] + div input').fill('10.25');
  await page.waitForTimeout(500);

  // 7. Full Preview
  await page.click('button:has-text("Expand")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ev_06_full_preview.png', fullPage: true });
  await page.keyboard.press('Escape'); // Close preview

  // 8. Downloaded PDF with VAT 10.25%
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Download PDF")')
  ]);
  await download.saveAs('ev_07_downloaded_invoice.pdf');

  // 10. Hard-refresh persistence
  await page.reload();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ev_08_hard_refresh_persistence.png', fullPage: true });

  // 12. New Invoice reset
  await page.click('button:has-text("New Invoice")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'ev_09_new_invoice_reset.png', fullPage: true });

  // 6. Exact 375x812 mobile layout
  // Re-inject some data for a good looking mobile view
  await page.evaluate(() => {
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: { name: 'My Business' },
      client: { name: 'Client' },
      details: { currency: 'USD', dateFormat: 'MMM DD, YYYY', documentType: 'Invoice' },
      style: { themeColor: '#0052FF' },
      items: [{ id: 'test-1', rate: 100, quantity: 1, name: 'Service' }],
      totals: { subtotal: 100, discountType: 'flat', discountValue: '10', taxRate: '5', taxLabel: 'Tax', shipping: '15' }
    }));
  });
  await page.reload();
  await page.waitForTimeout(500);

  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 812 }
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:5173');
  await mobilePage.waitForTimeout(1000);
  // Scroll to totals
  await mobilePage.evaluate(() => window.scrollBy(0, 500));
  await mobilePage.waitForTimeout(500);
  await mobilePage.screenshot({ path: 'ev_10_mobile_375x812.png', fullPage: true });

  // 9. Multi-page PDF totals placement
  const multiPageContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const multiPage = await multiPageContext.newPage();
  await multiPage.goto('http://localhost:5173');
  // Inject 25 items to force pagination
  await multiPage.evaluate(() => {
    const items = Array.from({ length: 25 }, (_, i) => ({
      id: `id-${i}`, name: `Item ${i}`, description: 'Long desc', quantity: 1, rate: 10
    }));
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: { name: 'Business' }, client: { name: 'Client' }, details: { currency: 'USD' }, style: { themeColor: '#0052FF' },
      items, totals: { subtotal: 250, taxRate: 10, taxLabel: 'VAT' }
    }));
  });
  await multiPage.reload();
  await multiPage.waitForTimeout(1000);
  
  const [downloadMulti] = await Promise.all([
    multiPage.waitForEvent('download'),
    multiPage.click('button:has-text("Download PDF")')
  ]);
  await downloadMulti.saveAs('ev_11_multipage_invoice.pdf');

  await browser.close();
  console.log('All screenshots generated successfully!');
})();
