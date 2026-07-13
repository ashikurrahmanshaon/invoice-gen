const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/localStorage\.getItem\((.*?)\)/g, "(typeof window !== 'undefined' ? localStorage.getItem($1) : null)");
  content = content.replace(/localStorage\.setItem\((.*?)\)/g, "(typeof window !== 'undefined' ? localStorage.setItem($1) : undefined)");
  content = content.replace(/localStorage\.removeItem\((.*?)\)/g, "(typeof window !== 'undefined' ? localStorage.removeItem($1) : undefined)");
  fs.writeFileSync(file, content);
}

fix('src/contexts/SettingsContext.tsx');
fix('src/utils/storage.ts');
console.log('Fixed localStorage references');
