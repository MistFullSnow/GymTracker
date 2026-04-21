const fs = require('fs');
fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json')
  .then(res => res.json())
  .then(data => fs.writeFileSync('db.json', JSON.stringify(data.slice(0, 5), null, 2)));
