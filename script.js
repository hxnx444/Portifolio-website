

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const aboutSection = document.querySelector('#about');
    const heroTitle = document.querySelector('#hero h1');
    const navLinks = document.querySelectorAll('.nav-links a');
    const projectCards = document.querySelectorAll('.project-card');
    const starsEl = document.getElementById('stars');

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
            
          
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const navHeight = navbar ? navbar.offsetHeight : 0;
                   
                    const elementPosition = targetSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - navHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

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
});