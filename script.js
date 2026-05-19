document.addEventListener("DOMContentLoaded", () => {
  /* ══════════════════════════════════════════════
     1. NAVBAR — Scroll + Section-Aware Color
  ══════════════════════════════════════════════ */
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const DARK_SECTIONS = new Set(['skills', 'contact', 'projects']);

  if (navbar) {
    let ticking = false;

    const updateNav = () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle('scrolled', scrollY > 50);

      let currentSection = 'hero';
      document.querySelectorAll('section[id]').forEach(section => {
        if (scrollY >= section.offsetTop - 120) {
          currentSection = section.id;
        }
      });

      const isDarkThemePage = document.body.classList.contains('dark-theme-page');
      navbar.classList.toggle('nav-dark', DARK_SECTIONS.has(currentSection) || isDarkThemePage);

      navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle(
          'active',
          href === `#${currentSection}` || href === `${currentSection}.html`
        );
      });
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateNav(); // Init on load
  }

  /* ══════════════════════════════════════════════
     2. MOBILE MENU
  ══════════════════════════════════════════════ */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.classList.toggle('is-active', isOpen);
      navLinksContainer.classList.toggle('active', isOpen);
      
      navLinksContainer.style.maxHeight = isOpen 
        ? `${navLinksContainer.scrollHeight}px` 
        : '0px';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        navLinksContainer.classList.remove('active');
        navLinksContainer.style.maxHeight = '0px';
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinksContainer.classList.contains('active') && !navbar.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.classList.remove('is-active');
        navLinksContainer.classList.remove('active');
        navLinksContainer.style.maxHeight = '0px';
      }
    });
  }

  /* ══════════════════════════════════════════════
     3. INTERSECTION OBSERVER
  ══════════════════════════════════════════════ */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(entry.target.dataset.visibleClass || 'in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  const watch = (selector, visibleClass = 'in-view') => {
    document.querySelectorAll(selector).forEach(element => {
      if (visibleClass !== 'in-view') element.dataset.visibleClass = visibleClass;
      observer.observe(element);
    });
  };

  watch('.skill-glass-card');
  watch('.category-card');
  watch('.project-card');
  watch('.contact-box');
  watch('.about-glass-box');
  watch('.reveal', 'visible');
  watch('#about .about-text-blocks .readable-text');

  /* ══════════════════════════════════════════════
     4. STARFIELD + SHOOTING STARS
  ══════════════════════════════════════════════ */
  const starsEl = document.getElementById('stars');
  if (starsEl) {
    const isMobile = 'ontouchstart' in window || window.matchMedia('(pointer:coarse)').matches;
    const STAR_COUNT = isMobile ? 80 : 200;
    const SHOOT_COUNT = isMobile ? 8 : 20;
    const frag = document.createDocumentFragment();

    const TWINKLE_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffadd6', '#ffadd6', '#8dc8ff', '#8dc8ff', '#c084fc', '#fbbf24', '#2dd4bf'];
    const SHOOT_COLORS = ['#ffffff', '#ffffff', '#ffadd6', '#ff7ec0', '#8dc8ff', '#5aaeff', '#c084fc', '#fbbf24'];

    for (let i = 0; i < STAR_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const isBig = Math.random() > 0.82;
      const color = TWINKLE_COLORS[Math.floor(Math.random() * TWINKLE_COLORS.length)];
      
      s.style.cssText = `
        left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        --twinkle-dur: ${(1.8 + Math.random() * 4).toFixed(2)}s;
        --twinkle-delay: ${(Math.random() * 8).toFixed(2)}s;
        --star-min: ${(0.08 + Math.random() * 0.15).toFixed(2)};
        background: ${color};
        ${isBig ? 'width: 3px; height: 3px; border-radius: 1px;' : ''}
      `;
      frag.appendChild(s);
    }

    for (let i = 0; i < SHOOT_COUNT; i++) {
      const s = document.createElement('div');
      s.className = 'star shooting';
      
      const angle = 15 + Math.random() * 50;
      const dist = 100 + Math.random() * 200;
      const rad = (angle * Math.PI) / 180;
      const tailLen = 60 + Math.random() * 120;
      const dur = (0.8 + Math.random() * 1.4).toFixed(2);
      const delay = (i * 2.2 + Math.random() * 6).toFixed(2);
      const color = SHOOT_COLORS[Math.floor(Math.random() * SHOOT_COLORS.length)];
      const isRainbow = Math.random() > 0.85;

      if (isRainbow) {
        s.style.cssText = `
          left: ${Math.random() * 85}%; top: ${Math.random() * 45}%;
          width: ${tailLen * 0.8}px; height: 6px; border-radius: 0;
          background: repeating-linear-gradient(180deg, #ffadd6 0px, #ffadd6 1px, #fbbf24 1px, #fbbf24 2px, #2dd4bf 2px, #2dd4bf 3px, #8dc8ff 3px, #8dc8ff 4px, #c084fc 4px, #c084fc 5px, #a855f7 5px, #a855f7 6px);
          transform-origin: right center; transform: rotate(${angle}deg);
          --shoot-x: ${Math.cos(rad) * dist}px; --shoot-y: ${Math.sin(rad) * dist}px;
          --shoot-dur: ${(parseFloat(dur) * 1.4).toFixed(2)}s; --twinkle-delay: ${delay}s;
          box-shadow: 0 0 10px rgba(255, 173, 214, 0.3);
        `;
      } else {
        s.style.cssText = `
          left: ${Math.random() * 85}%; top: ${Math.random() * 45}%;
          width: ${tailLen}px; height: 2px; border-radius: 0;
          background: linear-gradient(90deg, transparent 0%, ${color}99 40%, ${color} 100%);
          transform-origin: right center; transform: rotate(${angle}deg);
          --shoot-x: ${Math.cos(rad) * dist}px; --shoot-y: ${Math.sin(rad) * dist}px;
          --shoot-dur: ${dur}s; --twinkle-delay: ${delay}s;
          box-shadow: 0 0 4px ${color}, 0 0 8px ${color}66;
        `;
      }
      frag.appendChild(s);
    }

    const PARTICLE_COUNT = isMobile ? 50 : 120;
    const PARTICLE_COLORS = ['#fbbf24', '#ffadd6', '#ff7ec0', '#c084fc', '#a855f7'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.className = 'particle ember';
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const size = Math.random() > 0.85 ? 4 : 2;
      
      p.style.cssText = `
        position: fixed; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        background: ${color}; box-shadow: 0 0 ${size * 2}px ${color};
        --drift-x: ${Math.random() * 200 - 100}px; --drift-y: -${Math.random() * 300 + 150}px;
        --anim-dur: ${15 + Math.random() * 30}s; --anim-delay: -${Math.random() * 30}s;
        --max-op: ${Math.random() * 0.5 + 0.4};
      `;
      frag.appendChild(p);
    }

    starsEl.appendChild(frag);

    if (!isMobile) {
      setInterval(() => {
        const s = document.createElement('div');
        const angle = 15 + Math.random() * 50;
        const dist = 120 + Math.random() * 180;
        const tail = 70 + Math.random() * 100;
        const dur = 0.8 + Math.random() * 1.2;
        const color = SHOOT_COLORS[Math.floor(Math.random() * SHOOT_COLORS.length)];
        const isRainbow = Math.random() > 0.85;

        if (isRainbow) {
          s.style.cssText = `
            position: absolute; left: ${Math.random() * 80}%; top: ${Math.random() * 40}%;
            width: ${tail * 0.8}px; height: 6px; border-radius: 0;
            background: repeating-linear-gradient(180deg, #ffadd6 0px, #ffadd6 1px, #fbbf24 1px, #fbbf24 2px, #2dd4bf 2px, #2dd4bf 3px, #8dc8ff 3px, #8dc8ff 4px, #c084fc 4px, #c084fc 5px, #a855f7 5px, #a855f7 6px);
            transform-origin: right center; transform: rotate(${angle}deg);
            box-shadow: 0 0 10px rgba(255, 173, 214, 0.3);
          `;
        } else {
          s.style.cssText = `
            position: absolute; left: ${Math.random() * 80}%; top: ${Math.random() * 40}%;
            width: ${tail}px; height: 2px; border-radius: 0;
            background: linear-gradient(90deg, transparent 0%, ${color}99 35%, ${color} 100%);
            transform-origin: right center; transform: rotate(${angle}deg);
            box-shadow: 0 0 4px ${color}, 0 0 10px ${color}55;
          `;
        }
        
        starsEl.appendChild(s);
        
        s.animate([
          { opacity: 0, transform: `rotate(${angle}deg) translateX(0)` },
          { opacity: 1, transform: `rotate(${angle}deg) translateX(${dist * .08}px)`, offset: .06 },
          { opacity: .9, transform: `rotate(${angle}deg) translateX(${dist * .8}px)`, offset: .85 },
          { opacity: 0, transform: `rotate(${angle}deg) translateX(${dist}px)` }
        ], { 
          duration: (isRainbow ? dur * 1.4 : dur) * 1000, 
          easing: 'linear', 
          fill: 'forwards' 
        }).onfinish = () => s.remove();
      }, 1800);
    }
  }

  /* ══════════════════════════════════════════════
     5. PIXEL CURSOR TRAIL — Desktop Only
  ══════════════════════════════════════════════ */
  if (window.matchMedia('(pointer:fine)').matches) {
    const TRAIL = ['#ffadd6', '#c084fc', '#8dc8ff', '#2dd4bf', '#fbbf24', '#ff7ec0'];
    let lastTime = 0;
    
    document.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - lastTime < 18 || Math.random() > 0.30) return;
      
      lastTime = now;
      const el = document.createElement('div');
      el.className = 'cursor-pixel';
      
      el.style.cssText = `
        left: ${e.clientX + (Math.random() * 6 - 3)}px;
        top: ${e.clientY + (Math.random() * 6 - 3)}px;
        background: ${TRAIL[Math.floor(Math.random() * TRAIL.length)]};
        width: ${Math.random() > .6 ? 5 : 3}px; 
        height: ${Math.random() > .6 ? 5 : 3}px;
      `;
      
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 500);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     6. HERO / ABOUT AURORA PARTICLES
  ══════════════════════════════════════════════ */
  const heroWrapper = document.querySelector('.hero-about-wrapper');
  if (heroWrapper) {
    const isMobile = 'ontouchstart' in window || window.matchMedia('(pointer:coarse)').matches;
    const HERO_PARTICLES = isMobile ? 35 : 80;
    const hFrag = document.createDocumentFragment();
    const H_COLORS = ['#ffadd6', '#8dc8ff', '#2dd4bf', '#c084fc', '#f4eeff'];

    for (let i = 0; i < HERO_PARTICLES; i++) {
      const p = document.createElement('div');
      p.className = 'hero-particle';
      const color = H_COLORS[Math.floor(Math.random() * H_COLORS.length)];
      const size = Math.random() > 0.85 ? 5 : 2.5;
      
      p.style.cssText = `
        left: ${Math.random() * 100}%; top: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        background: ${color}; box-shadow: 0 0 ${size * 2}px ${color};
        --drift-x: ${Math.random() * 100 - 50}px; --drift-y: -${Math.random() * 250 + 80}px;
        --anim-dur: ${10 + Math.random() * 25}s; --anim-delay: -${Math.random() * 25}s;
        --max-op: ${Math.random() * 0.5 + 0.5};
      `;
      hFrag.appendChild(p);
    }
    heroWrapper.appendChild(hFrag);
  }
});