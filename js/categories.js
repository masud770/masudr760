document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THEME TOGGLE (UNIFIED) ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    // Load saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        if (themeIcon) themeIcon.classList.replace('ri-moon-line', 'ri-sun-line');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');

            if (themeIcon) {
                isLight ? themeIcon.classList.replace('ri-moon-line', 'ri-sun-line') :
                    themeIcon.classList.replace('ri-sun-line', 'ri-moon-line');
            }
        });
    }

    // --- 2. ROTATING TEXT (TAGLINE) ---
    const taglineElement = document.querySelector('.dynamic-text');
    if (taglineElement) {
        const roles = ["Cyber Security Expert", "CSE Student @ DIU", "AI & NLP Researcher", "Full-Stack Developer"];
        let roleIndex = 0;

        setInterval(() => {
            taglineElement.style.opacity = 0;
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                taglineElement.textContent = roles[roleIndex];
                taglineElement.style.opacity = 1;
            }, 500);
        }, 3000);
    }

    // --- 3. ACTIVE LINK & FADE-UP ANIMATION (MERGED OBSERVER) ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    const fadeElements = document.querySelectorAll('.fade-up');

    const generalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Scroll Spy Logic
            if (entry.target.tagName === 'SECTION' && entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLinks = document.querySelectorAll(`[href="#${entry.target.id}"]`);
                activeLinks.forEach(link => link.classList.add('active'));
            }
            // Fade-up Animation Logic
            if (entry.target.classList.contains('fade-up') && entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(s => generalObserver.observe(s));
    fadeElements.forEach(el => generalObserver.observe(el));


    // --- 4. PROJECT FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => { card.style.display = 'none'; }, 300);
                }
            });
        });
    });
});