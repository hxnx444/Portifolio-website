

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const skillsSection = document.querySelector('#skills');
    const heroTitle = document.querySelector('#hero h1');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserverOptions = {
        root: null,
        threshold: 0,
        rootMargin: "-100px 0px 0px 0px" 
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
         
            const shouldBeScrolled = entry.isIntersecting || entry.boundingClientRect.top < 100;
            navbar.classList.toggle('scrolled', shouldBeScrolled);
        });
    }, navObserverOptions);

    if (navbar && skillsSection) {
        navObserver.observe(skillsSection);
    }

    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.hero-content, .abt, .skills-container, .project-card, .contact-box');
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