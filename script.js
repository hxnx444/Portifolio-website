

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
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
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
        });
    }

    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hero-content, .about-glass-box, .skills-container, .page-header, .project-card, .contact-box');
    hiddenElements.forEach(el => {
        el.classList.add('hidden');
        scrollObserver.observe(el);
    });

  
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Close mobile menu if open when a link is clicked
            if (menuToggle && menuToggle.classList.contains('is-active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-active');
                if (navLinksContainer) navLinksContainer.classList.remove('active');
            }

            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - navHeight;

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    return;
                }

                // If the section doesn't exist on this page, navigate to index.html with the hash
                const homeUrl = './index.html' + targetId;
                document.body.classList.add('fade-out');
                setTimeout(() => { window.location.href = homeUrl; }, 300);
            }
        });
    });

    // Observe sections to update active nav link
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (entry.isIntersecting) {
                if (link) link.classList.add('active');
            } else {
                if (link) link.classList.remove('active');
            }
        });
    }, { threshold: 0.45 });

    // Register sections for observation (only those that have nav links)
    document.querySelectorAll('section[id]').forEach(sec => {
        const hasNav = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (hasNav) sectionObserver.observe(sec);
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

    
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        const type = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(type, 100); 
            }
        };
        setTimeout(type, 500); 
    }

    // Smooth Page Transitions
    const transitionLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto:"]):not([target="_blank"]):not([download])');
    
    transitionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.href;
            
            document.body.classList.add('fade-out');
            
            setTimeout(() => {
                window.location.href = target;
            }, 400); // Matches the CSS transition duration
        });
    });
});

// Handle back button caching (BFCache)
window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('fade-out')) {
        document.body.classList.remove('fade-out');
    }
});