document.addEventListener("DOMContentLoaded", () => {

  /* ══════════════════════════════════════════════
     1. NAVBAR — Scroll + Section-Aware Styling
  ══════════════════════════════════════════════ */
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const DARK_SECTIONS = new Set(["skills", "contact", "projects"]);
  const isDarkThemePage = document.body.classList.contains("dark-theme-page");

  if (navbar) {
    let ticking = false;

    const updateNav = () => {
      const scrollY = window.scrollY;
      navbar.classList.toggle("scrolled", scrollY > 50);

      // Section-aware dark mode (only on index.html where sections exist)
      const sections = document.querySelectorAll("section[id]");
      if (sections.length) {
        let currentSection = "hero";
        sections.forEach((section) => {
          if (scrollY >= section.offsetTop - 120) {
            currentSection = section.id;
          }
        });
        navbar.classList.toggle("nav-dark", DARK_SECTIONS.has(currentSection) || isDarkThemePage);

        navLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          link.classList.toggle("active", href === `#${currentSection}`);
        });
      } else {
        // Sub-pages: always dark nav, highlight by filename match
        navbar.classList.add("nav-dark");
        const currentFile = window.location.pathname.split("/").pop() || "index.html";
        navLinks.forEach((link) => {
          const href = link.getAttribute("href") || "";
          // Strip hash — just match the filename part
          const linkFile = href.split("#")[0].split("/").pop();
          link.classList.toggle("active", linkFile === currentFile);
        });
      }
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateNav();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateNav();
  }

  /* ══════════════════════════════════════════════
     2. MOBILE MENU
  ══════════════════════════════════════════════ */
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (menuToggle && navLinksContainer) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-active");
      navLinksContainer.classList.remove("active");
      navLinksContainer.style.maxHeight = "0px";
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.classList.toggle("is-active", isOpen);
      navLinksContainer.classList.toggle("active", isOpen);
      navLinksContainer.style.maxHeight = isOpen
        ? `${navLinksContainer.scrollHeight}px`
        : "0px";
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (e) => {
      if (navLinksContainer.classList.contains("active") && !navbar.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ══════════════════════════════════════════════
     3. INTERSECTION OBSERVER — Scroll Reveals
  ══════════════════════════════════════════════ */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(entry.target.dataset.visibleClass || "in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 }
  );

  const watch = (selector, visibleClass = "in-view") => {
    document.querySelectorAll(selector).forEach((el) => {
      if (visibleClass !== "in-view") el.dataset.visibleClass = visibleClass;
      observer.observe(el);
    });
  };

  watch(".skill-glass-card");
  watch(".category-card");
  watch(".project-card");  // covers .coming-soon too
  watch(".contact-box");
  watch(".about-glass-box");
  watch(".fp-card", "visible");
  watch(".reveal", "visible");
  watch("#about .about-text-blocks .readable-text");

  /* ══════════════════════════════════════════════
     4. STARFIELD + SHOOTING STARS
  ══════════════════════════════════════════════ */
  const starsEl = document.getElementById("stars");
  if (starsEl) {
    const isMobile = "ontouchstart" in window || window.matchMedia("(pointer:coarse)").matches;
    const STAR_COUNT = isMobile ? 80 : 200;
    const SHOOT_COUNT = isMobile ? 8 : 20;
    const frag = document.createDocumentFragment();

    const TWINKLE_COLORS = [
      "#ffffff", "#ffffff", "#ffffff", "#ffffff",
      "#ffadd6", "#ffadd6", "#8dc8ff", "#8dc8ff",
      "#c084fc", "#fbbf24", "#2dd4bf",
    ];
    const SHOOT_COLORS = [
      "#ffffff", "#ffffff", "#ffadd6", "#ff7ec0",
      "#8dc8ff", "#5aaeff", "#c084fc", "#fbbf24",
    ];

    // Regular stars
    for (let i = 0; i < STAR_COUNT; i++) {
      const s = document.createElement("div");
      s.className = "star";
      const isBig = Math.random() > 0.82;
      const color = TWINKLE_COLORS[Math.floor(Math.random() * TWINKLE_COLORS.length)];
      s.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--twinkle-dur:${(1.8 + Math.random() * 4).toFixed(2)}s`,
        `--twinkle-delay:${(Math.random() * 8).toFixed(2)}s`,
        `--star-min:${(0.08 + Math.random() * 0.15).toFixed(2)}`,
        `background:${color}`,
        isBig ? "width:3px;height:3px;border-radius:1px" : "",
      ].join(";");
      frag.appendChild(s);
    }

    // Shooting stars (CSS-animated)
    for (let i = 0; i < SHOOT_COUNT; i++) {
      const s = document.createElement("div");
      s.className = "star shooting";
      const angle = 15 + Math.random() * 50;
      const dist = 100 + Math.random() * 200;
      const rad = (angle * Math.PI) / 180;
      const tailLen = 60 + Math.random() * 120;
      const dur = (0.8 + Math.random() * 1.4).toFixed(2);
      const delay = (i * 2.2 + Math.random() * 6).toFixed(2);
      const color = SHOOT_COLORS[Math.floor(Math.random() * SHOOT_COLORS.length)];
      const isRainbow = Math.random() > 0.85;

      if (isRainbow) {
        s.style.cssText = [
          `left:${Math.random() * 85}%`,
          `top:${Math.random() * 45}%`,
          `width:${tailLen * 0.8}px`,
          "height:6px",
          "border-radius:0",
          "background:repeating-linear-gradient(180deg,#ffadd6 0px,#ffadd6 1px,#fbbf24 1px,#fbbf24 2px,#2dd4bf 2px,#2dd4bf 3px,#8dc8ff 3px,#8dc8ff 4px,#c084fc 4px,#c084fc 5px,#a855f7 5px,#a855f7 6px)",
          `transform-origin:right center`,
          `transform:rotate(${angle}deg)`,
          `--shoot-x:${Math.cos(rad) * dist}px`,
          `--shoot-y:${Math.sin(rad) * dist}px`,
          `--shoot-dur:${(parseFloat(dur) * 1.4).toFixed(2)}s`,
          `--twinkle-delay:${delay}s`,
          "box-shadow:0 0 10px rgba(255,173,214,0.3)",
        ].join(";");
      } else {
        s.style.cssText = [
          `left:${Math.random() * 85}%`,
          `top:${Math.random() * 45}%`,
          `width:${tailLen}px`,
          "height:2px",
          "border-radius:0",
          `background:linear-gradient(90deg,transparent 0%,${color}99 40%,${color} 100%)`,
          `transform-origin:right center`,
          `transform:rotate(${angle}deg)`,
          `--shoot-x:${Math.cos(rad) * dist}px`,
          `--shoot-y:${Math.sin(rad) * dist}px`,
          `--shoot-dur:${dur}s`,
          `--twinkle-delay:${delay}s`,
          `box-shadow:0 0 4px ${color},0 0 8px ${color}66`,
        ].join(";");
      }
      frag.appendChild(s);
    }

    // Ember particles
    const PARTICLE_COUNT = isMobile ? 50 : 120;
    const PARTICLE_COLORS = ["#fbbf24", "#ffadd6", "#ff7ec0", "#c084fc", "#a855f7"];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "particle ember";
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const size = Math.random() > 0.85 ? 4 : 2;
      p.style.cssText = [
        "position:fixed",
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `width:${size}px`,
        `height:${size}px`,
        `background:${color}`,
        `box-shadow:0 0 ${size * 2}px ${color}`,
        `--drift-x:${Math.random() * 200 - 100}px`,
        `--drift-y:-${Math.random() * 300 + 150}px`,
        `--anim-dur:${15 + Math.random() * 30}s`,
        `--anim-delay:-${Math.random() * 30}s`,
        `--max-op:${(Math.random() * 0.5 + 0.4).toFixed(2)}`,
      ].join(";");
      frag.appendChild(p);
    }

    starsEl.appendChild(frag);

    // Dynamic shooting stars interval (desktop only)
    if (!isMobile) {
      setInterval(() => {
        const s = document.createElement("div");
        const angle = 15 + Math.random() * 50;
        const dist = 120 + Math.random() * 180;
        const tail = 70 + Math.random() * 100;
        const dur = 0.8 + Math.random() * 1.2;
        const color = SHOOT_COLORS[Math.floor(Math.random() * SHOOT_COLORS.length)];
        const isRainbow = Math.random() > 0.85;

        if (isRainbow) {
          s.style.cssText = [
            "position:absolute",
            `left:${Math.random() * 80}%`,
            `top:${Math.random() * 40}%`,
            `width:${tail * 0.8}px`,
            "height:6px",
            "border-radius:0",
            "background:repeating-linear-gradient(180deg,#ffadd6 0px,#ffadd6 1px,#fbbf24 1px,#fbbf24 2px,#2dd4bf 2px,#2dd4bf 3px,#8dc8ff 3px,#8dc8ff 4px,#c084fc 4px,#c084fc 5px,#a855f7 5px,#a855f7 6px)",
            `transform-origin:right center`,
            `transform:rotate(${angle}deg)`,
            "box-shadow:0 0 10px rgba(255,173,214,0.3)",
          ].join(";");
        } else {
          s.style.cssText = [
            "position:absolute",
            `left:${Math.random() * 80}%`,
            `top:${Math.random() * 40}%`,
            `width:${tail}px`,
            "height:2px",
            "border-radius:0",
            `background:linear-gradient(90deg,transparent 0%,${color}99 35%,${color} 100%)`,
            `transform-origin:right center`,
            `transform:rotate(${angle}deg)`,
            `box-shadow:0 0 4px ${color},0 0 10px ${color}55`,
          ].join(";");
        }

        starsEl.appendChild(s);

        s.animate(
          [
            { opacity: 0, transform: `rotate(${angle}deg) translateX(0)` },
            { opacity: 1, transform: `rotate(${angle}deg) translateX(${dist * 0.08}px)`, offset: 0.06 },
            { opacity: 0.9, transform: `rotate(${angle}deg) translateX(${dist * 0.8}px)`, offset: 0.85 },
            { opacity: 0, transform: `rotate(${angle}deg) translateX(${dist}px)` },
          ],
          {
            duration: (isRainbow ? dur * 1.4 : dur) * 1000,
            easing: "linear",
            fill: "forwards",
          }
        ).onfinish = () => s.remove();
      }, 1800);
    }
  }

  /* ══════════════════════════════════════════════
     5. PIXEL CURSOR TRAIL — Desktop Only
  ══════════════════════════════════════════════ */
  if (window.matchMedia("(pointer:fine)").matches) {
    const TRAIL_COLORS = ["#ffadd6", "#c084fc", "#8dc8ff", "#2dd4bf", "#fbbf24", "#ff7ec0"];
    let lastTime = 0;

    document.addEventListener("mousemove", (e) => {
      const now = Date.now();
      if (now - lastTime < 18 || Math.random() > 0.3) return;
      lastTime = now;

      const el = document.createElement("div");
      el.className = "cursor-pixel";
      const size = Math.random() > 0.6 ? 5 : 3;
      el.style.cssText = [
        `left:${e.clientX + (Math.random() * 6 - 3)}px`,
        `top:${e.clientY + (Math.random() * 6 - 3)}px`,
        `background:${TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)]}`,
        `width:${size}px`,
        `height:${size}px`,
      ].join(";");

      document.body.appendChild(el);
      setTimeout(() => el.remove(), 500);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════
     6. HERO / ABOUT AURORA PARTICLES
  ══════════════════════════════════════════════ */
  const heroWrapper = document.querySelector(".hero-about-wrapper");
  if (heroWrapper) {
    const isMobile = "ontouchstart" in window || window.matchMedia("(pointer:coarse)").matches;
    const HERO_COUNT = isMobile ? 35 : 80;
    const H_COLORS = ["#ffadd6", "#8dc8ff", "#2dd4bf", "#c084fc", "#f4eeff"];
    const hFrag = document.createDocumentFragment();

    for (let i = 0; i < HERO_COUNT; i++) {
      const p = document.createElement("div");
      p.className = "hero-particle";
      const color = H_COLORS[Math.floor(Math.random() * H_COLORS.length)];
      const size = Math.random() > 0.85 ? 5 : 2.5;
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `width:${size}px`,
        `height:${size}px`,
        `background:${color}`,
        `box-shadow:0 0 ${size * 2}px ${color}`,
        `--drift-x:${Math.random() * 100 - 50}px`,
        `--drift-y:-${Math.random() * 250 + 80}px`,
        `--anim-dur:${10 + Math.random() * 25}s`,
        `--anim-delay:-${Math.random() * 25}s`,
        `--max-op:${(Math.random() * 0.5 + 0.5).toFixed(2)}`,
      ].join(";");
      hFrag.appendChild(p);
    }
    heroWrapper.appendChild(hFrag);
  }

});