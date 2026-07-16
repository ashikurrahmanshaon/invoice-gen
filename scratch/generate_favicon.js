const fs = require('fs');
const { execSync } = require('child_process');

const svgCode = `<svg width="512" height="512" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="docGradient" x1="0" y1="0" x2="32" y2="36" gradientUnits="userSpaceOnUse">
<stop stop-color="#00E676"></stop>
<stop offset="1" stop-color="#00A65A"></stop>
</linearGradient>
<linearGradient id="foldGradient" x1="16" y1="0" x2="32" y2="10" gradientUnits="userSpaceOnUse">
<stop stop-color="#00C853"></stop>
<stop offset="1" stop-color="#007936"></stop>
</linearGradient>
</defs>
<path d="M14 0H28C30.2091 0 32 1.79086 32 4V32C32 34.2091 30.2091 36 28 36H4C1.79086 36 0 34.2091 0 32V10L14 0Z" fill="url(#docGradient)"></path>
<path d="M0 10H10C12.2091 10 14 8.20914 14 6V0L0 10Z" fill="url(#foldGradient)"></path>
<rect x="4" y="16" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.9"></rect>
<rect x="4" y="22" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.9"></rect>
<rect x="4" y="28" width="16" height="3" rx="1.5" fill="#ffffff" opacity="0.9"></rect>
</svg>`;

fs.writeFileSync('public/favicon.svg', svgCode);

console.log('Saved favicon.svg');
