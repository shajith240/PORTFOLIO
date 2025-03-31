import AnimationController from './js/AnimationController.js';
import TestimonialsCarousel from './js/TestimonialsCarousel.js';

// Custom cursor
const cursor = document.querySelector('.custom-cursor');
let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
    if (!cursorVisible) {
        cursor.style.opacity = 1;
        cursorVisible = true;
    }
    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    cursorVisible = false;
});

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const spans = menuToggle.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('active') ? 'rotate(-45deg) translate(7px, -7px)' : '';
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('skill-progress')) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = `${progress}%`;
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.project-card, .skill-progress, .animate-text').forEach(el => {
    observer.observe(el);
});

// Form validation and interaction
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const showError = (element, message) => {
        const errorDiv = element.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        if (!element.querySelector('.error-message')) {
            element.appendChild(errorDiv);
        }
        element.classList.add('error');
    };

    const removeError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        formGroup.classList.remove('error');
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;

        // Get form elements
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Clear previous errors
        contactForm.querySelectorAll('.form-group').forEach(group => {
            removeError(group.querySelector('input, textarea'));
        });

        // Validate name
        if (!nameInput.value.trim()) {
            showError(nameInput.closest('.form-group'), 'Please enter your name');
            isValid = false;
        }

        // Validate email
        if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
            showError(emailInput.closest('.form-group'), 'Please enter a valid email');
            isValid = false;
        }

        // Validate message
        if (!messageInput.value.trim()) {
            showError(messageInput.closest('.form-group'), 'Please enter your message');
            isValid = false;
        }

        if (isValid) {
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 1500));
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } catch (error) {
                submitBtn.textContent = 'Failed to Send';
                showError(contactForm.querySelector('.form-group:last-child'), error.message);
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        }
    });

    // Remove error on input
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            removeError(input);
        });
    });
}

// Parallax effect
window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero');
        
        parallaxElements.forEach(el => {
            const speed = 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
});
// Timeline animations
const timelineItems = document.querySelectorAll('.timeline-item');

const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Add pulse animation to timeline dot
            const dot = entry.target.querySelector('.timeline-dot');
            dot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 300);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

timelineItems.forEach(item => {
    timelineObserver.observe(item);
});

// Service cards animation
const serviceCards = document.querySelectorAll('.service-card');

const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

serviceCards.forEach(card => {
    serviceObserver.observe(card);
});

// Image loading and error handling
document.addEventListener('DOMContentLoaded', () => {
    const img = document.querySelector('.about-photo img');
    const container = document.querySelector('.about-photo');
    
    if (img && container) {
        // Log detailed information about the image
        console.log({
            'Image element exists': !!img,
            'Current src': img.src,
            'Image complete': img.complete,
            'Natural width': img.naturalWidth,
            'Natural height': img.naturalHeight
        });

        // Handle image loading errors
        img.addEventListener('error', () => {
            img.src = 'path/to/fallback-image.jpg';
            container.classList.add('image-error');
        });

        // Handle successful image load
        img.addEventListener('load', () => {
            container.classList.add('image-loaded');
        });
    }
});

// Project filtering functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects(category) {
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.display = 'block';
                // Force reflow
                card.offsetHeight;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            const category = button.dataset.filter;
            filterProjects(category);
        });
    });
}

// Initialize project filters when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProjectFilters();
});

// Theme Toggle Implementation
function initializeThemeToggle() {
    const themeDots = document.querySelectorAll('.theme-dot');
    
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return 'golden-dark'; // Set golden-dark as default
    };

    const applyTheme = (theme) => {
        // Remove active class from all dots
        themeDots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to selected theme dot
        const activeDot = document.querySelector(`.theme-dot[data-theme="${theme}"]`);
        if (activeDot) {
            activeDot.classList.add('active');
        }

        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('light-theme', 'dark-theme', 'golden-dark-theme');
        document.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
        
        document.documentElement.classList.add('theme-transition');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    };

    // Initial theme setup
    applyTheme(getPreferredTheme());

    // Add click handlers to theme dots
    themeDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const theme = dot.getAttribute('data-theme');
            applyTheme(theme);
        });
    });
}

document.addEventListener('DOMContentLoaded', initializeThemeToggle);

// Project Carousel Implementation
class ProjectCarousel {
    constructor() {
        this.modal = document.getElementById('projectModal');
        this.track = document.getElementById('carouselTrack');
        this.prevButton = document.getElementById('carouselPrev');
        this.nextButton = document.getElementById('carouselNext');
        this.dots = document.getElementById('carouselDots');
        this.closeButton = document.getElementById('modalClose');
        
        this.currentIndex = 0;
        this.slides = [];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.prevButton.addEventListener('click', () => this.slide('prev'));
        this.nextButton.addEventListener('click', () => this.slide('next'));
        this.closeButton.addEventListener('click', () => this.closeModal());
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
            if (e.key === 'ArrowLeft') this.slide('prev');
            if (e.key === 'ArrowRight') this.slide('next');
        });
    }

    openModal(projectData) {
        this.currentIndex = 0;
        this.slides = projectData.images;
        
        // Clear existing content
        this.track.innerHTML = '';
        this.dots.innerHTML = '';
        
        // Create slides
        this.slides.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${image}" alt="Project image ${index + 1}">`;
            this.track.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dots.appendChild(dot);
        });
        
        // Update project details
        this.modal.querySelector('.project-title').textContent = projectData.title;
        this.modal.querySelector('.project-description').textContent = projectData.description;
        this.modal.querySelector('.project-tech-stack').innerHTML = projectData.tech
            .map(tech => `<span>${tech}</span>`).join('');
        
        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        }
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }

    updateCarousel() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Update dots
        const dots = this.dots.getElementsByClassName('carousel-dot');
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
}

// Initialize carousel and add click handlers to project cards
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ProjectCarousel();
    
    // Add click handlers to project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            // Example project data - in real implementation, this could come from a data attribute or API
            const projectData = {
                title: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                tech: Array.from(card.querySelectorAll('.project-tech span'))
                    .map(span => span.textContent),
                images: [
                    card.querySelector('.project-image img').src,
                    'https://picsum.photos/800/600?random=1',
                    'https://picsum.photos/800/600?random=2',
                    'https://picsum.photos/800/600?random=3'
                ]
            };
            
            carousel.openModal(projectData);
        });
    });
});

// Skills Animation
class SkillsAnimation {
    constructor() {
        this.skills = document.querySelectorAll('.skill');
        this.initialized = false;
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.initializeObserver();
    }

    initializeObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                }
            });
        }, this.observerOptions);

        this.skills.forEach(skill => {
            observer.observe(skill);
        });
    }

    animateSkill(skillElement) {
        if (skillElement.classList.contains('visible')) return;
        
        const progress = skillElement.querySelector('.skill-progress');
        const progressValue = progress.getAttribute('data-progress');
        
        // Add visible class to trigger animations
        skillElement.classList.add('visible');
        
        // Animate progress bar
        requestAnimationFrame(() => {
            progress.style.width = `${progressValue}%`;
        });
        
        // Add number counting animation
        const percentageElement = skillElement.querySelector('.skill-percentage');
        this.animateNumber(0, progressValue, 1200, percentageElement);
    }

    animateNumber(start, end, duration, element) {
        const startTimestamp = performance.now();
        
        const updateNumber = (currentTimestamp) => {
            const progress = Math.min((currentTimestamp - startTimestamp) / duration, 1);
            const currentValue = Math.floor(progress * (end - start) + start);
            element.textContent = `${currentValue}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
}

// Initialize skills animation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const skillsAnimation = new SkillsAnimation();
});

// Testimonial Carousel Implementation
document.addEventListener('DOMContentLoaded', () => {
    const testimonialContainer = document.querySelector('.testimonials-container');
    const testimonialTrack = document.querySelector('.testimonials-track');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    let currentIndex = 0;
    let interval;
    
    // Create dots
    testimonials.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
        dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.dot');
    
    // Function to move to a specific slide
    function goToSlide(index) {
        // Ensure index is within bounds
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        
        currentIndex = index;
        
        // Add transition class before updating transform
        testimonialTrack.style.transition = 'transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        testimonialTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        // Update active state of testimonials with slight delay
        testimonials.forEach((testimonial, i) => {
            setTimeout(() => {
                testimonial.classList.toggle('active', i === currentIndex);
            }, i === currentIndex ? 100 : 0);
        });
    }
    
    // Auto advance slides
    function startAutoPlay() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000); // Increase to 5 seconds to give more time to read
    }
    
    // Event Listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoPlay();
        });
    });
    
    // Touch/Swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        if (interval) clearInterval(interval);
    }, { passive: true });
    
    testimonialContainer.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });
    
    testimonialContainer.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) { // Minimum swipe distance
            if (difference > 0) {
                // Swipe left
                goToSlide(currentIndex + 1);
            } else {
                // Swipe right
                goToSlide(currentIndex - 1);
            }
        }
        startAutoPlay();
    });
    
    // Pause on hover
    testimonialContainer.addEventListener('mouseenter', () => {
        if (interval) clearInterval(interval);
    });
    
    testimonialContainer.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    
    // Add transition end handler
    testimonialTrack.addEventListener('transitionend', () => {
        // Reset transition after it completes
        testimonialTrack.style.transition = '';
    });
    
    // Initialize
    goToSlide(0);
    startAutoPlay();
});

// Image lazy loading implementation
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
                
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// Cache management
const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;
const CACHE_ASSETS = [
    '/',
    '/index.html',
    '/assets/main.js',
    '/assets/style.css',
    // Add other critical assets
];

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.error('ServiceWorker registration failed:', err);
            });
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
});

// Export for use in other modules
export { initializeLazyLoading };

// Micro-interactions handler
class MicroInteractions {
    constructor() {
        this.initClickEffects();
        this.initScrollAnimations();
        this.initLoadingStates();
        this.initHoverEffects();
    }

    initClickEffects() {
        document.querySelectorAll('.click-effect').forEach(element => {
            element.addEventListener('click', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                element.style.setProperty('--click-x', `${x}px`);
                element.style.setProperty('--click-y', `${y}px`);
                
                element.classList.remove('active');
                element.offsetWidth; // Force reflow
                element.classList.add('active');
            });
        });
    }

    initScrollAnimations() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.dataset.delay) {
                        entry.target.style.transitionDelay = `${entry.target.dataset.delay}ms`;
                    }
                }
            });
        }, options);

        document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
    }

    initLoadingStates() {
        const loadingElements = document.querySelectorAll('[data-loading]');
        
        loadingElements.forEach(element => {
            const skeleton = document.createElement('div');
            skeleton.classList.add('loading-skeleton');
            skeleton.style.height = `${element.offsetHeight}px`;
            element.parentNode.insertBefore(skeleton, element);
            element.style.display = 'none';
            
            // Simulate loading
            setTimeout(() => {
                skeleton.remove();
                element.style.display = '';
                element.classList.add('fade-in-up');
                setTimeout(() => element.classList.add('visible'), 50);
            }, parseInt(element.dataset.loading) || 1000);
        });
    }

    initHoverEffects() {
        const hoverElements = document.querySelectorAll('.hover-lift, .hover-glow');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-4px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }
}

// Initialize micro-interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MicroInteractions();
});

// Smooth scroll handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll-Bound Animations
class ScrollAnimator {
    constructor() {
        this.elements = [];
        this.windowHeight = window.innerHeight;
        this.scrollY = window.scrollY;
        
        // Bind methods
        this.update = this.update.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        
        // Initialize
        this.init();
    }

    init() {
        // Get all elements with scroll-animate class
        this.elements = Array.from(document.querySelectorAll('.scroll-animate'));
        
        // Set initial positions
        this.elements.forEach(el => {
            el.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            el.startPosition = el.getBoundingClientRect().top + window.scrollY;
        });

        // Add event listeners
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onResize, { passive: true });
        
        // Initial update
        this.update();
    }

    onScroll() {
        this.scrollY = window.scrollY;
        requestAnimationFrame(this.update);
    }

    onResize() {
        this.windowHeight = window.innerHeight;
        this.elements.forEach(el => {
            el.startPosition = el.getBoundingClientRect().top + window.scrollY;
        });
        this.update();
    }

    update() {
        this.elements.forEach(el => {
            const scrollPercent = (this.scrollY + this.windowHeight - el.startPosition) / this.windowHeight;
            
            if (scrollPercent > 0.1) { // Start animation when element is 10% in view
                el.classList.add('active');
                
                // Apply scroll-based transforms if specified
                if (el.hasAttribute('data-scroll-speed')) {
                    const speed = parseFloat(el.getAttribute('data-scroll-speed'));
                    const yOffset = (scrollPercent - 1) * speed;
                    el.style.transform = `translateY(${yOffset}px)`;
                }
                
                if (el.hasAttribute('data-scroll-rotate')) {
                    const rotation = scrollPercent * parseFloat(el.getAttribute('data-scroll-rotate'));
                    el.style.transform = `rotate(${rotation}deg)`;
                }
                
                if (el.hasAttribute('data-scroll-scale')) {
                    const scale = 1 + (scrollPercent - 1) * parseFloat(el.getAttribute('data-scroll-scale'));
                    el.style.transform = `scale(${Math.max(0.5, Math.min(scale, 1))})`;
                }
            } else {
                el.classList.remove('active');
            }
        });
    }

    destroy() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onResize);
    }
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const scrollAnimator = new ScrollAnimator();
});

class ExperienceAnimator {
    constructor() {
        this.init();
    }

    init() {
        const cards = document.querySelectorAll('.experience-card');
        const connector = document.querySelector('.timeline-connector');
        
        if (!cards.length) return;

        const options = {
            root: null,
            threshold: 0.2,
            rootMargin: '-50px'
        };

        let lastScrollPosition = window.scrollY;
        let ticking = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // If it's a card, animate the connector up to this point
                    if (entry.target.classList.contains('experience-card')) {
                        const cards = [...document.querySelectorAll('.experience-card')];
                        const currentIndex = cards.indexOf(entry.target);
                        const progress = (currentIndex + 1) / cards.length;
                        
                        if (connector) {
                            connector.style.setProperty('--progress', `${progress * 100}%`);
                            connector.classList.add('visible');
                        }
                    }
                }
            });
        }, options);

        // Observe each card
        cards.forEach(card => {
            observer.observe(card);
        });

        // Observe the connector
        if (connector) {
            observer.observe(connector);
        }

        // Handle scroll performance
        const onScroll = () => {
            lastScrollPosition = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Additional scroll-based animations can be added here
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ExperienceAnimator();
});

// Initialize AnimationController with custom options if needed
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new AnimationController({
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px',
        repeat: false,
        staggerDelay: 100
    });

    // Make it globally available for dynamic content
    window.animationController = animationController;
});

// Initialize testimonials carousel
document.addEventListener('DOMContentLoaded', () => {
    const testimonials = new TestimonialsCarousel();
});

// GitHub-style Grid Animation
const welcomePattern = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,1,0,0,1,1,1,1,0,0,1,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,1,0,0,0,1,0,0,1,1,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,1,1,0,1,1,0,0,1,0,0],
    [1,0,0,0,1,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,1,0,1,0,0,1,1,1],
    [1,0,1,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,0],
    [0,1,0,1,0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,1,0,0,0,1,0,0,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function getDateString(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function createGrid() {
    const container = document.getElementById('welcomeGrid');
    container.innerHTML = '';
    
    welcomePattern.forEach((row, rowIndex) => {
        const gridRow = document.createElement('div');
        gridRow.className = 'grid-row';
        
        row.forEach((cell, colIndex) => {
            const box = document.createElement('div');
            box.className = cell === 1 ? 'grid-box should-activate' : 'grid-box empty';
            
            // Calculate date and add hover events
            const daysAgo = (rowIndex * row.length + colIndex);
            const dateStr = getDateString(daysAgo);
            
            box.addEventListener('mouseenter', () => {
                const tooltip = document.createElement('div');
                tooltip.className = 'grid-tooltip';
                tooltip.textContent = dateStr;
                box.appendChild(tooltip);
            });
            
            box.addEventListener('mouseleave', () => {
                const tooltip = box.querySelector('.grid-tooltip');
                if (tooltip) tooltip.remove();
            });
            
            gridRow.appendChild(box);
        });
        
        container.appendChild(gridRow);
    });
}

function animateWelcome() {
    const boxes = document.querySelectorAll('.should-activate');
    boxes.forEach((box, index) => {
        const delay = index * 20;
        const randomLevel = Math.floor(Math.random() * 3) + 2; // Levels 2-4 for more visible contrast
        
        setTimeout(() => {
            box.style.background = `var(--box-level-${randomLevel})`;
            box.classList.add('active');
        }, delay);
    });
}

// Initialize grid animation
document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    // Delay animation start to ensure smooth loading
    setTimeout(animateWelcome, 800);
});

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Show button when scrolling down
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { // Show after scrolling 300px
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

// Smooth scroll to top when clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect for custom cursor if it exists
if (cursor) {
    scrollToTopBtn.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
}

// Add hover effect for custom cursor if it exists
if (cursor) {
    scrollToTopBtn.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });

    scrollToTopBtn.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
}

