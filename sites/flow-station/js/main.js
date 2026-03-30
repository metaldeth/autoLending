/* =======================================================
   FLOW — Main JS
   ======================================================= */

(function () {
  'use strict';

  /* --------------------------------------------------------
     MENU
  -------------------------------------------------------- */
  var _scrollY = 0;

  function openMenu() {
    var menu = document.getElementById('menu');
    if (!menu) return;
    _scrollY = window.scrollY || window.pageYOffset;
    lockBodyScroll();
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-is-open');
  }

  function closeMenu() {
    var menu = document.getElementById('menu');
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();
    document.body.classList.remove('menu-is-open');
  }

  function lockBodyScroll() {
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _scrollY + 'px';
    document.body.style.width = '100%';
    document.body.style.overflowY = 'scroll';
  }

  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, _scrollY);
  }

  function initMenu() {
    var burger = document.getElementById('menuToggle');
    var closeBtn = document.getElementById('menuClose');

    if (burger) {
      burger.addEventListener('click', openMenu);
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    // Close on ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* --------------------------------------------------------
     CALCULATOR — index.html (workouts)
  -------------------------------------------------------- */
  function initWorkoutsCalculator() {
    var slider = document.getElementById('workoutsSlider');
    var valueEl = document.getElementById('workoutsValue');
    var bottlePriceEl = document.getElementById('bottlePrice');
    var savingsEl = document.getElementById('savings');

    if (!slider) return;

    function update() {
      var n = parseInt(slider.value, 10);
      var bottles = n * 300;
      var flow = 499;
      var savings = bottles - flow;

      if (valueEl) valueEl.textContent = n;
      if (bottlePriceEl) bottlePriceEl.textContent = formatPrice(bottles) + '\u00a0₽';
      if (savingsEl) savingsEl.textContent = formatPrice(savings) + '\u00a0₽';

      updateSliderFill(slider);
    }

    slider.addEventListener('input', update);
    update();
  }

  /* --------------------------------------------------------
     CALCULATOR — dlya-klubov.html (residents)
  -------------------------------------------------------- */
  function initClubsCalculator() {
    var slider = document.getElementById('residentsSlider');
    var valueEl = document.getElementById('residentsValue');
    var savingsEl = document.getElementById('clubSavings');
    var profitEl = document.getElementById('clubProfit');
    var totalEl = document.getElementById('clubTotal');

    if (!slider) return;

    function update() {
      var n = parseInt(slider.value, 10);
      var savings = n * 22;
      var profit = Math.round(n * 0.1 * 499 * 0.2);
      var total = savings + profit;

      if (valueEl) valueEl.textContent = formatNumber(n);
      if (savingsEl) savingsEl.textContent = formatPrice(savings) + '\u00a0₽';
      if (profitEl) profitEl.textContent = formatPrice(profit) + '\u00a0₽';
      if (totalEl) totalEl.textContent = formatPrice(total) + '\u00a0₽';

      updateSliderFill(slider);
    }

    slider.addEventListener('input', update);
    update();
  }

  /* --------------------------------------------------------
     SLIDER FILL (CSS custom property trick)
  -------------------------------------------------------- */
  function updateSliderFill(slider) {
    var min = parseFloat(slider.min) || 0;
    var max = parseFloat(slider.max) || 100;
    var val = parseFloat(slider.value) || 0;
    var pct = ((val - min) / (max - min)) * 100;

    /* Drop legacy inline fill (old main.js); track uses --calc-slider-pct in CSS */
    slider.style.removeProperty('background');
    slider.style.setProperty('--calc-slider-pct', pct + '%');
  }

  /* --------------------------------------------------------
     FLAVORS CAROUSEL — center initial item
  -------------------------------------------------------- */
  function initFlavorsCarousel() {
    var scrollEl = document.querySelector('.flavors__scroll');
    var center = document.querySelector('.flavor-item--center');
    if (!scrollEl || !center) return;

    // Scroll so center item is… centered
    requestAnimationFrame(function () {
      var scrollW = scrollEl.scrollWidth;
      var clientW = scrollEl.clientWidth;
      var itemLeft = center.offsetLeft;
      var itemW = center.offsetWidth;
      var target = itemLeft - (clientW / 2) + (itemW / 2);
      scrollEl.scrollLeft = target;
    });
  }

  /* --------------------------------------------------------
     BENEFITS CAROUSEL + DOTS
  -------------------------------------------------------- */
  function initBenefitsCarousel() {
    var scroll = document.getElementById('benefitsScroll');
    var dotsContainer = document.getElementById('benefitsDots');
    if (!scroll || !dotsContainer) return;

    var cards = scroll.querySelectorAll('.bcard');
    var dots = dotsContainer.querySelectorAll('.dot');
    if (!cards.length || !dots.length) return;

    function getActive() {
      var scrollLeft = scroll.scrollLeft;
      var cardW = cards[0].offsetWidth + 16; // gap
      return Math.round(scrollLeft / cardW);
    }

    function setActive(idx) {
      dots.forEach(function (d, i) {
        d.classList.toggle('dot--active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    scroll.addEventListener('scroll', function () {
      setActive(getActive());
    }, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var cardW = cards[0].offsetWidth + 16;
        scroll.scrollTo({ left: cardW * i, behavior: 'smooth' });
      });
    });

    setActive(0);
  }

  /* --------------------------------------------------------
     CLUBS CARDS CAROUSEL + DOTS (same pattern)
  -------------------------------------------------------- */
  function initClubsCarousel() {
    var scroll = document.getElementById('clubsScroll');
    var dotsContainer = document.getElementById('clubsDots');
    if (!scroll || !dotsContainer) return;

    var cards = scroll.querySelectorAll('.bcard');
    var dots = dotsContainer.querySelectorAll('.dot');
    if (!cards.length || !dots.length) return;

    function getActive() {
      var cardW = cards[0].offsetWidth + 16;
      return Math.round(scroll.scrollLeft / cardW);
    }

    function setActive(idx) {
      dots.forEach(function (d, i) {
        d.classList.toggle('dot--active', i === idx);
      });
    }

    scroll.addEventListener('scroll', function () {
      setActive(getActive());
    }, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var cardW = cards[0].offsetWidth + 16;
        scroll.scrollTo({ left: cardW * i, behavior: 'smooth' });
      });
    });

    setActive(0);
  }

  /* --------------------------------------------------------
     ACCORDION (sostav.html)
  -------------------------------------------------------- */
  function initAccordion() {
    var items = document.querySelectorAll('.accordion__item');
    items.forEach(function (item) {
      var header = item.querySelector('.accordion__header');
      var body = item.querySelector('.accordion__body');
      if (!header || !body) return;

      header.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all
        items.forEach(function (it) {
          it.classList.remove('is-open');
          var b = it.querySelector('.accordion__body');
          if (b) b.style.maxHeight = '0';
        });

        if (!isOpen) {
          item.classList.add('is-open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* --------------------------------------------------------
     NUTRITION TABS (sostav.html)
  -------------------------------------------------------- */
  function initNutritionTabs() {
    var tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('tab--active'); });
        tab.classList.add('tab--active');

        var target = tab.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(function (panel) {
          panel.style.display = panel.id === target ? 'block' : 'none';
        });
      });
    });
  }

  /* --------------------------------------------------------
     CHIPS / FILTER (dlya-klubov.html, o-flow.html)
  -------------------------------------------------------- */
  function initChips() {
    var groups = document.querySelectorAll('[data-chips]');
    groups.forEach(function (group) {
      var chips = group.querySelectorAll('.chip');
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          chips.forEach(function (c) { c.classList.remove('chip--active'); });
          chip.classList.add('chip--active');

          var key = chip.getAttribute('data-value');
          var cardId = group.getAttribute('data-chips');
          var card = document.getElementById(cardId);
          if (!card) return;

          var titleEl = card.querySelector('[data-chip-title]');
          var textEl = card.querySelector('[data-chip-text]');
          var imgEl = card.querySelector('[data-chip-img]');

          if (titleEl) titleEl.textContent = chip.getAttribute('data-title') || '';
          if (textEl) textEl.textContent = chip.getAttribute('data-text') || '';
          if (imgEl && chip.getAttribute('data-img')) {
            imgEl.src = chip.getAttribute('data-img');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------
     INTERSECTION OBSERVER — fade-in
  -------------------------------------------------------- */
  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      io.observe(el);
    });
  }

  /* --------------------------------------------------------
     HELPERS
  -------------------------------------------------------- */
  function formatPrice(n) {
    return Math.max(0, n).toLocaleString('ru-RU');
  }

  function formatNumber(n) {
    return n.toLocaleString('ru-RU');
  }

  /* --------------------------------------------------------
     INIT
  -------------------------------------------------------- */
  function init() {
    initMenu();
    initWorkoutsCalculator();
    initClubsCalculator();
    initFlavorsCarousel();
    initBenefitsCarousel();
    initClubsCarousel();
    initAccordion();
    initNutritionTabs();
    initChips();
    initFadeIn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
