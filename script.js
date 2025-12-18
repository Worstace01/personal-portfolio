document.addEventListener('DOMContentLoaded', () => {
    
    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');
    window.onload = () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 800);
        }, 500); // Slight delay for smooth entrance
    };

    // --- CUSTOM CURSOR & MOUSE FOLLOW ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const mouseGlow = document.querySelector('.mouse-glow');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Move Dot (Instant)
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Move Outline (Lagged for smooth effect)
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });

        // Move Background Glow
        mouseGlow.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 2000, fill: "forwards" }); // Slower for ambient feel
    });

    // Cursor Hover Effects
    const hoverLinks = document.querySelectorAll('.hover-link');
    hoverLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
        });
    });

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active'); // Optional: Add animation to X later
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });

    // --- SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;
        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // --- THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) body.classList.add(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light-mode');
        } else {
            localStorage.removeItem('theme');
        }
    });
});