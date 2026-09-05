document.getElementById("ano").textContent = String(new Date().getFullYear());

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
        
        // Toggle icon between menu and close
        const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.textContent = 'menu';
            } else {
                icon.textContent = 'close';
            }
        }
    });
}

// Hero carousel
const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const textSlides = Array.from(heroCarousel.querySelectorAll('.hero-copy-slide'));
    const dots = Array.from(heroCarousel.querySelectorAll('.hero-carousel-dot'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let activeIndex = 0;
    let autoplayId;

    const showSlide = (nextIndex) => {
        if (nextIndex === activeIndex || !slides[nextIndex]) return;

        const previousSlide = slides[activeIndex];
        const nextSlide = slides[nextIndex];

        previousSlide.classList.remove('is-active');
        previousSlide.classList.add('is-leaving');
        window.setTimeout(() => previousSlide.classList.remove('is-leaving'), 1250);

        nextSlide.classList.remove('is-leaving');
        window.requestAnimationFrame(() => nextSlide.classList.add('is-active'));

        const previousText = textSlides[activeIndex];
        const nextText = textSlides[nextIndex];
        if (previousText && nextText) {
            previousText.classList.remove('is-active');
            previousText.classList.add('is-leaving');
            window.setTimeout(() => previousText.classList.remove('is-leaving'), 800);

            nextText.classList.remove('is-leaving');
            window.requestAnimationFrame(() => nextText.classList.add('is-active'));
        }

        dots[activeIndex].classList.remove('is-active');
        dots[activeIndex].setAttribute('aria-current', 'false');
        dots[nextIndex].classList.add('is-active');
        dots[nextIndex].setAttribute('aria-current', 'true');
        activeIndex = nextIndex;
    };

    const stopAutoplay = () => {
        window.clearInterval(autoplayId);
        autoplayId = undefined;
    };

    const startAutoplay = () => {
        if (reduceMotion.matches || autoplayId) return;
        autoplayId = window.setInterval(() => {
            showSlide((activeIndex + 1) % slides.length);
        }, 6500);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay();
        });
    });

    heroCarousel.addEventListener('mouseenter', stopAutoplay);
    heroCarousel.addEventListener('mouseleave', startAutoplay);
    heroCarousel.addEventListener('focusin', stopAutoplay);
    heroCarousel.addEventListener('focusout', () => {
        if (!heroCarousel.contains(document.activeElement)) startAutoplay();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay();
        else startAutoplay();
    });
    reduceMotion.addEventListener('change', () => {
        stopAutoplay();
        startAutoplay();
    });

    startAutoplay();
}
