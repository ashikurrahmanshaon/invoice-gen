const puppeteer = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7';
const URL = 'http://localhost:5173';

async function runTests() {
  console.log('Starting Playwright for History Verification Part 2...');
  const browser = await puppeteer.chromium.launch({ headless: true });
  let page = await browser.newPage();
  
  let consoleErrors = 0;
  let pageErrors = 0;
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors++;
  });
  page.on('pageerror', error => {
    pageErrors++;
  });

  // Clean start
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const takeScreenshot = async (name) => {
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `${name}.png`) });
    console.log(`Saved screenshot: ${name}.png`);
  };

  try {
    // 1. Empty History Dashboard
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_empty_dashboard');

    // Go back and create a record
    await page.click('text=Editor');
    await page.fill('input[placeholder="Client or Company Name"]', 'Wayne Enterprises');
    await page.click('text=Save');
    await page.waitForTimeout(500);

    // Get the generated invoice number
    const invoiceNumber = await page.evaluate(() => {
      const spans = Array.from(document.querySelectorAll('span'));
      const invSpan = spans.find(s => s.innerText === 'Invoice Number');
      return invSpan.nextElementSibling.value;
    });

    // 2. Search by invoice number
    await page.click('text=History');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="Search invoices..."]', invoiceNumber);
    await page.waitForTimeout(200);
    await takeScreenshot('history_search_invoice_number');
    await page.fill('input[placeholder="Search invoices..."]', ''); // Clear search

    // 3. Save updates existing record
    await page.click('button[aria-label="Actions"]');
    await page.click('text=Edit');
    await page.waitForTimeout(500);
    await page.fill('input[placeholder="Client or Company Name"]', 'Wayne Enterprises Updated');
    await page.click('text=Save'); // Save the update
    await page.waitForTimeout(500);
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_save_updates_existing'); // Should show updated name

    // 4. Delete Confirmation
    await page.click('button[aria-label="Actions"]');
    await page.click('text=Delete');
    await page.waitForTimeout(500);
    await takeScreenshot('history_delete_confirmation');
    await page.click('text=Cancel'); // Cancel delete for next test

    // 5. Reset Everything clears History
    await page.click('text=Editor');
    await page.click('button[aria-label="More options"]'); // Assuming Meatball menu or Reset button is here
    // Wait, let's just click 'Reset everything' in the meatball menu if we can find it
    // Actually the text is "Reset everything"
    await page.click('text=Reset everything');
    await page.waitForTimeout(500);
    await page.check('input#resetHistory'); // Check the "Also delete all Past Invoices" checkbox
    await takeScreenshot('history_reset_modal_checked');
    await page.click('text=Yes, reset all');
    await page.waitForTimeout(500);
    
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_after_reset_everything'); // Should be empty again

    console.log(`Console Errors: ${consoleErrors}`);
    console.log(`Unhandled Page Errors: ${pageErrors}`);
    console.log('Verification Part 2 completed successfully.');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
  }
}

runTests();
