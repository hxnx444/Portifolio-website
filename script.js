document.addEventListener('DOMContentLoaded', () => {
  const navbar             = document.querySelector('.navbar');
  const navLinks           = document.querySelectorAll('.nav-links a');
  const projectCards       = document.querySelectorAll('.project-card');
  const starsEl            = document.getElementById('stars');
  const menuToggle         = document.querySelector('.menu-toggle');
  const navLinksContainer  = document.querySelector('.nav-links');

  /* ── Mobile menu ──────────────────────────────────── */
  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willExpand = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', willExpand);
      menuToggle.classList.toggle('is-active');
      navLinksContainer.classList.toggle('active');

      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.style.maxHeight = navLinksContainer.scrollHeight + 'px';
      } else {
        navLinksContainer.style.maxHeight = '0px';
      }
    });

    navLinksContainer.addEventListener('transitionend', (e) => {
      if (e.propertyName !== 'max-height') return;
      if (navLinksContainer.classList.contains('active')) {
        navLinksContainer.style.maxHeight = '';
      }
    });

      /* Close menu when clicking outside */
      document.addEventListener('click', (e) => {
        if (navLinksContainer.classList.contains('active') && !navbar.contains(e.target)) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.classList.remove('is-active');
          navLinksContainer.classList.remove('active');
          navLinksContainer.style.maxHeight = '0px';
        }
      });
  }

  /* ── Stars ────────────────────────────────────────── */
  if (starsEl) {
    let STAR_COUNT     = 90;
    let SHOOTING_COUNT = 4;

    /* Reduce star density on touch/low-power devices */
    if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) {
      STAR_COUNT = 28;
      SHOOTING_COUNT = 1;
    }

    for (let i = 0; i < STAR_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'star';

      const dur   = (2 + Math.random() * 3).toFixed(2) + 's';
      const delay = (Math.random() * 4).toFixed(2)     + 's';
      s.style.setProperty('--twinkle-dur',   dur);
      s.style.setProperty('--twinkle-delay', delay);

      s.style.left = (Math.random() * 100) + '%';
      s.style.top  = (Math.random() * 85)  + '%';

      /* ~15% chance purple, ~5% chance golden */
      const r = Math.random();
      if (r > 0.95)      { s.style.background = '#fbbf24'; s.style.width = s.style.height = '3px'; }
      else if (r > 0.85) { s.style.background = '#a78bfa'; s.style.width = s.style.height = '3px'; }

      starsEl.appendChild(s);
    }

    /* Shooting pixels */
    for (let i = 0; i < SHOOTING_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'star shooting';
      s.style.left  = (Math.random() * 70)  + '%';
      s.style.top   = (Math.random() * 40)  + '%';
      s.style.setProperty('--twinkle-delay', (5 + i * 4 + Math.random() * 3).toFixed(2) + 's');
      starsEl.appendChild(s);
    }
  }

  /* ── City window flicker ──────────────────────────── */
  const cityscape = document.querySelector('.cityscape');
  if (cityscape) {
    const windows = cityscape.querySelectorAll('rect[fill="#fbbf24"], rect[fill="#a78bfa"], rect[fill="#2dd4bf"]');
    windows.forEach((w, i) => {
      w.classList.add('city-window');
      w.style.setProperty('--win-base',     w.getAttribute('opacity') || '0.7');
      w.style.setProperty('--flicker-dur',  (6 + Math.random() * 10).toFixed(1) + 's');
      w.style.setProperty('--flicker-delay',(Math.random() * 8).toFixed(1)       + 's');
    });
  }

  /* ── Navbar scroll behaviour ──────────────────────── */
  if (navbar) {
    let isScrolling = false;
    window.addEventListener('scroll', () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 50);

          const navCenter = navbar.getBoundingClientRect().top + navbar.offsetHeight / 2;
          let makeNavy = false;

          ['skills', 'contact'].forEach(id => {
            const sec = document.getElementById(id);
            if (!sec) return;
            const r = sec.getBoundingClientRect();
            if (r.top <= navCenter && r.bottom >= navCenter) makeNavy = true;
          });

          navbar.classList.toggle('navy-nav', makeNavy);

          /* Active link */
          let current = '';
          document.querySelectorAll('section[id]').forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
          });
          navLinks.forEach(a => {
            a.classList.toggle('active', current && a.getAttribute('href') === `#${current}`);
          });
          isScrolling = false;
        });
        isScrolling = true;
      }
    }, { passive: true });
  }

  /* ── Smooth-scroll & mobile menu close ───────────── */
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      /* Close mobile menu */
      if (menuToggle?.classList.contains('is-active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        navLinksContainer?.classList.remove('active');
        if (navLinksContainer) navLinksContainer.style.maxHeight = '0px';
      }

      const href = this.getAttribute('href');
      if (!href?.startsWith('#')) return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight || 0);
        history.pushState(null, null, href);
        window.scrollTo({ top: offset, behavior: 'smooth' });
      } else {
        window.location.href = './index.html' + href;
      }
    });
  });

  /* Scroll to hash on load */
  if (window.location.hash) {
    setTimeout(() => {
      const t = document.querySelector(window.location.hash);
      if (t) {
        const offset = t.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight || 0);
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }, 450);
  }

  /* ── Project card toggle ──────────────────────────── */
  projectCards.forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('active'));
  });

  /* ── Intersection Observer factory ───────────────── */
  function makeObserver(selector, className, threshold = 0.12) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add(className);
          obs.unobserve(e.target);
        }
      });
    }, { threshold });

    document.querySelectorAll(selector).forEach(el => obs.observe(el));
  }

  /* Scroll reveal (about text blocks etc.) */
  makeObserver('.reveal', 'visible');

  /* About text blocks reveal */
  makeObserver('#about .readable-text', 'in-view', 0.1);

  /* Skill cards */
  makeObserver('.skill-glass-card', 'in-view', 0.1);

  /* Category cards (projects page) */
  makeObserver('.category-card', 'in-view', 0.1);

  /* Project cards, Contact box, About box for unified animations */
  makeObserver('.project-card', 'in-view', 0.1);
  makeObserver('.contact-box', 'in-view', 0.1);
  makeObserver('.about-glass-box', 'in-view', 0.1);

  /* ── Pixel cursor trail (desktop only) ───────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const COLORS = ['#ffc8dd', '#a78bfa', '#7fb3ff', '#2dd4bf', '#fbbf24'];
    let trailTimer = null;

    document.addEventListener('mousemove', (e) => {
      if (trailTimer) return;           /* throttle to ~60fps */
      trailTimer = requestAnimationFrame(() => {
        trailTimer = null;
        const px = document.createElement('div');
        px.className = 'cursor-pixel';
        px.style.left  = e.clientX + 'px';
        px.style.top   = e.clientY + 'px';
        px.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
        document.body.appendChild(px);
        /* Remove after animation completes */
        px.addEventListener('animationend', () => px.remove());
      });
    });
  }

  /* ── Initial scroll event to set nav state ────────── */
  window.dispatchEvent(new Event('scroll'));
});