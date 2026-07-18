const fs = require('fs');
const path = require('path');

const originalScript = fs.readFileSync(path.join(__dirname, '../publish_growth_content.cjs'), 'utf8');

// Replace the generation part with a simple export
const modifiedScript = originalScript.replace(/\/\/ 1\. GENERATE TEMPLATE PAGES[\s\S]*/, 'module.exports = { templates, blogs };');

fs.writeFileSync(path.join(__dirname, 'temp_publish.cjs'), modifiedScript);

const { templates, blogs } = require('./temp_publish.cjs');

const dataDir = path.join(__dirname, '../src/data');
fs.mkdirSync(dataDir, { recursive: true });

fs.writeFileSync(path.join(dataDir, 'templates.json'), JSON.stringify(templates, null, 2));
fs.writeFileSync(path.join(dataDir, 'blogs.json'), JSON.stringify(blogs, null, 2));
fs.writeFileSync(path.join(dataDir, 'comparisons.json'), '[]');
fs.writeFileSync(path.join(dataDir, 'guides.json'), '[]');
fs.writeFileSync(path.join(dataDir, 'faq.json'), '[]');
fs.writeFileSync(path.join(dataDir, 'categories.json'), '[]');

console.log('Successfully generated JSON files.');
fs.unlinkSync(path.join(__dirname, 'temp_publish.cjs'));
