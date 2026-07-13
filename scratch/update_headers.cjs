const fs = require('fs');
const path = require('path');

const NEW_HEADER_HTML = `
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
  </header>`;

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <header>...</header> with new header
  const regex = /<header[\s\S]*?<\/header>/i;
  
  if (regex.test(content)) {
    content = content.replace(regex, NEW_HEADER_HTML);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  } else {
    console.log('No <header> found in:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
      updateFile(fullPath);
    }
  }
}

// Update all HTML files in public/
const publicDir = path.join(__dirname, '../public');
if (fs.existsSync(publicDir)) {
  walkDir(publicDir);
}

// Update the generate scripts templates
const scriptsToUpdate = ['generate_seo_pages.cjs', 'publish_growth_content.cjs', 'publish_article.cjs'];
for (const script of scriptsToUpdate) {
  const scriptPath = path.join(__dirname, '../', script);
  if (fs.existsSync(scriptPath)) {
    let content = fs.readFileSync(scriptPath, 'utf8');
    // Replace <header>...</header> in the template string
    const regex = /<header[\s\S]*?<\/header>/i;
    if (regex.test(content)) {
      content = content.replace(regex, NEW_HEADER_HTML.replace(/\$/g, '$$$$')); // Escape $ for replace
      fs.writeFileSync(scriptPath, content, 'utf8');
      console.log('Updated Script:', scriptPath);
    }
  }
}

console.log('Done!');
