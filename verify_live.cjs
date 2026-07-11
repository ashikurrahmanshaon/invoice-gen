const https = require('https');

setTimeout(() => {
  https.get('https://invoice-gen.net', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('--- VERIFICATION RESULTS ---');
      console.log('GA4 Script Present:', data.includes('googletagmanager.com'));
      console.log('Clarity Script Present:', data.includes('clarity.ms'));
      console.log('Clarity Masking True:', data.includes('window.clarity("mask", true)'));
      console.log('GSC Verification Present:', data.includes('google-site-verification'));
      console.log('Bing Verification Present:', data.includes('msvalidate.01'));
    });
  }).on('error', console.error);
}, 10000); // wait 10 seconds for deployment
