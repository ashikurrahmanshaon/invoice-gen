const fs = require('fs');

function makeSafe(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Simple check for SSR
  const ssrSafeBlock = `
const isBrowser = typeof window !== 'undefined';
const safeLocalStorage = {
  getItem: (k) => isBrowser ? localStorage.getItem(k) : null,
  setItem: (k, v) => isBrowser ? localStorage.setItem(k, v) : undefined,
  removeItem: (k) => isBrowser ? localStorage.removeItem(k) : undefined
};
`;
  if (!content.includes('safeLocalStorage')) {
    // inject at top after imports
    content = content.replace(/(import .*?;[\r\n]+)/, `$1${ssrSafeBlock}`);
    content = content.replace(/localStorage\./g, 'safeLocalStorage.');
    fs.writeFileSync(file, content);
  }
}

makeSafe('src/contexts/SettingsContext.tsx');
makeSafe('src/utils/storage.ts');
console.log('Fixed localStorage cleanly!');
