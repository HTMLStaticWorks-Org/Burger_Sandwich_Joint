const fs = require('fs');

const pages = [
  'index.html',
  'home-2.html',
  'about.html',
  'services.html',
  'menu.html',
  'burgers.html',
  'sandwiches.html',
  'combo-offers.html',
  'contact.html',
  'cart.html'
];

let issues = [];

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');

  // Check doctype, html, head, body, header, footer, main
  if (!content.includes('<!DOCTYPE html>')) issues.push(`${p} missing <!DOCTYPE html>`);
  if (!content.includes('<html lang="en">')) issues.push(`${p} missing <html lang="en">`);
  if (!content.includes('</html>')) issues.push(`${p} unclosed <html>`);
  if (!content.includes('</body>')) issues.push(`${p} unclosed <body>`);
  if (!content.includes('<main id="mainContent">')) issues.push(`${p} missing <main id="mainContent">`);
  if (!content.includes('</main>')) issues.push(`${p} unclosed <main>`);

  // Check all images exist
  const imgMatches = content.match(/src="([^"]+)"/g) || [];
  imgMatches.forEach(m => {
    const src = m.replace('src="', '').replace('"', '');
    if (!fs.existsSync(src)) {
      issues.push(`${p}: Broken image src "${src}"`);
    }
  });

  // Check data-img attributes
  const dataImgMatches = content.match(/data-img="([^"]+)"/g) || [];
  dataImgMatches.forEach(m => {
    const src = m.replace('data-img="', '').replace('"', '');
    if (!fs.existsSync(src)) {
      issues.push(`${p}: Broken data-img "${src}"`);
    }
  });

  // Check internal links
  const linkMatches = content.match(/href="([^"]+)"/g) || [];
  linkMatches.forEach(m => {
    const href = m.replace('href="', '').replace('"', '');
    if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href === '') {
      return;
    }
    const targetFile = href.split('#')[0].split('?')[0];
    if (targetFile && !pages.includes(targetFile) && !targetFile.endsWith('.css') && !targetFile.endsWith('.js') && !targetFile.endsWith('.svg')) {
      issues.push(`${p}: Broken href "${href}"`);
    }
  });
});

console.log('Total issues found:', issues.length);
if (issues.length > 0) {
  console.log(issues.join('\n'));
} else {
  console.log('ALL 8 PAGES PASSED STRUCTURAL INTEGRITY AND IMAGE PATH CHECKS!');
}
