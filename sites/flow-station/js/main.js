(function () {
  'use strict';

  /* ========================================================
     MENU TOGGLE
     ======================================================== */
  var header     = document.getElementById('header');
  var menuEl     = document.getElementById('menu');
  var menuToggle = document.getElementById('menuToggle');
  var menuLinks  = document.querySelectorAll('.menu__link');
  var scrollY    = 0;

  var burgerImg = menuToggle.querySelector('img');
  var ICON_BURGER = 'img/icon-hamburger.svg';
  var ICON_CLOSE  = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23f5f5f7' stroke-width='2' stroke-linecap='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'/%3E%3Cline x1='6' y1='6' x2='18' y2='18'/%3E%3C/svg%3E";

  function openMenu() {
    scrollY = window.scrollY;
    menuEl.classList.add('is-open');
    menuEl.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Закрыть меню');
    if (burgerImg) burgerImg.src = ICON_CLOSE;
    document.body.style.position  = 'fixed';
    document.body.style.top       = '-' + scrollY + 'px';
    document.body.style.width     = '100%';
  }

  function closeMenu() {
    menuEl.classList.remove('is-open');
    menuEl.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Открыть меню');
    if (burgerImg) burgerImg.src = ICON_BURGER;
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, scrollY);
  }

  menuToggle.addEventListener('click', function () {
    if (menuEl.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuEl.classList.contains('is-open')) closeMenu();
  });

  /* ========================================================
     HEADER TRANSPARENCY ON HERO
     ======================================================== */
  function updateHeader() {
    if (window.scrollY < 30) {
      header.classList.add('is-transparent');
    } else {
      header.classList.remove('is-transparent');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ========================================================
     CALCULATOR
     ======================================================== */
  var slider       = document.getElementById('workoutsSlider');
  var workoutsVal  = document.getElementById('workoutsValue');
  var bottleEl     = document.getElementById('bottlePrice');
  var flowEl       = document.getElementById('flowPrice');
  var savingsEl    = document.getElementById('savings');

  var BOTTLE_PER_WORKOUT = 300;
  var FLOW_PRICE         = 499;

  function formatPrice(n) {
    return n.toLocaleString('ru-RU') + '\u00a0\u20bd';
  }

  function updateCalc() {
    var workouts   = parseInt(slider.value, 10);
    var bottleTotal = workouts * BOTTLE_PER_WORKOUT;
    var savings    = bottleTotal - FLOW_PRICE;
    if (savings < 0) savings = 0;

    workoutsVal.textContent = workouts;
    bottleEl.textContent    = formatPrice(bottleTotal);
    flowEl.textContent      = formatPrice(FLOW_PRICE);
    savingsEl.textContent   = formatPrice(savings);

    updateSliderFill(slider);
  }

  function updateSliderFill(input) {
    var min = parseFloat(input.min) || 0;
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value);
    var pct = ((val - min) / (max - min)) * 100;
    input.style.background =
      'linear-gradient(to right, var(--accent) ' + pct + '%, var(--accent-dim) ' + pct + '%)';
  }

  if (slider) {
    slider.addEventListener('input', updateCalc);
    updateCalc();
  }

  /* ========================================================
     BENEFITS CAROUSEL — DOTS
     ======================================================== */
  var scrollEl  = document.getElementById('benefitsScroll');
  var dotsEl    = document.getElementById('benefitsDots');
  var dots      = dotsEl ? Array.from(dotsEl.querySelectorAll('.dot')) : [];
  var cards     = scrollEl ? Array.from(scrollEl.querySelectorAll('.bcard')) : [];

  function setActiveDot(idx) {
    dots.forEach(function (d, i) {
      var active = i === idx;
      d.classList.toggle('dot--active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  if (scrollEl && dots.length > 0) {
    var scrollTimer = null;
    scrollEl.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var cardW = cards[0] ? cards[0].offsetWidth + 16 : 336; // card width + gap
        var idx = Math.round(scrollEl.scrollLeft / cardW);
        idx = Math.max(0, Math.min(idx, dots.length - 1));
        setActiveDot(idx);
      }, 80);
    }, { passive: true });

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        var cardW = cards[0] ? cards[0].offsetWidth + 16 : 336;
        scrollEl.scrollTo({ left: i * cardW, behavior: 'smooth' });
        setActiveDot(i);
      });
    });
  }

  /* ========================================================
     FADE-IN ON SCROLL
     ======================================================== */
  var fadeEls = document.querySelectorAll(
    '.hydration__title, .hydration__sub, .hydration__visual, ' +
    '.flavors .section-title, .calc-section .section-title, .calc-card, ' +
    '.benefits .section-title, .cta-bar'
  );

  fadeEls.forEach(function (el) { el.classList.add('fade-in'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) { io.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
