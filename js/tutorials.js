// ================= TUTORIALS PAGE JAVASCRIPT - Smooth Scroll & ScrollSpy =================

document.addEventListener('DOMContentLoaded', () => {
    initDate();
    initScrollReveal();
    initAnchors();
    initScrollSpy();
});

// Set Current Date
function initDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Reveal animation (basic)
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((r, i) => setTimeout(() => r.classList.add('active'), i * 100));
}

// Smooth scrolling for anchor links in sidebar
function initAnchors() {
    const links = document.querySelectorAll('.sidebar-links a[href^="#tutorial-"], .sidebar-links a[href="#main-tutorials"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90; // account for navbar
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                    // update focus for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: true });
                } else if (href === '#main-tutorials') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
    });
}

// ScrollSpy using IntersectionObserver
function initScrollSpy() {
    const sections = document.querySelectorAll('.tutorial-card');
    const navLinks = document.querySelectorAll('.sidebar-links a');
    const idToLink = {};

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#tutorial-')) {
            idToLink[href.slice(1)] = link;
        }
    });

    const obsOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const associatedLink = idToLink[id];

            if (entry.isIntersecting) {
                // clear all active
                document.querySelectorAll('.sidebar-links a.active').forEach(a => a.classList.remove('active'));
                if (associatedLink) associatedLink.classList.add('active');
            }
        });
    }, obsOptions);

    sections.forEach(s => observer.observe(s));
}

// Debug
console.log('✅ Tutorials enhancements loaded');
console.log(`📚 Tutorials on page: ${document.querySelectorAll('.tutorial-card').length}`);
