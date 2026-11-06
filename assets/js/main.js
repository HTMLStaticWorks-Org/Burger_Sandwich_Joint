/**
 * BURGER & SANDWICH JOINT - MAIN SCRIPTS
 * Global navigation, drawer, modal popup, sticky header, and form validation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRTL();
  initNavbar();
  initModal();
  initFaqAccordion();
  initContactForm();
  initMapIframe();
  initBackToTop();
});

/* --- Mobile Drawer & Sticky Header --- */
function initNavbar() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburger && drawer && backdrop) {
    function toggleDrawer() {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    }

    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      hamburger.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      hamburger.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleDrawer);
    backdrop.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
      if (link.classList.contains('mobile-dropdown-toggle')) return;
      link.addEventListener('click', closeDrawer);
    });

    // Mobile drawer dropdown toggle
    const mobileDropdowns = document.querySelectorAll('.mobile-drawer-dropdown');
    mobileDropdowns.forEach(dd => {
      const toggle = dd.querySelector('.mobile-dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          dd.classList.toggle('open');
          const expanded = dd.classList.contains('open');
          toggle.setAttribute('aria-expanded', expanded);
        });
      }
    });

    // Submenu links inside drawer close the drawer when navigating
    const sublinks = document.querySelectorAll('.mobile-sublink');
    sublinks.forEach(sub => {
      sub.addEventListener('click', closeDrawer);
    });

    // Desktop nav dropdown touch / click toggle
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach(dd => {
      const toggle = dd.querySelector('.nav-dropdown-toggle');
      if (toggle) {
        toggle.addEventListener('click', (e) => {
          if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            if (!dd.classList.contains('open')) {
              e.preventDefault();
              navDropdowns.forEach(other => other !== dd && other.classList.remove('open'));
              dd.classList.add('open');
            }
          }
        });
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        navDropdowns.forEach(dd => dd.classList.remove('open'));
      }
    });
  }

  // Active navigation link highlighting
  const rawPath = decodeURIComponent(window.location.pathname).split('/').filter(Boolean).pop() || 'index.html';
  const cleanCurrentPath = rawPath.replace(/\.html$/, '').toLowerCase() || 'index';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .nav-dropdown-link, .mobile-sublink');

  navLinks.forEach(link => {
    const rawHref = link.getAttribute('href');
    if (!rawHref) return;
    const hrefFile = rawHref.split('#')[0].split('?')[0].split('/').filter(Boolean).pop() || '';
    const cleanHref = hrefFile.replace(/\.html$/, '').toLowerCase() || 'index';

    const isMatch = (cleanHref === cleanCurrentPath) || (cleanCurrentPath === 'index' && (cleanHref === '' || cleanHref === 'index'));
    if (isMatch) {
      link.classList.add('active');
      const parentDropdown = link.closest('.nav-dropdown');
      if (parentDropdown) {
        const toggle = parentDropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.classList.add('active');
      }
      const parentDrawerDropdown = link.closest('.mobile-drawer-dropdown');
      if (parentDrawerDropdown) {
        parentDrawerDropdown.classList.add('open');
        const drawerToggle = parentDrawerDropdown.querySelector('.mobile-dropdown-toggle');
        if (drawerToggle) {
          drawerToggle.classList.add('active');
          drawerToggle.setAttribute('aria-expanded', 'true');
        }
      }
    }
  });

  // Sticky navbar shadow enhancement
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* --- Universal Product Detail Modal --- */
function initModal() {
  const modal = document.getElementById('productModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const backdrop = modal;
  const modalImg = modal.querySelector('.modal-img');
  const modalTitle = modal.querySelector('.modal-title');
  const modalPrice = modal.querySelector('.modal-price');
  const modalDesc = modal.querySelector('.modal-desc');
  const modalIngredients = modal.querySelector('.modal-ingredients');

  function openModal(data) {
    if (modalImg) modalImg.src = data.img || '';
    if (modalImg) modalImg.alt = data.title || 'Product details';
    if (modalTitle) modalTitle.textContent = data.title || 'Product Details';
    if (modalPrice) modalPrice.textContent = data.price || '';
    if (modalDesc) modalDesc.textContent = data.desc || 'Freshly prepared to order using quality ingredients and our signature recipes.';
    
    if (modalIngredients) {
      modalIngredients.innerHTML = '';
      if (data.ingredients && data.ingredients.length > 0) {
        data.ingredients.forEach(ing => {
          const span = document.createElement('span');
          span.textContent = ing;
          modalIngredients.appendChild(span);
        });
      }
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Attach click listener to any button with data-modal attribute or .js-view-details
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-view-details');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.food-card') || btn.closest('[data-title]');
      
      let title = btn.getAttribute('data-title');
      let price = btn.getAttribute('data-price');
      let desc = btn.getAttribute('data-desc');
      let img = btn.getAttribute('data-img');
      let ingredients = [];

      if (!title && card) {
        const titleEl = card.querySelector('.food-card-title, h3, h4');
        const priceEl = card.querySelector('.food-card-price, .price');
        const descEl = card.querySelector('.food-card-desc, p');
        const imgEl = card.querySelector('img');
        const ingEls = card.querySelectorAll('.food-card-ingredients span');

        title = titleEl ? titleEl.textContent.trim() : 'Signature Special';
        price = priceEl ? priceEl.textContent.trim() : '$11.99';
        desc = descEl ? descEl.textContent.trim() : 'Crafted with premium ingredients.';
        img = imgEl ? imgEl.src : '';
        if (ingEls.length > 0) {
          ingEls.forEach(i => ingredients.push(i.textContent.trim()));
        }
      } else {
        const ingRaw = btn.getAttribute('data-ingredients');
        if (ingRaw) ingredients = ingRaw.split(',').map(s => s.trim());
      }

      openModal({ title, price, desc, img, ingredients });
    }
  });
}

/* --- FAQ Accordion --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all others
        faqItems.forEach(other => other.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --- Contact Form Validation --- */
function initContactForm() {
  const form = document.getElementById('restaurantContactForm');
  if (!form) return;

  // Check URL params/hash to pre-select Enquiry Type, prefill message, and scroll smoothly
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const typeSelect = form.querySelector('#contactType');
  const messageInput = form.querySelector('#contactMessage');

  if (typeSelect) {
    if (params.get('package') || params.get('enquiry') || params.get('service') || typeParam === 'catering') {
      typeSelect.value = 'Party Catering';
    } else if (params.get('combo') || params.get('deal')) {
      typeSelect.value = 'General Enquiry';
    }
  }

  if (messageInput && !messageInput.value.trim()) {
    if (params.get('package')) {
      const pkg = params.get('package').replace(/-/g, ' ');
      messageInput.value = `Hello, I would like to order / enquire about the "${pkg}" catering package for our upcoming event. Please let me know availability, portion sizing, and delivery scheduling.`;
    } else if (params.get('combo')) {
      const combo = decodeURIComponent(params.get('combo'));
      messageInput.value = `Custom Combo Order:\n${combo}\n\nPlease confirm pickup/delivery timing and pricing.`;
    } else if (params.get('deal')) {
      const deal = params.get('deal').replace(/-/g, ' ');
      messageInput.value = `Hello, I would like to order the "${deal}" meal deal. Please let me know preparation timing.`;
    }
  }

  if (window.location.hash === '#contactForm' || params.get('package') || params.get('combo') || params.get('deal')) {
    setTimeout(() => {
      const target = document.getElementById('contactForm');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 250);
  }

  const feedback = form.querySelector('.form-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contactName').value.trim();
    const email = form.querySelector('#contactEmail').value.trim();
    const phone = form.querySelector('#contactPhone').value.trim();
    const message = form.querySelector('#contactMessage').value.trim();

    if (!name || !email || !message) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill out all required fields (Name, Email, and Message).';
        feedback.style.display = 'block';
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (feedback) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please provide a valid email address.';
        feedback.style.display = 'block';
      }
      return;
    }

    // Success response
    if (feedback) {
      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${name}! Your enquiry has been received. Our team will contact you shortly.`;
      feedback.style.display = 'block';
    }

    form.reset();
  });
}

/* --- Location Map Interactive Controller --- */
function initMapIframe() {
  const mapIframe = document.querySelector('.map-iframe[data-map-endpoint]');
  if (mapIframe && !mapIframe.src) {
    mapIframe.src = mapIframe.getAttribute('data-map-endpoint');
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-open-directions');
    if (btn) {
      e.preventDefault();
      const url = btn.getAttribute('data-maps-url') || 'https://maps.google.com/?q=142+Market+Street';
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  });
}

/* --- Theme (Light/Dark) & 100% RTL / LTR Toggle Controller --- */
function initThemeAndRTL() {
  const THEME_KEY = 'joint_theme';
  const RTL_KEY = 'joint_direction';

  // Read saved state (default to dark theme and ltr direction)
  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
  let currentDir = localStorage.getItem(RTL_KEY) || 'ltr';

  // Apply immediately on load
  applyTheme(currentTheme);
  applyDirection(currentDir);

  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_KEY, theme);

    // Synchronize all theme buttons in DOM (desktop navbar & mobile drawer)
    const themeButtons = document.querySelectorAll('.theme-toggle');
    themeButtons.forEach(btn => {
      const isLight = theme === 'light';
      btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to bright theme');
      btn.setAttribute('title', isLight ? 'Switch to Dark Theme' : 'Switch to Bright Theme');
      const text = btn.querySelector('.theme-mode-text');
      if (text) {
        text.textContent = isLight ? 'Bright Theme' : 'Dark Theme';
      }
    });
  }

  function applyDirection(dir) {
    currentDir = dir;
    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
    localStorage.setItem(RTL_KEY, dir);

    // Synchronize all RTL buttons in DOM (desktop navbar & mobile drawer)
    const rtlButtons = document.querySelectorAll('.rtl-toggle');
    rtlButtons.forEach(btn => {
      const isRtl = dir === 'rtl';
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR layout' : 'Switch to RTL layout');
      btn.setAttribute('title', isRtl ? 'Switch to LTR Layout' : 'Switch to RTL Layout');
      const text = btn.querySelector('.rtl-text');
      if (text) {
        if (btn.classList.contains('mobile-toggle-btn')) {
          text.textContent = isRtl ? 'LTR Layout' : 'RTL Layout';
        } else {
          text.textContent = isRtl ? 'LTR' : 'RTL';
        }
      }
    });
  }

  // Event Delegation for both Theme and RTL buttons
  document.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('.theme-toggle');
    if (themeBtn) {
      e.preventDefault();
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
      return;
    }

    const rtlBtn = e.target.closest('.rtl-toggle');
    if (rtlBtn) {
      e.preventDefault();
      const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(nextDir);
      return;
    }
  });
}

/* --- Drop / Scroll To Top Button --- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop') || document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  function toggleBackToTop() {
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop();

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


