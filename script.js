document.addEventListener('DOMContentLoaded', () => {
    
    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 800);
            }
        }, 300);
    });

    // --- MOUSE FOLLOW & CURSOR (rAF Lerp Loop) ---
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    const mouseGlow = document.querySelector('.mouse-glow');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const renderCursor = () => {
        // Linear Interpolation (Lerp) for ultra-smooth movement
        outlineX += (mouseX - outlineX) * 0.25;
        outlineY += (mouseY - outlineY) * 0.25;

        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }

        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }

        if (mouseGlow) {
            mouseGlow.style.left = `${glowX}px`;
            mouseGlow.style.top = `${glowY}px`;
        }

        requestAnimationFrame(renderCursor);
    };

    // Start cursor loop
    requestAnimationFrame(renderCursor);

    // Cursor Hover Effects
    const hoverLinks = document.querySelectorAll('.hover-link, a, button, .card');
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

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on Escape key press
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- HIGH-PERFORMANCE INTERSECTION OBSERVER FOR SCROLL REVEAL ---
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(reveal => revealObserver.observe(reveal));
    } else {
        // Fallback for legacy browsers
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            reveals.forEach(reveal => {
                const elementTop = reveal.getBoundingClientRect().top;
                if (elementTop < windowHeight - 100) {
                    reveal.classList.add('active');
                }
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll();
    }

    // --- INTERACTIVE PROJECT MODAL HANDLER ---
    const projectModal = document.getElementById('project-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalVideo = document.getElementById('modal-video');
    const videoFallbackCard = document.getElementById('video-fallback-card');
    const fallbackRepoBtn = document.getElementById('fallback-repo-btn');
    const modalBadgeText = document.getElementById('modal-badge-text');
    const modalTitle = document.getElementById('modal-title');
    const modalExternalLink = document.getElementById('modal-external-link');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalCloseBtn = document.getElementById('modal-close');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    if (projectModal) {
        openModalBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const title = btn.getAttribute('data-project-title');
                const demoType = btn.getAttribute('data-demo-type') || 'web';
                const videoUrl = btn.getAttribute('data-video-url');
                const projectUrl = btn.getAttribute('data-project-url');
                const githubUrl = btn.getAttribute('data-github-url');

                if (modalTitle) modalTitle.textContent = title || 'Live App Preview';
                if (modalExternalLink) modalExternalLink.href = projectUrl || '#';
                if (modalGithubLink) modalGithubLink.href = githubUrl || '#';
                if (fallbackRepoBtn) fallbackRepoBtn.href = githubUrl || '#';

                // Reset elements
                if (modalIframe) modalIframe.style.display = 'none';
                if (modalVideo) modalVideo.style.display = 'none';
                if (videoFallbackCard) videoFallbackCard.style.display = 'none';

                if (demoType === 'video') {
                    if (modalBadgeText) modalBadgeText.textContent = 'Video Demo Showcase';
                    if (videoUrl && videoUrl.trim() !== '') {
                        if (modalVideo) {
                            modalVideo.src = videoUrl;
                            modalVideo.style.display = 'block';
                        }
                    } else {
                        if (videoFallbackCard) videoFallbackCard.style.display = 'flex';
                    }
                } else {
                    if (modalBadgeText) modalBadgeText.textContent = 'Live Web App';
                    if (modalIframe) {
                        modalIframe.src = projectUrl || 'about:blank';
                        modalIframe.style.display = 'block';
                    }
                }

                projectModal.classList.add('active');
                projectModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            projectModal.classList.remove('active');
            projectModal.setAttribute('aria-hidden', 'true');
            if (modalIframe) modalIframe.src = 'about:blank';
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.src = '';
            }
            document.body.style.overflow = '';
        };

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeModal);
        }

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && projectModal.classList.contains('active')) {
                closeModal();
            }
        });
    }


    // --- THEME TOGGLE ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        body.classList.add(currentTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light-mode');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }
});
