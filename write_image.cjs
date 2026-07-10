const fs = require('fs');
const path = require('path');

// A 2x2 solid white PNG logo
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0yAAAAElEQVR42mP8z8ABjAxgGBgYAAADAP8B8Eb6VAAAAABJRU5ErkJggg==';

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'test-logo.png'), Buffer.from(base64, 'base64'));
console.log('test-logo.png generated in public/ directory successfully!');
