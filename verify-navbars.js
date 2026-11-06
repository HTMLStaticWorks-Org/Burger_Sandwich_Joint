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
  'contact.html'
];

let allPassed = true;

pages.forEach(p => {
  const content = fs.readFileSync(p, 'utf8');

  // 1. Check brand-logo
  if (!content.includes('class="brand-logo"')) {
    console.error(`FAIL: ${p} missing class="brand-logo"`);
    allPassed = false;
  }
  if (!content.includes('BURGER <span class="logo-highlight">&amp;</span> SANDWICH')) {
    console.error(`FAIL: ${p} brand logo text missing or malformed`);
    allPassed = false;
  }

  // 2. Check nav-menu
  if (!content.includes('class="nav-menu"')) {
    console.error(`FAIL: ${p} missing class="nav-menu"`);
    allPassed = false;
  }

  // 3. Check RTL, Theme, and Cart buttons after Contact
  const navMatch = content.match(/<nav class="nav-menu"[\s\S]*?<\/nav>/);
  if (!navMatch) {
    console.error(`FAIL: ${p} nav-menu match failed`);
    allPassed = false;
    return;
  }
  const navHtml = navMatch[0];
  const contactPos = navHtml.indexOf('Contact</a>');
  const rtlPos = navHtml.indexOf('class="nav-action-btn rtl-toggle"');
  const themePos = navHtml.indexOf('class="nav-action-btn theme-toggle"');
  const cartPos = navHtml.indexOf('class="nav-action-btn cart-btn');

  if (contactPos === -1 || rtlPos === -1 || themePos === -1 || cartPos === -1) {
    console.error(`FAIL: ${p} missing contact, rtl, theme, or cart button`);
    allPassed = false;
  } else if (rtlPos > contactPos && themePos > rtlPos && cartPos > themePos) {
    console.log(`PASS: ${p} navbar structure verified (Contact -> RTL -> Theme -> Cart).`);
  } else {
    console.error(`FAIL: ${p} order of nav buttons incorrect`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nALL 10 PAGES VERIFIED WITH PERFECT NAVBAR STRUCTURE!');
} else {
  process.exit(1);
}

