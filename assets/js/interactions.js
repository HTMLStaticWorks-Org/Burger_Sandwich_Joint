/**
 * BURGER & SANDWICH JOINT - SPECIAL INTERACTIONS
 * Interactive Meal Builder, Flavour Selector, and Burger Anatomy interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMealBuilder();
  initFlavourSelector();
  initAnatomyHighlight();
  initSpectrumStudio();
});

/* --- Interactive Meal Builder (combo-offers.html) --- */
function initMealBuilder() {
  const builder = document.querySelector('.builder-box');
  if (!builder) return;

  const mainOptions = builder.querySelectorAll('.builder-option-main');
  const sideOptions = builder.querySelectorAll('.builder-option-side');
  const drinkOptions = builder.querySelectorAll('.builder-option-drink');
  const addonOptions = builder.querySelectorAll('.builder-option-addon');

  const totalEl = builder.querySelector('.builder-total-amount');
  const mainSummaryEl = builder.querySelector('#summaryMain');
  const sideSummaryEl = builder.querySelector('#summarySide');
  const drinkSummaryEl = builder.querySelector('#summaryDrink');
  const addonSummaryEl = builder.querySelector('#summaryAddon');

  let selectedMainPrice = 8.99;
  let selectedSidePrice = 3.99;
  let selectedDrinkPrice = 2.99;
  let selectedAddonPrice = 0.00;

  function updateTotal() {
    const total = selectedMainPrice + selectedSidePrice + selectedDrinkPrice + selectedAddonPrice;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    const orderBtn = builder.querySelector('.builder-summary-bar .btn');
    if (orderBtn) {
      const mainTxt = (mainSummaryEl && mainSummaryEl.textContent) || 'Single Smash Angus Cheeseburger';
      const sideTxt = (sideSummaryEl && sideSummaryEl.textContent) || 'Crispy Golden Skin-On Fries';
      const drinkTxt = (drinkSummaryEl && drinkSummaryEl.textContent) || 'Fountain Cola (Iced)';
      const addonTxt = (addonSummaryEl && addonSummaryEl.textContent) || 'None';
      const details = `${mainTxt} • ${sideTxt} • ${drinkTxt}${addonTxt !== 'None' ? ' • ' + addonTxt : ''} [Total: $${total.toFixed(2)}]`;
      orderBtn.href = `contact.html?combo=${encodeURIComponent(details)}#contactForm`;
    }
  }

  function handleSingleSelect(options, callback) {
    options.forEach(opt => {
      opt.addEventListener('click', () => {
        options.forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        const price = parseFloat(opt.getAttribute('data-price')) || 0;
        const name = opt.getAttribute('data-name') || '';
        callback(price, name);
        updateTotal();
      });
    });
  }

  if (mainOptions.length) {
    handleSingleSelect(mainOptions, (price, name) => {
      selectedMainPrice = price;
      if (mainSummaryEl) mainSummaryEl.textContent = name;
    });
  }

  if (sideOptions.length) {
    handleSingleSelect(sideOptions, (price, name) => {
      selectedSidePrice = price;
      if (sideSummaryEl) sideSummaryEl.textContent = name;
    });
  }

  if (drinkOptions.length) {
    handleSingleSelect(drinkOptions, (price, name) => {
      selectedDrinkPrice = price;
      if (drinkSummaryEl) drinkSummaryEl.textContent = name;
    });
  }

  if (addonOptions.length) {
    addonOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const isSelected = opt.classList.contains('selected');
        if (isSelected) {
          opt.classList.remove('selected');
          selectedAddonPrice = 0.00;
          if (addonSummaryEl) addonSummaryEl.textContent = 'None';
        } else {
          addonOptions.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          selectedAddonPrice = parseFloat(opt.getAttribute('data-price')) || 0;
          if (addonSummaryEl) addonSummaryEl.textContent = opt.getAttribute('data-name') || '';
        }
        updateTotal();
      });
    });
  }

  updateTotal();
}

/* --- Flavour Selector on burgers.html --- */
function initFlavourSelector() {
  const flavourBtns = document.querySelectorAll('.flavour-filter-btn');
  const flavourCards = document.querySelectorAll('.flavour-target-card');

  if (!flavourBtns.length || !flavourCards.length) return;

  flavourBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flavourBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetFlavour = btn.getAttribute('data-flavour');

      flavourCards.forEach(card => {
        const cardFlavour = card.getAttribute('data-flavour');
        if (targetFlavour === 'all' || cardFlavour === targetFlavour) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.borderColor = 'var(--primary)';
        } else {
          card.style.opacity = '0.4';
          card.style.transform = 'scale(0.98)';
          card.style.borderColor = 'var(--border-subtle)';
        }
      });
    });
  });
}

/* --- Burger Anatomy Highlight --- */
function initAnatomyHighlight() {
  const layers = document.querySelectorAll('.anatomy-layer');
  if (!layers.length) return;

  layers.forEach(layer => {
    layer.addEventListener('mouseenter', () => {
      layers.forEach(l => {
        if (l !== layer) l.style.opacity = '0.5';
      });
    });
    layer.addEventListener('mouseleave', () => {
      layers.forEach(l => l.style.opacity = '1');
    });
  });
}

/* --- Culinary Spectrum Studio (burgers.html) --- */
function initSpectrumStudio() {
  const tabs = document.querySelectorAll('.spectrum-nav-tab');
  const panels = document.querySelectorAll('.spectrum-stage-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach(panel => {
        if (panel.getAttribute('data-style-panel') === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}


