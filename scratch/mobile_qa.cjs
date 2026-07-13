const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const breakpoints = [
  { width: 320, height: 568, name: 'iPhone_SE_1st' },
  { width: 360, height: 800, name: 'Android_Small' },
  { width: 375, height: 667, name: 'iPhone_SE_2nd' },
  { width: 390, height: 844, name: 'iPhone_13' },
  { width: 412, height: 915, name: 'Pixel_7' },
  { width: 430, height: 932, name: 'iPhone_15_Pro_Max' },
  { width: 768, height: 1024, name: 'iPad_Mini' }
];

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'qa');

async function runMobileQA() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🚀 Starting Mobile UX QA Audit...');

  const browser = await chromium.launch({ headless: true });
  
  for (const bp of breakpoints) {
    console.log(`Testing Breakpoint: ${bp.width}px (${bp.name})...`);
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    const page = await context.newPage();

    // Setup an error listener
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`[Browser Error]: ${msg.text()}`);
    });

    try {
      await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

      // Take screenshot of Stage 1 (Business)
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${bp.name}_01_business.png`) });

      // Click Continue to Stage 2
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(500); // Wait for transition
      
      // Stage 2 (Client)
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${bp.name}_02_client.png`) });

      // Click Continue to Stage 3
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(500);

      // Stage 3 (Items)
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${bp.name}_03_items.png`) });

      // Click Review to Stage 4
      await page.click('button:has-text("Review")');
      await page.waitForTimeout(500);

      // Stage 4 (Review)
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${bp.name}_04_review.png`) });

      // Open PDF Preview
      await page.click('button:has-text("Preview")');
      await page.waitForTimeout(1000); // Wait for rendering
      await page.screenshot({ path: path.join(OUTPUT_DIR, `${bp.name}_05_preview.png`) });
      
    } catch (e) {
      console.log(`Failed at ${bp.name}:`, e.message);
    }

    await context.close();
  }

  await browser.close();
  console.log('✅ Mobile UX QA Audit Complete.');
}

runMobileQA();
