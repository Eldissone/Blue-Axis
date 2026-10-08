const currentYear = String(new Date().getFullYear());
document.querySelectorAll('#ano, #ano-footer').forEach((yearElement) => {
    yearElement.textContent = currentYear;
});

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

// Keep the header stable while scrolling and restore its original state at the top.
const siteHeader = document.querySelector('.site-header');

if (siteHeader) {
    const updateHeaderState = () => {
        siteHeader.classList.toggle('is-pinned', window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
}

// Hero carousel
window.initCarousel = function() {
    let heroCarousel = document.querySelector('.hero-carousel');

    if (heroCarousel) {
        // Clone to wipe all previous event listeners
        const newHeroCarousel = heroCarousel.cloneNode(true);
        heroCarousel.parentNode.replaceChild(newHeroCarousel, heroCarousel);
        heroCarousel = newHeroCarousel; // Update reference

        const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
        const textSlides = Array.from(heroCarousel.querySelectorAll('.hero-copy-slide'));
        const dots = Array.from(heroCarousel.querySelectorAll('.hero-carousel-dot'));
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let activeIndex = 0;
        
        if (window.heroAutoplayId) {
            window.clearInterval(window.heroAutoplayId);
        }

        const showSlide = (nextIndex) => {
            if (nextIndex === activeIndex || !slides[nextIndex]) return;

            const previousSlide = slides[activeIndex];
            const nextSlide = slides[nextIndex];

            if (previousSlide) {
                previousSlide.classList.remove('is-active');
                previousSlide.classList.add('is-leaving');
                window.setTimeout(() => previousSlide.classList.remove('is-leaving'), 1250);
            }

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

            if (dots[activeIndex]) {
                dots[activeIndex].classList.remove('is-active');
                dots[activeIndex].setAttribute('aria-current', 'false');
            }
            if (dots[nextIndex]) {
                dots[nextIndex].classList.add('is-active');
                dots[nextIndex].setAttribute('aria-current', 'true');
            }
            activeIndex = nextIndex;
        };

        const stopAutoplay = () => {
            window.clearInterval(window.heroAutoplayId);
            window.heroAutoplayId = undefined;
        };

        const startAutoplay = () => {
            if (reduceMotion.matches || window.heroAutoplayId) return;
            window.heroAutoplayId = window.setInterval(() => {
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
        
        // We only add global listeners once
        if (!window.hasHeroGlobalListeners) {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) stopAutoplay();
                else startAutoplay();
            });
            reduceMotion.addEventListener('change', () => {
                stopAutoplay();
                startAutoplay();
            });
            window.hasHeroGlobalListeners = true;
        }

        startAutoplay();
    }
};

window.initCarousel();

// Custom Alert/Toast Notification System
window.showAlert = function(message, type = 'info') {
    let container = document.getElementById('alert-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'alert-toast-container';
        container.style.cssText = 'position: fixed; bottom: 32px; right: 32px; z-index: 99999; display: flex; flex-direction: column; gap: 12px; pointer-events: none;';
        document.body.appendChild(container);
    }
    
    const isError = message.toLowerCase().includes('erro');
    const borderColor = isError ? '#BA1A1A' : '#005A9C';
    const iconName = isError ? 'error' : 'check_circle';
    const iconColor = isError ? '#BA1A1A' : '#005A9C';
    
    const toast = document.createElement('div');
    toast.style.cssText = `background: white; border-radius: 16px; padding: 16px 24px 16px 20px; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.15); border-left: 6px solid ${borderColor}; transform: translateY(150%) scale(0.9); opacity: 0; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); display: flex; align-items: center; justify-content: space-between; gap: 16px; pointer-events: auto; min-width: 300px;`;
    
    toast.innerHTML = `
        <div style="display: flex; items-center: center; gap: 12px;">
            <span class="material-symbols-outlined" style="color: ${iconColor}; font-size: 24px;" style="font-variation-settings: 'FILL' 1;">${iconName}</span>
            <span style="color: #1a202c; font-weight: 600; font-family: 'Manrope', sans-serif; font-size: 15px; line-height: 1.4;">${message}</span>
        </div>
        <button style="background: none; border: none; cursor: pointer; color: #a0aec0; padding: 4px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'; this.style.color='#4a5568'" onmouseout="this.style.background='transparent'; this.style.color='#a0aec0'">
            <span class="material-symbols-outlined" style="font-size: 20px;">close</span>
        </button>
    `;
    
    const closeBtn = toast.querySelector('button');
    const close = () => {
        toast.style.transform = 'translateY(150%) scale(0.9)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    };
    closeBtn.onclick = close;
    
    container.appendChild(toast);
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.style.transform = 'translateY(0) scale(1)';
            toast.style.opacity = '1';
        });
    });
    
    setTimeout(close, 4500);
};

// Override native alert globally
window.alert = function(msg) {
    window.showAlert(msg);
};
