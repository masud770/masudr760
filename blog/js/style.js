/* ============================================================
   KAWSHIK BLOG - CORE UI LOGIC (style.js)
   Includes: Theme Toggle, Rotating Tagline, & Scroll Animations
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       1. THEME TOGGLE LOGIC
    =============================== */
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const body = document.body;

    // Check for saved user preference
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        body.classList.add("light-mode");
        if (themeIcon) themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            body.classList.toggle("light-mode");
            const isLight = body.classList.contains("light-mode");
            
            // Save preference
            localStorage.setItem("theme", isLight ? "light" : "dark");
            
            // Update Icon
            if (themeIcon) {
                if (isLight) themeIcon.classList.replace("ri-moon-line", "ri-sun-line");
                else themeIcon.classList.replace("ri-sun-line", "ri-moon-line");
            }
        });
    }

    /* ===============================
       2. ROTATING TAGLINE
    =============================== */
    const tagline = document.querySelector(".dynamic-text");
    if (tagline) {
        const roles = ["Cyber Security Expert", "CSE Student @ DIU", "AI & NLP Researcher", "Full-Stack Developer"];
        let i = 0;
        setInterval(() => {
            tagline.style.opacity = 0; // Fade out
            setTimeout(() => {
                i = (i + 1) % roles.length;
                tagline.textContent = roles[i];
                tagline.style.opacity = 1; // Fade in
            }, 400);
        }, 3000);
    }

    /* ===============================
       3. SCROLL ANIMATIONS (FADE-UP)
    =============================== */
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                // Optional: Stop observing once visible to improve performance
                // observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Initial check for elements with .fade-up class
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
});