const fs = require('fs');
const path = require('path');

console.log("Starting SEO fixes...");

// 1. Fix index.html H1
const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
if (!indexHtml.includes('<h1 class="sr-only">Free Invoice Generator</h1>')) {
  indexHtml = indexHtml.replace('<body>', '<body>\n    <h1 class="sr-only" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">Free Invoice Generator</h1>');
  fs.writeFileSync(indexPath, indexHtml);
  console.log("Added H1 to index.html");
}

// 2. Fix drafts.cjs related links that point to directories
const draftsPath = path.join(__dirname, '..', 'drafts.cjs');
let draftsContent = fs.readFileSync(draftsPath, 'utf8');
draftsContent = draftsContent.replace(/'\/blog\/'/g, "'/'").replace(/'\/templates\/'/g, "'/'").replace(/'\/trust-center\/'/g, "'/trust/'");
fs.writeFileSync(draftsPath, draftsContent);
console.log("Fixed broken links in drafts.cjs");

// 3. Update publish_article.cjs to inject Breadcrumbs and fix orphan links
const pubArticlePath = path.join(__dirname, '..', 'publish_article.cjs');
let pubArtContent = fs.readFileSync(pubArticlePath, 'utf8');

// Inject breadcrumbs logic in the article generator
if (!pubArtContent.includes('BreadcrumbList')) {
  // Find where Article schema is generated
  const breadcrumbLogic = `
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "\${DOMAIN}/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "\${DOMAIN}/blog/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title.split('|')[0].trim(),
        "item": "\${url}"
      }
    ]
  };
  `;
  
  pubArtContent = pubArtContent.replace(/const articleSchema = {/, breadcrumbLogic + '\n  const articleSchema = {');
  pubArtContent = pubArtContent.replace(/<script type="application\/ld\+json">\s*\$\{JSON\.stringify\(articleSchema, null, 2\)\}\s*<\/script>/, `<script type="application/ld+json">\n      \${JSON.stringify(articleSchema, null, 2)}\n    </script>\n    <script type="application/ld+json">\n      \${JSON.stringify(breadcrumbSchema, null, 2)}\n    </script>`);
  fs.writeFileSync(pubArticlePath, pubArtContent);
  console.log("Injected Breadcrumb logic into publish_article.cjs");
}

// We will fix the orphan links by injecting a massive footer into the generated files in public/ 
// AFTER they are generated, or directly modify the generated files right now.
console.log("SEO fixes script completed.");
