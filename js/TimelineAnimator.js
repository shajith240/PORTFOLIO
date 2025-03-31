class TimelineAnimator {
    constructor() {
        this.lastScrollY = window.scrollY;
        this.scrollDirection = 'down';
        this.arrows = document.querySelectorAll('.arrow-container');
        this.cards = document.querySelectorAll('.experience-card');
        this.connector = document.querySelector('.timeline-connector');
        this.ticking = false;
        this.init();
    }

    init() {
        this.initScrollDetection();
        this.initIntersectionObserver();
        this.updateArrowStates();
    }

    initScrollDetection() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    const currentScroll = window.scrollY;
                    this.scrollDirection = currentScroll > this.lastScrollY ? 'down' : 'up';
                    this.lastScrollY = currentScroll;
                    this.updateArrowStates();
                    this.updateConnectorVisibility();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    }

    initIntersectionObserver() {
        const options = {
            threshold: [0, 0.2, 0.4, 0.6, 0.8, 1],
            rootMargin: '0px 0px -10% 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    card.classList.add('visible');
                    if (entry.intersectionRatio > 0.6) {
                        card.classList.add('active');
                    }
                } else {
                    card.classList.remove('active');
                    if (entry.boundingClientRect.top > window.innerHeight) {
                        card.classList.remove('visible');
                    }
                }
            });
        }, options);

        this.cards.forEach(card => this.observer.observe(card));
    }

    updateArrowStates() {
        this.arrows.forEach(arrow => {
            arrow.setAttribute('data-scroll', this.scrollDirection);
            this.updateArrowGlow(arrow);
        });
    }

    updateArrowGlow(arrow) {
        const rect = arrow.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = Math.abs(centerY - viewportCenter);
        const maxDistance = window.innerHeight / 3;
        
        if (distance < maxDistance) {
            const intensity = 1 - (distance / maxDistance);
            arrow.style.setProperty('--glow-intensity', intensity.toString());
            arrow.classList.add('glowing');
        } else {
            arrow.classList.remove('glowing');
        }
    }

    updateConnectorVisibility() {
        if (!this.connector) return;
        
        const rect = this.connector.getBoundingClientRect();
        const scrollProgress = Math.max(0, Math.min(1, 
            (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        ));
        
        this.connector.style.opacity = Math.min(1, scrollProgress * 2);
        this.connector.style.transform = `scaleY(${scrollProgress})`;
    }
}

export default TimelineAnimator;


