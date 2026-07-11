const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(__dirname);
const distDir = path.join(rootDir, 'dist');
const assetsDir = path.join(distDir, 'assets');

function getAllTokens() {
  const tokens = new Set();
  
  // Standard HTML tags and CSS pseudo-selectors to always preserve
  const standardPreserves = [
    'html', 'body', 'div', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'li', 'ol', 'button', 'input', 'select', 'textarea', 'label', 'svg', 'path',
    'noscript', 'img', 'iframe', 'canvas', 'header', 'footer', 'main', 'section',
    'root', 'hover', 'focus', 'active', 'disabled', 'placeholder', 'before', 'after',
    'focus-visible', 'selected', 'checked', 'readonly', 'selection'
  ];
  standardPreserves.forEach(t => tokens.add(t));

  // Scan JS files in dist/assets
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
        // Match all word-like tokens that could be CSS class names
        const matches = content.match(/[a-zA-Z0-9_-]+/g);
        if (matches) {
          matches.forEach(m => tokens.add(m));
        }
      }
    }
  }

  // Scan index.html in dist
  const htmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const content = fs.readFileSync(htmlPath, 'utf8');
    const matches = content.match(/[a-zA-Z0-9_-]+/g);
    if (matches) {
      matches.forEach(m => tokens.add(m));
    }
  }

  return tokens;
}

function parseAndPurgeCSS(cssContent, tokens) {
  // A robust rule-by-rule parser that handles media queries, keyframes, and regular rules
  let output = '';
  let i = 0;
  
  while (i < cssContent.length) {
    // Skip whitespaces
    if (/\s/.test(cssContent[i])) {
      output += cssContent[i];
      i++;
      continue;
    }
    
    // Handle comments
    if (cssContent[i] === '/' && cssContent[i+1] === '*') {
      const endComment = cssContent.indexOf('*/', i + 2);
      if (endComment !== -1) {
        output += cssContent.substring(i, endComment + 2);
        i = endComment + 2;
      } else {
        output += cssContent.substring(i);
        break;
      }
      continue;
    }

    // Handle @import
    if (cssContent.substring(i, i+7) === '@import') {
      const endSemi = cssContent.indexOf(';', i);
      if (endSemi !== -1) {
        output += cssContent.substring(i, endSemi + 1);
        i = endSemi + 1;
      } else {
        i++;
      }
      continue;
    }

    // Handle @keyframes
    if (cssContent.substring(i, i + 10) === '@keyframes') {
      // Find block matching
      let braceCount = 0;
      let j = i;
      while (j < cssContent.length) {
        if (cssContent[j] === '{') braceCount++;
        else if (cssContent[j] === '}') {
          braceCount--;
          if (braceCount === 0) {
            output += cssContent.substring(i, j + 1);
            i = j + 1;
            break;
          }
        }
        j++;
      }
      continue;
    }

    // Handle @media
    if (cssContent.substring(i, i + 6) === '@media') {
      const nextBrace = cssContent.indexOf('{', i);
      if (nextBrace === -1) {
        i++;
        continue;
      }
      const mediaHeader = cssContent.substring(i, nextBrace);
      
      // Parse sub-rules inside media query
      let braceCount = 1;
      let j = nextBrace + 1;
      let mediaContent = '';
      while (j < cssContent.length) {
        if (cssContent[j] === '{') braceCount++;
        else if (cssContent[j] === '}') {
          braceCount--;
          if (braceCount === 0) {
            break;
          }
        }
        mediaContent += cssContent[j];
        j++;
      }
      
      const purgedMediaContent = parseAndPurgeCSS(mediaContent, tokens).trim();
      if (purgedMediaContent.length > 0) {
        output += `${mediaHeader}{\n${purgedMediaContent}\n}\n`;
      }
      i = j + 1;
      continue;
    }

    // Handle regular rule
    const nextBrace = cssContent.indexOf('{', i);
    if (nextBrace === -1) {
      i++;
      continue;
    }
    const selectorGroup = cssContent.substring(i, nextBrace);
    
    // Find matching ending brace
    let braceCount = 1;
    let j = nextBrace + 1;
    let declarations = '';
    while (j < cssContent.length) {
      if (cssContent[j] === '{') braceCount++;
      else if (cssContent[j] === '}') {
        braceCount--;
        if (braceCount === 0) {
          break;
        }
      }
      declarations += cssContent[j];
      j++;
    }
    
    // Split and check selectors
    const selectors = selectorGroup.split(',');
    const activeSelectors = [];
    
    for (const selector of selectors) {
      const cleanSelector = selector.trim();
      if (cleanSelector.length === 0) continue;
      
      // Selectors starting with :root, *, html, body, or containing standard preserves are always kept
      if (cleanSelector.startsWith(':root') || cleanSelector === '*' || cleanSelector === 'html' || cleanSelector === 'body') {
        activeSelectors.push(cleanSelector);
        continue;
      }
      
      // Extract all word-like tokens from the selector (e.g. classes, tags, ids)
      const selectorTokens = cleanSelector.match(/[a-zA-Z0-9_-]+/g);
      if (!selectorTokens) {
        activeSelectors.push(cleanSelector);
        continue;
      }
      
      // Check if all custom tokens in selector exist in our scanned JS/HTML tokens set
      let isUsed = true;
      for (const token of selectorTokens) {
        // Skip purely numeric tokens (like percentages in keyframes, e.g. 50%) or empty tokens
        if (/^\d+$/.test(token)) continue;
        
        // If it's a class or identifier, check if it's referenced in JS/HTML
        if (!tokens.has(token)) {
          isUsed = false;
          break;
        }
      }
      
      if (isUsed) {
        activeSelectors.push(cleanSelector);
      }
    }
    
    if (activeSelectors.length > 0) {
      output += `${activeSelectors.join(', ')} {\n${declarations}\n}\n`;
    }
    
    i = j + 1;
  }
  
  return output;
}

function run() {
  console.log('Starting CSS purge and inlining optimization...');
  
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist/ directory not found. Please run npm run build first.');
    process.exit(1);
  }

  // Find css files
  const files = fs.readdirSync(assetsDir);
  const cssFile = files.find(f => f.endsWith('.css'));
  
  if (!cssFile) {
    console.error('Error: No compiled CSS file found in dist/assets/.');
    process.exit(1);
  }

  const cssPath = path.join(assetsDir, cssFile);
  const originalCSS = fs.readFileSync(cssPath, 'utf8');
  const originalSize = originalCSS.length;
  
  console.log(`Original CSS File: ${cssFile} (${(originalSize / 1024).toFixed(2)} KB)`);
  
  // Get all active JS/HTML tokens
  const tokens = getAllTokens();
  console.log(`Scanned JS and HTML bundles. Found ${tokens.size} unique layout tokens.`);
  
  // Purge CSS content
  const purgedCSS = parseAndPurgeCSS(originalCSS, tokens).trim();
  
  // Minify purged CSS (simple regex to strip extra whitespaces and newlines)
  const minifiedCSS = purgedCSS
    .replace(/\s+/g, ' ')
    .replace(/ ?\{ ?/g, '{')
    .replace(/ ?\} ?/g, '}')
    .replace(/ ?\: ?/g, ':')
    .replace(/ ?\; ?/g, ';')
    .replace(/\/\*.*?\*\//g, '')
    .trim();
    
  const purgedSize = minifiedCSS.length;
  console.log(`Purged & Compressed CSS Size: ${(purgedSize / 1024).toFixed(2)} KB (Reduced by ${((1 - purgedSize / originalSize) * 100).toFixed(1)}%)`);

  // Inline CSS in dist/index.html
  const htmlPath = path.join(distDir, 'index.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace <link rel="stylesheet" ... href="/assets/[index].css"> with <style>[CSS]</style>
  const linkRegex = /<link rel="stylesheet" [^>]*?href="[^"]*?\.css"[^>]*?>/i;
  
  if (linkRegex.test(htmlContent)) {
    htmlContent = htmlContent.replace(linkRegex, `<style id="critical-css">${minifiedCSS}</style>`);
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('Successfully inlined purged CSS into dist/index.html head.');
    
    // Delete the original css file to avoid redundant downloads
    fs.unlinkSync(cssPath);
    console.log(`Deleted external CSS file: dist/assets/${cssFile}`);
  } else {
    console.warn('Warning: Could not find stylesheet <link> tag in dist/index.html.');
  }
  
  console.log('CSS optimization completed successfully.');
}

run();
