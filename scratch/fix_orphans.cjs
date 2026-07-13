const fs = require('fs');
const path = require('path');

// Generate the directory links block
const allLinks = [
  { url: '/blog/charging-late-fees-terms-and-best-practices/', text: 'Charging Late Fees' },
  { url: '/blog/choosing-the-best-payment-terms-for-freelancers/', text: 'Best Payment Terms' },
  { url: '/blog/handling-down-payments-and-deposits/', text: 'Down Payments' },
  { url: '/blog/how-to-create-your-first-invoice/', text: 'First Invoice Guide' },
  { url: '/blog/how-to-follow-up-on-unpaid-invoices/', text: 'Follow Up Unpaid Invoices' },
  { url: '/blog/how-to-invoice-clients-internationally/', text: 'Invoice Internationally' },
  { url: '/blog/how-to-invoice-for-hourly-work/', text: 'Hourly Work Invoicing' },
  { url: '/blog/how-to-invoice-for-mileage-reimbursement/', text: 'Mileage Reimbursement' },
  { url: '/blog/how-to-request-milestone-payments/', text: 'Milestone Payments' },
  { url: '/blog/how-to-write-a-professional-invoice/', text: 'Professional Invoice' },
  { url: '/blog/invoice-date-vs-due-date-difference/', text: 'Invoice Date vs Due Date' },
  { url: '/blog/invoicing-for-creative-licenses-and-royalties/', text: 'Creative Licenses' },
  { url: '/blog/legal-options-when-client-refuses-to-pay/', text: 'Legal Options for Unpaid' },
  { url: '/blog/what-is-a-debit-note-differences-explained/', text: 'Debit Note Explained' },
  { url: '/blog/what-is-net-30-and-how-to-use-it/', text: 'Net 30 Terms' },
  { url: '/blog/when-to-use-a-commercial-invoice/', text: 'Commercial Invoice' },
  { url: '/blog/writing-an-invoice-under-a-retainer/', text: 'Retainer Invoice' },
  { url: '/compare/adobe-express-invoice-alternative/', text: 'Adobe Express Alternative' },
  { url: '/compare/invoice-generator-alternative/', text: 'Invoice Generator Alternative' },
  { url: '/compare/invoice-simple-alternative/', text: 'Invoice Simple Alternative' },
  { url: '/invoice-app/', text: 'Invoice App' },
  { url: '/invoice-pdf-generator/', text: 'Invoice PDF Generator' },
  { url: '/invoice-software/', text: 'Invoice Software' },
  { url: '/invoice-template/', text: 'Invoice Template' },
  { url: '/online-invoice-generator/', text: 'Online Invoice Generator' },
  { url: '/professional-invoice-generator/', text: 'Professional Invoice Generator' },
  { url: '/templates/architect/', text: 'Architect Template' },
  { url: '/templates/business-coach/', text: 'Business Coach Template' },
  { url: '/templates/carpenter/', text: 'Carpenter Template' },
  { url: '/templates/data-analyst/', text: 'Data Analyst Template' },
  { url: '/templates/editor-proofreader/', text: 'Editor Template' },
  { url: '/templates/electrician/', text: 'Electrician Template' },
  { url: '/templates/event-planner/', text: 'Event Planner Template' },
  { url: '/templates/gardener/', text: 'Gardener Template' },
  { url: '/templates/handyman/', text: 'Handyman Template' },
  { url: '/templates/hvac-technician/', text: 'HVAC Template' },
  { url: '/templates/interior-designer/', text: 'Interior Designer Template' },
  { url: '/templates/it-support/', text: 'IT Support Template' },
  { url: '/templates/landscaping/', text: 'Landscaping Template' },
  { url: '/templates/painter-contractor/', text: 'Painter Template' },
  { url: '/templates/pet-sitter/', text: 'Pet Sitter Template' },
  { url: '/templates/plumber/', text: 'Plumber Template' },
  { url: '/templates/project-manager/', text: 'Project Manager Template' },
  { url: '/templates/roofer/', text: 'Roofer Template' },
  { url: '/templates/translator/', text: 'Translator Template' },
  { url: '/templates/voiceover-artist/', text: 'Voiceover Template' }
];

let linksHtml = '<div style="background: #F8FAFC; padding: 40px 24px; border-top: 1px solid #E2E8F0; margin-top: 60px;"><div style="max-width: 1000px; margin: 0 auto;"><h4 style="font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 16px;">Invoice-Gen.net Directory</h4><div style="display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 13px;">';
allLinks.forEach(l => {
  linksHtml += `<a href="${l.url}" style="color: #64748b; text-decoration: none;">${l.text}</a>`;
});
linksHtml += '</div></div></div>';

// 1. Inject into index.html
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
if (!indexHtml.includes('Invoice-Gen.net Directory')) {
  // Find the closing footer tag or closing body
  indexHtml = indexHtml.replace('</footer>', `</footer>\n    ${linksHtml}`);
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log('Injected directory into index.html');
}

// 2. Inject into all existing files in public/
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

const publicFiles = walkSync(path.join(__dirname, '..', 'public'));
publicFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('Invoice-Gen.net Directory')) {
    if (content.includes('</footer>')) {
      content = content.replace('</footer>', `</footer>\n  ${linksHtml}`);
    } else {
      content = content.replace('</body>', `  ${linksHtml}\n</body>`);
    }
    fs.writeFileSync(file, content);
  }
});
console.log(`Injected directory into ${publicFiles.length} public files`);

// 3. Update Sitemap
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const missingPages = [
  '/author/invoice-gen-editorial-team/',
  '/compare/adobe-express-invoice-alternative/',
  '/compare/invoice-generator-alternative/',
  '/compare/invoice-simple-alternative/',
  '/editorial-policy/'
];

missingPages.forEach(p => {
  if (!sitemapContent.includes(`<loc>https://invoice-gen.net${p}</loc>`)) {
    sitemapContent = sitemapContent.replace('</urlset>', `  <url>\n    <loc>https://invoice-gen.net${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n</urlset>`);
  }
});
fs.writeFileSync(sitemapPath, sitemapContent);
console.log('Updated sitemap.xml');

// 4. Update generator scripts to include the directory block
const generatorFiles = ['generate_seo_pages.cjs', 'publish_article.cjs', 'publish_growth_content.cjs'];
generatorFiles.forEach(gen => {
  const genPath = path.join(__dirname, '..', gen);
  if (fs.existsSync(genPath)) {
    let genContent = fs.readFileSync(genPath, 'utf8');
    if (!genContent.includes('Invoice-Gen.net Directory')) {
      // Escape for template literals
      const escapedLinksHtml = linksHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');
      genContent = genContent.replace(/<\/body>/g, `  ${escapedLinksHtml}\n</body>`);
      fs.writeFileSync(genPath, genContent);
      console.log(`Updated ${gen} to include directory on generation`);
    }
  }
});
