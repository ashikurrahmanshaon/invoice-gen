const https = require('https');

https.get('https://invoice-gen.net', (res) => {
  console.log('--- HEADERS ---');
  console.log(JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n--- BODY SUMMARY ---');
    console.log('Body length:', data.length);
    console.log('Title match:', data.match(/<title>(.*?)<\/title>/)?.[1]);
    console.log('Meta description:', data.match(/<meta name="description" content="(.*?)"/)?.[1]);
    console.log('Canonical:', data.match(/<link rel="canonical" href="(.*?)"/)?.[1]);
    console.log('OG Title:', data.match(/<meta property="og:title" content="(.*?)"/)?.[1]);
    console.log('JSON-LD presence:', data.includes('application/ld+json') ? 'Yes' : 'No');
  });
}).on('error', (e) => {
  console.error('Error fetching site:', e);
});
