const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
content = content.replace('function App() {', `import { SEO } from '../components/seo/SEO';\n\nexport default function HomePage() {`);
content = content.replace('return (\n    <>', `return (\n    <>\n      <SEO \n        title="Free Professional Invoice Generator — No Signup Required"\n        description="Create professional PDF invoices instantly with Invoice-Gen.net. 100% free, secure, browser-based invoice creator with no signup required."\n        canonicalUrl="https://invoice-gen.net/"\n      />`);
fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('Modified HomePage.tsx');
