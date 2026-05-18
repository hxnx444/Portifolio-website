

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('#about');
    const heroTitle = document.querySelector('#hero h1');
    const navLinks = document.querySelectorAll('.nav-links a');
    const projectCards = document.querySelectorAll('.project-card');
    const starsEl = document.getElementById('stars');

    // Mobile menu elements
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            const willExpand = !isExpanded;
            menuToggle.setAttribute('aria-expanded', willExpand);
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');

            // Animate using max-height for smooth open/close
            if (navLinksContainer.classList.contains('active')) {
                const sh = navLinksContainer.scrollHeight;
                navLinksContainer.style.maxHeight = sh + 'px';
            } else {
                navLinksContainer.style.maxHeight = '0px';
            }
        });

        // Remove inline max-height after opening to allow responsiveness
        navLinksContainer.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'max-height') return;
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.style.maxHeight = '';
            }
        });
    }

    if (starsEl) {
        for (let i = 0; i < 80; i++) {
            const s = document.createElement('div');
            s.className = 'star';
            s.style.left = Math.random() * 100 + '%';
            s.style.top = Math.random() * 85 + '%';
            s.style.animationDelay = (Math.random() * 3) + 's';
            s.style.animationDuration = (2 + Math.random() * 3) + 's';
            if (Math.random() > 0.85) {
                s.style.width = s.style.height = '4px';
                s.style.background = '#a78bfa';
            }
            starsEl.appendChild(s);
        }
    }

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            const skillsSection = document.getElementById('skills');
            const contactSection = document.getElementById('contact');
            let makeNavy = false;

            const navRect = navbar.getBoundingClientRect();
            const navCenter = navRect.top + (navRect.height / 2);

            if (skillsSection && skillsSection.getBoundingClientRect().top <= navCenter && skillsSection.getBoundingClientRect().bottom >= navCenter) {
                makeNavy = true;
            }
            
            if (contactSection && !makeNavy && contactSection.getBoundingClientRect().top <= navCenter && contactSection.getBoundingClientRect().bottom >= navCenter) {
                makeNavy = true;
            }

            navbar.classList.toggle('navy-nav', makeNavy);

            // Update active nav link based on scroll position
            let current = '';
            document.querySelectorAll('section[id]').forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
                if (current && a.getAttribute('href') === `#${current}`) {
                    a.classList.add('active');
                }
            });
        });
    }

    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Close mobile menu if open when a link is clicked
            if (menuToggle && menuToggle.classList.contains('is-active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-active');
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                    navLinksContainer.style.maxHeight = '0px';
                }
            }

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - navHeight;

                    // Update URL hash without jumping to fix back button behavior
                    history.pushState(null, null, targetId);
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    return;
                }

                // If the section doesn't exist on this page, navigate to index.html with the hash
                const homeUrl = './index.html' + targetId;
                window.location.href = homeUrl;
            }
        });
    });

    // If page loaded with a hash, scroll to it after initial animations
    if (window.location.hash) {
        const hash = window.location.hash;
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const offset = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        }, 450);
    }

    // Add click interaction for project cards (better for mobile users)
    if (projectCards) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from other cards if you want only one open at a time
                // projectCards.forEach(c => c !== card && c.classList.remove('active'));
                card.classList.toggle('active');
            });
        });
    }


    // Trigger scroll event on load to set initial nav state
    window.dispatchEvent(new Event('scroll'));
    // ── Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});