const fs = require('fs');
const path = require('path');

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

const headScript = `  <script>
    (function() {
      try {
        var d = localStorage.getItem('joint_direction');
        if (d === 'rtl') document.documentElement.setAttribute('dir', 'rtl');
        var t = localStorage.getItem('joint_theme');
        if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
      } catch(e) {}
    })();
  </script>
`;

const navButtons = `
          <!-- RTL Layout & Light/Dark Theme Toggles (Placed immediately after Contact) -->
          <button type="button" class="nav-action-btn rtl-toggle" aria-label="Toggle RTL layout" title="Toggle RTL / LTR layout"><span class="rtl-text">RTL</span></button>
          <button type="button" class="nav-action-btn theme-toggle" aria-label="Toggle light / dark theme" title="Toggle Light / Dark Theme">
            <svg class="theme-icon sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <svg class="theme-icon moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </button>`;

const mobileDrawerToggles = `    <div class="mobile-drawer-footer">
      <div class="drawer-action-toggles">
        <button type="button" class="mobile-toggle-btn rtl-toggle" aria-label="Toggle RTL layout">
          <span class="rtl-text">RTL Layout</span>
        </button>
        <button type="button" class="mobile-toggle-btn theme-toggle" aria-label="Toggle light / dark theme">
          <svg class="theme-icon sun-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="theme-icon moon-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span class="theme-mode-text">Dark Theme</span>
        </button>
      </div>`;

pages.forEach(p => {
  let content = fs.readFileSync(p, 'utf8');

  // 1. Add head script if not already present
  if (!content.includes('joint_direction')) {
    content = content.replace('</head>', `${headScript}</head>`);
  }

  // 2. Add navButtons right after <a href="contact.html"...Contact</a>
  if (!content.includes('rtl-toggle')) {
    // Regex to match Contact link and insert navButtons right after
    const contactRegex = /(<a href="contact\.html"[^>]*>Contact<\/a>)/;
    if (contactRegex.test(content)) {
      content = content.replace(contactRegex, `$1${navButtons}`);
    } else {
      console.warn(`Could not find Contact link in ${p}`);
    }
  }

  // 3. Add mobileDrawerToggles in .mobile-drawer-footer if not already present
  if (!content.includes('drawer-action-toggles')) {
    content = content.replace('<div class="mobile-drawer-footer">', mobileDrawerToggles);
  }

  // 4. Wrap &rarr; in <span class="drawer-arrow">&rarr;</span> for mobile nav links
  content = content.replace(/(class="mobile-nav-link[^>]*><span>[^<]+<\/span>\s*)&rarr;/g, '$1<span class="drawer-arrow">&rarr;</span>');

  fs.writeFileSync(p, content, 'utf8');
  console.log(`Updated ${p}`);
});

