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

// --- GLOBAL UTILITIES (Kept outside DOMContentLoaded for easy HTML access) ---

// Reusable Copy Function
function copyToClipboard(text, elementSelector, cssClass = 'copied') {
    navigator.clipboard.writeText(text).then(() => {
        const el = document.querySelector(elementSelector);
        if (el) {
            el.classList.add(cssClass);
            setTimeout(() => el.classList.remove(cssClass), 2000);
        }
    });
}

// Update your HTML buttons to use these simpler calls:
function copyEmail() { copyToClipboard('contact@masud.aio.bd', '.email-wrapper'); }

function copyFooterEmail() { copyToClipboard('contact@masud.aio.bd', '.footer-contact-item'); }

// --- CERTIFICATE MODAL ---
function openCert(imgSrc) {
    const modal = document.getElementById("cert-modal");
    const modalImg = document.getElementById("cert-img");
    if (modal && modalImg) {
        modal.style.display = "block";
        modalImg.src = imgSrc;
        document.body.style.overflow = "hidden";
    }
}

function closeCert() {
    document.getElementById("cert-modal").style.display = "none";
    document.body.style.overflow = "auto";
}

// --- FORM HANDLING ---
async function handleFormSubmission(event) {
    event.preventDefault(); // Stop page reload

    const form = event.target;
    const btn = document.getElementById('form-submit-btn');
    const feedback = document.getElementById('form-feedback');
    const btnText = btn.querySelector('span');

    // 1. Set Loading State
    btn.disabled = true;
    btnText.innerText = "Sending...";
    feedback.style.display = "none";

    // 2. Prepare Data
    const formData = new FormData(form);

    // Add a custom subject for your email inbox
    const now = new Date();
    const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    formData.append('_subject', `Portfolio Message from ${formData.get('name')} [${timestamp}]`);
    formData.append('_replyto', formData.get('email'));

    try {
        // 3. Post to FormSubmit
        const endpoint = form.action || "https://formsubmit.co/ajax/contact@masud.aio.bd";
        const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Form submission failed.');
        }

        // Success Logic
        feedback.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Message sent successfully!';
        feedback.className = "form-feedback success";
        feedback.style.display = "block";
        form.reset();
    } catch (error) {
        console.error('Form submission failed:', error);
        // Error Logic
        feedback.innerHTML = '<i class="ri-error-warning-fill"></i> Oops! Something went wrong.';
        feedback.className = "form-feedback error";
        feedback.style.display = "block";
    } finally {
        // 4. Reset Button State
        btn.disabled = false;
        btnText.innerText = "Send Message";
    }
}
document.querySelector('.scroll-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

function copyContactEmail(element) {
    // 1. Get the email text from the p tag inside the clicked card
    const emailText = document.getElementById('contact-email-val').innerText;

    // 2. Use the Clipboard API
    navigator.clipboard.writeText(emailText).then(() => {
        // 3. Add the 'copied' class to show the toast
        element.classList.add('copied');

        // 4. Reset after 2 seconds
        setTimeout(() => {
            element.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // Basic Fade-In for Hero Elements
    const heroElements = document.querySelectorAll('.hero-content, .hero-visual');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 * index);
    });

    // Optional Parallax for Photo
    document.addEventListener('mousemove', (e) => {
        const photo = document.querySelector('.hero-photo');
        if (!photo) return;
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        photo.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});