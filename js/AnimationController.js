class AnimationController {
    constructor(options = {}) {
        this.options = {
            threshold: options.threshold || 0.2,
            rootMargin: options.rootMargin || '0px 0px -100px 0px',
            staggerDelay: options.staggerDelay || 100
        };

        this.observerOptions = {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
        };

        this.init();
    }

    init() {
        // Main observer for individual elements
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );

        // Initialize animations
        this.initializeAnimations();
        
        // Handle dynamic content
        this.setupMutationObserver();
    }

    initializeAnimations() {
        // Handle individual animated elements
        document.querySelectorAll('[data-animate]').forEach(element => {
            // Store the original animation type
            element.dataset.animationType = element.dataset.animate;
            this.observer.observe(element);
        });

        // Handle staggered animations
        document.querySelectorAll('[data-stagger]').forEach(parent => {
            const children = Array.from(parent.children);
            children.forEach((child, index) => {
                // Store the stagger index for consistent delay on re-entry
                child.dataset.staggerIndex = index;
                child.dataset.animationType = child.dataset.animate || 'fade-up';
                child.style.transitionDelay = `${index * this.options.staggerDelay}ms`;
                this.observer.observe(child);
            });
        });
    }

    handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.animateElement(entry.target);
            } else {
                this.resetElement(entry.target);
            }
        });
    }

    animateElement(element) {
        requestAnimationFrame(() => {
            // Reset any existing animations
            element.classList.remove('animate-visible');
            element.style.animation = 'none';
            element.offsetHeight; // Force reflow

            // Apply animation
            element.classList.add('animate-visible');
            
            // Apply specific animation type
            const animationType = element.dataset.animationType;
            if (animationType) {
                element.style.animation = this.getAnimationStyle(animationType);
            }

            // Apply stagger delay if present
            if (element.dataset.staggerIndex) {
                element.style.animationDelay = `${element.dataset.staggerIndex * this.options.staggerDelay}ms`;
            }
        });

        // Handle any custom callbacks
        const onComplete = element.getAttribute('data-animate-complete');
        if (onComplete && window[onComplete]) {
            const duration = this.getTransitionDuration(element);
            setTimeout(() => {
                window[onComplete](element);
            }, duration);
        }
    }

    resetElement(element) {
        element.classList.remove('animate-visible');
        element.style.animation = 'none';
        element.style.opacity = '0';
        element.style.transform = this.getInitialTransform(element.dataset.animationType);
    }

    getAnimationStyle(type) {
        const duration = '0.8s';
        const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';
        
        switch (type) {
            case 'fade-up':
                return `fadeInUp ${duration} ${easing} forwards`;
            case 'fade-down':
                return `fadeInDown ${duration} ${easing} forwards`;
            case 'fade-left':
                return `fadeInLeft ${duration} ${easing} forwards`;
            case 'fade-right':
                return `fadeInRight ${duration} ${easing} forwards`;
            case 'zoom-in':
                return `zoomIn ${duration} ${easing} forwards`;
            default:
                return `fadeIn ${duration} ${easing} forwards`;
        }
    }

    getInitialTransform(type) {
        switch (type) {
            case 'fade-up':
                return 'translateY(50px)';
            case 'fade-down':
                return 'translateY(-50px)';
            case 'fade-left':
                return 'translateX(-50px)';
            case 'fade-right':
                return 'translateX(50px)';
            case 'zoom-in':
                return 'scale(0.95)';
            default:
                return 'translateY(0)';
        }
    }

    getTransitionDuration(element) {
        const duration = getComputedStyle(element).animationDuration;
        return parseFloat(duration) * 1000; // Convert to milliseconds
    }

    setupMutationObserver() {
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.hasAttribute('data-animate')) {
                            node.dataset.animationType = node.dataset.animate;
                            this.observer.observe(node);
                        }
                        // Check children for animated elements
                        node.querySelectorAll('[data-animate]').forEach(element => {
                            element.dataset.animationType = element.dataset.animate;
                            this.observer.observe(element);
                        });
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    refresh() {
        this.initializeAnimations();
    }
}

export default AnimationController;
