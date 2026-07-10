const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting verify_totals.cjs...');

  // 1. Test Malformed legacy values recovery via local storage injection
  console.log('Injecting malformed legacy draft...');
  await page.goto('http://localhost:5173');
  await page.evaluate(() => {
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: {},
      client: {},
      details: { currency: 'USD', dateFormat: 'MMM DD, YYYY', documentType: 'Invoice' },
      style: { themeColor: '#0052FF' },
      items: [{ id: 'test-id-1', rate: 100, quantity: 1, name: 'Service' }],
      totals: {
        subtotal: 100,
        discountType: 'invalid_type',
        discountValue: 'NaN',
        taxRate: null,
        shipping: 'Infinity',
        amountPaid: undefined
      }
    }));
  });
  await page.reload();

  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));
  console.log('Checking legacy recovery...');
  // The normalization helper should have cleared invalid values to '' and set discountType to 'percent'
  // Since it was normalized to '', the discount row is hidden and "+ Add discount" is visible
  try {
    await page.waitForSelector('button:has-text("+ Add discount")', { timeout: 2000 });
  } catch (e) {
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log('BODY HTML:', html);
    throw new Error('Legacy NaN discountValue was not normalized to empty string (button should be visible)');
  }
  
  await page.click('button:has-text("+ Add discount")');
  let discountVal = await page.inputValue('div:has-text("Discount") input[placeholder="0"]'); // Discount
  if (discountVal !== '') throw new Error('Legacy NaN discountValue was not normalized to empty string in the input');
  
  await page.click('div:has-text("Discount") button.hover-text-error'); // Close discount

  // Tax label needs to be activated first
  await page.click('button:has-text("+ Add tax")');
  const taxLabel = await page.inputValue('input[placeholder="Tax"]');
  if (taxLabel !== 'Tax') throw new Error(`Legacy missing taxLabel did not default to Tax, got ${taxLabel}`);
  
  // Close tax
  const taxCloseBtns = page.locator('button.hover-text-error');
  await taxCloseBtns.first().click();

  const stateStr = await page.evaluate(() => localStorage.getItem('invoice_draft'));
  console.log('State before subtotal check:', stateStr);

  // 2. Setup $100 subtotal
  console.log('Verifying $100 subtotal...');
  const subtotalText = await page.locator('div:has-text("Subtotal") span', { hasText: '$' }).last().innerText();
  if (subtotalText !== '$100.00') throw new Error(`Subtotal should be $100.00, got ${subtotalText}`);

  // 3. Test $150 flat discount capped to $100
  console.log('Testing $150 flat discount cap...');
  await page.click('button:has-text("+ Add discount")');
  await page.locator('span:has-text("Discount") + div select').selectOption('flat'); // Change to flat
  await page.locator('span:has-text("Discount") + div input').fill('150'); // Discount value
  
  // Wait for react to recalculate
  await page.waitForTimeout(500);

  // The displayed discount amount (subtotal is $100, so flat $150 discount means $100 discount amount)
  const discountAmountText = await page.locator('span.text-secondary.font-medium').first().innerText();
  if (discountAmountText !== '-$100.00') throw new Error(`Discount amount should be -$100.00, got ${discountAmountText}`);

  // Test 100% discount
  console.log('Testing 100% discount...');
  await page.locator('span:has-text("Discount") + div select').selectOption('percent');
  await page.locator('span:has-text("Discount") + div input').fill('100');
  await page.waitForTimeout(500);
  const discountAmountText2 = await page.locator('span.text-secondary.font-medium').first().innerText();
  if (discountAmountText2 !== '-$100.00') throw new Error(`Discount amount should be -$100.00, got ${discountAmountText2}`);

  // Test discount > 100%
  console.log('Testing 150% discount cap...');
  await page.locator('span:has-text("Discount") + div input').fill('150');
  await page.waitForTimeout(500);
  const discountAmountText3 = await page.locator('span.text-secondary.font-medium').first().innerText();
  if (discountAmountText3 !== '-$100.00') throw new Error(`Discount amount should be capped at -$100.00, got ${discountAmountText3}`);

  // 4. Test 10.25% Tax and custom label
  console.log('Testing 10.25% custom tax label...');
  // Close discount
  await page.locator('button.hover-text-error').first().click();
  
  await page.click('button:has-text("+ Add tax")');
  await page.fill('input[placeholder="Tax"]', 'VAT');
  await page.locator('input[placeholder="Tax"] + div input').fill('10.25'); // Tax rate
  await page.waitForTimeout(500);

  const taxAmountText = await page.locator('span.text-secondary.font-medium').first().innerText();
  if (taxAmountText !== '$10.25') throw new Error(`Tax amount should be $10.25, got ${taxAmountText}`);

  // 5. Test Shipping rounding (10.999 -> 11.00)
  console.log('Testing shipping 10.999 rounding...');
  await page.click('button:has-text("+ Add shipping")');
  await page.locator('span:has-text("Shipping") + div input').fill('10.999');
  await page.waitForTimeout(500);

  const shipAmountText = await page.locator('span.text-secondary.font-medium').last().innerText();
  if (shipAmountText !== '$11.00') throw new Error(`Shipping amount should round to $11.00, got ${shipAmountText}`);

  // Total should be 100 + 10.25 + 11.00 = 121.25
  const totalText = await page.locator('div:has-text("Total") span', { hasText: '$' }).last().innerText();
  if (totalText !== '$121.25') throw new Error(`Total should be $121.25, got ${totalText}`);

  // 6. Test amount paid > total (negative balance)
  console.log('Testing negative balance due...');
  await page.locator('span:has-text("Amount Paid") ~ div input').fill('150');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test_amount_paid.png' });
  
  const balanceDueText = await page.locator('div:has-text("Balance Due") span', { hasText: '$' }).last().innerText();
  if (balanceDueText !== '-$28.75') throw new Error(`Balance due should be -$28.75, got ${balanceDueText}`);

  // 7. Hard Refresh Persistence
  console.log('Testing hard refresh persistence...');
  await page.reload();
  await page.waitForTimeout(500);

  const labelReloaded = await page.inputValue('input[placeholder="Tax"]');
  if (labelReloaded !== 'VAT') throw new Error(`Tax label did not persist across reload, got ${labelReloaded}`);
  
  const totalReloaded = await page.locator('div:has-text("Total") span', { hasText: '$' }).last().innerText();
  if (totalReloaded !== '$121.25') throw new Error('Total did not persist across reload');

  // 8. New Invoice Reset
  console.log('Testing New Invoice reset...');
  await page.click('text=New Invoice');
  await page.waitForTimeout(500);

  const subtotalReset = await page.locator('div:has-text("Subtotal") span', { hasText: '$' }).last().innerText();
  if (subtotalReset !== '$0.00') throw new Error('Subtotal did not reset to $0.00');
  
  // Tax should revert to "Add tax" button
  const addTaxBtn = await page.locator('button:has-text("+ Add tax")').count();
  if (addTaxBtn === 0) throw new Error('Tax did not reset to hidden state');

  console.log('All Totals validations passed!');
  await browser.close();
})();
