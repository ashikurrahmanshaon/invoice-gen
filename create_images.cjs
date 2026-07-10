const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/arsha/.gemini/antigravity-ide/brain/5194976d-cfd6-4066-85ce-61613cd81cb7';

const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFElEQVQIW2NkYGD4z8DAwMgAI0AMDA4BGb/k3/gAAAAASUVORK5CYII=';
fs.writeFileSync(path.join(dir, 'test1.png'), Buffer.from(pngBase64, 'base64'));

const jpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAACAAMBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
fs.writeFileSync(path.join(dir, 'test2.jpg'), Buffer.from(jpgBase64, 'base64'));
