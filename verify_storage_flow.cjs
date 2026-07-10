const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7';

const run = async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to app...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  // 1. legacy migration with business profile preserved
  console.log('Running test: Legacy migration');
  await page.evaluate(() => {
    window.localStorage.clear();
    window.localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: { name: 'Legacy Corp', email: 'legacy@corp.com' },
      client: { name: 'Old Client', email: 'old@client.com' },
      details: { invoiceNumber: 'INV-LEGACY', currency: 'USD' },
      items: [],
      totals: {}
    }));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'legacy_migration.png') });
  
  // 2. Desktop Smart New Invoice before and after
  console.log('Running test: Smart New Invoice');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('New Invoice'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_smart_new_invoice.png') });

  // 4. Two consecutive New Invoice actions with visibly different invoice numbers
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('New Invoice'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'consecutive_new_invoice.png') });

  // 5. Hard refresh after Smart New Invoice
  await page.reload({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hard_refresh_after_new_invoice.png') });

  // 6. Reset Everything confirmation modal; Cancel leaves data unchanged
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.querySelector('svg.lucide-more-vertical'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resetBtn = btns.find(b => b.textContent.includes('Reset Everything'));
    if (resetBtn) resetBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'reset_confirmation_modal.png') });

  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const cancelBtn = btns.find(b => b.textContent.includes('Cancel'));
    if (cancelBtn) cancelBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'cancel_reset_leaves_data.png') });

  // 7. Confirm produces a completely blank profile and invoice
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.querySelector('svg.lucide-more-vertical'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const resetBtn = btns.find(b => b.textContent.includes('Reset Everything'));
    if (resetBtn) resetBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const confirmBtn = btns.find(b => b.textContent.includes('Yes, reset all'));
    if (confirmBtn) confirmBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'confirm_reset_blank.png') });

  // 8. hard refresh after destructive reset
  await page.reload({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'hard_refresh_after_reset.png') });

  // 9. save-failure state
  await page.evaluate(() => {
    const original = window.localStorage.setItem;
    window.localStorage.setItem = (k, v) => {
      if(k === 'invoice_gen_profile') throw new Error('QuotaExceededError');
      original.call(window.localStorage, k, v);
    };
  });
  await page.type('input[placeholder="Your Business Name"]', 'Failed Corp');
  await new Promise(r => setTimeout(r, 1500)); // wait for debounce
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'save_failure_state.png') });

  // 10. exact 375x812 Mobile Smart New Invoice
  await page.setViewport({ width: 375, height: 812 });
  await page.evaluate(() => {
    window.localStorage.setItem = Storage.prototype.setItem; // restore
    window.localStorage.clear();
    window.localStorage.setItem('invoice_gen_profile', JSON.stringify({ business: { name: 'Mobile Corp' }, currency: 'USD' }));
    window.localStorage.setItem('invoice_gen_data', JSON.stringify({ details: { invoiceNumber: 'INV-MOB', currency: 'USD' }, items: [], totals: {} }));
  });
  await page.reload({ waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.querySelector('svg.lucide-more-vertical'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('New Invoice'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_smart_new_invoice.png') });

  await browser.close();
  console.log('Done!');
};

run().catch(console.error);
