/**
 * BURGER & SANDWICH JOINT - MENU FILTERING
 * Dynamic category filtering on menu.html with smooth state transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-filter-item');

  if (!filterButtons.length || !menuItems.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Handle URL hash filtering (e.g. menu.html#sandwiches, menu.html#sides, menu.html#beverages, menu.html#burgers)
  function applyHashFilter() {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (hash) {
      const matchingBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`) || document.getElementById(hash);
      if (matchingBtn) {
        matchingBtn.click();
        const menuSection = document.getElementById('completeMenu');
        if (menuSection) {
          setTimeout(() => {
            menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      }
    }
  }

  applyHashFilter();
  window.addEventListener('hashchange', applyHashFilter);
});

