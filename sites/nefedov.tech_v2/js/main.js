(function () {
  'use strict';

  /* ================================================================
     LOADER
  ================================================================ */
  var loader     = document.getElementById('loader');
  var loaderFill = document.getElementById('loaderFill');
  var loaderNum  = document.getElementById('loaderNum');
  var loaderDone = false;

  /* Counter is started by the inline script above the loader div.
     Here we just clear it when done. */

  function loadHeroScene() {
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js';
    s.onload = function () {
      var h = document.createElement('script');
      h.src = 'js/hero.js';
      document.head.appendChild(h);
    };
    document.head.appendChild(s);
  }

  function finishLoader() {
    if (loaderDone) return;
    loaderDone = true;
    if (window.__ldrT) { clearInterval(window.__ldrT); window.__ldrT = null; }
    if (loaderNum)  loaderNum.textContent  = '100';
    if (loaderFill) loaderFill.style.width = '100%';
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
      startHeroCounters();
      startHeroRoleTypewriter();
      /* Three.js + hero canvas load AFTER loader hides — never blocks main thread */
      setTimeout(loadHeroScene, 200);
    }, 420);
  }

  /* Safari: window "load" can be delayed forever if a subresource hangs; DOMContentLoaded + cap is enough for a static landing */
  if (document.readyState === 'complete') {
    setTimeout(finishLoader, 700);
  } else if (document.readyState === 'interactive') {
    setTimeout(finishLoader, 500);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(finishLoader, 500); });
    window.addEventListener('load', function () { setTimeout(finishLoader, 350); });
  }
  setTimeout(finishLoader, 2800); /* safety fallback even if load never fires */

  /* ================================================================
     NAV — scroll state
  ================================================================ */
  var nav = document.getElementById('nav');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ================================================================
     MOBILE MENU
     iOS scroll-lock: position:fixed trick instead of overflow:hidden
  ================================================================ */
  var burger     = document.getElementById('navBurger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuClose  = document.getElementById('menuClose');
  var backdrop   = document.getElementById('menuBackdrop');

  var savedScrollY = 0;
  var menuIsOpen   = false;

  function lockBody() {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = '-' + savedScrollY + 'px';
    document.body.style.width    = '100%';
  }

  function unlockBody() {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, savedScrollY);
  }

  /* Unlock body without restoring scroll — used before smooth-scroll navigation */
  function unlockBodySilent() {
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
  }

  function openMenu() {
    if (menuIsOpen) return;
    menuIsOpen = true;
    lockBody();
    mobileMenu.classList.add('open');
    backdrop.classList.add('open');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    if (!menuIsOpen) return;
    menuIsOpen = false;
    unlockBody();
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  /* Close menu and prepare for navigation (don't restore scroll position —
     the smooth-scroll handler will scroll to the target instead) */
  function closeMenuForNav() {
    if (!menuIsOpen) return;
    menuIsOpen = false;
    /* Instant-restore scroll position so getBoundingClientRect works correctly */
    unlockBodySilent();
    window.scrollTo(0, savedScrollY);
    mobileMenu.classList.remove('open');
    backdrop.classList.remove('open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (burger)    burger.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (backdrop)  backdrop.addEventListener('click', closeMenu);

  /* ================================================================
     SCROLL REVEAL — IntersectionObserver
  ================================================================ */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

    for (var ri = 0; ri < revealEls.length; ri++) {
      revealObs.observe(revealEls[ri]);
    }
  } else {
    for (var rf = 0; rf < revealEls.length; rf++) {
      revealEls[rf].classList.add('visible');
    }
  }

  /* ================================================================
     SECTION TAG TYPEWRITER
  ================================================================ */
  var tagEls = document.querySelectorAll('.js-tag-type');

  function typeText(el, text, speed) {
    if (!el || el.dataset.typed === 'true') return;
    el.dataset.typed = 'true';
    el.textContent = '';
    var idx = 0;
    var timer = setInterval(function () {
      idx += 1;
      el.textContent = text.slice(0, idx);
      if (idx >= text.length) clearInterval(timer);
    }, speed);
  }

  if ('IntersectionObserver' in window) {
    var tagObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        typeText(el, el.dataset.text || el.textContent || '', 28);
        tagObs.unobserve(el);
      });
    }, { threshold: 0.4 });

    for (var ti = 0; ti < tagEls.length; ti++) {
      tagObs.observe(tagEls[ti]);
    }
  } else {
    for (var tf = 0; tf < tagEls.length; tf++) {
      var t = tagEls[tf];
      typeText(t, t.dataset.text || t.textContent || '', 0);
    }
  }

  /* ================================================================
     COUNTERS
  ================================================================ */
  function runCounterAnimation(counters, duration) {
    counters.forEach(function (el) {
      var target   = parseInt(el.getAttribute('data-count'), 10);
      if (!target && target !== 0) return;
      var suffix   = el.getAttribute('data-suffix') || '';
      var startTime = null;

      function step(ts) {
        if (!startTime) startTime = ts;
        var elapsed = ts - startTime;
        var pct     = Math.min(elapsed / duration, 1);
        var eased   = 1 - Math.pow(1 - pct, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (pct < 1) requestAnimationFrame(step);
        else         el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    });
  }

  function startHeroCounters() {
    runCounterAnimation(document.querySelectorAll('.hero [data-count]'), 1400);
    document.querySelectorAll('.hero [data-static]').forEach(function (el) {
      el.textContent = el.getAttribute('data-static');
    });
  }

  /* ================================================================
     ARCH DIAGRAM ANIMATION
     Sequential signal through 7 steps, top+bottom rows in sync.
     Includes: error at step 4 → return to step 2, then success at 6
     → feedback to step 1 (Planka). Restarts automatically.
  ================================================================ */
  (function () {
    var archDiagram = document.getElementById('archDiagram');
    if (!archDiagram) return;

    var cols = archDiagram.querySelectorAll('.arch__col');
    var seps = archDiagram.querySelectorAll('.arch__sep');
    var statusText = document.getElementById('archStatusText');

    if (!cols.length) return;

    var STEP_MS  = 800;
    var PAUSE_MS = 1700;

    var SEQ = [
      { step: 0, text: 'пользователь ставит задачу в карточку' },
      { step: 1, type: 'question', text: 'агент строит план и при необходимости возвращается с вопросами' },
      { step: 0, type: 'return', text: 'контекст уточнён, задача снова на постановке' },
      { step: 1, text: 'план готов, вопросов больше нет' },
      { step: 2, text: 'задача уходит в очередь и ждёт своей очереди' },
      { step: 3, text: 'worker берёт задачу и начинает писать код' },
      { step: 4, type: 'error', text: 'локальная проверка не прошла, задача возвращается в работу' },
      { step: 3, type: 'return', text: 'worker дорабатывает код после локальной ошибки' },
      { step: 4, text: 'локальная проверка пройдена, можно идти дальше' },
      { step: 5, type: 'error', text: 'CI/CD нашёл ошибку, задача снова возвращается в работу' },
      { step: 3, type: 'return', text: 'worker чинит проблему после CI/CD' },
      { step: 4, text: 'локально всё снова проверено' },
      { step: 5, text: 'задача пушится в git, CI/CD повторно проверяет и деплоит' },
      { step: 6, type: 'success', text: 'задача завершена, worker готов взять следующую карточку' },
      { step: 2, type: 'feedback', text: 'если в очереди уже есть задачи, worker переходит к следующей' },
      { step: -1, text: '' }
    ];

    var seqIdx  = 0;
    var timer   = null;
    var started = false;

    function clearAll() {
      for (var i = 0; i < cols.length; i++) {
        cols[i].classList.remove('is-active', 'is-question', 'is-error', 'is-return', 'is-success', 'is-feedback');
      }
      for (var j = 0; j < seps.length; j++) {
        seps[j].classList.remove('is-active', 'is-error');
      }
    }

    function stateClass(type) {
      if (!type) return 'is-active';
      var map = {
        question: 'is-question',
        error: 'is-error',
        return: 'is-return',
        success: 'is-success',
        feedback: 'is-feedback'
      };
      return map[type] || 'is-active';
    }

    function tick() {
      var item = SEQ[seqIdx];
      seqIdx = (seqIdx + 1) % SEQ.length;

      clearAll();

      if (item.step < 0) {
        if (statusText) statusText.textContent = 'worker ждёт следующую задачу';
        timer = setTimeout(tick, PAUSE_MS);
        return;
      }

      var cls = stateClass(item.type);
      var col = cols[item.step];
      if (col) col.classList.add(cls);

      if (item.step > 0) {
        var sep = seps[item.step - 1];
        if (sep) sep.classList.add((item.type === 'error' || item.type === 'question' || item.type === 'return') ? 'is-error' : 'is-active');
      }

      if (statusText) statusText.textContent = item.text || '';

      var dur = (item.type === 'error' || item.type === 'success' || item.type === 'question') ? STEP_MS + 250 : STEP_MS;
      timer = setTimeout(tick, dur);
    }

    /* Start on scroll-in */
    if ('IntersectionObserver' in window) {
      var archObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !started) {
            started = true;
            timer = setTimeout(tick, 600);
            archObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      archObs.observe(archDiagram);
    } else {
      started = true;
      timer = setTimeout(tick, 600);
    }

    /* Pause when tab hidden */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearTimeout(timer);
      } else if (started) {
        timer = setTimeout(tick, 300);
      }
    });
  }());

  /* ================================================================
     HERO ROLE TYPEWRITER
  ================================================================ */
  function startHeroRoleTypewriter() {
    var role = document.getElementById('heroRole');
    var roleTextEl = document.getElementById('heroRoleText');
    if (!role || !roleTextEl) return;
    var text = role.getAttribute('data-text') || '';
    var i = 0;
    roleTextEl.textContent = '';
    var timer = setInterval(function () {
      i += 1;
      roleTextEl.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(timer);
    }, 35);
  }

  /* ================================================================
     SMOOTH SCROLL — anchor links
     Handles both desktop anchors and mobile-menu anchor navigation.
     When the menu is open, closes it first (via closeMenuForNav which
     restores scroll position instantly), then smooth-scrolls to target.
  ================================================================ */
  var anchors = document.querySelectorAll('a[href^="#"]');
  for (var ai = 0; ai < anchors.length; ai++) {
    anchors[ai].addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      /* If menu is open, close it and restore scroll first */
      closeMenuForNav();

      var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 64;

      /* Use rAF so body styles are applied before we read getBoundingClientRect */
      requestAnimationFrame(function () {
        var top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

}());
