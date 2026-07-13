const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist') && !file.includes('.git')) {
          walk(file, (err, res) => {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.cjs') || file.endsWith('.json') || file.endsWith('.md') || file.endsWith('.html') || file.endsWith('.css')) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
};

const rootDirs = ['./src', './scripts', './scratch', './'];
let processed = 0;

const replaceInFiles = (files) => {
  files.forEach(file => {
    // Skip this script itself
    if (file.includes('rename_brand.cjs')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // We want to replace "Invoice-Gen" with "Invoice-Gen.net"
    // BUT avoid replacing "Invoice-Gen.net" with "Invoice-Gen.net.net"
    // Regex: Match "Invoice-Gen" NOT followed by ".net"
    const regex = /Invoice-Gen(?!\.net)/gi;
    
    // Also skip things like invoice-gen in URLs, e.g., href="/invoice-gen" unless it's the exact brand text.
    // Actually, case-insensitive might break things like invoice-generator. Let's stick to case-sensitive:
    const strictRegex = /Invoice-Gen(?!\.net|-)/g;
    
    if (strictRegex.test(content)) {
      const newContent = content.replace(strictRegex, 'Invoice-Gen.net');
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Updated: ${file}`);
    }
  });
};

rootDirs.forEach(dir => {
  if (dir === './') {
    // Just process top-level .cjs and .html files manually to avoid deep scanning whole repo twice
    const files = fs.readdirSync('.').filter(f => f.endsWith('.cjs') || f.endsWith('.html') || f.endsWith('.md'));
    replaceInFiles(files.map(f => path.resolve('.', f)));
  } else if (fs.existsSync(dir)) {
    walk(dir, (err, files) => {
      if (err) throw err;
      replaceInFiles(files);
    });
  }
});
