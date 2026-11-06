const fs = require('fs');

const cartHtml = fs.readFileSync('cart.html', 'utf8');

const assertions = [
  { desc: 'Navbar (.site-header) removed', test: !cartHtml.includes('site-header') },
  { desc: 'Mobile drawer removed', test: !cartHtml.includes('mobile-drawer') },
  { desc: 'Hero section (#cartHero) removed', test: !cartHtml.includes('id="cartHero"') && !cartHtml.includes('class="page-hero"') },
  { desc: 'Upsell section (#cartUpsell) removed', test: !cartHtml.includes('id="cartUpsell"') && !cartHtml.includes('POPULAR ADD-ONS') },
  { desc: 'Footer section (.site-footer) removed', test: !cartHtml.includes('site-footer') && !cartHtml.includes('<footer') },
  { desc: 'Cart workspace present', test: cartHtml.includes('id="cartWorkspace"') },
  { desc: 'Cart items container present', test: cartHtml.includes('id="cartItemsList"') },
  { desc: 'Checkout button present', test: cartHtml.includes('id="checkoutBtn"') },
  { desc: 'Back to Menu link present', test: cartHtml.includes('href="menu.html"') },
  { desc: 'Return to Home link present', test: cartHtml.includes('href="index.html"') },
  { desc: 'Theme toggle button present', test: cartHtml.includes('theme-toggle') },
  { desc: 'RTL toggle button present', test: cartHtml.includes('rtl-toggle') },
  { desc: 'Zero-flicker theme/dir head script present', test: cartHtml.includes('joint_theme') && cartHtml.includes('joint_direction') },
];

let allPassed = true;
assertions.forEach(a => {
  if (a.test) {
    console.log(`PASS: ${a.desc}`);
  } else {
    console.error(`FAIL: ${a.desc}`);
    allPassed = false;
  }
});

// Check all image paths
const imgMatches = cartHtml.match(/src="([^"]+)"/g) || [];
imgMatches.forEach(m => {
  const src = m.replace('src="', '').replace('"', '');
  if (!fs.existsSync(src)) {
    console.error(`FAIL: Broken image "${src}"`);
    allPassed = false;
  } else {
    console.log(`PASS: Image exists "${src}"`);
  }
});

if (allPassed) {
  console.log('\nALL CART SPECIFICATIONS VERIFIED 100% SUCCESSFUL!');
} else {
  process.exit(1);
}

