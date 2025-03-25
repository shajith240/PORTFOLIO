class TestimonialsCarousel {
    constructor() {
        this.container = document.querySelector('.testimonials-container');
        this.track = document.querySelector('.testimonials-track');
        this.cards = Array.from(document.querySelectorAll('.testimonial-card'));
        this.dotsContainer = document.querySelector('.testimonial-dots');
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 seconds

        this.init();
    }

    init() {
        this.createControls();
        this.createDots();
        this.setupEventListeners();
        this.updateSlide();
        this.startAutoplay();
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'testimonial-controls';
        
        controls.innerHTML = `
            <button class="testimonial-button prev" aria-label="Previous testimonial">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6"/>
                </svg>
            </button>
            <button class="testimonial-button next" aria-label="Next testimonial">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>
        `;

        this.container.parentElement.appendChild(controls);
    }

    createDots() {
        this.cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `testimonial-dot${index === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
            this.dotsContainer.appendChild(dot);
        });
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.testimonial-button.prev').addEventListener('click', () => {
            this.navigate('prev');
        });

        document.querySelector('.testimonial-button.next').addEventListener('click', () => {
            this.navigate('next');
        });

        // Dots navigation
        this.dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('testimonial-dot')) {
                const newIndex = Array.from(this.dotsContainer.children).indexOf(e.target);
                this.goToSlide(newIndex);
            }
        });

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            this.pauseAutoplay();
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            touchEndX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.navigate('next');
                } else {
                    this.navigate('prev');
                }
            }
            this.startAutoplay();
        });

        // Pause autoplay on hover
        this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }

    navigate(direction) {
        this.currentIndex = direction === 'next' 
            ? (this.currentIndex + 1) % this.cards.length
            : (this.currentIndex - 1 + this.cards.length) % this.cards.length;

        this.updateSlide();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
    }

    updateSlide() {
        // Update track position
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        // Update active states
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });

        // Update dots
        const dots = this.dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        this.pauseAutoplay();
        this.autoplayInterval = setInterval(() => {
            this.navigate('next');
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

export default TestimonialsCarousel;