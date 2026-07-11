const https = require('https');

setTimeout(() => {
  https.get('https://invoice-gen.net', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- VERIFICATION RESULTS ---');
      console.log('GA4 Production ID Present:', data.includes('G-Z8JWXK5L15'));
      console.log('Clarity Production ID Present:', data.includes('xksdnuqlz1'));
      console.log('Clarity Masking True:', data.includes('window.clarity("mask", true)'));
      console.log('Unused Placeholders Cleaned:', !data.includes('G-XXXXXXXXXX') && !data.includes('CLARITY_PROJECT_ID'));
    });
  }).on('error', console.error);
}, 20000); // Wait 20 seconds for deployment
