const fs = require('fs');

function wrapLocalStorage(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/localStorage\.getItem/g, "typeof window !== 'undefined' ? localStorage.getItem : () => null");
  content = content.replace(/localStorage\.setItem/g, "typeof window !== 'undefined' ? localStorage.setItem : () => {}");
  content = content.replace(/localStorage\.removeItem/g, "typeof window !== 'undefined' ? localStorage.removeItem : () => {}");
  fs.writeFileSync(file, content);
}

wrapLocalStorage('src/contexts/SettingsContext.tsx');
wrapLocalStorage('src/utils/storage.ts');
console.log('Fixed localStorage references for SSR');
