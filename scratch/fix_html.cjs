const fs = require('fs');
const path = require('path');

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
publicFiles.push(path.join(__dirname, '..', 'index.html'));

publicFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix broken links
  const fixes = {
    'href="/blog/"': 'href="/"',
    'href="/templates/"': 'href="/"',
    'href="/trust-center/"': 'href="/trust/"',
    'href="/blog/freelance-invoice-checklist-before-sending/"': 'href="/"'
  };

  for (let [bad, good] of Object.entries(fixes)) {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  }

  // Inject Breadcrumbs if missing
  if (file.includes('blog') && !content.includes('BreadcrumbList')) {
    // Determine path
    let relPath = file.split('public')[1].replace(/\\/g, '/');
    if (relPath.endsWith('index.html')) relPath = relPath.replace('/index.html', '/');

    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].split('|')[0].trim() : 'Blog Post';

    const breadcrumb = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://invoice-gen.net"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://invoice-gen.net/blog/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${title.replace(/"/g, '\\"')}",
          "item": "https://invoice-gen.net${relPath}"
        }
      ]
    }
    </script>
    `;
    
    content = content.replace('</head>', `${breadcrumb}\n  </head>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed HTML in ${file}`);
  }
});
