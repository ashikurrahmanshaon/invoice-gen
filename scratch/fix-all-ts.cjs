const fs = require('fs');
const path = require('path');

// 1. App.tsx
let appStr = fs.readFileSync('src/App.tsx', 'utf8');
appStr = appStr.replace(/import React.*?;/, "import { Suspense } from 'react';");
fs.writeFileSync('src/App.tsx', appStr);

// 2. entry-server.tsx
let serverStr = fs.readFileSync('src/entry-server.tsx', 'utf8');
serverStr = serverStr.replace(/react-router-dom\/server\.mjs/, 'react-router-dom/server');
fs.writeFileSync('src/entry-server.tsx', serverStr);

// 3. HomePage.tsx
let homeStr = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');
homeStr = homeStr.replace(/import { useState, lazy, Suspense, useEffect } from 'react';/, "import { useState, Suspense, useEffect } from 'react';");
if (!homeStr.includes('<SEO')) {
    homeStr = homeStr.replace('import { SEO } from \'../components/seo/SEO\';', '');
}
fs.writeFileSync('src/pages/HomePage.tsx', homeStr);

console.log('Fixed TS issues');
