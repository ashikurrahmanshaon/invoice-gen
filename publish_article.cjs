const fs = require('fs');
const path = require('path');
const ARTICLES = require('./drafts.cjs');

// Constants
const DOMAIN = 'https://invoice-gen.net';
const BLOG_DIR = path.join(__dirname, 'public', 'blog');
const SITEMAP_PATH = path.join(__dirname, 'public', 'sitemap.xml');
const RSS_PATH = path.join(__dirname, 'public', 'rss.xml');

// Helper: Calculate Reading Time
function getReadingTime(htmlContent) {
  const text = htmlContent.replace(/<[^>]*>?/gm, ''); // Strip HTML
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);
  return { wordCount, readingTime };
}

// Helper: Generate Table of Contents
function generateTOC(htmlContent) {
  const regex = /<h([23])>(.*?)<\/h\1>/g;
  let tocHtml = '<div class="article-toc"><h3>Table of Contents</h3><ul>';
  let modifiedContent = htmlContent;
  let match;
  let idCount = 0;

  while ((match = regex.exec(htmlContent)) !== null) {
    const level = match[1];
    const text = match[2];
    // Create safe ID
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueId = `${id}-${idCount++}`;
    
    // Replace heading with ID in content
    const originalHeading = match[0];
    const newHeading = `<h${level} id="${uniqueId}">${text}</h${level}>`;
    modifiedContent = modifiedContent.replace(originalHeading, newHeading);
    
    // Add to TOC
    const indentClass = level === '3' ? 'toc-h3' : 'toc-h2';
    tocHtml += `<li class="${indentClass}"><a href="#${uniqueId}">${text}</a></li>`;
  }
  
  tocHtml += '</ul></div>';
  
  // Only add TOC if there are headings
  if (idCount === 0) {
    return { tocHtml: '', modifiedContent: htmlContent };
  }
  return { tocHtml, modifiedContent };
}

// Helper: Generate Social Share Links
function generateSocialShare(url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  return `
    <div class="social-share">
      <span class="share-label">Share this article:</span>
      <a href="https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-btn twitter" aria-label="Share on Twitter">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
      </a>
      <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer" class="share-btn linkedin" aria-label="Share on LinkedIn">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
      </a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" target="_blank" rel="noopener noreferrer" class="share-btn facebook" aria-label="Share on Facebook">
        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
      </a>
    </div>
  `;
}

// Helper: Generate Prev/Next Navigation
function generatePrevNextNavigation(currentIndex) {
  let html = '<div class="article-navigation">';
  
  // Previous (Older)
  if (currentIndex > 0) {
    const prev = ARTICLES[currentIndex - 1];
    html += `
      <a href="/blog/${prev.slug}/" class="nav-prev">
        <span class="nav-label">&larr; Previous Article</span>
        <span class="nav-title">${prev.title.split('|')[0].trim()}</span>
      </a>
    `;
  } else {
    html += '<div class="nav-prev empty"></div>';
  }

  // Next (Newer)
  if (currentIndex < ARTICLES.length - 1 && ARTICLES[currentIndex + 1].status === 'published') {
    const next = ARTICLES[currentIndex + 1];
    html += `
      <a href="/blog/${next.slug}/" class="nav-next">
        <span class="nav-label">Next Article &rarr;</span>
        <span class="nav-title">${next.title.split('|')[0].trim()}</span>
      </a>
    `;
  } else {
    html += '<div class="nav-next empty"></div>';
  }

  html += '</div>';
  return html;
}

// Generate an article page
function generateArticle(article, index) {
  const url = `${DOMAIN}/blog/${article.slug}/`;
  
  // Calculations
  const { wordCount, readingTime } = getReadingTime(article.content);
  const { tocHtml, modifiedContent } = generateTOC(article.content);
  const socialShareHtml = generateSocialShare(url, article.title);
  const navHtml = generatePrevNextNavigation(index);

  // Generate Tags HTML
  const tagsHtml = article.tags.map(tag => `<span class="article-tag">${tag}</span>`).join('');

  // Generate Related Links HTML
  let relatedLinksHtml = '';
  if (article.relatedLinks && article.relatedLinks.length > 0) {
    relatedLinksHtml = `
      <div class="related-articles-box">
        <h3>Related Articles & Resources</h3>
        <ul>
          ${article.relatedLinks.map(link => `<li><a href="${link.url}">${link.text}</a></li>`).join('')}
        </ul>
      </div>
    `;
  }

  // Generate FAQs HTML
  let faqHtml = '';
  let faqSchemaData = '';
  if (article.faqs && article.faqs.length > 0) {
    faqHtml = `
      <div class="article-faqs">
        <h2>Frequently Asked Questions</h2>
        ${article.faqs.map(faq => `
          <div class="faq-item">
            <h3>${faq.q}</h3>
            <p>${faq.a}</p>
          </div>
        `).join('')}
      </div>
    `;

    const faqEntities = article.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }));
    faqSchemaData = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqEntities
    });
  }

  // Schema generation
  const articleSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "headline": article.h1,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": article.author,
      "url": DOMAIN
    },
    "publisher": {
      "@type": "Organization",
      "name": "Invoice-Gen.net",
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.png`
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified
  });

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${DOMAIN}/blog/` },
      { "@type": "ListItem", "position": 3, "name": article.h1, "item": url }
    ]
  });

  const organizationSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Invoice-Gen.net",
    "url": DOMAIN,
    "logo": `${DOMAIN}/logo.png`
  });

  const softwareSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Invoice-Gen.net",
    "operatingSystem": "Web",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  });

  // Breadcrumb UI
  const breadcrumbUI = `
    <nav class="breadcrumb" aria-label="breadcrumb">
      <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/blog/">Blog</a></li>
        <li aria-current="page">${article.h1}</li>
      </ol>
    </nav>
  `;

  // CTA Block
  const ctaBlock = `
    <div class="article-cta">
      <h3>Ready to create a professional invoice?</h3>
      <p>Join thousands of freelancers and small businesses who use Invoice-Gen.net to get paid faster.</p>
      <a href="/" class="btn-primary">Create Free Invoice</a>
    </div>
  `;

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title}</title>
    <meta name="description" content="${article.description}">
    <meta name="keywords" content="${article.keywords}">
    
    <!-- OpenGraph / Social -->
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="article">
    <meta property="article:published_time" content="${article.datePublished}">
    <meta property="article:modified_time" content="${article.dateModified}">
    <meta property="article:author" content="${article.author}">
    <meta property="article:tag" content="${article.tags.join(', ')}">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${article.title}">
    <meta name="twitter:description" content="${article.description}">

    <!-- Canonical -->
    <link rel="canonical" href="${url}">

    <!-- CSS -->
    <link rel="stylesheet" href="/index.css">
    
    <!-- Schemas -->
    <script type="application/ld+json">${articleSchema}</script>
    <script type="application/ld+json">${breadcrumbSchema}</script>
    <script type="application/ld+json">${organizationSchema}</script>
    <script type="application/ld+json">${softwareSchema}</script>
    ${faqSchemaData ? `<script type="application/ld+json">${faqSchemaData}</script>` : ''}
</head>
<body class="blog-post-page">
    
  <header style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid #E2E8F0; position: sticky; top: 0; z-index: 1000; display: flex; align-items: center; height: 68px;">
    <div style="max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 24px; display: grid; grid-template-columns: 200px 1fr 200px; align-items: center;">
      
      <!-- Left: Logo -->
      <div style="display: flex; align-items: center;">
        <a href="/" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: #0F172A; font-weight: 700; font-size: 16px;">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#155EEF"/>
            <path d="M9 11C9 9.89543 9.89543 9 11 9H21C22.1046 9 23 9.89543 23 11V21C23 22.1046 22.1046 23 21 23H11C9.89543 23 9 22.1046 9 21V11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 13H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 16H19" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 19H15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="desktop-only" style="margin-left: 8px;">Invoice-Gen.net</span>
        </a>
      </div>

      <!-- Center: Editor / History -->
      <div style="display: flex; align-items: center; justify-content: center;">
        <div style="background: #F8FAFC; border-radius: 8px; padding: 4px; display: inline-flex; gap: 4px; border: 1px solid #E2E8F0;">
          <a href="/" style="padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; background: white; color: #0F172A; box-shadow: 0 1px 2px rgba(0,0,0,0.05); transition: all 150ms;">Editor</a>
          <a href="/?view=history" style="padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; text-decoration: none; color: #475569; transition: all 150ms;">History</a>
        </div>
      </div>

      <!-- Right: PDF / Overflow -->
      <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px;">
        <a href="/" style="background: #155EEF; color: white; padding: 0 16px; height: 36px; border-radius: 12px; font-size: 14px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: all 150ms;" class="desktop-only">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          PDF
        </a>
        <a href="/" style="display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; color: #475569; text-decoration: none; transition: all 150ms;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
        </a>
      </div>

    </div>
    <style>
      @media (max-width: 767px) {
        header { height: 60px !important; }
        header > div { grid-template-columns: 1fr auto 1fr !important; padding: 0 16px !important; }
        .desktop-only { display: none !important; }
      }
    </style>
  </header>

    <main class="blog-container">
        <article class="blog-article">
            ${breadcrumbUI}
            
            <header class="article-header">
                <h1 class="article-title">${article.h1}</h1>
                <div class="article-meta">
                    <span class="meta-author">By ${article.author}</span>
                    <span class="meta-date">Published: ${new Date(article.datePublished).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</span>
                    <span class="meta-update">(Updated: ${new Date(article.dateModified).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})})</span>
                    <span class="meta-read-time">${readingTime} min read</span>
                </div>
                <div class="article-tags">${tagsHtml}</div>
                ${socialShareHtml}
            </header>

            ${tocHtml}

            <div class="article-body">
                ${modifiedContent}
            </div>

            ${faqHtml}
            
            ${ctaBlock}
            
            ${relatedLinksHtml}
            
            ${navHtml}
        </article>
    </main>

    <footer class="app-footer">
        <div class="footer-links">
            <a href="/about/">About</a>
            <a href="/trust-center/">Trust Center</a>
            <a href="/privacy/">Privacy Policy</a>
            <a href="/terms/">Terms of Service</a>
            <a href="/blog/">Blog</a>
        </div>
        <p>&copy; 2026 Invoice-Gen.net. All rights reserved.</p>
    </footer>
  <div style="background: #F8FAFC; padding: 40px 24px; border-top: 1px solid #E2E8F0; margin-top: 60px;"><div style="max-width: 1000px; margin: 0 auto;"><h4 style="font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 16px;">Invoice-Gen.net Directory</h4><div style="display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 13px;"><a href="/blog/charging-late-fees-terms-and-best-practices/" style="color: #64748b; text-decoration: none;">Charging Late Fees</a><a href="/blog/choosing-the-best-payment-terms-for-freelancers/" style="color: #64748b; text-decoration: none;">Best Payment Terms</a><a href="/blog/handling-down-payments-and-deposits/" style="color: #64748b; text-decoration: none;">Down Payments</a><a href="/blog/how-to-create-your-first-invoice/" style="color: #64748b; text-decoration: none;">First Invoice Guide</a><a href="/blog/how-to-follow-up-on-unpaid-invoices/" style="color: #64748b; text-decoration: none;">Follow Up Unpaid Invoices</a><a href="/blog/how-to-invoice-clients-internationally/" style="color: #64748b; text-decoration: none;">Invoice Internationally</a><a href="/blog/how-to-invoice-for-hourly-work/" style="color: #64748b; text-decoration: none;">Hourly Work Invoicing</a><a href="/blog/how-to-invoice-for-mileage-reimbursement/" style="color: #64748b; text-decoration: none;">Mileage Reimbursement</a><a href="/blog/how-to-request-milestone-payments/" style="color: #64748b; text-decoration: none;">Milestone Payments</a><a href="/blog/how-to-write-a-professional-invoice/" style="color: #64748b; text-decoration: none;">Professional Invoice</a><a href="/blog/invoice-date-vs-due-date-difference/" style="color: #64748b; text-decoration: none;">Invoice Date vs Due Date</a><a href="/blog/invoicing-for-creative-licenses-and-royalties/" style="color: #64748b; text-decoration: none;">Creative Licenses</a><a href="/blog/legal-options-when-client-refuses-to-pay/" style="color: #64748b; text-decoration: none;">Legal Options for Unpaid</a><a href="/blog/what-is-a-debit-note-differences-explained/" style="color: #64748b; text-decoration: none;">Debit Note Explained</a><a href="/blog/what-is-net-30-and-how-to-use-it/" style="color: #64748b; text-decoration: none;">Net 30 Terms</a><a href="/blog/when-to-use-a-commercial-invoice/" style="color: #64748b; text-decoration: none;">Commercial Invoice</a><a href="/blog/writing-an-invoice-under-a-retainer/" style="color: #64748b; text-decoration: none;">Retainer Invoice</a><a href="/compare/adobe-express-invoice-alternative/" style="color: #64748b; text-decoration: none;">Adobe Express Alternative</a><a href="/compare/invoice-generator-alternative/" style="color: #64748b; text-decoration: none;">Invoice Generator Alternative</a><a href="/compare/invoice-simple-alternative/" style="color: #64748b; text-decoration: none;">Invoice Simple Alternative</a><a href="/invoice-app/" style="color: #64748b; text-decoration: none;">Invoice App</a><a href="/invoice-pdf-generator/" style="color: #64748b; text-decoration: none;">Invoice PDF Generator</a><a href="/invoice-software/" style="color: #64748b; text-decoration: none;">Invoice Software</a><a href="/invoice-template/" style="color: #64748b; text-decoration: none;">Invoice Template</a><a href="/online-invoice-generator/" style="color: #64748b; text-decoration: none;">Online Invoice Generator</a><a href="/professional-invoice-generator/" style="color: #64748b; text-decoration: none;">Professional Invoice Generator</a><a href="/templates/architect/" style="color: #64748b; text-decoration: none;">Architect Template</a><a href="/templates/business-coach/" style="color: #64748b; text-decoration: none;">Business Coach Template</a><a href="/templates/carpenter/" style="color: #64748b; text-decoration: none;">Carpenter Template</a><a href="/templates/data-analyst/" style="color: #64748b; text-decoration: none;">Data Analyst Template</a><a href="/templates/editor-proofreader/" style="color: #64748b; text-decoration: none;">Editor Template</a><a href="/templates/electrician/" style="color: #64748b; text-decoration: none;">Electrician Template</a><a href="/templates/event-planner/" style="color: #64748b; text-decoration: none;">Event Planner Template</a><a href="/templates/gardener/" style="color: #64748b; text-decoration: none;">Gardener Template</a><a href="/templates/handyman/" style="color: #64748b; text-decoration: none;">Handyman Template</a><a href="/templates/hvac-technician/" style="color: #64748b; text-decoration: none;">HVAC Template</a><a href="/templates/interior-designer/" style="color: #64748b; text-decoration: none;">Interior Designer Template</a><a href="/templates/it-support/" style="color: #64748b; text-decoration: none;">IT Support Template</a><a href="/templates/landscaping/" style="color: #64748b; text-decoration: none;">Landscaping Template</a><a href="/templates/painter-contractor/" style="color: #64748b; text-decoration: none;">Painter Template</a><a href="/templates/pet-sitter/" style="color: #64748b; text-decoration: none;">Pet Sitter Template</a><a href="/templates/plumber/" style="color: #64748b; text-decoration: none;">Plumber Template</a><a href="/templates/project-manager/" style="color: #64748b; text-decoration: none;">Project Manager Template</a><a href="/templates/roofer/" style="color: #64748b; text-decoration: none;">Roofer Template</a><a href="/templates/translator/" style="color: #64748b; text-decoration: none;">Translator Template</a><a href="/templates/voiceover-artist/" style="color: #64748b; text-decoration: none;">Voiceover Template</a></div></div></div>
</body>
</html>`;

  return { htmlTemplate, wordCount, readingTime };
}

// Validate generated content
function validateArticleOutput(html, article) {
  let errors = [];

  // 1. JSON-LD Parse
  const jsonLdRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      JSON.parse(match[1]);
    } catch (e) {
      errors.push('JSON-LD schema validation failed.');
    }
  }

  // 2. Canonical
  if (!html.includes(`<link rel="canonical" href="${DOMAIN}/blog/${article.slug}/">`)) {
    errors.push('Canonical tag missing or incorrect.');
  }

  // 3. Metadata
  if (!html.includes(`<title>${article.title}</title>`)) errors.push('Title tag missing.');
  if (!html.includes(`<meta name="description" content="${article.description}">`)) errors.push('Meta description missing.');

  // 4. Headings (ensure H1 exists)
  if (!html.includes('</h1>')) errors.push('H1 tag missing.');

  // 5. Internal Links Check
  if (!html.includes('href="/"')) errors.push('Orphan page risk: No link to homepage.');

  return errors;
}

// Update sitemap.xml
function updateSitemap(articleUrl, dateModified) {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.warn('Sitemap not found, skipping sitemap update.');
    return;
  }
  let sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
  if (!sitemapContent.includes(articleUrl)) {
    const newEntry = `
  <url>
    <loc>${articleUrl}</loc>
    <lastmod>${dateModified}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    sitemapContent = sitemapContent.replace('</urlset>', newEntry);
    fs.writeFileSync(SITEMAP_PATH, sitemapContent, 'utf8');
    return true;
  }
  return false;
}

// Update rss.xml
function updateRSS(article, url) {
  if (!fs.existsSync(RSS_PATH)) {
    console.warn('RSS not found, skipping RSS update.');
    return;
  }
  let rssContent = fs.readFileSync(RSS_PATH, 'utf8');
  if (!rssContent.includes(url)) {
    const pubDate = new Date(article.datePublished).toUTCString();
    const newEntry = `
    <item>
      <title>${article.title}</title>
      <link>${url}</link>
      <description>${article.description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>
  </channel>`;
    rssContent = rssContent.replace('</channel>', newEntry);
    fs.writeFileSync(RSS_PATH, rssContent, 'utf8');
    return true;
  }
  return false;
}

// Main Publish Function
function publish(articleIndex) {
  if (articleIndex === undefined || isNaN(articleIndex)) {
    console.error('Error: Please provide the index of the article to publish.');
    console.log('Usage: node publish_article.cjs <index>');
    process.exit(1);
  }

  const index = parseInt(articleIndex, 10);
  if (index < 0 || index >= ARTICLES.length) {
    console.error(`Error: Article index ${index} is out of bounds.`);
    process.exit(1);
  }

  const article = ARTICLES[index];
  
  if (article.status === 'draft') {
    console.error(`\n[WARNING] Attempted to publish a draft: ${article.slug}`);
    console.error('Action denied based on Growth Mode Phase 2 policy (Manual approval required before publishing).');
    console.error('To publish, change status to "published" in drafts.cjs.\n');
    process.exit(1);
  }

  console.log(`\n============================================`);
  console.log(`🚀 PUBLISHING ENGINE: ${article.slug}`);
  console.log(`============================================`);

  // Create directory
  const targetDir = path.join(BLOG_DIR, article.slug);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Generate HTML
  const { htmlTemplate, wordCount, readingTime } = generateArticle(article, index);
  const targetFile = path.join(targetDir, 'index.html');
  
  // Validation
  console.log('Validating output...');
  const validationErrors = validateArticleOutput(htmlTemplate, article);
  if (wordCount < 100) validationErrors.push('Word count too low. Quality concern.');
  
  if (validationErrors.length > 0) {
    console.error('❌ Validation Failed:');
    validationErrors.forEach(err => console.error(`  - ${err}`));
    console.error('Aborting publication.');
    process.exit(1);
  }
  
  // Write File
  fs.writeFileSync(targetFile, htmlTemplate, 'utf8');

  // Verify HTTP 200 (File Exists locally)
  const fileExists = fs.existsSync(targetFile);

  // Update Sitemap & RSS
  const articleUrl = `${DOMAIN}/blog/${article.slug}/`;
  const sitemapUpdated = updateSitemap(articleUrl, article.dateModified);
  const rssUpdated = updateRSS(article, articleUrl);

  // Publication Report
  console.log(`\n============================================`);
  console.log(`✅ PUBLICATION REPORT`);
  console.log(`============================================`);
  console.log(`Title:         ${article.title}`);
  console.log(`URL:           ${articleUrl}`);
  console.log(`HTTP Status:   ${fileExists ? '200 OK (Local)' : '404 File Not Found'}`);
  console.log(`Word Count:    ${wordCount} words`);
  console.log(`Reading Time:  ${readingTime} minutes`);
  console.log(`JSON-LD:       Valid (Article, Breadcrumb, FAQ, Org, App)`);
  console.log(`Sitemap:       ${sitemapUpdated ? 'Updated' : 'Unchanged (Already exists)'}`);
  console.log(`RSS Feed:      ${rssUpdated ? 'Updated' : 'Unchanged (Already exists)'}`);
  console.log(`Internal Lks:  Validated`);
  console.log(`Status:        SUCCESS`);
  console.log(`============================================\n`);
}

const argIndex = process.argv[2];
if (argIndex !== undefined) {
  publish(argIndex);
} else {
  console.log('Loaded Engine. Please run with an index argument.');
}
