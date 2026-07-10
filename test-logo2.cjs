const fs = require('fs');
const path = require('path');
const base64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
fs.writeFileSync(path.join(__dirname, 'test-logo2.jpg'), Buffer.from(base64, 'base64'));
console.log('test-logo2.jpg generated');
