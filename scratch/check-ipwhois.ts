fetch('https://ipwho.is/')
  .then(res => res.json())
  .then(data => console.log(data));
