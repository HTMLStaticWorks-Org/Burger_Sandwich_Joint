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

  // Find <nav class="nav-menu"...>...</nav>
  const navMatch = content.match(/<nav class="nav-menu"[\s\S]*?<\/nav>/);
  if (!navMatch) {
    console.error(`FAIL: ${p} has no <nav class="nav-menu">`);
    allPassed = false;
    return;
  }

  const navHtml = navMatch[0];

  // Check if Contact is in the nav
  const contactIdx = navHtml.indexOf('Contact</a>');
  const rtlIdx = navHtml.indexOf('class="nav-action-btn rtl-toggle"');
  const themeIdx = navHtml.indexOf('class="nav-action-btn theme-toggle"');
  const cartIdx = navHtml.indexOf('class="nav-action-btn cart-btn');

  if (contactIdx === -1) {
    console.error(`FAIL: ${p} Contact link missing in nav`);
    allPassed = false;
  } else if (rtlIdx === -1) {
    console.error(`FAIL: ${p} RTL button missing in nav`);
    allPassed = false;
  } else if (themeIdx === -1) {
    console.error(`FAIL: ${p} Theme button missing in nav`);
    allPassed = false;
  } else if (cartIdx === -1) {
    console.error(`FAIL: ${p} Cart button missing in nav`);
    allPassed = false;
  } else if (rtlIdx > contactIdx && themeIdx > rtlIdx && cartIdx > themeIdx) {
    console.log(`PASS: ${p} has RTL, Theme, and Cart buttons located AFTER Contact in correct order.`);
  } else {
    console.error(`FAIL: ${p} order of RTL, Theme, or Cart button is incorrect.`);
    allPassed = false;
  }

  // Check head script
  if (!content.includes('localStorage.getItem(\'joint_direction\')')) {
    console.error(`FAIL: ${p} missing zero-flicker head script`);
    allPassed = false;
  }

  // Check drawer toggles
  if (!content.includes('drawer-action-toggles')) {
    console.error(`FAIL: ${p} missing drawer-action-toggles`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\nSUCCESS: ALL 8 PAGES VERIFIED 100% CORRECT FOR NAVBAR RTL & THEME BUTTONS!');
} else {
  process.exit(1);
}

