/* ============================================================
   THEME
   ============================================================ */
const THEME_KEY = 'theme';
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('.mobile-menu__theme-btn').forEach(function (btn) {
    btn.classList.toggle('is-active', btn.dataset.theme === theme);
  });
}

var themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    var current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

document.querySelectorAll('.mobile-menu__theme-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    applyTheme(btn.dataset.theme);
  });
});

applyTheme(root.getAttribute('data-theme'));

/* ============================================================
   HEADER — scrolled state
   ============================================================ */
var header = document.getElementById('header');
var heroSection = document.getElementById('hero');

if (header && heroSection) {
  var headerObserver = new IntersectionObserver(
    function (entries) {
      header.classList.toggle('is-scrolled', !entries[0].isIntersecting);
    },
    { threshold: 0, rootMargin: '-' + (header.offsetHeight + 1) + 'px 0px 0px 0px' }
  );
  headerObserver.observe(heroSection);
}

/* ============================================================
   MOBILE MENU — iOS scroll lock
   ============================================================ */
var mobileMenu = document.getElementById('mobileMenu');
var burger = document.getElementById('burger');
var menuClose = document.getElementById('menuClose');
var menuLinks = document.querySelectorAll('.mobile-menu__link');

function openMenu() {
  var scrollY = window.scrollY;
  document.body.style.top = '-' + scrollY + 'px';
  document.body.classList.add('menu-open');
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
}

function closeMenu() {
  var scrollY = parseInt(document.body.style.top || '0', 10);
  document.body.classList.remove('menu-open');
  document.body.style.top = '';
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (scrollY) {
    window.scrollTo(0, -scrollY);
  }
}

if (burger) burger.addEventListener('click', openMenu);
if (menuClose) menuClose.addEventListener('click', closeMenu);

menuLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (href && href.indexOf('#') === 0) {
      e.preventDefault();
      closeMenu();
      setTimeout(function () {
        var target = document.querySelector(href);
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }, 320);
    }
  });
});

mobileMenu.addEventListener('click', function (e) {
  if (e.target === mobileMenu) closeMenu();
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
var revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.scroll-reveal').forEach(function (el) {
  revealObserver.observe(el);
});

/* ============================================================
   SMOOTH SCROLL — anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  if (link.classList.contains('mobile-menu__link')) return;
  link.addEventListener('click', function (e) {
    var href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.scrollY - (header ? header.offsetHeight : 0) - 8;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});

/* ============================================================
   CONTACT FORM — UX states (no backend yet)
   ============================================================ */
var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = contactForm.querySelector('.contacts__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем…';
    formStatus.textContent = '';
    formStatus.className = 'contacts__form-status';

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
      formStatus.textContent = 'Заявка принята, свяжемся с вами';
      formStatus.className = 'contacts__form-status success';
      contactForm.reset();
    }, 800);
  });
}

/* ============================================================
   HERO PARALLAX — subtle (optional)
   ============================================================ */
var heroVisual = document.querySelector('.hero__visual');
if (heroVisual && window.matchMedia('(min-width: 769px)').matches) {
  window.addEventListener('scroll', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var rect = heroVisual.getBoundingClientRect();
    var rate = 0.15;
    var y = (window.innerHeight - rect.top) * rate;
    heroVisual.style.transform = 'translateY(' + y + 'px)';
    heroVisual.style.webkitTransform = 'translateY(' + y + 'px)';
  }, { passive: true });
}
