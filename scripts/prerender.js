import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Routes to pre-render
const routes = [
  '/',
  '/templates',
  '/templates/freelance',
  '/templates/consultant',
  '/templates/agency',
  '/templates/contractor',
  '/templates/software',
  '/templates/medical',
  '/blog',
  '/compare',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/trust',
  '/editorial-policy'
];

async function build() {
  
  const root = path.resolve(__dirname, '..');
  
  // Create Vite dev server to use its ssrLoadModule
  const { createServer } = await import('vite');
  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Load the SSR entry
  const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
  
  // Read the index.html template (the one that vite builds or the source one?)
  // For SSG post-build, normally we build the client and server bundles first.
  // But since this is a simple script, we can just use the dev server to render, 
  // then inject into the built `dist/index.html`.
  
  // First, ensure `dist/index.html` exists
  const templatePath = path.resolve(root, 'dist/index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('dist/index.html not found. Run vite build first.');
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  console.log('Generating static pages...');
  
  for (const url of routes) {
    const helmetContext = {};
    const { html } = render(url, helmetContext);
    const { helmet } = helmetContext;

    // Inject the rendered HTML into the template by replacing the entire App Shell block
    let appHtml = template.replace(/<!-- APP_SHELL_START -->[\s\S]*?<!-- APP_SHELL_END -->/, html);
    
    // Replace title and meta tags if helmet provided them
    if (helmet) {
      const headTags = `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.script.toString()}
      `;
      // Naively insert before </head>
      appHtml = appHtml.replace('</head>', `${headTags}</head>`);
    }

    // Determine the output path
    const filePath = url === '/' ? 'index.html' : `${url.replace(/^\//, '')}/index.html`;
    const fullPath = path.resolve(root, 'dist', filePath);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, appHtml);
    console.log(`✓ Pre-rendered ${url} -> ${filePath}`);
  }

  // Generate sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(url => `  <url>
    <loc>https://invoice-gen.net${url === '/' ? '' : url}</loc>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.resolve(root, 'dist', 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');

  await vite.close();
  console.log('Static Site Generation complete.');
}

build().catch(e => {
  console.error(e);
  process.exit(1);
});
