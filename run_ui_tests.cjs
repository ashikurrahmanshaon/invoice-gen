const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7';
const URL = 'http://localhost:5177';

async function runTests() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--window-size=1280,1024'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });

  const takeScreenshot = async (name) => {
    const dest = path.join(ARTIFACT_DIR, `${name}.png`);
    await page.screenshot({ path: dest });
    console.log(`Saved screenshot: ${name}.png`);
  };

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // Helper selectors
  const clientNameSel = 'input[placeholder="Client or Company Name"]';
  const clientEmailSel = 'input[placeholder="client@example.com"]';
  const pickerInputSel = '.client-picker-input-wrapper input';
  
  const clickBtnByText = async (text) => {
    await page.evaluate((btnText) => {
      const b = Array.from(document.querySelectorAll('button')).find(el => el.textContent && el.textContent.includes(btnText));
      if (b) b.click();
    }, text);
  };

  const clearInput = async (selector) => {
    await page.click(selector, { clickCount: 3 });
    await page.keyboard.press('Backspace');
    await wait(100);
  };

  try {
    console.log('Navigating to app...');
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // Ensure reset first
    await clickBtnByText('Reset');
    await wait(500);
    await clickBtnByText('Yes, reset all');
    await wait(500);


    // 1. Empty State
    console.log('1. Empty State');
    await page.focus(pickerInputSel);
    await wait(500);
    await takeScreenshot('empty_state'); 

    // 2. Save Flow
    console.log('2. Save Flow');
    await page.type(clientNameSel, 'Acme Corp');
    await page.type(clientEmailSel, 'acme@example.com');
    await wait(200);
    await takeScreenshot('save_flow_entering');
    
    await clickBtnByText('Save to clients');
    await wait(500);
    
    await page.click(pickerInputSel); 
    await wait(500);
    await takeScreenshot('save_flow_saved');
    await page.keyboard.press('Escape');

    // Add another client for Search test
    console.log('Adding second client...');
    await clearInput(clientNameSel);
    await clearInput(clientEmailSel);
    await page.type(clientNameSel, 'Globex Inc');
    await page.type(clientEmailSel, 'contact@globex.com');
    await wait(200);
    await clickBtnByText('Save to clients');
    await wait(500);
    
    await clickBtnByText('New Invoice');
    await wait(500);

    // 3. Search
    console.log('3. Search Filtering');
    await page.click(pickerInputSel);
    await page.type(pickerInputSel, 'Acme');
    await wait(500);
    await takeScreenshot('search_filtering');
    
    await clearInput(pickerInputSel);
    await page.type(pickerInputSel, 'Nonexistent');
    await wait(500);
    await takeScreenshot('search_no_results');
    
    await clearInput(pickerInputSel);
    await wait(500);

    // 4. Load Flow
    console.log('4. Load Flow');
    await page.click(pickerInputSel);
    await wait(500);
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.client-picker-item'));
      const acme = items.find(i => i.textContent.includes('Acme Corp'));
      if (acme) acme.click();
    });
    await wait(500);
    await takeScreenshot('load_flow_populated');
    await takeScreenshot('load_flow_preview'); // It's all on the same screen (PreviewSidebar)

    // 5. Duplicate Detection
    console.log('5. Duplicate Detection');
    await clickBtnByText('New Invoice');
    await wait(500);
    
    await page.type(clientNameSel, 'Acme Dupe');
    await page.type(clientEmailSel, 'acme@example.com');
    await wait(200);
    await clickBtnByText('Save to clients');
    await wait(500);
    await takeScreenshot('duplicate_modal');

    // 6. Invoice-only Editing & 7. Update Saved Client
    console.log('6. Invoice-only Editing & Update');
    await clickBtnByText('Load Existing');
    await wait(500);
    
    await clickBtnByText('Add client details');
    await wait(200);
    
    await page.type('input[placeholder="Street address"]', '123 New Way');
    await wait(500);
    await takeScreenshot('invoice_only_editing');

    await clickBtnByText('Update saved client');
    await wait(500);
    
    await clickBtnByText('New Invoice');
    await wait(500);
    
    await page.click(pickerInputSel);
    await wait(500);
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.client-picker-item'));
      const acme = items.find(i => i.textContent.includes('Acme Corp'));
      if (acme) acme.click();
    });
    await wait(500);
    await clickBtnByText('Add client details');
    await wait(500);
    await takeScreenshot('update_saved_client');

    // 8. Delete Client
    console.log('8. Delete Client');
    await page.click(pickerInputSel);
    await wait(500);
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.client-picker-item'));
      const globex = items.find(i => i.textContent.includes('Globex'));
      if (globex) {
        const delBtn = globex.querySelector('button');
        if (delBtn) delBtn.click();
      }
    });
    await wait(500);
    await takeScreenshot('delete_modal');
    
    await clickBtnByText('Yes, delete');
    await wait(500);
    
    await page.click(pickerInputSel);
    await wait(500);
    await takeScreenshot('delete_confirmed');
    await page.keyboard.press('Escape');

    // 9. New Invoice Check
    console.log('9. New Invoice');
    await clickBtnByText('New Invoice');
    await wait(500);
    await page.click(pickerInputSel);
    await wait(500);
    await takeScreenshot('new_invoice_cleared');
    await page.keyboard.press('Escape');

    // 10. Reset Everything
    console.log('10. Reset Everything');
    await clickBtnByText('Reset');
    await wait(500);
    await takeScreenshot('reset_modal');
    
    await clickBtnByText('Yes, reset all');
    await wait(500);

    // 11. Hard Refresh (Persistence)
    console.log('11. Hard Refresh');
    await page.type(clientNameSel, 'Persistent Corp');
    await page.type(clientEmailSel, 'persist@example.com');
    await wait(200);
    await clickBtnByText('Save to clients');
    await wait(500);
    
    await page.reload({ waitUntil: 'networkidle0' });
    await page.click(pickerInputSel);
    await wait(500);
    await takeScreenshot('hard_refresh');
    await page.keyboard.press('Escape');

    // 13. Accessibility Focus
    console.log('13. Accessibility Focus');
    await page.focus(pickerInputSel);
    await page.keyboard.press('ArrowDown'); // open dropdown
    await page.keyboard.press('ArrowDown'); // focus first item
    await wait(500);
    await takeScreenshot('accessibility_focus');
    await page.keyboard.press('Escape');

    // 12. Mobile
    console.log('12. Mobile View');
    await page.setViewport({ width: 375, height: 812 });
    await wait(500);
    await clickBtnByText('Next');
    await wait(500);
    await page.click('.mobile-only .client-picker-input-wrapper input');
    await wait(500);
    await takeScreenshot('mobile_picker');
    await page.keyboard.press('Escape');

    // 14. Storage Failure
    console.log('14. Storage Failure');
    await page.setViewport({ width: 1280, height: 1024 });
    await wait(500);
    await clickBtnByText('Previous');
    await clickBtnByText('Previous'); // Desktop mode doesn't matter, we just use DOM
    
    await page.evaluate(() => {
       // Mock quota failure
       window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    });
    
    await clearInput(clientNameSel);
    await clearInput(clientEmailSel);
    await page.type(clientNameSel, 'Quota Corp');
    await page.type(clientEmailSel, 'quota@example.com');
    await wait(200);
    await clickBtnByText('Save to clients');
    await wait(500);
    await takeScreenshot('storage_failure');

    console.log('All UI interaction tests completed.');
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

runTests();
