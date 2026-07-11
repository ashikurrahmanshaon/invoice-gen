const puppeteer = require('playwright');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7';
const URL = 'http://localhost:5173';

async function runTests() {
  console.log('Starting Playwright for History Verification...');
  const browser = await puppeteer.chromium.launch({ headless: true });
  let page = await browser.newPage();
  
  // Clean start
  await page.goto(URL);
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  // Helper
  const takeScreenshot = async (name) => {
    await page.screenshot({ path: path.join(ARTIFACT_DIR, `${name}.png`) });
    console.log(`Saved screenshot: ${name}.png`);
  };

  try {
    // 1. Create first history record
    await page.fill('input[placeholder="Your Business Name"]', 'My Biz');
    await page.click('text=Continue');
    await page.waitForTimeout(100);

    await page.fill('input[placeholder="Client or Company Name"]', 'Acme Corp');
    await page.fill('input[placeholder="client@example.com"]', 'billing@acme.com');
    await page.click('text=Continue');
    await page.waitForTimeout(100);

    await page.fill('input[placeholder="Description (optional)"]', 'Web Design v2');
    await page.fill('input[placeholder="0.00"]', '1000');
    await page.click('text=Continue');
    await page.waitForTimeout(100);
    
    await page.click('text=Save');
    await page.waitForTimeout(500);
    await takeScreenshot('history_first_save');

    // 2. Open history record
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_dashboard_view');

    // 3. Search and filtering
    await page.fill('input[placeholder="Search invoices..."]', 'Acme');
    await page.waitForTimeout(200);
    await takeScreenshot('history_search_active');
    
    // Change status filter
    await page.selectOption('select', 'Sent');
    await page.waitForTimeout(200);
    await takeScreenshot('history_filter_empty');
    await page.selectOption('select', 'All');
    
    // 4. Edit history record
    await page.click('button[aria-label="Actions"]');
    await page.click('text="Edit"');
    await page.waitForTimeout(500);
    await takeScreenshot('history_editor_loaded');

    // 5. Unsaved changes modal
    await page.fill('input[placeholder="Your Business Name"]', 'My Biz v3'); // Make dirty
    await page.click('button[aria-label="More options"]');
    await page.waitForTimeout(200);
    await page.click('text="New Invoice"');
    await page.waitForTimeout(500);
    await takeScreenshot('history_unsaved_modal');
    // Cancel the modal
    await page.click('text=Cancel');
    
    // 6. Save As New
    await page.click('button[aria-label="More options"]');
    await page.waitForTimeout(200);
    await page.click('text=Save As New');
    await page.waitForTimeout(500);
    await takeScreenshot('history_save_as_new');
    
    // Go to history to see duplicate
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_dashboard_two_records');
    
    // 7. Duplicate
    await page.click('button[aria-label="Actions"]');
    await page.click('text=Duplicate');
    await page.waitForTimeout(500);
    await takeScreenshot('history_duplicate_draft');
    
    // 8. Mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await page.click('text=History');
    await page.waitForTimeout(500);
    await takeScreenshot('history_mobile_view');
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // 9. Status transitions
    await page.click('button[aria-label="Actions"]');
    await page.click('text=Mark as Paid');
    await page.waitForTimeout(500);
    await takeScreenshot('history_status_paid');
    
    // 10. Delete flow
    await page.click('button[aria-label="Actions"]');
    await page.click('text=Delete');
    await page.waitForTimeout(500);
    await page.click('text=Yes, delete');
    await page.waitForTimeout(500);
    await takeScreenshot('history_after_delete');
    
    // 11. Malformed Storage Recovery & Hard Refresh
    await page.evaluate(() => {
      let history = JSON.parse(localStorage.getItem('invoice_gen_history') || '[]');
      history.push({ id: 'bad-id', data: null, status: 'Draft' }); // Malformed
      localStorage.setItem('invoice_gen_history', JSON.stringify(history));
    });
    await page.reload();
    await page.waitForTimeout(500);
    await takeScreenshot('history_malformed_recovery'); // Should not crash
    
    // 12. Quota Failure
    await page.click('text=Editor');
    await page.evaluate(() => {
      try {
        localStorage.setItem('filler', new Array(5 * 1024 * 1024).join('a')); // Fill 5MB
      } catch (e) {
        // Expected
      }
    });
    await page.click('text=Save');
    await page.waitForTimeout(500);
    await takeScreenshot('history_quota_failure');
    
    await page.evaluate(() => localStorage.removeItem('filler'));

    console.log('Verification completed successfully.');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
  }
}

runTests();
