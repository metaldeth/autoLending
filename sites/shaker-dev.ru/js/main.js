(function () {
  'use strict';

  /* ----------------------------------------------------------------
     Theme
  ---------------------------------------------------------------- */
  var html = document.documentElement;
  var themeToggle = document.getElementById('themeToggle');

  function getInitialTheme() {
    var stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
    return 'dark';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ----------------------------------------------------------------
     Header scroll state
  ---------------------------------------------------------------- */
  var header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    if (window.pageYOffset > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------------
     Mobile menu
  ---------------------------------------------------------------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta') : [];
  var scrollY = 0;

  function openMenu() {
    scrollY = window.pageYOffset;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.width = '100%';
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* ----------------------------------------------------------------
     Scroll-triggered fade-in (IntersectionObserver)
  ---------------------------------------------------------------- */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ----------------------------------------------------------------
     Hero parallax on scroll
  ---------------------------------------------------------------- */
  var heroRight = document.getElementById('heroRight');

  function onHeroParallax() {
    if (!heroRight) return;
    var sy = window.pageYOffset;
    var translateY = sy * 0.12;
    heroRight.style.WebkitTransform = 'translateY(' + translateY + 'px)';
    heroRight.style.transform = 'translateY(' + translateY + 'px)';
  }

  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    window.addEventListener('scroll', onHeroParallax, { passive: true });
  }

  /* ----------------------------------------------------------------
     Smooth scroll for anchor links
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var headerH = header ? header.offsetHeight : 72;
      var targetY = target.getBoundingClientRect().top + window.pageYOffset - headerH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------------
     Contact form
  ---------------------------------------------------------------- */
  var form = document.getElementById('contactForm');
  var formSubmit = document.getElementById('formSubmit');
  var formStatus = document.getElementById('formStatus');

  /* Replace with actual Google Apps Script endpoint */
  var FORM_ENDPOINT = '';

  function setFormStatus(type, msg) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form__status ' + type;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = form.querySelector('#name').value.trim();
      var phone = form.querySelector('#phone').value.trim();
      var idea = form.querySelector('#idea').value.trim();

      if (!name || !phone || !idea) {
        setFormStatus('error', 'Пожалуйста, заполните все поля.');
        return;
      }

      if (formSubmit) {
        formSubmit.disabled = true;
        formSubmit.textContent = 'Отправляем…';
      }
      setFormStatus('', '');

      var data = { name: name, phone: phone, idea: idea };

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function () {
            setFormStatus('success', 'Заявка принята, свяжемся с вами!');
            form.reset();
          })
          .catch(function () {
            setFormStatus('error', 'Ошибка, попробуйте ещё раз.');
          })
          .finally(function () {
            if (formSubmit) {
              formSubmit.disabled = false;
              formSubmit.textContent = 'Отправить заявку';
            }
          });
      } else {
        /* Demo mode without backend */
        setTimeout(function () {
          setFormStatus('success', 'Заявка принята, свяжемся с вами!');
          form.reset();
          if (formSubmit) {
            formSubmit.disabled = false;
            formSubmit.textContent = 'Отправить заявку';
          }
        }, 1200);
      }
    });
  }

})();
