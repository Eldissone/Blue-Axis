document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Reveals
    // 1. Intersection Observer for Reveals
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // trigger when 10% from bottom
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                // Optional: Stop observing after it's revealed once
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    window.observeScrollElements = () => {
        const revealElements = document.querySelectorAll('.reveal-up:not(.is-revealed), .reveal-stagger-parent:not(.is-revealed), .reveal-text:not(.is-revealed)');
        revealElements.forEach(el => observer.observe(el));
    };

    window.observeScrollElements();

    // 2. Scroll Progress Bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-container';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
});
