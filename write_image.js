const fs = require('fs');
const path = require('path');

// A valid, non-corrupted 64x64 solid blue PNG logo
const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXUpAAAABmJLR0QA/wD/AP+gvaeTAAAAI0lEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAfgAMZ7wAB5a5ayQAAAABJRU5ErkJggg==';

fs.writeFileSync(path.join(__dirname, 'test-logo.png'), Buffer.from(base64, 'base64'));
console.log('test-logo.png generated successfully!');
