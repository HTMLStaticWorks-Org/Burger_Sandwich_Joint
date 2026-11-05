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

const counts = {};
for (let i = 1; i <= 109; i++) counts['image-' + i + '.png'] = 0;

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');
  const matches = content.match(/src="images\/image-[0-9]+\.png"/g) || [];
  matches.forEach(m => {
    const file = m.replace('src="images/', '').replace('"', '');
    counts[file] = (counts[file] || 0) + 1;
  });
});

const zero = [];
const double = [];
let once = 0;

for (let f in counts) {
  if (counts[f] === 0) zero.push(f);
  else if (counts[f] === 1) once++;
  else double.push({ file: f, count: counts[f] });
}

console.log('Exactly once count:', once);
console.log('Zero count files (' + zero.length + '):', zero.join(', '));
console.log('Duplicate count files (' + double.length + '):', JSON.stringify(double));
