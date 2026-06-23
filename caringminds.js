document.addEventListener("DOMContentLoaded", () => {

    initRevealAnimations();
    initSmoothScrolling();
    initActiveNavigation();
    initNavbarEffects();
    initImpactCounters();
    initMobileMenu();

});


/* ==========================================
   REVEAL ON SCROLL
========================================== */

function initRevealAnimations() {

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elements = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
        elements.forEach(el => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });
        },
        {
            threshold: 0.15
        }
    );

    elements.forEach(el => observer.observe(el));
}


/* ==========================================
   SMOOTH SCROLLING
========================================== */

function initSmoothScrolling() {

    const navHeight =
        document.querySelector("nav")?.offsetHeight || 80;

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", e => {

                const href = link.getAttribute("href");

                if (href === "#") return;

                const target = document.querySelector(href);

                if (!target) return;

                e.preventDefault();

                const position =
                    target.offsetTop - navHeight - 10;

                window.scrollTo({
                    top: position,
                    behavior: "smooth"
                });

            });

        });
}


/* ==========================================
   ACTIVE NAVIGATION
========================================== */

function initActiveNavigation() {

    const sections = document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(".nav-links a");

    function updateActiveLink() {

        let currentSection = "";

        sections.forEach(section => {

            const top = section.offsetTop - 150;
            const height = section.offsetHeight;

            if (
                window.scrollY >= top &&
                window.scrollY < top + height
            ) {
                currentSection = section.id;
            }

        });

        navLinks.forEach(link => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                `#${currentSection}`
            ) {
                link.classList.add("active");
            }

        });

    }

    window.addEventListener("scroll", updateActiveLink);

    updateActiveLink();
}


/* ==========================================
   NAVBAR EFFECTS
========================================== */

function initNavbarEffects() {

    const nav = document.querySelector("nav");

    function updateNavbar() {

        if (window.scrollY > 50) {

            nav.style.background =
                "rgba(250,247,242,0.98)";

            nav.style.boxShadow =
                "0 8px 30px rgba(0,0,0,0.06)";

        } else {

            nav.style.background =
                "rgba(250,247,242,0.85)";

            nav.style.boxShadow = "none";
        }

    }

    window.addEventListener("scroll", updateNavbar);

    updateNavbar();
}


/* ==========================================
   IMPACT COUNTERS
========================================== */

function initImpactCounters() {

    const numbers =
        document.querySelectorAll(".impact-number");

    if (!numbers.length) return;

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                animateCounter(entry.target);

                observer.unobserve(entry.target);

            });

        },
        {
            threshold: 0.3
        }
    );

    numbers.forEach(num => observer.observe(num));
}


function animateCounter(element) {

    const originalText = element.textContent.trim();

    let target = parseFloat(
        originalText.replace(/[^\d.]/g, "")
    );

    if (isNaN(target)) return;

    const duration = 1800;

    const startTime = performance.now();

    function update(currentTime) {

        const elapsed =
            currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);

        const eased =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            target * eased;

        if (originalText.includes(".")) {

            element.innerHTML =
                currentValue.toFixed(1);

        } else {

            element.innerHTML =
                Math.floor(currentValue);

        }

        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.innerHTML = originalText;

        }

    }

    requestAnimationFrame(update);
}


/* ==========================================
   MOBILE MENU
========================================== */

function initMobileMenu() {

    const button =
        document.querySelector(".mobile-menu-btn");

    const menu =
        document.querySelector(".nav-links");

    if (!button || !menu) return;

    button.addEventListener("click", () => {

        menu.classList.toggle("mobile-open");

        button.classList.toggle("active");

    });

}


/* ==========================================
   OPTIONAL PARALLAX FOR HERO BLOBS
========================================== */

function initParallax() {

    const blobs = document.querySelectorAll(
        ".blob-1, .blob-2, .blob-3"
    );

    if (!blobs.length) return;

    window.addEventListener("mousemove", e => {

        const x =
            (e.clientX / window.innerWidth - 0.5);

        const y =
            (e.clientY / window.innerHeight - 0.5);

        blobs.forEach((blob, index) => {

            const strength =
                (index + 1) * 8;

            blob.style.transform =
                `translate(${x * strength}px,
                           ${y * strength}px)`;

        });

    });

}