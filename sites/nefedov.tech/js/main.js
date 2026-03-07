/* ============================================================
   CONSTANTS
   ============================================================ */
const THEME_KEY  = 'nefedov-theme';
const ACCENT_KEY = 'nefedov-accent';
const ACCENT_DEFAULT = '#FF0000';

const ACCENTS = [
  '#FF0000',
  '#2563EB',
  '#22C55E',
  '#F97316',
  '#8B5CF6',
  '#06B6D4',
];

/* ============================================================
   ACCENT COLOR
   ============================================================ */
function setAccent(color) {
  document.documentElement.style.setProperty('--accent', color);
  localStorage.setItem(ACCENT_KEY, color);

  // Mark active dot in all palettes
  document.querySelectorAll('.accent-dot').forEach((dot) => {
    const isMatch = dot.dataset.color.toLowerCase() === color.toLowerCase();
    dot.classList.toggle('is-active', isMatch);
  });
}

// Init accent from storage or default
(function initAccent() {
  const stored = localStorage.getItem(ACCENT_KEY) || ACCENT_DEFAULT;
  setAccent(stored);
})();

// Bind all accent dots (desktop + mobile)
document.querySelectorAll('.accent-dot').forEach((dot) => {
  dot.addEventListener('click', () => setAccent(dot.dataset.color));
});

/* ============================================================
   THEME
   ============================================================ */
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  syncMobileThemeButtons(theme);
}

function syncMobileThemeButtons(theme) {
  document.querySelectorAll('.mobile-theme-btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.theme === theme);
  });
}

// Desktop: sun icon → light, moon icon → dark
const sunIcon  = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const themeToggle = document.getElementById('themeToggle');

if (themeToggle) {
  themeToggle.addEventListener('click', (e) => {
    const current = root.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// Mobile theme buttons
document.querySelectorAll('.mobile-theme-btn').forEach((btn) => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

// Init mobile buttons state
syncMobileThemeButtons(root.getAttribute('data-theme'));

/* ============================================================
   NAV — scrolled state
   ============================================================ */
const nav = document.getElementById('nav');

const navObserver = new IntersectionObserver(
  ([entry]) => {
    nav.classList.toggle('is-scrolled', !entry.isIntersecting);
  },
  { threshold: 0, rootMargin: '-' + (nav.offsetHeight + 1) + 'px 0px 0px 0px' }
);

const heroSection = document.getElementById('hero');
if (heroSection) navObserver.observe(heroSection);

/* ============================================================
   MOBILE MENU
   ============================================================ */
const mobileMenu  = document.getElementById('mobileMenu');
const navBurger   = document.getElementById('navBurger');
const menuClose   = document.getElementById('menuClose');
const menuLinks   = document.querySelectorAll('.mobile-menu__link');

function openMenu() {
  // iOS Safari scroll lock: save scroll position and fix body
  const scrollY = window.scrollY;
  document.body.style.top = '-' + scrollY + 'px';
  document.body.classList.add('menu-open');

  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');

  // Stagger animate menu links
  const links = mobileMenu.querySelectorAll('.mobile-menu__link');
  links.forEach((link, i) => {
    link.style.transition = 'none';
    link.style.opacity    = '0';
    link.style.transform  = 'translateY(16px)';
    link.style.webkitTransform = 'translateY(16px)';

    // Use rAF to let "none" transition apply first
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        link.style.transition = 'opacity 0.4s ease ' + (0.08 + i * 0.06) + 's, transform 0.4s ease ' + (0.08 + i * 0.06) + 's';
        link.style.opacity    = '1';
        link.style.transform  = 'translateY(0)';
        link.style.webkitTransform = 'translateY(0)';
      });
    });
  });
}

function closeMenu() {
  // iOS Safari scroll lock: restore scroll position
  const scrollY = parseInt(document.body.style.top || '0', 10);
  document.body.classList.remove('menu-open');
  document.body.style.top = '';

  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');

  if (scrollY) {
    window.scrollTo(0, -scrollY);
  }
}

if (navBurger) navBurger.addEventListener('click', openMenu);
if (menuClose) menuClose.addEventListener('click', closeMenu);

// Close on nav link click — smooth scroll then close
menuLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      closeMenu();
      // Wait for menu slide-out before scrolling
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          const offset = nav.offsetHeight + 8;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 420);
    }
  });
});

// Close on backdrop click (outside panel)
mobileMenu.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

/* ============================================================
   HERO NAME — letter-by-letter reveal
   ============================================================ */
function splitHeroName() {
  const el = document.querySelector('.hero__name');
  if (!el) return;

  const text  = el.textContent.trim();
  const words = text.split(' ');
  let html    = '';
  let delay   = 0;

  words.forEach((word, wi) => {
    // Each word wrapped in inline-block with nowrap — prevents mid-word breaks
    html += '<span style="display:inline-block;white-space:nowrap">';
    for (const char of word) {
      html += `<span class="letter" style="animation-delay:${(delay * 0.032).toFixed(3)}s">${char}</span>`;
      delay++;
    }
    html += '</span>';
    if (wi < words.length - 1) {
      html += ' '; // plain space between words → natural word-break opportunity
    }
  });

  el.innerHTML = html;
}

splitHeroName();

/* ============================================================
   SCROLL REVEAL — sections / elements
   ============================================================ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.scroll-reveal').forEach((el) => {
  revealObserver.observe(el);
});

/* ============================================================
   AI SECTION CELLS — stagger on scroll reveal
   ============================================================ */
const aiCellObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cells = entry.target.querySelectorAll('.ai-cell');
        cells.forEach((cell, i) => {
          cell.style.opacity   = '0';
          cell.style.transform = 'translateX(-16px)';
          cell.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              cell.style.opacity   = '1';
              cell.style.transform = 'translateX(0)';
            });
          });
        });
        aiCellObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

const aiGrid = document.querySelector('.ai-grid');
if (aiGrid) aiCellObserver.observe(aiGrid);

/* ============================================================
   STATS — counter animation
   ============================================================ */
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  const prefix   = el.dataset.prefix || '';
  const suffix   = el.dataset.suffix || '';
  const duration = 1400;
  const start    = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function tick(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOut(progress) * target);
    el.textContent = prefix + value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.count !== undefined) {
          animateCounter(el);
        }
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.hero__stat-num').forEach((el) => {
  counterObserver.observe(el);
});

/* ============================================================
   SMOOTH SCROLL — anchor links (desktop nav)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  // Skip mobile menu links — handled separately
  if (link.classList.contains('mobile-menu__link')) return;

  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const offset = nav.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   DIVIDER BAND — pause on hover
   ============================================================ */
const band = document.querySelector('.divider-band__track');
if (band) {
  band.addEventListener('mouseenter', () => {
    band.style.animationPlayState = 'paused';
  });
  band.addEventListener('mouseleave', () => {
    band.style.animationPlayState = 'running';
  });
}

/* ============================================================
   SKILL ITEMS — stagger on reveal
   ============================================================ */
const skillColObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.skill-item');
        items.forEach((item, i) => {
          item.style.opacity    = '0';
          item.style.transform  = 'translateX(-12px)';
          item.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              item.style.opacity   = '1';
              item.style.transform = 'translateX(0)';
            });
          });
        });
        skillColObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.skills__col').forEach((col) => {
  skillColObserver.observe(col);
});

/* ============================================================
   EXPERIENCE ITEMS — stagger on reveal
   ============================================================ */
const expObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const wins = entry.target.querySelectorAll('.exp-item__win');
        wins.forEach((win, i) => {
          win.style.opacity    = '0';
          win.style.transform  = 'translateX(-8px)';
          win.style.transition = `opacity 0.35s ease ${0.2 + i * 0.08}s, transform 0.35s ease ${0.2 + i * 0.08}s`;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              win.style.opacity   = '1';
              win.style.transform = 'translateX(0)';
            });
          });
        });
        expObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.exp-item').forEach((item) => {
  expObserver.observe(item);
});

/* ============================================================
   CTA HEADLINE — word-by-word reveal
   ============================================================ */
function animateCTAHeadline() {
  const el = document.querySelector('.cta__headline');
  if (!el) return;

  const words = el.textContent.trim().split(' ');
  el.innerHTML = words
    .map(
      (word, i) =>
        `<span class="cta-word" style="display:inline-block;opacity:0;transform:translateY(20px);transition:opacity 0.5s ease ${i * 0.07}s,transform 0.5s ease ${i * 0.07}s">${word}&nbsp;</span>`
    )
    .join('');

  const ctaObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.cta-word').forEach((word) => {
          word.style.opacity   = '1';
          word.style.transform = 'translateY(0)';
        });
        ctaObserver.unobserve(entry.target);
      }
    },
    { threshold: 0.3 }
  );

  ctaObserver.observe(el);
}

animateCTAHeadline();

/* ============================================================
   ABOUT TAGS — click ripple
   ============================================================ */
document.querySelectorAll('.tag').forEach((tag) => {
  tag.addEventListener('click', function () {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = '';
    }, 150);
  });
});
