fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then(data => console.log(data));
