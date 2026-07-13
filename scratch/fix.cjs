const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
content = content.replace(/from '\.\//g, "from '../");
fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('Fixed imports in HomePage.tsx');
