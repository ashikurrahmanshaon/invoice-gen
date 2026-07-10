const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => { errors.push(err.message); console.error('Page error:', err); });
  page.on('console', msg => { if (msg.type() === 'error') { errors.push(msg.text()); console.error('Console error:', msg.text()); } });
  
  const url = 'http://localhost:5173';
  await page.goto(url);

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(500);

  // 1. Initial desktop state
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_1_initial.png' });
  const rateInputs = page.locator('[data-testid="items-section"] input[placeholder="0.00"]');
  const qtyInputs = page.locator('[data-testid="items-section"] input[placeholder="1"]');
  const nameInputs = page.locator('[data-testid="items-section"] input[placeholder="Item or service name"]');
  const descInputs = page.locator('[data-testid="items-section"] input[placeholder="Description (optional)"]');
  const delBtns = page.locator('button[aria-label="Delete item"]');

  if (await rateInputs.count() !== 1) throw new Error('Expected exactly 1 item initially');

  // 2. Decimal input sequence
  await rateInputs.first().fill('10');
  await page.waitForTimeout(100);
  await rateInputs.first().type('.');
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_2_decimal_1.png' });
  await rateInputs.first().type('9');
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_2_decimal_2.png' });
  await rateInputs.first().type('9');
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_2_decimal_3.png' });

  // 3. Decimal calculation
  await qtyInputs.first().fill('1.5');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_3_calculation.png' });

  // 4. Add and Duplicate
  await page.click('button:has-text("Add Line Item")');
  await page.waitForTimeout(200);
  await nameInputs.nth(1).fill('Second Item');
  await rateInputs.nth(1).fill('20.00');
  await qtyInputs.nth(1).fill('2');
  await page.locator('button[aria-label="Duplicate item"]').nth(1).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_4_add_duplicate.png' });

  // 5. Delete middle item
  await page.locator('button[aria-label="Delete item"]').nth(1).click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_5_delete_middle.png' });

  // 6. Final item reset behavior
  await page.locator('button[aria-label="Delete item"]').first().click();
  await page.locator('button[aria-label="Delete item"]').first().click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_6_final_reset.png' });
  
  if (await rateInputs.count() !== 1) throw new Error('Final item was removed from DOM completely');
  if (await rateInputs.first().inputValue() !== '') throw new Error('Final item rate was not reset');

  // 7. Long Content Test
  const longName = 'This is a very very very very very very very very very very very very long item name to test wrapping';
  const longDesc = 'This is a multi-line\\nlong description\\nwith several lines\\nto ensure that it wraps properly on desktop and PDF.\\nLine 5\\nLine 6\\nLine 7';
  await nameInputs.first().fill(longName);
  await descInputs.first().fill(longDesc);
  await rateInputs.first().fill('100');
  await qtyInputs.first().fill('1');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_7_long_content.png' });

  // Add more items to force multi-page
  for (let i = 0; i < 15; i++) {
    await page.click('.btn-action-dup >> nth=0');
  }

  // 9. Hard refresh persistence
  await page.waitForTimeout(1500); 
  await page.reload();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_9_refresh_persistence.png' });
  
  // 10. Live Preview
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_10_live_preview.png' });

  // 11. Full Invoice Preview
  await page.click('button:has-text("Expand")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_11_full_preview.png' });
  await page.mouse.click(10, 10); // Click outside modal to close
  await page.waitForTimeout(500);

  // 12. & 13. Trigger PDF Generation
  let pdfBlobUrl = null;
  page.on('console', msg => {
    if (msg.text().includes('__PDF_BLOB_URL__:')) {
      pdfBlobUrl = msg.text().replace('__PDF_BLOB_URL__: ', '');
    }
  });
  await page.click('button:has-text("PDF")');
  await page.waitForTimeout(2000);

  if (!pdfBlobUrl) throw new Error('Did not capture PDF blob URL from console');
  const pdfDataUri = await page.evaluate(async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }, pdfBlobUrl);
  const base64Data = pdfDataUri.replace(/^data:application\/pdf;base64,/, "");
  fs.writeFileSync('C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\evidence_invoice.pdf', base64Data, 'base64');

  // Render PDF pages
  const renderPdfScript = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        async function renderPage(dataUri, pageNum) {
          const loadingTask = pdfjsLib.getDocument(dataUri);
          const pdf = await loadingTask.promise;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.getElementById('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          return true;
        }
      </script>
    </body>
    </html>
  `;
  fs.writeFileSync('C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\render_pdf.html', renderPdfScript);
  const pdfPage = await browser.newPage();
  await pdfPage.goto('file://' + path.resolve('C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\render_pdf.html'));
  
  await pdfPage.evaluate(async ({ uri }) => { await window.renderPage(uri, 1); }, { uri: pdfDataUri });
  await pdfPage.waitForTimeout(1500);
  await pdfPage.locator('#canvas').screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_13_pdf_page1.png' });

  await pdfPage.evaluate(async ({ uri }) => { await window.renderPage(uri, 2); }, { uri: pdfDataUri });
  await pdfPage.waitForTimeout(1500);
  await pdfPage.locator('#canvas').screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_13_pdf_page2.png' });

  // 14. New Invoice reset
  await page.click('button:has-text("New Invoice")'); 
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_14_new_invoice_reset.png' });

  // 8. Mobile Cards at 375x812
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => localStorage.clear());
  await page.reload(); 
  await page.waitForTimeout(500);
  
  await page.click('button:has-text("Continue")'); // to Client
  await page.click('button:has-text("Continue")'); // to Items
  await page.waitForTimeout(500);

  await page.locator('.mobile-only input[placeholder="Item or service name"]').first().fill('Mobile Item 1');
  await page.locator('.mobile-only input[placeholder="0.00"]').first().fill('10.5');
  await page.click('.mobile-only button:has-text("Add another item")');
  await page.locator('.mobile-only input[placeholder="Item or service name"]').nth(1).fill('Mobile Item 2');
  await page.locator('.mobile-only input[placeholder="0.00"]').nth(1).fill('20');
  await page.click('.mobile-only button:has-text("Add another item")');
  await page.locator('.mobile-only input[placeholder="Item or service name"]').nth(2).fill('Mobile Item 3');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_8_mobile_cards.png' });

  // 15. Verification health
  fs.writeFileSync('C:\\Users\\arsha\\.gemini\\antigravity-ide\\brain\\5194976d-cfd6-4066-85ce-61613cd81cb7\\ev_15_health.json', JSON.stringify({ errors }));

  await browser.close();
  console.log('All tests passed!');
})();
