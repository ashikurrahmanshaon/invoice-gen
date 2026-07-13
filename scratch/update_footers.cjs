const fs = require('fs');
const path = require('path');

const newFooterHtml = `  <footer id="main-footer" style="background: var(--color-background); color: var(--color-text-secondary); padding: 64px 0 32px 0; font-size: 14px; border-top: 1px solid var(--color-border); font-family: var(--font-family); margin-top: 64px;">
    <div class="container" style="display: flex; flex-direction: column; gap: 48px; max-width: 1000px; margin: 0 auto; padding: 0 24px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px;">
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 24px; height: 24px; background: #2563EB; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <span style="font-size: 16px; font-weight: 700; letter-spacing: -0.02em; color: var(--color-text-main); line-height: 1;">Invoice-Gen.net</span>
          </div>
          <p style="color: var(--color-text-secondary); font-size: 14px; line-height: 1.5; margin: 0; max-width: 280px;">100% browser-native utility. Watermark-free, professional invoices generated instantly.</p>
        </div>
        <div>
          <div style="color: var(--color-text-main); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Product</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Invoice Generator</a>
            <a href="/templates/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Templates</a>
            <a href="/trust/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Trust Center</a>
          </div>
        </div>
        <div>
          <div style="color: var(--color-text-main); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Resources</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="/blog/how-to-create-professional-invoice/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Create Invoice Guide</a>
            <a href="/blog/what-to-include-in-invoice/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">What to Include</a>
            <a href="/blog/invoice-vs-receipt-difference/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Invoice vs Receipt</a>
            <a href="/blog/best-payment-terms-freelancers/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Payment Terms</a>
          </div>
        </div>
        <div>
          <div style="color: var(--color-text-main); font-weight: 600; font-size: 14px; margin-bottom: 16px;">Company</div>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="/about/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">About</a>
            <a href="/contact/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Contact</a>
            <a href="/privacy/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Privacy Policy</a>
            <a href="/terms/" style="color: var(--color-text-secondary); text-decoration: none; font-size: 14px;">Terms of Service</a>
          </div>
        </div>
      </div>
      <div style="border-top: 1px solid var(--color-border); padding-top: 24px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px; color: var(--color-text-tertiary); font-size: 13px;">
        <span>&copy; ${new Date().getFullYear()} Invoice-Gen.net. All rights reserved.</span>
        <span style="display: flex; align-items: center; gap: 8px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Security verified. Local browser storage only.
        </span>
      </div>
    </div>
    <style>#main-footer a:hover { color: var(--color-text-main) !important; }</style>
  </footer>`;

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let count = 0;
walkDir(path.join(__dirname, '../public'), function(filePath) {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace everything from <footer to </footer>
    // Be careful with multiple footers or different formats
    const footerRegex = /<footer[\s\S]*?<\/footer>/i;
    if (footerRegex.test(content)) {
      content = content.replace(footerRegex, newFooterHtml);
      fs.writeFileSync(filePath, content, 'utf8');
      count++;
    }
  }
});
console.log('Updated footers in', count, 'files');
