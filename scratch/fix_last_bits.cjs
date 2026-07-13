const fs = require('fs');
const files = [
  'public/blog/how-to-create-your-first-invoice/index.html', 
  'public/blog/what-is-an-invoice-beginners-guide/index.html'
];
files.forEach(f => { 
  let c = fs.readFileSync(f, 'utf8'); 
  if (!c.includes('BreadcrumbList')) { 
    const bc = `    <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://invoice-gen.net"},{"@type":"ListItem","position":2,"name":"Blog","item":"https://invoice-gen.net/blog/"},{"@type":"ListItem","position":3,"name":"Blog Post","item":"https://invoice-gen.net/${f.split('public/')[1]}"}]}</script>`;
    c = c.replace('</head>', `${bc}\n  </head>`); 
    fs.writeFileSync(f, c); 
    console.log('Fixed', f); 
  } 
});
