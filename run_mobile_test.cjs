const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7';
const URL = 'http://localhost:5177';

async function runTests() {
  console.log('Launching browser for mobile tests...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const takeScreenshot = async (name) => {
    const dest = path.join(ARTIFACT_DIR, `${name}.png`);
    await page.screenshot({ path: dest });
    console.log(`Saved screenshot: ${name}.png`);
  };

  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  try {
    console.log('Navigating to app...');
    await page.setViewport({ width: 375, height: 812 });
    await page.goto(URL, { waitUntil: 'networkidle0' });

    // 12. Mobile
    console.log('12. Mobile View');
    await wait(1000);
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent && b.textContent.includes('Next'));
      if (nextBtn) nextBtn.click();
    });
    
    await wait(1000);
    
    // We should be on stage 2 now
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('.client-picker-input-wrapper input');
      // The last one is likely the mobile one, or we just click all visible ones
      inputs.forEach(i => {
        if (i.getBoundingClientRect().width > 0) {
          i.click();
        }
      });
    });
    
    await wait(500);
    await takeScreenshot('mobile_picker');

    // 14. Storage Failure
    console.log('14. Storage Failure');
    await page.setViewport({ width: 1280, height: 1024 });
    await wait(500);
    
    await page.evaluate(() => {
       // Mock quota failure
       window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    });
    
    const clientNameSel = 'input[placeholder="Client or Company Name"]';
    const clientEmailSel = 'input[placeholder="client@example.com"]';
    
    // Switch out of mobile mode so we see the desktop client section
    // Desktop layout doesn't use "Next" buttons, so the fields should be there.
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[placeholder="Client or Company Name"]');
      inputs.forEach(i => { if(i.getBoundingClientRect().width > 0) i.value = ''; });
      const emails = document.querySelectorAll('input[placeholder="client@example.com"]');
      emails.forEach(i => { if(i.getBoundingClientRect().width > 0) i.value = ''; });
    });
    
    // Type in visible inputs
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[placeholder="Client or Company Name"]');
      inputs.forEach(i => { if(i.getBoundingClientRect().width > 0) { i.focus(); i.value = 'Quota Corp'; i.dispatchEvent(new Event('input', { bubbles: true })); } });
      const emails = document.querySelectorAll('input[placeholder="client@example.com"]');
      emails.forEach(i => { if(i.getBoundingClientRect().width > 0) { i.focus(); i.value = 'quota@example.com'; i.dispatchEvent(new Event('input', { bubbles: true })); } });
    });
    await wait(200);
    
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const saveBtn = btns.find(b => b.textContent && b.textContent.includes('Save to clients'));
      if (saveBtn) saveBtn.click();
    });
    
    await wait(500);
    await takeScreenshot('storage_failure');

    // 15. Build success screenshot representation
    console.log('Tests completed.');
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

runTests();
