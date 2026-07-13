const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

// Fix imports
content = content.replace(/from '\.\/components/g, "from '../components");

// Remove export default App; at the end
content = content.replace(/export default App;\s*$/, "");

fs.writeFileSync('src/pages/HomePage.tsx', content);
console.log('Fixed imports and exports in HomePage.tsx');
