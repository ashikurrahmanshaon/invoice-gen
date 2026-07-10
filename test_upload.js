import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Navigate to dev server
  await page.goto('http://localhost:5173');
  
  // Set localStorage with valid PNG
  await page.evaluate(() => {
    localStorage.setItem('invoice_gen_data', JSON.stringify({
      business: { name: 'Test Biz', email: '', logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', address: '', phone: '', website: '', taxId: '' },
      client: { name: '', email: '', address: '', phone: '', taxId: '' },
      details: { invoiceNumber: 'INV-123', issueDate: '2023-01-01', dueDate: '2023-01-15', currency: 'USD' },
      items: [{ id: '1', name: '', description: '', rate: 0, quantity: 1 }],
      totals: { subtotal: 0, discountRate: 0, discountType: 'percent', discountValue: 0, taxRate: 0, shipping: 0, amountPaid: 0, discountAmount: 0, taxAmount: 0, total: 0, balanceDue: 0 },
      notes: '', terms: '', paymentInstructions: '', signatureUrl: null
    }));
  });
  
  await page.reload();
  
  // Wait for page to be ready
  await page.waitForTimeout(1000);
  
  // Override console.error to capture PDF errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });
  
  // Find "Download PDF" button in Header
  const downloadBtn = await page.$('button:has-text("Download PDF")');
  if (downloadBtn) {
    console.log('Clicking Download PDF...');
    await downloadBtn.click();
    await page.waitForTimeout(2000);
    console.log('PDF generation finished.');
  } else {
    console.log('Could not find Download PDF button');
  }
  
  await browser.close();
})();
