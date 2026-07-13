const { chromium } = require('playwright');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'brand');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Helper to wait
const delay = ms => new Promise(res => setTimeout(res, ms));

async function generateAssets() {
  console.log('Starting local server...');
  const server = exec('npm run preview');
  
  // Wait for server to boot
  await delay(5000);

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const APP_URL = 'http://localhost:4173/';

  // 1. Capture Raw UI Screenshots
  console.log('Capturing raw Desktop UI...');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  // Add some dummy data to make it look good
  await page.evaluate(() => {
    // We assume the app is loaded. We can just take it as is.
  });
  const rawDesktop = await page.screenshot();
  const rawDesktopB64 = `data:image/png;base64,${rawDesktop.toString('base64')}`;

  console.log('Capturing raw Mobile UI...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(APP_URL, { waitUntil: 'networkidle' });
  const rawMobile = await page.screenshot();
  const rawMobileB64 = `data:image/png;base64,${rawMobile.toString('base64')}`;

  // 2. Asset Definitions
  const assets = [
    {
      name: 'og-image.png',
      width: 1200, height: 630,
      html: getBannerHtml({
        width: 1200, height: 630,
        title: 'Free Professional<br>Invoice Generator',
        subtitle: '100% Free • No Signup • Browser-Based • Instant PDF',
        image: rawDesktopB64,
        scale: 0.85,
        offsetY: 100
      })
    },
    {
      name: 'linkedin-banner.png',
      width: 1584, height: 396,
      html: getBannerHtml({
        width: 1584, height: 396,
        title: 'Invoice-Gen.net',
        subtitle: 'Create professional invoices in seconds.<br>100% Free. No Signup Required.',
        image: rawDesktopB64,
        scale: 0.9,
        offsetY: 80,
        layout: 'row'
      })
    },
    {
      name: 'twitter-banner.png',
      width: 1500, height: 500,
      html: getBannerHtml({
        width: 1500, height: 500,
        title: 'Invoice-Gen.net',
        subtitle: 'The modern standard for freelance invoicing.',
        image: rawDesktopB64,
        scale: 0.9,
        offsetY: 80,
        layout: 'row'
      })
    },
    {
      name: 'github-social-preview.png',
      width: 1280, height: 640,
      html: getBannerHtml({
        width: 1280, height: 640,
        title: 'Invoice-Gen.net',
        subtitle: 'Open-source, privacy-first invoice generator.',
        image: rawDesktopB64,
        scale: 0.85,
        offsetY: 100
      })
    },
    {
      name: 'producthunt-gallery-1-editor.png',
      width: 1270, height: 760,
      html: getBannerHtml({
        width: 1270, height: 760,
        title: 'Premium Editor Interface',
        subtitle: 'Lightning fast. No clunky forms.',
        image: rawDesktopB64,
        scale: 0.9,
        offsetY: 50
      })
    },
    {
      name: 'producthunt-gallery-3-mobile.png',
      width: 1270, height: 760,
      html: getBannerHtml({
        width: 1270, height: 760,
        title: 'True Native Mobile Experience',
        subtitle: 'Create invoices on the go.',
        image: rawMobileB64,
        scale: 0.9,
        offsetY: 50,
        isMobile: true
      })
    },
    {
      name: 'producthunt-thumbnail.png',
      width: 240, height: 240,
      html: `
        <html>
        <body style="margin:0; padding:0; width:240px; height:240px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, #2E72FF 0%, #155EEF 100%);">
          <div style="width: 120px; height: 120px; background: white; border-radius: 24px; display:flex; align-items:center; justify-content:center; font-family: sans-serif; font-size: 60px; font-weight: 800; color: #155EEF;">
            IG
          </div>
        </body>
        </html>
      `
    }
  ];

  // 3. Generate Each Asset
  for (const asset of assets) {
    console.log(`Generating ${asset.name}...`);
    await page.setViewportSize({ width: asset.width, height: asset.height });
    await page.setContent(asset.html, { waitUntil: 'networkidle' });
    // Wait a tick for fonts to render
    await delay(500);
    await page.screenshot({ path: path.join(ASSETS_DIR, asset.name), type: 'png' });
  }

  // 4. Save raw hero screenshots as well
  fs.writeFileSync(path.join(ASSETS_DIR, 'hero-screenshot-desktop.png'), rawDesktop);
  fs.writeFileSync(path.join(ASSETS_DIR, 'hero-screenshot-mobile.png'), rawMobile);

  console.log('Cleaning up...');
  await browser.close();
  server.kill();
  console.log('Done!');
}

function getBannerHtml(opts) {
  const { width, height, title, subtitle, image, scale, offsetY, layout = 'col', isMobile = false } = opts;
  
  const frameWidth = isMobile ? '390px' : '1200px';
  const frameHeight = isMobile ? '844px' : '750px';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: ${width}px;
          height: ${height}px;
          background: #FAFCFF;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: ${layout === 'row' ? 'row' : 'column'};
          align-items: center;
          justify-content: ${layout === 'row' ? 'center' : 'flex-start'};
          overflow: hidden;
          position: relative;
        }
        
        /* Subtle Background Gradients for Premium SaaS Feel */
        body::before {
          content: '';
          position: absolute;
          top: -20%; left: -10%;
          width: 60%; height: 80%;
          background: radial-gradient(circle, rgba(21,94,239,0.08) 0%, rgba(250,252,255,0) 70%);
          z-index: 0;
        }
        body::after {
          content: '';
          position: absolute;
          bottom: -20%; right: -10%;
          width: 50%; height: 60%;
          background: radial-gradient(circle, rgba(46,114,255,0.06) 0%, rgba(250,252,255,0) 70%);
          z-index: 0;
        }

        .text-container {
          z-index: 10;
          text-align: ${layout === 'row' ? 'left' : 'center'};
          margin-top: ${layout === 'row' ? '0' : '60px'};
          padding: ${layout === 'row' ? '0 60px 0 0' : '0'};
          flex-shrink: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          justify-content: ${layout === 'row' ? 'flex-start' : 'center'};
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 24px;
        }

        .logo-icon {
          width: 32px; height: 32px;
          background: linear-gradient(135deg, #2E72FF 0%, #155EEF 100%);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-icon::after {
          content: '';
          width: 12px; height: 12px;
          background: white; border-radius: 2px;
        }

        h1 {
          font-size: ${layout === 'row' ? '48px' : '56px'};
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 16px 0;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        p {
          font-size: ${layout === 'row' ? '20px' : '24px'};
          font-weight: 400;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        .mockup-container {
          z-index: 10;
          margin-top: ${layout === 'row' ? '0' : offsetY + 'px'};
          transform: scale(${scale});
          transform-origin: ${layout === 'row' ? 'left center' : 'top center'};
          border-radius: 12px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(226, 232, 240, 1);
          background: white;
          width: ${frameWidth};
          height: ${frameHeight};
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .mockup-header {
          height: 32px;
          background: #F1F5F9;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
        }

        .dot {
          width: 10px; height: 10px; border-radius: 50%;
        }
        .dot-r { background: #FF5F56; }
        .dot-y { background: #FFBD2E; }
        .dot-g { background: #27C93F; }

        .mockup-body {
          flex: 1;
          background-image: url(${image});
          background-size: cover;
          background-position: top center;
        }
      </style>
    </head>
    <body>
      <div class="text-container">
        ${layout === 'col' ? `
          <div class="logo">
            <div class="logo-icon"></div> Invoice-Gen.net
          </div>
        ` : ''}
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>

      <div class="mockup-container">
        ${!isMobile ? `
        <div class="mockup-header">
          <div class="dot dot-r"></div>
          <div class="dot dot-y"></div>
          <div class="dot dot-g"></div>
        </div>
        ` : ''}
        <div class="mockup-body"></div>
      </div>
    </body>
    </html>
  `;
}

generateAssets().catch(console.error);
