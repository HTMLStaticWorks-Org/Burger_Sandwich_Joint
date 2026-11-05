const fs = require('fs');

const pages = [
  'index.html',
  'home-2.html',
  'about.html',
  'menu.html',
  'burgers.html',
  'sandwiches.html',
  'combo-offers.html',
  'contact.html'
];

let allCardsPass = true;

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');

  // Match grid-4 and grid-6 elements
  const regex = /<div class="[^"]*?(grid-4|grid-6)[^"]*?"[^>]*>([\s\S]*?)<\/div>/g;
  let match;
  let count = 0;

  // Let's count items in each grid
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class="grid-4"') || lines[i].includes('class="grid-6"')) {
      const isGrid4 = lines[i].includes('grid-4');
      const isGrid6 = lines[i].includes('grid-6');
      console.log(`${p} line ${i+1}: found ${isGrid4 ? 'grid-4' : 'grid-6'}`);
    }
  }
});

