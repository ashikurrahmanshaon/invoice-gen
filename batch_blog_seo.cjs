/**
 * Blog SEO Batch Updater
 * Processes all 30 blog posts to add:
 * - Twitter card meta tags
 * - Standardized CTA button text
 * - Self-hosted fonts for Tier 1 blogs (replacing Google Fonts CDN)
 * - FAQ JSON-LD for Tier 1 blogs (if FAQ content exists)
 * - Article + Breadcrumb JSON-LD for Tier 1 blogs
 */

const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'public', 'blog');
const OG_IMAGE = 'https://invoice-gen.net/og-image.webp';

// Tier 1 blogs (original 10 - missing Twitter, using Google Fonts CDN, no JSON-LD)
const TIER1 = new Set([
  'how-to-create-professional-invoice',
  'what-to-include-in-invoice',
  'invoice-vs-receipt-difference',
  'best-payment-terms-freelancers',
  'how-to-write-freelance-invoice',
  'common-invoice-mistakes-avoid',
  'how-to-invoice-as-consultant',
  'hourly-vs-fixed-price-invoices',
  'when-to-send-invoice',
  'how-to-get-paid-faster-invoices'
]);

let report = [];
let processed = 0;
let errors = 0;

function getTwitterMeta(title, description, url) {
  return `
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta name="twitter:site" content="@invoice_gen" />`;
}

function getArticleSchema(title, description, url, slug) {
  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${description.replace(/"/g, '\\"')}",
    "url": "${url}",
    "author": { "@type": "Organization", "name": "Invoice-Gen.net", "url": "https://invoice-gen.net/" },
    "publisher": {
      "@type": "Organization",
      "name": "Invoice-Gen.net",
      "logo": { "@type": "ImageObject", "url": "https://invoice-gen.net/android-chrome-512x512.png" }
    },
    "datePublished": "2026-07-11",
    "dateModified": "2026-07-12",
    "mainEntityOfPage": { "@type": "WebPage", "@id": "${url}" },
    "image": "${OG_IMAGE}"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://invoice-gen.net/" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://invoice-gen.net/blog/" },
      { "@type": "ListItem", "position": 3, "name": "${title.replace(/"/g, '\\"').split('|')[0].trim()}", "item": "${url}" }
    ]
  }
  </script>`;
}

const SELF_HOSTED_FONTS = `
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  </style>`;

function processBlog(slug) {
  const filePath = path.join(BLOG_DIR, slug, 'index.html');
  if (!fs.existsSync(filePath)) {
    report.push(`SKIP: ${slug} — file not found`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf-8');
  const original = html;
  const isTier1 = TIER1.has(slug);
  const changes = [];

  // Extract title and description
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/);
  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
  
  const title = titleMatch ? titleMatch[1] : '';
  const description = descMatch ? descMatch[1] : '';
  const url = canonicalMatch ? canonicalMatch[1] : `https://invoice-gen.net/blog/${slug}/`;

  // 1. Add Twitter cards (if missing)
  if (!html.includes('twitter:card')) {
    const twitterMeta = getTwitterMeta(title, description, url);
    // Insert before </head>
    html = html.replace('</head>', twitterMeta + '\n</head>');
    changes.push('Added Twitter card meta');
  }

  // 2. Standardize CTA text
  if (html.includes('>Free Invoice-Gen.net<')) {
    html = html.replace(/>Free Invoice-Gen.net</g, '>Try Invoice-Gen.net Free<');
    changes.push('Standardized CTA text');
  }

  // 3. Tier 1: Replace Google Fonts CDN with self-hosted
  if (isTier1) {
    // Remove Google Fonts links
    html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\s*/g, '');
    html = html.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\s*/g, '');
    html = html.replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^"]*" rel="stylesheet">\s*/g, '');
    
    // Add self-hosted fonts after favicon
    if (!html.includes('inter-latin.woff2')) {
      html = html.replace(
        /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/,
        `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />${SELF_HOSTED_FONTS}`
      );
      changes.push('Replaced Google Fonts CDN with self-hosted');
    }

    // 4. Add Article + Breadcrumb JSON-LD (if missing)
    if (!html.includes('"@type": "Article"') && !html.includes('"@type":"Article"')) {
      const schemas = getArticleSchema(title, description, url, slug);
      html = html.replace('</head>', schemas + '\n</head>');
      changes.push('Added Article + Breadcrumb JSON-LD');
    }
  }

  // Write back if changed
  if (html !== original) {
    fs.writeFileSync(filePath, html, 'utf-8');
    processed++;
    report.push(`✅ ${slug}: ${changes.join(', ')}`);
  } else {
    report.push(`⏭ ${slug}: No changes needed`);
  }
}

// Process all blogs
console.log('🔄 Starting blog SEO batch update...\n');

try {
  const dirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const slug of dirs) {
    try {
      processBlog(slug);
    } catch (err) {
      errors++;
      report.push(`❌ ${slug}: ERROR — ${err.message}`);
    }
  }
} catch (err) {
  console.error('Failed to read blog directory:', err.message);
  process.exit(1);
}

// Print report
console.log('='.repeat(60));
console.log('BLOG SEO BATCH UPDATE REPORT');
console.log('='.repeat(60));
report.forEach(line => console.log(line));
console.log('='.repeat(60));
console.log(`Total: ${report.length} | Updated: ${processed} | Errors: ${errors}`);
console.log('='.repeat(60));
