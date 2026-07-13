const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Replace dynamic imports with static imports
content = content.replace(/const (\w+) = lazy\(\(\) => import\('\.\.\/components(.*?)\'\)\.then\(module => \(\{\s*default: module\.\w+\s*\}\)\)\);/g, "import { $1 } from '../components$2';");

// Wait, some might have been './components' originally, which I fixed to '../components'.
content = content.replace(/const (\w+) = lazy\(\(\) => import\('(\.\.\/components.*?)\'\)\.then\(module => \(\{\s*default: module\.\w+\s*\}\)\)\);/g, "import { $1 } from '$2';");

fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('Fixed lazy imports in HomePage.tsx');
