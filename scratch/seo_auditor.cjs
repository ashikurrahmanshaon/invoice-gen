const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.error("No dist/ directory found. Run build first.");
  process.exit(1);
}

// Recursively find all HTML files
function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.html')) filelist.push(dirFile);
    }
  });
  return filelist;
}

const htmlFiles = walkSync(distDir);

let results = {
  totalFiles: htmlFiles.length,
  files: [],
  titles: new Map(),
  descriptions: new Map(),
  h1s: new Map(),
  internalLinks: new Map(),
  brokenLinks: [],
  orphanPages: [],
  missingAltImages: [],
  sitemapMissing: [],
  rssMissing: [],
  redirectChains: [], // Simulated logic for redirects
  duplicateContent: [],
  schemas: {
    FAQPage: 0,
    BreadcrumbList: 0,
    SoftwareApplication: 0,
    Organization: 0
  }
};

const allPaths = htmlFiles.map(f => {
  let p = f.replace(distDir, '').replace(/\\/g, '/');
  if (p.endsWith('/index.html')) p = p.replace('/index.html', '/');
  if (p === '/index.html') p = '/';
  return p;
});

// Load Sitemap and RSS
let sitemapContent = '';
let rssContent = '';
try { sitemapContent = fs.readFileSync(path.join(distDir, 'sitemap.xml'), 'utf8'); } catch (e) {}
try { rssContent = fs.readFileSync(path.join(distDir, 'rss.xml'), 'utf8'); } catch (e) {}

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let urlPath = file.replace(distDir, '').replace(/\\/g, '/');
  if (urlPath.endsWith('/index.html')) urlPath = urlPath.replace('/index.html', '/');
  if (urlPath === '/index.html') urlPath = '/';

  // 1. Metadata
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  const descMatch = content.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/i);
  const desc = descMatch ? descMatch[1].trim() : null;

  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : null;

  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([\s\S]*?)"\s*\/?>/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

  // Social
  const ogTitle = content.match(/<meta\s+property="og:title"/i) ? true : false;
  const twitterCard = content.match(/<meta\s+name="twitter:card"/i) ? true : false;

  // JSON-LD
  const hasFAQ = content.includes('"@type": "FAQPage"');
  const hasBreadcrumb = content.match(/"@type"\s*:\s*"BreadcrumbList"/);
  const hasSoftware = content.includes('"@type": "SoftwareApplication"');
  const hasOrg = content.includes('"@type": "Organization"');

  if (hasFAQ) results.schemas.FAQPage++;
  if (hasBreadcrumb) results.schemas.BreadcrumbList++;
  if (hasSoftware) results.schemas.SoftwareApplication++;
  if (hasOrg) results.schemas.Organization++;

  // Image ALT
  const imgTags = content.match(/<img[^>]+>/gi) || [];
  let missingAlt = false;
  imgTags.forEach(img => {
    if (!img.match(/alt="[^"]*"/i)) {
      missingAlt = true;
      results.missingAltImages.push({ file: urlPath, img });
    }
  });

  // Links
  const linkTags = content.match(/<a\s+[^>]*href="([^"]+)"/gi) || [];
  let outLinks = [];
  linkTags.forEach(lt => {
    const hrefMatch = lt.match(/href="([^"]+)"/i);
    if (hrefMatch) {
      let href = hrefMatch[1];
      if (href.startsWith('/')) {
        outLinks.push(href);
        
        // Track inbound
        if (!results.internalLinks.has(href)) {
          results.internalLinks.set(href, 0);
        }
        results.internalLinks.set(href, results.internalLinks.get(href) + 1);

        // Broken link check
        let normalizedHref = href.split('?')[0].split('#')[0];
        if (!allPaths.includes(normalizedHref) && normalizedHref !== '/') {
           results.brokenLinks.push({ source: urlPath, target: href });
        }
      }
    }
  });

  // Sitemap & RSS
  if (sitemapContent && !sitemapContent.includes(`<loc>https://invoice-gen.net${urlPath}</loc>`)) {
    results.sitemapMissing.push(urlPath);
  }
  if (urlPath.startsWith('/blog/') && rssContent && !rssContent.includes(`https://invoice-gen.net${urlPath}`)) {
    results.rssMissing.push(urlPath);
  }

  // Cannibalization Checks
  if (title) {
    if (results.titles.has(title)) results.titles.get(title).push(urlPath);
    else results.titles.set(title, [urlPath]);
  }
  if (desc) {
    if (results.descriptions.has(desc)) results.descriptions.get(desc).push(urlPath);
    else results.descriptions.set(desc, [urlPath]);
  }
  if (h1) {
    if (results.h1s.has(h1)) results.h1s.get(h1).push(urlPath);
    else results.h1s.set(h1, [urlPath]);
  }

  results.files.push({
    url: urlPath,
    title, desc, h1, canonical, ogTitle, twitterCard,
    schemas: { FAQ: hasFAQ, Breadcrumb: hasBreadcrumb, Software: hasSoftware, Org: hasOrg },
    outLinksCount: outLinks.length
  });
});

// Orphan checks
allPaths.forEach(p => {
  if (p !== '/' && (!results.internalLinks.has(p) || results.internalLinks.get(p) === 0)) {
    results.orphanPages.push(p);
  }
});

fs.writeFileSync(path.join(__dirname, 'seo_report.json'), JSON.stringify(results, (key, value) => {
  if (value instanceof Map) {
    return Object.fromEntries(value);
  } else {
    return value;
  }
}, 2));

console.log("Audit complete. Results saved to scratch/seo_report.json.");
